@echo off
title ARPG Voice Studio
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (set PY=py) else (set PY=python)

echo ============================================
echo   ARPG VOICE STUDIO - The Ankuspawn Conspiracy
echo ============================================
echo.
%PY% generate_voices.py --check
if errorlevel 1 (
  echo.
  echo Fix the issue above ^(usually: paste your ElevenLabs key into voice_config.json^), then run me again.
  pause
  exit /b 1
)
echo.
%PY% generate_voices.py --dry-run
echo.
set /p GO=Generate now? This spends ElevenLabs credits. [y/N]:
if /i "%GO%"=="y" (
  %PY% generate_voices.py --yes
) else (
  echo Nothing generated.
)
echo.
pause
