// PreToolUse hook (from the git-guardrails-claude-code skill, ported to Node so
// it runs on Windows without jq). Blocks destructive git commands. Plain
// `git push` of a feature branch stays allowed so the PR workflow works;
// pushing straight to main and force-pushing are blocked.
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const command = String(input?.tool_input?.command ?? "");

const DANGEROUS = [
  [/git\s+push\b.*(--force\b|-f\b|--force-with-lease)/, "force push"],
  [/git\s+push\b.*\b(main|master)\b/, "push directly to main"],
  [/git\s+reset\s+--hard/, "reset --hard"],
  [/git\s+clean\s+-[a-z]*f/, "clean -f"],
  [/git\s+branch\s+-D\b/, "branch -D"],
  [/git\s+checkout\s+(--\s+)?\.(\s|$)/, "checkout ."],
  [/git\s+restore\s+(--\S+\s+)*\.(\s|$)/, "restore ."],
];

for (const [pattern, label] of DANGEROUS) {
  if (pattern.test(command)) {
    process.stderr.write(
      `BLOCKED: '${command}' is a ${label}. The user has prevented you from doing this — ask them to run it.\n`,
    );
    process.exit(2);
  }
}
process.exit(0);
