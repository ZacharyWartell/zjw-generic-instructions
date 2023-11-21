@echo off
REM  This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi
REM init-template.bat [%1] [%2]

REM %1 is an opational prefix for the directory name containing the files published to the public website
REM     one common option is:
REM         www-


goto :init

echo This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi

:usage
    echo USAGE:
    echo   %__BAT_NAME% [flags] 
    REM echo   %__BAT_NAME% [flags] "required argument" "optional argument" 
    echo.
    echo.  /?, --help               shows this help
    echo.  --dir-prefix value       optional prefix to name of directory name containing the files published to the public website [Default: "", which is prepended to standard name directory name: 'site']
    echo.  --root-path value        optional relative path too root directory of the project folder [Default:  ..\..\..\..]
    echo.  --zjwgi-path value       optional relative path too root directory of the zjwgi folder [Default:  ..\..\%SITE%\git_modules\zjwgi]
    
    goto :eof

:init
    set "__NAME=%~n0"
    set "__VERSION=1.24"
    set "__YEAR=2023"

    set "__BAT_FILE=%~0"
    set "__BAT_PATH=%~dp0"
    set "__BAT_NAME=%~nx0"

    set "DirPrefix="
    set "RootPath=..\..\..\.."
    set "ZJWGIPath="

:parse
    if "%~1"=="" goto :validate

    REM if /i "%~1"=="/?"         call :header & call :usage "%~2" & goto :end
    REM if /i "%~1"=="-?"         call :header & call :usage "%~2" & goto :end
    REM if /i "%~1"=="--help"     call :header & call :usage "%~2" & goto :end

    REM if /i "%~1"=="/v"         call :version      & goto :end
    REM if /i "%~1"=="-v"         call :version      & goto :end
    REM if /i "%~1"=="--dir-prefix"  call :version full & goto :end

    REM  if /i "%~1"=="/e"         set "OptVerbose=yes"  & shift & goto :parse
    REM     if /i "%~1"=="-e"         set "OptVerbose=yes"  & shift & goto :parse
    REM if /i "%~1"=="--verbose"  set "OptVerbose=yes"  & shift & goto :parse

    if /i "%~1"=="--dir-prefix"     set "DirPrefix=%~2"   & shift & shift & goto :parse    

    if /i "%~1"=="--root-path"     set "RootPath=%~2"   & shift & shift & goto :parse    

    if /i "%~1"=="--zjwgi-path"     set "ZJWGIPath=%~2"   & shift & shift & goto :parse    

    REM if not defined UnNamedArgument     set "UnNamedArgument=%~1"     & shift & goto :parse
    REM  if not defined UnNamedOptionalArg  set "UnNamedOptionalArg=%~1"  & shift & goto :parse

    shift
    goto :parse

:validate

:main

pushd %RootPath%

set SITE=%DirPrefix%site

if ZJWGIPath=="" set "ZJWGIPath=..\..\%SITE%\git_modules\zjwgi"

cd

rmdir scripts\zjwgi 2>null & mklink /D scripts\zjwgi                %ZJWGIPath%\scripts\
mkdir %SITE%\css > nul 2>&1
rmdir %SITE%\css\zjwgi 2>null & mklink /D %SITE%\css\zjwgi          %ZJWGIPath%\site\css\zjwgi
mkdir %SITE%\html > nul 2>&1
rmdir %SITE%\html\zjwgi 2>null & mklink /D %SITE%\html\zjwgi        %ZJWGIPath%\site\html\zjwgi
mkdir %SITE%\scripts > nul 2>&1
rmdir %SITE%\scripts\zjwgi 2>null & mklink /D %SITE%\scripts\zjwgi  %ZJWGIPath%\site\scripts\zjwgi

mkdir %SITE%\images > nul 2>&1
rmdir %SITE%\images\zjwgi 2>null & mklink /D %SITE%\images\zjwgi    %ZJWGIPath%\site\images\zjwgi

mkdir %SITE%\videos > nul 2>&1
rmdir %SITE%\videos\zjwgi 2>null & mklink /D %SITE%\videos\zjwgi    %ZJWGIPath%\site\videos\zjwgi
copy %SITE%\git_modules\zjwgi\site\index.html %SITE%           

popd