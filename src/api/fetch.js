import 'whatwg-fetch';
import Cookies from 'js-cookie';
import { v1 as uuidV1 } from 'uuid';
import qs from 'qs';
import getApi from './config';
import { sessionOrLocal,getQueryString } from '../utils/utils';
import { Message } from 'element-ui';
import errorMap from './errorMap'

/**
 * 错误码提示 统一在次处理
 * extendsMsg：增加扩展字段处理自定义错误信息 格式如：{510000: '错误信息'}，空位此处错误不需提示
 * 200
 * 600 对应 10000 参数错误
 * 其余错误信息 510000 - 516999，通过errorMap引入
*/
export default function fetchData(url, data1 = {}, header = {}, extendsMsg = {}) {
  const config = getApi(url);
  let [api, method, mock, paas, staticdata] = config;
  if (!api) throw TypeError('api 未定义');
  // TODO 临时用大龙Token，后续删除
  const token = sessionOrLocal.get('token', 'localStorage') || '';
  let data = Object.assign(data1);
  if (window.location.href.indexOf('/chooseWay') !== -1) {
    // 修改存储live_token 方案    改为活动ID_token值
    let _live_token = sessionOrLocal.get('live_token', 'localStorage')
    let ActiveID = null
    try {
      ActiveID = location.pathname.split('chooseWay/')[1].split('/')[0]
    } catch (error) {
      if(_live_token.length >32){
        _live_token = _live_token.slice(live_token.length - 32)
      }
    }
    try {
      if(_live_token.indexOf(ActiveID)!=-1){
        data.live_token = _live_token.split(`${ActiveID}_`)[1]
      }
    } catch (error) {}
    if(location.search.includes('liveT')){
      data.live_token = getQueryString('liveT')
    }
  }
  // const interact_token = sessionStorage.getItem('interact_token') || null;
  let formData = null;
  if (method === 'GET' && data) {
      let Uri;
      api.indexOf('?') > -1 ? (Uri = '&') : (Uri = '?');
      Object.keys(data).forEach((key, indx) => {
        if (indx === data.length) {
          Uri = Uri + `${key}=${data[key]}`;
        } else {
          if (indx < Object.keys(data).length - 1) {
            Uri = Uri + `${key}=${data[key]}&`;
          } else {
            Uri = Uri + `${key}=${data[key]}`;
          }
        }
      });
      api = api + Uri;
  }

  let headers = {
    platform: sessionOrLocal.get('platform', 'localStorage') || 17,
    token: token,
    origin: window.location.origin,
    'request-id': uuidV1(),
    zone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
  // header 可能传gray-id，可能传递token，可能传递Content-Type
  if (header['token'] !== null && header['token'] !== undefined) {
    headers['token'] = header['token']
  }
  // 若head里面存在，以head传入的灰度ID为准
  if (header['gray-id'] > 0) {
    headers['gray-id'] = header['gray-id']
  } else if(window.sessionStorage.getItem('userId')) {
    headers['gray-id'] = window.sessionStorage.getItem('userId')
  } else if ( Cookies.get('gray-id')) {
    headers['gray-id'] = Cookies.get('gray-id')
  }
  // 若选择发起传入了
  if(window.location.href.indexOf('/chooseWay') !== -1) {
    // pc观看等
    headers.platform = header.platform || sessionOrLocal.get('platform', 'localStorage') || 17;
  }
  // interact_token && (headers['interact-token'] = interact_token)
  if(window.location.hash.indexOf('/live/watch/') !== -1
     || window.location.pathname.indexOf('/cMiddle/') !== -1) {
    // pc观看等
    headers.platform = 7;
  }
  // 针对微吼云  通过审核接口  单独进行修改传参类型--- 勿删
  if (header['Content-Type'] === 'multipart/form-data' || api.indexOf('apply-message-send')!=-1) {
    formData = new FormData();
    for (let key in data) {
      if(data[key] !== null &&  data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key]);
      }
    }
  } else if (header['Content-Type'] === 'application/json') {
    headers['Content-Type'] = 'application/json';
  } else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  let option = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // credentials: 'include',
    // include: cookie既可以同域发送，也可以跨域发送, *same-origin: 表示cookie只能同域发送，不能跨域发送 omit: 默认值，忽略cookie的发送
    headers: headers
  };
  if (method === 'POST' && header['Content-Type'] !== 'application/json') {
    option.body = formData || qs.stringify(data); // body data type must match "Content-Type" header
  } else if (method === 'POST' && header['Content-Type'] === 'application/json') {
    option.body = JSON.stringify(data);
  }
  if (mock) {
    api = `/mock${api}`;
  } else if (paas || staticdata){
    api = `${process.env.VUE_APP_STATIC_URL}${api}`
    option.headers = {}
  } else {
    const replaceApi = api
    const hasLowerConfig = replaceApi.indexOf('ops_fault_code_publish') > -1
    const _nodeEnv = process.env.VUE_APP_NODE_ENV == 'production' || process.env.VUE_APP_NODE_ENV == 'pre'  ? 'product' : 'test';
    if (hasLowerConfig) {
      const str = replaceApi.replace('test', _nodeEnv).replace('ops_fault_code_publish', 'ops_fault_code_publish_2')
      api = `${process.env.VUE_APP_LOWER_GRADE_URL}${str}`
    } else {
      api = `${process.env.VUE_APP_BASE_URL}${api}`;
    }
  }

  // 对跨域携带cookie进行处理
  if (header.credentials) {
    option.credentials = 'include'
  }
  console.log(option, headers)
  return fetch(api, option).then((res) => {
    return res.json();
  }).then(res => {
    let msg = ''
    let errMap = errorMap
    if (res.code === 404 || res.code === 403) {
      sessionStorage.setItem('errorReturn', this.$route.path);
      this.$router.push({
        path: '/warning/error'
      });
      return
    } else if (res.code === 510015) {
      this.$router.push({
        path: '/upgrading'
      });
      return Promise.reject({
        code: 510015,
        msg: '00:00-07:00期间系统升级中，由此给您带来不便，敬请谅解！'
      });
    } else if (res.code == 200) {
      return res;
    } else if (api.includes(process.env.VUE_APP_STATIC_URL)) {
      return res;
    } else {
      errMap = Object.assign(errMap, extendsMsg)
      msg = errMap[res.code]
      if (msg) {
        // Message.error(res.msg)
        res.msg = msg;
      }
      if (res.code == 511006 && sessionOrLocal.getItem('token')) {
        sessionOrLocal.removeItem('token');
        sessionOrLocal.removeItem('tokenExpiredTime');
      }
      return Promise.reject(res);
    }
  });
}
