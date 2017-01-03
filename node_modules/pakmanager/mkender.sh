rm -rf node_modules/ender-js
npm install ender-js
rm -rf vendor/ender-js
mkdir -p vendor
mv node_modules/ender-js vendor/
