// session存储（设置、获取、删除）
import fetchData from "@/api/fetch";
import NProgress from "nprogress";


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
window.testSess = sessionOrLocal
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

// 防抖
export const debounce = (function () {
  let timer = 0
  return function (callback, ms) {
    clearTimeout(timer)
    timer = setTimeout(callback, ms)
  }
})()

// 节流
export const throttle = function(func, delay) {
  let timer = null;
  let startTime = Date.now();
  return function() {
      const curTime = Date.now();
      const remaining = delay - (curTime - startTime);
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      if (remaining <= 0) {
          func.apply(context, args);
          startTime = Date.now();
      } else {
          timer = setTimeout(func, remaining);
      }
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

/**
 * 验证文件格式与大小
 * @param file 文件
 * @param that 提示消息类型
 * @param type 类型
 * @returns {Boolean} 验证通过还是失败
 */
export function checkUploadType(file, that, type = 1) {
  const typeList = type === 1 ? ['png', 'jpeg', 'gif', 'bmp'] : [];
  console.log(file.type.toLowerCase())
  let typeArr = file.type.toLowerCase().split('/');
  const isType = typeList.includes(typeArr[typeArr.length - 1]);
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isType) {
    that.$message({
      message: `上传封面图片只能是 ${typeList.join('、')} 格式`,
      showClose: true,
      // duration: 0,
      type: 'error',
      customClass: 'zdy-info-box'
    });
    return false;
  }
  if (!isLt2M) {
    that.$message({
      message: `上传封面图片大小不能超过 2M`,
      showClose: true,
      // duration: 0,
      type: 'error',
      customClass: 'zdy-info-box'
    });
    return false;
  }
  let imgSrc = window.URL.createObjectURL(file);
  let img = new Image();
  img.src = imgSrc;
  img.onload = function () {
    // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
    if (img.width !== 1280 && img.height !== 720 ) {
      that.$message({
        message: `请上传1280*720尺寸图片`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
      return false;
    }
  };
  return isType && isLt2M;
}

export function getQueryString(name) {
  let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if(r!=null)return  unescape(r[2]); return null;
}
// 判断是否登录成功
export function checkAuth(to, from, next) {

  if(to.path.indexOf('/keylogin-host') !== -1 ||
    to.path.indexOf('/keylogin') !== -1 || to.path.indexOf('/embedclient') !== -1 ||
    from.path.indexOf('/keylogin') !== -1 ||
    to.path.indexOf('/subscribe') !== -1 ||
    to.path.indexOf('/entryform') !== -1 ||
    to.path.indexOf('/live/watch') !== -1 ||
    to.path.indexOf('/login') !== -1 ||
    to.path.indexOf('/register') !== -1 ||
    to.path.indexOf('/live/room') !== -1 ||
    to.path.indexOf('/forgetPassword') !== -1 || (to.path.indexOf('/live/room') !== -1 && sessionOrLocal.get('interact_token'))
    || (to.path.indexOf('/chooseWay') !== -1 && sessionOrLocal.get('interact_token')) ) {
    // 不验证直接进入
    next();
    NProgress.done();
    return;
  }
  // 第一步，判断是否第三方快捷登录
  let user_auth_key = getQueryString('user_auth_key');
  let auth_tag = sessionOrLocal.get('tag', 'localStorage');
  let sourceTag = sessionOrLocal.get('sourceTag')
  let scene_id = 1;
  if (auth_tag) {
    scene_id = auth_tag.indexOf('bind') !== -1 ? 3 : auth_tag === 'withdraw' ? 2 : 1 // 场景id：1登录 2提现绑定 3账户信息-账号绑定
  }
  if (user_auth_key) {
    console.log('第三方登录，需要调取回调函数存储token');
    let params = {
      source: sourceTag ? 2 : 1, // 1 控制塔 2观看端 3admin
      key: getQueryString('user_auth_key'),
      scene_id: scene_id
    };
    fetchData('callbackUserInfo', params).then(res => {
      if (res.data && res.code === 200) {
        // 登录场景下，存储直接登录
        if(Number(scene_id) === 1) {
          sessionOrLocal.set('token', res.data.token || '', 'localStorage');
          sessionOrLocal.set('tokenExpiredTime', res.data.exp_time, 'localStorage')
          sessionOrLocal.set('sso_token', res.data.sso_token || '');
          sessionOrLocal.set('userId', res.data.user_id || '');
        }
        // 非观看页第三方登录场景，均跳转/home
        if (!sourceTag) {
          if(auth_tag) {
            if (auth_tag.indexOf('bind') !== -1) {
              // 绑定成功
              window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=2`;
            }
          } else {
            window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/home`;
          }
          return;
        }
      } else {
        // 非200情况下，若是3账户信息-账号绑定，提示当前账号已绑定，请解绑。
        if(auth_tag) {
          if (auth_tag.indexOf('bind') !== -1) {
            sessionOrLocal.set('bind_result', JSON.stringify(res));
            sessionOrLocal.set('user_auth_key', user_auth_key);
            // 绑定成功
            window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=2`;
          } else {
            // 获取回调token失败
            this.$message({
              message: `登录信息获取失败，请重新登录`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            sessionOrLocal.clear('localStorage');
            sessionOrLocal.clear();
          }
        } else{
          this.$message({
            message: res.msg || '异常请求，无法操作',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          sessionOrLocal.clear('localStorage');
          sessionOrLocal.clear();
        }
      }
    }).catch(e => {
      // 非200情况下，若是3账户信息-账号绑定，提示当前账号已绑定，请解绑。
      if(auth_tag) {
        if (auth_tag.indexOf('bind') !== -1) {
          sessionOrLocal.set('bind_result', JSON.stringify(e));
          sessionOrLocal.set('user_auth_key', user_auth_key);
          // 绑定成功
          window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=2`;
        } else {
          // 获取回调token失败
          this.$message({
            message: '登录信息获取失败，请重新登录',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          sessionOrLocal.clear('localStorage');
          sessionOrLocal.clear();
        }
      } else{
        // 获取回调token失败
        this.$message({
          message: e.msg || '登录信息获取失败，请重新登录',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        sessionOrLocal.clear('localStorage');
        sessionOrLocal.clear();
      }
    });
    return;
  }
  // 第二步，判断是否控制台 或者 地址栏token携带进入
  let token = sessionOrLocal.get('token', 'localStorage') || '';
  if (token) {
    console.log('正常登录、快捷登录，存在token数据');
    // 已登录不准跳转登录页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
      return;
    }
    // 获取配置项所有内容
    fetchData('planFunctionGet', {}).then(res => {
      if(res && res.code === 200) {
        let permissions = res.data.permissions;
        if(permissions) {
          // 设置全部权限
          sessionOrLocal.set('SAAS_VS_PES', permissions, 'localStorage');
        } else {
          sessionOrLocal.removeItem('SAAS_VS_PES');
        }
      }
    }).catch(e => {
      console.log(e);
      sessionOrLocal.removeItem('SAAS_VS_PES');
    });
    // 登录后，获取用户基本信息
    fetchData('getInfo', {scene_id: 2}).then(res => {
      // debugger;
      if(res.code === 200) {
        sessionOrLocal.set('userInfo', JSON.stringify(res.data));
        sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
        sessionOrLocal.set('currentDate', JSON.stringify(res.data.current_date));
      } else {
        sessionOrLocal.set('userInfo', null);
      }
      // 获取子账号数据
      fetchData('sonCountGet', {}).then(result => {
        if( result && result.code === 200) {
          sessionOrLocal.set(SAAS_V3_COL.KEY_1, JSON.stringify(result.data || {}));
        }
      }).catch(e=> {});
      next();
      NProgress.done();
    }).catch(e=>{
      console.log(e);
      NProgress.done();
    });
  } else {
    // 若无token，专题详情、个人主页亦是可以登录得
    if(to.path.indexOf('/special/detail') !== -1 || to.path.indexOf('/user/home') !== -1) {
      next();
      NProgress.done();
      return;
    }
    next({path: '/login'});
    NProgress.done();
  }
}
