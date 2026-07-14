@echo off
setlocal EnableExtensions
REM ============================================================
REM  Sorcerer-Sword ART + AUDIT STUDIO  -  one place for everything.
REM  Double-click this file. Pick a number. That's it.
REM ============================================================
cd /d "%~dp0"
:menu
cls
echo.
echo   ====================================================
echo      SORCERER-SWORD  -  ART + AUDIT STUDIO
echo   ====================================================
echo.
echo     1.  Play the game        (game3d/arena.html on localhost:8000)
echo     2.  Watch quality        (visual auditor - leave it running while you play)
echo     3.  Make missing art     (generate any base sprites you don't have yet)
echo     4.  Make missing anims   (generate the animations the auditor asked for)
echo     5.  Seed references      (run once - lets new poses match the old art)
echo     6.  First-time setup     (install Python bits the tools need)
echo     7.  Quit
echo.
set "choice="
set /p choice="   Pick a number then press Enter:  "

if "%choice%"=="1" goto play
if "%choice%"=="2" python visual_audit.py --watch
if "%choice%"=="3" python gen_sprites.py
if "%choice%"=="4" python gen_sprites.py --from-needs
if "%choice%"=="5" python gen_sprites.py --snapshot
if "%choice%"=="6" ( pip install playwright pillow numpy & playwright install chromium )
if "%choice%"=="7" exit /b 0
echo.
echo   --- done. press a key to return to the menu ---
pause >nul
goto menu

:play
cd /d "%~dp0.."
echo.
echo   ====================================================
echo     PLAYING:  game3d\arena.html
echo     URL:      http://localhost:8000/arena.html
echo     NOT the live site, NOT game3d\index.html
echo   ====================================================
echo.

call :probe_arena
if %errorlevel%==0 (
  echo   Server already up and serving arena.html.
  goto open_browser
)

call :port_busy
if %errorlevel%==0 (
  echo   ERROR: Port 8000 is busy but NOT serving game3d/arena.html.
  echo   Close the other server on port 8000, then try again.
  echo.
  pause
  goto menu
)

echo   Starting python -m http.server 8000 in game3d\ ...
start "game3d-http" /D "%CD%" cmd /k python -m http.server 8000

set /a tries=0
:wait_server
call :probe_arena
if %errorlevel%==0 goto open_browser
set /a tries+=1
if %tries% geq 20 (
  echo   ERROR: Server did not respond in time. Check the "game3d-http" window.
  echo.
  pause
  goto menu
)
timeout /t 1 /nobreak >nul
goto wait_server

:open_browser
for /f %%i in ('powershell -NoProfile -Command "[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()"') do set "BUST=%%i"
echo   Opening browser (cache-busted): arena.html?v=%BUST%
start "" "http://localhost:8000/arena.html?v=%BUST%"
echo.
echo   If the stage still looks old: Ctrl+Shift+R on the arena tab.
echo   Close the "game3d-http" window when you are done playing.
echo.
pause
goto menu

:probe_arena
powershell -NoProfile -Command "try { $r=Invoke-WebRequest -Uri 'http://127.0.0.1:8000/arena.html' -UseBasicParsing -TimeoutSec 2; if($r.StatusCode -eq 200){ exit 0 } else { exit 2 } } catch { exit 1 }" >nul 2>&1
exit /b %errorlevel%

:port_busy
powershell -NoProfile -Command "try { $c=New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',8000); $c.Close(); exit 0 } catch { exit 1 }" >nul 2>&1
exit /b %errorlevel%
