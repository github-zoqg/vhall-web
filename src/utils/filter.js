
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
export const actionText = (val) => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  const liveTypeStr = ['', '直播', '预约', '结束', '点播', '回放'];
  let str = liveTypeStr[val];
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
export const orderTypeText = (val) => {
  // val  7-结清并发欠费,8-结清流量欠费,10-并发包,11-流量包12-扩展包，13-专业版 ，14回放流量包，15-免费回放流量包，16-并发预充值
  const orderList = ['结清并发欠费', '结清流量欠费', '', '并发包', '流量包12', '扩展包', '专业版', '回放流量包', '免费回放流量包', '并发预充值'];
  let text = orderList[val - 7];
  return text;
};

export const limitTag = (val) => {
  // verify  0 免费 1 密码，2 白名单，3 付费活动, 4 F码
  const limitStr = ['免费', '密码',  '白名单', '付费活动', 'F码'];
  let str = limitStr[val];
  return str;
};

export const limitText = (val) => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  const liveTypeStr = ['', '已经开播', '距离直播开始还有', '', '', ''];
  let str = liveTypeStr[val];
  return str;
};

export const liveText = (val) => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  const liveTypeStr = ['', '直播正在进行', '倒计时', '直播已结束', '观众等待中', '已设置回放'];
  let str = liveTypeStr[val];
  return str;
};
//转化电话号码为131****8085
export const filterPhone = (value) => {
  return  String(value).replace( /([0-9]{3})([0-9]{4})([0-9]{4})/,"$1****$3");
};

export const wordStatusCss = (ext) => {
  if (ext === 'pdf') {
    return 'saasPDFwenjian';
  } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'bmp') {
    return 'saastupianwenjian';
  } else if (ext === 'video') {
    return 'saasshipinwenjian';
  } else if (ext === 'doc' || ext === 'docx') {
    return 'saaswordwendang';
  } else if (ext === 'ppt' || ext === 'pptx') {
    return 'saaspptwendang';
  } else if (ext === 'csv') {
    return 'saasCSVwenjian';
  } else if (ext === 'xls' || ext === 'xlsx') {
    return 'saasexcelwendang';
  } else if (ext === 'media') {
    return 'saasyinpinwenjian';
  }
}

