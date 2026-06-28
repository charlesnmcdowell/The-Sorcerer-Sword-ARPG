@echo off
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
echo     1.  Play the game        (start server, then open http://localhost:8000/arena.html)
echo     2.  Watch quality        (visual auditor - leave it running while you play)
echo     3.  Make missing art     (generate any base sprites you don't have yet)
echo     4.  Make missing anims    (generate the animations the auditor asked for)
echo     5.  Seed references       (run once - lets new poses match the old art)
echo     6.  First-time setup      (install Python bits the tools need)
echo     7.  Quit
echo.
set /p choice="   Pick a number then press Enter:  "

if "%choice%"=="1" ( start "" http://localhost:8000/arena.html & cd .. & python -m http.server 8000 )
if "%choice%"=="2" python visual_audit.py --watch
if "%choice%"=="3" python gen_sprites.py
if "%choice%"=="4" python gen_sprites.py --from-needs
if "%choice%"=="5" python gen_sprites.py --snapshot
if "%choice%"=="6" ( pip install playwright pillow numpy & playwright install chromium )
if "%choice%"=="7" exit
echo.
echo   --- done. press a key to return to the menu ---
pause >nul
goto menu
