#!/usr/bin/env python3
"""8x assignment agent-capture hook.

Wired to Claude Code's UserPromptSubmit and Stop lifecycle events via
.claude/settings.json. Receives the hook payload as JSON on stdin.

- UserPromptSubmit: appends the verbatim prompt to the session log.
- Stop: reads the session transcript (path provided in the payload),
  extracts the FINAL assistant text of the turn (no thinking, no tool
  calls, no intermediate steps), and appends it as the paired response.

One log file per session: .agent-logs/YYYY-MM-DD_HH-MM-SS_<session-id>.md
Never edits or deletes existing entries; append-only apart from the
frontmatter counters. Always exits 0 so a logging failure can never
break the coding session.
"""
import glob
import json
import os
import re
import sys
import time
from datetime import datetime, timezone

AUTHOR = "UsamaShafique"
PROJECT = "8x-amazon-clone"
DEFAULT_MODEL = "claude-fable-5"

LOG_DIR = os.environ.get("CAPTURE_LOG_DIR") or os.path.join(
    os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd()), ".agent-logs"
)


def now_iso():
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def read_entries(transcript_path):
    entries = []
    try:
        with open(transcript_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entries.append(json.loads(line))
                except json.JSONDecodeError:
                    continue
    except OSError:
        pass
    return entries


def latest_model(transcript_path):
    """Model of the most recent main-thread assistant message, else default."""
    model = DEFAULT_MODEL
    for e in read_entries(transcript_path):
        if e.get("type") == "assistant" and not e.get("isSidechain"):
            m = (e.get("message") or {}).get("model")
            if m:
                model = m
    return model


def final_response(transcript_path):
    """Return (text, model) of the turn's final assistant text output.

    Walks the transcript backwards, collecting text blocks from assistant
    messages until the previous user entry (a real prompt or a tool
    result) is reached. That yields exactly the end-of-turn response:
    no thinking blocks, no tool calls, no intermediate output.
    """
    entries = read_entries(transcript_path)
    texts = []
    model = None
    for e in reversed(entries):
        if e.get("isSidechain"):
            continue
        etype = e.get("type")
        if etype == "assistant":
            msg = e.get("message") or {}
            blocks = msg.get("content") or []
            text = "\n\n".join(
                b.get("text", "")
                for b in blocks
                if isinstance(b, dict) and b.get("type") == "text"
            ).strip()
            if text:
                texts.append(text)
                if model is None:
                    model = msg.get("model")
        elif etype == "user":
            break
    if not texts:
        return None, model
    return "\n\n".join(reversed(texts)), model


def find_log(session_id):
    matches = sorted(glob.glob(os.path.join(LOG_DIR, "*_{}.md".format(session_id))))
    return matches[0] if matches else None


def create_log(session_id, ts):
    os.makedirs(LOG_DIR, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y-%m-%d_%H-%M-%S")
    path = os.path.join(LOG_DIR, "{}_{}.md".format(stamp, session_id))
    date = ts[:10]
    content = (
        "---\n"
        "session_id: {sid}\n"
        "date: {date}\n"
        "author: {author}\n"
        "model: {model}\n"
        "tool: claude-code\n"
        "project: {project}\n"
        "total_exchanges: 0\n"
        "first_prompt_time: {ts}\n"
        "last_prompt_time: {ts}\n"
        "---\n\n"
        "# Session Log - {date}\n\n"
        "Session: `{sid8}` | Project: `{project}` | Author: `{author}`\n\n"
        "---\n"
    ).format(sid=session_id, sid8=session_id[:8], date=date, author=AUTHOR,
             project=PROJECT, model=DEFAULT_MODEL, ts=ts)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def set_field(content, key, value):
    return re.sub(r"^{}: .*$".format(re.escape(key)),
                  "{}: {}".format(key, value), content, count=1, flags=re.M)


def handle_prompt(payload):
    session_id = payload.get("session_id", "unknown-session")
    prompt = payload.get("prompt", "")
    ts = now_iso()
    path = find_log(session_id) or create_log(session_id, ts)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    num = content.count("[LOG_ENTRY type=PROMPT") + 1
    model = latest_model(payload.get("transcript_path", ""))
    entry = (
        "\n[LOG_ENTRY type=PROMPT num={num} session={sid8}]\n"
        "timestamp: {ts}\n"
        "model: {model}\n\n"
        "{prompt}\n\n"
    ).format(num=num, sid8=session_id[:8], ts=ts, model=model, prompt=prompt)
    content += entry
    content = set_field(content, "total_exchanges", num)
    content = set_field(content, "last_prompt_time", ts)
    content = set_field(content, "model", model)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def handle_stop(payload):
    session_id = payload.get("session_id", "unknown-session")
    path = find_log(session_id)
    if not path:
        # Session predates the hook install; no prompt was captured for
        # this turn, so there is nothing to pair the response with.
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    n_prompts = content.count("[LOG_ENTRY type=PROMPT")
    n_responses = content.count("[LOG_ENTRY type=RESPONSE")
    if n_responses >= n_prompts:
        return
    # The Stop event can fire before the final assistant message is
    # flushed to the transcript file — retry briefly before giving up.
    text, model = final_response(payload.get("transcript_path", ""))
    for _ in range(6):
        if text:
            break
        time.sleep(0.5)
        text, model = final_response(payload.get("transcript_path", ""))
    if not text:
        text = "(no final text response was produced for this turn)"
    if not model:
        model = latest_model(payload.get("transcript_path", ""))
    ts = now_iso()
    entry = (
        "\n[LOG_ENTRY type=RESPONSE num={num} session={sid8}]\n"
        "timestamp: {ts}\n"
        "model: {model}\n\n"
        "{text}\n\n"
    ).format(num=n_prompts, sid8=session_id[:8], ts=ts, model=model, text=text)
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return
    event = payload.get("hook_event_name") or (sys.argv[1] if len(sys.argv) > 1 else "")
    try:
        if event == "UserPromptSubmit":
            handle_prompt(payload)
        elif event == "Stop":
            handle_stop(payload)
    except Exception:
        # Never let a logging bug interrupt the session.
        pass


if __name__ == "__main__":
    main()
    sys.exit(0)
