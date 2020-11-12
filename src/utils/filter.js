export const secondToDateZH = (result) => {
  function mat (ms) {
    var val = ms + ''
    if (val.length < 2) {
      return '0' + val
    }
    return val
  }
  var h = mat(Math.floor(result / 3600))
  var m = mat(Math.floor((result / 60 % 60)))
  var s = mat(Math.floor((result % 60)))

  // let _h = h > 0 ? h + "时" : '';
  // let _m = m > 0 ? m + "分" : '';
  // let _s = s > 0 ? s + "秒" : '';
  if (h <= 0) {
    return `${m}:${s}`
  } else {
    return `${h}:${m}:${s}`
  }
}
