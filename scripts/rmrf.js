const { rimraf } = require('rimraf');
const fs = require('fs');
async function rmDir() {
  const list = await fs.readdirSync('./packages/', { encoding: 'utf8' });
  for (const iterator of list) {
    rimraf(`./packages/${iterator}/node_modules`);
  }
  return;
}
rmDir();
