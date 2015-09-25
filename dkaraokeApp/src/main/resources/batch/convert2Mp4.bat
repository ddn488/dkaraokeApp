@echo off &setlocal

REM C:\Users\dennis>c:\ffmpeg\bin\ffmpeg.exe -i "e:\Karaoke\10007   Tinh Ta Voi Minh.Y Nhi.Unknown.vob" -b:a -acodec 
libfaac -ab 128k -map 0:1 -map 0:2 -map 0:3 "d:\Karaoke\10007   TinhTa Voi Minh.Y Nhi.Unknown.mp4"
REM   Or use mp3 codec: -c:a libmp3lame -b:a 128k -ar 44100

REM walk directory structure and convert each file in quiet mode
set "sourcefolder=%~1"
set "targetfolder=%~2"
echo %sourcefolder%
setlocal enableextensions enabledelayedexpansion
set startTime=%TIME%
set /a nfile=0
for /R "%sourcefolder%" %%a in (*.vob) do (    
    
    set "sourcefile=%%~fa"
    set "sourcepath=%%~dpa"
    set "targetfile=%%~na.mp4"  
    set "targetfolder=%targetfolder%!sourcepath:%sourcefolder%=!"
 
   if not exist !targetfolder!!targetfile! (
        echo converting "%%~nxa" ... 
        echo c:\ffmpeg\bin\ffmpeg -i "!sourcefile!" -map 0:1 -map 0:2 -map 0:3 "!targetfolder!!targetfile!"
   	c:\ffmpeg\bin\ffmpeg -v quiet -i "!sourcefile!" -b:a -map 0:1 -map 0:2 -map 0:3 "!targetfolder!!targetfile!"
    	set /a nfile+=1
    )

    if  !nfile! equ 50 (
       goto :done	
    )    
)
 

:done
echo Done! Converted %nfile% file(s)
 
set endTime=%TIME%
echo Started: %startTime%, Ended at: %endTime% 

endlocal