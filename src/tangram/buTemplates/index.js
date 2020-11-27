import saas from './saas/shadowWrapper';
import saasBase from './saas/index';
import saasRecord from './saas/recordvideo';
import enjoyWatchSaas from './saas/newWatch';
import popup from '../libs/saas-popup';

import fetch from '../http/http';
import vhallMessage from '../libs/messageBox/vhallMessage';
import EventBus from '@/utils/Events';
import { Message } from 'element-ui';

let permission = [];
EventBus.$on('permission', data => {
  permission = data;
});
const components = [saas, saasBase, saasRecord, enjoyWatchSaas, popup];

const install = (Vue, opt = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$vhallFetch = fetch(opt.config, opt.baseUrl, opt.buHost);
  Vue.prototype.$baseUrl = opt.baseUrl;
  Vue.prototype.$vhallmessage = vhallMessage;

  Vue.directive('auth', {
    inserted: function (el, binding) {
      if (binding.value instanceof Array) {
        const isIncluded = binding.value.find(p => permission.includes(p));
        if (!isIncluded) {
          el.remove();
        }
      } else {
        if (!permission.includes(binding.value)) {
          el.remove();
        }
      }
    }
  });

  Vue.prototype.$message = function (options) {
    console.log('assistantType', query('assistantType'));
    if (query('assistantType')) {
      return;
    }
    return Message(options);
  };
  let types = ['success', 'warning', 'info', 'error', 'customerror', 'customsuccess'];
  types.forEach(type => {
    Vue.prototype.$message[type] = function (options) {
      if (query('assistantType') && (type != 'customerror' && type != 'customsuccess')) {
        return;
      }
      if (typeof options === 'string') {
        options = {
          message: options
        };
      }
      if (type == 'customerror') {
        options.type = 'error';
      } else if (type == 'customsuccess') {
        options.type = 'success';
      } else {
        options.type = type;
      }
      return Message(options);
    };
  });
};
function query (param) {
  let reg = new RegExp('[?&]' + param + '=([^&]*)[&$]*');
  let ret = location.search.match(reg);
  if (ret) {
    ret = decodeURIComponent(ret[1]);
  }
  return ret;
}
export default {
  install,
  saas,
  saasBase,
  saasRecord,
  enjoyWatchSaas
};
