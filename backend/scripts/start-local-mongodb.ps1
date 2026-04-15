$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$mongoRoot = Join-Path $repoRoot '.mongodb'
$mongod = Get-ChildItem -Path $mongoRoot -Recurse -Filter 'mongod.exe' -ErrorAction SilentlyContinue | Select-Object -First 1
$mongodPath = if ($mongod) { $mongod.FullName } else { $null }
$dataPath = Join-Path $mongoRoot 'data\db'
$logPath = Join-Path $mongoRoot 'logs\mongod.log'
$pidPath = Join-Path $mongoRoot 'mongod.pid'

if (-not $mongodPath -or -not (Test-Path $mongodPath)) {
  throw "MongoDB binary not found at $mongodPath. Download and extract MongoDB into $mongoRoot first."
}

New-Item -ItemType Directory -Force -Path $dataPath | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $logPath) | Out-Null

$existing = Get-Process mongod -ErrorAction SilentlyContinue | Select-Object -First 1
if ($existing) {
  Set-Content -Path $pidPath -Value $existing.Id
  Write-Output "MongoDB is already running with PID $($existing.Id)."
  exit 0
}

$process = Start-Process -FilePath $mongodPath `
  -ArgumentList @('--dbpath', $dataPath, '--bind_ip', '127.0.0.1', '--port', '27017', '--logpath', $logPath, '--logappend') `
  -PassThru `
  -WindowStyle Hidden

Set-Content -Path $pidPath -Value $process.Id
Write-Output "Started MongoDB with PID $($process.Id)."
