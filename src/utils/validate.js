import regRule from '@/utils/reg-rule';

// 手机号验证
export const validPhone = (rule, value, callback) => {
  if (!value) {
    return callback ? callback(new Error('请填写手机号码')) : false;
  } else if (!regRule['mobile'].test(value)) {
    return callback ? callback(new Error('请填写正确的手机号码')) : false;
  } else {
    if (callback) {
      callback();
    } else {
      return true;
    }
  }
};
