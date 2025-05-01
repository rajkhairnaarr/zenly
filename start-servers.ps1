# This script starts both the backend and frontend servers
# Requires PowerShell execution policy that allows scripts to run

Write-Host "Starting Zenly backend and frontend servers..." -ForegroundColor Green

# Start backend server in a new window
Start-Process powershell -ArgumentList "-Command `"cd '$PSScriptRoot\backend'; npm run dev`""

# Give the backend a few seconds to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-Command `"cd '$PSScriptRoot\frontend'; npm run dev`""

Write-Host "Both servers have been started in separate windows!" -ForegroundColor Green
Write-Host "Backend running on: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Frontend running on: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to exit this script (servers will continue running in their windows)" -ForegroundColor Gray

# Keep this script running until user cancels
try {
    while($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "Exiting script. Servers remain running in their windows." -ForegroundColor Yellow
} 