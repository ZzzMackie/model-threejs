/* eslint-disable no-console */
const { execCmdSync, getChangeFileListInCI } = require('./utils');
const path = require('path');
const fs = require('fs');
const changeFileList = getChangeFileListInCI();

const isChangeDependencies = changeFileList.some(f => f.includes('pnpm-lock.yaml'));
let dirList = null;
if (!isChangeDependencies) {
  console.log(`pnpm-lock.yaml未变更, 查找node_modules依赖是否存在`);
  try {
    dirList = fs.readdirSync(path.resolve('./node_modules/'), { encoding: 'utf8' }, () => {});
    console.log(`node_modules依赖存在`);
  } catch (error) {
    console.log(`node_modules依赖不存在`);
  }
}
if (isChangeDependencies || !dirList) {
  if (isChangeDependencies) {
    console.log(`pnpm-lock.yaml变更, 执行 rm -rf node_modules/ && pnpm install`);
  } else if (!dirList) {
    console.log(`node_modules依赖不存在, 执行 rm -rf node_modules/ && pnpm install`);
  }

  execCmdSync(`rm -rf node_modules/ && pnpm install`);
} else {
  console.log('没有检测到pnpm-lock.yaml的变更，跳过安装依赖阶段');
}
