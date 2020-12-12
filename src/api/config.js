const apis = {
  // 资料管理
  getWordList: ['/v3/interacts/document/get-shared-document-list', 'GET'], //获取文档列表
  getWebinarWordList: ['/v3/interacts/document/get-webinar-document-list', 'POST'], //获取活动下文档列表
  getWordDetail: ['/v3/interacts/document/detail', 'POST'], //获取文档详情
  asyncWordInfo: ['/v3/interacts/document/clone-from-shared-document', 'POST'], // 同步文档
  delWordList: ['/v3/interacts/document/batch-remove-reference', 'POST'], //删除文档

  dataVideoList: ['/v3/webinars/videos/get-list', 'POST'], //音视频列表 √
  dataVideoupdate: ['/v3/webinars/videos/edit', 'POST'], //音视频编辑 √
  dataVideoDel: ['/v3/webinars/videos/delete', 'POST'], //音视频删除 √
  createVideo: ['/v3/webinars/videos/create', 'POST'], //音视频添加 √
  getAppid: ['/v3/webinars/videos/get-appid', 'POST'], //获取appid接口 √

  // 资料管理 -奖品
  createPrize: ['/v3/vss/lottery/create-prize', 'POST' ], //资料管理-创建奖品
  editPrize: ['/v3/vss/lottery/get-edit-prize-info', 'POST' ], //资料管理-编辑奖品
  getPrizeList: ['/v3/vss/lottery/get-prize-list', 'POST' ], //资料管理-奖品列表
  delPrize: ['/v3/vss/lottery/prize-del', 'POST' ], //资料管理-删除
  copyPrize: ['/v3/vss/lottery/prize-copy', 'POST' ], //资料管理-复制

  // 直播详情 -奖品设置
  getLivePrizeInfo: ['/v3/vss/lottery/get-prize-info', 'GET' ], //抽奖页-获取信息
  savePrizepicture: ['/v3/vss/lottery/save-prize-image', 'POST' ], //抽奖页-保存图片
  savePrizeInfo: ['/v3/vss/lottery/save-prize-info', 'POST' ], //抽奖页-保存信息
  getDrawPrizeInfo: ['/v3/vss/lottery/get-draw-prize-info', 'GET' ], //领奖页-获取信息
  saveDrawPrizeInfo: ['/v3/vss/lottery/save-draw-prize', 'POST' ], //领奖页-保存信息

  // 问卷
  createQuestion: ['/v3/vss/survey/create-shared-survey', 'POST' ], //共享库_创建问卷
  editQuestion: ['/v3/vss/survey/update-shared-survey', 'POST' ], //共享库_编辑问卷
  getQuestionList: ['/v3/vss/survey/list-shared-survey', 'GET' ], //问卷列表
  deleteQuestion: ['/v3/vss/survey/delete-shared-survey', 'POST' ], //共享库_删除问卷
  copyQuestion: ['/v3/vss/survey/copy-shared-survey', 'GET' ], //共享库-问卷复制

  // 直播-问卷
  createLiveQuestion: ['/v3/vss/survey/create-webinar-survey', 'POST' ], //直播设置_创建问卷
  editLiveQuestion: ['/v3/vss/survey/update-webinar-survey', 'POST' ], //直播设置_编辑问卷
  getLiveQuestionList: ['/v3/vss/survey/list-webinar-survey', 'GET' ], //直播设置_问卷列表
  deleteLiveQuestion: ['/v3/vss/survey/delete-webinar-surveys', 'POST' ], //直播设置_删除问卷
  copyLiveQuestion: ['/v3/vss/survey/copy-webinar-survey', 'GET' ], //直播设置-问卷复制
  sharedLiveQuestion: ['/v3/vss/survey/clone-from-shared', 'POST' ], //直播设置_从资料库添加


  shareGiftList: ['/v3/interacts/gift/shared-gift-list', 'GET'], // 共享礼物库
  editGiftInfo: ['/v3/interacts/gift/update-shared-gift', 'POST'], // 更新共享库礼品信息
  createGiftInfo: ['/v3/interacts/gift/create-shared-gift', 'POST'], // 创建共享库礼品信息
  deleteGift: ['/v3/interacts/gift/create-shared-gift', 'POST'], // 删除共享库礼品
  liveGiftList: ['/v3/interacts/gift/get-webinar-using-gift-list', 'GET'], // 活动下礼物库

  //广告推荐
  getAdvList: ['/v3/interacts/recommend-adv/get-adv-list', 'GET'], //获取广告列表 √
  advSaveToWebinar: ['/v3/interacts/recommend-adv/database-to-activity', 'POST'], //从资料库保存到活动 √
  createAdv: ['/v3/interacts/recommend-adv/create-adv', 'POST'], //创建广告 √
  updateAdv: ['/v3/interacts/recommend-adv/update-adv', 'POST'], //编辑广告 √
  deleteAdv: ['/v3/interacts/recommend-adv/batch-delete-adv', 'POST'], //批量删除广告 √
  viewAdv: ['/v3/interacts/recommend-adv/view-adv', 'GET'], //查看单条广告详情 •••

  //播放器设置
  setScrolling: ['/101/v3/interacts/players/set-scrolling-screen-config', 'POST', 'mock'], //直播设置_设置播放器跑马灯 •••
  setWatermark: ['/101/v3/interacts/players/set-watermark-config', 'POST', 'mock'], //从资料库保存到活动 •••
  getScrolling: ['/101/v3/interacts/players/get-scrolling-screen-config', 'GET', 'mock'], //观看端_获取跑马灯设置配置信息 •••
  getWatermark: ['/101/v3/interacts/players/get-watermark-config', 'GET', 'mock'], //观看端_获取水印设置 •••

  //公众号 开屏海报
  setPublicInfo: ['/v3/interacts/adv/set-public-account-config-info', 'POST'], //保存公众号展示配置  •••接口有问题
  getPublicInfo: ['/v3/interacts/adv/get-public-account-config-info', 'GET'], //获取公众号展示配置信息 •••接口有问题
  setPosterInfo: ['/v3/interacts/adv/set-screen-poster-config-info', 'POST'], //保存开屏海报配置 •••接口有问题
  getPosterInfo: ['/v3/interacts/adv/get-screen-poster-config-info', 'GET'], //获取开屏海报配置信息 •••接口有问题
  getScreenPublicInfo: ['/v3/interacts/adv/watch-get-public-account', 'GET'], //直播设置_观看端_获取公众号广告 •••接口有问题
  getScreenPosterInfo: ['/v3/interacts/adv/watch-get-screen-poster', 'GET'], //直播设置_观看端_获取开屏海报 •••接口有问题

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
  liveList: ['/v3/webinars/webinar/get-list', 'POST'], // 获取直播列表 jian.chang  √
  getWebinarInfo: ['/v3/webinars/webinar/info', 'POST'], // 查询活动基础信息接口
  liveEdit: ['/v3/webinars/webinar/edit', 'POST'], // 活动修改 √
  liveDel: ['/v3/webinars/webinar/delete', 'POST'], // 活动删除  √
  demandCreate: ['/v3/webinars/webinar/create-demand', 'POST'], // 点播创建

  // 专题
  subjectCreate: ['/v3/webinars/subject/create', 'POST'], // 专题创建 √
  subjectList: ['/v3/webinars/subject/get-list', 'POST'], // 专题列表 √有问题
  subjectEdit: ['/v3/webinars/subject/edit', 'POST'], // 专题修改  •••
  subjectInfo: ['/v3/webinars/subject/info', 'POST'], // 获取专题详情接口(专题预览)  •••
  subjectDel: ['/v3/webinars/subject/delete', 'POST'], // 专题删除接口 •••
  // 角色邀请
  privilegeInfo:  ['/v3/webinars/privilege/info', 'POST'], // 获取活动角色配置接口  √
  privilegeOpen:  ['/v3/webinars/privilege/open-privilege', 'POST'], // 开启关闭角色开关  √
  privilegeEdit:  ['/v3/webinars/privilege/edit-pass', 'POST'], // 角色密码修改接口（口令修改）  √
  privilegePrem:  ['/v3/webinars/privilege/edit-premission', 'POST'], // 角色邀请——权限修改接口  √

  // 报名表单
  regFromGet: ['/v3/webinars/registration-form/get-form-base-info', 'GET'], // 获取表单基本信息  √
  regFromStatusGet: ['/v3/webinars/registration-form/get-form-enable-status', 'GET'], // 获取表单开启状态 没用到
  regFromUpdate: ['/v3/webinars/registration-form/update', 'POST'], // 更新表单基本信息  √
  regFromEnable: ['/v3/webinars/registration-form/enable', 'POST'], // 报名表单开启  √
  regFromDisable: ['/v3/webinars/registration-form/disable', 'POST'], // 报名表单关闭  √
  regQAdd: ['/v3/webinars/registration-form/create-question', 'POST'], // 增加一个报名表单题目  √
  regQSort: ['/v3/webinars/registration-form/set-form-question-order', 'POST'], // 表单题目重新排序  √
  regQEdit: ['/v3/webinars/registration-form/update-question', 'POST'], // 编辑报名表单中的一个题目信息
  regQDelete: ['/v3/webinars/registration-form/delete-question', 'POST'], // 删除一个报名表单题目  √
  regQListGet: ['/v3/webinars/registration-form/get-form-question-list', 'POST'], // 获取报名表单中的题目列表  √
  regQOptionAdd: ['/v3/webinars/registration-form/create-question-item', 'POST'], // 增加一个新的选项  √
  regQOptionUpdate: ['/v3/webinars/registration-form/update-question-item', 'POST'], // 更新题目的选项信息  √
  regQOptionDelete: ['/v3/webinars/registration-form/delete-question-item', 'POST'], // 删除一个选项  √
  regRrivacyAdd: ['/v3/webinars/registration-form/create-privacy-protocol', 'POST'], // 新建一个隐私协议  √
  regRrivacyUpdate: ['/v3/webinars/registration-form/update-privacy-protocol', 'POST'], // 更新隐私协议配置  url字段为空字符串的时候会报错
  regRrivacyDelete: ['/v3/webinars/registration-form/delete-privacy-protocol', 'POST'], // 删除一个隐私协议  √
  regUserCheck: ['/v3/webinars/registration-form/check-is-registered', 'POST'], // 检查是否为已报名用户
  regSendVerifyCode: ['/v3/webinars/registration-form/send-verify-code', 'POST'], // 发送手机验证码
  regAnswerSubmit: ['/v3/webinars/registration-form/submit', 'POST'], // 提交报名表单答案
  regVisiterCheck: ['/v3/webinars/registration-form/get-visiter-register-status', 'POST'], // 查询某个访客是否已经报过名
  verifyOpenLink: ['/v3/webinars/registration-form/verify-open-link', 'GET'], // 检查报名表单是否开启独立链接以及独立链接是否有效

  // 第三方K值模块
  kidAuthInfo:  ['/v3/webinars/auth/info', 'POST'], // 获取单个活动K值详情接口 •••
  kidAuthEdit:  ['/v3/webinars/auth/edit', 'POST'], // 单个活动K值设置修改接口 •••


  // 暖场视频
  warmCreate: ['/99/v3/webinars/warm/create', 'POST', 'mock'], // 添加暖场视频
  warnInfo: ['/99/v3/webinars/warm/info', 'POST', 'mock'], // 获取暖场视频详情接口 •••
  warnDelete: ['/99/v3/webinars/warm/delete', 'POST', 'mock'], // 删除暖场视频 •••
  warnEdit: ['/99/v3/webinars/warm/edit', 'POST', 'mock'], // 修改暖场视频封面图片接口 •••

  // 商品
  goodsGet: ['/v3/interacts/goods/get-webinar-goods-list', 'GET'], // 获取活动下商品列表
  goodsEnable: ['/v3/interacts/goods/enable-webinar-goods', 'POST'], // 商品上架
  goodsDisable: ['/v3/interacts/goods/disable-webinar-goods', 'POST'], // 商品下架
  goodsCopy: ['/v3/interacts/goods/clone-goods', 'POST'], // 复制一个商品
  goodsInfoGet: ['/v3/interacts/goods/get-webinar-goods-info', 'GET'], // 查看活动下某个商品详情
  goodsCreate: ['/v3/interacts/goods/create-goods', 'POST'], // 新建活动展示商品
  goodsUpdate: ['/v3/interacts/goods/update-goods', 'POST'], // 更新商品信息
  goodsImgIdCreate: ['/v3/interacts/goods/generate-goods-image-id', 'POST'], // 生成商品图片ID
  goodsBatchDel: ['/v3/interacts/goods/batch-delete-goods', 'POST'], // 批量删除活动商品
  goodsImgDel: ['/v3/interacts/goods/delete-goods-img', 'POST'], // 删除活动商品图片
  goodsSetCover: ['/v3/interacts/goods/set-goods-cover', 'POST'], // 设置商品默认封面

  // 功能配置
  planFunctionGet: ['/v3/users/permission/get-config-list', 'POST'], // 获取可配置项列表 jia.li
  planFunctionEdit: ['/v3/users/permission/edit-webinar-config', 'POST'], // 修改配置项 jia.li

  // 观看限制
  audienceGet: ['/v3/webinars/audience/get-group-list', 'POST'], // 获取白名单分组列表 Jia.li  √
  postGroupAdd: ['/v3/webinars/audience/create-group', 'POST'], // 白名单创建分组 Jia.li  √
  postGroupDel: ['/v3/webinars/audience/delete-group', 'POST'], // 白名单删除分组 Jia.li  √
  postGroupEdit: ['/v3/webinars/audience/edit-group', 'POST'], // 白名单分组重命名 Jia.li  √
  viewerList: ['/v3/webinars/audience/get-group-audience', 'POST'], // 白名单根据分组获取观众列表 jia.li  √
  viewerAdd: ['/v3/webinars/audience/create', 'POST'],// 白名单添加观众至分组 jia.li  √
  viewerImport: ['/v3/webinars/audience/post-excel-audience', 'POST'],// 白名单导入观众至分组 jia.li √
  viewerEdit: ['/v3/webinars/audience/edit', 'POST'],// 白名单观众信息修改 jia.li  √
  viewerDel: ['/v3/webinars/audience/delete-audience', 'POST'],// 白名单观众-批量删除 jia.li  √
  viewerSetGet: ['/v3/webinars/webinar/get-webinar-verify', 'POST'],// 获取活动观看限制接口 jia.li  √
  viewerInfo: ['/v3/webinars/audience/info', 'POST'],// 白名单观众详情获取 jia.li •••【控制台未用到】
  viewerSetSave: ['/v3/webinars/verify/save', 'POST'],// 观看限制保存接口 jia.li  √
  fCodeExecute: ['/v3/webinars/webinar/post-generate-fcode', 'POST'],// 生成验证码 jia.li •••
  // 自定义菜单
  menuTplList: ['/v3/interacts/menu/components-list', 'POST'], // 控制台-组件列表接口 jia.li
  customMenuList: ['/v3/interacts/menu/bak-menu-list', 'POST'], // 控制台-菜单列表接口 jia.li
  customMenuSave: ['/v3/interacts/menu/save', 'POST'], // 控制台-菜单保存接口 jia.li
  webinarCMenuList: ['/v3/interacts/menu/menu-list', 'POST'], // 观看端-菜单列表接口 jia.li
  webinarCMenuGet: ['/v3/interacts/menu/menu-get-info', 'POST'], // 观看端-单个菜单详情接口 jia.li
  // 虚拟人数
  virtualSetSave: ['/v3/webinars/virtual/add', 'POST'], // 控制台-编辑虚拟人数配置 jia.li  √
  virtualGet: ['/v3/webinars/virtual/info', 'GET'], // 控制台-获取虚拟人数配virtual置 jia.li  √
  virtualClientGet: ['/v3/webinars/virtual/get-base', 'GET'], // 发起端-获取虚拟观众基数 •••
  virtualClientStart: ['/v3/webinars/virtual/start', 'GET'], // 发起端-开始增加虚拟观众 •••
  virtualAccumulation: ['/v3/webinars/virtual/accumulation', 'GET'], // 发起端-增加虚拟观众 •••
  // virtualSwitchSet: ['/v3/webinars/webinar/post-switch-virtual', 'POST', 'mock'], // 控制台-虚拟人数开关 jia.li •••废弃

  // 关键词
  getKeywordList: ['/v3/interacts/keyword/get-list', 'POST'], // 获取关键词列表[控制台调用] jia.li  √
  getAllKeywordList: ['/v3/interacts/keyword/get-all', 'POST'], // 获取所有关键词列表[观看端/发起端调用] jia.li  √
  multiKeywordAdd: ['/v3/interacts/keyword/batch-create', 'POST'], // 添加关键词-可批量 jia.li  √
  multiKeywordEdit: ['/v3/interacts/keyword/edit', 'POST'], // 修改关键词 jia.li  √
  multiKeywordDel: ['/v3/interacts/keyword/batch-delete', 'POST'], // 批量删除关键词 jia.li  √
  checkUploadKeyword: ['/v3/interacts/keyword/check-upload-file', 'POST'], // 校验上传文件可以上传的关键词 jia.li •••暂时不用
  uploadKeywordAdd: ['/v3/interacts/keyword/upload-file-and-create', 'POST'], // 上传关键词文件并添加关键词 jia.li
  getKeywordTemplate: ['/v3/interacts/keyword/get-template-url', 'POST'], // 获取关键词模板地址 jia.li  √

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
  getInfo: ['/v3/users/user/get-info', 'POST'], //获取用户信息（昵称、头像等）场景1：控制台首页 / 场景2：控制台账户信息页  √

  // 登录
  loginInfo: ['/v3/users/user/login', 'POST'],  //登录接口  √
  loginOut: ['/v3/users/user/logout', 'POST'],  //退出接口  √
  loginCheck: ['/v3/users/user/login-check', 'POST'],  //登录账号锁定检测接口
  sendCode: ['/v3/users/code/send', 'POST'],  //发送验证码接口
  register: ['/v3/users/user/register', 'POST'],  //注册接口

  //数据中心
  getDataCenterInfo: ['/v3/data-center/account-all-data', 'GET'], //获取账户下的总数据  数据总览
  getActiveDataList: ['/v3/webinars/webinar/get-data-list', 'POST'], //活动数据列表接口   活动数据

  // 直播-数据报告
  getStatisticsinfo: ['/v3/data-center/webinar-statistics-info', 'GET'], //获取活动数据下报告
  getMaxuv: ['/v3/data-center/webinar-max-uv', 'GET'], //获取活动最高并发
  getHeat: ['/v3/data-center/webinar-heat', 'GET'], //获取活动热度
  getProvinceinfo: ['/v3/data-center/webinar-province-info', 'GET'], //获取活动省份统计
  getDeviceinfo: ['/v3/data-center/webinar-device-info', 'GET'], //获取活动设备信息
  getBrowserinfo: ['/v3/data-center/webinar-browser-info', 'GET'], //获取活动浏览器信息
  getDateUvinfo: ['/v3/data-center/webinar-date-uv', 'GET'], //获取观看人数趋势

  // 直播-用户统计
  getUserBaseinfo: ['/v3/data-center/user-watch-detail', 'GET'], //获取用户观看详情

  // 账户管理
  userEdit: ['/v3/users/user/edit', 'POST'], // 修改用户信息接口 （昵称、头像、公司、职位、控制台标志） Jia.li  √
  getSonInfo: ['/v3/users/child/get-head-info', 'POST'], // 子账号tab页头部信息接口 Jia.li  √
  getSonList: ['/v3/users/child/get-list', 'POST'], // 获取子账号列表信息 Jia.li
  sonChildExport: ['/v3/users/child/export', 'POST'], // 子账号列表导出 Jia.li
  sonAdd: ['/v3/users/child/create', 'POST'], // 子账号创建 Jia.li
  sonDel: ['/v3/users/child/delete', 'POST'], // 子账号删除 Jia.li
  sonEdit: ['/v3/users/child/edit', 'POST'], // 子账号修改 Jia.li
  sonCountGet: ['/v3/users/child/count', 'POST'], // 获取子账号个数 Jia.li
  sonDetailGet:  ['/v3/users/child/get-info', 'POST'], // 子账号详情 Jia.li
  allocSave:  ['/v3/users/child/edit', 'POST'], // 子账号-用量分配-保存分配方式 Jia.li
  allocMoreGet:  ['/v3/fin/user-vip/get-dist-resources', 'GET' ], // 子账号-用量分配-可分配数量获取 Jia.li
  allocSetVal:  ['/v3/fin/user-vip/dist-resources', 'POST' ], // 子账号-用量分配-固定-并发数值保存（单个 or 批量） Jia.li
  getRoleList: ['/v3/users/user-role/list', 'POST'], // 角色-用户-获取 Jia.li
  sonRoleAdd: ['/v3/users/child-role/create', 'POST'], // 子账号-角色创建 Jia.li
  sonRoleDel: ['/v3/users/child-role/delete', 'POST'], // 子账号-角色删除 Jia.li
  sonRoleEdit: ['/v3/users/child-role/edit', 'POST'], // 子账号-角色编辑 Jia.li
  sonRoleGet: ['/v3/users/child-role/get-info', 'POST'], // 子账号-角色-详情查询 Jia.li
  sonRoleList: ['/v3/users/child-role/get-list', 'POST'], // 子账号-角色-列表查询 Jia.li
  sonRolePermission: ['/v3/users/child-role/get-list', 'POST'], // 子账号权限查询接口 Jia.li
  sonResourcesGet: ['/104/v3/user-vip/get-dist-resources', 'POST', 'mock'], // 获取账号可分配资源 Jia.li
  sonResourcesSave: ['/104/v3/user-vip/dist-resources', 'POST', 'mock'], // 子账号用量分配(可批量) Jia.li

  //财务中心
  getVersionInfo: ['/v3/fin/account/info', 'GET'],  //获取用户版本信息 √
  getTrendInfo: ['/v3/data-center/business-total/user-online-trend', 'GET'],  //账户并发数据趋势图
  getFlowInfo: ['/v3/data-center/business-total/user-flow-pay', 'GET'],  //获取用量统计数据-流量
  getOnlinePay: ['/v3/data-center/business-total/user-online-pay-maxuv', 'GET'],  //获取并发-消费账单
  getFlowPay: ['/v3/data-center/business-total/user-flow-pay', 'GET'],  //获取流量-消费账单
  getAccountList: ['/v3/data-center/business-total/user-online-pay-detail', 'GET'], //获取财务总览-并发-消费账单
  getBusinessList: ['/v3/data-center/business-total/user-flow-pay-detail', 'GET'], //获取财务总览-流量-消费账单-分页明细[子账号也涉及]
  userFlowTrend: ['/v3/data-center/business-total/user-flow-trend', 'GET'], //账户流量数据趋势图
  exportFlow: ['/v3/data-center/business-total/export-user-flow-trend', 'GET'], //账户流量数据趋势图__导出
  exportOnline:  ['/v3/data-center/business-total/export-user-online-trend', 'GET'], //账户并发数据趋势图_导出
  exportFlowDetail:  ['/v3/data-center/business-total/export-user-flow-pay-detail', 'GET'], //流量明细导出
  exportOnlineDetail:  ['/v3/data-center/business-total/export-user-online-pay-detail', 'GET'], //并发明细导出




  // orderProfessional: ['/104/v3/finances/order/renew', 'POST', 'mock'], // 专业版购买、续费
  orderArrears: ['/v3/fin/order/arrears', 'POST'], // 财务总览-补缴欠费
  orderFlow: ['/v3/fin/order/flow', 'POST'], // 流量包购买
  orderUpgrade: ['/v3/fin/order/upgrade', 'POST'], // 升级并发
  orderExtend: ['/v3/fin/order/extend', 'POST'], // 购买扩展包
  orderInfo: ['/v3/fin/order/info', 'GET'], // 获取订单详情
  payOrder: ['/v3/fin/pay', 'POST'], // 支付订单
  buyDetail: ['/v3/fin/order/list', 'GET'], // 账单明细 - 购买明细
  deleteDetail: ['/v3/fin/order/delete', 'GET'], // 删除购买明细
  orderDetail: ['/v3/fin/admin-order/list', 'GET'], // 账单明细 - 开通明细

  //财务收益
  incomeInfo: ['/v3/fin/income', 'GET'], // 账户收益总览
  liveIncomeList: ['/v3/fin/income/live/list', 'GET'], // 直播收益
  liveIncomeDetailList: ['/v3/fin/income/live/details/list', 'GET'], // 直播收益详情列表
  packetIncomeList: ['/v3/fin/income/red-packet/list', 'GET'], // 红包收益
  accountList: ['/v3/fin/withdraw/list', 'GET'], // 提现明细
  weixinBinding: ['/v3/commons/auth/weixin', 'GET'], // 提现绑定  微信授权
  callbackUserInfo: ['/v3/users/oauth/callback', 'POST'], // 绑定之后获取用户信息
  withdrawalPhoneCode: ['/v3/fin/withdraw/phone-code', 'POST'], // 提现-发送手机验证码(仅提现，不包括更改微信发送验证码)
  withdrawal: ['/v3/fin/withdraw', 'POST'], // 提现

  //开发设置
  getAppList: ['/v3/users/appkeys/get-list', 'POST'], // 获取应用信息列表接口 jian.chang •••
  createApp: ['/v3/users/appkeys/create', 'POST'], // 创建应用 jian.chang •••
  getAppInfo: ['/v3/users/appkeys/get-info', 'POST'], // 获取应用详情 jian.chang •••
  modifyApp: ['/v3/users/appkeys/edit', 'POST'], // 修改应用 jian.chang •••
  appEditStatus: ['/v3/users/appkeys/set-status', 'POST'], // 修改应用状态（0停用 1启用 2删除） jian.chang •••

  // 账户管理
  homeInfoCreate: ['/v3/users/homepage/create', 'POST'], // 个人主页创建接口 Jia.li √字段未同步
  homeInfoGet: ['/v3/users/homepage/get-info', 'POST'], // 个人主页查询接口 Jia.li √
  homeInfoEdit: ['/v3/users/homepage/edit', 'POST'], // 个人主页更新接口 Jia.li √字段未同步
  checkAccount: ['/v3/users/user/check-account', 'POST'], // 账号检测接口 Jia.li
  resetPassword: ['/v3/users/user/reset-password', 'POST'], // 修改密码/密码找回/设置密码接口 Jia.li
  codeCheck: ['/v3/users/code/check', 'POST'], // check Jia.li
  bindInfo: ['/v3/users/user/bind-info', 'POST'], // 绑定邮箱、手机号接口 Jia.li

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
  getToolStatus: ['/v3/interacts/room/get-inav-tool-status', 'POST'], // 获取房间内各工具的状态 √

  // 发起端-活动
  getJoinUrl: ['/v3/webinars/live/get-url', 'GET'], // 获取参会地址 •••
  getRoleUrl: ['/v3/webinars/live/get-role-url', 'GET'], // 获取嘉宾/助理参会地址（openApi）•••
  roleLogin: ['/v3/webinars/live/role-login', 'GET'], // 口令用户登录验证
  roleLogout: ['/v3/webinars/live/role-logout', 'POST'], // 口令用户退出 •••
  getStreamPushAddress: ['/v3/webinars/live/get-stream-push-address', 'GET'], // 获取推流地址 •••
  liveClientInit: ['/v3/webinars/live/client-init', 'GET'], // 初始化直播间（客户端） •••
  liveStart: ['/v3/webinars/live/start', 'POST'], // 开始直播 √
  onlineUserList :['/interacts/chat-user/get-online-list', 'POST'], // 获取在线用户列表
  liveEnd: ['/v3/webinars/live/end', 'POST'], // 结束直播  √
  rebroadcastList: ['/v3/webinars/rebroadcast/list', 'GET'], // 转播列表 √
  rebroadcastPreview: ['/v3/webinars/rebroadcast/preview', 'GET'], // 转播预览 √
  v3RebroadcastStart: ['/v3/webinars/rebroadcast/start', 'GET'], // 转播开始 √
  v3RebroadcastStop: ['/v3/webinars/rebroadcast/stop', 'GET'], // 转播结束 √


  // 授权模块
  weixinAuth: ['/v3/commons/auth/weixin', 'GET'], // 微信授权接口 •••
  weixinShareAuth: ['/v3/commons/auth/weixin-share', 'GET'], // 微信分享接口 •••
  qqAuth: ['/v3/commons/auth/qq', 'GET'], // QQ授权接口 •••

  // 品牌设置
  getInterWebinarTag: ['/v3/interacts/webinar-tag/get-webinar-tag', 'POST'], // 获取活动标记 Jia.li
  setInterWebinarTag: ['/v3/interacts/webinar-tag/set-webinar-tag', 'POST'], // 保存和创建活动标记 Jia.li
  watchInterGetWebinarTag: ['/v3/interacts/webinar-tag/watch-get-webinar-tag', 'GET'], // 获取活动标记-观看端 Jia.li
  setSkinWebinarSkin: ['/v3/interacts/skin/set-webinar-skin', 'POST'], // 设置活动的默认皮肤 Jia.li
  skinCreate: ['/v3/interacts/skin/create', 'POST'], // 新建自定义皮肤 Jia.li
  getInterWebinarSkin: ['/v3/interacts/skin/get-webinar-skin', 'GET'], // 获取活动启用皮肤的信息详情 Jia.li
  skinUpdate: ['/v3/interacts/skin/update', 'POST'], // 更新自定义皮肤信息 Jia.li
  watchGetWebinarSkin: ['/v3/interacts/skin/watch-get-webinar-skin', 'GET'], // 观看端-获取皮肤 Jia.li

  // 观看端-活动
  watchAuth: ['/v3/webinars/watch/auth', 'POST'], // 观看授权
  watchInit: ['/v3/webinars/watch/init', 'GET'], // 初始化直播间
  watchSDKInit: ['/v3/webinars/watch/sdk-init', 'GET'], // 初始化直播间(sdk)
  watchInlineInit: ['/v3/webinars/watch/inline-init', 'GET'], // 初始化直播间-嵌入
  sendReportInfo: ['/v3/webinars/watch/get-report-info', 'GET'], // 获取上报信息

  // 观看端
  likeTotal: ['/v3/interacts/like/get-room-like', 'POST'], // 房间内点赞总数
  queryAdsInfo: ['/v3/interacts/recommend-adv/watch-get-adv-list', 'GET'], // 获取广告信息 •••
  getSkin: ['/v3/interacts/skin/watch-get-webinar-skin', 'GET'], // 获取皮肤
  getMenuDetailById: ['/v3/interacts/menu/menu-get-info', 'POST'], // 观看端自定义菜单详情
  attention: ['/v3/users/attentions/create', 'POST'], // 关注
  notAttention: ['/v3/users/attentions/delete', 'POST'], // 取消关注
  getWatchFilterWords: ['/v3/interacts/keyword/get-current-user-all-keyword', 'POST'], // 获取观看端关键字列表
  newWebinarMenus: ['/v3/interacts/menu/menu-list', 'POST'], // 观看页菜单列表 jian.chang
  goodsList: ['/v3/interacts/goods/get-on-sale-goods-list', 'GET'], // 商品推荐 xiaodong.ding
  keywordsList: ['/domian/api/webinar/v1/webinar/keywords-list', 'POST'], // 聊天关键词过滤 jian.chang
  getCustomMenuInfo: ['/api/webinar/v1/webinar/webinar-menus-detail', 'POST'], // 获取自定义菜单数据 jian.chang
  getConfigList: ['/v3/users/permission/get-config-list', 'POST'], // 获取观看端配置项
  getDefinitionConfig: ['/v3/interacts/players/get-clarity-default', 'POST'], // 获取默认清晰度配置项
  agreeInvite: ['/v3/interacts/inav-user/agree-invite', 'POST'], // 用户同意上麦
  rejectInvite: ['/v3/interacts/inav-user/reject-invite', 'POST'], // 用户拒绝上麦
  speakOn: ['/v3/interacts/inav-user/speak', 'POST'], // 用户上麦
  speakOff: ['/v3/interacts/inav-user/nospeak', 'POST'], // 用户自己下麦
  speakUserOff: ['/v3/interacts/inav/nospeak', 'POST'], // 设置其他人下麦
  v3SetHandsup : ['/v3/interacts/inav/set-handsup', 'POST'], // 设置房间举手状态---允许举手
  redPackInfo: ['/v3/interacts/redpacket/get-redpacket-status', 'POST'], // 获取红包信息
  applySpeakOn: ['/v3/interacts/inav-user/apply', 'POST'], // 用户申请上麦
  cancelApplySpeakOn: ['/v3/interacts/inav-user/cancel-apply', 'POST'], // 用户取消上麦申请
  speakList: ['/v3/interacts/inav/get-speak-list', 'POST'], // 上下麦列表
  redEnvCollectionRecord: ['/v3/interacts/redpacket/get-redpacket-partition-recorder', 'POST'], // 红包领取记录

  // 聊天
  getHistoryChat: ['/v3/interacts/chat/get-list', 'POST'], // 获取历史聊天消息 √
  deleteMsg: ['/v3/interacts/chat/delete-message', 'POST'], // 删除聊天消息
  setAllBanned: ['/v3/interacts/chat-user/set-all-banned', 'POST'], // 设置全体禁言
  setKickOut: ['/v3/interacts/chat-user/set-kicked', 'POST'], // 踢出取消踢出
  setBanned: ['/v3/interacts/chat-user/set-banned', 'POST'], // 设置禁言
  getHistoryQaMsg: ['/v3/interacts/qa/get-webinar-history-questions', 'POST'], // 获取历史问答记录
  sendQaMsg: ['/v3/interacts/qa/submit-one-question', 'POST'], // 发送问答
  v3GetBannedList: ['/v3/interacts/chat-user/get-banned-list', 'POST'], // 获取禁言列表 √
  v3GetKickedList: ['/v3/interacts/chat-user/get-kicked-list', 'POST'], // 获取踢出列表  √
  getKickList: ['/v3/interacts/chat-user/get-kicked-list', 'POST'], // 获取踢出列表
  getOnlineList: ['/v3/interacts/chat-user/get-online-list', 'POST'], // 获取在线列表

  // PAAS 生产环境
  allowMsg: ['//api.vhallyun.com/sdk/v2/message/lists', 'GET', 'paas'], // 获取消息通过列表
  setChannelSwitch: ['//api.vhallyun.com/sdk/v2/message/set-channel-switch','GET', false, 'paas'], // 设置审核开关接口
  getChannelSwitch: ['//api.vhallyun.com/sdk/v2/message/get-channel-switch','GET', false, 'paas'], // 更新总开的状态
  setAutoSend: ['//api.vhallyun.com/sdk/v2/message/set-channel-switch-options','GET', false, 'paas'], // 设置是否自动处理聊天数据接口
  getChatAuditLists: ['//api.vhallyun.com/sdk/v2/message/get-chat-audit-lists','GET', false,'paas'], // 获取待审核消息列表
  applyMessageSend: ['//api.vhallyun.com/sdk/v2/message/apply-message-send','POST', false,'paas'], // 审核消息操作
  // 礼物
  sendGift: ['/v3/interacts/gift/send-gift', 'POST'], // 直播间发送礼物
  giftList: ['/v3/interacts/gift/get-webinar-using-gift-list', 'GET'], // 礼物列表

  // 点赞
  like: ['/v3/interacts/like/create-user-like', 'POST'], // 点赞

  // 打赏
  seadAwardMsg: ['/v3/interacts/reward/create-user-reward', 'POST'], // 打赏
  getQeustionList: ['/v3/vss/survey/list-webinar-survey', 'POST'], // 获取问卷列表

  // 抽奖
  saveLotteryInfo: ['/v3/vss/lottery/award', 'POST'], // 保存中奖人信息
  // 问卷
  submitQuestion: ['/v3/interacts/survey/submit-survey-answer', 'POST'], // 提交问卷
  // 签到
  userSingin: ['/v3/interacts/sign/user-sign', 'POST'], // 用户签到
  // 开平海报
  getPlaybillInfo: ['/v3/interacts/adv/watch-get-screen-poster', 'GET'], // 获取开屏海报信息
  // 互动
  setMainScreen: ['/v3/interacts/room/set-main-screen', 'POST'], // 设置主屏
  setRoomDevice: ['/v3/interacts/room/set-device-status', 'POST'], // 设置音视频设备开关
  setSpeaker: ['/v3/interacts/room/set-doc-permission', 'POST'], // 设置主讲人
  allowSpeak: ['/v3/interacts/inav/agree-apply', 'POST'], // 允许用户上麦   主持人同意上麦
  v3InviteMic: ['/v3/interacts/inav/invite', 'POST'],// 邀请用户上麦
  v3SetDevice: ['/v3/interacts/room/set-device', 'POST'], //设置房间用户的设备检测状态
  v3SetDesktop: ['/v3/interacts/room/set-desktop', 'POST'], // 开启桌面共享自动最大化

  // 问答
  v3GetQa: ['/v3/interacts/qa/enable', 'POST'], // 主持人开启问答
  v3CloseQa: ['/v3/interacts/qa/disable', 'POST'], // 主持人关闭问答
  v3GetQaNum: ['/v3/interacts/qa/get-current-play-question-num', 'POST'], // 获取当前场次收集到的问题个数
  v3GetHistoryQaNum: ['/v3/interacts/qa/reply-user-question', 'POST'], // 获取当前场次收集到的历史问答 主持人
  channelInfo: [`${process.env.VUE_APP_VSS_HOST}/cmpt/room/get`, 'POST'], // 获取频道信息
  // 发起端所有新增
  v3SendNotice: ['/v3/interacts/chat/send-notice-message', 'POST'], // 发送公告  √

  // 签到
  v3CreateSifn: ['/v3/interacts/sign/create-and-push', 'POST'], // 创建签到  √
  v3StopSign: ['/v3/interacts/sign/set-end-sign', 'POST'], // 结束签到  √
  v3GetCurrentSign:['/v3/interacts/sign/get-doing-sign', 'POST'], // 获取当前活动正在的签到  √
  v3GetSignList:['/v3/interacts/sign/get-user-sign-list', 'POST'], // 获取当前活动的签到记录  √
  v3GetSignTotal: ['/v3/interacts/sign/get-sign-total', 'POST'], // 获取当前活动的签到总数  √

  reportData: ['/login', 'GET']
};

const getApi = api => {
  return apis[api] && apis[api];
};
export default getApi;
