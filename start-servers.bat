@echo off
echo Starting Zenly backend and frontend servers...

REM Start backend server in a new window
start cmd /k "cd backend && npm run dev"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

REM Start frontend server in a new window
start cmd /k "cd frontend && npm run dev"

echo Both servers have been started in separate windows!
echo Backend running on: http://localhost:5001
echo Frontend running on: http://localhost:5173
echo.
echo You can close this window now. The servers will continue running in their own windows. 