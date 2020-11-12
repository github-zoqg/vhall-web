/**
 * 时间格式化
 * 将秒转化为hh:mm:ss显示
 * value 刻度尺格数
 * currentUnit当前时间转换比例
 */
const formatTime = value => {
  // value = parseInt(value) * currentUnit
  var hh = Math.floor(value / 3600);
  if (hh < 10) hh = '0' + hh;
  var mm = Math.floor((value - hh * 3600) / 60);
  if (mm < 10) mm = '0' + mm;
  var ss = Math.floor((value - hh * 3600) % 60);
  if (ss < 10) ss = '0' + ss;
  var length = hh + ':' + mm + ':' + ss;
  if (value >= 0) {
    return length;
  } else {
    return '';
  }
};

/**
 * 按照数组的第1个值升序排列
 */
const descend = (x, y) => {
  return x.startTime - y.startTime;
};
export { formatTime, descend };
