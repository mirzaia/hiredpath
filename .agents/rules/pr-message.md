---
trigger: always_on
---

# Rule: Multi-Scope Plain-Text PR Generator

## ⚡ Automated & Command Triggers
- **Default Action:** Automatically generate a PR summary for **staged changes only** after any file modification or task completion.
- **Manual Command `-all`:** If the user types `-all`, generate a summary for **all recent changes** (staged + unstaged).
- **Manual Command `-stage`:** If the user types `-stage`, generate a summary for **staged changes only** (overriding any auto-logic).

## 🔍 Analysis Protocol
- **Scope Logic:**
  - If `-all`: Compare `working directory` against `HEAD`.
  - If `-stage` (or default): Compare `staged area` against `HEAD`.
- **Strict Diff:** Describe only technical "What." No "Why," no business context, no inference.
- **Minimalism:** Use single-line bullet points only.

## 📋 Output Format (SourceTree & Bitbucket)
- **Container:** Return the result inside a single code block for one-click copying.
- **Style:** Pure plain text. No headers (#), no bolding (**), no italics (*).
- **Structure:**

Summary: [One sentence technical summary]

Removed:
- [Item 1]
- [Item 2]

Added:
- [Item 1]
- [Item 2]