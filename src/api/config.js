const apis = {
  // 观看页
  vssInfo: ['/100/v3/users/user/get-info', 'POST', 'mock'], // 获取用户信息
  // 直播模块
  createLive: ['/99/v3/webinars/webinar/post-webinar', 'POST', 'mock'], // 创建直播
  liveList: ['/99/v3/webinars/webinar/get-webinar-list', 'POST', 'mock'], // 获取直播列表
  // 功能配置
  planFunctionGet: ['/102/config-type/getconfig', 'post', 'mock'], // 获取可配置项列表
  planFunctionEdit: ['/102/config-type/up_config', 'post', 'mock'], // 修改配置项
};

const getApi = api => {
  return apis[api] && apis[api];
};

export default getApi;
