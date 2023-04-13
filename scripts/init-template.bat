
echo This script should be run from the directory containing it, i.e. zjw-generic-instructions-template\site\git_modules\zjwgi\scripts\zjwgi

pushd ..\..\..\..

mklink /D scripts\zjwgi         site\git_modules\zjwgi\scripts\zjwgi
mklink /D site\css\zjwgi        site\git_modules\zjwgi\css\zjwgi
mklink /D site\html\zjwgi       site\git_modules\zjwgi\html\zjwgi
mklink /D site\scripts\zjwgi    site\git_modules\zjwgi\scripts\zjwgi
mklink /D site\images\zjwgi     site\git_modules\zjwgi\images\zjwgi
mklink /D site\videos\zjwgi     site\git_modules\zjwgi\videos\zjwgi


popd