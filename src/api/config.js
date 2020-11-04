const apis = {
  // 观看页
  vssInfo: ['/100/v3/users/user/get-info', 'POST', 'mock'], // 获取用户信息
  // 功能配置
  planFunctionGet: ['/102/config-type/getconfig', 'post', 'mock'], // 获取可配置项列表
  planFunctionEdit: ['/102/config-type/up_config', 'post', 'mock'], // 修改配置项
}

const getApi = api => {
  return apis[api] && apis[api]
}

export default getApi
