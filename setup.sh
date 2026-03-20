#!/bin/sh
set -e

echo "==> Installing API dependencies"
npm install --prefix api

echo "==> Installing frontend dependencies"
npm install --prefix fe

echo "==> Setting up database"
npm run reset --prefix api

if [ ! -f .env ]; then
  echo "==> Generating .env"
  secret=$(node -e "process.stdout.write(require('crypto').randomBytes(32).toString('hex'))")
  printf "SHARED_SECRET=%s\nVITE_SHARED_SECRET=%s\n" "$secret" "$secret" > .env
else
  echo "==> .env already exists, skipping"
fi

echo ""
echo "Setup complete. Start the app with:"
echo "  npm run dev --prefix api"
echo "  npm run dev --prefix fe"
