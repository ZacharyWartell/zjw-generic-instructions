# export PATH=$PATH:$(pwd)/module/scripts
# running into problems, above isn't having any effect.  possibly PATH length limit issues
# echo $(pwd)
ROOT="$1"
#echo "$(basename $0) : ROOT $ROOT"
SCRIPT_PATH="$ROOT/module/scripts/"

if [[ $(ls -A git-modules/zjw-pwa-template.git| wc -l) -eq 0 ]]; then
    #echo --bootstrap
    $SCRIPT_PATH/zxw-gm-install --bootstrap
fi

#
# unresolved: problems with PATH length limits on windows, tried alias but alias not expanded in non-interactive shell scripts (WTF)
#
PATH="$SCRIPT_PATH:$PATH"

alias zxw-gm-rsync="$SCRIPT_PATH/zxw-gm-rsync"
alias zxw-gm-install="$SCRIPT_PATH/zxw-gm-install"
alias zxw-gm="$SCRIPT_PATH/zxw-gm"
alias zxw-gm-init-repo="$SCRIPT_PATH/zxw-gm-init-repo"
