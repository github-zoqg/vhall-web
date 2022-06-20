import fetchData from "@/api/fetch";
import { sessionOrLocal } from '@/utils/utils'
let loaded = false // 是否已加载

const ssoAutoLogin = async () => {
  if (loaded) return Promise.resolve() // 已经请求过了, 则不再执行后续逻辑
  return new Promise((resolve) => {
    fetchData('ssoAutoLogin', {
      biz_id: 2
    }, {
      credentials: true // 携带cookie 配置
    }).then(res => {
      if (res.code === 200 && res.data.token) {
        sessionOrLocal.set('token', res.data.token, 'localStorage')
      }
    }).finally(() => {
      loaded = true // 不管接口是否成功, 往下执行
      resolve()
    })
  })
}

export default ssoAutoLogin