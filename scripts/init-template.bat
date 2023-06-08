REM  This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi

echo This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi

pushd ..\..\..\..

rmdir scripts\zjwgi 2>null & mklink /D scripts\zjwgi         ..\site\git_modules\zjwgi\scripts\
rmdir site\css\zjwgi 2>null & mklink /D site\css\zjwgi        ..\..\site\git_modules\zjwgi\site\css\zjwgi
rmdir site\html\zjwgi 2>null & mklink /D site\html\zjwgi       ..\..\site\git_modules\zjwgi\site\html\zjwgi
rmdir site\scripts\zjwgi 2>null & mklink /D site\scripts\zjwgi    ..\..\site\git_modules\zjwgi\site\scripts\zjwgi
rmdir site\images\zjwgi 2>null & mklink /D site\images\zjwgi     ..\..\site\git_modules\zjwgi\site\images\zjwgi
rmdir site\videos\zjwgi 2>null & mklink /D site\videos\zjwgi     ..\..\site\git_modules\zjwgi\site\videos\zjwgi
copy site\git_modules\zjwgi\site\index.html site\           

popd