@echo off &setlocal
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
   	c:\ffmpeg\bin\ffmpeg -v quiet -i "!sourcefile!" -map 0:1 -map 0:2 -map 0:3 "!targetfolder!!targetfile!"
    	set /a nfile+=1
    )

    if  !nfile! equ 1 (
       goto :done	
    )    
)
 

:done
echo Done! Converted %nfile% file(s)
 
set endTime=%TIME%
echo Started: %startTime%, Ended at: %endTime% 

endlocal