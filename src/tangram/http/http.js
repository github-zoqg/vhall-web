import qs from 'qs'
import apis from './config'
import { Message } from 'element-ui'

const fetchData = (config = {}, baseUrl = '', customUrl = '') => {
  return (() => {
    let configFile = Object.assign(apis, config)
    // const user = sessionStorage.getItem('user')
    // let appId = null
    // if (user) {
    //   appId = JSON.parse(user).app_id
    // }

    const getAPI = (apiName) => {
      return configFile[apiName]
    }
    return (apiName, data1 = {}, headData = {}, throttle = 500) => {
      const token = sessionStorage.getItem('vhall-vsstoken')
      const apiConfig = getAPI(apiName)
      const data = Object.assign({
        from: 'js',
        vss_token: token || ''
        // app_id: appId
      }, data1)

      const channel = `${apiName}_${JSON.stringify(data)}`
      // assign Data end
      if (!apiConfig) {
        throw new TypeError('接口未定义!')
      }

      var [api, method, domainType] = apiConfig
      if (method === 'GET' && data) {
        let Uri
        api.indexOf('?') > -1 ? Uri = '&' : Uri = '?'
        Object.keys(data).forEach((key, indx) => {
          if (indx === data.length) {
            Uri = Uri + `${key}=${data[key]}`
          } else {
            Uri = Uri + `${key}=${data[key]}&`
          }
        })
        api = api + Uri
      }
      let headers = Object.assign({
        'Content-Type': 'application/x-www-form-urlencoded'
      }, headData)
      let option = {
        method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors',
        credentials: 'same-origin',
        headers: headers
      }

      if (method === 'POST') {
        option.body = qs.stringify(data) // body data type must match "Content-Type" header
      }

      if (domainType === 't.e') {
        api.indexOf('//') < 0 && (api = customUrl + api)
      } else {
        api.indexOf('//') < 0 && (api = baseUrl + api)
      }
      const vhallFetch = () => new Promise((resolve, reject) => {
        fetch(api, option)
          .then((res) => {
            window.setTimeout(_channelUtils.unlock, +throttle || 0, channel)
            if (res.ok) {
              return res.json()
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject('net work error')
            }
          }).then(res => {
            if (![400, 200, 1001].includes(Number(res.code))) {
              if (res.msg != '重复上麦') {
                Message.error({
                  message: res.msg || '网络开小差了！请刷新',
                  type: 'error'
                })
              }
              reject(res)
            } else {
              resolve(res)
            }
          })
      })
      if (throttle === false) return vhallFetch()
      return _channelUtils.lock(channel, vhallFetch)
    }
  })()
}
/**
 * 接口请求通道锁
 */
const _channelUtils = (function () {
  const _fakePromise = {
    then: () => _fakePromise,
    catch: (cb) => { cb && cb() }
  }
  let _choked = []
  return {
    lock: (name, fn) => {
      const channel = _choked.find(ch => ch === name)
      if (channel) {
        console.warn(`fetchData: channel '${name}' is busy.`)
        return _fakePromise
      }
      _choked.push(name)
      return fn()
    },
    unlock: (name) => {
      _choked = _choked.filter(ch => ch !== name)
    }
  }
}())

export default fetchData
// then(res => {
//   console.log(res)
//   // return Promise.reject(res)
//   if (![400, 200, 1001].includes(Number(res.code))) {
//     // this.$message(res.msg)
//     // eslint-disable-next-line prefer-promise-reject-errors
//     reject(res)
//   } else {
//     resolve(res)
//   }
// })
