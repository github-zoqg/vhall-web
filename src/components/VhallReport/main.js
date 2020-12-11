import ACTION from './actions'
import getUrlData from './getUrlData'
import 'whatwg-fetch'
class VhallReport {
  constructor(params) {
    var { business_uid, bu, pf, activity_id = '', consumer_uid = '', visitor_id = '', service_names, env, standby_2, standby_3, user_id, webinar_id, t_start, entry_time } = params
    this.commonParams = {
      // 业务单元 eg.saas code为0
      bu,
      // 播放平台 eg.H5播放器code为7
      pf,
      business_uid,
      service_names,
      ua: window.navigator.userAgent,
      refer: window.document.referrer,
      user_agent: navigator.userAgent,
      os: 10, // TODO:
      device_id:"",
      type: 'PC', // TODO:
      user_id: user_id, // TODO:
      webinar_id: webinar_id,
      t_start: t_start,
      entry_time: entry_time
    }
    var refer = window.localStorage.getItem('zhike_refer')
    if (refer) {
      this.commonParams.refer = refer
    }
    this.standby_2 = standby_2
    this.standby_3 = standby_3
    this.standy2Arr = [602001, 602002, 602003, 602004, 602007, 602009]
    this.standy3Arr = [602003, 602007]
    this.needEventRefer = [602003, 602007] // 需要从上一个页面的query参数中获取refer的K值
    if (activity_id) {
      this.commonParams.activity_id = activity_id
    }
    if (consumer_uid) {
      this.commonParams.consumer_uid = consumer_uid
    }
    if (visitor_id) {
      this.commonParams.visitor_id = visitor_id
    }
    if (!env) {
      throw new Error('请传入环境变量')
    }
    this.BASE_URL = env === 'test' ? 'https://t-dc.e.vhall.com/login' : 'https://dc.e.vhall.com/login'
    // this.UA = navigator.userAgent.match(/chrome\/([\d\.]+)/i)
  }
  report(action, data = {}, async = true) {
    try {
      if (this.needEventRefer.indexOf(ACTION[action].k) >= 0) {
        if (!data.event) {
          data.event = getUrlData(this.commonParams.refer).refer
        }
      }
      if (action === 'CHAT') {
        data.event = ''
      }
      var params = Object.assign({}, this.commonParams, ACTION[action], data)
      if (this.standy2Arr.indexOf(ACTION[action].k) >= 0) {
        params.standby_2 = this.standby_2
      }
      if (this.standy3Arr.indexOf(ACTION[action].k) >= 0) {
        params.standby_3 = this.standby_3
      }
      var token = window.btoa(JSON.stringify(params))
      var id = `${Date.now()}${Math.floor(Math.random() * 10000)}`
      var url = `${this.BASE_URL}?k=${ACTION[action].k}&id=${id}&bu=${this.commonParams.bu}&token=${token}`
      fetch(url)
    } catch (e) {
      console.warn('数据上报出错', e)
    }
  }
}
export default VhallReport
