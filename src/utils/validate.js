// 手机号验证
export const validPhone = (rule, value, callback) => {
  const reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
  if (!value) {
    return callback ? callback(new Error('请填写手机号码')) : false
  } else if (!reg.test(value)) {
    return callback ? callback(new Error('请填写正确的手机号码')) : false
  }else{
    if (callback) {
      callback()
    } else {
      return true
    }
  }
}
