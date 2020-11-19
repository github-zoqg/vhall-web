<template>
  <div>
    <div class="table-redCoupon" @click="openRedPacket" v-if="redPacketShowBut" :class="{have: isHavePacket}">
      <img src="../../assets/images/redCoupon/spike-red-packet.png" alt />
    </div>
    <popup :visible="RedPacketVisible" :header-show="false">
      <div class="redcoupon-wrap" v-if="initCompleted">
        <div class="close iconfont" @click="closeMobild">&#xe725;</div>
        <!--    <div class="back iconfont" v-show="isSuccessRed && looEeverybody" @click="goBack">&#xe704;</div>-->
        <div class="open-wrap" v-show="!isSuccessRed">
          <div class="tiltle">
            <img class="avatar" :src="getpacketCreateObj.avatar" alt="">
            <span>{{getpacketCreateObj.nickname}}</span>
          </div>
          <h3>{{getpacketCreateObj.describe}}</h3>
          <p class="over-tips" v-if="emptyRefCoupon">啊哦，抢光了~</p>
          <div class="active" v-else :class="{opens: classOpen}" @click="openRedCoupon">
            <div class="open fan">拆红包</div>
            <div class=" open ">拆红包</div>
          </div>
          <a href="javascript:;" class="red-packet-other" v-if="emptyRefCoupon" @click="openEveryOne">看看大家的手气 &gt;</a>
        </div>
        <div class="open-success" v-show="isSuccessRed">
          <div class="tiltle">
            <img class="avatar" :src="getpacketCreateObj.avatar" alt="">
            <span class="nic-name">{{getpacketCreateObj.nickname}}</span>
            <span class="note">{{getpacketCreateObj.describe}}</span>
          </div>
          <div v-show="!looEeverybody">
            <div class="content">
              <p>{{myAmount}} <span>元</span></p>
              <h4>已存入您的微吼账户</h4>
            </div>
            <ul>
              <li>1. 微信登录抢红包的用户，可关注“微吼直播”微信公众号，在红包收益中提现</li>
              <li>2. 其他方式登录的用户，请用电脑登录<br>https://e.vhall.com在收益管理中提现</li>
            </ul>
            <a href="javascript:;" class="red-packet-other"  @click="openEveryOne">看看大家的手气 &gt;</a>
          </div>
          <div class="catch-red" v-show="looEeverybody">
            <div class="head">领取{{getpacketCreateObj.get_user_count}}/{{getpacketCreateObj.number}}个</div>
            <ul ref="packetList">
              <li v-for="(item, index) in EeverybodyList" :key="index">
                <img class="fl" width="32" height="32" :src="item.avatar || 'https://t-alistatic01.e.vhall.com/static/img/head501.png'"/>
                <span class="fr">{{item.amount}}元</span>
                <div class="middle">
                  <p class="nowrap" title="">{{item.nickname}}</p>
                  <p class="time">{{item.created_at}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </popup>
  </div>

</template>
<script>
import Popup from '../../libs/saas-popup'; // 弹窗
export default {
  name: 'redcoupon',
  data () {
    return {
      redPacketShowBut: true,
      RedPacketVisible: false,
      emptyRefCoupon: false,
      myAmount: 0,
      getpacketCreateObj: {},
      EeverybodyList: [],
      classOpen: false,
      isSuccessRed: false,
      looEeverybody: false,
      initCompleted: false,
      page: 1,
      scrollLock: false
    };
  },
  watch: {

  },
  created () {
  },
  mounted () {
  },
  props: {
    room_id: {
      required: true
    },
    vss_token: {
      required: true
    },
    red_packet_uuid: {
      required: true
    },
    authInfo: {
      required: true
    },
    isHavePacket: {
      required: true
    }
  },
  methods: {
    initInfo () {
      const obj = {
        vss_token: this.vss_token,
        room_id: this.room_id,
        red_packet_uuid: this.red_packet_uuid
      };
      this.$vhallFetch('myPacketLastInfo', obj).then((res) => { // 我的红包信息
        this.initCompleted = true;
        const data = res.data;
        this.getpacketCreateObj = data.red_packet; // 红包信息
        if (data.status == 1) { // 我已抢到红包
          this.isSuccessRed = true;
          this.myAmount = data.amount;
        } else { // 我没抢到红包
          if (data.red_packet.number == data.red_packet.get_user_count) { // 如果红包数量和领红包人数相等，说明已抢光
            this.emptyRefCoupon = true;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    openRedPacket () {
      if (this.authInfo.length === 0) {
        this.$emit('NoLogin');
        return;
      }
      this.initInfo();
      this.RedPacketVisible = true;
    },
    openEveryOne () {
      const obj = {
        vss_token: this.vss_token,
        room_id: this.room_id,
        red_packet_uuid: this.red_packet_uuid,
        order: 'created_at'
      };
      this.$vhallFetch('getRecordsPacket', obj).then((res) => {
        this.isSuccessRed = true; // 显示金额
        this.looEeverybody = true; // 显示记录
        this.getpacketCreateObj = res.data.red_packet;
        this.EeverybodyList = res.data ? res.data.list : [];
        this.scrollLock = false;
        this.page = 1;
        this.$refs.packetList.addEventListener('scroll', this.scrollBottom);
      }).catch(error => {
        console.log(error);
      });
    },
    openRedCoupon () { // 抢红包
      if (this.opening) {
        return;
      }
      this.opening = true;
      const obj = {
        vss_token: this.vss_token,
        room_id: this.room_id,
        red_packet_uuid: this.red_packet_uuid
      };
      this.$vhallFetch('getpacketCreate', obj).then((res) => { // 抢红包
        this.opening = false;
        console.log(res, 66666);
        if (res.data.status == 0) {
          this.emptyRefCoupon = true;
          return;
        }
        this.classOpen = true; // 拆红包动作
        this.getpacketCreateObj = res.data.red_packet;
        this.myAmount = res.data.amount;
        setTimeout(() => {
          this.isSuccessRed = true; // 显示金额
          this.looEeverybody = false;
        }, 680);
      }).catch(error => {
        console.log(error);
      });
    },
    closeMobild () {
      this.isSuccessRed = false;
      this.emptyRefCoupon = false;
      this.looEeverybody = false;
      this.initCompleted = false;
      this.RedPacketVisible = false;
    },
    scrollBottom () {
      const container = this.$refs.packetList;
      if (((container.offsetHeight + container.scrollTop) > (container.scrollHeight)) && !this.scrollLock) {
        this.page = this.page + 1;
        const obj = {
          vss_token: this.vss_token,
          room_id: this.room_id,
          red_packet_uuid: this.red_packet_uuid,
          page: this.page,
          order: 'created_at'
        };
        this.$vhallFetch('getRecordsPacket', obj).then((res) => {
          if ((res.data.list && !res.data.list.length) || !res.data.list) {
            this.scrollLock = true;
          } else {
            this.scrollLock = false;
          }
          this.isSuccessRed = true; // 显示金额
          this.looEeverybody = true; // 显示记录
          this.getpacketCreateObj = res.data.red_packet;
          const redPacketList = res.data ? res.data.list : [];
          this.EeverybodyList = this.EeverybodyList.concat(redPacketList);
        }).catch(error => {
          this.scrollLock = true;
          console.log(error);
        });
      }
    }
  },
  components: {
    Popup
  }
};
</script>
<style lang="less" scoped>
  .table-redCoupon {
    margin-right: 15px;
    &.have{
      animation: shake-horizontal 6s 3 ease-in-out;
    }
    img {
      width: 30px;
      margin-top: 2px;
    }
  }
  @keyframes shake-horizontal {
    2% {
      -webkit-transform: translate(0px, 0) rotate(0);
      transform: translate(0px, 0) rotate(0);
    }

    4% {
      -webkit-transform: translate(4px, 2px) rotate(3deg) scale(1.05);
      transform: translate(4px, 2px) rotate(3deg) scale(1.05);
    }

    6% {
      -webkit-transform: translate(-5px, 4px) rotate(-3deg) scale(1.1);
      transform: translate(-5px, 4px) rotate(-3deg) scale(1.1);
    }

    8% {
      -webkit-transform: translate(8px, 6px) rotate(5deg) scale(1.2);
      transform: translate(8px, 6px) rotate(5deg) scale(1.2);
    }

    10% {
      -webkit-transform: translate(3px, 4px) rotate(0) scale(1);
      transform: translate(3px, 4px) rotate(0) scale(1);
    }

    12% {
      -webkit-transform: translate(4px, 2px) rotate(3deg) scale(1.1);
      transform: translate(4px, 2px) rotate(3deg) scale(1.1);
    }

    14% {
      -webkit-transform: translate(-6px, 0) rotate(-3deg) scale(1.1);
      transform: translate(-6px, 0) rotate(-3deg) scale(1.1);
    }

    16% {
      -webkit-transform: translate(9px, 6px) rotate(5deg) scale(1.2);
      transform: translate(9px, 6px) rotate(5deg) scale(1.2);
    }

    18% {
      -webkit-transform: translate(-6px, 0) rotate(0);
      transform: translate(-6px, 0) rotate(0);
    }

    20% {
      -webkit-transform: translate(6px, 0) rotate(0);
      transform: translate(6px, 0) rotate(0);
    }

    22% {
      -webkit-transform: translate(9px, 0) rotate(0);
      transform: translate(9px, 0) rotate(0);
    }

    24% {
      -webkit-transform: translate(-1px, 0) rotate(0);
      transform: translate(-1px, 0) rotate(0);
    }

    26% {
      -webkit-transform: translate(-2px, 0) rotate(0);
      transform: translate(-2px, 0) rotate(0);
    }

    28% {
      -webkit-transform: translate(3px, 0) rotate(0);
      transform: translate(3px, 0) rotate(0);
    }

    30% {
      -webkit-transform: translate(10px, 0) rotate(0);
      transform: translate(10px, 0) rotate(0);
    }

    32% {
      -webkit-transform: translate(3px, 0) rotate(0);
      transform: translate(3px, 0) rotate(0);
    }

    34% {
      -webkit-transform: translate(-9px, 0) rotate(0);
      transform: translate(-9px, 0) rotate(0);
    }

    36% {
      -webkit-transform: translate(8px, 0) rotate(0);
      transform: translate(8px, 0) rotate(0);
    }

    38% {
      -webkit-transform: translate(-2px, 0) rotate(0);
      transform: translate(-2px, 0) rotate(0);
    }

    0%,
    40%,
    100% {
      -webkit-transform: translate(0, 0) rotate(0);
      transform: translate(0, 0) rotate(0);
    }
  }
  .redcoupon-wrap {
    line-height: normal;
    display: inline-block;
    position: relative;
    width: 360px;
    height: 482px;
    color: #f7d9ae;
    border-radius: 6px;
    overflow: hidden;
    .close {
      top:0px;
      right:14px;
      top: 14px;
      position: absolute;
      cursor: pointer;
    }
    .back{
      top:0px;
      left:14px;
      top: 14px;
      position: absolute;
      cursor: pointer;
    }
    .open-wrap{
      text-align: center;
      background: url('../../assets/images/redCoupon/red-packet-bg.png') no-repeat;
      background-size: 100% 100%;
      height: 100%;
      width: 100%;
      display: inline-block;
      .tiltle {
        margin-top: 50px;
        text-align: center;
        .avatar {
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        span{
          font-size: 17px;
          width: 135px;
          display: inline-block;
          width: 100%;
        }
      }
      h3 {
        font-size: 22px;
        margin-top: 38px;
        text-align: center;
        padding: 0px 14px;
        line-height: 1.4;
        height: 60px;
        overflow: hidden;
      }
      h4 {
        line-height: 24px
      }
      .over-tips {
        font-size: 14px;
        margin-top: 10px;
      }
      .active{
        position: relative;
        margin-top: 26px;
        width: 122px;
        height: 122px;
        display: inline-block;
        cursor: pointer;
        transition: all 1s;
        perspective: 600px;
        transform-style: preserve-3d;
        &.opens{
          transform: perspective(1000px)  rotateY(180deg);
        }
        .open{
          color: #fff;
          line-height: 102px;
          font-size: 22px;
          border-radius: 50%;
          position: absolute;
          top: 0px;
          height: 100%;
          width: 100%;
          left: 0px;
          box-sizing: border-box;
          border:10px solid #f7d9ae;
          background-color: #8a6d3b;
          /*z-index: 10;*/
          &.fan {
            transform: rotateY(180deg);
          }

        }
      }

      .red-packet-other {
        color: #f7d9ae;
        font-size: 14px;
        position: absolute;
        bottom: 37px;
        left: 50%;
        margin-left: -55px;
        text-decoration: none;
        /* display: none; */
      }
    }
    .open-success{
      text-align: center;
      background: url('../../assets/images/redCoupon/red-packet-title.png') no-repeat;
      background-size: 100% auto;
      background-color: #fff;
      height: 100%;
      width: 100%;
      overflow: hidden;
      display: inline-block;
      .tiltle{
        margin-top: 50px;
        text-align: center;
        .avatar {
          display: inline-block;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .nic-name{
          text-align: center;
          font-size: 17px;
          display: block;
          padding: 0px 26px;
        }
        .note{
          color: #9d9da1;
          font-size: 13px;
          height: 35px;
          display: block;
          padding: 0px 26px;
          overflow: hidden;
          margin-top: 5px;
        }
      }
      .content {
        color: #9d9da1;
        p {
          color: #4e4e4e;
          font-size: 38px;
          span {
            font-size: 18px;
          }
          margin: 20px 0px 5px;
        }
        h4 {
          margin: 0px;
          color: #9d9da1;
          font-size: 12px;
          font-weight: normal;
        }
      }
        ul{
          display: block;
          margin: 38px 26px 0;
          text-align: left;
          padding-top: 25px;
          padding-left: 0;
          font-size: 12px;
          color: #ababaf;
          border-top: 1px solid #f1f1f1;
          li {
            list-style-type: none;
            line-height: 1.6;
          }
        }
        .red-packet-other {
          color: #6093d2;
          font-size: 14px;
          position: absolute;
          bottom: 37px;
          left: 50%;
          margin-left: -55px;
          text-decoration: none;
          /* display: none; */
        }
      .catch-red{
        .head{
          padding-left: 20px;
          color: #9d9da1;
          background: #f7f7f7;
          height: 33px;
          font-size: 12px;
          text-align: left;
          line-height: 33px;
          border-top: 1px solid #efefef;
        }
        ul {
          margin: 0px;
          padding: 0px 24px;
          display: block;
          max-height: 280px;
          overflow-y: scroll;
          li {
            display: block;
            list-style-type: none;
            padding: 15px 0;
            color: #5d5d62;
            font-size: 14px;
            border-bottom: 1px solid #efefef;
            p{
              margin: 0px;
            }
            img {
              float: left;
              border-radius: 50%;
            }
            span{
              float: right;
            }
            .middle{
              margin-left: 45px;
              margin-right: 45px;
              .nowrap{
                max-width: 110px;
                font-size: 14px;
              }
              .time{
                color: #9d9da1;
                font-size: 13px;
              }
            }
          }
        }
      }
    }
  }
</style>
