const digitsRE = /(\d{3})(?=\d)/g;

export const formatMoney = (value, decimals = 2) => {
  value = parseFloat(value);
  if (!value && value !== 0) return '';
  const stringified = Math.abs(value).toFixed(decimals);
  const $int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  const i = $int.length % 3;
  const head = i > 0 ? $int.slice(0, i) + ($int.length > 3 ? ',' : '') : '';
  const $float = decimals ? stringified.slice(-1 - decimals) : '';
  const sign = value < 0 ? '-' : '';
  return `${sign}${head}${$int.slice(i).replace(digitsRE, '$1,')}${$float}`;
};

export const formatNum = value => {
  value = parseInt(value);
  let unit = '';
  let k = 99999,
    sizes = ['', '万', '亿', '万亿'],
    i;
  if (value > k) {
    i = Math.floor(Math.log(value) / Math.log(k));
    value = (value / Math.pow(k / 10, i)).toFixed(1);
    unit = sizes[i];
  }
  return value + unit;
};

export const liveTag = val => {
  /**
   * webinar_state  1直播 2预约 3结束 4点播 5回放
   * webinar_type  1音频直播 2视频直播 3互动直播 5定时直播 6分组直播
   */
  const liveTypeStr = ['', '直播', '预告', '结束', '点播', '回放'];
  const liveStatusStr = ['', '音频', '视频', '互动', '', '定时', '分组', '竖屏'];
  let str = liveTypeStr[val.webinar_state];
  if (val.webinar_state != 4) {
    str += ` | ${liveStatusStr[val.webinar_type]}`;
  }
  // if(val.webinar_show_type==0){
  //   str+=' | 竖屏'
  // }
  return str;
};
export const actionTextTag = val => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  // webinar_type  1音频直播 2视频直播 3互动直播 5定时直播
  const liveTypeStr = ['', '直播', '预告', '结束', '点播', '回放'];
  let str =
    val.webinar_type == 5
      ? `${liveTypeStr[val.webinar_state]} | 定时直播`
      : liveTypeStr[val.webinar_state];
  return str;
};
export const actionTag = val => {
  // console.log(val)
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  // webinar_type  1音频直播 2视频直播 3互动直播 5定时直播
  const liveTypeStr = ['', '直播', '预告', '结束', '点播', '回放'];
  const liveStatusStr = ['', '音频', '视频', '互动', '', '', '分组'];
  let str =
    val.webinar_type == 5 || val.webinar_state == 4
      ? `${liveTypeStr[val.webinar_state]}`
      : liveTypeStr[val.webinar_state] + ' | ' + liveStatusStr[val.webinar_type];
  // if(val.webinar_show_type==0){
  //   str+=' | 竖屏'
  // }
  return str;
};
export const actionText = val => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  const liveTypeStr = ['', '直播', '预告', '结束', '点播', '回放'];
  let str = liveTypeStr[val];
  return str;
};
export const unitTime = val => {
  let str;
  if (val) {
    str = val.substring(0, 16);
  }
  return str || '';
};
export const unitCovert = val => {
  val = Number(val);
  if (isNaN(val)) return 0;
  if (val > 1e5 && val < 1e8) {
    return `${(val / 1e4).toFixed(1)}万`;
  } else if (val > 1e8) {
    return `${(val / 1e8).toFixed(1)}亿`;
  } else {
    return val;
  }
};
export const orderTypeText = val => {
  // val  7-结清并发欠费,8-结清流量欠费,10-并发包,11-流量包12-扩展包，13-专业版 ，14回放流量包，15-免费回放流量包，16-并发预充值
  const orderList = [
    '结清并发欠费',
    '结清流量欠费',
    '',
    '并发包',
    '流量包',
    '扩展包',
    '专业版',
    '回放流量包',
    '免费回放流量包',
    '并发预充值'
  ];
  let text = orderList[val - 7];
  return text;
};

export const limitTag = val => {
  // verify  0 免费 1 密码，2 白名单，3 付费活动, 4 邀请码 6.付费+邀请码
  const limitStr = ['免费', '密码', '白名单', '付费活动', '邀请码', '', '付费+邀请码'];
  let str = limitStr[val];
  return str;
};

export const limitText = val => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  const liveTypeStr = ['', '已经开播', '距离直播开始还有', '', '', ''];
  let str = liveTypeStr[val];
  return str;
};

export const liveText = val => {
  // webinar_state  1直播 2预约 3结束 4点播 5回放
  const liveTypeStr = ['', '直播正在进行', '倒计时', '直播已结束', '观众等待中', '已设置回放'];
  let str = liveTypeStr[val];
  return str;
};
//转化电话号码为131****8085
export const filterPhone = value => {
  return String(value).replace(/([0-9]{3})([0-9]{4})([0-9]{4})/, '$1****$3');
};

export const wordStatusCss = ext => {
  console.log(ext);
  ext = ext.toLowerCase();
  if (ext === 'pdf') {
    return 'saasPDFwenjian color-E34522';
  } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'bmp') {
    return 'saastupianwenjian color-794CC5';
  } else if (ext === 'video') {
    return 'saasshipinwenjian color-3562FA';
  } else if (ext === 'doc' || ext === 'docx') {
    return 'saaswordwendang color-3562FA';
  } else if (ext === 'ppt' || ext === 'pptx') {
    return 'saaspptwendang color-FA9A32';
  } else if (ext === 'csv') {
    return 'saasCSVwenjian color-14BA6A';
  } else if (ext === 'xls' || ext === 'xlsx') {
    return 'saasexcelwendang color-14BA6A';
  } else if (ext === 'media') {
    return 'saasyinpinwenjian color-3562FA';
  } else if (ext === 'zip') {
    return 'saasyasuowenjian color-676971';
  } else {
    return 'saasexcelwendang color-14BA6A';
  }
};
export const filterSource = value => {
  let arrType = [
    '线下购买',
    '线上购买',
    '商务合作',
    '客户试用',
    ' 员工账号',
    '研发测试',
    '客户延期'
  ];
  return arrType[value - 5];
};
