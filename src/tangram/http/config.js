const Apis = {
  startLive: ['/cmpt/room/start-live', 'POST'], // 开始直播
  stopLive: ['/cmpt/room/end-live', 'POST'], // 结束直播
  getInavInfo: ['/cmpt/room/get', 'POST'], // 获取房间信息

  getDocList: ['/cmpt/document/lists', 'POST'], // 获取文档列表
  switchDoc: ['/cmpt/room/switch-doc', 'POST'], // 开启关闭文档
  deleteDoc: ['/cmpt/document/delete', 'POST'], // 删除文档
  uploadDoc: ['/cmpt/document/upload', 'POST'], // 上传文档
  allowApply: ['/cmpt/inav/set-handsup', 'POST'], // 允许-上麦操作
  noSpeak: ['/cmpt/inav/nospeak', 'POST'], // 下麦
  apply: ['/cmpt/inav/apply', 'POST'], // 申请上麦
  getUserStatus: ['/cmpt/inav/get-user-status', 'POST'], // 获取用户状态
  speakOn: ['/cmpt/inav/speak', 'POST'], // 用户上麦
  speakOff: ['/cmpt/inav/nospeak', 'POST'], // 用户下麦
  consentApplay: ['/cmpt/inav/agree-apply', 'POST'], // 同意上麦申请
  rejectApplay: ['/cmpt/inav/reject-apply', 'POST'], // 拒绝上麦申请
  agreeInvite: ['/cmpt/inav/agree-invite', 'POST'], // 同意上麦邀请
  cancleApply: ['/cmpt/inav/cancel-apply', 'POST'], // 同意上麦邀请

  getKickedUsers: ['/cmpt/inav/get-kicked-list', 'POST'], // 获取踢出列表
  questionList: ['/cmpt/question/list', 'POST'],
  publicQuestion: ['/cmpt/question/publish', 'POST'], // 发布问卷
  cancelPublishQuestion: ['/cmpt/question/cancel-publish', 'POST'], // 取消发布
  submitQuestion: ['/cmpt/question/answer', 'POST'], // 提交问卷
  addSurvey: ['/api/webinar/v1/webinar/add-survey-answer', 'POST', 't.e'], // 直播中答题接口
  checkSurvey: ['/api/webinar/v1/webinar/check-survey', 'GET', 't.e'], // 直播中校验答题接口
  createQuestion: ['/cmpt/question/create', 'POST'], // 创建问卷
  updateQuestion: ['/cmpt/question/update', 'POST'], // 修改问卷
  getSpecialUsers: ['/cmpt/inav/get-special-list', 'POST'], // 获取踢出列表
  getRoomStatus: ['/cmpt/room/get-attributes', 'POST'], // 获取房间属性：是否开关文档/白板/举手 ×
  like: ['/cmpt/room/like', 'POST'], // 点赞
  signin: ['/cmpt/sign/add', 'POST'], // 发起签到
  getUserList: ['/cmpt/sign/records-get', 'POST'], // 获取签到用户列表
  clientSignin: ['/cmpt/sign/in', 'POST'], // 用户签到
  getRebroadcastList: ['/cmpt/rebroadcast/lists', 'POST'], // 获取转播列表 ×
  getRebroadcastPreviewInfo: ['/cmpt/rebroadcast/preview', 'POST'], // 获取转播预览信息 ×
  rebroadcast: ['/cmpt/rebroadcast/start', 'POST'], // 转播
  stopRebroadcast: ['/cmpt/rebroadcast/stop', 'POST'], // 转播
  reward: ['/cmpt/reward/give', 'POST'], // 打赏
  send: ['/cmpt/gift/send', 'POST'], // 送礼物
  list: ['/cmpt/gift/list', 'POST'], // 获取礼物列表
  add: ['/cmpt/lottery/add', 'POST'], // 发起抽奖
  search: ['/cmpt/lottery/search', 'POST'], // 搜索符合范围条件的抽奖用户名单
  lotteryEnd: ['/cmpt/lottery/end', 'POST'], // 结束抽奖
  lotteryAward: ['/cmpt/lottery/award', 'POST'], // 领奖人信息
  lotteryUsersGet: ['/cmpt/lottery/users-get', 'POST'], // 获取抽奖中奖人名单
  lotteryCount: ['/cmpt/lottery/count', 'POST'], // 有多少人可参与抽奖
  playbill: ['/api/webinar/v1/webinar/adv-info', 'POST'], // 开屏海报
  enableQA: ['/api/webinar/v1/webinar/openquestion', 'POST', 't.e'], // 启用禁用问答
  getQACount: ['/api/webinar/v1/webinar/questionnum', 'POST', 't.e'], // 获取问答功能问题数量
  createRecord: ['/api/webinar/v1/webinar/createrecord', 'POST', 't.e'], // 生成回放
  sendQuestion: ['/api/webinar/v1/webinar/addquestion', 'POST', 't.e'], // 问答模块发送问题
  getQAHistroy: ['/api/webinar/v1/webinar/qahistory', 'POST', 't.e'], // 获取问答聊天记录
  redpacketCreate: ['/cmpt/redpacket/create', 'POST'], // 发红包
  getpacketCreate: ['/cmpt/redpacket/get', 'POST'], // 抢红包
  getRecordsPacket: ['/cmpt/redpacket/records-get', 'POST'], // 获取红包领取记录
  getPacketLastInfo: ['/cmpt/redpacket/get-last-info', 'POST'], // 获取房间内最新的一个红包信息
  myPacketLastInfo: ['/cmpt/redpacket/get-my-info', 'POST'], // 获取房间内最新的红包我抢到红包信息
  inviteMic: ['/cmpt/inav/invite', 'POST'], // 主持人邀请上麦
  rejectInvite: ['/cmpt/inav/reject-invite', 'POST'], // 拒绝上麦邀请
  setBanned: ['/cmpt/inav/set-banned', 'POST'], // 禁言/取消禁言某个用户
  setAllBanned: ['/cmpt/inav/set-all-banned', 'POST'], // 禁言/取消禁言全体
  setKicked: ['/cmpt/inav/set-kicked', 'POST'], // 踢出/取消踢出某个用户
  getBannedList: ['/cmpt/inav/get-banned-list', 'POST'], // 禁言用户列表
  getkickedList: ['/cmpt/inav/get-kicked-list', 'POST'], // 踢出用户列表
  setSpeaker: ['/cmpt/inav/set-doc-permission', 'POST'], // 设置主讲人
  setMainScreen: ['/cmpt/inav/set-main-screen', 'POST'], // 设置主画面
  muteDevic: ['/cmpt/inav/set-device-status', 'POST'], // 禁用设备 - device 1, audio 2, vido
  roleQuit: ['/api/webinar/v1/interact/logout', 'POST', 't.e'], // 角色退出
  saveMediaSettings: ['/cmpt/inav/set-stream', 'POST'], // 保存媒体设置属性
  getHistoryMsg: ['/cmpt/chat/lists', 'POST'], // 获取历史消息
  getPushInfo: ['/cmpt/room/get-push-info', 'POST'], // 获取推流信息
  defaultRecord: ['/api/webinar/v1/webinar/defaultrecord', 'POST', 't.e'],
  setDevice: ['/cmpt/inav/set-device', 'POST'],
  startrecord: ['/api/webinar/v1/webinar/startrecord', 'POST', 't.e'], // 开始录制
  stoprecord: ['/api/webinar/v1/webinar/stoprecord', 'POST', 't.e'], // 结束录制
  createrecord: ['/api/webinar/v1/webinar/createrecord', 'POST', 't.e'], // 创建录制
  // heartbeat: ['/api/vss/initiator/heartbeat', 'POST', 't.e'], // 心跳检测
  updatesurvey: ['/api/webinar/v1/webinar/update-survey', 'POST', 't.e'], // 更新问卷
  setDesktop: ['/cmpt/inav/set-desktop', 'POST'], // 开启桌面共享自动最大化
  getHistoryMsgNew: ['/cmpt/chat/list', 'POST'], // 获取历史消息
  getBaseNum: ['/api/vss/initiator/get-base-num', 'POST', 't.e'], // 获取虚拟观众数据
  updateBaseNum: ['/api/vss/initiator/update-base-num', 'POST', 't.e'], // 更新虚拟观众
  startBaseNum: ['/api/vss/initiator/start-base-num', 'POST', 't.e'], // 开始虚拟观众脚本
  deleteMessage: ['/cmpt/chat/del-msg', 'POST'] // 删除消息
};

export default Apis;
