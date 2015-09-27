@echo off &setlocal

REM C:\ffmpeg\bin\ffmpeg.exe -i "e:\Karaoke\10007   Tinh Ta Voi Minh.Y Nhi.Unknown.vob" -map 0:1 -map 0:2 -map 0:3 -c:a libmp3lame -b:a 128k -ar 44100 "d:

\Karaoke\10007   TinhTa Voi Minh.YNhi.Unknown.mp4"
REM Or use mp3 codec: -c:a libmp3lame -b:a 128k -ar 44100

REM  Use this codec mp4a for JavaFX player - mp3 does not work with JavaFX
REM -acodec libfdk_aac -ar 44100 -ac 2 -ab 100k
REM OR no libfaac use this below
REM ffmpeg -i input.avi -c:v libx264 -crf 19 -preset slow -c:a aac -strict experimental -b:a 192k -ac 2 out.mp4

REM walk directory structure and convert each file in quiet mode

REM Usage: convert2mp4.bat E:\Karaoke D:\Karaoke

set "sourcefolder=%~1"
set "targetfolder=%~2"

setlocal enableextensions enabledelayedexpansion
set startTime=%TIME%
set /a nfile=0
for /R "%sourcefolder%" %%a in (*.vob) do (    
    
    set "sourcefile=%%~fa"
    set "sourcepath=%%~dpa"
    set "targetfile=%%~na.mp4"  
    set "targetfolder=%targetfolder%!sourcepath:%sourcefolder%=!"
 
   if not exist !targetfolder!!targetfile! (
        echo converting "%%~nxa" - file number: !nfile!

rem  	    c:\ffmpeg\bin\ffmpeg -v quiet -i "!sourcefile!" -map 0:1 -map 0:2 -map 0:3 

c:\ffmpeg\bin\ffmpeg -v quiet -i "!sourcefile!" -map 0:1 -map 0:2 -map 0:3 -c:v libx264 -c:a copy "!targetfolder!!targetfile!"
    
REM Examples:
REM Convert an audio file to AAC in an M4A (MP4) container:
REM ffmpeg -i input.wav -c:a libfdk_aac -vbr 3 output.m4a
REM Convert the audio only of a video:
REM
REM ffmpeg -i input.mp4 -c:v copy -c:a libfdk_aac -vbr 3 output.mp4
REM 
REM Convert the video with libx264, and mix down audio to two channels:
REM 
REM ffmpeg -i input.mp4 -c:v libx264 -crf:v 22 -preset:v veryfast -ac 2 -c:a libfdk_aac -vbr 3 output.mp4
 d:





	set /a nfile+=1
    )

    if  !nfile! equ 500 (
       goto :done	
    )    
)
 

:done
echo Done! Converted %nfile% file(s)
 
set endTime=%TIME%
echo Started: %startTime%, Ended at: %endTime% 

endlocal