import 'whatwg-fetch';
import qs from 'qs';
import getApi from './config';

export default function fetchData(url, data1 = {}, header = {}) {
  const config = getApi(url);

  let [api, method, mock] = config;
  if (!api) throw TypeError('api 未定义');

  const token = sessionStorage.getItem('token') || 'vsstoken';
  const vc_cookie = localStorage.getItem('vc_cookie') || '';
  let data;
  if (token) {
    data = Object.assign(  { token, vc_cookie, platform: 'pc', need_sign: 1 },
      data1
    );
  } else {
    data = Object.assign({ vc_cookie, platform: 'pc', need_sign: 1}, data1);
  }

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
    // 'Content-Type': 'application/json'
  };

  if (header['Content-Type'] === 'multipart/form-data') {
    formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
  } else {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  let option = {
    method, // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    credentials: 'same-origin', // include, *same-origin, omit
    headers: headers
  };
  if (method === 'POST') {
    option.body = formData || qs.stringify(data); // body data type must match "Content-Type" header
  }
  // http://yapi.vhall.domain/mock/100/v3/users/user/get-info
  if (mock) {
    api = `/mock${api}`;
  }
  return fetch(api, option).then((res) => {
    return res.json();
  }).then(res => {
    // || res.code === 500
    if (res.code === 404 || res.code === 403 ) {
      sessionStorage.setItem('errorReturn', this.$route.path);
      this.$router.push({
        path: '/error'
      });
    }else if (res.code >= 200 && res.code < 600) {
      return res;
    } else {
      return Promise.reject(res);
    }
    // else {
    //     EventBus.$message({
    //         message: res.msg,
    //         type: 'error'
    //     })
    // }
  });
}
