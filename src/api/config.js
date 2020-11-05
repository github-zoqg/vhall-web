const apis = {
  // 观看页
  vssInfo: ['/100/v3/users/user/get-info', 'POST', 'mock'], // 获取用户信息 xiaoshuai.chen
  // 直播模块
  createLive: ['/99/v3/webinars/webinar/post-webinar', 'POST', 'mock'], // 创建直播 jian.chang
  liveList: ['/99/v3/webinars/webinar/get-webinar-list', 'POST', 'mock'], // 获取直播列表 jian.chang
  // 功能配置
  planFunctionGet: ['/102/config-type/getconfig', 'POST', 'mock'], // 获取可配置项列表 jia.li
  planFunctionEdit: ['/102/config-type/up_config', 'POST', 'mock'], // 修改配置项 jia.li
  // 观看限制
  audienceGet: ['/99/v3/webinars/audience/get-audience', 'POST', 'mock'], // 获取白名单分组列表 Jia.li
  postGroupAdd: ['/99/v3/webinars/audience/post-group', 'POST', 'mock'], // 白名单创建分组 Jia.li
  postGroupDel: ['/99/v3/webinars/audience/del-group', 'POST', 'mock'], // 白名单删除分组 Jia.li
  postGroupEdit: ['/99/v3/webinars/audience/put-group', 'POST', 'mock'], // 白名单分组重命名 Jia.li
  viewerList: ['/99/v3/webinars/audience/get-group-audience', 'POST', 'mock'], // 白名单根据分组获取观众列表 jia.li
  viewerAdd: ['/99/v3/webinars/audience/post-audience', 'POST', 'mock'],// 白名单添加观众至分组 jia.li
  viewerImport: ['/99/v3/webinars/audience/post-excel-audience', 'POST', 'mock'],// 白名单导入观众至分组 jia.li
  viewerEdit: ['/99/v3/webinars/audience/put-audience', 'POST', 'mock'],// 白名单观众信息修改 jia.li
  viewerDel: ['/99/v3/webinars/audience/del-audience', 'POST', 'mock'],// 白名单观众-批量删除 jia.li
  viewerSetGet: ['/99/v3/webinars/webinar/get-webinar-verify', 'POST', 'mock'],// 获取活动观看限制接口 jia.li
  viewerSetSave: ['/99/v3/webinars/verify/post-verify', 'POST', 'mock'],// 观看限制保存接口 jia.li
  fCodeExecute: ['/99/v3/webinars/webinar/post-generate-fcode', 'POST', 'mock'],// 生成验证码 jia.li
};

const getApi = api => {
  return apis[api] && apis[api];
};

export default getApi;
