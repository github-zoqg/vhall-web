/*
 * 1、时间--时分秒
 * 2、session存储
 * 3、获取地址栏参数
 * 4、获取年月日
 * 5、最近7天、30天和90天
 * 6、进度转换
 */
const mat = ms => {
  const val = ms + '';
  if (val.length < 2) {
    return '0' + val;
  }
  return val;
};
export const secondToDateZH = result => {
  const h = mat(Math.floor(result / 3600));
  const m = mat(Math.floor((result / 60) % 60));
  const s = mat(Math.floor(result % 60));
  if (h < 1) {
    return `${m}:${s}`;
  } else {
    return `${h}:${m}:${s}`;
  }
};
// 定义 sessionStorage
export const session = {
  set: (key, value) => {
    return sessionStorage.setItem(key, JSON.stringify(value));
  },
  get: key => {
    return JSON.parse(sessionStorage.getItem(key));
  },
  removeItem: param => {
    return sessionStorage.removeItem(param);
  }
};

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + '';
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : paddingZero(str)
      );
    }
  }
  return fmt;
}
function paddingZero(str) {
  return ('00' + str).substr(str.length);
}

// 获取地址栏参数
export const getParams = name => {
  const urlSearch = window.location.search;
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var r = urlSearch.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return 'cn';
};

//格式化日期
export function formateDate(timer) {
  // timer是时间戳
  let time = new Date(timer);
  let y = time.getFullYear();
  let m = time.getMonth() + 1;
  let d = time.getDate();
  let h = time.getHours();
  let mm = time.getMinutes();
  let s = time.getSeconds();
  return (
    y +
    '-' +
    mat(m) +
    '-' +
    mat(d) +
    ' ' +
    mat(h) +
    ':' +
    mat(mm) +
    ':' +
    mat(s)
  );
}

export function getRangeDays(value) {
  let date = new Date();
  if (value == 2) {
    // 昨日
    let oldDate = date.setTime(date.getTime() - 3600 * 1000 * 24);
    return formateDate(oldDate);
  } else if (value == 3) {
    // 近7日
    let oldWeek = date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
    return formateDate(oldWeek);
  } else if (value == 4) {
    // 近30日
    let oldMonth = date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
    return formateDate(oldMonth);
  } else {
    return formateDate(date);
  }
}

export function diffToTime(targetStartDate, targetEndDate) {
  let targetStart = new Date(targetStartDate);
  let targetEnd = new Date(targetEndDate);
  if (targetEnd.getTime() - targetStart.getTime() < 0) {
    return false;
  } else {
    targetStart.setTime(targetStart.getTime() + 1000);
    let diff = targetEnd.getTime() - targetStart.getTime();
    let day = Math.floor(diff / (24 * 3600 * 1000));
    let limit1 = diff % (24 * 3600 * 1000);
    let hour = Math.floor(limit1 / (3600 * 1000));

    let limit2 = limit1 % (3600 * 1000);
    let minute = Math.floor(limit2 / (60 * 1000));

    let limit3 = limit2 % (60 * 1000);
    let second = Math.floor(limit3 / 1000);
    if (diff) {
      //
      let diffTime = `${minute}:${second}`;
      console.log('diffTime', diffTime);
      let diffSetTime = window.setTimeout(() => {
        diffToTime(targetStart, targetEnd);
        window.clearTimeout(diffSetTime);
      }, 1000);
      return diffTime;
    } else {
      return false;
    }
  }
}

import moment from 'moment';
// 最近7天、30天和90天
export function getRangeDay() {
  let ret = [];
  let desc = ['最近7天', '最近30天', '最近90天'];
  let diffdays = [7, 30, 90];
  diffdays.forEach((item, index) => {
    ret.push({
      text: desc[index],
      value: [
        moment()
          .subtract(item, 'days')
          .format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
    });
  });
  return ret;
}
