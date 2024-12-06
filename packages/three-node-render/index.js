// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);

// 获取当前文件所在目录
const __dirname = path.dirname(__filename);
(async () => {
  // 启动 Puppeteer
  const browser = await puppeteer.launch({
    headless: false, // 无头模式
    args: ['--disable-web-security'] // 避免跨域问题
  });

  // 创建新页面并加载 HTML
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  // 加载本地 HTML 文件
  await page.goto(`file://${__dirname}/index.html`);

  // 截图保存渲染结果
  await page.screenshot({ path: 'webgl-screenshot.png' });

  console.log('WebGL 2.0 content rendered and saved to webgl-screenshot.png');

  // 关闭浏览器
  //   await browser.close();
})();
