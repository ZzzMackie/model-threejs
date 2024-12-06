export const proxyOptions = (object, proxyObject) => {
  // 代理options属性到对象
  Object.keys(proxyObject).forEach(key => {
    Object.defineProperty(object, key, {
      get() {
        return proxyObject[key];
      },
      set(val) {
        proxyObject[key] = val;
      }
    });
  });
};
