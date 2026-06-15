@echo off
REM ====================================================================
REM  Neverending Narratives - apply staged site build to canonical repo
REM  Double-click this file to install the dark-fantasy redesign.
REM  It backs up your current index.html, then copies the staged
REM  index.html + assets into Documents\Neverendingnarratives.
REM  It does NOT git push - you review, then push to deploy.
REM ====================================================================
setlocal enabledelayedexpansion
set "SRC=%~dp0"
set "DEST=%USERPROFILE%\OneDrive\Documents\Neverendingnarratives"

echo.
echo Source (staged): %SRC%
echo Destination    : %DEST%
echo.

if not exist "%DEST%\" (
  echo [ERROR] Canonical folder not found:
  echo   %DEST%
  echo Edit the DEST line in this .bat if your repo lives elsewhere.
  pause
  exit /b 1
)

REM locale-independent timestamp via PowerShell (yyyyMMdd-HHmmss)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd-HHmmss"') do set "STAMP=%%i"

REM timestamped backup of the existing page
if exist "%DEST%\index.html" (
  copy /Y "%DEST%\index.html" "%DEST%\index.html.bak-!STAMP!" >nul
  echo Backed up existing index.html -^> index.html.bak-!STAMP!
)

copy /Y "%SRC%index.html" "%DEST%\index.html" >nul
echo Copied index.html

if not exist "%DEST%\assets\" mkdir "%DEST%\assets"
copy /Y "%SRC%assets\*" "%DEST%\assets\" >nul
echo Copied assets (forest-bg.jpg, og-image.png, cashapp-qr.png)

echo.
echo DONE. Open %DEST%\index.html in a browser to review,
echo then commit + git push to deploy to neverendingnarratives.com.
echo.
pause
