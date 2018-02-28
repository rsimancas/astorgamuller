del c:\inetpub\wwwroot\Muller\logistica\app.js /F /Q
del c:\inetpub\wwwroot\Muller\logistica\index.html /F /Q
del c:\inetpub\wwwroot\Muller\logistica\app\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\logistica\js\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\logistica\css\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\logistica\images\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\logistica\ux\*.* /S /F /Q
del c:\inetpub\wwwroot\Muller\logistica\visor\*.* /S /F /Q

XCOPY *.* "C:\inetpub\wwwroot\Muller\logistica\*.*" /D /Y /S /EXCLUDE:exclude.TXT
