@echo off
echo Starting Zenly servers...

REM Start backend in a new window
start cmd /k start-backend.bat

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in a new window
start cmd /k start-frontend.bat

echo Both servers started in separate windows!
echo.
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo You can close this window if you want. 