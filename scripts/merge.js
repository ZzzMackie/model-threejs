/* eslint-disable no-console */
const { execCmdSync } = require('./utils');
const { errMsgLog, successMsgLog } = require('./log');
const getBranch = () => {
  let branch = {};
  for (const item of process.argv) {
    if (item.includes('--origin')) {
      branch.origin = item.split('=')[1];
    } else if (item.includes('--local')) {
      branch.local = item.split('=')[1];
    }
  }
  return branch;
};
const runMerge = () => {
  const { origin, local } = getBranch();
  if (!local || !origin) {
    errMsgLog('不存在分支');
    return;
  }
  const GIT_CACHED_FILE = 'git diff';
  const cachedsStr =
    execCmdSync(GIT_CACHED_FILE, {
      stdio: 'pipe'
    }) || '';
  if (cachedsStr) {
    errMsgLog('请先处理好本地变更再合并');
  } else {
    let error = false;
    // 先拉主分支代码
    const GIT_PULL = 'git pull';
    const pullDevelopmentStr =
      execCmdSync(
        GIT_PULL,
        {
          stdio: 'pipe'
        },
        err => {
          error = true;
          errMsgLog(err);
        }
      ) || '';

    successMsgLog('GIT_PULL----' + pullDevelopmentStr);
    if (error) return;

    // 切换目标分支
    const GIT_CHECKOUT = `git checkout ${origin}`;
    const checkoutStr =
      execCmdSync(
        GIT_CHECKOUT,
        {
          stdio: 'pipe'
        },
        err => {
          error = true;
          errMsgLog(err);
          createBranch({ origin, local });
        }
      ) || '';
    successMsgLog('GIT_CHECKOUT----' + checkoutStr);
    if (error) return;

    handlerMerge({ origin, local });
  }
};

const createBranch = ({ origin, local }) => {
  let error = false;
  // 创建目标分支
  const GIT_CREATE_BRANCH = `git checkout -b ${local} origin/${origin}`;
  const checkoutStr =
    execCmdSync(
      GIT_CREATE_BRANCH,
      {
        stdio: 'pipe'
      },
      err => {
        error = true;
        errMsgLog(err);
      }
    ) || '';
  successMsgLog('GIT_CREATE_BRANCH----' + checkoutStr);
  if (error) return;

  handlerMerge({ origin, local });
};

const handlerMerge = ({ origin, local }) => {
  let error = false;
  // 拉去目标分支最新代码
  const GIT_PULL__ORIGIN = `git pull origin ${origin}`;
  const pullBranchStr =
    execCmdSync(
      GIT_PULL__ORIGIN,
      {
        stdio: 'pipe'
      },
      err => {
        error = true;
        errMsgLog(err);
      }
    ) || '';
  successMsgLog('GIT_PULL__ORIGIN----' + pullBranchStr);
  if (error) return;

  // 合并本地分支到目标分支
  const GIT_MERGE = `git merge ${local}`;
  const mergeBranchStr =
    execCmdSync(
      GIT_MERGE,
      {
        stdio: 'pipe'
      },
      err => {
        error = true;
        errMsgLog(err);
      }
    ) || '';
  successMsgLog('GIT_MERGE----' + mergeBranchStr);
  if (error) return;

  // 提交合并commit
  const GIT_PUSH = `git push origin ${origin}`;
  const pushStr =
    execCmdSync(
      GIT_PUSH,
      {
        stdio: 'pipe'
      },
      err => {
        error = true;
        errMsgLog(err);
      }
    ) || '';
  successMsgLog('GIT_PUSH----' + pushStr);
  if (error) return;
};
runMerge();
