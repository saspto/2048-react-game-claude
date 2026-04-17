#!/bin/bash
# Read the JSON event data from stdin
INPUT=$(cat)

# Extract the file path that was just edited
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only format files that Prettier understands
if [[ "$FILE_PATH" =~ \.(ts|tsx|js|jsx|css|json|md)$ ]]; then
  npx prettier --write "$FILE_PATH" 2>/dev/null
  echo "Formatted: $FILE_PATH"
fi

exit 0