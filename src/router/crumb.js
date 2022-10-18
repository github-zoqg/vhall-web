export function CrumbLiveList(key) {
  return {
    liveList: [
     {
       title: '直播管理',
       path: '/live',
       isClick: false,
       redirect: 'noRedirect'
     },
     {
       title: '直播列表',
       path: '/live/list',
       isClick: true
     }
   ],
   specialList: [
      {
        title: '专题管理',
        path: '/special',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '专题列表',
        path: '/special/list',
        isClick: true
      }
   ],
   material: [
    {
      title: '资料管理',
      path: '/material',
      isClick: false,
      redirect: 'noRedirect'
    }
   ],
   data: [
    {
      title: '数据中心',
      path: '/data',
      isClick: false,
      redirect: 'noRedirect'
    }
   ],
   setting: [
    {
      title: '设置中心',
      path: '/setting',
      isClick: false,
      redirect: 'noRedirect'
    }
   ],
   finance: [
    {
      title: '财务中心',
      path: '/finance',
      isClick: false,
      redirect: 'noRedirect'
    }
   ],
   account: [
    {
      title: '账户管理',
      path: '/acc',
      isClick: false,
      redirect: 'noRedirect'
    }
   ]
  }[key]
}
export function CrumbSet(metaName, that) {
  console.log('当前路由：' + metaName);
  if (metaName === 'sysHome') {// 首页
    return [];
  }
  else if (metaName === 'liveList') {// 直播列表
    return CrumbLiveList('liveList');
  }
  else if (metaName === 'liveCreate') {// 创建直播
    return Number(that.$route.query.type) === 3 ? [
      {
        title: '直播管理',
        path: '/live',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '直播列表',
        path: '/live/list',
        isClick: true
      },
      {
        title: '复制直播',
        path: '/live/edit',
        query: that.$route.query,
        isClick: false,
        redirect: 'noRedirect'
      }
    ] : [
      {
        title: '直播管理',
        path: '/live',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '创建直播',
        path: '/live/edit',
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'vodCreate') {// 创建点播
    return [
      {
        title: '直播管理',
        path: '/live',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '创建点播',
        path: '/live/vodEdit',
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'liveTimeCreate') {// 创建定时直播
    return [
      {
        title: '直播管理',
        path: '/live',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '创建定时直播',
        path: '/live/timeEdit',
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'liveDetail') {// 直播详情
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'liveEdit') {// 编辑直播
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.id}`,
        isClick: true
      },{
        title: '编辑信息',
        path: `/live/edit/${that.$route.params.id}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'vodEdit') {// 编辑点播
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.id}`,
        query: that.$route.query,
        isClick: true
      },{
        title: '编辑信息',
        path: `/live/vodEdit/${that.$route.params.id}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'liveTimeEdit') {// 编辑定时直播
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.id}`,
        query: that.$route.query,
        isClick: true
      },{
        title: '编辑信息',
        path: `/live/timeEdit/${that.$route.params.id}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'chooseWay') {// 选择发起方式
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '选择发起方式',
        path: `/live/chooseWay/${that.$route.params.str}/1?type=ctrl`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'planFunction') {// 功能配置
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '功能配置',
        path: `/live/planFunction/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'viewerRules') {// 观看限制
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '观看限制',
        path: `/live/viewerRules/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'roleInvitation') {// 角色邀请
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '角色邀请',
        path: `/live/roleInvitation/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'warm') {// 暖场视频
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '暖场视频',
        path: `/live/warm/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'virtual') {// 虚拟人数
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '虚拟人数',
        path: `/live/virtual/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'signup') {// 报名表单
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '报名表单',
        path: `/live/signup/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'embedCard') {// 推广嵌入
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '推广嵌入',
        path: `/live/embedCard/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'langCard') {// 多语言链接
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '多语言链接',
        path: `/live/langCard/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'msgNotification') {// 开播提醒
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '开播提醒',
        path: `/live/msgNotification/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'livingSetting') {// 直播间设置
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '直播间设计器',
        path: `/live/livingSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'customTab') {// 自定义菜单
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '自定义菜单',
        path: `/live/customTab/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'customTab') {// 自定义菜单
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '自定义菜单',
        path: `/live/customTab/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'playerSet') {// 播放器设置
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '播放器设置',
        path: `/live/playerSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'safeScreenSet') {// 防录屏设置
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '活动详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '防录屏设置',
        path: `/live/safeScreenSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
   else if (metaName === 'invCard') {// 邀请卡
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '邀请卡',
        path: `/live/invCard/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'advertCard' && that.$route.params.str) {// 广告
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '广告',
        path: `/live/advertCard/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'officialCard') {// 公众号展示
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '公众号',
        path: `/live/officialCard/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
   else if (metaName === 'officeSet') {// 公众号展示
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '公众号',
        path: `/live/officeSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'posterSet') {// 开屏海报展示
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '开屏海报',
        path: `/live/posterCard/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'shareSet') {// 开屏海报展示
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '分享设置',
        path: `/live/shareSetting/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'word') {// 文档
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '文档',
        path: `/live/word/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'videoSet') {// 插播文件
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '插播文件',
        path: `/live/videoSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'prizeSet') {// 抽奖
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '抽奖',
        path: `/live/prizeSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'question') {// 问卷
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '问卷',
        path: `/live/question/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
   else if (metaName === 'addQuestion') {// 创建问卷
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.query.webinarId}`,
        isClick: true
      },
      {
        title: '问卷',
        path: `/live/question/${that.$route.query.webinarId}`,
        query: {
          roomId: that.$route.query.roomId
        },
        isClick: true
      },
      {
        title: '创建问卷',
        path: `/live/addQuestion`,
        query: that.$route.query,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'productSet') {// 商品
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '商品',
        path: `/live/productSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'addProduct') {// 创建商品
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '商品',
        path: `/live/productSet/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '创建商品',
        path: `/live/addProduct/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
   else if (metaName === 'editProduct') {// 编辑商品
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '编辑商品',
        path: `/live/editProduct/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'gift') {// 礼物
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '礼物',
        path: `/live/gift/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'playback') {// 回放管理
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '回放管理',
        path: `/live/playback/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if(metaName === 'playbackGroupList'){ // 回放管理- 小组视频
    return [
      ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '回放管理',
        path: `/live/playback/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '小组视频',
        path: `/live/playback/${that.$route.params.str}/group`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'chapter') {// 章节打点
    return [
     ...CrumbLiveList('liveList'),
     {
      title: '直播详情',
      path: `/live/detail/${that.$route.params.str}`,
      isClick: true
    },
    {
      title: '回放管理',
      path: `/live/playback/${that.$route.params.str}`,
      isClick: true,
    },
    {
      title: '章节打点',
      path: `/live/chapter/${that.$route.params.str}`,
      isClick: false,
      redirect: 'noRedirect'
    }
    ];
  }
  else if (metaName === 'vodreset') {// 回放重制
    return [
     ...CrumbLiveList('liveList'),
     {
      title: '直播详情',
      path: `/live/detail/${that.$route.params.str}`,
      isClick: true
    },
    {
      title: '回放管理',
      path: `/live/playback/${that.$route.params.str}`,
      isClick: true,
    },
    {
      title: '课件重制',
      path: `/live/vodreset/${that.$route.params.str}`,
      isClick: false,
      redirect: 'noRedirect'
    }
    ];
  }
  else if (metaName === 'recordplayback') {// 点播管理
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },{
        title: '点播管理',
        path: `/live/recordplayback/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'publishplayback') {// 定时直播管理
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },{
        title: '视频管理',
        path: `/live/publishplayback/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'recordchapter') {// 章节打点
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '点播管理',
        path: `/live/recordplayback/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '章节打点',
        path: `/live/recordchapter/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'reportsData') {// 数据报告
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '数据报告',
        path: `/live/reportsData/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'interactionData') {// 互动统计
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '互动统计',
        path: `/live/interactionData/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'userData') {// 用户统计
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '用户统计',
        path: `/live/userData/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  else if (metaName === 'interactionDetail') {// 邀请排名、聊天、问答、签到、问卷、抽奖、发群红包、
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.query.id}`,
        isClick: true
      },
      {
        title: '互动统计',
        path: `/live/interactionData/${that.$route.query.id}`,
        query: {
          roomId: that.$route.query.roomId
        },
        isClick: true
      },
      {
        title: `${that.$route.query.title}`,
        path: `/live/interactionDetail/${that.$route.query.id}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  } else if (metaName === 'lookSingleQuestion') {// 邀请排名、聊天、问答、签到、问卷、抽奖、发群红包、
    return [
     ...CrumbLiveList('liveList'),
      {
        title: '直播详情',
        path: `/live/detail/${that.$route.params.str}`,
        isClick: true
      },
      {
        title: '互动统计',
        path: `/live/interactionData/${that.$route.params.str}`,
        query: {
          roomId: that.$route.query.roomId
        },
        isClick: true
      },
      {
        title: `问卷`,
        path: `/live/interactionDetail`,
        query: {
          roomId: that.$route.query.roomId,
          id: that.$route.params.str,
          title: '问卷'
        },
        isClick: true
      },
      {
        title: `问卷详情`,
        path: `/live/lookSingleQuestion/${that.$route.params.str}`,
        query: that.$route.query,
        isClick: false,
        redirect: 'noRedirect'
      }
    ];
  }
  /** 专题 **/

  else if (metaName === 'specialList') {// 专题列表
    return CrumbLiveList('specialList');
  }
  else if (metaName === 'subjectEdit') {// 创建专题、编辑专题
    return that.$route.params.id ? [
      {
        title: '专题管理',
        path: '/special',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '专题列表',
        path: '/special/list',
        isClick: true
      },
      {
        title: '专题详情',
        path: `/special/details/${that.$route.params.id}`,
        isClick: true
      },
      {
        title: '编辑专题',
        path: `/special/edit/${that.$route.params.id}`,
        isClick: true
      }
    ] : [
      {
        title: '专题管理',
        path: '/special',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '创建专题',
        path: '/special/edit',
        isClick: true
      }
    ];
  } else if (metaName === 'subjectViewer') {
    return [
      {
        title: '专题管理',
        path: '/special',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '专题列表',
        path: '/special/list',
        isClick: true
      },
      {
        title: '专题详情',
        path: `/special/details/${that.$route.params.id}`,
        isClick: true
      },
      {
        title: '观看限制',
        path: '/special/viewer',
        isClick: true
      }
    ]
  } else if (metaName === 'subjectDetails') {
    return [
      {
        title: '专题管理',
        path: '/special',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '专题列表',
        path: '/special/list',
        isClick: true
      },
      {
        title: '专题详情',
        path: `/special/details/${that.$route.params.id}`,
        isClick: true
      }
    ]
  } else if (metaName === 'subjectData') {
    return [
      {
        title: '专题管理',
        path: '/special',
        isClick: false,
        redirect: 'noRedirect'
      },
      {
        title: '专题列表',
        path: '/special/list',
        isClick: true
      },
      {
        title: '专题详情',
        path: `/special/details/${that.$route.params.id}`,
        isClick: true
      },
      {
        title: '导出数据',
        path: '/special/data',
        isClick: true
      }
    ]
  }

  /** 资料管理 **/
  else if (metaName === 'wordMgr') {// 资料-文档
    return [
      ...CrumbLiveList('material'),
      {
        title: '文档',
        path: '/material/word',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'videoMgr') {// 资料-音视频
    return [
      ...CrumbLiveList('material'),
      {
        title: '音视频',
        path: '/material/video',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'questionMgr') {// 资料-问卷
    return [
      ...CrumbLiveList('material'),
      {
        title: '问卷',
        path: '/material/question',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'addQuestionMgr') {// 资料-问卷-创建问卷
    return [
      ...CrumbLiveList('material'),
      {
        title: '问卷',
        path: '/material/question',
        isClick: true
      },
      {
        title: that.$route.query.questionId ? '编辑问卷' : '创建问卷',
        path: '/material/addQuestion',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'prizeMgr') {// 资料-奖品
    return [
      ...CrumbLiveList('material'),
      {
        title: '奖品',
        path: '/material/prize',
        isClick: true
      }
    ]
  }
  else if (metaName === 'viewerMgr') {// 资料-观众
    return [
      ...CrumbLiveList('material'),
      {
        title: '观众',
        path: '/material/viewer',
        isClick: true
      }
    ]
  }
  else if (metaName === 'advertCard') {// 资料-广告
    return [
      ...CrumbLiveList('material'),
      {
        title: '广告',
        path: '/material/advertCard',
        isClick: true
      }
    ]
  }
  else if (metaName === 'giftMgr') {// 资料-礼物
    return [
      ...CrumbLiveList('material'),
      {
        title: '礼物',
        path: '/material/gift',
        isClick: true
      }
    ]
  }

  /** 数据总览 **/
  else if (metaName === 'dataInfo') {// 数据中心-数据总览
    return [
      ...CrumbLiveList('data'),
      {
        title: '数据总览',
        path: '/data/info',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'dataLive') {// 数据中心-活动数据
    return [
      ...CrumbLiveList('data'),
      {
        title: '活动数据',
        path: '/data/live',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }

  /** 设置中心 **/
  else if (metaName === 'settingInfo') {//设置中心
    return [
      ...CrumbLiveList('setting')
    ]
  }
  else if (metaName === 'chatMgr') {//设置中心-聊天严禁词
    return [
      ...CrumbLiveList('setting'),
      {
        title: '聊天严禁词',
        path: '/setting/chat',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'safeScreen') {//设置中心-聊天严禁词
    return [
      ...CrumbLiveList('setting'),
      {
        title: '防录屏设置',
        path: '/setting/safeScreen',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'devMgr') {//设置中心-开发设置
    return [
      ...CrumbLiveList('setting'),
      {
        title: '开发设置',
        path: '/setting/dev',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'devCallback') {//设置中心-开发设置-回调设置
    return [
      ...CrumbLiveList('setting'),
      {
        title: '开发设置',
        path: '/setting/dev',
        isClick: true
      },
      {
        title: '回调设置',
        path: '/dev/callback',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'devModify') {//设置中心-开发设置-应用详情
    return [
      ...CrumbLiveList('setting'),
      {
        title: '开发设置',
        path: '/setting/dev',
        isClick: true
      },
      {
        title: '应用详情',
        path: `/dev/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'logoMgr') {//设置中心-控制台标识
    return [
      ...CrumbLiveList('setting'),
      {
        title: '控制台标识',
        path: '/setting/logo',
        isClick: false,
        redirect: 'noRedirect'
      },
    ]
  }
  else if (metaName === 'functionMgr') {//设置中心-功能配置
    return [
      ...CrumbLiveList('setting'),
      {
        title: '功能配置',
        path: '/setting/functionMgr',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'livingMgr') {//设置中心-直播间设置
    return [
      ...CrumbLiveList('setting'),
      {
        title: '直播间设计器',
        path: '/setting/brand',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'protocolMgr') {//设置中心-观看协议
    return [
      ...CrumbLiveList('setting'),
      {
        title: '观看协议',
        path: '/setting/protocol',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'playerMgr') {//设置中心-播放器设置
    return [
      ...CrumbLiveList('setting'),
      {
        title: '播放器设置',
        path: '/setting/playerMgr',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'tagset') {//设置中心-标签设置
    return [
      ...CrumbLiveList('setting'),
      {
        title: '标签设置',
        path: '/setting/tagset',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  /** 财务中心 **/
  else if (metaName === 'financeInfo') {//财务中心-财务总览
    return [
      ...CrumbLiveList('finance'),
      {
        title: '财务总览',
        path: '/finance/info',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'infoDetail') {//财务中心-订单明细
    return [
      ...CrumbLiveList('finance'),
      {
        title: '财务总览',
        path: '/finance/info',
        isClick: true
      },
      {
        title: '订单明细',
        path: '/finance/infoDetail',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'payOrder') {//财务中心-订单支付
    return [
      ...CrumbLiveList('finance'),
      {
        title: '财务总览',
        path: '/finance/info',
        isClick: true
      },
      {
        title: '订单支付',
        path: '/finance/payOrder',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'orderDetail') {//财务中心-版本升级
    return [
      ...CrumbLiveList('finance'),
      {
        title: '财务总览',
        path: '/finance/info',
        isClick: true
      },
      {
        title: '版本升级',
        path: '/finance/orderDetail',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'financeIncome') {//财务中心-账户收益
    return [
      ...CrumbLiveList('finance'),
      {
        title: '账户收益',
        path: '/finance/income',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'accountDetail') {//财务中心-提现明细
    return [
      ...CrumbLiveList('finance'),
      {
        title: '账户收益',
        path: '/finance/income',
        isClick: true
      },
      {
        title: '提现明细',
        path: '/finance/accountDetail',
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'incomeDetail') {//财务中心-收益详情
    return [
      ...CrumbLiveList('finance'),
      {
        title: '账户收益',
        path: '/finance/income',
        isClick: true
      },
      {
        title: '收益详情',
        path: `/finance/incomeDetail/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }

  /** 账户管理 **/
  else if (metaName === 'accountInfo') {//账户管理-账户信息
    return [
      ...CrumbLiveList('account'),
      {
        title: '账户信息',
        path: `/acc/info`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'sonMgr') {//账户管理-子账号管理
    return [
      ...CrumbLiveList('account'),
      {
        title: '子账号管理',
        path: `/acc/son`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'allocation') {//账户管理-子账号管理
    return [
      ...CrumbLiveList('account'),
      {
        title: '子账号管理',
        path: `/acc/son`,
        isClick: true
      },
      {
        title: '用量分配',
        path: `/allocation`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'sonDetail') {//账户管理-子账号详情
    return [
      ...CrumbLiveList('account'),
      {
        title: '子账号管理',
        path: `/acc/son`,
        isClick: true
      },
      {
        title: '子账号信息',
        path: `/sonDetail/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'myHome') {//账户管理-个人主页
    return [
      ...CrumbLiveList('account'),
      {
        title: '个人主页',
        path: `/acc/myHome`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'homeSet') {//账户管理-个人主页-设置
    return [
      ...CrumbLiveList('account'),
      {
        title: '个人主页',
        path: `/acc/myHome`,
        isClick: true
      },
      {
        title: '设置',
        path: `/homeSet/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  /** 下载中心 **/
  else if (metaName === 'downloadList') {//下载中心
    return [
      {
        title: '下载中心',
        path: `/other/downloadList`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  /** 消息中心 **/
  else if (metaName === 'msgList') {//消息中心
    return [
      {
        title: '消息中心',
        path: `/other/msgList`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  }
  else if (metaName === 'msgDetail') {//消息详情
    return [
      {
        title: '消息中心',
        path: `/other/msgList`,
        isClick: true
      },
      {
        title: '消息详情',
        path: `/other/msgDetail/${that.$route.params.str}`,
        isClick: false,
        redirect: 'noRedirect'
      }
    ]
  } else {
    return [];
  }
}
