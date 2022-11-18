/**
 * 项目全部使用的正则规则
 */

const regRule = {
  mobile: /^1[3|4|5|6|7|8|9]\d{9}$/, //移动手机号
  pwd: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\W]{6,30}$/, //可输入密码情况,
  email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/ //邮箱
};

export default regRule;
