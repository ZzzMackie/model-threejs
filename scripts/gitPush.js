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
const commitMsg = process.argv[2] || 'chore:更改版本号';
console.log('commitMsg----', commitMsg);
// git stash && git add ./ && git commit -m 'chore: 更改版本号' && git push
const gitPush = () => {
  const GIT_STASH = 'git stash';
  console.log(GIT_STASH);
  const stashStr = execCmdSync(GIT_STASH, {
    stdio: 'pipe'
  });
  console.log(stashStr);

  const GIT_PULL = 'git pull';
  console.log(GIT_PULL);
  const pullStr = execCmdSync(GIT_PULL, {
    stdio: 'pipe'
  });
  console.log(pullStr);

  const GIT_STASH_POP = 'git stash pop';
  console.log(GIT_STASH_POP);
  const stashPopStr = execCmdSync(GIT_STASH_POP, {
    stdio: 'pipe'
  });
  console.log(stashPopStr);

  const GIT_ADD = 'git add ./';
  console.log(GIT_ADD);
  const addStr = execCmdSync(GIT_ADD, {
    stdio: 'pipe'
  });
  console.log(addStr);

  const GIT_COMMIT = `git commit -n -m ${commitMsg}`;
  console.log(GIT_COMMIT);
  const commitStr = execCmdSync(GIT_COMMIT, {
    stdio: 'pipe'
  });

  console.log(commitStr);
  const GIT_PUSH = `git push origin development`;
  console.log(GIT_PUSH);

  const pushStr = execCmdSync(GIT_PUSH, {
    stdio: 'pipe'
  });
  console.log(pushStr);
};

gitPush();
