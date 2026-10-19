#export PATH=$PATH:$(pwd)/scripts/zjwp
ROOT="$1"
#echo "$(basename $0) : ROOT $ROOT"
#echo "zjwp.sh : ROOT $ROOT"
pushd "$ROOT/scripts" > /dev/null
source "$ROOT/scripts/zjwp/zjwp-set-path"
popd > /dev/null
