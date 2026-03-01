#!/bin/bash
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# Only run checks before git commit, push, or PR creation
if ! echo "$CMD" | grep -qE 'git (commit|push)|gh pr create'; then
  exit 0
fi

# Verify formatting and linting (these don't need network/database)
if ! (deno fmt --check . && deno lint .); then
  echo "deno fmt/lint failed. Fix issues before committing." >&2
  exit 2
fi

# Type-checking and build require Prisma generated client and network access.
# Skip these checks if the generated client doesn't exist (e.g. no database).
if [ -d "prisma/generated" ]; then
  if ! deno check; then
    echo "deno check failed. Fix issues before committing." >&2
    exit 2
  fi

  if ! (deno task build:prisma && deno task build); then
    echo "Build failed. Fix issues before committing." >&2
    exit 2
  fi
fi

exit 0
