> **This repository has moved into one monorepo.**
>
> The BornCode plugins — agent customization, desktop control, auto-continue,
> auto-shutdown, browser use, session instructions, session sync, and the side
> chat — now live in
> **[`borncode-app/dsh-borncode`](https://github.com/borncode-app/dsh-borncode)**,
> one repository with one Plugins entry.
>
> | this repo | new home |
> |---|---|
> | `dsh-agent-customizer` | `packages/dsh-agent-customizer` |
> | `dsh-agent-desktop` | `packages/dsh-agent-desktop` |
> | `dsh-auto-continue` | `packages/dsh-auto-continue` |
> | `dsh-auto-shutdown` | `packages/dsh-auto-shutdown` |
> | `dsh-browser-use` | `packages/dsh-browser-use` |
> | `dsh-session-instructions` | `packages/dsh-session-instructions` |
> | `dsh-session-sync` | `packages/dsh-session-sync` |
> | `dsh-side-chat` | `packages/dsh-side-chat` |
>
> The code and its history are unchanged; only the repository is shared. Install
> `dsh-borncode` instead of the individual bundles. This repository stays open
> so the old links keep working.
<div align="center">
  <img src="icon.svg" alt="" width="72" height="72">
  <h1>dsh-side-chat</h1>
  <p><b>Ask about the conversation you are in â€” in a chat that never edits it.</b></p>
  <p>
    <a href="https://github.com/borncode-app/dsh-side-chat/releases"><img alt="release" src="https://img.shields.io/github/v/release/borncode-app/dsh-side-chat?style=flat-square&color=6C4BF6"></a>
    <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-3DA639?style=flat-square"></a>
    <img alt="plugin" src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-6C4BF6?style=flat-square">
    <img alt="pane" src="https://img.shields.io/badge/pane-right%20sidebar-8957e5?style=flat-square">
  </p>
</div>

---

## What it does

Halfway through a long task you want a second opinion: *"what is this session actually doing?"*, *"did that step
finish?"*, *"which file did we change for the token refresh?"* Asking the main agent means spending a real turn,
polluting the real transcript, and risking it wandering off the job.

Side chat is a **read-only conversation about the current session**: it takes the session's transcript as context,
answers in the right sidebar, and writes nothing back into the main conversation.

## Features

- **The sidebar pane** â€” a separate chat that knows which session you are looking at, and says so when there is none.
- **Context without side effects** â€” the main transcript is read (`maxChars`, 48 000 by default), never appended to.
- **Its own model, or the session's** â€” "Same model as this session" by default; pick a cheaper route when you only
  need a summary. The pane tells you which model answered (`model.via`).
- **Bounded input** â€” `maxMessageChars` stops a wall of text from becoming an expensive question.
- **Honest about gaps** â€” no session, no model, or a retired route each get their own message instead of a crash.
- **Localized UI** â€” English, Thai, and Chinese in `locale/`.

## Requirements

| | |
|---|---|
| DeepSeek Harness | 0.2.x (Web GUI) |
| Runtime | Node 24, supplied by the Harness runtime |
| A provider | Any route the Harness already has, reachable with existing credentials |

## Install

```bash
git clone https://github.com/borncode-app/dsh-side-chat.git dsh-side-chat
```

Then:

```
plugin_manager install_bundle target=C:\path\to\dsh-side-chat
```

Restart once. The pane appears in the right sidebar with the current session already in context.

## Configuration

| field | default | meaning |
|---|---|---|
| `endpoint` | `/plugins/side-chat` | Path the pane talks to |
| `provider` | `deepseek-account` | Provider route used to answer |
| `model` | `deepseek-flash` | Model used when the pane does not follow the session |
| `maxChars` | `48000` | How much of the session transcript is sent as context |
| `maxMessageChars` | `4000` | Longest question accepted |

Every key here must exist in the plugin's `Config` schema â€” an unknown key fails the row at boot, on purpose.

## How it works

```
session transcript â”€â”€(read, capped at maxChars)â”€â”€â–¶
                                                   side chat â”€â”€â–¶ answer in the sidebar
your question â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¶       â–²
                                                           â”‚
                                              nothing is written back
```

The answer is a normal model turn against a context copy. The main session's transcript is not touched, so its
token count and its history stay exactly as they were.

## Files

| file | role |
|---|---|
| `index.js` | host row: endpoint, transcript read, model call |
| `client.js` | the right-sidebar pane |
| `cordis.patch.yml` | the bundle patch that inserts the row |
| `locale/{en,th,zh}.json` | UI strings |
| `icon.svg` | plugin icon |

## à¸ à¸²à¸©à¸²à¹„à¸—à¸¢

à¹à¸Šà¸—à¸”à¹‰à¸²à¸™à¸‚à¸§à¸²à¹„à¸§à¹‰ **à¸–à¸²à¸¡à¹€à¸£à¸·à¹ˆà¸­à¸‡à¸šà¸—à¸ªà¸™à¸—à¸™à¸²à¸—à¸µà¹ˆà¸à¸³à¸¥à¸±à¸‡à¸—à¸³à¸­à¸¢à¸¹à¹ˆ** à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¸à¸£à¸°à¸—à¸šà¸‡à¸²à¸™à¸«à¸¥à¸±à¸ â€” à¹ƒà¸Šà¹‰à¸•à¸­à¸™à¸­à¸¢à¸²à¸à¸£à¸¹à¹‰à¸§à¹ˆà¸² "session à¸™à¸µà¹‰à¸—à¸³à¸­à¸°à¹„à¸£à¸­à¸¢à¸¹à¹ˆ",
"à¸‚à¸±à¹‰à¸™à¸™à¸±à¹‰à¸™à¹€à¸ªà¸£à¹‡à¸ˆà¸«à¸£à¸·à¸­à¸¢à¸±à¸‡", "à¹à¸à¹‰à¹„à¸Ÿà¸¥à¹Œà¹„à¸«à¸™à¹„à¸›à¹à¸¥à¹‰à¸§" à¹à¸—à¸™à¸—à¸µà¹ˆà¸ˆà¸°à¹„à¸›à¹€à¸œà¸²à¹€à¸—à¸´à¸£à¹Œà¸™à¸ˆà¸£à¸´à¸‡à¸‚à¸­à¸‡ agent à¸«à¸¥à¸±à¸

- à¸­à¹ˆà¸²à¸™ transcript à¸‚à¸­à¸‡ session à¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™à¹€à¸›à¹‡à¸™à¸šà¸£à¸´à¸šà¸— (à¸ˆà¸³à¸à¸±à¸”à¸—à¸µà¹ˆ `maxChars` 48,000) à¹à¸•à¹ˆ **à¹„à¸¡à¹ˆà¹€à¸‚à¸µà¸¢à¸™à¸­à¸°à¹„à¸£à¸à¸¥à¸±à¸š**
- à¹€à¸¥à¸·à¸­à¸à¹‚à¸¡à¹€à¸”à¸¥à¹„à¸”à¹‰: à¹ƒà¸Šà¹‰à¹‚à¸¡à¹€à¸”à¸¥à¹€à¸”à¸µà¸¢à¸§à¸à¸±à¸š session (à¸„à¹ˆà¸²à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™) à¸«à¸£à¸·à¸­à¹€à¸¥à¸·à¸­à¸à¸•à¸±à¸§à¸—à¸µà¹ˆà¸–à¸¹à¸à¸à¸§à¹ˆà¸²à¹€à¸žà¸·à¹ˆà¸­à¹à¸„à¹ˆà¸ªà¸£à¸¸à¸›
- à¸¡à¸µà¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡à¸šà¸­à¸à¸Šà¸±à¸”à¹€à¸¡à¸·à¹ˆà¸­à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¸¡à¸µ session / à¸¢à¸±à¸‡à¹„à¸¡à¹ˆà¹€à¸¥à¸·à¸­à¸à¹‚à¸¡à¹€à¸”à¸¥ / route à¸™à¸±à¹‰à¸™à¸–à¸¹à¸à¸›à¸¥à¸”à¹„à¸›à¹à¸¥à¹‰à¸§
- à¸ˆà¸³à¸à¸±à¸”à¸„à¸§à¸²à¸¡à¸¢à¸²à¸§à¸„à¸³à¸–à¸²à¸¡à¸”à¹‰à¸§à¸¢ `maxMessageChars`

## License

[MIT](LICENSE) Â© 2026 BornCode
