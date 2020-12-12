import 'whatwg-fetch';
import { v1 as uuidV1 } from 'uuid';
import qs from 'qs';
import getApi from './config';
import Env from './env';
import { sessionOrLocal } from '../utils/utils';


export default function fetchData(url, data1 = {}, header = {}) {
  const config = getApi(url);
  let [api, method, mock, paas] = config;
  if (!api) throw TypeError('api 未定义');
  // TODO 临时用大龙Token，后续删除
  // 此token不要删除  --  直播间需要使用   我将你们的token进行注释了
  // sessionStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDY4MTM1MzgsImV4cCI6MTYwOTQwNTUzOCwidXNlcl9pZCI6MTY0MjEzODR9.MgfoflxNLIy6VKRAMXJghdE5Hkjlu-SYstmsME-Xmk8");
  // sessionStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDY4NzY5NjMsImV4cCI6MTYwOTQ2ODk2MywidXNlcl9pZCI6MTY0MjEzODR9.Sc-yqQJ0XStTKm2v0k7Z6FEMA2Tn58RarjndBwVVt8U");
  const token = sessionOrLocal.get('token', 'localStorage') || '';
  let data = Object.assign(data1);
  const interact_token = sessionOrLocal.get('interact_token') || null;
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
    uuid: uuidV1()
    // 'Content-Type': 'application/json'
  };
  if(window.location.hash.indexOf('/live/room/') !== -1 || window.location.hash.indexOf('/live/watch/') !== -1) {
    headers['interact-token']= interact_token;
    // pc观看等
    headers.platform = 7;
  }
  if (header['Content-Type'] === 'multipart/form-data') {
    formData = new FormData();
    for (let key in data) {
      if(data[key] !== null &&  data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key]);
      }
    }
  } else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  let option = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // include: cookie既可以同域发送，也可以跨域发送, *same-origin: 表示cookie只能同域发送，不能跨域发送 omit: 默认值，忽略cookie的发送
    headers: headers
  };
  if (method === 'POST') {
    option.body = formData || qs.stringify(data); // body data type must match "Content-Type" header
  }
  // http://yapi.vhall.domain/mock/100/v3/users/user/get-info
  if (mock) {
    api = `/mock${api}`;
  } else if (paas){
    api = `${api}`
  } else {
    api = `${Env.BASE_URL}${api}`;
  }
  return fetch(api, option).then((res) => {
    return res.json();
  }).then(res => {
    if (res.code === 404 || res.code === 403) {
      sessionStorage.setItem('errorReturn', this.$route.path);
      this.$router.push({
        path: '/error'
      });
    } else if (res.code >= 10000 && res.code < 17000 || res.code === 200) {
      return res;
    } else {
      return Promise.reject(res);
    }
  });
}
