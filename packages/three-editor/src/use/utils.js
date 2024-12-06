/**
 * 图片转base64
 * @param {String} src 图片地址
 * @returns {Promise<String>} base64图片地址
 */
export const image2Base64 = ({ path, canvasType = 'image/png' }) => {
  return new Promise((res, rej) => {
    if (!path) rej();
    let img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = path;
    img.onload = () => {
      let canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let dataURL = canvas.toDataURL(canvasType);
      res(dataURL);
    };
  });
};

/**
 * base64转blob
 * @param {String} base64 base64图片地址
 * @param {String} filetype 文件类型
 * @returns {Promise<Blob>} 图片blob流
 */
export const Base64ToBlob = (base64, filetype) => {
  return new Promise((res, rej) => {
    if (!base64) rej();
    let type = filetype;
    let bytes = '';
    if (!filetype) {
      type = base64.split(',')[0].match(/:(.*?);/)[1]; //提取base64头的type如 'image/png'
      bytes = window.atob(base64.split(',')[1]); //去掉url的头，并转换为byte (atob:编码 btoa:解码)
    } else {
      bytes = window.atob(base64);
    }
    //处理异常,将ascii码小于0的转换为大于0
    let ab = new ArrayBuffer(bytes.length); //通用的、固定长度(bytes.length)的原始二进制数据缓冲区对象
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    let blob = new Blob([ab], {
      type
    });
    res(blob);
  });
};
/**
 * url转blob地址
 * @param {String} url 文件地址
 * @returns {Promise<string>} blob
 */
export const getBlob = url => {
  return new Promise(re => {
    if (!url) {
      re();
      return;
    }
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        re(blob);
      });
  });
};

export const useDownloadFile = async data => {
  if (!data.path) {
    return Promise.resolve();
  }
  // 下载内容转变成blob地址
  let content = data.content || '';
  let base64 = '';
  switch (data.type) {
    case 'image':
      //图片
      base64 = await image2Base64(data);
      content = await Base64ToBlob(base64);
      break;
    case 'base64':
      //base64文件
      content = await Base64ToBlob(data.path, data.filetype);
      break;
    case 'others':
      //其他指定文件类型
      content = new Blob([data.path], { type: `application/${data.filetype}` });
      break;
    default:
      //其他文件
      if (!(content && content instanceof File)) {
        content = await getBlob(data.path);
      }
  }
  // 创建隐藏的可下载链接
  let eleLink = document.createElement('a');
  eleLink.download = data.name || 'download.png';
  eleLink.style.display = 'none';
  eleLink.href = URL.createObjectURL(content);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
  return Promise.resolve();
};

/**
 * rgb/色号转cmyk
 * @param {String|Array} color 色号或rgb数组
 * @param {String} type 区分rgb或色号：rgb hex
 * @returns
 */
export const colorToCmyk = (color, type) => {
  let c, m, y, k, r, g, b;
  if (type === 'rgb' && color.length > 2) {
    //rgb格式
    r = color[0] || 0;
    g = color[1] || 0;
    b = color[2] || 0;
  } else if (type === 'hex') {
    //色号格式转rgb
    let rgbData = colorToRgb(color);
    r = rgbData.arr[0];
    g = rgbData.arr[1];
    b = rgbData.arr[2];
  } else {
    return null;
  }
  c = 1 - r / 255;
  m = 1 - g / 255;
  y = 1 - b / 255;
  k = Math.min(c, m, y);
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  return { c: ~~(c * 100), m: ~~(m * 100), y: ~~(y * 100), k: ~~(k * 100) };
};

/**
 * 色号转rgb
 * @param {String} data 色号值
 * @returns {object} {color rgb值 arr rgb数值数组}
 */
export const colorToRgb = (data, op = 1) => {
  let color = data.toLowerCase();
  let pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
  let colorNew = [];
  if (color && pattern.test(color)) {
    if (color.length == 4) {
      // 将三位转换为六位
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }
    //处理六位的颜色值
    for (let i = 1; i < 7; i += 2) {
      colorNew.push(parseInt('0x' + color.slice(i, i + 2)));
    }
    color = `rgba(${colorNew.join(',')}, ${op})`;
  }
  return {
    color,
    arr: colorNew
  };
};

export const appendQueryParam = (key, value) => {
  // 创建一个URL对象
  const url = new URL(window.location.href);

  // 向URL对象添加参数
  url.searchParams.set(key, value);

  // 用新的URL替换当前页面的地址
  window.history.pushState({ path: url.href }, '', url.href);
};

export const getQueryParam = key => {
  const url = new URL(window.location.href);
  const param = url.searchParams.get(key);
  return param;
};

export const openScene = ({ uuid, target = '_blank' }) => {
  let token = getQueryParam('auth_key');
  if (token) {
    window.open(`/threeModel-editor/?scene=${uuid}&auth_key=${token}`, target);
  } else {
    window.open(`/threeModel-editor/?scene=${uuid}`, target);
  }
};
