/* 为了防止不会被编译  使用var和函数 */
export var session = {
  set: function (key, value) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  },
  get: function (key) {
    return JSON.parse(sessionStorage.getItem(key));
  },
  removeItem: function (param) {
    return sessionStorage.removeItem(param);
  }
};
