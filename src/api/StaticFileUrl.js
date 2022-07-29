var SignUploadTemplateUrlNew = [
  'http://t-alistatic01.e.vhall.com/static/download/%E9%A2%84%E6%8A%A5%E5%90%8D%E6%A8%A1%E6%9D%BF.xlsx', //  报名表单-下载上传模板-静态地址（历史） --- 测试
  'http://cnstatic01.e.vhall.com/static/download/%E9%A2%84%E6%8A%A5%E5%90%8D%E6%A8%A1%E6%9D%BF.xlsx', //  报名表单-下载上传模板-静态地址（历史） --- 线上
  'https://t-alistatic01.e.vhall.com/upload/webinars/form-user-docs/2c/d8/2cd89b70a87219d823516fa589e8111e.xlsx', // 报名表单-下载上传模板-静态地址（化蝶新活动）--- 测试
  'https://cnstatic01.e.vhall.com/upload/webinars/form-user-docs/2c/d8/2cd89b70a87219d823516fa589e8111e.xlsx' // 报名表单-下载上传模板-静态地址（化蝶新活动）--- 线上
]
var StaticFileUrlsMap= {
  /**
   * getSignDownUrl 获取报名表单下载模板路径
   * @param {*} processKey 传递当前环境标记，当前指的是 process.env.NODE_ENV
   * @param {*} isNew 是否新活动下载地址？true 是；false 否。
   * @returns
   */
  getSignDownTemplateUrl(processKey, isNew) {
    return ['production', 'pre'].includes(processKey) ? SignUploadTemplateUrlNew[isNew ? 3 : 1] : SignUploadTemplateUrlNew[isNew ? 2 : 0]
  }
};
export default StaticFileUrlsMap;
