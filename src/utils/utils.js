// session存储（设置、获取、删除）
import fetchData from '@/api/fetch';
import NProgress from 'nprogress';
import Cookies from 'js-cookie';
import { v1 as uuidV1 } from 'uuid';

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
export function isIE() {
  return (
    !!window.ActiveXObject || 'ActiveXObject' in window || navigator.userAgent.indexOf('Edge') > -1
  );
}

export function browserDetect() {
  let chromeReg = /Chrome\/(\d{2})[.\d]+\sSafari\/[.\d]+$/gi;
  let chromeResult = chromeReg.exec(navigator.userAgent);
  let safariReg = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i;
  let safariResult = navigator.userAgent.match(safariReg);
  return chromeResult
    ? !(chromeResult.length == 0 || chromeResult[1] < 61)
    : !(
        !safariResult ||
        safariResult.length == 0 ||
        parseInt(safariResult[1].split('.').join('')) < 121
      );
}

// 尺寸重置
export function resize() {
  if (isIE()) {
    let evt = window.document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
  } else {
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
  }
}

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export const debounce = (function () {
  let timeout = null;
  return function (func, wait = 500, immediate = false) {
    // 清除定时器
    if (timeout !== null) clearTimeout(timeout);
    // 立即执行，此类情况一般用不到
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) typeof func === 'function' && func();
    } else {
      // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
      timeout = setTimeout(function () {
        typeof func === 'function' && func();
      }, wait);
    }
  };
})();

/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export const throttle = (function () {
  let timer, flag;
  return function (func, wait = 500, immediate = true) {
    if (immediate) {
      if (!flag) {
        flag = true;
        // 如果是立即执行，则在wait毫秒内开始时执行
        typeof func === 'function' && func();
        timer = setTimeout(() => {
          flag = false;
        }, wait);
      }
    } else {
      if (!flag) {
        flag = true;
        // 如果是非立即执行，则在wait毫秒内的结束处执行
        timer = setTimeout(() => {
          flag = false;
          typeof func === 'function' && func();
        }, wait);
      }
    }
  };
})();

export function calculateAudioLevel(level) {
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

export function calculateNetworkStatus(status) {
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

export function copy(text) {
  return new Promise((resolve, reject) => {
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = text;
    inputEl.style.height = '0px';
    inputEl.style.position = 'fixed';
    document.documentElement.appendChild(inputEl);
    inputEl.select();
    try {
      let result = document.execCommand('copy');
      if (result) {
        resolve();
      } else {
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
export function dataType(obj) {
  if (obj === null) return 'Null';
  if (obj === undefined) return 'Undefined';
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 **/
export function dealObjectValue(obj) {
  let param = {};
  if (obj === null || obj === undefined || obj === '') return param;
  for (let key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = dealObjectValue(obj[key]);
    } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
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
  } else if (url.indexOf(baseDomain) !== -1) {
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
  // 如果图片域名不是 saas 的域名，直接返回原路径
  if (
    !(url.indexOf('t-alistatic01.e.vhall.com') > -1) &&
    !(url.indexOf('cnstatic01.e.vhall.com') > -1)
  ) {
    return {
      path: url
    };
  }
  // 查找/upload/位置，保留之后的路径

  let targetIndex = url.indexOf('/upload/');
  if (targetIndex > 0) {
    return {
      path: url.substr(targetIndex + 8, url.length)
    };
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
  console.log(file.type.toLowerCase());
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
    if (img.width !== 1280 && img.height !== 720) {
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
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
// 判断是否登录成功
export function checkAuth(to, from, next, that) {
  let isOld = false;
  if (location.search && getQueryString('form') == 1) {
    isOld = true;
  }
  if (
    to.path.indexOf('/keylogin-host') !== -1 ||
    to.path.indexOf('/keylogin') !== -1 ||
    to.path.indexOf('/embedclient') !== -1 ||
    from.path.indexOf('/keylogin') !== -1 ||
    to.path.indexOf('/subscribe') !== -1 ||
    to.path.indexOf('/entryform') !== -1 ||
    to.path.indexOf('/live/watch') !== -1 ||
    to.path.indexOf('/register') !== -1 ||
    to.path.indexOf('/live/room') !== -1 ||
    to.path.indexOf('/forgetPassword') !== -1 ||
    (to.path.indexOf('/live/room') !== -1 && sessionOrLocal.get('interact_token')) ||
    (to.path.indexOf('/chooseWay') !== -1 && sessionOrLocal.get('interact_token')) ||
    to.path.indexOf('/upgrading') !== -1 ||
    to.path.indexOf('/warning/') !== -1 ||
    to.path.indexOf('/cMiddle') != -1 ||
    to.path.indexOf('/privacy') != -1
  ) {
    // 不验证直接进入
    next();
    NProgress.done();
    return;
  }
  // 第一步，判断是否第三方快捷登录
  let user_auth_key = getQueryString('user_auth_key');
  let auth_tag = sessionOrLocal.get('tag', 'localStorage');
  let sourceTag = sessionOrLocal.get('sourceTag');
  let scene_id = 1;
  if (auth_tag) {
    scene_id = auth_tag.indexOf('bind') !== -1 ? 3 : auth_tag === 'withdraw' ? 2 : 1; // 场景id：1登录 2提现绑定 3账户信息-账号绑定
  }
  if (user_auth_key) {
    console.log('第三方登录，需要调取回调函数存储token');
    let params = {
      source: sourceTag ? 2 : 1, // 1 控制塔 2观看端 3admin
      key: getQueryString('user_auth_key'),
      scene_id: scene_id
    };
    fetchData('callbackUserInfo', params, { credentials: true })
      .then(res => {
        if (res.data && res.code === 200) {
          // 登录场景下，存储直接登录
          if (Number(scene_id) === 1) {
            sessionOrLocal.set('token', res.data.token || '', 'localStorage');
            sessionOrLocal.set('tokenExpiredTime', res.data.exp_time, 'localStorage');
            sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage');
            sessionOrLocal.set('sso_token', res.data.sso_token || '');
            sessionOrLocal.set('userId', res.data.user_id || '');
            if (sessionOrLocal.get('userId')) {
              // 用户登录完成后，用户ID写入Cookie
              Cookies.set('gray-id', res.data.user_id, { expires: 30 });
            }
          }
          // 非观看页第三方登录场景，均跳转/home
          if (!sourceTag) {
            if (auth_tag) {
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
          if (auth_tag) {
            if (auth_tag.indexOf('bind') !== -1) {
              sessionOrLocal.set('bind_result', JSON.stringify(res));
              sessionOrLocal.set('user_auth_key', user_auth_key);
              // 绑定成功
              window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=2`;
            } else {
              // 获取回调token失败
              that.$message({
                message: `登录信息获取失败，请重新登录`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              sessionOrLocal.clear('localStorage');
              sessionOrLocal.clear();
            }
          } else {
            that.$message({
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
      })
      .catch(e => {
        // 非200情况下，若是3账户信息-账号绑定，提示当前账号已绑定，请解绑。
        if (auth_tag) {
          if (auth_tag.indexOf('bind') !== -1) {
            sessionOrLocal.set('bind_result', JSON.stringify(e));
            sessionOrLocal.set('user_auth_key', user_auth_key);
            // 绑定成功
            window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/acc/info?tab=2`;
          } else {
            // 获取回调token失败
            that.$message({
              message: '登录信息获取失败，请重新登录',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            sessionOrLocal.clear('localStorage');
            sessionOrLocal.clear();
          }
        } else {
          // 获取回调token失败
          that.$message({
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
    fetchData('planFunctionGet', {})
      .then(res => {
        console.log('>>>>>>>>当前用户-配置项开关内容(utils.js中调用)');
        if (res && res.code === 200) {
          let permissions = res.data.permissions;
          if (permissions) {
            // 设置全部权限
            sessionOrLocal.set('SAAS_VS_PES', permissions, 'localStorage');
          } else {
            sessionOrLocal.removeItem('SAAS_VS_PES');
          }
        }
      })
      .catch(e => {
        console.log(e);
        let out_url = sessionOrLocal.get('SAAS_V3_CTRL_OUT', 'localStorage');
        sessionStorage.clear();
        localStorage.clear();
        if (e.code == 511006) {
          if (out_url) {
            // 清除cookies
            Cookies.remove('gray-id');
            window.location.href = out_url;
          } else {
            next({ path: '/login', query: { form: isOld == 1 ? 1 : 0 } });
          }
        }
        sessionOrLocal.removeItem('SAAS_VS_PES');
      });
    // 登录后，获取用户基本信息
    fetchData('getInfo', { scene_id: 2 })
      .then(res => {
        // debugger;
        if (res.code === 200) {
          if (res.data.is_new_regist == 2) {
            sessionOrLocal.clear();
            sessionOrLocal.clear('localStorage');
            // 清除cookies
            Cookies.remove('gray-id');
            next({ path: '/upgrading' });
            NProgress.done();
          } else {
            // 用户登录完成后，用户ID写入Cookie
            Cookies.set('gray-id', res.data.user_id, { expires: 30 });
          }
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
          sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
          sessionOrLocal.set('currentDate', JSON.stringify(res.data.current_date));
          // 获取配置项所有内容
          if (
            to.path.indexOf('/live/') != -1 &&
            (to.query.webinar_id || to.params.id || to.query.id)
          ) {
            fetchData('planFunctionGet', {
              webinar_id: to.query.webinar_id || to.params.id || to.query.id,
              webinar_user_id: res.data.user_id,
              scene_id: 1
            })
              .then(res => {
                console.log(
                  '>>>>>>>>当前活动-配置项开关内容(utils.js中调用)',
                  to.query.webinar_id,
                  to.params.id,
                  to.query.id
                );
                if (res && res.code === 200 && res.data.permissions) {
                  let permissions = res.data.permissions;
                  if (permissions) {
                    // 设置活动全部权限
                    sessionOrLocal.set('WEBINAR_PES', permissions, 'localStorage');
                  }
                }
              })
              .catch(e => {
                console.log('刷新等情况下获取活动下接口配置项情况，异常不做任何处理');
              });
          }
        } else {
          sessionOrLocal.set('userInfo', null);
          sessionOrLocal.removeItem('token'); // 无效token, 删除token
        }
        // 获取子账号数据
        fetchData('sonCountGet', {})
          .then(result => {
            if (result && result.code === 200) {
              sessionOrLocal.set(SAAS_V3_COL.KEY_1, JSON.stringify(result.data || {}));
            }
          })
          .catch(e => {});
        next();
        NProgress.done();
      })
      .catch(e => {
        console.log(e);
        let out_url = sessionOrLocal.get('SAAS_V3_CTRL_OUT', 'localStorage');
        if (out_url) {
          // 清除cookies
          Cookies.remove('gray-id');
          sessionOrLocal.clear();
          sessionOrLocal.clear('localStorage');
          window.location.href = out_url;
        } else {
          next({ path: '/login' });
          NProgress.done();
        }
      });
  } else {
    // 若无token，专题详情、个人主页亦是可以登录得
    // 清空缓存后的登录页必须通行(否则死循环)
    const pathArr = ['/special/detail', '/user/home', '/login'];
    const canPass = pathArr.some(path => to.path.indexOf(path) > -1);
    if (canPass) {
      next();
      NProgress.done();
      return;
    }
    // 其余退回登录页
    next({ path: '/login', query: { form: isOld == 1 ? 1 : 0 } });
    NProgress.done();
  }
}

// element-ui 中用来判断 text-overflow 的工具方法 start

const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const ieVersion = Number(document.documentMode);

/* istanbul ignore next */
const camelCase = function (name) {
  return name
    .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter;
    })
    .replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
export const getStyle =
  ieVersion < 9
    ? function (element, styleName) {
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'styleFloat';
        }
        try {
          switch (styleName) {
            case 'opacity':
              try {
                return element.filters.item('alpha').opacity / 100;
              } catch (e) {
                return 1.0;
              }
            default:
              return element.style[styleName] || element.currentStyle
                ? element.currentStyle[styleName]
                : null;
          }
        } catch (e) {
          return element.style[styleName];
        }
      }
    : function (element, styleName) {
        if (!element || !styleName) return null;
        styleName = camelCase(styleName);
        if (styleName === 'float') {
          styleName = 'cssFloat';
        }
        try {
          var computed = document.defaultView.getComputedStyle(element, '');
          return element.style[styleName] || computed ? computed[styleName] : null;
        } catch (e) {
          return element.style[styleName];
        }
      };

// element-ui 中用来判断 text-overflow 的工具方法 end

// 刷新 token
export const refreshToken = () => {
  const token = sessionOrLocal.get('token', 'localStorage');
  if (
    token !== undefined &&
    token !== 'undefined' &&
    token !== '' &&
    token !== null &&
    token !== 'null'
  ) {
    //发起端、控制台进入页面添加刷新token机制,每七天刷新一次。  7*24*3600*1000 mm
    let tokenRefresh = sessionOrLocal.get('tokenRefresh', 'localStorage') || new Date().getTime();
    tokenRefresh = parseFloat(tokenRefresh);
    const curTime = new Date().getTime();
    const dur = 7 * 24 * 3600 * 1000;
    console.log('tokenRefresh:', new Date(tokenRefresh).toLocaleString(), tokenRefresh);
    if (curTime - tokenRefresh > dur) {
      return fetchData('refreshToken')
        .then(res => {
          sessionOrLocal.set('token', res.data.token || '', 'localStorage');
          sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage');
          sessionOrLocal.set('tokenExpiredTime', res.data.exp_time, 'localStorage');
        })
        .catch(error => {
          // token 失效
          if (error.code == 511006 || error.code == 511007 || error.code == 511004) {
            sessionOrLocal.removeItem('token');
            sessionOrLocal.removeItem('tokenExpiredTime');
          }
        });
    }
  }
};

// 清空Cookies
export const clearCookies = () => {
  const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (let i = keys.length; i--; ) {
      // document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
      Cookies.remove(keys[i], { path: '' });
    }
  }
  // 重点关注如何清空缓存key
  // Cookies.remove('token', { path: '' })
  // Cookies.remove('sso_token', { path: '' })
};
/**
 * @description 多次替换对一个问题做替换(使用uuid作为占位符)
 * @param longText String 替换前文本
 * @param rules Array 替换前后的数据封装体
 * @returns string
 */
export const replaceWithRules = (longText, rules = []) => {
  rules.forEach(rule => {
    rule.tempSign = uuidV1(); // 先替换为占位符
    longText = longText.replace(rule.before, rule.tempSign);
  });
  rules.forEach(rule => {
    longText = longText.replace(rule.tempSign, rule.after);
  });
  return longText;
};
// 解析纯图片地址
export const getImageQuery = url => {
  if (url.indexOf('?') != -1) {
    let arr = url.split('?');
    return arr[0];
  } else {
    return url;
  }
};
//图片经阿里云转换
export function cropperImage(url) {
  if (url && url.indexOf('?x-oss-process') != -1) {
    return true;
  } else {
    return false;
  }
}

// 是否是空对象
export const isEmptyObj = obj => {
  return Object.keys(obj).length === 0;
};

/**
 * 将 queryString 转换成 key-value 形式
 * @param {String} url url地址
 * @returns object
 */
export const parseQueryString = url => {
  return [...new URL(url).searchParams].reduce(
    (cur, [key, value]) => ((cur[key] = value), cur),
    {}
  );
};

/**
 * 将oss图片地址中的图片处理参数解析成 key-value 的形式
 * @param {String} imgUrl 图片地址
 * @returns Object
 */
export const parseImgOssQueryString = imgUrl => {
  const queryObj = parseQueryString(imgUrl);
  let result = {};

  if (!queryObj['x-oss-process']) {
    return queryObj;
  } else {
    result = { ...queryObj };
    delete result['x-oss-process'];
  }

  const xOssProcessStr = queryObj['x-oss-process'];
  const xOssProcessArr = xOssProcessStr.split(/image\/|x-oss-process=image\/|\//);

  // 解析最外层参数，blur  bright  crop等
  return xOssProcessArr.reduce((currentObj, item) => {
    if (!item) return currentObj;
    const resultKey = item.substring(0, item.indexOf(','));
    let resultVal = null;
    let itemVal = item.substring(item.indexOf(',') + 1);
    if (
      // 亮度、对比度、锐化、渐进显示、旋转、自适应方向、格式转换，直接就是值，不需要再做第二层解析
      ['bright', 'contrast', 'sharpen', 'interlace', 'rotate', 'auto-orient', 'format'].includes(
        resultKey
      )
    ) {
      resultVal = itemVal;
    } else {
      // 解析每个参数具体的值，blur  bright  crop等对应的具体的值
      resultVal = itemVal.split(',').reduce((cur, itemStr) => {
        if (!itemStr) return cur;
        const itemArr = itemStr.split('_');
        cur[itemArr[0]] = itemArr[1];
        return cur;
      }, {});
    }
    currentObj[resultKey] = resultVal;
    return currentObj;
  }, result);
};

export const BgImgsSize = ['100% 100%', 'cover', 'contain'];
export const ImgsSize = ['fill', 'cover', 'scale-down'];
