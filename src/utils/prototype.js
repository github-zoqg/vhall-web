
import fetchData from '@/api/fetch';
import EventBus from '@/utils/Events';
import clipboard from 'clipboard';
import { copy, dealObjectValue, domainCovert, parseURL, checkUploadType } from '@/utils/utils';
import moment from 'moment'; // 日期格式化
import 'moment/locale/zh-cn';
moment.locale(); // zh-cn

Vue.prototype.$clipboard = clipboard
Vue.prototype.$fetch = fetchData;
Vue.prototype.$moment = moment;
Vue.prototype.$EventBus = EventBus;
Vue.prototype.$copyText = copy;
Vue.prototype.$params = dealObjectValue; //去除空值参数转换
Vue.prototype.$domainCovert = domainCovert;// 添加域名
Vue.prototype.$parseURL = parseURL; // 去除域名//*/upload/
Vue.prototype.$checkUploadType = checkUploadType; // 验证上传格式