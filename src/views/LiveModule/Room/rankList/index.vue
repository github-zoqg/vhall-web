<template>
  <!-- 邀请榜单 -->
  <div class="vhall-invite">
    <div class="no-info" v-if="noInfoShow">
      <img
        src="https://t-alistatic01.e.vhall.com/static/images/mobile/shafa-icon.png?v=mntXScOgiTh6Da6AjjUMQA%3D%3D"
        alt=""
      />
      <p>当前您还没邀请人，快去抢沙发吧~</p>
    </div>
    <!-- 邀请榜单 -->
    <ul v-if="!noInfoShow">
      <li class="invite-list" v-for="(item,index) in inviteInfo" :key="index">
        <img class="invitTop" src="../img/zan-1.png" alt="" />

        <img class="invite-head" :src="item.img_url || `//${staticDomain}/static/images/mobile/user-pic-default.png`" alt="" />
        <span class="invite-nickname" :title="item.nick_name">{{ item.nick_name }}</span>

        <div class="invite-right">
          <span @click="getInviteList">邀请</span>
          <span>{{ item.invites }}&nbsp;人</span>
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
      inviteInfo: [],
      noInfoShow: false
    };
  },
  created () {
    this.getInviteList();
  },

  mounted () {},

  methods: {
    // 获取邀请列表
    getInviteList () {
      this.$fetch('getCardList', {
        // room_id: this.ilId, // lss_id TODO:
        pos: 0,
        limit: 100
      }).then(res => {
        if (res.code == 200) {
          this.inviteInfo = res.data.list;
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
  .vhall-invite {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .invite-list {
      color: #666;
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding-left: 0 !important;
      .invite-head {
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
    .invite-nickname {
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
    .invite-right {
      margin-right: 20px;
      float: right;
      font-size: 14px;

      span:last-of-type {
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
