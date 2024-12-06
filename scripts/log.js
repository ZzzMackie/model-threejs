/* eslint-disable no-console */

const chalk = require('chalk');

const errMsgLog = msg => console.log(chalk.red(msg) + '\n');

const successMsgLog = msg => console.log(chalk.green(msg) + '\n');

module.exports = {
  errMsgLog,
  successMsgLog
};
