<template>
  <div class="custom-tab">
    <div v-for="(item, idx) in components" :key="idx">
      <!-- 图文 -->
      <template v-if="item.component_id == 1">
        <div class="rich-text" v-html="item.content"></div>
      </template>
      <!-- 二维码 -->
      <template v-if="item.component_id == 2">
        <img
          :src="
            `${
              item.imageSrc && item.imageSrc.match('http://')
                ? item.imageSrc
                : (roominfo.domains && roominfo.domains.upload) + '/' + item.imageSrc
            }`
          "
        />
      </template>
      <!-- 直播 -->
      <template v-if="item.component_id == 3">
        <div>
          <p
            v-for="(videoImage, index) in item.items"
            :key="index"
            class="direc-seeding"
          >
            <span
              :class="['label', label[index] ? label[index].liveColor : '']"
            >
              {{ label[index] ? label[index].liveLabel : '' }}
            </span>
            <a :href="'/' + videoImage.id" target="_blank">
              <img
                :src="`${roominfo.domains && roominfo.domains.upload}/${videoImage.img_url}`"
                onerror="this.src='//t-alistatic01.e.vhall.com/static/img/v35-webinar.png';this.onerror=null"
                alt="直播"
              />
              <p class="people-account">
                <span>{{ videoImage.num }}</span>
                <span class="iconfont iconguankancishu"></span>
              </p>
            </a>
            <span class="video-header" :title="videoImage.subject">
              {{ videoImage.subject }}
            </span>
            <span class="video-start-time">
              {{ videoImage.start_time }}
            </span>
          </p>
        </div>
      </template>
      <!-- 专题 -->
      <template v-if="item.component_id == 4">
        <div>
          <p
            v-for="(videoImage, index) in item.items"
            :key="index"
            class="direc-seeding"
          >
            <a :href="'/subject/view/' + videoImage.id" target="_blank">
              <img
                onerror="this.src='//t-alistatic01.e.vhall.com/static/img/v35-webinar.png';this.onerror=null"
                alt="专题"
                :src="`${roominfo.domains && roominfo.domains.upload}/${videoImage.cover}`"
              />
              <p class="people-account">
                <span class="watch-num">{{ videoImage.webinar_num }}</span>
                <span class="iconfont iconshexiangtou_kaiqi"></span>
                <span class="line">|</span>
                <span class="watch-num">{{ videoImage.view_num }}</span>
                <span class="iconfont iconguankancishu"></span>
              </p>
            </a>
            <span class="video-header" :title="videoImage.title">
              {{ videoImage.title }}
            </span>
            <span class="video-start-time">
              {{ videoImage.created_at }}
            </span>
          </p>
        </div>
      </template>
      <!-- 文字链 -->
      <template v-if="item.component_id == 5">
        <a class="active-link" :href="item.src">{{ item.text }}</a>
      </template>
      <!-- 图文链 -->
      <template v-if="item.component_id == 6">
        <a class="active-phop" :href="item.src" target="_blank">
          <img
            :src="`${roominfo.domains && roominfo.domains.upload}/${item.imageSrc}`"
            width="100%"
          />
        </a>
      </template>
      <!-- 标题 -->
      <template v-if="item.component_id == 7">
        <h4>{{ item.title }}</h4>
      </template>
      <!-- 分割线 -->
      <template v-if="item.component_id == 8">
        <hr />
      </template>
      <!-- 排行榜  -->
      <template v-if="item.component_id == 9">
        <div class="invite-reward-list">
          <div class="rank-title">
            <span @click="invitedTopClick">邀请榜</span>
            <span @click="rewardListClick" class="reward-list">打赏榜</span>
            <span @click="changeRules">排行榜规则</span>
          </div>
          <div
            v-show="rulesShow"
            class="inviteRules"
            v-html="topShow ? item.inContent : item.rewardContent"
          ></div>
          <!-- <p >这是一个很好的邀请榜单</p> -->
          <div class="rank-box">
            <div class="inviteBillboard">
              <invited
                :vssJoinId="joinId"
                :ilId="roominfo.webinar_id"
                v-if="topShow"
                :staticDomain="domains.static"
              ></invited>
              <reward
                :vssJoinId="joinId"
                :ilId="roominfo.webinar_id"
                v-if="!topShow"
                :staticDomain="domains.static"
              ></reward>
            </div>
          </div>
          <div class="bottom-invite">
            <p v-show="roominfo.show_invite_card == 1" @click="invitedFriend">
              邀请好友观看
            </p>
          </div>
        </div>
      </template>
      <!-- 公告 -->
      <template v-if="item.component_id == 10"></template>
    </div>
  </div>
</template>
<script>
import invited from '../rankList'; // 邀请榜
import reward from '../rankList/reward'; // 打赏榜
export default {
  props: {
    roominfo: {
      required: true
    },
    components: {
      required: true,
      default: () => ({})
    },
    joinId: {
      required: true
    },
    topShow: {
      required: true
    },
    invitedFriend: {
      required: true
    },
    rulesShow: {
      required: true
    },
    changeRules: {
      required: true
    },
    rewardListClick: {
      required: true
    },
    invitedTopClick: {
      required: true
    },
    domains: {
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      label: []
    };
  },
  components: {
    invited,
    reward
  },
  watch: {
    components: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('gyh =====> roominfo', this.roominfo);
        let liveItem = val.find(c => c.component_id == 3);
        if (liveItem) {
          this.label = this.getLiveLabel(liveItem.items || []);
        }
      }
    }
  },
  methods: {
    getLiveLabel(arr) {
      return arr.reduce((acc, curr, index) => {
        let liveColor = '';
        let liveLabel = '';
        if (curr.type == 1) {
          liveColor = 'live';
          liveLabel = '直播';
        } else if (curr.type == 2) {
          liveColor = 'preview';
          liveLabel = '预告';
        } else if (curr.type == 3) {
          if (curr.auto_record == 1 && curr.is_demand == 0) {
            liveColor = 'record';
            liveLabel = '回放';
          } else if (curr.is_demand == 1) {
            liveColor = 'demand';
            liveLabel = '点播';
          } else {
            liveColor = 'over';
            liveLabel = '结束';
          }
        }
        acc[index] = { liveColor, liveLabel };
        return acc;
      }, []);
    }
  }
};
</script>
<style lang="less" scoped>
.topic-title {
  float: left;
  color: #666;
}

.active-link {
  width: 100%;
  height: 15px;
}

.active-info {
  width: 100%;
  color: #666;
  /* height: 100px; */

  .active-phop {
    color: #666;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
h4 {
  color: #666;
}

.topic-content {
  clear: both;
  margin-top: 40px;
  color: #666;
  font-size: 14px;
  line-height: 28px;
}
h3 {
  margin-top: 10px;
  padding-bottom: 10px;
  color: #666;
  margin-left: 30px;
  width: 80px;
  line-height: 25px;
  text-align: center;
  float: left;
  cursor: pointer;
  &.active {
    border-bottom: 2px solid #fc5659;
  }
}

hr {
  clear: both;
  background-color: #c7c7c7;
  height: 1px;
  border: none;
}
.rich-text {
  color: initial !important;
}

.custom-tab {
  & > div {
    margin-bottom: 10px;
    .label {
      position: absolute;
      text-align: center;
      background-color: #5da7ed;
      color: #ffffff;
      display: inline-block;
      top: 15px;
      left: 11px;
      width: 32px;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      z-index: 1;
      &.live {
        background-color: #fc5659;
      }
      &.preview {
        background-color: #5ea6ec;
      }

      &.record {
        background-color: #61cc58;
      }

      &.over {
        background-color: #999;
      }

      &.demand {
        background-color: #ff8835;
      }
    }
  }
}
</style>
