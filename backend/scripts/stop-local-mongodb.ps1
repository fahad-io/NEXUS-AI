$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$pidPath = Join-Path $repoRoot '.mongodb\mongod.pid'

if (-not (Test-Path $pidPath)) {
  Write-Output 'No MongoDB PID file found.'
  exit 0
}

$pid = (Get-Content $pidPath | Select-Object -First 1).Trim()
if (-not $pid) {
  Remove-Item $pidPath -Force
  Write-Output 'MongoDB PID file was empty and has been cleared.'
  exit 0
}

$process = Get-Process -Id $pid -ErrorAction SilentlyContinue
if ($process) {
  Stop-Process -Id $pid
  Write-Output "Stopped MongoDB process $pid."
} else {
  Write-Output "MongoDB process $pid was not running."
}

Remove-Item $pidPath -Force -ErrorAction SilentlyContinue
