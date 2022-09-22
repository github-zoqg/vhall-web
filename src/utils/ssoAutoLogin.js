import fetchData from "@/api/fetch";
import { sessionOrLocal } from '@/utils/utils'
import Cookies from 'js-cookie';
const bizId = 2 // 化蝶的业务线id
const platform = 17 // 控制台的平台配置
let loaded = false // 是否已加载

/**
 * @description 验证cookie是否需要请求接口置换token
 * @returns true 需要, false 不需要
 */
function verifyCookie() {
  const ssoToken = Cookies.get('sso_token') // 用户中心的用户token
  const ssoLoginStatus = Cookies.get('sso_login_status') // 用户在用户中心的状态(1为登录)
  const ssoTokenOrigin = Cookies.get('sso_token_origin') // 用户登录的业务线
  if (ssoLoginStatus === '0') {
    sessionOrLocal.removeItem('token', 'localStorage')
    return false
  }
  if (!ssoToken) return false
  const currentOrigin = `${bizId}_${platform}`
  const isSameOrigin = (ssoTokenOrigin === currentOrigin) // 是否同业务线
  return !isSameOrigin
}

const ssoAutoLogin = async () => {
  if (loaded || !verifyCookie()) return Promise.resolve() // 已经请求过了 或 cookie验证不通过, 则不再执行请求
  return new Promise((resolve) => {
    fetchData('ssoAutoLogin', {
      biz_id: bizId
    }, {
      credentials: true // 携带cookie 配置
    }).then(res => {
      if (res.code === 200) {
        const data = res.data
        // 登出操作
        if (data.login_status === 0) return sessionOrLocal.removeItem('token', 'localStorage')
        data.token && sessionOrLocal.set('token', data.token, 'localStorage')
        sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage')
      }
    }).finally(() => {
      loaded = true // 不管接口是否成功, 往下执行
      resolve()
    })
  })
}

export default ssoAutoLogin
