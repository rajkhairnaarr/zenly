@echo off
echo ===== Zenly MongoDB Database Scripts =====
echo 1. View Users (view current users in the database)
echo 2. Import Test Users (import users from test.users)
echo 3. Create Test Users (add sample test users to database)
echo 4. Create Meditations (add sample meditations to database)
echo.

set /p choice=Enter your choice (1-4): 

if "%choice%"=="1" (
  echo Running View Users script...
  node scripts/viewTestUsers.js
) else if "%choice%"=="2" (
  echo Running Import Test Users script...
  node scripts/importTestUsers.js
) else if "%choice%"=="3" (
  echo Running Create Test Users script...
  node scripts/createTestUsers.js
) else if "%choice%"=="4" (
  echo Running Create Meditations script...
  node scripts/createMeditations.js
) else (
  echo Invalid choice! Please enter a number between 1 and 4.
)

echo.
echo Script completed. Press any key to exit.
pause > nul 