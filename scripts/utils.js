const execSync = require('child_process').execSync;

const execCmdSync = (cmd, options = {}, errCallback) => {
  try {
    const defaultOptions = {
      encoding: 'utf-8',
      stdio: 'inherit'
    };
    Object.assign(defaultOptions, options);
    return execSync(cmd, defaultOptions);
  } catch (error) {
    if (typeof errCallback === 'function') {
      errCallback(error);
    } else {
      throw error;
    }
    return error;
  }
};

const getCachedList = () => {
  // --diff-filter=ACMR 忽略删除掉的文件
  const GIT_CACHED_FILE = 'git diff --cached --diff-filter=ACMR --name-only';
  const cachedsStr =
    execCmdSync(GIT_CACHED_FILE, {
      stdio: 'pipe'
    }) || '';
  return cachedsStr.split('\n').filter(Boolean);
};

const getChangeFileListInCI = () => {
  try {
    const GIT_COMMAND = 'git';
    const ciBeforeSha = process.argv[2];

    console.log(`读取beforeSha: ${ciBeforeSha}`);

    const ciCommitSha = execCmdSync(`${GIT_COMMAND} rev-parse HEAD`, {
      stdio: 'pipe'
    }).trim();

    console.log(`读取当前sha: ${ciCommitSha}`);

    const changeFilesStr = execCmdSync(`${GIT_COMMAND} diff --name-only ${ciBeforeSha} ${ciCommitSha}`, {
      stdio: 'pipe'
    });

    console.log('读取变更文件成功: \n', changeFilesStr.trim());

    return changeFilesStr.split('\n');
  } catch (error) {
    console.log('读取变更文件失败');
    return [];
  }
};

module.exports = { execCmdSync, getCachedList, getChangeFileListInCI };
