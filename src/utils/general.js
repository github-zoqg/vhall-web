/*
 * 1、时间--时分秒
 * 2、session存储
 * 3、获取地址栏参数
 * 4、获取年月日
 * 5、最近7天、30天和90天
 */
const mat = ms => {
  const val = ms + ''
  if (val.length < 2) {
    return '0' + val
  }
  return val
}
export const secondToDateZH = result => {
  const h = mat(Math.floor(result / 3600))
  const m = mat(Math.floor((result / 60) % 60))
  const s = mat(Math.floor(result % 60))
  if (h < 1) {
    return `${m}:${s}`
  } else {
    return `${h}:${m}:${s}`
  }
}
// 定义 sessionStorage
export const session = {
  set: (key, value) => {
    return sessionStorage.setItem(key, JSON.stringify(value))
  },
  get: key => {
    return JSON.parse(sessionStorage.getItem(key))
  },
  removeItem: param => {
    return sessionStorage.removeItem(param)
  }
}

export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : paddingZero(str)
      )
    }
  }
  return fmt
}
function paddingZero(str) {
  return ('00' + str).substr(str.length)
}

// 获取地址栏参数
export const getParams = name => {
  const urlSearch = window.location.search
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = urlSearch.substr(1).match(reg)
  if (r != null) return unescape(r[2]);
  return 'cn'
}

import moment from 'moment'
// 最近7天、30天和90天
export function getRangeDay () {
  let ret = []
  let desc = ['最近7天', '最近30天', '最近90天']
  let diffdays = [7, 30, 90]
  diffdays.forEach((item, index) => {
    ret.push({
      text: desc[index],
      value: [
        moment().subtract(item, 'days').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
    })
  })
  return ret
}
