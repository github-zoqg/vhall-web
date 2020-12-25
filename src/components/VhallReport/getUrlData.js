function getUrlData(url) {
  /* eslint-disable no-new-object */
  let theData = new Object();
  if (url.indexOf('?') != -1) {
    let _index = -1;
    if (url.indexOf('?') > url.indexOf('#/')) {
      _index = url.length;
    } else {
      _index = url.indexOf('#/');
    }

    let str = url.substring(url.indexOf('?') + 1, _index);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theData[strs[i].split('=')[0]] = strs[i].split('=')[1];
    }
  }
  return theData;
}
export default getUrlData;
