import axios from 'axios';
import { useMessage } from '@use/message.js';
import { getQueryParam } from '@use/utils.js';
const urlStringify = (param = {}) => {
  return new URLSearchParams(param).toString();
};
// const getCookie = name => {
//   var reg = RegExp(name + '=([^;]+)');
//   var arr = document.cookie.match(reg);
//   if (arr) {
//     return arr[1];
//   } else {
//     return '';
//   }
// };
const messageError = str => {
  useMessage().error({ content: str, duration: 3000, closable: true });
};
var unTime;
var service = axios.create({
  baseURL: import.meta.env.VITE_APP_AXIOS_URL, //正式
  timeout: 30000,
  adapter: 'fetch'
  // crossDomain: true
});

service.defaults.withCredentials = false;
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; //配置请求头
const CancelToken = axios.CancelToken;
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    //添加Authorization
    let token = getQueryParam('auth_key');
    if (token) {
      config.headers['Authorization'] = token;
    } else {
      switch (import.meta.env.VITE_BUILD_ENV) {
        case 'development':
          config.headers['Authorization'] =
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzE3MDM1NjM1LCJncm91cF9pZCI6WzBdLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNTR9.11U2bxxs2fhtbLp_L8T4ZritWIfL7iEtX1o-y1ZfWbE`;
          break;
        case 'production':
          config.headers['Authorization'] =
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzE3ODI5NzUwLCJncm91cF9pZCI6WzBdLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNDh9.R9SY-EnD1L1tgZUecxR16pCrvdgJVS67uMR8G6I0suY`;
          break;
        case 'test':
          config.headers['Authorization'] =
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGZ1c2VuLmNuIiwiZXhwIjoxNzE3ODMwNDU3LCJncm91cF9pZCI6WzBdLCJpc3MiOiJmdXNlbiIsInVzZXJfZG4iOiJjbj1hZG1pbkBmdXNlbi5jbixvdT1GdXNlblRlYW0sZGM9ZnVzZW5wYWNrLGRjPWNvbSIsInVzZXJfaWQiOjExNDR9.-f421T9sxvpAMk3c7x4_Pgt5fQGXAr2kA-EZFm-9QXo`;
          break;

        default:
          break;
      }
    }
    //加密
    if (config.data || config.params) {
      let params = config.data || config.params;
      if (params.toKey_unTime) {
        unTime = params.toKey_unTime;
        config.headers.Bridge = unTime;
        delete params.toKey_unTime;
        if (config.data) {
          config.data = params;
        } else {
          config.params = params;
        }
      }
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    messageError(error);
    return Promise.reject(error);
  },
  function (error) {
    // Do something with response error
    messageError('服务器连接失败');
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    const res = response.data;
    if (res.code === 200) {
      return res;
    } else if (res.code === 401) {
      //401 token 有误回到登录页
      messageError(res.message || 'token失效');
      return Promise.reject(res.message || 'token失效');
    } else if (res.code === 403) {
      //403 没有权限 做出提示
      messageError(res.message || '无权限');
      return Promise.reject(res.message || '无权限');
    } else {
      messageError(res.message || '系统错误请稍后重试');
      return Promise.reject(res.message || '系统错误请稍后重试');
    }
    //return response.data
  },
  function (error) {
    // 对响应错误做点什么
    //服务端错误 404 500 503 处理
    if (error.response.status > 400) {
      messageError('系统错误请稍后重试');
      return;
    }
    return Promise.reject(error);
  }
);

export default {
  //get请求
  get(url, param, _hideLoad, type, config = {}) {
    const params = param;
    const data = {
      method: 'get',
      url,
      params,
      cancelToken: new CancelToken(() => {}),
      ...config
    };
    if (type === 'file') {
      if (data['headers']) {
        data['headers']['Content-Type'] = 'arraybuffer';
      } else {
        data['headers'] = {
          'Content-Type': 'arraybuffer'
        };
      }
    }
    return new Promise((resolve, reject) => {
      service(data)
        .then(res => {
          //axios返回的是一个promise对象
          resolve(res.data); //resolve在promise执行器内部
        })
        .catch(err => {
          console.log(err, '异常');
          reject(err);
        });
    });
  },
  post(url, param, _hideLoad, type = 1, config = {}) {
    let data = param;
    let serviceData = {
      method: 'post',
      url,
      data,
      cancelToken: new CancelToken(() => {}),
      ...config
    };
    switch (type) {
      case 1:
        if (serviceData.headers) {
          serviceData.headers['Content-Type'] = 'application/json';
        } else {
          serviceData.headers = {
            'Content-Type': 'application/json'
          };
        }
        break;
      case 2:
        data = urlStringify(param);
        break;
      case 3:
        if (serviceData.headers) {
          serviceData.headers['Content-Type'] = 'multipart/form-data';
        } else {
          serviceData.headers = {
            'Content-Type': 'multipart/form-data;'
          };
        }
        break;
      default:
        break;
    }
    return new Promise((resolve, reject) => {
      service(serviceData)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          console.log(err, '异常');
          reject(err);
        });
    });
  }
};
