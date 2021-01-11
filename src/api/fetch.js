import 'whatwg-fetch';
import { v1 as uuidV1 } from 'uuid';
import qs from 'qs';
import getApi from './config';
import { sessionOrLocal } from '../utils/utils';
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
  if (window.location.hash.indexOf('/live/watch/') !== -1) {
    let _live_token = sessionOrLocal.get('live_token', 'localStorage')
    if(_live_token){
      data.live_token = _live_token
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
    'request-id': uuidV1()
  };

  // interact_token && (headers['interact-token'] = interact_token)
  if(window.location.hash.indexOf('/live/watch/') !== -1) {

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
    api = `${api}`
    option.headers = {}
  } else {
    api = `${process.env.VUE_APP_BASE_URL}${api}`;
  }
  return fetch(api, option).then((res) => {
    return res.json();
  }).then(res => {
    let msg = ''
    let errMap = errorMap
    if (res.code === 404 || res.code === 403) {
      sessionStorage.setItem('errorReturn', this.$route.path);
      this.$router.push({
        path: '/error'
      });
    } else if (res.code === 200) {
      return res;
    } else {
      errMap = Object.assign(errMap, extendsMsg)
      msg = errMap[res.code]
      if (msg) {
        // Message.error(res.msg)
        res.msg = msg;
      }
      return Promise.reject(res);
    }
  });
}
