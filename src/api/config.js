const apis = {
  // 观看页
  vssInfo: ['/100/v3/users/user/get-info', 'POST', 'mock'], // 获取用户信息
}

const getApi = api => {
  return apis[api] && apis[api]
}

export default getApi
