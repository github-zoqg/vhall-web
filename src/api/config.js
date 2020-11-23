const apis = {
  // 资料管理
  datadocList: ['/101/v3/interacts/document/get-shared-document-list', 'GET', 'mock'], //获取文档列表
  dataVideoList: ['/99/v3/webinars/videos/get-video-list', 'POST', 'mock'], //音视频列表
  dataVideoupdate: ['/99/v3/webinars/videos/put-video', 'POST', 'mock'], //音视频编辑
  dataVideoDel: ['/99/v3/webinars/videos/del-video', 'POST', 'mock'], //音视频删除
  dataVideoAdd: ['/99/v3/webianrs/videos/post-video', 'POST', 'mock'], //音视频列表

  // 直播模块
  createLive: ['/99/v3/webinars/webinar/post-webinar', 'POST', 'mock'], // 创建直播 jian.chang
  liveList: ['/99/v3/webinars/webinar/get-webinar-list', 'POST', 'mock'], // 获取直播列表 jian.chang
  // 功能配置
  planFunctionGet: ['/102/config-type/getconfig', 'POST', 'mock'], // 获取可配置项列表 jia.li
  planFunctionEdit: ['/102/config-type/up_config', 'POST', 'mock'], // 修改配置项 jia.li
  // 观看限制
  audienceGet: ['/99/v3/webinars/audience/get-audience', 'POST', 'mock'], // 获取白名单分组列表 Jia.li
  postGroupAdd: ['/99/v3/webinars/audience/post-group', 'POST', 'mock'], // 白名单创建分组 Jia.li
  postGroupDel: ['/99/v3/webinars/audience/del-group', 'POST', 'mock'], // 白名单删除分组 Jia.li
  postGroupEdit: ['/99/v3/webinars/audience/put-group', 'POST', 'mock'], // 白名单分组重命名 Jia.li
  viewerList: ['/99/v3/webinars/audience/get-group-audience', 'POST', 'mock'], // 白名单根据分组获取观众列表 jia.li
  viewerAdd: ['/99/v3/webinars/audience/post-audience', 'POST', 'mock'],// 白名单添加观众至分组 jia.li
  viewerImport: ['/99/v3/webinars/audience/post-excel-audience', 'POST', 'mock'],// 白名单导入观众至分组 jia.li
  viewerEdit: ['/99/v3/webinars/audience/put-audience', 'POST', 'mock'],// 白名单观众信息修改 jia.li
  viewerDel: ['/99/v3/webinars/audience/del-audience', 'POST', 'mock'],// 白名单观众-批量删除 jia.li
  viewerSetGet: ['/99/v3/webinars/webinar/get-webinar-verify', 'POST', 'mock'],// 获取活动观看限制接口 jia.li
  viewerSetSave: ['/99/v3/webinars/verify/post-verify', 'POST', 'mock'],// 观看限制保存接口 jia.li
  fCodeExecute: ['/99/v3/webinars/webinar/post-generate-fcode', 'POST', 'mock'],// 生成验证码 jia.li
  // 自定义菜单
  menuTplList: ['/101/v3/menu-components/list', 'POST', 'mock'], // 控制台-组件列表接口 jia.li
  customMenuList: ['/101/v3/menu-bak/list', 'POST', 'mock'], // 控制台-菜单列表接口 jia.li
  customMenuSave: ['/101/v3/menus/save', 'POST', 'mock'], // 控制台-菜单保存接口 jia.li
  webinarCMenuList: ['/101/v3/webinar-menus/list', 'POST', 'mock'], // 观看端-菜单列表接口 jia.li
  webinarCMenuGet: ['/101/v3/webinar-menus/info', 'POST', 'mock'], // 观看端-单个菜单详情接口 jia.li
  // 虚拟人数 TODO 地址待修改
  virtualSetSave: ['/99/v3/webinars/webinar/post-save-virtual', 'POST', 'mock'], // 控制台-虚拟人数设置 jia.li
  virtualSwitchSet: ['/99/v3/webinars/webinar/post-switch-virtual', 'POST', 'mock'], // 控制台-虚拟人数开关 jia.li
  virtualGet: ['/99/v3/webinars/webinar/post-virtual-info', 'POST', 'mock'], // 控制台-虚拟人数信息获取 jia.li
  // 关键词
  getKeywordList: ['/101/v3/interacts/keyword/get-list', 'POST', 'mock'], // 获取关键词列表[控制台调用] jia.li
  getAllKeywordList: ['/101/v3/interacts/keyword/get-all', 'POST', 'mock'], // 获取所有关键词列表[观看端/发起端调用] jia.li
  multiKeywordAdd: ['/101/v3/interacts/keyword/batch-create', 'POST', 'mock'], // 添加关键词-可批量 jia.li
  multiKeywordEdit: ['/101/v3/interacts/keyword/edit', 'POST', 'mock'], // 修改关键词 jia.li
  multiKeywordDel: ['/101/v3/interacts/keyword/batch-delete', 'POST', 'mock'], // 批量删除关键词 jia.li
  checkUploadKeyword: ['/101/v3/interacts/keyword/check-upload-file', 'POST', 'mock'], // 校验上传文件可以上传的关键词 jia.li
  uploadKeywordAdd: ['/101/v3/interacts/keyword/upload-file-and-create', 'POST', 'mock'], // 上传关键词文件并添加关键词 jia.li
  getKeywordTemplate: ['/101/v3/interacts/keyword/get-template-url', 'POST', 'mock'], // 获取关键词模板地址 jia.li
  // 消息管理
  getMsgList: ['/102/v3/msgs/msg/list', 'POST', 'mock'], // 站内消息列表接口 jia.li
  msgDel: ['/102/v3/msgs/msg/delete', 'POST', 'mock'], // 站内消息删除接口 jia.li
  getMsgInfo: ['/102/v3/msgs/msg/get-info', 'POST', 'mock'], // 站内消息详情接口 jia.li
  getUnreadNum: ['/102/v3/msgs/msg/unread-num', 'POST', 'mock'], // 查询消息未读数 jia.li
  executeUseRead: ['/102/v3/msgs/msg/use-read', 'POST', 'mock'], // 标记已读 jia.li
  // 文件上传(图片)
  uploadImage: ['/102/v3/uploads/upload/index', 'POST', 'mock'], // 文件上传（图片） jia.li

  // 回放模块
  playBackList: ['/99/v3/webinars/record/get-record-list', 'POST', 'mock'], // 回放列表 jian.chang
  playBackEdit: ['/99/v3/webinars/record/put-record', 'POST', 'mock'], // 修改回放标题 jian.chang
  playBackDelete: ['/99/v3/webianrs/record/del-record', 'POST', 'mock'], // 删除回放 jian.chang
  //首页
  getInfo: ['/100/v3/users/user/get-info', 'POST', 'mock'], //获取用户信息（昵称、头像等）场景1：控制台首页 / 场景2：控制台账户信息页
  // 登录
  loginInfo: ['/logins/v3/users/user/login', 'POST'],
  //数据中心
  getDataCenterInfo: ['/103/v3/data-center/account-all-data', 'GET', 'mock'], //获取账户下的总数据
  // 账户管理
  userEdit: ['/100/v3/users/user/edit', 'POST', 'mock'], // 修改用户信息接口 （昵称、头像、公司、职位、控制台标志）
  getSonInfo: ['/100/v3/users/child/get-head-info', 'POST', 'mock'], // 子账号tab页头部信息接口 Jia.li
  childExport: ['/100/v3/users/child/export', 'POST', 'mock'], // 子账号列表导出接口 Jia.li
  getChildCount: ['/100/v3/users/child/count', 'POST', 'mock'], // 获取子账号个数接口 Jia.li
  getSonList: ['/100/v3/users/child/get-list', 'POST', 'mock'], // 获取子账号信息 Jia.li
  sonAdd: ['/100/v3/users/child/create', 'POST', 'mock'], // 子账号创建 Jia.li
  sonDel: ['/100/v3/users/child/delete', 'POST', 'mock'], // 子账号删除 Jia.li
  sonEdit: ['/100/v3/users/child/edit', 'POST', 'mock'], // 子账号修改 Jia.li
  getRoleList: ['/100/v3/users/user-role/list', 'POST', 'mock'], // 角色-用户-获取 Jia.li
  roleAdd: ['/99/v3/webinars/audience/post-group', 'POST', 'mock'], // 角色创建 Jia.li
  roleDel: ['/99/v3/webinars/audience/del-group', 'POST', 'mock'], // 角色删除 Jia.li
  roleEdit: ['/99/v3/webinars/audience/put-group', 'POST', 'mock'], // 角色编辑 Jia.li
  //财务中心
  getVersionInfo: ['/104/v3/finances/account/info', 'GET', 'mock'],  //获取用户版本信息
  orderProfessional: ['/104/v3/finances/order/renew', 'POST', 'mock'], // 专业版购买、续费
  orderFlow: ['/104/v3/finances/order/flow', 'POST', 'mock'], // 流量包购买
  orderUpgrade: ['/104/v3/finances/order/upgrade', 'POST', 'mock'], // 升级并发
  orderExtend: ['/104/v3/finances/order/extend', 'POST', 'mock'], // 购买扩展包
  payOrder: ['/104/v3/finances/pay', 'POST', 'mock'], // 支付订单
  buyDetail: ['/104/v3/finances/order/list', 'GET', 'mock'], // 购买明细
  deleteDetail: ['/104/v3/finances/order/delete', 'GET', 'mock'], // 删除购买明细
  orderDetail: ['/104/v3/finances/admin-order/list', 'GET', 'mock'], // 开通明细
  //财务收益
  incomeInfo: ['/104/v3/finances/income', 'GET', 'mock'], // 账户收益总览
  liveIncomeList: ['/104/v3/finances/income/live/list', 'GET', 'mock'], // 直播收益
  liveIncomeDetailList: ['/104/v3/finances/income/live/details/list', 'GET', 'mock'], // 直播收益详情列表
  packetIncomeList: ['/104/v3/finances/income/red-packet/list', 'GET', 'mock'], // 红包收益
  accountList: ['/104/v3/finances/withdraw/list', 'GET', 'mock'], // 提现明细

  // 直播间内
  initiatorInfo: ['/101/v3/interacts/room/get-room-base-info', 'POST', 'mock'], // 获取房间信息 jian.chang
  getInitiatorReportInfo: ['/api/vss/initiator/report-info', 'POST', 'mock'], // 获取上报信息 jian.chang
  // 观看页
  vssInfo: ['/domian/watchapi/vssInfo', 'POST'], // 获取房间信息 jian.chang
  newWebinarMenus: ['/domian/api/webinar/v1/webinar/webinar-menus-list', 'POST'], // 观看页菜单列表 jian.chang
  goodsInfo: ['/domian/api/webinar/v1/webinar/goods-info', 'POST'], // 商品推荐 jian.chang
  keywordsList: ['/domian/api/webinar/v1/webinar/keywords-list', 'POST'], // 聊天关键词过滤 jian.chang
  getReportInfo: ['/domian/watchapi/reportInfo', 'POST'], // 获取房间Id jian.chang
  getCustomMenuInfo: ['/domian/api/webinar/v1/webinar/webinar-menus-detail', 'POST'], // 获取自定义菜单数据 jian.chang


  //开发设置
  getAppList: ['/100/v3/users/app-keys/get-list', 'POST', 'mock'], // 获取应用列表 jian.chang
  createApp: ['/100/v3/users/app-keys/create', 'POST', 'mock'], // 创建应用 jian.chang
  getAppInfo: ['/100/v3/users/app-keys/get-info', 'POST', 'mock'], // 获取应用详情 jian.chang
  modifyApp: ['/100/v3/users/app-keys/edit', 'POST', 'mock'], // 修改应用 jian.chang

  // 账户管理
  homeInfoGet: ['/100/v3/users/homepage/get-info', 'POST', 'mock'], // 个人主页查询接口 Jia.li
  homeInfoEdit: ['/100/v3/users/homepage/edit', 'POST', 'mock'], // 个人主页更新接口 Jia.li
  checkAccount: ['/100/v3/users/user/check-account', 'POST', 'mock'], // 账号检测接口 Jia.li
  resetPassword: ['/100/v3/users/user/reset-password', 'POST', 'mock'], // 修改密码/密码找回接口 Jia.li
  bindInfo: ['/100/v3/users/user/bind-info', 'POST', 'mock'], // 绑定邮箱、手机号接口 Jia.li

};

const getApi = api => {
  return apis[api] && apis[api];
};

export default getApi;
