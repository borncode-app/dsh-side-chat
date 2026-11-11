<div align="center">
  <img src="icon.svg" alt="" width="72" height="72">
  <h1>dsh-side-chat</h1>
  <p><b>Ask about the conversation you are in — in a chat that never edits it.</b></p>
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

- **The sidebar pane** — a separate chat that knows which session you are looking at, and says so when there is none.
- **Context without side effects** — the main transcript is read (`maxChars`, 48 000 by default), never appended to.
- **Its own model, or the session's** — "Same model as this session" by default; pick a cheaper route when you only
  need a summary. The pane tells you which model answered (`model.via`).
- **Bounded input** — `maxMessageChars` stops a wall of text from becoming an expensive question.
- **Honest about gaps** — no session, no model, or a retired route each get their own message instead of a crash.
- **Localized UI** — English, Thai, and Chinese in `locale/`.

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

Every key here must exist in the plugin's `Config` schema — an unknown key fails the row at boot, on purpose.

## How it works

```
session transcript ──(read, capped at maxChars)──▶
                                                   side chat ──▶ answer in the sidebar
your question ─────────────────────────────────────▶       ▲
                                                           │
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

## ภาษาไทย

แชทด้านขวาไว้ **ถามเรื่องบทสนทนาที่กำลังทำอยู่** โดยไม่กระทบงานหลัก — ใช้ตอนอยากรู้ว่า "session นี้ทำอะไรอยู่",
"ขั้นนั้นเสร็จหรือยัง", "แก้ไฟล์ไหนไปแล้ว" แทนที่จะไปเผาเทิร์นจริงของ agent หลัก

- อ่าน transcript ของ session ปัจจุบันเป็นบริบท (จำกัดที่ `maxChars` 48,000) แต่ **ไม่เขียนอะไรกลับ**
- เลือกโมเดลได้: ใช้โมเดลเดียวกับ session (ค่าเริ่มต้น) หรือเลือกตัวที่ถูกกว่าเพื่อแค่สรุป
- มีข้อความบอกชัดเมื่อยังไม่มี session / ยังไม่เลือกโมเดล / route นั้นถูกปลดไปแล้ว
- จำกัดความยาวคำถามด้วย `maxMessageChars`

## License

[MIT](LICENSE) © 2026 BornCode
