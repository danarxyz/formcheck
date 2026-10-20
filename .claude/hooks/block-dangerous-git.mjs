// PreToolUse hook (from the git-guardrails-claude-code skill, ported to Node so
// it runs on Windows without jq). Blocks destructive git commands from both the
// Bash and PowerShell tools. Plain `git push` of a feature branch stays allowed
// so the PR workflow works; pushing to main and force-pushing are blocked.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8") || "{}");
const command = String(input?.tool_input?.command ?? "");

// `git`, then any global options (`-C dir`, `-c k=v`, `--no-pager`), then the subcommand.
const GIT = String.raw`\bgit(?:\s+-[cC]\s+\S+|\s+--?[\w-]+(?:=\S+)?)*\s+`;
const git = (rest) => new RegExp(GIT + rest);

const DANGEROUS = [
  [git(String.raw`reset\s+(.*\s)?--hard\b`), "reset --hard"],
  [git(String.raw`clean\s+(.*\s)?-[a-zA-Z]*f`), "clean -f"],
  [git(String.raw`branch\s+(.*\s)?-D\b`), "branch -D"],
  [git(String.raw`checkout\s+(--\s+)?\.(\s|$)`), "checkout ."],
  [git(String.raw`restore\s+(--\S+\s+)*\.(\s|$)`), "restore ."],
];

const PUSH = git(String.raw`push\b(.*)`);
const FORCE = /(^|\s)(--force(-with-lease|-if-includes)?\b|-[a-zA-Z]*f\b|\+\S)/;
const MAIN = /^(main|master)$/;

function currentBranch() {
  try {
    return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

/** Does this `git push` argument list update main, explicitly or via the current branch? */
function pushesMain(args) {
  const positional = args.split(/\s+/).filter((a) => a && !a.startsWith("-"));
  const refspecs = positional.slice(1); // first positional is the remote
  if (refspecs.length === 0) return MAIN.test(currentBranch());
  return refspecs.some((spec) => {
    const dest = spec
      .replace(/^\+/, "")
      .split(":")
      .pop()
      .replace(/^refs\/heads\//, "");
    return MAIN.test(dest === "HEAD" ? currentBranch() : dest);
  });
}

function reason(segment) {
  for (const [pattern, label] of DANGEROUS) if (pattern.test(segment)) return label;
  const push = segment.match(PUSH);
  if (push) {
    if (FORCE.test(push[1])) return "force push";
    if (pushesMain(push[1])) return "push directly to main";
  }
  return undefined;
}

// Check each command of a chain (`a && b; c | d`) on its own.
for (const segment of command.split(/&&|\|\||[;|\n]/)) {
  const label = reason(segment.trim());
  if (label) {
    process.stderr.write(
      `BLOCKED: '${command}' is a ${label}. The user has prevented you from doing this — ask them to run it.\n`,
    );
    process.exit(2);
  }
}
process.exit(0);
