export const secondToDateZH = (result) => {
  function mat (ms) {
    let val = ms + '';
    if (val.length < 2) {
      return '0' + val;
    }
    return val;
  }
  let h = mat(Math.floor(result / 3600));
  let m = mat(Math.floor((result / 60 % 60)));
  let s = mat(Math.floor((result % 60)));

  // let _h = h > 0 ? h + "时" : '';
  // let _m = m > 0 ? m + "分" : '';
  // let _s = s > 0 ? s + "秒" : '';
  if (h <= 0) {
    return `${m}:${s}`;
  } else {
    return `${h}:${m}:${s}`;
  }
};
export const liveTag = (val) => {
  /**
   * type  1预约 2直播 3回放 4点播 5结束
   * is_interact 是否互动
   *
   * type: 0直播  1点播  2回放
   * status：0互动直播  1音频直播 2视频直播
   */
  const liveTypeStr = ['', '预约', '直播', '回放', '点播', '结束'];
  const liveStatusStr = ['互动直播', '音频直播', '视频直播'];
  let str = liveTypeStr[val.type];
  if (Number(val.type) !== 4) {
    str += ` | ${liveStatusStr[val.is_interact]}`;
  }
  return str;
};

export const unitCovert = (val) => {
  val = Number(val);
  if (isNaN(val)) return 0;
  if (val > 1e5 && val < 1e8) {
    return `${(val / 1e4).toFixed(2)}万`;
  } else if (val > 1e8) {
    return `${(val / 1e8).toFixed(2)}亿`;
  } else {
    return val;
  }
};

export const subLiveTitle = (str) => {
  return typeof str == 'string' ? `${str.substring(0, 32)}...` : str;
};
