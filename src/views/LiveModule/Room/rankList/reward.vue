<template>
    <!-- 邀请榜单 -->
    <div class="vhall-reward">
      <div class="no-info" v-if="noInfoShow">
        <img
            src="https://t-alistatic01.e.vhall.com/static/images/mobile/shafa-icon.png?v=mntXScOgiTh6Da6AjjUMQA%3D%3D"
            alt=""
        />
        <p>当前您还没邀请人，快去抢沙发吧~</p>
      </div>
        <!-- 邀请榜单 -->
        <ul v-if = '!noInfoShow'>
            <li class="reward-list" v-for = "(item,index) in rewardInfo" :key="index">
                <img class="invitTop" src="../img/zan-1.png" alt="">

                <img class="reward-head" :src="item.img_url || `//${staticDomain}/static/images/mobile/user-pic-default.png`" alt="">
                <span class="reward-nickname" :title="item.nick_name">{{ item.nick_name }}</span>

                <div class="reward-right">
                    <span @click = 'getrewardList'>打赏</span>
                    <span><span> {{ item.award }}</span>&nbsp;元</span>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  props: {
    ilId: {
      required: true
    },
    staticDomain: {
      required: true,
      default: ''
    }
  },
  data () {
    return {
      rewardInfo: [],
      noInfoShow: false
    };
  },
  created () {
    this.getrewardList();
  },

  mounted () {

  },

  methods: {
    // 获取邀请列表
    getrewardList () {
      this.$fetch('inviteTop', {
        // room_id: this.ilId, // lss_id TODO:
        pos: 0,
        limit: 100
      }).then((res) => {
        if (res.code == 200) {
          this.rewardInfo = res.data.list;
          if (res.data.list.length > 0) {
            this.noInfoShow = false;
          } else {
            this.noInfoShow = true;
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.vhall-reward {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .reward-list {
        color: #666;
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding-left: 0!important;
        .reward-head {
            float: left;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 20px;
            margin-top: 5px;
        }
    }

    .invitTop {
        float: left;
        margin-right: 20px;
        margin-top: 20px;
    }
    .reward-nickname {
        display: block;
        width: 100px;
        height: 40px;
        float: left;
        line-height: 40px;
        margin-top: 5px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
    }
    .reward-right {
        float: right;
        margin-right: 20px;
        font-size: 14px;
        span:last-of-type{
            span {
                color: #f2554e;
            }
        }
    }
    .no-info {
          width: 240px;
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translateX(-50%);
          img {
            display: block;
            width: 62px;
            height: 51px;
            margin: 0 auto;
          }
          p {
            margin-top: 10px;
            font-size: 14px;
            color: #999;
            text-align: center;
          }
        }
}
</style>
