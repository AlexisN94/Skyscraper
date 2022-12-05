scriptdir="$( dirname -- "$BASH_SOURCE"; )";

install_client_deps="cd $scriptdir/client && npm install"
install_server_deps="cd $scriptdir/server && npm install && cp patch/puppeteer-extra-plugin-user-data-dir/index.js node_modules/puppeteer-extra-plugin-user-data-dir/"

osascript -e "tell application \"Terminal\" to do script \"$install_client_deps\""
osascript -e "tell application \"Terminal\" to do script \"$install_server_deps\""
