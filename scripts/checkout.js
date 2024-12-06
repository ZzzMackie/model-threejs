const { execCmdSync } = require('./utils');
const { errMsgLog, successMsgLog } = require('./log');
const getBranch = () => {
  let branch = {};
  for (const item of process.argv) {
    if (item.includes('--branch')) {
      branch.branch = item.split('=')[1];
    }
  }
  return branch;
};

const checkout = () => {
  const { branch } = getBranch();
  if (branch) {
    const checkoutStr =
      execCmdSync(
        `git checkout ${branch}`,
        {
          stdio: 'pipe'
        },
        err => {
          errMsgLog(err);
        }
      ) || '';

    successMsgLog('checkout----' + checkoutStr);
  }
};

checkout();
