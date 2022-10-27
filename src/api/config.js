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
  saveLotteryPrize: ['/v3/vss/lottery/save-prize', 'POST'], // 奖品设置-资料库选择奖品保存按钮

  // 问卷
  createQuestion: ['/v3/vss/survey/create-shared-survey', 'POST' ], //共享库_创建问卷
  editQuestion: ['/v3/vss/survey/update-shared-survey', 'POST' ], //共享库_编辑问卷
  getQuestionList: ['/v3/vss/survey/list-shared-survey', 'GET' ], //问卷列表
  deleteQuestion: ['/v3/vss/survey/delete-shared-survey', 'POST' ], //共享库_删除问卷
  copyQuestion: ['/v3/vss/survey/copy-shared-survey', 'GET' ], //共享库-问卷复制

  // 直播-问卷
  getPassId: ['/v3/vss/survey/init', 'GET'], //生成前端调用Paas使用的授权token
  createLiveQuestion: ['/v3/vss/survey/create-webinar-survey', 'POST' ], //直播设置_创建问卷
  editLiveQuestion: ['/v3/vss/survey/update-webinar-survey', 'POST' ], //直播设置_编辑问卷
  getLiveQuestionList: ['/v3/vss/survey/list-webinar-survey', 'GET' ], //直播设置_问卷列表
  deleteLiveQuestion: ['/v3/vss/survey/delete-webinar-surveys', 'POST' ], //直播设置_删除问卷
  copyLiveQuestion: ['/v3/vss/survey/copy-webinar-survey', 'GET' ], //直播设置-问卷复制
  sharedLiveQuestion: ['/v3/vss/survey/clone-from-shared', 'POST' ], //直播设置_从资料库添加


  shareGiftList: ['/v3/interacts/gift/shared-gift-list', 'GET'], // 共享礼物库
  updateGiftInfo: ['/v3/interacts/gift/update-shared-gift', 'POST'], // 更新共享库礼品信息
  createGiftInfo: ['/v3/interacts/gift/create-shared-gift', 'POST'], // 创建共享库礼品信息
  deleteGift: ['/v3/interacts/gift/delete-shared-gift', 'POST'], // 删除共享库礼品
  liveGiftList: ['/v3/interacts/gift/get-webinar-using-gift-list', 'GET'], // 活动下礼物库

  //广告推荐
  getAdvList: ['/v3/interacts/recommend-adv/get-adv-list', 'GET'], //获取广告列表 √
  advSaveToWebinar: ['/v3/interacts/recommend-adv/database-to-activity', 'POST'], //从资料库保存到活动 √
  createAdv: ['/v3/interacts/recommend-adv/create-adv', 'POST'], //创建广告 √
  updateAdv: ['/v3/interacts/recommend-adv/update-adv', 'POST'], //编辑广告 √
  deleteAdv: ['/v3/interacts/recommend-adv/batch-delete-adv', 'POST'], //批量删除广告 √
  viewAdv: ['/v3/interacts/recommend-adv/view-adv', 'GET'], //查看单条广告详情 •••

  //推广嵌入
  getStreamPushList: ['/v3/webinars/stream/get-push-list', 'GET'], //获取推流列表
  updateStreamPushEnabled: ['/v3/webinars/stream/push-enabled', 'POST'], //是否启动第三方推流
  createStreamPush: ['/v3/webinars/stream/create-push', 'POST'], //创建推流地址
  updateStreamPush: ['/v3/webinars/stream/update-push', 'POST'], //编辑推流地址
  deleteStreamPush: ['/v3/webinars/stream/delete-push', 'POST'], //删除推流地址

  //播放器设置
  setScrolling: ['/v3/interacts/players/set-scrolling-screen-config', 'POST'], //直播设置_设置播放器跑马灯 •••
  setWatermark: ['/v3/interacts/players/set-watermark-config', 'POST'], //从资料库保存到活动 •••
  setOtherOption: ['/v3/interacts/players/set-other-set-info', 'POST'], // 设置播放器其他配置
  getScrolling: ['/v3/interacts/players/get-scrolling-screen-config', 'GET'], //观看端_获取跑马灯设置配置信息
  getWatermark: ['/v3/interacts/players/get-watermark-config', 'GET'], //观看端_获取水印设置 •••
  getOtherOptions: ['/v3/interacts/players/watch-get-other-set-info', 'GET'], // 获取观看端播放器其他配置

  //公众号 开屏海报
  setPublicInfo: ['/v3/interacts/adv/set-public-account-config-info', 'POST'], //保存公众号展示配置  •••接口有问题
  getPublicInfo: ['/v3/interacts/adv/get-public-account-config-info', 'GET'], //获取公众号展示配置信息 •••接口有问题
  setPosterInfo: ['/v3/interacts/adv/set-screen-poster-config-info', 'POST'], //保存开屏海报配置 •••接口有问题
  getPosterInfo: ['/v3/interacts/adv/get-screen-poster-config-info', 'GET'], //获取开屏海报配置信息 •••接口有问题
  getScreenPublicInfo: ['/v3/interacts/adv/watch-get-public-account', 'GET'], //直播设置_观看端_获取公众号广告 •••接口有问题
  getScreenPosterInfo: ['/v3/interacts/adv/watch-get-screen-poster', 'GET'], //直播设置_观看端_获取开屏海报 •••接口有问题

  //  邀请卡
  getCardDetailInfo: ['/v3/interacts/invite-card/get-info', 'POST'], //获取邀请卡详情
  setCardStatus: ['/v3/interacts/invite-card/set-card-status', 'POST'], //开启/关闭邀请卡
  editCardStatus: ['/v3/interacts/invite-card/edit', 'POST'], //修改邀请卡信息
  createRelation: ['/v3/interacts/invite-card/create-invite-self-relation', 'POST'], //创建邀请人邀请自己的邀请关系
  createOtherRelation: ['/v3/interacts/invite-card/create-invite-othor-relation', 'POST'], //创建邀请人邀请被邀请人的邀请关系
  getCardList: ['/v3/interacts/invite-card/get-list', 'POST'], //获取邀请列表
  getTopList: ['/v3/interacts/invite-card/get-top-list', 'POST'], //获取邀请榜

  // 分享设置
  getShareSettingInfo: ['/v3/webinars/share/info', 'POST'],  //获取分享设置详情
  setShareSettingInfo: ['/v3/webinars/share/edit', 'POST'],  //保存分享设置

  // 直播模块
  createLive: ['/v3/webinars/webinar/create', 'POST'], // 活动创建/直播创建 jian.chang  √
  getHighLimit: ['/v3/fin/user-vip/get-balance', 'GET'], // 最高并发值 --获取付费用户余量
  liveList: ['/v3/webinars/webinar/get-list', 'POST'], // 获取直播列表 jian.chang  √
  getWebinarInfo: ['/v3/webinars/webinar/info', 'POST'], // 查询活动基础信息接口
  setCustomRoleName: ['/v3/webinars/privilege/edit-role-name', 'POST'], // 设置自定义角色名称
  liveEdit: ['/v3/webinars/webinar/edit', 'POST'], // 活动修改 √
  liveDel: ['/v3/webinars/webinar/delete', 'POST'], // 活动删除  √
  demandCreate: ['/v3/webinars/webinar/create-demand', 'POST'], // 点播创建
  checkLive: ['/v3/webinars/live/check', 'POST'], // 进入直播前检测
  getPCDownloadUrl: ['/v3/commons/version/upgrade', 'POST'], // 客户端下载地址获取接口
  getLiveDirectorStatus: ['/v3/webinars/director/get-status', 'GET'], // 控制台-获取云导播台状态
  getLiveDirectorSeatList: ['/v3/webinars/director/get-seat-list', 'GET'], // 控制台-获取机位列表
  setLiveDirectorSeat: ['/v3/webinars/director/select-seat', 'GET'], // 控制台-设置机位列表
  getLiveDirectorResolution: ['/v3/webinars/director/get-webinar-resolution', 'GET'], // 控制台-获取活动分辨率信息
  setLiveDirectorResolution: ['/v3/webinars/director/update-webinar-resolution', 'POST'], // 控制台-调整活动分辨率

  // 插播
  waitingVideoList: ['/v3/webinars/waiting-file/get-list', 'POST'], // 插播列表
  waitingVideoFile: ['/v3/webinars/waiting-file/batch-video-file', 'POST'], // 获取音视频导入插播文件
  waitingVideoEdit: ['/v3/webinars/waiting-file/edit', 'POST'], // 插播文件编辑
  waitingVideoCreate: ['/v3/webinars/waiting-file/create', 'POST'], // 插播文件创建
  waitingVideoDelete: ['/v3/webinars/waiting-file/deletes', 'POST'], // 插播文件删除

  // 专题
  subjectCreate: ['/v3/webinars/subject/create', 'POST'], // 专题创建
  subjectList: ['/v3/webinars/subject/get-list', 'POST'], // 专题列表
  subjectEdit: ['/v3/webinars/subject/edit', 'POST'], // 专题修改
  subjectInfo: ['/v3/webinars/subject/info', 'POST'], // 获取专题详情接口(专题预览)
  subjectDel: ['/v3/webinars/subject/delete', 'POST'], // 专题删除接口 •••
  btachSubject: ['/v3/webinars/subject/get-batch-info', 'POST'],

  // 专题鉴权
  subjectCheck: ['/v3/webinars/subject/check-edit-subject', 'POST'], //专题修改前请求判断活动是否与其他专题重合
  createSubjectCode: ['/v3/webinars/subject/post-generate-fcode', 'POST'], //创建f码
  downloadSubjectCode: ['/v3/webinars/subject/export-fcode', 'POST'], //邀请码下载
  createSubjectVerify: ['/v3/webinars/subject/save-verify', 'POST'], //专题观看限制保存接口
  subjectVerifyInfo: ['/v3/webinars/subject/get-verify', 'POST'], //专题观看限制获取接口


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
  getAreaList: ['/data/area.json','GET', false, false, 'staticdata'], // 本地静态资源区域列表

  // 第三方K值模块
  kidAuthInfo:  ['/v3/webinars/auth/info', 'POST'], // 获取单个活动K值详情接口 •••
  kidAuthEdit:  ['/v3/webinars/auth/edit', 'POST'], // 单个活动K值设置修改接口 •••


  // 暖场视频
  warmCreate: ['/v3/webinars/warm/create', 'POST'], // 添加暖场视频
  warnInfo: ['/v3/webinars/warm/info', 'POST'], // 获取暖场视频详情接口
  warnDelete: ['/v3/webinars/warm/delete', 'POST'], // 删除暖场视频
  warnEdit: ['/v3/webinars/warm/edit', 'POST'], // 修改暖场视频封面图片接口
  warmOpen: ['/v3/webinars/warm/open-warm', 'POST'], // 开启暖场视频

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
  getGoodInfo: ['/v3/interacts/goods/watch-get-goods-details', 'GET'], // 商品详情

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
  fCodeExecute: ['/v3/webinars/webinar/post-generate-fcode', 'POST'],// 生成验证码 jia.li  √
  getFCodeExcel: ['/v3/webinars/webinar/get-fcode-excel', 'POST'],// 生成验证码 jia.li  √
  getAudienceList:['/v3/webinars/audience-groups/group-user-list','POST'],//预设小组-观众列表
  saveAudienceSave:['/v3/webinars/audience/save','POST'],//预设小组保存

  // 自定义菜单
  menuTplList: ['/v3/interacts/menu/components-list', 'POST'], // 控制台-组件列表接口 jia.li
  customMenuList: ['/v3/interacts/menu/bak-menu-list', 'POST'], // 控制台-菜单列表接口 jia.li
  customMenuSave: ['/v3/interacts/menu/save', 'POST'], // 控制台-菜单保存接口 jia.li
  webinarCMenuList: ['/v3/interacts/menu/menu-list', 'POST'], // 观看端-菜单列表接口 jia.li
  webinarCMenuGet: ['/v3/interacts/menu/menu-get-info', 'POST'], // 观看端-单个菜单详情接口 jia.li
  // 虚拟人数
  virtualSetSave: ['/v3/webinars/virtual/add', 'POST'], // 控制台-编辑虚拟人数配置 jia.li  √
  virtualGet: ['/v3/webinars/virtual/info', 'GET'], // 控制台-获取虚拟人数配virtual置 jia.li  √
  virtualClientGet: ['/v3/webinars/virtual/get-base', 'GET'], // 发起端-获取虚拟观众基数 √
  virtualClientStart: ['/v3/webinars/virtual/start', 'GET'], // 发起端-开始增加虚拟观众 √
  virtualAccumulation: ['/v3/webinars/virtual/accumulation', 'GET'], // 发起端-增加虚拟观众 √
  // virtualSwitchSet: ['/v3/webinars/webinar/post-switch-virtual', 'POST', 'mock'], // 控制台-虚拟人数开关 jia.li •••废弃

  // 直播间设置

  // 严禁词
  getKeywordList: ['/v3/interacts/keyword/get-list', 'POST'], // 获取严禁词列表[控制台调用] jia.li  √
  multiKeywordAdd: ['/v3/interacts/keyword/batch-create', 'POST'], // 添加严禁词-可批量 jia.li  √
  multiKeywordEdit: ['/v3/interacts/keyword/edit', 'POST'], // 修改严禁词 jia.li  √
  multiKeywordDel: ['/v3/interacts/keyword/batch-delete', 'POST'], // 批量删除严禁词 jia.li  √
  checkUploadKeyword: ['/v3/interacts/keyword/check-upload-file', 'POST'], // 校验上传文件可以上传的严禁词 jia.li •••暂时不用
  uploadKeywordAdd: ['/v3/interacts/keyword/upload-file-and-create', 'POST'], // 上传严禁词文件并添加严禁词 jia.li
  getKeywordTemplate: ['/v3/interacts/keyword/get-template-url', 'POST'], // 获取严禁词模板地址 jia.li  √
  getAudinceKeyWordList: ['/v3/interacts/keyword/get-current-user-all-keyword', 'POST'], // 获取观看端严禁词列表
  // 消息管理
  getMsgList: ['/v3/commons/msgcenter/list', 'POST'], // 站内消息列表接口 jia.li  √
  msgDel: ['/v3/commons/msgcenter/delete', 'POST'], // 站内消息删除接口 jia.li  √
  getMsgInfo: ['/v3/commons/msgcenter/get-info', 'POST'], // 站内消息详情接口 jia.li  √
  getUnreadNum: ['/v3/commons/msgcenter/unread-num', 'POST'], // 查询消息未读数 jia.li  √
  executeUseRead: ['/v3/commons/msgcenter/batch-read', 'POST'], // 标记已读 jia.li  √

  // 文件上传(图片)
  uploadImage: ['/v3/commons/upload/index', 'POST'], // 文件上传（图片） jia.li •••有调整

  // 回放模块
  playBackList: ['/v3/webinars/record/get-list', 'POST'], // 回放列表 xiaodong.ding  √
  playBackEdit: ['/v3/webinars/record/edit', 'POST'], // 修改回放标题 xiaodong.ding  √
  playBackDelete: ['/v3/webinars/record/delete', 'POST'], // 删除回放 xiaodong.ding  √
  playBackDuration: ['/99/v3/webinars/record/get-record-duration', 'POST', 'mock'], // 获取回放时长 jian.chang
  playBackDemand: ['/v3/webinars/webinar/create-demand', 'POST'], // 回放发布为点播 jian.chang
  playBackPreview: ['/v3/webinars/record/preview', 'POST'], // 回放预览 xiaodong.ding
  defaultRecord: ['/v3/webinars/record/set-default', 'POST'], // 设置默认 xiaodong.ding
  playBackChaptersGet: ['/v3/interacts/document/get-chapters', 'POST'], // 设置默认 xiaodong.ding
  playBackDownUrlGet: ['/v3/webinars/record/check-download', 'POST'], // 获取回放下载地址 xiaodong.ding
  tailorSave: ['/v3/webinars/record/cut', 'POST'], // 视频裁剪保存接口 xiaodong.ding
  createRecordinCtrl: ['/v3/webinars/record/create', 'POST'], // 创建回放 xiaodong.ding
  saveChapters: ['/v3/webinars/record/save-doc-info', 'POST'], // 保存章节信息 xiaodong.ding
  checkChapterSave: ['/v3/webinars/record/check-chatper-save', 'POST'], // 检查章节保存状态 xiaodong.ding
  msgInitConsole: ['/v3/webinars/record/msg-init-console', 'POST'], // 初始化消息 xiaodong.ding
  initRecord: ['/v3/webinars/record/init', 'POST'], // 回放录制初始化 xiaodong.ding
  getDocInfo: ['/v3/webinars/record/get-doc-info', 'POST'], // 查询章节信息 xiaodong.ding
  startrecord: ['/v3/webinars/record/start-record', 'POST'], // 开始录制 xiaodong.ding
  stoprecord: ['/v3/webinars/record/stop-record', 'POST'], // 结束录制 xiaodong.ding
  recordCheck: ['/v3/webinars/record/check', 'POST'], // 开始录制前检测 xiaodong.ding
  recordInfo: ['/v3/webinars/record/get-info', 'POST'], // 回放详情 xiaodong.ding
  getDefaultStartTime: ['/v3/webinars/record/get-record-time', 'POST'], // 获取创建回放初始时间-预览场景 xiaodong.ding
  recordReTranscode: ['/v3/webinars/record/record-trans-code', 'POST'], // 回放重新生成
  recordRemark: ['/v3/webinars/record/record-remake', 'POST'], // 课件重制
  recordEncrypt: ['/v3/webinars/record/push-entry-video', 'POST'], // 视频加密

  // 小组视频
  getGroupRecordList:['/v3/webinars/record/get-group-record-list', 'POST'], //小组回放列表

  //首页
  getInfo: ['/v3/users/user/get-info', 'POST'], //获取用户信息（昵称、头像等）场景1：控制台首页 / 场景2：控制台账户信息页  √
  ssoAutoLogin:  ['/v3/users/user/auto-login', 'POST'], // sso自动登录

  //用户RBAC
  getRoleRbacList: ['/v3/users/roles/list', 'GET'], //角色- 列表

  // 登录
  loginInfo: ['/v3/users/user/login', 'POST'],  //登录接口  √
  loginOut: ['/v3/users/user/logout', 'POST'],  //退出接口  √
  loginCheck: ['/v3/users/user/login-check', 'POST'],  //登录账号锁定检测接口
  sendCode: ['/v3/users/code/send', 'POST'],  //发送验证码接口
  register: ['/v3/users/user/register', 'POST'],  //注册接口
  getLoginKey: ['/v3/users/user/get-key-login', 'POST'], // 获取登录公钥
  refreshToken: ['/v3/users/user/refresh-token', 'post'], // 刷新token

  //数据中心
  getDataCenterInfo: ['/v3/data-center/account-all-data', 'GET'], //获取账户下的总数据  数据总览
  getActiveDataList: ['/v3/webinars/webinar/get-data-list', 'POST'], //活动数据列表接口   活动数据

  //数据中心(账号维度下)导出
  exportCenterInfo: ['/v3/data-center/account-export-data', 'GET'], //导出 -- 账号下的数据导出
  exportWebinar: ['/v3/webinars/webinar/get-data-list-excel', 'POST'], //导出 -- 活动数据

  // 直播-数据报告
  getStatisticsinfo: ['/v3/data-center/webinar-statistics-info', 'GET'], //获取活动数据下报告
  getMaxuv: ['/v3/data-center/webinar-max-uv', 'GET'], //获取活动最高并发
  getHeat: ['/v3/data-center/webinar-heat', 'GET'], //获取活动热度
  getProvinceinfo: ['/v3/data-center/webinar-province-info', 'GET'], //获取活动省份统计
  getDeviceinfo: ['/v3/data-center/webinar-device-info', 'GET'], //获取活动设备信息
  getBrowserinfo: ['/v3/data-center/webinar-browser-info', 'GET'], //获取活动浏览器信息
  getDateUvinfo: ['/v3/data-center/webinar-date-uv', 'GET'], //获取观看人数趋势
  getWebinarinfo: ['/v3/data-center/webinar-date-pv', 'GET'], //获取并发趋势

  exportWebinarInfo: ['/v3/data-center/export', 'GET'], //导出 -- 直播下数据报告

  // 直播-用户统计
  getUserBaseinfo: ['/v3/data-center/user-watch-detail', 'GET'], //获取用户观看详情
  exportUserinfo: ['/v3/data-center/export-user-watch-detail', 'GET'], //导出 -- 用户观看详情

  // 直播-互动统计
  getRecodrderInfo: ['/v3/interacts/qa/get-qa-recorder-count', 'GET'], // 获取问答总数
  getRoomLikeInfo: ['/v3/interacts/like/get-room-like', 'POST'], // 获取房间的点赞数量
  getChatListInfo: ['/v3/interacts/chat/get-list', 'POST'], // 获取当前房间聊天总数和列表
  getSignInfo: ['/v3/interacts/sign/get-sign-total', 'POST'], // 获取发起签到的签到总数
  getSpeakListInfo: ['/v3/interacts/inav/get-speak-record', 'POST'], // 获取连麦总数
  getRewardListInfo: ['/v3/interacts/reward/get-room-reward-stat', 'POST'], // 获取房间打赏统计
  getShareListInfo: ['/v3/interacts/share/get-top-list', 'POST'], // 获取分享榜
  getInviteListInfo: ['/v3/interacts/invite-card/get-list', 'POST'], // 获取邀请数
  getPrizeUserInfo: ['/v3/vss/lottery/winner/count', 'GET'], // 获取抽奖中奖人总数
  getPrizeListInfo: ['/v3/vss/lottery/get-prize-data-info-list', 'GET'], // 获取信息收集-抽奖数据/日期筛选
  getSurveyInfo: ['/v3/vss/survey/get-webinar-submit-nums', 'GET'], // 获取互动统计-房间下问卷提交人数
  getSurveyUsageInfo: ['/v3/vss/survey/get-webinar-published-survey-usage', 'GET'], // 获取活动下问卷使用数据概览
  getGiftIncome: ['/v3/interacts/gift/get-gift-income-stat', 'GET'], // 获取礼物收益
  getRedpacketInfo: ['/v3/interacts/redpacket/get-redpacket-overview', 'GET'], // 获取活动下红包统计数据
  getCodeRedpacketInfo: ['/v3/interacts/pwd-redpacket/get-redpacket-overview', 'GET'], // 获取活动下口令红包统计数据
  getAnswerListInfo: ['/v3/webinars/export/get-total', 'POST'], // 获取 报名表单 -- 试看人数 --- 预约人数  总人数

  exportSubscribe: ['/v3/webinars/export/subscribe', 'POST'], //导出 -- 预约
  exportPreview: ['/v3/webinars/export/preview', 'POST'], //数据导出 -- 试看
  exportShareInfo: ['/v3/interacts/share/export', 'GET'], //导出 -- 分享
  exportReward: ['/v3/interacts/reward/export-reward-record', 'GET'], //数据导出 -- 打赏
  exportGift: ['/v3/interacts/gift/export-gift-recorder', 'GET'], //导出礼物记录
  exportForm: ['/v3/webinars/registration-form/export-reg-record', 'GET'], //导出 -- 报名表单
  exportSpeak: ['/v3/interacts/inav/export-speak-record', 'POST'], //导出 --上麦用户记录

  //直播-互动统计-详情页
  getRecodrderList: ['/v3/interacts/qa/get-questions-list', 'POST'], // 获取问答记录列表
  deleteRecodrder: ['/v3/interacts/qa/delete-question', 'POST'], // 获取删除一条问问答记录
  exportRecodrder: ['/v3/interacts/qa/export-qa-recorder', 'GET'], // 导出问答记录
  deleteAllRecodrder: ['/v3/interacts/qa/batch-delete-qa', 'POST'], // 批量删除提问或者答案
  deleteChatList: ['/v3/interacts/chat/batch-delete-message', 'POST'], //批量删除聊天的消息
  getRedpacketList: ['/v3/interacts/redpacket/get-redpacket-send-recorder', 'GET'], //活动群红包发送记录
  getCodeRedpacketList: ['/v3/interacts/pwd-redpacket/get-redpacket-send-recorder', 'GET'], //活动口令红包发送记录
  getSignList: ['/v3/interacts/sign/get-sign-stat-list', 'GET'], //获取发起的签到列表
  getFollowersList: ['', 'GET'], //获取关注用户列表
  exportDetailInvite: ['/v3/interacts/invite-card/export-invite-details', 'GET'], //邀请详情导出
  exportInvite: ['/v3/interacts/invite-card/export', 'GET'], //邀请导出
  exportChat: ['/v3/interacts/chat/export', 'POST'], //导出当前房间聊天列表
  exportSign: ['/v3/interacts/sign/export-sign-list', 'POST'], //导出-签到列表
  exportDetailSign: ['/v3/interacts/sign/export-user-sign-list', 'POST'], //导出-签到明细列表
  exportSurvey: ['/v3/vss/survey/export-webinar-published-survey-usage', 'GET'], //导出问卷数据
  exportSurveyDetial: ['/v3/vss/survey/export-get-webinar-survey-usage-detail', 'POST'], //导出问卷单个数据
  exportLottery: ['/v3/vss/lottery/export-prize-data-info-list', 'GET'], //导出-抽奖
  exportDetailLottery: ['/v3/vss/lottery/export-lottery-user-detail', 'GET'], //导出-抽奖-详情
  exportRedpacket: ['/v3/interacts/redpacket/export-redpacket-send-recorder', 'GET'], //导出活动群红包发送记录
  exportDetailRedpacket: ['/v3/interacts/redpacket/export-redpacket-receive-recorder', 'GET'], //导出单个红包的领取明细
  exportFollowersInfo: ['', 'POST'], //导出-关注用户列表
  exportCodeRedpacket: ['/v3/interacts/pwd-redpacket/export-redpacket-send-recorder', 'GET'], //导出活动口令红包发送记录
  exportDetailCodeRedpacket: ['/v3/interacts/pwd-redpacket/export-redpacket-receive-recorder', 'GET'], //导出单个口令红包的领取明细

  getQuestionDetailList: ['/v3/vss/survey/get-survey-question-detail', 'GET'], //回答问题人数统计



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
  getChildPermission: ['/v3/users/child-role/get-permission', 'POST'], // 获取当前账户子账号权限

  //财务中心
  getVersionInfo: ['/v3/fin/account/info', 'GET'],  //获取用户版本信息 √
  getTrendLineInfo: ['/v3/data-center/business-total/user-online-trend', 'GET'],  //账户--并发--数据趋势图
  getFlowLineInfo: ['/v3/data-center/business-total/user-flow-trend', 'GET'],  // 账户---流量----数据趋势图
  getTimeLineInfo: ['/v3/data-center/business-total/user-duration-trend', 'GET'],  // 账户---时长----数据趋势图
  getTrendHighInfo: ['/v3/data-center/business-total/user-online-pay-maxuv', 'GET'],  // 并发-消费账单-最高并发
  getFlowPayInfo: ['/v3/data-center/business-total/user-flow-pay', 'GET'],  // 流量--消费账单-活动总数
  getTrendInfo: ['/v3/data-center/business-total/user-online-trend', 'GET'],  //账户并发数据趋势图
  getFlowInfo: ['/v3/data-center/business-total/user-flow-pay', 'GET'],  //获取用量统计数据-流量
  getDurationInfo: ['/v3/data-center/business-total/user-duration-pay', 'GET'],  //获取时长-消费账单
  getOnlinePay: ['/v3/data-center/business-total/user-online-pay-maxuv', 'GET'],  //获取并发-消费账单
  getFlowPay: ['/v3/data-center/business-total/user-flow-pay', 'GET'],  //获取流量-消费账单
  getAccountList: ['/v3/data-center/business-total/user-online-pay-detail', 'GET'], //获取财务总览-并发-消费账单
  getBusinessList: ['/v3/data-center/business-total/user-flow-pay-detail', 'GET'], //获取财务总览-流量-消费账单-分页明细[子账号也涉及]
  getDurationList: ['/v3/data-center/business-total/user-duration-pay-detail', 'GET'],  //获取时长-消费账单-分页明细

  // 财务中心导出
  exportFlow: ['/v3/data-center/business-total/export-user-flow-trend', 'GET'], //账户流量数据趋势图__导出
  exportOnline:  ['/v3/data-center/business-total/export-user-online-trend', 'GET'], //账户并发数据趋势图_导出
  exportDuration:  ['/v3/data-center/business-total/export-user-duration-trend', 'GET'], //账户时长数据趋势图_导出
  exportFlowDetail:  ['/v3/data-center/business-total/export-user-flow-pay-detail', 'GET'], //消费账单-流量明细导出
  exportOnlineDetail:  ['/v3/data-center/business-total/export-user-online-pay-detail', 'GET'], //消费账单-并发明细导出
  exportDurationDetail:  ['/v3/data-center/business-total/export-user-duration-pay-detail', 'GET'], //消费账单-时长明细导出
  exporOrder: ['/v3/fin/order/export', 'GET'], //账单明细-购买明细 导出
  exportAdmin:  ['/v3/fin/admin-order/export', 'GET'], //账单明细-开通明细 导出
  exportWithdraw:  ['/v3/fin/withdraw/export', 'GET'], //提现明细 导出
  exportIncomeDetail:  ['/v3/fin/income/live/details/export', 'GET'], //直播收益详情列表导出
  exportLiveIncome:  ['/v3/fin/income/live/export', 'GET'], //直播收益明细导出
  exportRedPacket:  ['/v3/fin/income/red-packet/export', 'GET'], //红包收益明细导出

 //账务-账单  财务-购买
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
  orderStatus: ['/v3/fin/order/unpaid', 'GET'], //查询待支付订单

  // 为了测试用支付完成接口  只测试用
  finishPayList: ['/v3/fin/pay/notify', 'POST'], //测试是否支付成功

  //财务收益
  incomeInfo: ['/v3/fin/income', 'GET'], // 账户收益总览
  liveIncomeList: ['/v3/fin/income/live/list', 'GET'], // 直播收益
  liveIncomeDetailList: ['/v3/fin/income/live/details/list', 'GET'], // 直播收益详情列表
  packetIncomeList: ['/v3/fin/income/red-packet/list', 'GET'], // 红包收益
  accountList: ['/v3/fin/withdraw/list', 'GET'], // 提现明细
  weixinBinding: ['/v3/commons/auth/weixin', 'GET'], // 提现绑定  微信授权
  getBindKey: ['/v3/users/user/mark', 'POST'], //创建用户标识
  callbackUserInfo: ['/v3/users/oauth/callback', 'POST'], // 绑定之后获取用户信息
  withdrawalPhoneCode: ['/v3/fin/withdraw/phone-code', 'POST'], // 提现-发送手机验证码(仅提现，不包括更改微信发送验证码)
  withdrawal: ['/v3/fin/withdraw', 'POST'], // 提现

  //开发设置
  getAppList: ['/v3/users/appkeys/get-list', 'POST'], // 获取应用信息列表接口 jian.chang •••
  createApp: ['/v3/users/appkeys/create', 'POST'], // 创建应用 jian.chang •••
  getAppInfo: ['/v3/users/appkeys/get-info', 'POST'], // 获取应用详情 jian.chang •••
  modifyApp: ['/v3/users/appkeys/edit', 'POST'], // 修改应用 jian.chang •••
  appEditStatus: ['/v3/users/appkeys/set-status', 'POST'], // 修改应用状态（0停用 1启用 2删除） jian.chang •••
  getCallbackInfo: ['/v3/users/callback-lists/get-info', 'POST'], // 回调事件查询接口
  editCallbackInfo: ['/v3/users/callback-lists/edit', 'POST'], // 回调事件修改接口
  addCallbackInfo: ['/v3/users/callback-lists/create', 'POST'], // 回调事件创建接口

  // 账户管理
  homeInfoCreate: ['/v3/users/homepage/create', 'POST'], // 个人主页创建接口 Jia.li √字段未同步
  homeInfoGet: ['/v3/users/homepage/get-info', 'POST'], // 个人主页查询接口 Jia.li √
  userLogoGet: ['/v3/users/user-extends/get-logo-info', 'POST'], // 获取控制台标志信息 Jia.li √
  homeInfoEdit: ['/v3/users/homepage/edit', 'POST'], // 个人主页更新接口 Jia.li √字段未同步
  checkAccount: ['/v3/users/user/check-account', 'POST'], // 账号检测接口 Jia.li
  resetPassword: ['/v3/users/user/reset-password', 'POST'], // 修改密码/密码找回/设置密码接口 Jia.li
  codeCheck: ['/v3/users/code/check', 'POST'], // check Jia.li
  bindInfo: ['/v3/users/user/bind-info', 'POST'], // 绑定邮箱、手机号接口 Jia.li
  unBindInfo: ['/v3/users/oauth/unbind', 'POST'],// 解除绑定
  userMigrate: ['/v3/users/user-migrate/get-info', 'POST'],// 迁移用户-详情接口

  // 下载中心
  downloadedEdit: ['/v3/commons/downcenter/downloaded', 'POST'], // 下载中心-删除修改为已下载 √
  downloadedDel: ['/v3/commons/downcenter/delete', 'POST'], // 下载中心-删除 √
  downloadedList: ['/v3/commons/downcenter/list', 'POST'], // 下载中心-列表 √
  downloadedReload: ['/v3/commons/downcenter/regenerate', 'POST'], // 下载中心-重新生成 Jia.li •••需真实流程才可测试
  downloadNotNum: ['/v3/commons/downcenter/not-dow-num', 'POST'], // 查询未下载数量 √

  // 报名表单
  getFormEnableStatus: ['/v3/webinars/registration-form/get-form-enable-status', 'POST', 'mock'], // 获取活动报名表单开启状态

  // 活动基础信息
  getWebinarSwitchList: ['/v3/webinars/webinar/get-webinar-switch-list', 'POST'], // 数据统计直播详情包含场次列表
  getUserAllWebinar: ['/v3/webinars/webinar/get-user-all-webinar', 'POST', 'mock'], // 大数据依赖通过用户id获取账户下活动总数 •••
  batchGetWebinarInfo: ['/v3/webinars/webinar/batch-get-webinar-info', 'POST'], // 批量查询活动基础信息接口 •••
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
  getInitiatorReportInfo: ['/v3/webinars/live/get-report-info', 'GET'], // 获取上报信息 jian.chang √ 废弃了
  liveHeartBeat: ['/v3/webinars/live/heartbeat', 'GET'], // 心跳检测 √
  getToolStatus: ['/v3/interacts/room/get-inav-tool-status', 'POST'], // 获取房间内各工具的状态 √
  record: ['/v3/webinars/record/ticker', 'POST'], // 发起端-打点录制

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
  createRecord: ['/v3/webinars/record/live-create-record', 'POST'], // 直播结束生成回放
  // 媒体设置
  saveMediaSettings: ['/v3/interacts/room/set-stream', 'POST'], // 保存媒体设置属性


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
  getInterWebinarSkin: ['/v3/interacts/skin/get-webinar-skin', 'GET'], // 获取活动启用直播间设置的信息详情
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
  getMenuDetailById: ['/v3/interacts/menu/menu-get-info', 'POST'], // 观看端自定义菜单详情
  attention: ['/v3/users/attentions/create', 'POST'], // 关注
  notAttention: ['/v3/users/attentions/delete', 'POST'], // 取消关注
  newWebinarMenus: ['/v3/interacts/menu/menu-list', 'POST'], // 观看页菜单列表 jian.chang
  goodsList: ['/v3/interacts/goods/get-on-sale-goods-list', 'GET'], // 商品推荐 xiaodong.ding
  keywordsList: ['/domian/api/webinar/v1/webinar/keywords-list', 'POST'], // 聊天严禁词过滤 jian.chang
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
  getLanguageList: ['/v3/webinars/webinar-language/get-list', 'POST'], // 获取语言列表接口

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
  allowMsg: ['//api.vhallyun.com/sdk/v2/message/lists', 'GET',false, 'paas'], // 获取消息通过列表
  setChannelSwitch: ['//api.vhallyun.com/sdk/v2/message/set-channel-switch','GET', false, 'paas'], // 设置审核开关接口
  getChannelSwitch: ['//api.vhallyun.com/sdk/v2/message/get-channel-switch','GET', false, 'paas'], // 更新总开的状态
  setAutoSend: ['//api.vhallyun.com/sdk/v2/message/set-channel-switch-options','GET', false, 'paas'], // 设置是否自动处理聊天数据接口
  getChatAuditLists: ['//api.vhallyun.com/sdk/v2/message/get-chat-audit-lists','GET', false,'paas'], // 获取待审核消息列表
  applyMessageSend: ['//api.vhallyun.com/sdk/v2/message/apply-message-send','POST', false,'paas'], // 审核消息操作
  // 礼物
  sendGift: ['/v3/interacts/gift/send-gift', 'POST'], // 直播间发送礼物
  giftList: ['/v3/interacts/gift/get-webinar-using-gift-list', 'GET'], // 礼物列表
  setRelevance: ['/v3/interacts/gift/set-webinar-map-gifts', 'POST'], // 设置活动关联礼物
  createWebinarGift: ['/v3/interacts/gift/create-webinar-gift', 'POST'], // 设置活动关联礼物
  // 红包
  getLastRedInfo: ['/v3/interacts/redpacket/get-latest-redpacket-usage', 'GET'], // 发起端_获取当前活动最新创建红包的消费情况.
  createRed: ['/v3/interacts/redpacket/create', 'POST'], // 创建红包
  v3CreateRed: ['/v3/interacts/redpacket/create', 'POST'], // 创建红包
  getpacketCreate: ['/v3/interacts/redpacket/open-redpacket', 'GET'], // 抢红包
  // 点赞
  like: ['/v3/interacts/like/create-user-like', 'POST'], // 点赞
  // 打赏
  seadAwardMsg: ['/v3/interacts/reward/create-user-reward', 'POST'], // 打赏
  getQeustionList: ['/v3/vss/survey/list-webinar-survey', 'POST'], // 获取问卷列表

  // 抽奖
  saveLotteryInfo: ['/v3/vss/lottery/award', 'POST'], // 保存中奖人信息,
  v3CreateLottery: ['/v3/vss/lottery/add', 'POST'], // 创建抽奖
  v3SearchUser: ['/v3/vss/lottery/search', 'GET'], // 符合抽奖条件的用户
  v3CheckLottery: ['/v3/vss/lottery/check', 'GET'], // 检测抽奖
  v3EndLottery: ['/v3/vss/lottery/end', 'POST'], // 结束抽奖
  v3PartLottery: ['/v3/vss/lottery/participation', 'POST'], // 参数抽奖
  v3GetStep: ['/v3/vss/lottery/watch/get-draw-prize-info', 'GET'], // 获取中奖页信息
  v3GetWineList: ['/v3/vss/lottery/users-get', 'GET'], // 查看中奖列表
  v3ClearUserList: ['/v3/vss/lottery/update-user-status', 'GET'], // 只给服务端配合使用
  v3GetPrizeList: ['/v3/vss/lottery/post/get-prize-list', 'POST'], //获取奖品列表
  // 问卷
  submitQuestion: ['/v3/interacts/survey/submit-survey-answer', 'POST'], // 提交问卷
  sendQuestion: ['/v3/vss/survey/publish-survey', 'POST'], // 直播发布问卷
  liveEditQuestion: ['/v3/vss/survey/update-webinar-survey', 'POST'], // 直播编辑问卷
  checkSurvey: ['/v3/vss/survey/check-can-answer', 'GET'], // 是否提交问卷

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
  v3ReplayUserQu: ['/v3/interacts/qa/reply-user-question', 'POST'], // 获取当前场次收集到的历史问答 主持人
  getAutherQa: ['/v3/interacts/qa/get-question-by-status', 'POST'], // 提问列表
  sendPrivateMsg: ['/v3/interacts/chat-private/send-message', 'POST'], // 发送私聊信息
  v3GetTextReply: ['/v3/interacts/qa/get-answer-list', 'POST'], // 文字回复---私密
  v3Revoke: ['/v3/interacts/qa/revoke-reply', 'POST'], // 主持人撤销回复
  v3GetPrivateList: ['/v3/interacts/chat-private/get-rank-list', 'POST'], // 获取私聊列表
  v3GetPrivCon: ['/v3/interacts/chat-private/get-list', 'POST'], // 获取私聊内容
  v3SetUser: ['/v3/interacts/chat-private/set-rank-list', 'POST'], // 设置联系人列表

  // 发起端所有新增
  v3SendNotice: ['/v3/interacts/chat/send-notice-message', 'POST'], // 发送公告  √
  // 邀请卡
  shwoInvite: ['/v3/interacts/invite-card/watch-get-info', 'POST'], // 邀请卡信息
  // 关注
  attentionStatus: ['/v3/users/attentions/info', 'POST'], // 关注状态
  getAttentionNum: ['/v3/users/attentions/count', 'POST'], // 获取关注数量

  // 分组
  getGroupStatics: ['/v3/interacts/group/group-statis', 'POST'], //分组统计
  exportGroupList: ['/v3/interacts/group/export-group-list', 'POST'], // 分组统计导出
  exportChatSwitch: ['/v3/interacts/chat/export-switch', 'POST'], // 导出当前分组场次聊天列表
  // 签到
  v3CreateSifn: ['/v3/interacts/sign/create-and-push', 'POST'], // 创建签到  √
  v3StopSign: ['/v3/interacts/sign/set-end-sign', 'POST'], // 结束签到  √
  v3GetCurrentSign:['/v3/interacts/sign/get-doing-sign', 'POST'], // 获取当前活动正在的签到  √
  v3GetSignList:['/v3/interacts/sign/get-user-sign-list', 'POST'], // 获取当前活动的签到记录  √
  v3GetSignTotal: ['/v3/interacts/sign/get-sign-total', 'POST'], // 获取当前活动的签到总数  √
  watchInterGetFirstPost: ['/v3/interacts/adv/watch-get-screen-poster', 'GET'], // 获取开屏海报
  tipOff: ['/v3/interacts/report/user-create-report', 'POST'], // 观众举报
  videoTipOff: ['/v3/interacts/feedback/user-create-feedback', 'POST'], // 观众反馈播放器
  pay: ['/v3/fin/webinar-pay', 'GET'], //支付二维码
  userSendQuestion: ['/v3/vss/survey/submit-answer', 'POST'], // 观众提交问卷
  checkWithdrawalToB: ['/v3/users/oauth/check-withdrawal-to-b', 'POST'], // B端微信检测接口
  // C端 - 登录/注册
  loginInfoC: ['/v3/users/user-consumer/login', 'POST'],
  registerC: ['/v3/users/user-consumer/register', 'POST'],
  getInfoC: ['/v3/users/user-consumer/get-info', 'POST'],
  codeCheckC: ['/v3/users/code-consumer/check', 'POST'],
  sendCodeC: ['/v3/users/code-consumer/send', 'POST'],
  loginCheckC: ['/v3/users/user/login-check', 'POST'],  //登录账号锁定检测接口
  // 专题专用 - 灰度接口
  initSubjectGrayBefore: ['/v3/webinars/subject/init-before', 'POST'],
  initGrayBefore: ['/v3/webinars/webinar/init-before', 'POST'], // 通过活动id获取活动拥有者用户id - 用于灰度存储
  // 多语言
  languageCreate: ['/v3/webinars/webinar-language/create', 'POST'], // 多语种 - 创建
  languageEdit: ['/v3/webinars/webinar-language/edit', 'POST'], // 多语种 - 编辑
  languageDel: ['/v3/webinars/webinar-language/delete', 'POST'], // 多语种 - 删除
  languageList: ['/v3/webinars/webinar-language/get-list', 'POST'], // 多语种 - 集合

  lowerGrade: ['/fault/test/ops_fault_code_publish.json', 'GET'], // 系统降级处理配置文件 线上及测试环境统一使用该域名
  getCustomRoleName: ['/v3/webinars/privilege/get-role-name', 'POST'], // 获取自定义角色名称

  saveAgreement: ['/v3/interacts/agreement/save-agreement-info', 'POST'],
  getAgreement: ['/v3/interacts/agreement/get-agreement-info', 'POST'],

  // 设置中心-标签设置
  labelCreate: ['/v3/webinars/label/create', 'POST'],
  labelList: ['/v3/webinars/label/get-list', 'POST'],
  labelGetInfo: ['/v3/webinars/label/get-info', 'POST'],
  labelDelete: ['/v3/webinars/label/delete', 'POST'],
  labelEdit: ['/v3/webinars/label/edit', 'POST'],
  labelResetOrder: ['/v3/webinars/label/reset-order', 'POST'],
  labelTop: ['/v3/webinars/label/top', 'POST'],
  // 首页-广告
  getBannerSetInfo: ['/v3/interacts/banner/get-banner', 'GET'],
  // 报名用户
  userRegistrationList: ['/v3/webinars/registration-form/get-list', 'POST'], // 用户报名-列表
  userRegistrationAdd: ['/v3/webinars/registration-form/import-one', 'POST'], // 用户报名-快速报名
  userRegistrationCheckImport: ['/v3/webinars/registration-form/check-import', 'POST'], // 用户报名-检测导入数据
  userRegistrationImport: ['/v3/webinars/registration-form/import', 'POST'], // 用户报名-导入数据
  userRegistrationImportProgress: ['/v3/webinars/registration-form/import-progress', 'POST'], // 用户报名-导入数据结果（轮询）
  userRegistrationExportFail: ['/v3/webinars/registration-form/export-fail', 'POST'], // 用户报名-导出失效数据
  getSubjectByWebinarId: ['/v3/webinars/subject/get-list-by-webinar-id', 'POST'], // 活动下-报名表单，依据活动ID获取专题内容信息
  // 开播提醒
  getNoticePageList: ['/v3/interacts/notice/notice-list', 'GET'], // 获取- 开播提醒-界面设置信息
  noticeConfigEdit: ['/v3/interacts/notice/notice-config-edit', 'POST'], // 保存-开播提醒-[签名/是否开启短信验证]
  saveSendSet: ['/v3/interacts/notice/notice-template-edit', 'POST'], // 保存-开播提醒-[发送设置/卡片开关]
  getNoticeDetail: ['/v3/interacts/notice/notice-detail', 'POST'], // 获取-开播提醒-卡片信息
  getNoticeRecordList: ['/v3/interacts/notice/notice-record', 'GET'], // 获取-发送记录
  exportNoticeRecord: ['/v3/interacts/notice/notice-export-record', 'GET'], // 导出-发送记录
  importNoticeExcel: ['/v3/interacts/notice/notice-import-user','POST'], // 导入发送用户
  noticeTestSend: ['/v3/interacts/notice/notice-test-send', 'POST'], // 发送测试
  noticeCheckImport: ['/v3/interacts/notice/notice-check-import', 'POST'], // 导入进度检测
  downloadNoticeFailFile: ['/v3/interacts/notice/notice-download-fail-file', 'POST'], // 下载无效数据
  // 财务总览 - 消费明细 - 短信消耗（日期筛选）
  getUserSmsPay: ['/v3/data-center/business-total/user-sms-pay', 'GET'], // 财务总览-消费明细-短信消耗总条数
  getUserSmsPayByPage: ['/v3/data-center/business-total/user-sms-pay-detail', 'GET'], // 财务总览-消费明细-短信消耗-列表
  exportUserSmsPayDetail: ['/v3/data-center/business-total/export-user-sms-pay-detail', 'GET'], // 财务总览-消费明细-导出
  // 子账号管理 - 短信数据趋势图
  getUserSmsTrend: ['/v3/data-center/business-total/user-sms-trend', 'GET'], // 子账号管理 - 短信数据趋势图
  exportUserSmsTrend: ['/v3/data-center/business-total/export-user-sms-trend', 'GET'], // 子账号管理 - 直播统计 - 短信数据导出
  // 获取短信余额
  getSmsBalance: ['/v3/fin/user-vip/get-sms-balance', 'GET'], // 根据token查询短信余额

  // 快问快答
  getExamList: ['/v1/fqas/paper-view/list', 'POST'], // 查询快问快答列表
  copyExamById: ['/v1/fqas/paper-view/copy', 'POST'], // 复制 —— 用户维度
  copyExamByIdIsWebinar: ['/v1/fqas/webinar-paper-view/copy', 'POST'], // 复制 —— 活动维度
  deleteExam: ['/v1/fqas/paper-view/delete', 'POST'], // 删除（单个 or 批量）—— 用户维度
  deleteExamIsWebinar: ['/v1/fqas/webinar-paper-view/delete', 'POST'], // 删除（单个 or 批量） —— 活动维度
  getExamSubmitNum: ['/v1/fqas/webinar-paper-view/get-all-submit-count', 'POST'], // 获取互动统计-统计活动下所有快问快答提交人数
  getExamUsageInfo: ['/v1/fqas/webinar-paper-view/get-pushed-list', 'POST'], // 获取活动下快问快答使用数据概览
  exportExam: ['/v3/interacts/exam/export-paper-static-list', 'POST'], //导出快问快答数据
  editExamStatus: ['/v1/fqa/webinar-paper-view/mark-status', 'GET'], // 还原/无效数据
  getExamSummaryData: ['/v1/fqa/webinar-paper-view/summary-data', 'POST'], // 查询快问快答 -明细概略数据
  getExamScoreList: ['/v1/fqa/webinar-paper-view/performance-list', 'POST'], // 查询快问快答 - 成绩列表
  getTranscriptInfo: ['/v1/fqa/webinar-paper-view/get-personal-report', 'GET'], // 查询快问快答 - 个人成绩单信息
  selectExamToWebinar: ['/v1/fqas/webinar-paper-view/create-by-data-bank', 'POST'], // 资料库下选择快问快答同步到活动
  exportTranscript: ['/v3/interacts/exam/export-person-score', 'POST'], // 导出单人成绩单
  exportExamRank: ['/v3/interacts/exam/export-paper-rank-list', 'POST'], // 导出成绩列表
};

const getApi = api => {
  return apis[api] && apis[api];
};
export default getApi;
