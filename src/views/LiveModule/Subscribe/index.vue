<template>
  <div class="wrap">

    <section class="watchContainer">
      <div class="area">
        <div class="topInfo">
          <p class="">
            <b>{{title}}</b>
            <span class="tag">{{ webinarType | webinarTypeToText}}</span>
            <span class="right gray font-14">
              {{viewCount}} 次观看
            </span>
          </p>
          <p class="gray font-14">
            <span class="mrR">
              主办方：<a class="blue" href="https://www.baidu.com">{{hostName}}</a>
            </span>
            <span>
              时间：{{time}}
            </span>
            <span class="right iconBtn">
              <icon icon-class="saasyijianfankui" @click.native="$refs.feedBack.dialogVisible = true">反馈</icon>
              <el-popover
                placement="bottom-end"
                trigger="click">
                <div>
                  <share slot="content" url="http://t-webinar.e.vhall.com/658143687"></share>
                </div>
                <icon icon-class="saasfenxiang" slot="reference">分享直播</icon>
              </el-popover>

              <i class="focusBtn" @click="focusHandler">关注</i>
              <i class="focusCount">{{focusCount}}</i>
            </span>
          </p>
        </div>
        <div class="watchBox">
          <div class="leftWatch">
            <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="">
          </div>
          <div class="rightWatch">
            <template v-if="!isKeyLogin">
              <div class="title">距离直播开始还有</div>
              <div class="timeBox">
                <div>
                  <p class="mian">{{days}}</p>
                  <p class="sub">天</p>
                </div>
                <div>
                  <p class="mian">{{hours}}</p>
                  <p class="sub">小时</p>
                </div>
                <div>
                  <p class="mian">{{minutes}}</p>
                  <p class="sub">分钟</p>
                </div>
                <div>
                  <p class="mian">{{seconds}}</p>
                  <p class="sub">秒</p>
                </div>
              </div>
              <p class="title"><span class="red">{{subscribe_count}}</span>人预约</p>
              <div class="bottom">
                <el-button :disabled="btnVal === '已预约' ? true : false" type="primary" @click="subscribe">{{ btnVal }}</el-button>
                <p class="limit">白名单</p>
              </div>
            </template>
            <template v-else>
              <key-login></key-login>
            </template>
          </div>
        </div>
      </div>
    </section>

    <div :class="{area: true, product: productFlag}">
      <div class="flex1">
        <custoMenu></custoMenu>

        <el-tabs class="foot" v-model="activeName2" @tab-click="handleClick">
          <el-tab-pane label="活动推荐" name="activity">
            <ul class="activity" ref="activityUL">
              <li>
                <div class="imgBox">
                  <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="">
                </div>
                <p class="activityName"><span>最多可输入30个文字</span></p>
              </li>
              <li v-for=" i in  10" :key="i">
                <div class="imgBox">
                  <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="">
                </div>
                <p class="activityName"><span>最多可输入30个文字，单行居中对齐折行文字左对齐</span></p>
              </li>
            </ul>
            <span class="operaBtn left" @click="activityMove('left')">
              <i class="el-icon-arrow-left"></i>
            </span>
            <span class="operaBtn right" @click="activityMove('right')">
              <i class="el-icon-arrow-right"></i>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <products
        v-if="productFlag"
        @sellGoodsInfo="sellGoodsInfo"
        :goodsList="goodsList"
      ></products>
    </div>
    <feedBack ref="feedBack"></feedBack>
    <div class="shade" v-if="shadeShow"></div>
    <!-- 商品详情的弹窗 -->
    <goodsPop v-if="goodsPopShow" @closeGoodPop="closeGoodPop" :goodsAllInfo="goodInfo"></goodsPop>
    <!-- 报名表单 -->
    <signUpForm v-if="!isSignUp" @closeSignUp="isSignUp = true" @changeBtnVal="changeBtnVal"></signUpForm>
  </div>
</template>

<script>
import feedBack from './feedBack';
import share from '@/components/Share';
import custoMenu from '../components/customMenuView';
import goodsPop from '../Room/rankList/goodsPop';
import products from '../components/products';
import signUpForm from './signUpForm';
import keyLogin from '../components/keyLogin';
import { sessionOrLocal } from '@/utils/utils';
export default {
  components: {
    feedBack,
    share,
    custoMenu,
    goodsPop,
    products,
    signUpForm,
    keyLogin
  },
  data(){
    return {
      webinar_id: this.$route.params.id, // 活动ID
      isKeyLogin: this.$route.path.startsWith('/keylogin'),
      title: '预约',
      webinarType: 1,
      viewCount: 0,
      hostName: '测试同学',
      time: '2020-11-27 14:26',
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      focusCount: 10, // 关注人数
      subscribe_count: 0,
      activeName: 'desc',
      activeName2: 'activity',
      productFlag: true,
      goodsList: [],
      goodInfo: {},
      shadeShow: false,
      goodsPopShow: false,
      isSignUp: true,
      btnVal: '立即预约',
      status: 'subscribe', // 活动状态
      webinar: {} // 活动信息
    };
  },
  created(){
    this.getWatchInfo()
    this.getGoodsInfo();
  },
  methods:{
    getWatchInfo() {
      this.$fetch('watchInit', {
        webinar_id: this.webinar_id,
        visitor_id: sessionOrLocal.get('visitor_id') ? sessionOrLocal.get('visitor_id') : ''
      }).then(res => {
        sessionOrLocal.set('visitor_id', res.data.visitor_id);
        // ***************不确定的逻辑，注掉，不需要直接删除***start
        // // 判断去预约页还是去直播观看页
        // if (res.data.status === 'live') {
        //   // TODO：跳转到直播观看页
        // } else {
        //   // TODO：判断是否已经预约
        // }
        // this.status = res.data.status;
        // this.btnVal = this.status === 'subscribe' ? '立即预约' : '进入直播';
        // this.benVal = this.is_subscribe === 0 ? '立即预约' : '已预约';
        // this.webinar = res.data.webinar;
        // ***************不确定的逻辑，注掉，不需要直接删除***end
        setInterval(this.remainTimes(res.data.webinar.start_time), 1*1000);
      })
    },
    // startTime  YYYY-MM-DD HH:MM
    remainTimes(startTime){
      const limitTime = new Date(startTime).getTime();
      const now = new Date().getTime();
      const remin = parseInt((limitTime - now)/1000);
      const day_coefficient = 1*24*60*60; // 定义一天包含多少秒---系数
      const hours_coefficient = 60*60; // 定义一小时包含多少秒---系数
      const mintes_coefficient = 60; // 定义一分钟包含多少秒---系数
      const hour_reminder = remin % day_coefficient; // 剩余时间取余
      const minutes_reminder = hour_reminder % hours_coefficient;  // 剩余时间取余
      const seconds_reminder = minutes_reminder % mintes_coefficient;  // 剩余时间取余
      this.days = this.zeroPadding(parseInt(remin/day_coefficient)) < 1 ? '00' : this.zeroPadding(parseInt(remin/day_coefficient));
      this.hours = this.zeroPadding(parseInt(hour_reminder/hours_coefficient)) < 1 ? '00' : this.zeroPadding(parseInt(hour_reminder/hours_coefficient));
      this.minutes = this.zeroPadding(parseInt(minutes_reminder/mintes_coefficient)) < 1 ? '00' : this.zeroPadding(parseInt(minutes_reminder/mintes_coefficient));
      this.seconds = this.zeroPadding(seconds_reminder) < 1 ? '00' : this.zeroPadding(seconds_reminder);
      console.log;
    },
    zeroPadding(num){
      num = Number(num);
      if(isNaN(num)) return num;
      if(num >= 0 && num <10){
        return `0${num}`;
      }
      return num;
    },
    // 关注
    focusHandler(){
      this.$confirm('如果登陆了，则调用接口关注；若没登陆，则弹出登陆弹窗', '提示');
    },
    // 预约
    subscribe(){
      this.isSignUp = false;
    },
    handleClick(){

    },
    activityMove(direction){
      const el = this.$refs.activityUL;
      const offset = el.style.transform.match(/-?\d+/g);
      const width = el.offsetWidth;
      const originDis = offset ? Number(offset[0]) : 0;
      const clientWidth = el.parentElement.offsetWidth;
      let currentDistance = 0;
      if(direction == 'left'){
        currentDistance = originDis-100;
        Math.abs(currentDistance) > (width-clientWidth-20) && (currentDistance = 0-(width-clientWidth-20));
      }else{
        currentDistance = originDis+100;
        currentDistance > 0 && (currentDistance=0);
      }
      el.style.transform = `translateX(${currentDistance}px)`;
      console.log(offset);
    },
    // 点击商品获得详细的信息
    sellGoodsInfo(goodInfo) {
      this.goodInfo = goodInfo;
      // window.vhallReport.report('GOOD_RECOMMEND', {
      //   event: moment().format('YYYY-MM-DD HH:mm'),
      //   market_tools_id: this.goodInfo.goods_id,
      //   // 浏览
      //   market_tools_status: 0
      // });
      this.shadeShow = true;
      this.goodsPopShow = true;
    },
    // 商品推荐
    getGoodsInfo() {
      this.$fetch('goodsList', {
        // webinar_id: this.$route.params.il_id
        webinar_id: 171205460
      }).then(res => {
        if (res.code == 200) {
          this.productFlag = true;
          this.goodsList = res.data.goods_list;
          this.goodsList
            && this.goodsList.length
            && (this.goodInfo = res.data.goods_list[0]);

          this.goodsList.forEach(good => {
            const imgUrl = good.img_list.find(img => img.is_cover === '1');
            if (imgUrl) {
              good.goodImage = `
                ${this.imageDomin}/
                ${
                  good.img_list.find(img => img.is_cover === '1').img_url
                }
              `;
            }
          });
        }
      });
    },
    // 关闭详情弹窗事件
    closeGoodPop() {
      this.shadeShow = false;
      this.goodsPopShow = false;
    },
    // 改变按钮显示内容
    changeBtnVal(newValue) {
      this.btnVal = newValue
    }
  },
  filters: {
    webinarTypeToText(val){
      let str = val;
      switch (val) {
        case 1:
          str = "预告";

          break;

        default:
          break;
      }
      return str;
    }
  },
};
</script>

<style lang="less" scoped>
  .wrap{
    // margin: -1rem;
    .shade {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background: #2d2d2d;
      opacity: 0.5;
      z-index: 3;
    }
  }
  .area {
    width: 1220px;
    margin: 0 auto;
    @media screen and (min-width: 1367px) {
      width: 1480px;
    }
  }
  .watchContainer{
    padding: 10px 0 20px;
    padding-top: 36px;
    background-color: #e8e9eb;
    border-bottom: 1px solid #c9c9c9;
  }
  .iconBtn{
    .iconContainer{
      font-size: 14px;
      cursor: pointer;
      /deep/ .svg-icon{
        font-size: 16px;
        margin-right: 4px;
        vertical-align: middle;
      }
      &:hover{
        /deep/ .svg-icon{
          color: #333;
        }
      }
      margin-right: 10px;
    }
    .focusBtn{
      display: inline-block;
      padding: 3px 12px;
      background-color: #ff3333;
      color: #fff;
      text-align: center;
      border-radius: 3px 0 0 3px;
      font-style: normal;
      line-height: normal;
      cursor: pointer;
    }
    .focusCount{
      color: #ff3333;
      background-color: #fbdcdc;
      border-radius: 0 3px 3px 0;
      display: inline-block;
      padding: 3px 12px;
      font-style: normal;
      line-height: normal;
    }
  }
  .gray{
    color: #7c8287;
    font-size: 14px;
  }
  .mrR{
    margin-right: 20px;
  }
  .font-14{
    font-size: 14px;
  }
  .blue{
    color: #1087dc;
  }
  .red{
    color: #e63c37;
  }
  .topInfo{
    p{
      line-height: 32px;
    }
    b{
      font-size: 24px;
      font-weight: normal;
    }
    .tag{
      color: #fff;
      display: inline-block;
      background-color: #1087dc;
      font-size: 14px;
      padding: 0 8px;
      border-radius: 3px;
      margin: 8px 0 0 15px;
      line-height: normal;
    }
    .right{
      float: right;
    }
  }
  .watchBox{
    margin-top: 40px;
    display: flex;
    min-height: 500px;
    .leftWatch{
      flex: 1;
      line-height: 0;
      img{
        width: 100%;
      }
    }
    .rightWatch{
      width: 300px;
      background: #242424;
      color: #fff;
      position: relative;
      .title{
        font-size: 20px;
        text-align: center;
        margin: 40px 0;
      }
      .timeBox{
        display: flex;
        justify-content: space-around;
        >div{
          width: 64px;
          height: 90px;
          background: #1b1b1b;
          border: 2px solid #2d2d2d;
          border-radius: 4px;
          text-align: center;
        }
        .mian{
          font-size: 33px;
          margin: 10px 0;
          margin-bottom: 4px;
        }
        .sub{
          font-size: 14px;
          color: #7c8287;
        }
      }
    }
  }
  .bottom{
    position: absolute;
    bottom: 40px;
    width: 100%;
    padding: 0 20px;
    .el-button{
      width: 100%;
    }
    .limit{
      margin-top: 10px;
      color: #7c8287;
      text-align: center;
      font-size: 14px;
    }
  }
  .foot{
    margin-top: 20px;
    border: 1px solid #d2d2d2;
    /deep/ .el-tabs__content{
      padding: 20px;
      font-size: 14px;
      color: #666;
    }
  }
  .activity{
    width: max-content;
    overflow: hidden;
    transition: all .15s linear;
    // &::after{
    //   content: '';
    //   display: block;

    // }
    li{
      float: left;
      width: 260px;
      margin-right: 20px;
      .imgBox{
        width: 100%;
        height: 146px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .activityName{
        font-size: 14px;
        color: #333333;
        text-align: center;
        margin-top: 6px;
        height: 40px;
        line-height: 20px;
        span{
          display: inline-block;
          text-align: left;
        }
      }
    }
  }
  .operaBtn{
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    background: #FFFFFF;
    border-radius: 50%;
    position: absolute;
    top: 60px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 18px;
    transition: all .15s linear;
    &:hover{
      background: #7DB7F0;
      color: #fff;
    }
    &.left{
      left: -24px;
      text-align: right;
      padding-right: 10px;
    }
    &.right{
      right: -24px;
      text-indent: 4px;
    }
  }
  .fixWidth{
    padding: 20px;
    border: 1px solid #D2D2D2;
    display: inline-block;
    width: 300px;
    box-sizing: border-box;
    margin-top: 20px;
    margin-left: 20px;
    vertical-align: top;
    .productImg{
      width: 100%;
      height: 254px;
      cursor: pointer;
      img{
        height: 100%;
        width: 100%;
      }
    }
    .title{
      font-size: 19px;
      color: #333;
      font-weight: bold;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 40px;
    }
    .price{
      span:nth-child(1){
        font-size: 24px;
        color: #FC5659;
      }
      span:nth-child(2){
        font-size: 18px;
        color:#D2D2D2;
        i{
          text-decoration: line-through;
          font-style: normal;
        }
      }
    }
    .desc{
      font-size: 14px;
      color: #666;
      margin-top: 20px;
    }
    .fullBut{
      width: 100%;
      margin-top: 20px;
    }
    .textBtn{
      width: 100%;
      color: #FC5659;
      text-align: center;
      border: 0 none;
    }
  }
  .product{
    .flex1{
      display: inline-block;
      width: calc(84% - 78px);
    }
  }
</style>
