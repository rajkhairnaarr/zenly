# Start both the backend and frontend servers
Write-Host "Starting Zenly servers..." -ForegroundColor Cyan

# PowerShell doesn't support && operator like bash
# Create function to run backend
function Start-Backend {
    Set-Location -Path "$PSScriptRoot\backend"
    npm run dev
}

# Create function to run frontend
function Start-Frontend {
    Set-Location -Path "$PSScriptRoot\frontend"
    npm run dev
}

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit -Command Start-Backend"

# Wait a moment before starting frontend
Start-Sleep -Seconds 3

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit -Command Start-Frontend"

Write-Host "Both servers started in separate windows" -ForegroundColor Green 