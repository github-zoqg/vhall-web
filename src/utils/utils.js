// session存储（设置、获取、删除）
import Env from "@/api/env";

export const sessionOrLocal = {
  set: (key, value, saveType = 'sessionStorage') => {
    if (!key) return;
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    // alert(`当前${sessionOrLocal.saveType}`);
    window[saveType].setItem(key, value);
  },
  get: (key, saveType = 'sessionStorage') => {
    if (!key) return;
    return window[saveType].getItem(key);
  },
  removeItem: (key, saveType = 'sessionStorage') => {
    if (!key) return;
    window[saveType].removeItem(key);
  },
  clear: (saveType = 'sessionStorage') => {
    window[saveType].clear();
  }
};
// 判断是否IE
export function isIE () {
  return (!!window.ActiveXObject || 'ActiveXObject' in window || navigator.userAgent.indexOf("Edge") > -1);
}

export function browserDetect() {
  let chromeReg = /Chrome\/(\d{2})[.\d]+\sSafari\/[.\d]+$/gi;
  let chromeResult = chromeReg.exec(navigator.userAgent);
  let safariReg = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i;
  let safariResult = navigator.userAgent.match(safariReg);
  return chromeResult ? !(chromeResult.length == 0 || chromeResult[1] < 61) : !(!safariResult || safariResult.length == 0 || parseInt(safariResult[1].split('.').join('')) < 121);
}

// 尺寸重置
export function resize () {
  if (isIE()) {
    let evt = window.document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
  } else {
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  }
}

export function calculateAudioLevel (level) {
  let audioLevelValue = 1;
  if (level > 0 && level <= 0.04) {
    audioLevelValue = 1;
  } else if (level > 0.04 && level <= 0.16) {
    audioLevelValue = 2;
  } else if (level > 0.16 && level <= 0.36) {
    audioLevelValue = 3;
  } else if (level > 0.36 && level <= 0.64) {
    audioLevelValue = 4;
  } else if (level > 0.64 && level <= 1) {
    audioLevelValue = 5;
  }
  return audioLevelValue;
}

export function calculateNetworkStatus (status) {
  let netWorkStatus = 2;
  if (status >= 0 && status <= 2) {
    netWorkStatus = 2;
  } else if (status > 2 && status <= 9) {
    netWorkStatus = 1;
  } else if (status > 9 && status <= 100) {
    netWorkStatus = 0;
  } else {
    netWorkStatus = 0;
  }
  return netWorkStatus;
}

export function copy(text){
  return new Promise((resolve, reject)=>{
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = text;
    inputEl.style.height = "0px";
    inputEl.style.position = "fixed";
    document.documentElement.appendChild(inputEl);
    inputEl.select();
    try {
      let result = document.execCommand('copy');
      if(result){
        resolve();
      }else{
        reject(new Error('浏览器暂不支持复制功能，请升级浏览器'));
      }

    } catch (error) {
      reject(error);
    }
    document.documentElement.removeChild(inputEl);
  });
}

/**
 *  判断传入参数的类型，以字符串的形式返回
 **/
export function dataType(obj){
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  return Object.prototype.toString.call(obj).slice(8,-1);
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 **/
export function dealObjectValue(obj){
  let param = {};
  if ( obj === null || obj === undefined || obj === "" ) return param;
  for ( let key in obj ){
    if (dataType(obj[key]) === "Object" ){
      param[key] = dealObjectValue(obj[key]);
    }else if(obj[key] !== null && obj[key] !== undefined && obj[key] !== ""){
      param[key] = obj[key];
    }
  }
  return param;
}

/**
 * domainCovert
 **/
export function domainCovert(baseDomain, url) {
  // 若value包含域名，自动反显；
  // 若value不包含域名，拼接展示。
  if (url === '' || url === undefined || url === null) {
    return url;
  } else if(url.indexOf(baseDomain) !== -1) {
    return url;
  } else {
    return `${baseDomain}${url}`;
  }
}

/**
 * parseURL 路径转换 去除
 * //t-alistatic01.e.vhall.com/upload/
 * 或者
 * //t-vhallsaas-static.oss-cn-beijing.aliyuncs.com/upload/
 **/
export function parseURL(url) {
 /* let a = document.createElement('a');
  a.href = url;
  return {
    path: a.pathname.replace(/^([^\/])/,'/$1').replace('/upload/', '')
  };*/
  // 查找/upload/位置，保留之后的路径

  let targetIndex = url.indexOf('/upload/');
  if (targetIndex > 0) {
    return {
      path: url.substr(targetIndex + 8, url.length)
    }
  } else {
    return {
      path: url
    };
  }
}
export function getQueryString(name) {
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}
