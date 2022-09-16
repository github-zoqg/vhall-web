<template>
  <!-- .data-finance 财务总览（typeChange==true）；.data-usage 首页（typeChange==false） -->
  <div :class=" typeChange ? 'data-finance' : 'data-usage'">
    <!-- 计费：并发 -->
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.concurrency">
      <el-col :span="buttonList.includes('extend') ? (typeChange ? 8 : 6) : (typeChange ? 15 : 9)">
        <div class="top-item first-version">
          <p>当前版本</p>
          <h2>{{ userInfo.edition }}</h2>
          <p v-if="userInfo.concurrency.concurrency_valid_time">有效期: {{ userInfo.edition_valid_time || '' }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
      <el-col :span="buttonList.includes('extend') ? (typeChange ? 8 : 6) : (typeChange ? 15 : 9)">
        <div class="top-item">
          <p>总并发（方）<span class="level" @click="levelVersion('升级')" v-if="buttonList.includes('upgrade')">升级</span></p>
          <h2 class="custom-big custom-font-barlow">{{ userInfo.concurrency.total_concurrency }}</h2>
          <p v-if="userInfo.concurrency.concurrency_valid_time">有效期: {{ userInfo.concurrency.concurrency_valid_time || ''  }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
      <el-col :span="typeChange ? 8 : 6" v-if="buttonList.includes('extend')">
        <div class="top-item">
          <p>并发扩展包（人次）<span class="level" @click="levelVersion('购买')">购买</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">
              1.当全部并发套餐到期，若有扩展包则会开始扣除扩展包；<br>
              若无扩展包，则不可发直播且直播回放不可播放<br>
              2.扩展包欠费则不可发直播，回放不受影响
            </div>
           <i class="iconfont-v3 saasicon_help_m icon__max_show"></i>
          </el-tooltip>
          </p>
          <h2 class="custom-big custom-font-barlow">{{ userInfo.concurrency.extend || userInfo.arrears.extend }}</h2>
          <!-- <p class="account pointer" @click="goAccountDetail" v-if="buttonList.includes('details') && this.$route.path==='/finance/info'">订单明细</p> -->
          <el-tooltip effect="dark" placement="right" v-tooltipMove v-if="typeChange && userInfo && userInfo.sms">
            <div slot="content">
              1.当全部并发套餐到期，若有扩展包则会开始扣除扩展包；<br>
              若无扩展包，则不可发直播且直播回放不可播放<br>
              2.扩展包欠费则不可发直播，回放不受影响
            </div>
           <i class="iconfont-v3 saasicon_help_m icon__min_show"></i>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="buttonList.includes('extend') ? (typeChange ? 8 : 6) : (typeChange ? 15 : 9)" v-if="userInfo.concurrency.display_extend_day">
        <div class="top-item">
          <p>并发扩展包（天）</p>
          <h2 class="custom-big custom-font-barlow">{{ userInfo.concurrency.extend_day }}</h2>
          <p>{{ userInfo.concurrency.extend_day_start }} 至 {{ userInfo.concurrency.extend_day_end }}</p>
        </div>
      </el-col>
      <el-col :span="buttonList.includes('extend') ? (typeChange ? 8 : 6) : (typeChange ? 15 : 9)" v-if="showSmsModule && typeChange">
        <div class="top-item">
          <p>短信余额（条）</p>
          <h2 class="custom-big custom-font-barlow">{{ userInfo && userInfo.sms && userInfo.sms.sms ? userInfo.sms.sms || 0 : 0 }}</h2>
          <p v-if="userInfo.concurrency.concurrency_valid_time">有效期: {{ userInfo.edition_valid_time || '' }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
    </el-row>
    <!-- 计费：流量 -->
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.flow">
      <el-col :span="typeChange ? 15 : 9">
        <div class="top-item usage-item">
          <p>当前版本</p>
          <h2>{{ userInfo.edition }} <span class="level pointer" v-if ="buttonList.includes('standard_upgrade')" @click="upgradeVersion()">升级</span></h2>
          <p v-if="userInfo.edition_valid_time">有效期: {{ userInfo.edition_valid_time }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
      <el-col :span="typeChange ? 15 : 9" v-if="userInfo.edition === '无极版'">
        <div class="top-item usage-item">
          <p>总流量/回放流量（GB）
            <el-tooltip effect="dark" placement="right" v-tooltipMove>
              <div slot="content">
                1.优先消耗较早购买或赠送的流量包，消耗完自动启用下一个流量包<br>
                2.自启用之日起，赠送的流量包有效期为7天<br>
                3.流量包到期后自动失效
              </div>
             <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
          </p>
          <h2 class="custom-big custom-font-barlow">无限流量/{{ userInfo.flow.playback_flow || userInfo.arrears.flow  }}</h2>
          <!-- <p class="account" @click="goAccountDetail" v-if="this.$route.path==='/finance/info' && buttonList.includes('details')">订单明细</p> -->
        </div>
      </el-col>
      <el-col :span="typeChange ? 15 : 9" v-else>
        <div class="top-item usage-item">
          <p>总流量/可用流量（GB）<span class="level" @click="buyVersion()" v-if ="buttonList.includes('flow')">购买</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
              <div slot="content">
                1.优先消耗较早购买或赠送的流量包，消耗完自动启用下一个流量包<br>
                2.自启用之日起，赠送的流量包有效期为7天<br>
                3.流量包到期后自动失效
              </div>
              <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
          </p>
          <h2 class="custom-big custom-font-barlow" v-if="userInfo.flow">{{ userInfo.flow.total_flow}}/{{ userInfo.flow.valid_flow || userInfo.arrears.flow  }}</h2>
          <!-- <p class="account"  @click="goAccountDetail" v-if="this.$route.path==='/finance/info' && buttonList.includes('details')">订单明细</p> -->
        </div>
      </el-col>
      <el-col :span="typeChange ? 15 : 9" v-if="showSmsModule && typeChange">
        <div class="top-item usage-item">
          <p>短信余额（条）</p>
          <h2 class="custom-big custom-font-barlow">{{ userInfo && userInfo.sms && userInfo.sms.sms ? userInfo.sms.sms || 0 : 0 }}</h2>
          <p v-if="userInfo.edition_valid_time">有效期: {{ userInfo.edition_valid_time }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
    </el-row>
    <!-- 计费：时长 -->
    <el-row type="flex" class="row-top" justify="space-around" v-if="userInfo.duration">
      <el-col :span="typeChange ? 15 : 9">
        <div class="top-item usage-item">
          <p>当前版本</p>
          <h2>{{ userInfo.edition }}</h2>
          <p v-if="userInfo.edition_valid_time">有效期: {{ userInfo.edition_valid_time }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
      <el-col :span="typeChange ? 15 : 9">
        <div class="top-item usage-item">
          <p>总时长/可用时长（分钟）
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
              <div slot="content">
                1.优先消耗较早购买或赠送的时长包，消耗完自动启用下一个时长包<br>
                2.自启用之日起，赠送的时长包有效期为7天<br>
                3.时长包到期后自动失效
              </div>
              <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
          </p>
          <h2 class="custom-big custom-font-barlow" v-if="userInfo.duration">{{ userInfo.duration.total_duration}}/{{ userInfo.duration.duration }}</h2>
        </div>
      </el-col>
      <el-col :span="typeChange ? 15 : 9" v-if="showSmsModule && typeChange">
        <div class="top-item usage-item">
          <p>短信余额（条）</p>
          <h2 class="custom-big custom-font-barlow">{{ userInfo && userInfo.sms && userInfo.sms.sms ? userInfo.sms.sms || 0 : 0 }}</h2>
          <p v-if="userInfo.edition_valid_time">有效期: {{ userInfo.edition_valid_time }}<span v-if="isOutTime">(已过期)</span></p>
        </div>
      </el-col>
    </el-row>
    <up-version ref="levelVersion" :title="title" :concurrentPrice="concurrentPrice"></up-version>
  </div>
</template>
<script>
import upVersion from './components/upversion';
import { sessionOrLocal } from '@/utils/utils';
export default {
  watch: {
    userId: {
      handler() {
        this.getVersion();
      }
    }
  },
  data() {
    return {
      typeChange:false, // 区分是首页还是财务的样式
      title: '流量包',
      isOutTime: false, //是否过期
      unpaid: 0,
      versionType: '',
      userInfo: {
        concurrency: {},
        flow: {},
        arrears: {}
      },
      buttonList: [],
      orderInfo: {
        unpaid: 0
      },
      concurrentPrice: {}
    };
  },
  computed: {
    showSmsModule: function () {
      const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['message_notice'];
      // 不是知学云账号 & 开启了 短信通知配置项权限
      return userInfo.user_extends.extends_remark != 1 && isNoticeMessage == 1;
    }
  },
  components: {
    upVersion
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'));
    this.getVersion();
    this.getPayListStatus();
    if (this.$route.path == '/finance/info') {
      this.typeChange = true
    }else {
       this.typeChange = false
    }
  },
  methods: {
    getVersion() {
      this.$fetch('getVersionInfo', { user_id: this.userId}).then(res => {
        this.userInfo = res.data;
        this.versionType = res.data.edition;
        this.isOutTime = res.data.expired == 1 ? true : false;
        if (res.data.type == 2) {
          this.buttonList = res.data.duration.buttons;
        } else{
          this.buttonList = res.data.concurrency ? res.data.concurrency.buttons : res.data.flow.buttons;
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    outTime(time) {
      let newDate = new Date().getTime(); //获取本地当前时间
      time = `${time} 23:59:59`
      let diff = newDate - (new Date(time).getTime());
      if (diff > 0) {
        this.isOutTime = true;
      }
    },
    getPayListStatus() {
      this.$fetch('orderStatus').then(res => {
        this.orderInfo = res.data;
      }).catch(e=>{
        console.log(e);
      });
    },
    goPayList(id) {
      this.$router.push({
        path: '/finance/payOrder',
        query: {
          userId: this.userId,
          orderId: id
        }
      });
    },
    levelVersion(title) {
      if (this.$route.path !== '/finance/info') {
        this.$router.push({
          path: '/finance/info'
        });
      } else {
        if (this.orderInfo.unpaid == 1) {
          this.$alert('您有未处理订单', '提示', {
            confirmButtonText: '立即支付',
            customClass: 'zdy-alert-box',
          }).then(()=>{
            this.goPayList(this.orderInfo.order_id);
          }).catch(()=>{});
          return;
        }
        this.$vhall_paas_port({
          k: title === '升级' ? 100689 : 100692,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        if (title === '升级' && this.userInfo.left_months < 1) {
          this.$alert('当前套餐剩余有效时间不满一个月，不支持升级', '提示', {
            confirmButtonText: '知道了',
            customClass: 'zdy-message-box',
            callback: action => {}
          });
          return;
        }
        this.$refs.levelVersion.dialogVisible = true;
        this.title = title;
        this.concurrentPrice = this.userInfo;
      }
    },
    goAccountDetail() {
      this.$router.push({
        path: '/finance/infoDetail'
      });
    },
    upgradeVersion() {
      this.$router.push({
        path: '/finance/orderDetail'
      });
    },
    buyVersion() {
      if (this.$route.path !== '/finance/info') {
        this.$router.push({
          path: '/finance/info'
        });
      } else {
        if (this.orderInfo.unpaid == 1) {
         this.$alert('您有未处理订单', '提示', {
          confirmButtonText: '立即支付',
          customClass: 'zdy-alert-box',
        }).then(()=>{
          this.goPayList(this.orderInfo.order_id);
        }).catch(()=>{});
          return;
        }
        this.$vhall_paas_port({
          k: 100703,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.title = this.versionType;
        this.concurrentPrice = this.userInfo;
        this.$refs.levelVersion.dialogBuyVisible = true;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.data-usage {
  background: #fff;
  padding: 32px 24px;
  border-radius: 4px;
  .row-top {
    background: #ffffff;
    border-radius: 4px;
  }
  .row-center {
    margin: 24px 0;
  }
  .top-item {
    text-align: left;
    width: 100%;
    min-width: 250px;
    height: 140px;
    padding: 32px 0;
    position: relative;
    margin-right: 16px;
    border-radius: 4px;
    .level {
      border: 1px solid #FB3A32;
      font-size: 12px;
      color: #FB3A32;
      text-align: center;
      padding: 1px 7px;
      // margin-left: 5px;
      border-radius: 10px;
      cursor: pointer;
    }
    p {
      font-size: 14px;
      color: #999;
    }
    i{
      font-size: 14px;
      padding: 0 2px;
    }
    h2{
      font-size: 24px;
      color: #1a1a1a;
      line-height: 30px;
      font-weight: bold;
      padding: 4px 0 7px 0;
    }
    .custom-big {
      font-size: 28px;
    }
    .account{
      position: absolute;
      top: 30px;
      right:0;
      color: #3562FA;
      font-size: 14px;
      cursor: pointer;
    }
    // &:first-child{
    //   padding-left: 24px;
    // }
    &.first-version{
      padding-left: 24px;
    }
  }
  .usage-item{
    padding: 32px 24px;
  }
}
.data-finance {
  background: #f7f7f7;
  // padding: 32px 24px;
  border-radius: 4px;
  .row-top {
    background: #f7f7f7;
  }
  .row-center {
    margin: 24px 0;
  }
  /deep/.el-col {
    margin-right: 16px;
    background: #fff;
    border-radius: 4px;
  }
  /deep/.el-row--flex.is-justify-space-around {
    justify-content: space-between;
  }
  .top-item {
    text-align: left;
    max-width: 445px;
    height: 140px;
    padding: 32px 16px 32px 24px;
    position: relative;
    background: #fff;
    border-radius: 4px;
    .level {
      border: 1px solid #FB3A32;
      font-size: 12px;
      color: #FB3A32;
      text-align: center;
      padding: 1px 7px;
      // margin-left: 5px;
      border-radius: 10px;
      cursor: pointer;
    }
    p {
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    i{
      font-size: 14px;
      padding: 0 2px;
    }
    h2{
      color: #1a1a1a;
      line-height: 30px;
      font-weight: bold;
      padding: 4px 0 7px 0;
      font-size: 24px;
    }
    .custom-big {
      font-size: 28px;
    }
    .account{
      position: absolute;
      top: 14px;
      right:20px;
      color: #3562FA;
      font-size: 14px;
      cursor: pointer;
    }
    .icon__max_show {
      display: none;
    }
    .icon__min_show {
      display: block;
    }
    @media (min-width: 1920px) {
      .icon__max_show {
        display: inline-block;
      }
      .icon__min_show {
        display: none;
      }
    }
  }
  .usage-item{
    max-width: 670px;
  }
  /deep/.el-col .el-col-9{
    background: #fff;
    width: 51%;
    position: relative;
  }
  /deep/.el-col .el-col-15{
    background: #fff;
    width: 62.5%;
    position: relative;
  }
  .el-col{
     &:last-child{
      margin-right: 0;
    }
  }
  // .account{
  //   pos
  // }
}
/deep/.saasicon_help_m {
  color: #999999;
}
</style>
