# NewStarSports — Environment Setup (Windows)
#
# Creates symlinks so each Next.js app reads the single root .env.local file.
# Must be run as Administrator (symlinks require elevated privileges on Windows).
#
# Usage: Run PowerShell as Administrator, then:
#   .\scripts\setup-env.ps1

$rootEnv = Join-Path $PSScriptRoot "..\.env.local"

if (-not (Test-Path $rootEnv)) {
    Write-Host "❌ .env.local not found in project root." -ForegroundColor Red
    Write-Host "   Copy .env.example to .env.local and fill in your credentials first."
    exit 1
}

$rootEnvFull = (Resolve-Path $rootEnv).Path

$apps = @("apps\storefront", "apps\admin", "apps\api")

Write-Host "🔗 Creating .env.local symlinks for each app..." -ForegroundColor Cyan

foreach ($app in $apps) {
    $target = Join-Path $PSScriptRoot "..\" $app ".env.local"
    $targetDir = Split-Path $target -Parent

    if (Test-Path $target) {
        Remove-Item $target -Force
    }

    New-Item -ItemType SymbolicLink -Path (Join-Path (Join-Path $PSScriptRoot "..\$app") ".env.local") -Target $rootEnvFull -Force | Out-Null
    Write-Host "  ✅ $app\.env.local → root .env.local" -ForegroundColor Green
}

Write-Host "`n✅ Done! All apps will read from the root .env.local" -ForegroundColor Green
