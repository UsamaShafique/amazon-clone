# CAPTURE-TEST — 8x assignment agent capture

## Tool and model

- **Tool:** Claude Code (CLI)
- **Model:** `claude-fable-5` — one model plans and executes; no separate planner/executor. A mid-build model switch would show up in the per-entry `model:` field of the logs.

## Mechanism

Claude Code lifecycle hooks, configured in **`.claude/settings.json`** (committed in this repo):

- **`UserPromptSubmit`** fires automatically on every prompt. The hook receives the payload (session id, transcript path, verbatim prompt) as JSON on stdin and appends the prompt to the session log.
- **`Stop`** fires automatically at the end of every turn. The hook receives the session transcript path on stdin, parses the transcript JSONL, and extracts **only the final assistant text of the turn** — no thinking blocks, no tool calls, no intermediate steps, no subagent (sidechain) output — and appends it as the paired response.

Both events run the same script: **`.claude/hooks/capture_log.py`**. It is append-only (existing entries are never edited or deleted; only the frontmatter counters update), writes one file per session named `YYYY-MM-DD_HH-MM-SS_<session-id>.md` into **`.agent-logs/`**, and always exits 0 so a logging failure can never interrupt a session. `.agent-logs/` is **not** gitignored and ships with the repo, committed interleaved with the code.

## Log file path

- Session 1 (setup + full build): `.agent-logs/2026-09-29_12-46-55_2cf44989-e705-4810-81d0-2b44c95c6586.md`
- Session 2: a second-session canary is pending — it requires a fresh Claude Code session to be started in this repo; the hook is project-scoped so it fires automatically there too. This file will be updated with that log's path when it lands.

## Canary entries (pasted raw)

The literal step-4 canary was skipped by the author — the assignment prompt itself served as the live capture test. Entry 1 in the session-1 log is the **entire assignment brief, verbatim and untruncated** (~950 lines, see the log file). The smallest complete prompt/response pair from that log, pasted raw:

    [LOG_ENTRY type=PROMPT num=2 session=2cf44989]
    timestamp: 2026-09-29T13:35:17.458Z
    model: claude-fable-5

    run the project


    [LOG_ENTRY type=RESPONSE num=2 session=2cf44989]
    timestamp: 2026-09-29T13:39:13.532Z
    model: claude-fable-5

    (no final text response was produced for this turn)

## What was tried first / what did not work

1. **Hook snapshot caveat.** Claude Code snapshots hook *configuration* at session startup — hooks added to `.claude/settings.json` mid-session don't fire until reviewed via `/hooks` or a session restart. The canary had to wait for that approval; the first captured prompt confirms it fired from then on.
2. **Dry run before relying on it.** The script was first exercised with simulated `UserPromptSubmit`/`Stop` stdin payloads against a fake transcript in a temp directory (deliberately *not* `.agent-logs/`, so committed logs contain only genuine session captures). That validated thinking/tool-call/sidechain exclusion and multi-message final answers.
3. **Race condition, found live (see the raw pair above).** `RESPONSE num=2` reads "(no final text response was produced for this turn)" even though a final response existed. Cause: the `Stop` event can fire before the final assistant message is flushed to the transcript file, so the extractor saw the turn ending at the last tool result. Fixed in `capture_log.py` by retrying the transcript read (6 × 0.5 s) before falling back to the placeholder. Per the assignment rules the flawed entry was **left in the log unedited** — it is part of the honest record.
4. **Interrupted turns produce unpaired prompts.** `PROMPT num=1` (the assignment brief) has no `RESPONSE num=1`: the user interrupted that turn (rejecting a git-commit tool call to say "run the project"), so no end-of-turn event fired. The pairing logic (`responses < prompts` guard) keeps subsequent numbering aligned instead of mispairing.
