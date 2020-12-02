
const digitsRE = /(\d{3})(?=\d)/g;

export const formatMoney = (value,  decimals = 2) => {
  value = parseFloat(value);
  if (!value && value !== 0) return '';
  const stringified = Math.abs(value).toFixed(decimals);
  const $int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = $int.length % 3;
  const head = i > 0 ? ($int.slice(0, i) + ($int.length > 3 ? ',' : '')) : '';
  const $float = decimals ? stringified.slice(-1 - decimals) : '';
  const sign = value < 0 ? '-' : '';
  return `${sign}${head}${$int.slice(i).replace(digitsRE, '$1,')}${$float}`;
};

export const liveTag = (val) => {
   /**
     * webinar_state  1直播 2预约 3结束 4点播 5回放
     * webinar_type  1音频直播 2视频直播 3互动直播
     */
    const liveTypeStr = ['', '直播', '预约', '结束', '点播', '回放'];
    const liveStatusStr = ['', '音频直播', '视频直播', '互动直播'];
    let str = liveTypeStr[val.webinar_state];
    if (val.webinar_state != 4) {
      str += ` | ${liveStatusStr[val.webinar_type]}`;
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

