const { resolve, relative } = require('path');
const { writeFileSync } = require('fs-extra');

function get2Digit(n) {
  if (n < 10) {
    return '0' + n;
  }
  return '' + n;
}
const date = new Date();
const version =
  get2Digit(date.getFullYear()) +
  get2Digit(date.getMonth() + 1) +
  get2Digit(date.getDate()) +
  '.' +
  get2Digit(date.getHours()) +
  get2Digit(date.getMinutes()) +
  get2Digit(date.getSeconds());

const file = resolve(__dirname, 'public', 'version.json');
writeFileSync(file, `{ "version": "${version}"}`, { encoding: 'utf-8' });
