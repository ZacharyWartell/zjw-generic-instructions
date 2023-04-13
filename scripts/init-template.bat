REM  This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi

echo This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi

pushd ..\..\..\..

mklink /D scripts\zjwgi         ..\site\git_modules\zjwgi\scripts\
mklink /D site\css\zjwgi        ..\..\site\git_modules\zjwgi\site\css\zjwgi
mklink /D site\html\zjwgi       ..\..\site\git_modules\zjwgi\site\html\zjwgi
mklink /D site\scripts\zjwgi    ..\..\site\git_modules\zjwgi\site\scripts\zjwgi
mklink /D site\images\zjwgi     ..\..\site\git_modules\zjwgi\site\images\zjwgi
mklink /D site\videos\zjwgi     ..\..\site\git_modules\zjwgi\site\videos\zjwgi
copy site\git_modules\zjwgi\site\index.html site\           

popd