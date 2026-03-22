# NewStarSports — Environment Setup
#
# This script creates symlinks so each Next.js app reads
# the single root .env.local file.
#
# Usage:
#   Windows (PowerShell as Admin): .\scripts\setup-env.ps1
#   macOS/Linux:                   bash scripts/setup-env.sh

# ── For macOS / Linux ──
# Run: bash scripts/setup-env.sh

if [ ! -f ".env.local" ]; then
  echo "❌ .env.local not found in project root."
  echo "   Copy .env.example to .env.local and fill in your credentials first."
  exit 1
fi

echo "🔗 Creating .env.local symlinks for each app..."

ln -sf ../../.env.local apps/storefront/.env.local
ln -sf ../../.env.local apps/admin/.env.local
ln -sf ../../.env.local apps/api/.env.local

echo "✅ Done! All apps will read from the root .env.local"
