import jsonp from 'jsonp';
/* 封装promise的jsonp请求 */
export default function getJsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + params(data);
  return new Promise(function (resolve, reject) {
    jsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}
/* 处理参数 */
function params(data) {
  let url = '';
  for (const k in data) {
    const val = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(val)}`;
  }
  return url ? url.substring(1) : '';
}
