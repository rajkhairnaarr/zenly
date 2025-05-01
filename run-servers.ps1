# Start both backend and frontend servers
Write-Host "Starting both backend and frontend servers together..." -ForegroundColor Green

# First method: Use separate windows
$runBackend = {
    Set-Location -Path "$PSScriptRoot\backend"
    npm run dev
}

$runFrontend = {
    Set-Location -Path "$PSScriptRoot\frontend"
    npm run dev
}

$backendJob = Start-Job -ScriptBlock $runBackend
$frontendJob = Start-Job -ScriptBlock $runFrontend

Write-Host "Backend is running, job id:" $backendJob.Id -ForegroundColor Cyan
Write-Host "Frontend is running, job id:" $frontendJob.Id -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow

# Keep script running until manually stopped
try {
    while ($true) {
        # Show job status
        Get-Job | Format-Table -Property Id, Name, State
        Start-Sleep -Seconds 10
    }
} catch {
    # Clean up on exit
    Stop-Job -Id $backendJob.Id
    Stop-Job -Id $frontendJob.Id
    Remove-Job -Id $backendJob.Id
    Remove-Job -Id $frontendJob.Id
    Write-Host "Servers stopped." -ForegroundColor Red
} 