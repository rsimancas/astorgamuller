del c:\inetpub\wwwroot\Muller\takephoto\app\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\takephoto\app.js /F /Q
del c:\inetpub\wwwroot\Muller\takephoto\index.html /F /Q

XCOPY *.* "C:\inetpub\wwwroot\Muller\takephoto\*.*" /D /Y /S /EXCLUDE:exclude.TXT
