cd %cd%\server
call npm install
copy /Y patch\puppeteer-extra-plugin-user-data-dir\index.js node_modules\puppeteer-extra-plugin-user-data-dir\index.js
cd ..\client
call npm install