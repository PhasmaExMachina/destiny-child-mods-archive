@ECHO OFF
SETLOCAL ENABLEDELAYEDEXPANSION
"%~dp0\PCK.exe" /R /U /C %*
mkdir universal 2> nul
move /Y *.newCompressedUnencrypted universal > nul
cd universal
FOR %%I in (*.newCompressedUnencrypted) DO (
set t=%%I
move /Y "!t!" "!t:~0,-25!" > nul
)
ENDLOCAL
explorer universal