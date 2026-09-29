# CAPTURE-TEST — 8x assignment agent capture

## Tool and model

- **Tool:** Claude Code (CLI)
- **Model:** `claude-fable-5` — one model plans and executes; no separate planner/executor. A mid-build model switch would show up in the per-entry `model:` field of the logs.

## Mechanism

Claude Code lifecycle hooks, configured in **`.claude/settings.json`** (committed in this repo):

- **`UserPromptSubmit`** fires automatically on every prompt. The hook receives the payload (session id, transcript path, verbatim prompt) as JSON on stdin and appends the prompt to the session log.
- **`Stop`** fires automatically at the end of every turn. The hook receives the session transcript path on stdin, parses the transcript JSONL, and extracts **only the final assistant text of the turn** — no thinking blocks, no tool calls, no intermediate steps, no subagent (sidechain) output — and appends it as the paired response.

Both events run the same script: **`.claude/hooks/capture_log.py`**. It is append-only (it never edits or deletes an existing entry; only the frontmatter counters are updated), writes one file per session named `YYYY-MM-DD_HH-MM-SS_<session-id>.md` into **`.agent-logs/`**, and always exits 0 so a logging failure can never interrupt a session. `.agent-logs/` is **not** in `.gitignore` and ships with the repo.

## Log file path

Canary entries landed in:

- Session 1: `.agent-logs/<PENDING — filled in after canary 1>`
- Session 2: `.agent-logs/<PENDING — filled in after canary 2>`

## Canary entries (pasted raw)

<!-- PENDING: both canary prompt+response pairs will be pasted here raw once they land. -->

## What was tried first / caveats hit

- **Hook snapshot caveat:** Claude Code snapshots hook config at session startup for security — a hook added to `.claude/settings.json` *mid-session* does not fire until it is reviewed via the `/hooks` menu or a new session is started. This is why the canary test below was run after re-approving hooks (or restarting), rather than immediately in the same turn that installed them.
- **Dry run before the real canary:** before relying on the hook, the script was exercised with simulated `UserPromptSubmit`/`Stop` stdin payloads against a fake transcript in a temp directory (deliberately *not* `.agent-logs/`, so the committed logs contain only genuine session captures). This validated that thinking blocks, tool calls, intermediate pre-tool text, and sidechain/subagent messages are excluded and only the prompt + final response are logged.
- **Response extraction detail:** a turn's final answer can span multiple consecutive assistant messages in the transcript; the script walks the transcript backwards from the end, collecting assistant text blocks until it reaches the previous user entry (real prompt or tool result), then joins them in order. Turns where the model produced tool calls but no final text are logged as `(no final text response was produced for this turn)` rather than silently skipped.
