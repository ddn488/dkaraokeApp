@echo off
cls
echo --------------------------------------------------------
echo .
echo .
echo .      Installing VLC Media Player - Please Wait
echo .         Window will close once installed

REM Uninstall existing VLC version
if exist "%PROGRAMFILES%\VideoLAN\VLC\uninstall.exe" "%PROGRAMFILES%\VideoLAN\VLC\uninstall.exe" /S
if exist "%PROGRAMFILES(x86)%\VideoLAN\VLC\uninstall.exe" "%PROGRAMFILES% (x86)\VideoLAN\VLC\uninstall.exe" /S
:: Wait for 20 seconds
ping -n 20 127.0.0.1 > NUL

REM Run VLC Installer
"%~dp0vlc-2.2.1-win32.exe" /language=en_GB /S

REM Removes VLC Desktop Icon - Windows XP
if exist "%allusersprofile%\Desktop\VLC media player.lnk" del "%allusersprofile%\Desktop\VLC media player.lnk" /S

REM Removes VLC Desktop Icon - Windows 7
if exist "%public%\Desktop\VLC media player.lnk" del "%public%\Desktop\VLC media player.lnk" /S

REM Return exit code to SCCM
exit /B %EXIT_CODE%