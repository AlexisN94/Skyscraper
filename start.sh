scriptdir="$( dirname -- "$BASH_SOURCE"; )";

start_client="cd $scriptdir/client && npm start"
start_server="cd $scriptdir/server && npm start"

osascript -e "tell application \"Terminal\" to do script \"$start_client\""
osascript -e "tell application \"Terminal\" to do script \"$start_server\""
