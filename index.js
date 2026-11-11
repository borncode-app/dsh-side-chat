import z from '@deepseek-ai/schemastery'

/** How the side assistant is told what it is for. */
const ROLE_PROMPT = [
  'You are a side assistant beside another conversation in this workspace.',
  'The MAIN CONVERSATION TRANSCRIPT below is that conversation: the user\'s requests, the agent\'s answers, and the tools it called.',
  'Answer my questions about it: what the session is doing, which steps are finished, and what is left.',
  'Answer only from that transcript, and say plainly when something is not in it.',
  'Keep answers short. Reply in the language I ask in.',
].join(' ')

export const Config = z.object({
  /** Path the Web GUI posts to. */
  endpoint: z.string().default('/plugins/side-chat'),
  /** Provider used when the request names none. */
  provider: z.string(),
  /** Model used when the request names none. */
  model: z.string(),
  /** Characters of transcript shared with the side assistant. */
  maxChars: z.number().default(48000),
  /** Characters kept per message before the transcript is trimmed further. */
  maxMessageChars: z.number().default(4000),
})

/**
 * Host half of the side chat.
 *
 * Every service is reached through `ctx.inject`/`ctx.get` instead of the
 * entry's own `inject` list, so a missing service degrades to "no side chat"
 * instead of failing the profile boot.
 */
export const inject = []

/** Cut a value to a character budget, marking the elision. */
function clip(text, limit) {
  if (text.length <= limit) return text
  return `${text.slice(0, limit)}…`
}

/** One message's visible text, with tool calls reduced to one line each. */
function messageText(message, limit) {
  const parts = []
  const content = message.content
  if (typeof content === 'string') {
    parts.push(content)
  } else if (Array.isArray(content)) {
    for (const block of content) {
      if (block === null || typeof block !== 'object') continue
      if (block.type === 'text' && typeof block.text === 'string') {
        parts.push(block.text)
        continue
      }
      if (block.type === 'reasoning' && typeof block.text === 'string') continue
      if (block.type === 'tool-call') {
        const name = typeof block.name === 'string' ? block.name : 'tool'
        const args = typeof block.arguments === 'string' ? block.arguments : JSON.stringify(block.arguments ?? {})
        parts.push(`[called ${name} ${clip(args ?? '', 240)}]`)
        continue
      }
      if (block.type === 'tool-result') {
        const text = typeof block.text === 'string' ? block.text : JSON.stringify(block.result ?? '')
        parts.push(`[tool result ${clip(text ?? '', 400)}]`)
      }
    }
  }
  const joined = parts.join('\n').trim()
  return clip(joined, limit)
}

/** The label one message's role is shown under in the transcript. */
function roleLabel(role) {
  if (role === 'user') return 'USER'
  if (role === 'assistant') return 'ASSISTANT'
  if (role === 'tool') return 'TOOL RESULT'
  if (role === 'developer') return 'SYSTEM NOTE'
  return 'SYSTEM'
}

export function apply(ctx, config) {
  const read = (field, fallback) => {
    const value = config?.[field]
    if (value === undefined) return fallback
    const resolved = typeof value?.get === 'function' ? value.get() : value
    return resolved === undefined ? fallback : resolved
  }

  const logger = ctx.logger
  const sessions = () => ctx.get('sessions')
  const llm = () => ctx.get('llm')

  /** Render one session's conversation as a bounded transcript. */
  const transcriptOf = (session) => {
    const limit = Math.max(1, read('maxChars', 48000))
    const messageLimit = Math.max(120, read('maxMessageChars', 4000))
    let messages
    try {
      messages = session.deriveMessages()
    } catch (error) {
      logger.warn(`side-chat: could not read the session log: ${error instanceof Error ? error.message : String(error)}`)
      messages = []
    }
    const lines = []
    for (const message of messages) {
      if (message === null || typeof message !== 'object') continue
      if (message.role === 'system') continue
      const text = messageText(message, messageLimit)
      if (text.length === 0) continue
      lines.push(`${roleLabel(message.role)}: ${text}`)
    }
    const transcript = lines.join('\n\n')
    if (transcript.length === 0) return '(the main conversation has no messages yet)'
    if (transcript.length > limit) return `…(earlier turns omitted)\n\n${transcript.slice(transcript.length - limit)}`
    return transcript
  }

  /** One text block list for a chat message. */
  const blocks = text => [{ type: 'text', text }]

  /** Ask the model one question about a parent session's conversation. */
  const ask = async (parent, question, history, provider, model) => {
    const messages = [{
      role: 'system',
      content: blocks(`${ROLE_PROMPT}\n\nMAIN CONVERSATION TRANSCRIPT\n${transcriptOf(parent)}`),
    }]
    for (const turn of history) {
      if (turn === null || typeof turn !== 'object') continue
      const text = typeof turn.text === 'string' ? turn.text : ''
      if (text.length === 0) continue
      messages.push({ role: turn.role === 'assistant' ? 'assistant' : 'user', content: blocks(text) })
    }
    messages.push({ role: 'user', content: blocks(question) })

    let answer = ''
    for await (const chunk of llm().stream({ provider, model, messages })) {
      if (chunk === null || typeof chunk !== 'object') continue
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') answer += chunk.text
      if (chunk.type === 'finish' && answer.length === 0) {
        const failure = chunk.error ?? chunk.reason
        if (failure !== undefined && failure !== null) {
          throw new Error(typeof failure === 'string' ? failure : JSON.stringify(failure))
        }
      }
    }
    return answer.trim()
  }

  // The route waits for the Web server in a child scope, so a profile without
  // one simply has no side chat instead of a failed entry.
  ctx.inject(['webServer'], (scope) => {
    scope.effect(() => {
      const endpoint = read('endpoint', '/plugins/side-chat')
      return scope.webServer.register({
        kind: 'exact',
        path: endpoint,
        handler: (req, res) => {
          const send = (status, body) => {
            res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
            res.end(JSON.stringify(body))
          }
          if (req.method === 'GET') {
            void (async () => {
              const providers = []
              for (const provider of llm().listProviders()) {
                let models = []
                try {
                  models = (await llm().listModels(provider.id)).map(model => ({ id: model.id, name: model.name }))
                } catch {
                  models = []
                }
                if (models.length > 0) providers.push({ id: provider.id, name: provider.name, models })
              }
              send(200, { providers })
            })().catch(error => {
              logger.warn(`side-chat: catalog failed: ${error instanceof Error ? error.message : String(error)}`)
              send(500, { providers: [] })
            })
            return
          }
          if (req.method !== 'POST') {
            res.writeHead(405)
            res.end()
            return
          }
          const chunks = []
          let size = 0
          req.on('data', chunk => {
            size += chunk.length
            if (size > 512_000) {
              req.destroy()
              return
            }
            chunks.push(chunk)
          })
          req.on('end', () => {
            const reply = async () => {
              let request = {}
              try {
                request = JSON.parse(Buffer.concat(chunks).toString('utf8'))
              } catch {
                request = {}
              }
              if (typeof request.clientError === 'string') {
                logger.warn(`side-chat: client error: ${request.clientError}`)
                send(200, { ok: true })
                return
              }
              const parent = typeof request.parentSessionId === 'string' ? sessions()?.get(request.parentSessionId) : undefined
              if (parent === undefined) {
                send(404, { error: 'no-parent' })
                return
              }
              const question = typeof request.question === 'string' ? request.question.trim() : ''
              if (question.length === 0) {
                send(400, { error: 'no-question' })
                return
              }
              let header
              try {
                header = parent.requestHeader()
              } catch {
                header = undefined
              }
              const provider = typeof request.provider === 'string' && request.provider.length > 0
                ? request.provider
                : header?.config?.provider ?? read('provider')
              const model = typeof request.model === 'string' && request.model.length > 0
                ? request.model
                : header?.config?.model ?? read('model')
              const history = Array.isArray(request.history) ? request.history.slice(-12) : []
              const answer = await ask(parent, question, history, provider, model)
              send(200, { answer })
            }
            void reply().catch(error => {
              logger.warn(`side-chat: ${error instanceof Error ? error.message : String(error)}`)
              try {
                send(500, { error: 'ask-failed', message: error instanceof Error ? error.message : String(error) })
              } catch {
                /* the reply already began */
              }
            })
          })
        },
      })
    }, 'side-chat: session route')
  })
}
