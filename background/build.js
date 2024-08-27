// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra')
fs.copy('./bin', './dist/bin')
fs.copy('./package.json', './dist/package.json')
fs.copy('./public', './dist/public')
