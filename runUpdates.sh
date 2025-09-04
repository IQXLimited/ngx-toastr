#!/bin/bash

echo "🔄 Updating packages..."
npm update --save

OUTDATED=$(npm outdated --json || echo "")
if [[ "$OUTDATED" != "{}" && -n "$OUTDATED" ]]; then
  echo "⚠️ Some packages have major updates and need to be checked manually."

  if command -v jq >/dev/null 2>&1; then
    echo "$OUTDATED" | jq '.'
  else
    # Escape quotes for Node to safely parse
    node -e "console.log(JSON.stringify(JSON.parse(process.argv[1]), null, 2))" "$OUTDATED"
  fi
else
  echo "✅ No major updates found in server."
fi

echo ""
read -p "Press any key to exit..." -n1 -s