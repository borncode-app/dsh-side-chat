window.__ModuleLoader__.load({
  id: '@local/dsh-side-chat',
  factory: (require) => {
    const React = require('react')
    const NS = '@local/dsh-side-chat'
    /** Must match the Host row's `endpoint`. */
    const ENDPOINT = '/plugins/side-chat'
    /** The tab implementation id and the kind tabs are recorded under. */
    const TAB_ID = '@local/dsh-side-chat'
    const KIND = 'side-chat'
    /** Separates a provider id from a model id in one picker value. */
    const ROUTE_SEPARATOR = '\u0000'

    const en = {
      'type.label': 'Side chat',
      'guide.title': 'Side chat',
      'guide.description': 'Ask what this conversation is doing',
      'noSession': 'This tab has no session.',
      'empty': 'Ask anything about this conversation — what it is doing, what is finished, what is left.',
      'placeholder': 'Ask about this conversation…',
      'send': 'Send',
      'thinking': 'Thinking…',
      'failed': 'Could not answer: {message}',
      'model.label': 'Answer with',
      'model.follow': 'Same model as this session',
    }
    const th = {
      'type.label': 'แชทข้าง',
      'guide.title': 'แชทข้าง',
      'guide.description': 'ถามว่า session นี้กำลังทำอะไร',
      'noSession': 'แท็บนี้ไม่มี session',
      'empty': 'ถามอะไรก็ได้เกี่ยวกับบทสนทนานี้ — กำลังทำอะไร ทำอะไรเสร็จแล้ว เหลืออะไร',
      'placeholder': 'ถามเกี่ยวกับบทสนทนานี้…',
      'send': 'ส่ง',
      'thinking': 'กำลังคิด…',
      'failed': 'ตอบไม่สำเร็จ: {message}',
      'model.label': 'ตอบด้วย',
      'model.follow': 'ใช้โมเดลเดียวกับ session นี้',
    }
    const zh = {
      'type.label': '侧边对话',
      'guide.title': '侧边对话',
      'guide.description': '询问这段对话在做什么',
      'noSession': '此面板没有会话。',
      'empty': '可以问这段对话的任何事：正在做什么、完成了什么、还剩什么。',
      'placeholder': '询问这段对话…',
      'send': '发送',
      'thinking': '思考中…',
      'failed': '无法回答：{message}',
      'model.label': '回答模型',
      'model.follow': '与本会话使用相同模型',
    }

    const styles = {
      root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        font: 'inherit',
        color: 'var(--dsw-alias-label-primary)',
      },
      notice: {
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: '13px',
        lineHeight: '20px',
        padding: '16px',
        margin: 0,
      },
      failure: {
        color: 'var(--dsw-alias-state-error-primary)',
        fontSize: '12px',
        lineHeight: '18px',
        padding: '8px 12px',
        margin: 0,
      },
      bar: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderBottom: '1px solid var(--dsw-alias-border-l1)',
      },
      barLabel: {
        color: 'var(--dsw-alias-label-secondary)',
        fontSize: '11px',
        whiteSpace: 'nowrap',
      },
      select: {
        flex: '1 1 auto',
        minWidth: 0,
        height: '24px',
        padding: '0 6px',
        borderRadius: '8px',
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: '12px',
      },
      log: {
        flex: '1 1 auto',
        minHeight: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '12px',
      },
      bubble: {
        maxWidth: '92%',
        borderRadius: '12px',
        padding: '8px 10px',
        fontSize: '13px',
        lineHeight: '20px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      },
      user: {
        alignSelf: 'flex-end',
        background: 'var(--dsw-alias-bg-layer-2)',
        color: 'var(--dsw-alias-label-primary)',
      },
      assistant: {
        alignSelf: 'flex-start',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
      },
      composer: {
        flex: '0 0 auto',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '6px',
        padding: '8px 10px',
        borderTop: '1px solid var(--dsw-alias-border-l1)',
      },
      input: {
        flex: '1 1 auto',
        minHeight: '30px',
        maxHeight: '120px',
        resize: 'none',
        padding: '6px 8px',
        borderRadius: '10px',
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-1)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: '13px',
        lineHeight: '18px',
      },
      button: {
        flex: '0 0 auto',
        height: '30px',
        padding: '0 12px',
        borderRadius: '10px',
        border: '1px solid var(--dsw-alias-border-l1)',
        background: 'var(--dsw-alias-bg-layer-2)',
        color: 'var(--dsw-alias-label-primary)',
        font: 'inherit',
        fontSize: '12px',
        cursor: 'pointer',
      },
    }

    /** The guide card artwork: a speech bubble beside a document. */
    function GuideArtwork() {
      return React.createElement(
        'svg',
        { viewBox: '0 0 48 48', width: 32, height: 32, 'aria-hidden': 'true', focusable: 'false' },
        React.createElement('rect', { x: 5, y: 8, width: 20, height: 26, rx: 3, fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 }),
        React.createElement('path', { d: 'M10 15h10M10 21h10M10 27h6', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' }),
        React.createElement('path', {
          d: 'M26 18h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-7l-5 5v-5h-2a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z',
          fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinejoin: 'round',
        }),
      )
    }

    const apply = (ctx) => {
      /**
       * The side chat body.
       *
       * It declares no child slot and renders no product seat: a plain panel
       * that asks the Host one question at a time and keeps the turns in
       * component state, so it can never interfere with the shipped layout.
       */
      function SideChatBody(props) {
        const { sessionId, t } = props
        const [turns, setTurns] = React.useState([])
        const [draft, setDraft] = React.useState('')
        const [busy, setBusy] = React.useState(false)
        const [failure, setFailure] = React.useState('')
        const [providers, setProviders] = React.useState([])
        const [choice, setChoice] = React.useState('')
        const logRef = React.useRef(null)
        const say = (key, params) => (typeof t === 'function' ? t(key, params) : key)

        React.useEffect(() => {
          let cancelled = false
          void (async () => {
            try {
              const response = await fetch(ENDPOINT, { headers: { accept: 'application/json' } })
              const body = await response.json()
              if (!cancelled && Array.isArray(body?.providers)) setProviders(body.providers)
            } catch {
              /* the picker simply stays hidden */
            }
          })()
          return () => {
            cancelled = true
          }
        }, [])

        React.useEffect(() => {
          const node = logRef.current
          if (node !== null) node.scrollTop = node.scrollHeight
        }, [turns, busy])

        const send = async () => {
          const question = draft.trim()
          if (question.length === 0 || busy || sessionId === undefined) return
          const next = [...turns, { role: 'user', text: question }]
          setTurns(next)
          setDraft('')
          setBusy(true)
          setFailure('')
          try {
            const [provider, model] = choice.length === 0 ? [] : choice.split(ROUTE_SEPARATOR)
            const response = await fetch(ENDPOINT, {
              method: 'POST',
              headers: { 'content-type': 'application/json', accept: 'application/json' },
              body: JSON.stringify({
                parentSessionId: String(sessionId),
                question,
                history: next.filter(turn => turn.role !== 'error').slice(0, -1),
                ...provider === undefined || provider.length === 0 ? {} : { provider },
                ...model === undefined || model.length === 0 ? {} : { model },
              }),
            })
            const body = await response.json()
            if (!response.ok || typeof body?.answer !== 'string') {
              throw new Error(body?.message ?? body?.error ?? `HTTP ${response.status}`)
            }
            setTurns(current => [...current, { role: 'assistant', text: body.answer }])
          } catch (error) {
            setFailure(say('failed', { message: error instanceof Error ? error.message : String(error) }))
          } finally {
            setBusy(false)
          }
        }

        if (sessionId === undefined) {
          return React.createElement('p', { style: styles.notice }, say('noSession'))
        }

        const options = providers.flatMap(provider =>
          provider.models.map(model => ({
            value: `${provider.id}${ROUTE_SEPARATOR}${model.id}`,
            label: `${provider.name} · ${model.name}`,
          })))

        return React.createElement(
          'div',
          { style: styles.root },
          options.length === 0 ? null : React.createElement(
            'div',
            { style: styles.bar },
            React.createElement('span', { style: styles.barLabel }, say('model.label')),
            React.createElement(
              'select',
              {
                style: styles.select,
                value: choice,
                onChange: event => setChoice(event.target.value),
                'aria-label': say('model.label'),
              },
              React.createElement('option', { value: '' }, say('model.follow')),
              ...options.map(option => React.createElement('option', { key: option.value, value: option.value }, option.label)),
            ),
          ),
          React.createElement(
            'div',
            { style: styles.log, ref: logRef },
            turns.length === 0
              ? React.createElement('p', { style: styles.notice }, say('empty'))
              : turns.map((turn, index) => React.createElement(
                'div',
                {
                  key: String(index),
                  style: turn.role === 'user'
                    ? { ...styles.bubble, ...styles.user }
                    : { ...styles.bubble, ...styles.assistant },
                },
                turn.text,
              )),
            busy ? React.createElement('p', { style: styles.notice }, say('thinking')) : null,
          ),
          failure.length === 0 ? null : React.createElement('p', { style: styles.failure }, failure),
          React.createElement(
            'div',
            { style: styles.composer },
            React.createElement('textarea', {
              style: styles.input,
              value: draft,
              placeholder: say('placeholder'),
              rows: 1,
              onChange: event => setDraft(event.target.value),
              onKeyDown: event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void send()
                }
              },
            }),
            React.createElement(
              'button',
              {
                type: 'button',
                style: styles.button,
                disabled: busy || draft.trim().length === 0,
                onClick: () => void send(),
              },
              say('send'),
            ),
          ),
        )
      }

      /** A client-side failure reported to the Host, so it lands in its log. */
      const report = (stage, error) => {
        try {
          void fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ clientError: `${stage}: ${error instanceof Error ? error.message : String(error)}` }),
          })
        } catch {
          /* the report itself must never throw */
        }
      }

      ctx.effect(() => {
        try {
          return ctx.locale.register(NS, { en, th, zh })
        } catch (error) {
          report('locale.register', error)
          return () => {}
        }
      }, 'side-chat: copy')

      ctx.effect(() => {
        try {
          return ctx.sidebarRightTabs.register({
            id: TAB_ID,
            kind: KIND,
            title: () => ctx.locale.bind(NS)('type.label'),
            keepMounted: true,
            guide: [{
              id: 'open',
              commandId: 'sideChat.open',
              order: 45,
              title: () => ctx.locale.bind(NS)('guide.title'),
              description: () => ctx.locale.bind(NS)('guide.description'),
              icon: GuideArtwork,
            }],
          })
        } catch (error) {
          report('sidebarRightTabs.register', error)
          return () => {}
        }
      }, 'side-chat: tab type')

      ctx.inject(['shortcuts'], (scope) => {
        try {
          return scope.effect(() => scope.shortcuts.register({
            id: 'sideChat.open',
            label: () => ctx.locale.bind(NS)('guide.title'),
            aliases: ['side chat', 'ask about this conversation'],
            defaults: {
              'desktop:windows': { code: 'KeyJ', modifiers: ['primary', 'alt'] },
              'desktop:macos': { code: 'KeyJ', modifiers: ['primary', 'alt'] },
              'desktop:linux': { code: 'KeyJ', modifiers: ['primary', 'alt'] },
              'web:windows': { code: 'KeyJ', modifiers: ['primary', 'alt'] },
              'web:macos': { code: 'KeyJ', modifiers: ['primary', 'alt'] },
            },
            regions: ['page', 'editable', 'terminal'],
            modals: [],
            resolve: ({ target }) => {
              const resolved = ctx.sidebarRight.commandTarget(target)
              if (resolved === undefined) return { status: 'blocked', reason: ctx.locale.bind(NS)('noSession') }
              return {
                status: 'handled',
                run: () => {
                  ctx.sidebarRight.openTabFromTarget(KIND, resolved)
                },
              }
            },
          }), 'side-chat: shortcut')
        } catch (error) {
          report('shortcuts.register', error)
          return () => {}
        }
      })

      // No `children` declaration on purpose: a child slot would have to be a
      // unique, unclaimed seat, and the boot audit fails the whole app when the
      // client half throws while declaring one. This body needs no slot at all.
      ctx.slots.inject('sidebar.right.pane.tab', function* () {
        try {
          yield ctx.slots.register({
            name: 'sidebar.right.pane.tab',
            key: TAB_ID,
            locale: NS,
          }, SideChatBody)
        } catch (error) {
          report('slots.register', error)
        }
      })
    }

    return { inject: ['slots', 'locale', 'sidebarRight', 'sidebarRightTabs'], apply }
  },
})
