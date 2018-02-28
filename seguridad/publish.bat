del c:\inetpub\wwwroot\Muller\seguridad\app\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\seguridad\app.js /F /Q
del c:\inetpub\wwwroot\Muller\seguridad\index.html /F /Q

XCOPY *.* "C:\inetpub\wwwroot\Muller\seguridad\*.*" /D /Y /S /EXCLUDE:exclude.TXT
