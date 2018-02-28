del c:\inetpub\wwwroot\Muller\admin\app.js /F /Q
del c:\inetpub\wwwroot\Muller\admin\index.html /F /Q
del c:\inetpub\wwwroot\Muller\admin\app\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\admin\js\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\admin\css\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\admin\images\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\admin\ux\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\admin\visor\*.* /S /F /Q

XCOPY *.* "C:\inetpub\wwwroot\Muller\admin\*.*" /D /Y /S /EXCLUDE:exclude.TXT
