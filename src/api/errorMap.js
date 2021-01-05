const errorMap = {
    600: '参数错误',
    201: '参数错误',
    110014: '红包已经被抢光了',
    110015: '你已经抢过此红包了',
    110018: '不符合红包领取条件',
    110022: '红包已过期',
    110023: '红包还未开始不能抢',
    140504: '文件上传失败，请重试',
    140402: '当前上传类型不被允许',
    140401: '上传文件不存在或文件超过服务器限制，上传文件最大支持50M',
    10002: '结果数据错误',
    10003: '未定义返回字段类型',
    10004: '未定义返回字段是否必须',
    10005: '返回结果必须是对象',
    10006: '验证规则不可为空',
    10007: '没有权限',
    10008: '未登录',
    10009: '用户不存在',
    10010: '系统错误，请稍后重试',
    10011: '平台参数错误（platform）',
    10012: '非法访问',
    10013: '不能包含中文和特殊字符',
    12000: '删除失败,数据存在异常',
    12001: '删除失败',
    12002: '活动不存在或已删除',
    12003: '该活动不属于此用户',
    12004: '活动创建失败',
    12005: '活动扩展信息创建失败',
    12006: '活动修改失败',
    12007: '活动修改异常',
    12008: '暖场视频删除异常',
    12009: '暖场视频封面更换失败',
    12010: '暖场视频不存在',
    12011: '暖场视频添加失败',
    12012: '观众分组创建失败',
    12013: '观众分组修改失败',
    12014: '观众分组删除失败',
    12015: '分组不存在',
    12016: '三方验证设置失败',
    12017: '白名单观众不存在',
    12018: '白名单观众修改失败',
    12019: '白名单观众删除失败',
    12020: '白名单观众创建失败',
    12021: '邀请码创建数量超出限制',
    12022: '批量创建白名单观众超出限制',
    12023: '修改观看限制必要参数缺少',
    12024: '此白名单不属于该用户',
    12025: '观看限制保存失败',
    12026: '此活动类型不支持修改嘉宾',
    12027: '角色权限修改失败',
    12028: '创建专题失败',
    12029: '专题不存在',
    12030: '专题删除失败',
    12031: '专题修改失败',
    12032: '点播创建失败',
    12033: '回放不存在',
    12034: '点播不存在场次信息',
    12035: '点播不支持角色设置',
    12036: '此用户信息有部分已存在此分组中',
    12037: '白名单用户不存在',
    12038: '不能对其他账户下的白名单观众进行操作',
    12039: '用户组不存在',
    12040: '密码存在雷同，请修改后重试',
    12042: '专题不属于该用户',
    12043: '此音视频不属于该用户',
    12044: '音视频创建失败',
    12045: '音视频修改失败',
    12046: '音视频删除失败',
    12047: '活动扩展信息修改失败',
    12048: '回放不属于该用户',
    12049: '该分组已存在',
    12050: '用户并发量不足创建此活动',
    12051: '活动最高并发超出限制',
    12502: '不支持的活动类型(flash)',
    12052: '直播中，不可调整',
    12515: '未找到参会数据',
    12522: '主持人、嘉宾或助理不允许进入观看端',
    12529: '邀请码错误',
    12530: '邀请码已被使用',
    12531: '请输入邀请码',
    12561: '流信息不存在',
    12600: '开始或结束活动异常',
    12601: '开始或关闭转播流异常',
    12602: 'symbol参数格式错误',
    12603: '身份信息格式错误',
    12604: '不是活动的回放',
    12605: '白名单失效，请清空缓存后重新填写',
    12606: '报名表单失效，请清空缓存后重新填写',
    12607: '请先执行开始打点',
    12608: '请求流媒体接口失败',
    12609: '主持人参会记录已存在',
    12800: '报名表单不能与白名单同时开启',
    12801: '超过报名表单最大容纳题目数量限制',
    12802: '题目不存在',
    12803: '隐私协议不存在',
    12804: '超过单个题目容纳选项数量限制',
    12805: '没有操作权限',
    12806: '题目选项不存在',
    12807: '选项不能少于2个',
    12808: '当前角色禁止报名',
    12809: '短信验证码错误',
    12810: '报名数据缺失',
    12811: '题目选项必须为一个json串',
    12812: '题目禁止删除',
    12813: '已经添加过隐私协议',
    12814: '该手机已报名',
    12815: '用户已报名,无需重复报名',
    12816: '手机题目信息缺失',
    12817: '未报名',
    12818: '报名数据格式错误,答案录入失败.',
    12819: '预报名excel内容错误.',
    12900: '裁剪时间列表参数错误',
    12901: '转码中，请稍等',
    12902: '请重试',
    12903: '活动日志信息创建失败',
    12904: '活动日志信息修改失败',
    12905: '点播不能取消点默认',
    12906: '请先开始录制，再请求该接口',
    10000: '参数错误',
    10001: '未知错误',
    13040: '超出关键词数量限制',
    13041: '操作失败',
    13042: '关键词已被删除或不存在',
    13043: '关键词已存在',
    13044: '操作失败',
    13046: '跑马灯水印信息不存在',
    13047: '当前活动不属于当前用户',
    13048: '操作失败',
    13049: '开启水印时图片不能为空',
    13070: '创建失败',
    13071: '更新失败,推广信息不存在',
    13072: '删除失败,推广信息不存在',
    13073: '广告推荐个数已达到最大个数限制，请删除后再进行添加',
    13074: '广告推荐个数已达到最大个数限制，请删除后再进行添加',
    13075: '添加失败',
    13004: '用户加入房间失败',
    13001: '直播过程中禁止调用',
    13002: '直播未开始禁止调用',
    13003: '禁止操作',
    13000: '参会用户不存在',
    13020: '用户无权限',
    13008: '主持人信息缺失',
    13009: '房间不是直播活动',
    13010: '房间已存在',
    13011: '当前参会用户未加入直播间',
    13012: '只有主持人拥有此权限',
    13013: '只有创建者拥有此权限',
    13014: '只有嘉宾允许操作',
    13015: '普通观众无此权限',
    13016: '问答必须处于开启状态',
    13050: '菜单类型与状态不匹配',
    13051: '排行榜功能组件只能添加一次',
    13052: '一个菜单下最多添加10个图文组件',
    13053: '一个页面内最多添加50个直播',
    13054: '一个页面内最多添加50个专题',
    13055: '不合法的组件数据',
    13057: '自定义菜单数最多为6个',
    13021: '房间不存在',
    13022: '您参与的直播不是当前直播',
    13005: '删除失败',
    13006: '更新失败',
    13007: '房间不存在',
    13026: '当前用户未申请上麦',
    13027: '当前用户没有参会',
    13028: '当前用户已经被邀请',
    13029: '重复上麦',
    13033: '用户未上麦',
    13023: '暂未开放举手',
    13024: '角色不符',
    13030: '没有被邀请',
    13031: '主持人不需要上麦',
    13034: '当前用户无法上麦',
    13017: '音频活动不能使用互动连麦',
    13035: '只有主持人可以对自己下麦',
    13076: '上架失败',
    13077: '下架失败',
    13078: '复制失败',
    13079: '复制商品不存在',
    13281: '折扣价不能大于等于原价',
    13099: '红包金额必须大于零数字',
    13100: '活动不存在',
    13112: '当前用户无权限',
    13080: '商品最大上架数量为:100',
    13081: '添加失败',
    13082: '更新失败',
    13083: '图片保存失败',
    13084: '删除失败,下架后才能删除',
    13085: '删除失败,图片不存在',
    13086: '设置失败,图片不存在',
    13280: '未获取到商品详情',
    13282: '非法的图片ID',
    13283: '商品不存在或已下架',
    13284: '封面必须存在图片中',
    13285: '商品已上架，如需编辑请先做下架处理',
    13200: '发起签到失败！',
    13201: '签到时长不能为空！',
    13202: '是否自动签到不能为空！',
    13203: '签到时间间隔不能为空！',
    13204: '当前活动已签到中！',
    13205: '签到已结束',
    13087: '创建失败',
    13088: '更新失败',
    13089: '更新状态失败',
    13090: '创建失败',
    13091: '更新失败',
    13092: '操作失败',
    13093: '保存失败',
    13094: '未开启',
    13095: '创建邀请失败',
    13096: '创建邀请失败，活动ID不匹配',
    13097: '文件地址错误',
    13098: '导出失败',
    13101: '资料库中已存在该文档',
    13102: '当前活动中已存在该文档',
    13103: '同步到资料库失败',
    13104: '同步到活动失败',
    13105: '当前要同步文档不存在',
    13106: '文档删除异常',
    13107: '当前活动中文档不存在',
    13108: 'document参数不正确',
    13109: '文档已经删除或者不存在',
    13110: '当前文档归属不正确',
    13111: '请求文档不存在',
    13220: '点赞数据更新失败',
    13121: '问题不存在',
    13122: '请勿重复处理',
    13123: '答案不存在',
    13124: '房间开始时间缺失',
    13125: '问题不属于该房间.',
    13126: '提问速度过快,提问接口限制提问速度',
    13230: '分享类型错误',
    13231: '分享失败',
    13232: '分享失败',
    13241: '当前用户无权限操作此房间',
    13240: '超过自定义礼物个数限制',
    13242: '礼物信息不存在或者已删除！',
    13243: '系统礼物不能删除',
    13244: '只能删除自己创建的礼物',
    13245: '创建失败',
    13246: '编辑失败',
    13247: '礼物信息不存在',
    13248: '系统礼物不能编辑',
    13249: '你无权编辑此礼物信息',
    13250: '超过活动使用礼物数量限制',
    13251: 'gift_ids格式错误',
    13532: '不能使用互动连麦相关功能',
    13533: '无效的参会token',
    13534: '活动类型不匹配,禁止操作',
    13535: '未获取到主持人信息',
    13536: '活动不匹配',
    13537: '当前用户无权限',
    13538: '未获取参会用户信息',
    13540: '没有数据可以导出',
    13539: '导入文件时上传失败',
    13544: '请上传素材',
    13541: '文件导出错误',
    13542: '参会角色权限等级低',
    13543: '请联系管理员开通权限',
    13546: '获取key不能为空',
    13547: 'open_id获取失败',
    14000: '邮箱一次最多1000',
    14001: '邮件地址无效',
    14002: '缺少查询ID',
    14003: '缺少下载地址',
    14004: '当前上传类型，含有不被允许类型',
    14005: '当前上传类型不被允许',
    14006: '上传路径中含有特殊字符',
    14007: '上传文件不存在',
    14008: '上传文件不能超过2M',
    14009: '结束时间不能小于开始时间',
    14010: '时间格式不正确',
    14011: '邮箱发送失败',
    14012: '下载中心生成缺少必要参数',
    14013: '重新生成URL请带上https!',
    14021: '创建失败',
    14022: '修改失败',
    14061: '没有正在使用的版本',
    14062: 'system_type系统类型不能为空',
    11001: '图片验证码错误',
    11002: '动态密码错误',
    11003: '账号密码错误',
    11004: '您的账号由于不合规操作，已被封停！',
    11005: '用户Token缺失',
    11006: '用户Token认证失败',
    11007: '用户Token已过期',
    11008: '数据不存在',
    11009: '验证码错误',
    11010: '用户注册中心注册失败',
    11011: '用户已存在',
    11012: '上一步操作结果，验证失败',
    11013: '旧密码不能为空',
    11014: '旧密码错误',
    11015: '密码输入不一致',
    11016: '验证码错误',
    11017: '手机号格式错误',
    11018: '邮箱格式错误',
    11019: '发送验证码失败',
    11020: '子账号没有权限操作',
    11021: '不是子账号',
    11022: '该手机号已存在',
    11023: '该邮箱已存在',
    11024: '请勿短时间内重复请求',
    11025: '上传头像异常',
    11026: '当前第三方用户已创建,密码数据不一致,请使用',
    11027: '当前用户已在SAAS平台上删除, 请先恢复',
    11028: '第三方用户对象不存在',
    11029: '超过子账号个数限制',
    11030: '角色id不正确，非主账号创建的',
    11031: '子账号没有权限创建账号',
    11032: '密码已存在，不允许直接设置',
    11033: '没有权限访问',
    11034: '无效的平台',
    11035: '只能修改自己账号下的数据',
    11036: '批量创建子账号,数量不能为空',
    11037: '用户存在',
    11038: '上传图片过大',
    11039: '上传文件类型不支持',
    11041: '当前账号已绑定，请先解绑',
    11040: '当前账号未绑定，无须解绑',
    11042: '已被其他账号绑定',
    11043: '第三方账号信息缺失，请重新扫描',
    11044: '接口访问次数达到最大值限制',
    11045: '数据签名错误',
    11046: '数据异常，当前登录用户不存在',
    11047: '签名参数缺失',
    11048: '权限key不存在',
    11049: '子账号关系错误',
    11050: '修改菜单排序失败',
    11051: '邮箱不符合要求，必须是公司邮箱！',
    11052: '封号原因不能为空',
    11053: '当前用户没有该增值API，请联系客服',
    11054: '账号所属关系错误',
    11055: '手机号未注册',
    11056: '你不是员工',
    11057: '验证码已过期',
    11058: '无效的Token，平台参数错误',
    11059: '不允许对非会员或者已过期会员添加该配置项',
    11060: '无效的回调事件',
    11061: '子账号数量为1~200个！',
    11062: '该账号为子账号，不能开通子账号权限！',
    11063: '子账号直播中，不允许删除',
    11064: '子账号有收益，不允许删除',
    11065: '图形验证码错误',
    11501: '数据不存在',
    11502: '数据已存在',
    11503: '数据库错误',
    11505: '账号被禁言',
    11506: 'SSO注册失败',
    11507: '注册失败',
    11504: '权限分类id不能为空',
    11508: '权限使用中，不允许删除子账号权限',
    11521: '当前api_url不正确',
    11522: '当前用户没有该增值API，请联系客服',
    11523: '请确保当前API对应地址唯一性',
    11524: 'ID不存在',
    11509: '超过app最大数量限制',
    11510: '非api用户不允许创建应用',
    11525: '用户API权限没有开通',
    11900: '修改菜单排序失败',
    11511: '权限ID异常',
    11512: '用户不存在',
    11513: '与已有员工邮箱重复，请重新输入！',
    11514: '与已有员工姓名重复，请重新输入！',
    11515: '有关联用户，不能删除',
    11528: '该用户已配置该接口！',
    11516: '只能修改自己数据',
    516000: '未知错误',
    516001: '非法访问',
    516002: '用户不存在',
    516003: '权限验证失败',
    516004: '系统忙，请稍后再试',
    516005: '签名校验失败',
    516006: '活动不存在',
    516007: '当前接口30秒内只能访问一次！',
    516101: '当前套餐剩余有效时间不满一个月，不支持升级',
    516103: '删除订单失败!',
    516104: '无限包无法购买其他套餐',
    516105: '用户类型错误',
    516106: '升级并发必须大于当前并发',
    516107: '存在未生效并发包',
    516108: '您有待处理订单，暂不能新增',
    516109: '当前无可升级套餐，请联系客户经理购买',
    516110: '购买流量数量错误，请重新输入',
    516111: '套餐类型错误',
    516112: '您没有欠费',
    516113: '扩展包人数输入有误',
    516114: '欠费类型错误',
    516115: '订单不存在',
    516117: '处理支付回调失败，签名错误',
    516118: '订单状态异常',
    516119: '子账号不能操作',
    516120: '该账号为子账号，不能新增套餐/资源',
    516121: '请先清零欠费',
    516123: '请先清零回放流量欠费',
    516126: '此账号为父账号，无法新增无极包！',
    516127: '分配量不能超过可用量！',
    516145: '并发人数范围为1至99999人',
    516149: '操作人ID不存在',
    516150: '新增付费用户失败',
    516151: '订单类型错误',
    516200: '活动不存在或不是h5活动',
    516300: '请先绑定手机号',
    516301: '验证码校验失败，请重试',
    516302: '并发预充值套餐无法购买扩展包',
    516303: '含有子账号的账号无法购买扩展包',
    516304: '订单已过期',
    516305: '短信验证码校验失败',
    516306: '请先绑定微信',
    516307: '提现金额不能小于1元',
    516308: '提现金额不能大于余额',
    516309: '流量用户欠费超过100G，暂不能进入',
    516310: '并发到期，暂不能进入',
    516311: '并发用户超过并发限制，暂不能进入',
    516312: '您有进行中的提现，无法再次提现',
    516313: '超过线上单笔最大提现额度，请走线下提现流程',
    516314: '请求下载中心失败',
    516315: 'OSS上传失败',
    516316: '导出文件生成失败',
    516317: '批量初始化子账号付费会员异常',
    516318: '超出可分配资源',
    516319: '子账号分配资源操作异常',
    516320: '存在不属于父账号的子账号',
    516321: '尊敬的会员，您的流量有欠费，请充值',
    516322: '尊敬的会员，您的流量已用尽，请充值',
    516323: '尊敬的会员，您有扩展包欠费，请充值',
    516324: '尊敬的会员，您的并发套餐已到期',
    516325: '订单生成失败',
    516326: '导出文件生成中',
    516327: '必填字段不能为空',
    516500: '初始化套餐资源包只支持[流量包并发包并发预充值包]',
    516501: '资源包类型异常',
    516502: '当前用户为非付费用户，请先新增付费用户',
    516503: '用户套餐不存在或已失效',
    516504: '暂无有效的套餐，请先添加套餐',
    516505: '无极版只能添加回放流量包',
    516506: '资源包不合法',
    516507: '已存在冲突资源包',
    516508: '保存资源包异常',
    516509: '父账号不支持此资源包',
    516510: '添加套餐资源绑定关系异常',
    516511: '资源包有效时间不能超出套餐有效时间',
    516512: '套餐时间内已有冲突套餐',
    516513: '资源包与计费类型冲突',
    516514: '请选择正确的并发预充值包计算峰值',
    516515: '资源以及金额不能为负',
    516516: '登录状态失效',
    516517: '功能版本不存在',
    516524: '来源不存在',
    516518: '资源包不存在',
    516519: '只有无极版用户能添加',
    516520: '付费用户已存在',
    516521: '注册用户初始化试用套餐失败',
    516522: '付费会员不存在',
    516523: '该用户不是子账号',
    516604: '奖品创建/保存失败',
    516605: '当source为0时房间号/活动号必填',
    516606: '活动不存在或已删除',
    516607: '调用外部接口错误',
    516701: '上传的文件不存在或者错误',
    516702: '抽奖页还没有设置',
    516703: '抽奖已结束',
    516708: '您已参与过了',
    516709: '抽奖类型错误',
    516710: '抽奖进行中,无法再次发起抽奖',
    516711: '口令抽奖时口令不能为空',
    516712: '预设中奖用户校验未通过',
    516713: '您的角色不能发起抽奖',
    516714: '你的角色操作非法',
    516715: '设置的中奖人数不能大于可中奖人数',
    516716: '参数验证失败请检查',
    516719: '获取用户微信openid失败',
    516726: '奖品数量不能大于20',
    516720: '此活动无需付费',
    516721: '您无此权限',
    516722: '抽奖不存在',
    516723: '未查询到中奖信息',
    516801: '获取PAAS票据失败',
    516802: '房间不匹配',
    516803: '无效的问卷',
    516804: '无此操作权限',
    516805: '已参与过，提交失败',
    516806: '表单拷贝失败',
    516807: '房间下问卷个数太多',
    516808: '用户未参会',
    516809: '用户已答问卷',
    516810: '回答参数异常',
    516811: '该用户不存在',
    516812: '房间id参数错误',
    516813: '鉴权异常',
    516814: '子账号信息不存在',
    516815: '该活动不是父账号下子账号的活动',
    516816: '未找到此问卷，请稍后重试',
    516817: '未找到此问卷对应的题目，请稍后重试',
    516820: '提现金额不能小于2元',
    516821: '请上传申请单照片',
    516822: '上传的申请单照片格式错误',
    516823: '该用户正有一笔线下提现正在添加中'

}

export default errorMap
