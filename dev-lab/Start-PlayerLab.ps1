param([ValidatePattern('^[a-z0-9_]+$')][string]$StoryId)
$ErrorActionPreference = 'Stop'
if (!$StoryId) { $StoryId = (Get-Content -LiteralPath (Join-Path $PSScriptRoot 'launch.json') -Raw | ConvertFrom-Json).storyId }
$labWorkspace = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$labLogs = Join-Path $labWorkspace '.player-lab-work\state'
New-Item -ItemType Directory -Force -Path $labLogs | Out-Null
try { $existingLab = Invoke-RestMethod -Uri 'http://127.0.0.1:5173/__lab/config' -TimeoutSec 2 } catch { $existingLab = $null }
if (!$existingLab) {
    $labEntry = Join-Path $PSScriptRoot 'start.cjs'
    Start-Process -FilePath (Get-Command node).Source -ArgumentList @(('"' + $labEntry + '"'), $StoryId) -WorkingDirectory $labWorkspace -WindowStyle Hidden -RedirectStandardOutput (Join-Path $labLogs 'server.log') -RedirectStandardError (Join-Path $labLogs 'server-errors.log')
    for ($attempt=0; $attempt -lt 90; $attempt++) {
        Start-Sleep -Seconds 1
        try { $existingLab = Invoke-RestMethod -Uri 'http://127.0.0.1:5173/__lab/config' -TimeoutSec 1; break } catch {}
    }
}
if (!$existingLab) { throw "Player Lab did not start. See $labLogs" }
Write-Output 'Player Lab ready: http://127.0.0.1:5173'
