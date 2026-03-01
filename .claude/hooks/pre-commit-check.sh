#!/bin/bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only run checks before git commit, push, or PR creation
if ! echo "$CMD" | grep -qE 'git (commit|push)|gh pr create'; then
  exit 0
fi

# Verify format, lint, and types
if ! deno task check; then
  echo "deno task check failed. Fix issues before committing." >&2
  exit 2
fi

# Verify build
if ! (deno task build:prisma && deno task build); then
  echo "Build failed. Fix issues before committing." >&2
  exit 2
fi

exit 0
