import { Mesh, PerspectiveCamera, MeshBasicMaterial, BoxGeometry, Scene, WebGLRenderer } from '@fusen/threejs';
import fs from 'node:fs';
import { createCanvas } from 'node-canvas-webgl';
import pkg from 'mock-browser';
const { mocks } = pkg;
// const MockBrowser = require('mock-browser').mocks.MockBrowser;
const document = mocks.MockBrowser.createDocument();
const window = mocks.MockBrowser.createWindow();
global.window = window;
global.document = document;
global.navigator = window.navigator;
async function main() {
  // 创建canvas元素
  const width = window.innerWidth,
    height = window.innerHeight;
  const canvas = createCanvas(512, 512);
  var gl = canvas.getContext('webgl2');
  // 创建渲染器
  const renderer = new WebGLRenderer({ canvas, context: gl });
  renderer.setSize(width, height);
  // 创建场景
  const scene = new Scene();
  // 创建相机
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  // 创建模型
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  // 渲染
  renderer.render(scene, camera);
  const base64 = renderer.domElement.toDataURL('image/png', 1.0);
  const base64Image = base64.split(';base64,').pop();
  // 将 base64 转成 二进制数据
  const bufferData = Buffer.from(base64Image, 'base64');
  // 保存图片
  //   canvas.toBuffer((err, buf) => {
  //     if (err) throw err;
  //     fs.writeFileSync('output.png', bufferData);
  //   });

  fs.writeFileSync('output.png', bufferData);
}

main();
