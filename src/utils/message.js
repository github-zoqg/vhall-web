import Vue from 'vue';
import { Message } from 'element-ui';
// 全局配置 message 的 offset 值
const offset = 8;

const $message = options => {
  return Message({
    offset: offset,
    ...options
  });
};

// 重写一遍属性方法,将offset写入options
['success', 'warning', 'info', 'error'].forEach(type => {
  $message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options,
        offset: offset
      };
    }
    options.type = type;
    return Message({
      offset: offset,
      ...options
    });
  };
});
//将$message挂载到this上，用异步任务，是为了能覆盖element自动写入的 $message
setTimeout(() => {
  Vue.prototype.$message = $message;
});
