const apis = {
  // 资料管理
  datadocList: ['/101/v3/interacts/document/get-shared-document-list', 'GET', 'mock'], //获取文档列表
  dataVideoList: ['/99/v3/webinars/videos/get-list', 'POST', 'mock'], //音视频列表
  dataVideoupdate: ['/99/v3/webinars/videos/edit', 'POST', 'mock'], //音视频编辑
  dataVideoDel: ['/99/v3/webinars/videos/delete', 'POST', 'mock'], //音视频删除
  dataVideoAdd: ['/99/v3/webianrs/videos/create', 'POST', 'mock'], //音视频列表

  shareGiftList: ['/v3/interacts/gift/shared-gift-list', 'GET'], // 共享礼物库
  editGiftInfo: ['/v3/interacts/gift/update-shared-gift', 'POST'], // 更新共享库礼品信息
  createGiftInfo: ['/v3/interacts/gift/create-shared-gift', 'POST'], // 创建共享库礼品信息
  deleteGift: ['/v3/interacts/gift/create-shared-gift', 'POST'], // 删除共享库礼品
  liveGiftList: ['/v3/interacts/gift/get-webinar-using-gift-list', 'GET'], // 活动下礼物库

  //广告推荐
  getAdvList: ['/101/v3/interacts/recommend-adv/get-adv-list', 'GET', 'mock'], //获取广告列表
  getActivityList: ['/101/v3/interacts/recommend-adv/database-to-activity', 'POST', 'mock'], //从资料库保存到活动
  createAdv: ['/101/v3/interacts/recommend-adv/create-adv', 'POST', 'mock'], //创建广告
  updateAdv: ['/101/v3/interacts/recommend-adv/update-adv', 'POST', 'mock'], //编辑广告
  deleteAdv: ['/101/v3/interacts/recommend-adv/batch-delete-adv', 'POST', 'mock'], //批量删除广告
  viewAdv: ['/101/v3/interacts/recommend-adv/view-adv', 'GET', 'mock'], //查看单条广告详情

  //播放器设置
  setScrolling: ['/101/v3/interacts/players/set-scrolling-screen-config', 'POST', 'mock'], //直播设置_设置播放器跑马灯
  setWatermark: ['/101/v3/interacts/players/set-watermark-config', 'POST', 'mock'], //从资料库保存到活动
  getScrolling: ['/101/v3/interacts/players/get-scrolling-screen-config', 'GET', 'mock'], //观看端_获取跑马灯设置配置信息
  getWatermark: ['/101/v3/interacts/players/get-watermark-config', 'GET', 'mock'], //观看端_获取水印设置

  //公众号 开屏海报
  setPublicInfo: ['/101/v3/interacts/adv/set-public-account-config-info', 'POST', 'mock'], //保存公众号展示配置
  getPublicInfo: ['/101/v3/interacts/adv/get-public-account-config-info', 'GET', 'mock'], //获取公众号展示配置信息
  setPosterInfo: ['/101/v3/interacts/adv/set-screen-poster-config-info', 'POST', 'mock'], //保存开屏海报配置
  getPosterInfo: ['/101/v3/interacts/adv/get-screen-poster-config-info', 'GET', 'mock'], //获取开屏海报配置信息
  getScreenPublicInfo: ['/101/v3/interacts/adv/watch-get-public-account', 'GET', 'mock'], //直播设置_观看端_获取公众号广告
  getScreenPosterInfo: ['/101/v3/interacts/adv/watch-get-screen-poster', 'GET', 'mock'], //直播设置_观看端_获取开屏海报

  //  邀请卡
  getCardDetailInfo: ['/101/v3/interacts/invite-card/get-info', 'POST', 'mock'], //获取邀请卡详情
  setCardStatus: ['/101/v3/interacts/invite-card/set-card-status', 'POST', 'mock'], //开启/关闭邀请卡
  editCardStatus: ['/101/v3/interacts/invite-card/edit', 'POST', 'mock'], //修改邀请卡信息
  createRelation: ['/101/v3/interacts/invite-card/create-invite-self-relation', 'POST', 'mock'], //创建邀请人邀请自己的邀请关系
  createOtherRelation: ['/101/v3/interacts/invite-card/create-invite-othor-relation', 'POST', 'mock'], //创建邀请人邀请被邀请人的邀请关系
  getCardList: ['/101/v3/interacts/invite-card/get-list', 'POST', 'mock'], //获取邀请列表
  getTopList: ['/101/v3/interacts/invite-card/get-top-list', 'POST', 'mock'], //获取邀请榜


  // 直播模块
  createLive: ['/v3/webinars/webinar/create', 'POST'], // 活动创建/直播创建 jian.chang  √
  liveList: ['/v3/webinars/webinar/get-list', 'POST'], // 获取直播列表 jian.chang
  getWebinarInfo: ['/v3/webinars/webinar/info', 'POST'], // 查询活动基础信息接口 •••
  liveEdit: ['/99/v3/webinars/webinar/edit', 'POST', 'mock'], // 活动修改 •••
  liveDel: ['/99/v3/webinars/webinar/delete', 'POST', 'mock'], // 活动删除 •••
  demandCreate: ['/99/v3/webinars/webinar/create-demand', 'POST', 'mock'], // 点播创建

  // 专题
  subjectCreate: ['/v3/webinars/subject/create', 'POST'], // 专题创建 √
  subjectList: ['/v3/webinars/subject/get-list', 'POST'], // 专题列表 √有问题
  subjectEdit: ['/v3/webinars/subject/edit', 'POST'], // 专题修改  •••
  subjectInfo: ['/v3/webinars/subject/info', 'POST'], // 获取专题详情接口(专题预览)  •••
  subjectDel: ['/v3/webinars/subject/delete', 'POST'], // 专题删除接口 •••
  // 角色邀请
  privilegeInfo:  ['/v3/webinars/privilege/info', 'POST'], // 获取活动角色配置接口 •••
  privilegeOpen:  ['/v3/webinars/privilege/open-privilege', 'POST'], // 开启关闭角色开关 •••
  privilegeEdit:  ['/v3/webinars/privilege/edit-pass', 'POST'], // 角色密码修改接口（口令修改） •••
  privilegePrem:  ['/v3/webinars/privilege/edit-premission', 'POST'], // 角色邀请——权限修改接口 •••

  // 第三方K值模块
  kidAuthInfo:  ['/v3/webinars/auth/info', 'POST'], // 获取单个活动K值详情接口 •••
  kidAuthEdit:  ['/v3/webinars/auth/edit', 'POST'], // 单个活动K值设置修改接口 •••


  // 暖场视频
  warmCreate: ['/99/v3/webinars/warm/create', 'POST', 'mock'], // 添加暖场视频
  warnInfo: ['/99/v3/webinars/warm/info', 'POST', 'mock'], // 获取暖场视频详情接口 •••
  warnDelete: ['/99/v3/webinars/warm/delete', 'POST', 'mock'], // 删除暖场视频 •••
  warnEdit: ['/99/v3/webinars/warm/edit', 'POST', 'mock'], // 修改暖场视频封面图片接口 •••

  // 商品
  goodsGet: ['/101/v3/interacts/goods/get-webinar-goods-list', 'GET', 'mock'], // 获取活动下商品列表
  goodsEnable: ['/101/v3/interacts/goods/enable-webinar-goods', 'POST', 'mock'], // 商品上架
  goodsDisable: ['/101/v3/interacts/goods/disable-webinar-goods', 'POST', 'mock'], // 商品下架
  goodsCopy: ['/101/v3/interacts/goods/clone-goods', 'POST', 'mock'], // 复制一个商品
  goodsInfoGet: ['/101/v3/interacts/goods/get-webinar-goods-info', 'GET', 'mock'], // 查看活动下某个商品详情
  goodsCreate: ['/101/v3/interacts/goods/create-goods', 'POST', 'mock'], // 新建活动展示商品
  goodsUpdate: ['/101/v3/interacts/goods/update-goods', 'POST', 'mock'], // 更新商品信息
  goodsImgIdCreate: ['/101/v3/interacts/goods/generate-goods-image-id', 'POST', 'mock'], // 生成商品图片ID
  goodsBatchDel: ['/101/v3/interacts/goods/batch-delete-goods', 'POST', 'mock'], // 批量删除活动商品
  goodsImgDel: ['/101/v3/interacts/goods/delete-goods-img', 'POST', 'mock'], // 删除活动商品图片
  goodsSetCover: ['/101/v3/interacts/goods/set-goods-cover', 'POST', 'mock'], // 设置商品默认封面

  // 功能配置
  planFunctionGet: ['/102/config-type/getconfig', 'POST', 'mock'], // 获取可配置项列表 jia.li
  planFunctionEdit: ['/102/config-type/up_config', 'POST', 'mock'], // 修改配置项 jia.li

  // 观看限制
  audienceGet: ['/v3/webinars/audience/get-group-list', 'POST'], // 获取白名单分组列表 Jia.li  √
  postGroupAdd: ['/v3/webinars/audience/create-group', 'POST'], // 白名单创建分组 Jia.li  √
  postGroupDel: ['/v3/webinars/audience/delete-group', 'POST'], // 白名单删除分组 Jia.li  √
  postGroupEdit: ['/v3/webinars/audience/edit-group', 'POST'], // 白名单分组重命名 Jia.li  √
  viewerList: ['/v3/webinars/audience/get-group-audience', 'POST'], // 白名单根据分组获取观众列表 jia.li  √
  viewerAdd: ['/v3/webinars/audience/create', 'POST'],// 白名单添加观众至分组 jia.li •••部分已经存在内容删除有问题
  viewerImport: ['/v3/webinars/audience/post-excel-audience', 'POST'],// 白名单导入观众至分组 jia.li •••待确认同时触发情况，唯一标识
  viewerEdit: ['/v3/webinars/audience/edit', 'POST'],// 白名单观众信息修改 jia.li  √
  viewerDel: ['/v3/webinars/audience/delete-audience', 'POST'],// 白名单观众-批量删除 jia.li  √
  viewerSetGet: ['/v3/webinars/webinar/get-webinar-verify', 'POST'],// 获取活动观看限制接口 jia.li  √
  viewerInfo: ['/v3/webinars/audience/info', 'POST'],// 白名单观众详情获取 jia.li •••【控制台未用到】
  viewerSetSave: ['/v3/webinars/verify/save', 'POST'],// 观看限制保存接口 jia.li •••
  fCodeExecute: ['/v3/webinars/webinar/post-generate-fcode', 'POST'],// 生成验证码 jia.li •••
  // 自定义菜单
  menuTplList: ['/101/v3/menu-components/list', 'POST', 'mock'], // 控制台-组件列表接口 jia.li
  customMenuList: ['/101/v3/menu-bak/list', 'POST', 'mock'], // 控制台-菜单列表接口 jia.li
  customMenuSave: ['/101/v3/menus/save', 'POST', 'mock'], // 控制台-菜单保存接口 jia.li
  webinarCMenuList: ['/101/v3/webinar-menus/list', 'POST', 'mock'], // 观看端-菜单列表接口 jia.li
  webinarCMenuGet: ['/101/v3/webinar-menus/info', 'POST', 'mock'], // 观看端-单个菜单详情接口 jia.li
  // 虚拟人数
  virtualSetSave: ['/v3/webinars/virtual/edit', 'POST', 'mock'], // 控制台-编辑虚拟人数配置 jia.li
  virtualGet: ['/v3/webinars/virtual/info', 'GET'], // 控制台-获取虚拟人数配置 jia.li
  virtualClientGet: ['/v3/webinars/virtual/get-base', 'GET'], // 发起端-获取虚拟观众基数
  virtualClientStart: ['/v3/webinars/virtual/start', 'GET'], // 发起端-开始增加虚拟观众
  virtualAccumulation: ['/v3/webinars/virtual/accumulation', 'GET'], // 发起端-增加虚拟观众
  virtualSwitchSet: ['/v3/webinars/webinar/post-switch-virtual', 'POST', 'mock'], // 控制台-虚拟人数开关 jia.li

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
  getMsgList: ['/v3/commons/msgcenter/list', 'POST'], // 站内消息列表接口 jia.li  √
  msgDel: ['/v3/commons/msgcenter/delete', 'POST'], // 站内消息删除接口 jia.li  √
  getMsgInfo: ['/v3/commons/msgcenter/get-info', 'POST'], // 站内消息详情接口 jia.li  √
  getUnreadNum: ['/v3/commons/msgcenter/unread-num', 'POST'], // 查询消息未读数 jia.li  √
  executeUseRead: ['/v3/commons/msgcenter/batch-read', 'POST'], // 标记已读 jia.li  √

  // 文件上传(图片)
  uploadImage: ['/102/v3/commons/upload/index', 'POST'], // 文件上传（图片） jia.li •••有调整

  // 回放模块
  playBackList: ['/99/v3/webinars/record/get-record-list', 'POST', 'mock'], // 回放列表 jian.chang
  playBackEdit: ['/99/v3/webinars/record/put-record', 'POST', 'mock'], // 修改回放标题 jian.chang
  playBackDelete: ['/99/v3/webianrs/record/del-record', 'POST', 'mock'], // 删除回放 jian.chang
  playBackDuration: ['/99/v3/webinars/record/get-record-duration', 'POST', 'mock'], // 获取回放时长 jian.chang
  playBackDemand: ['/99/v3/webinars/record/post-record-demand', 'POST', 'mock'], // 回放发布为点播 jian.chang

  //首页
  getInfo: ['/v3/users/user/get-info', 'POST'], //获取用户信息（昵称、头像等）场景1：控制台首页 / 场景2：控制台账户信息页

  // 登录
  loginInfo: ['/v3/users/user/login', 'POST'],  //登录接口
  loginOut: ['/v3/users/user/logout', 'POST'],  //退出接口
  loginCheck: ['/v3/users/user/login-check', 'POST'],  //登录账号锁定检测接口
  sendCode: ['/v3/users/code/send', 'POST'],  //发送验证码接口
  register: ['/v3/users/user/register', 'POST'],  //注册接口

  //数据中心
  getDataCenterInfo: ['/v3/data-center/account-all-data', 'GET', 'data'], //获取账户下的总数据

  // 直播-数据报告
  getStatisticsinfo: ['/103/v3/data-center/webinar-statistics-info', 'GET', 'mock'], //获取活动数据下报告
  getMaxuv: ['/103/v3/data-center/webinar-max-uv', 'GET', 'mock'], //获取活动最高并发
  getHeat: ['/103/v3/data-center/webinar-heat', 'GET', 'mock'], //获取活动热度
  getProvinceinfo: ['/103/v3/data-center/webinar-province-info', 'GET', 'mock'], //获取活动省份统计
  getDeviceinfo: ['/103/v3/data-center/webinar-device-info', 'GET', 'mock'], //获取活动设备信息
  getBrowserinfo: ['/103/v3/data-center/webinar-browser-info', 'GET', 'mock'], //获取活动浏览器信息
  getDateUvinfo: ['/103/v3/data-center/webinar-date-uv', 'GET', 'mock'], //获取观看人数趋势


  // 账户管理
  userEdit: ['/v3/users/user/edit', 'POST'], // 修改用户信息接口 （昵称、头像、公司、职位、控制台标志）
  getSonInfo: ['/100/v3/users/child/get-head-info', 'POST', 'mock'], // 子账号tab页头部信息接口 Jia.li
  childExport: ['/100/v3/users/child/export', 'POST', 'mock'], // 子账号列表导出接口 Jia.li
  getSonList: ['/100/v3/users/child/get-list', 'POST', 'mock'], // 获取子账号列表信息 Jia.li
  sonExport: ['/100/v3/users/child/export', 'POST', 'mock'], // 子账号列表导出 Jia.li
  sonAdd: ['/100/v3/users/child/create', 'POST', 'mock'], // 子账号创建 Jia.li
  sonDel: ['/100/v3/users/child/delete', 'POST', 'mock'], // 子账号删除 Jia.li
  sonEdit: ['/100/v3/users/child/edit', 'POST', 'mock'], // 子账号修改 Jia.li
  sonCountGet: ['/100/v3/users/child/count', 'POST', 'mock'], // 获取子账号个数 Jia.li
  sonDetailGet:  ['/100/v3/users/child/get-info', 'POST', 'mock'], // 子账号详情 Jia.li
  allocSave:  ['/100/v3/users/child/edit', 'POST', 'mock'], // 子账号-用  量分配-保存分配方式 Jia.li
  allocMoreGet:  ['/100/v3/users/child/edit', 'POST', 'mock'], // 子账号-用量分配-可分配数量获取 Jia.li
  allocSetVal:  ['/100/v3/users/child/edit', 'POST', 'mock'], // 子账号-用量分配-固定-并发数值保存（单个 or 批量） Jia.li
  getRoleList: ['/100/v3/users/user-role/list', 'POST', 'mock'], // 角色-用户-获取 Jia.li
  sonRoleAdd: ['/100/v3/users/child-role/create', 'POST', 'mock'], // 子账号-角色创建 Jia.li
  sonRoleDel: ['/100/v3/users/child-role/delete', 'POST', 'mock'], // 子账号-角色删除 Jia.li
  sonRoleEdit: ['/100/v3/users/child-role/edit', 'POST', 'mock'], // 子账号-角色编辑 Jia.li
  sonRoleGet: ['/100/v3/users/child-role/get-info', 'POST', 'mock'], // 子账号-角色-详情查询 Jia.li
  sonRoleList: ['/100/v3/users/child-role/get-list', 'POST', 'mock'], // 子账号-角色-列表查询 Jia.li
  sonRolePermission: ['/100/v3/users/child-role/get-list', 'POST', 'mock'], // 子账号权限查询接口 Jia.li
  sonResourcesGet: ['/104/v3/user-vip/get-dist-resources', 'POST', 'mock'], // 获取账号可分配资源 Jia.li
  sonResourcesSave: ['/104/v3/user-vip/dist-resources', 'POST', 'mock'], // 子账号用量分配(可批量) Jia.li

  //财务中心
  getVersionInfo: ['/v3/fin/account/info', 'GET', 'data'],  //获取用户版本信息
  getTrendInfo: ['/104/v3/business-total/user-online-trend', 'GET', 'mock'],  //获取用量统计数据-并发
  getFlowInfo: ['/104/v3/business-total/user-flow-trend', 'GET', 'mock'],  //获取用量统计数据-流量
  getOnlinePay: ['/104/v3/business-total/user-online-pay-maxuv', 'GET', 'mock'],  //获取并发-消费账单
  getFlowPay: ['/104/v3/business-total/user-flow-pay', 'GET', 'mock'],  //获取流量-消费账单
  getAccountList: ['/104/v3/business-total/user-online-pay-detail', 'GET', 'mock'], //获取财务总览-并发-消费账单  接口参数少一个字段(标题)
  getBusinessList: ['/104/v3/business-total/user-flow-pay-detail', 'GET', 'mock'], //获取财务总览-流量-消费账单-分页明细[子账号也涉及]   接口参数少一个字段(标题)
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
  weixinBinding: ['/v3/commons/auth/weixin', 'GET'], // 提现绑定
  callbackUserInfo: ['/100/v3/users/oauth/callback', 'POST', 'mock'], // 绑定之后获取用户信息
  withdrawalPhoneCode: ['/104/v3/finances/withdraw/phone-code', 'POST', 'mock'], // 提现-发送手机验证码(仅提现，不包括更改微信发送验证码)
  withdrawal: ['/104/v3/finances/withdraw', 'POST', 'mock'], // 提现

  //开发设置
  getAppList: ['/100/v3/users/app-keys/get-list', 'POST', 'mock'], // 获取应用列表 jian.chang
  createApp: ['/100/v3/users/app-keys/create', 'POST', 'mock'], // 创建应用 jian.chang
  getAppInfo: ['/100/v3/users/app-keys/get-info', 'POST', 'mock'], // 获取应用详情 jian.chang
  modifyApp: ['/100/v3/users/app-keys/edit', 'POST', 'mock'], // 修改应用 jian.chang

  // 账户管理
  homeInfoGet: ['/100/v3/users/homepage/get-info', 'POST', 'mock'], // 个人主页查询接口 Jia.li
  homeInfoEdit: ['/100/v3/users/homepage/edit', 'POST', 'mock'], // 个人主页更新接口 Jia.li
  checkAccount: ['/100/v3/users/user/check-account', 'POST', 'mock'], // 账号检测接口 Jia.li
  resetPassword: ['/v3/users/user/reset-password', 'POST', 'mock'], // 修改密码/密码找回/设置密码接口
  bindInfo: ['/100/v3/users/user/bind-info', 'POST', 'mock'], // 绑定邮箱、手机号接口 Jia.li

  // 下载中心
  downloadedEdit: ['/v3/commons/downcenter/downloaded', 'POST'], // 下载中心-删除修改为已下载 √
  downloadedDel: ['/v3/commons/downcenter/delete', 'POST'], // 下载中心-删除 √
  downloadedList: ['/v3/commons/downcenter/list', 'POST'], // 下载中心-列表 √
  downloadedReload: ['/v3/commons/downcenter/regenerate', 'POST'], // 下载中心-重新生成 Jia.li •••需真实流程才可测试

  // 报名表单
  getFormEnableStatus: ['/v3/webinars/registration-form/get-form-enable-status', 'POST', 'mock'], // 获取活动报名表单开启状态

  // 活动基础信息
  getWebinarSwitchList: ['/v3/webinars/webinar/get-webinar-switch-list', 'POST', 'mock'], // 数据统计直播详情包含场次列表 •••
  getUserAllWebinar: ['/v3/webinars/webinar/get-user-all-webinar', 'POST', 'mock'], // 大数据依赖通过用户id获取账户下活动总数 •••
  batchGetWebinarInfo: ['/v3/webinars/webinar/batch-get-webinar-info', 'POST', 'mock'], // 批量查询活动基础信息接口 •••
  getWebinarListBigdata: ['/v3/webinars/webinar/get-webinar-list-bigdata', 'POST', 'mock'], // 大数据服务依赖活动列表 •••

  // 数据支持
  getLastTime: ['/v3/webinars/webinar/get-last-time', 'POST'], // 获取活动最后一次开始结束时间 •••
  getWebinarState: ['/v3/webinars/webinar/get-webinar-state', 'POST'], // 获取直播状态接口 •••

  // 音视频接口
  videosCreate: ['/v3/webinars/videos/create', 'POST'], // 音视频添加
  videosDelete: ['/v3/webinars/videos/delete', 'POST'], // 音视频删除
  videosEdit: ['/v3/webinars/videos/edit', 'POST'], // 音视频修改
  videosList: ['/v3/webinars/videos/get-list', 'POST'], // 音视频列表

  // openAPI
  openApiWebinarAdd: ['/v3/webianrs/openapi_webinars/post-webinar', 'POST'], // 音视频添加
  openApiWebinarEdit: ['/v3/webianrs/openapi_webinars/put-webinar', 'POST'], // 音视频删除

  // 直播间内 -- 发起端
  initiatorInfo: ['/v3/webinars/live/init', 'GET'], // 获取房间信息 jian.chang √
  getInitiatorReportInfo: ['/v3/webinars/live/get-report-info', 'GET'], // 获取上报信息 jian.chang √
  liveHeartBeat: ['/v3/webinars/live/heartbeat', 'GET'], // 心跳检测 √
  getToolStatus: ['/v3/interacts/room/get-inav-tool-status', 'POST'], // 获取房间内各工具的状态

  // 发起端-活动
  getJoinUrl: ['/v3/webinars/live/get-url', 'GET'], // 获取参会地址 •••
  getRoleUrl: ['/v3/webinars/live/get-role-url', 'GET'], // 获取嘉宾/助理参会地址（openApi）•••
  roleLogin: ['/v3/webinars/live/role-login', 'GET'], // 口令用户登录验证
  roleLogout: ['/v3/webinars/live/role-logout', 'POST'], // 口令用户退出 •••
  getStreamPushAddress: ['/v3/webinars/live/get-stream-push-address', 'GET'], // 获取推流地址 •••
  liveClientInit: ['/v3/webinars/live/client-init', 'GET'], // 初始化直播间（客户端） •••
  liveStart: ['/v3/webinars/live/start', 'POST'], // 开始直播 •••
  liveEnd: ['/v3/webinars/live/end', 'POST'], // 结束直播 •••
  rebroadcastList: ['/v3/webinars/rebroadcast/list', 'GET'], // 转播列表 •••
  rebroadcastPreview: ['/v3/webinars/rebroadcast/preview', 'GET'], // 转播预览 •••
  rebroadcastStart: ['/v3/webinars/rebroadcast/start', 'GET'], // 转播开始 •••
  rebroadcastStop: ['/v3/webinars/rebroadcast/stop', 'GET'], // 转播结束 •••

  // 授权模块
  weixinAuth: ['/v3/commons/auth/weixin', 'GET'], // 微信授权接口 •••
  weixinShareAuth: ['/v3/commons/auth/weixin-share', 'GET'], // 微信分享接口 •••
  qqAuth: ['/v3/commons/auth/qq', 'GET'], // QQ授权接口 ••• 

  // 观看端-活动
  watchAuth: ['/v3/webinars/watch/auth', 'POST'], // 观看授权
  watchInit: ['/v3/webinars/watch/init', 'GET'], // 初始化直播间
  watchSDKInit: ['/v3/webinars/watch/sdk-init', 'GET'], // 初始化直播间(sdk)
  watchInlineInit: ['/v3/webinars/watch/inline-init', 'GET'], // 初始化直播间-嵌入
  sendReportInfo: ['/v3/webinars/watch/get-report-info', 'GET'], // 获取上报信息

  // 观看端
  likeTotal: ['/v3/interacts/like/get-room-like', 'POST'], // 房间内点赞总数
  queryAdsInfo: ['/v3/interacts/recommend-adv/watch-get-adv-list', 'GET'], // 获取广告信息
  queryRoomInterInfo: ['/v3/interacts/room/get-inav-tool-status', 'POST'], // 获取房间互动工具状态
  getSkin: ['/v3/interacts/skin/watch-get-webinar-skin', 'GET'], // 获取皮肤
  getMenuDetailById: ['/v3/interacts/menu/menu-get-info', 'POST'], // 观看端自定义菜单详情
  attention: ['/v3/users/attentions/create', 'POST'], // 关注
  notAttention: ['/v3/users/attentions/delete', 'POST'], // 取消关注
  getWatchFilterWords: ['/v3/interacts/keyword/get-current-user-all-keyword', 'POST'], // 获取观看端关键字列表
  newWebinarMenus: ['/v3/interacts/menu/menu-list', 'POST'], // 观看页菜单列表 jian.chang
  goodsList: ['/101/v3/interacts/goods/get-on-sale-goods-list', 'GET', 'mock'], // 商品推荐 xiaodong.ding
  keywordsList: ['/domian/api/webinar/v1/webinar/keywords-list', 'POST'], // 聊天关键词过滤 jian.chang
  getCustomMenuInfo: ['/api/webinar/v1/webinar/webinar-menus-detail', 'POST'], // 获取自定义菜单数据 jian.chang
};

const getApi = api => {
  return apis[api] && apis[api];
};

export default getApi;
