<template>
  <div class="detailBox" v-loading="loading" element-loading-text="数据获取中" v-if="!loading">
    <pageTitle title="活动详情"></pageTitle>
    <!--  <pageTitle :title='titleText(liveDetailInfo.webinar_state) + "详情"'></pageTitle> -->
    <el-row :gutter="16" class="basicInfo">
      <el-col :span="18" :lg='18' :md="24" :sm='24' :xs="24" :class="liveDetailInfo.webinar_state===4 ? 'active' : ''">
        <div class="inner">
          <div class="thumb">
            <img :src="liveDetailInfo.img_url" alt="">
            <span class="liveTag"><label class="live-status" v-if="liveDetailInfo.webinar_state == 1"><img src="../../common/images/live.gif" alt=""></label>
              {{ liveDetailInfo | liveTag }}
            </span>
            <span class="hot">
              <i class="iconfont-v3 saasicon_redu"></i>
              {{ liveDetailInfo.pv | unitCovert }}
            </span>
          </div>

          <div class="info">
            <div class="hidden_hover">
            <p class="mainColor font-20">
              {{ liveDetailInfo.subject }}
            </p>
            <p class="title_hover">{{ liveDetailInfo.subject }}</p>
            </div>
            <p class="subColor" v-if="liveDetailInfo.webinar_state != 4">直播时间：{{ liveDetailInfo.start_time }}</p>
            <p class="subDuration" v-else>点播时长：{{ liveDetailInfo.duration }}</p>
            <p class="subColor">观看限制：
              <span class="tag">{{ liveDetailInfo.verify | limitTag }}</span>
              <span class="tag" v-if="isForm">报名表单</span>
            </p>
            <div class="action-look">
              <el-button round size="small" v-if="[3, 5].includes(liveDetailInfo.webinar_state)" style="margin-right:8px;" @click="resetResume(liveDetailInfo.webinar_state)">恢复预告</el-button>
              <el-popover
                placement="bottom"
                trigger="hover"
                style="margin-right:8px"
              >
                <div class="invitation-code">
                  <p>活动观看页</p>
                  <img :src="h5WapLink" alt="" v-if="h5WapLink">
                  <p><el-button round type="primary" size="medium" @click="downErCode">下载二维码</el-button></p>
                </div>
                <el-button round size="small" slot="reference">扫码</el-button>
              </el-popover>
              <el-popover
                placement="bottom"
                trigger="hover"
              >
                <div class="invitation-code urlCopy">
                  <p>观看页 <el-input v-model="link" style="width: 320px"></el-input></p>
                  <div class="copy-item">
                    <el-button round size="small" type="primary" @click="doCopy">复制</el-button>
                    <el-button round size="small" @click="openLink">打开页面</el-button>
                  </div>
                </div>
                <el-button round size="small" slot="reference">查看</el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :lg='6' :md="24" :sm='24' :xs="24" v-if="liveDetailInfo.webinar_state !== 4" class="rightbox" style="padding-right:4px">
        <div class="inner liveTime" v-if="!outLiveTime">
          <p class="subColor">{{ liveDetailInfo.webinar_state | limitText}}</p>
          <p class="mainColor" v-if="liveDetailInfo.webinar_state === 2">
            <span>{{ time.day }}</span>
            <i>天</i>
            <span>{{ time.hours }}</span>
            <i>时</i>
            <span>{{ time.minute }}</span>
            <i>分</i>
            <span>{{ time.second }}</span>
            <i>秒</i>
          </p>
          <p v-else><span>{{ liveDetailInfo.webinar_state | liveText }}</span></p>
          <el-button round type="primary" @click="toRoom" :disabled="isAnginOpen">发起直播</el-button>
        </div>
        <div class="inner liveTime" v-if="outLiveTime && liveDetailInfo.webinar_state == 2">
          <p class="subColor">直播即将开始</p>
          <p><span>观众等待中</span></p>
          <el-button round type="primary" @click="toRoom">发起直播</el-button>
        </div>
      </el-col>
    </el-row>
    <item-card :type='liveDetailInfo.webinar_state' :webinarType="liveDetailInfo.webinar_type"  :isTrue="isTrue" :perssionInfo="perssionInfo" :childPremission="childPremission" @blockHandler="blockHandler" v-if="isShow"></item-card>
    <begin-play :webinarType="liveDetailInfo.webinar_type" :webinarId="$route.params.str" v-if="liveDetailInfo.webinar_state!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import beginPlay from '@/components/beginBtn';
import ItemCard from '@/components/ItemCard/index.vue';
import Env from "@/api/env";
import { formateDates } from "@/utils/general.js"
import { sessionOrLocal } from '@/utils/utils';
export default {
  components: {
    PageTitle,
    ItemCard,
    beginPlay
  },
  data(){
    return {
      msg: '',
      perssionInfo: {},
      isTrue: true,
      isShow: false,
      loading: true,
      isForm: false,
      isExport: false,
      isAnginOpen: false,
      outLiveTime: false,
      liveDetailInfo: {
        webinar_state: 0,
        webinar_type: 0
      },
      link: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      h5WapLink: `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      time: {
        day: 0,
        hours: 0,
        minute: 0,
        second: 0
      }
    };
  },
  computed: {
    titleText(){
      return function(val){
        let _text = '直播'
        val == 5 ? _text = '回放' : val == 4 ? _text = '点播' : _text = '直播'
        return _text
      }
    },
    childPremission: function(){
      return sessionOrLocal.get('SAAS_V3_SON_PS') ? JSON.parse(sessionOrLocal.get('SAAS_V3_SON_PS')) : {};
    }
  },
  created(){
    this.getLiveDetail(this.$route.params.str);
    this.getPermission(this.$route.params.str);
  },
  mounted() {
    console.log(this.$route.meta.title, '1111111111111111');
  },
  methods: {
    // 字符截取显示...兼容ie，用js
    fontNumber (date) {
      const length = date.length
      if (length > 35) {
          var str = ''
          str = date.substring(0, 35) + '...'
          return str
        } else {
          return date
        }
    },
    getPermission(id) {
      let userId = JSON.parse(sessionOrLocal.get('userId'));
      // 活动权限
      this.$fetch('planFunctionGet', {webinar_id: id, webinar_user_id: userId, scene_id: 1}).then(res => {
      if(res.code == 200) {
        let arr = ['component_1','component_2','component_3','component_4','component_5','component_6','component_7','component_8','component_9'];
        if(res.data.permissions) {
          sessionOrLocal.set('WEBINAR_PES', res.data.permissions, 'localStorage');
          this.perssionInfo = JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage'));
          this.isShow = true;
          this.isTrue = arr.some(item => {
            // eslint-disable-next-line no-prototype-builtins
            return this.perssionInfo.hasOwnProperty(item)
          })
        } else {
          sessionOrLocal.removeItem('WEBINAR_PES');
        }
      }
    }).catch(e => {
      console.log(e);
      sessionOrLocal.removeItem('SAAS_VS_PES');
    });
    },
    // 获取基本信息
    getLiveDetail(id) {
      this.loading = true;
      this.$fetch('getWebinarInfo', {webinar_id: id}).then(res=>{
        this.liveDetailInfo = res.data;
        sessionOrLocal.set('webinarState', this.liveDetailInfo.webinar_state);
        sessionOrLocal.set('webinarType', this.liveDetailInfo.webinar_type);
        if (res.data.webinar_state == 4) {
          this.$route.meta.title = '点播详情';
        } else {
          this.$route.meta.title = '直播详情';
        }
        this.getFormInfo(id);
        if (res.data.webinar_state == 1) {
          this.getOpenLive();
        }
        if (res.data.webinar_state == 2) {
          let date = new Date();
          let nowTime = date.setTime(date.getTime());
          this.downTime(formateDates(nowTime).replace(/-/g,'/'), res.data.start_time.replace(/-/g,'/'));
        }
      }).catch(res=>{
        this.$message({
          message: res.msg || "获取信息失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        console.log(res);
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 获取是否有报名表单
    getFormInfo(id) {
      this.$fetch('regFromGet', {webinar_id: id}).then(res => {
        if (res.code == 200 && res.data.enable_status == 1) {
          this.isForm = true;
        } else {
          this.isForm = false;
        }
      })
    },
    // 下载二维码
    downErCode() {
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = `code${new Date().getTime()}`; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = this.h5WapLink;
    },
    // 复制
    doCopy () {
      this.$copyText(this.link).then(e => {
        this.$message({
          message: `复制成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(res =>{
        this.$message({
          message: res.msg || `复制失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 打开页面
    openLink() {
      window.open(this.link, '_blank');
    },
    //恢复预告
    resetResume(status) {
      if (status === 5) {
        this.$confirm('恢复为预告后，回放将不能观看', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.reSumeNotice();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.reSumeNotice();
      }
    },
    reSumeNotice() {
      this.$fetch('liveEdit', {webinar_id:this.$route.params.str, type: 2}).then(res=>{
        this.$message({
          message: `恢复预告成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getLiveDetail(this.$route.params.str);
      }).catch(res=>{
        this.$message({
          message: res.msg || "恢复预告失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        console.log(res);
      });
    },
    // 判断是否有起直播的权限
    getOpenLive() {
      this.$fetch('checkLive', this.$params({
        webinar_id: this.$route.params.str
      })).then((res) => {
        if(res && res.code === 200) {
          this.isAnginOpen = false;
        } else {
          this.isAnginOpen = true;
        }
      }).catch(e => {
        this.isAnginOpen = true;
      });
    },
    blockHandler(item){
      if(item.path){
        if (item.path === '/live/edit') {
          if (this.liveDetailInfo.webinar_state == 4) {
            this.$router.push({path: `/live/vodEdit/${this.$route.params.str}`, query: {type: 2 }});
          } else {
            this.$router.push({path: `${item.path}/${this.$route.params.str}`, query: {type: 2 }});
          }
        } else if (item.path === '/live/question') {
          // 问卷
          this.$router.push({path: `${item.path}/${this.$route.params.str}`, query: {roomId: this.liveDetailInfo.vss_room_id }});
        } else if(item.path === `/live/prizeSet/${this.$route.params.str}` || item.path === `/live/gift/${this.$route.params.str}`) {
          // 奖品
          this.$router.push({path: item.path, query: {roomId:this.liveDetailInfo.vss_room_id }});
        } else if (item.path === `/live/interactionData/${this.$route.params.str}`) {
          // 互动统计
          this.$router.push({path: item.path, query: {roomId:this.liveDetailInfo.vss_room_id }});
        } else if (item.path == `/live/embedCard/${this.$route.params.str}`) {
          this.$router.push({path: item.path, query: {type:this.liveDetailInfo.webinar_type }});
        } else {
          this.$router.push({path: item.path});
        }
      }else{
        console.log(item);
      }
    },
    getAppersInfo(userId) {
      this.$fetch('getVersionInfo', { user_id: userId}).then(res => {
        if (res.data.arrears.total_fee < 0) {
          this.$confirm(`尊敬的微吼会员，您的${res.data.type == 1 ? '流量' : '并发套餐'}已用尽，请充值`, '提示', {
            confirmButtonText: '去充值',
            cancelButtonText: '知道了',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel',
          }).then(() => {
            this.$router.push({path:'/finance/info'});
          }).catch(() => {});
        } else {
          this.toLive();
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    toLive() {
      if (this.liveDetailInfo.webinar_type == 1) {
        let href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.$route.params.str}`;
        window.open(href, '_blank');
      } else {
        const { href } = this.$router.resolve({path: `/live/chooseWay/${this.$route.params.str}/1?type=ctrl`});
        window.open(href, '_blank');
      }
    },
    toRoom(){
      // 跳转至发起页面
      let userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getAppersInfo(userId);
      // let status = await
      // if (status) {
      //   this.$confirm('尊敬的微吼会员，您的流量已用尽，请充值', '提示', {
      //     confirmButtonText: '去充值',
      //     cancelButtonText: '知道了',
      //     customClass: 'zdy-message-box',
      //     lockScroll: false,
      //     cancelButtonClass: 'zdy-confirm-cancel',
      //   }).then(() => {
      //     this.$router.push({path:'/finance/info'});
      //   }).catch(() => {});
      // } else {
      //   if (this.liveDetailInfo.webinar_type == 1) {
      //     let href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.$route.params.str}`;
      //     window.open(href, '_blank');
      //   } else {
      //     const { href } = this.$router.resolve({path: `/live/chooseWay/${this.$route.params.str}/1?type=ctrl`});
      //     window.open(href, '_blank');
      //   }
      // }
      // const { href } = this.$router.resolve({path: `/lives/room/${this.$route.params.str}`});

    },
    downTime(targetStartDate, targetEndDate) {
      let targetStart = new Date(targetStartDate);
      let targetEnd = new Date(targetEndDate);
      if (targetEnd.getTime() - targetStart.getTime() < 0) {
        this.outLiveTime = true;
        return false;
      } else {
        let diff = targetEnd.getTime() - targetStart.getTime();
        targetStart.setTime(targetStart.getTime() + 1000);
        let day = Math.floor(diff / (24 * 3600 * 1000));
        this.time.day = day > 9 ? day : `0${day}`;
        let limit1 = diff % (24 * 3600 * 1000);
        let hours = Math.floor(limit1 / (3600 * 1000));
        this.time.hours = hours > 9 ? hours : `0${hours}`;
        let limit2 = limit1 % (3600 * 1000);
        let minute = Math.floor(limit2 / (60 * 1000));
        this.time.minute = minute > 9 ? minute : `0${minute}`;

        let limit3 = limit2 % (60 * 1000);
        let second = Math.floor(limit3 / 1000);
        this.time.second = second > 9 ? second : `0${second}`;
        // console.log(diff, '????????????????????')
        if (diff) {
          let diffSetTime = window.setTimeout(() => {
            this.downTime(targetStart, targetEnd);
            window.clearTimeout(diffSetTime);
          }, 1000);
        } else {
          return `0天0时0分0秒`;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.basicInfo{
  // display: flex;
  // min-width: 756px;
  // flex-wrap: wrap;
  // justify-content: space-between;
  .rightbox {
    height: 223px;
  }
  .active{
    width: 100%;
  }
  .inner{
    background: #fff;
    width: 100%;
    height: 100%;
    padding: 24px;
    display: flex;
    border-radius: 4px;
    .info{
      flex: 1;
      // overflow: auto;
      // height: 175px;
      p{
        font-size: 14px;
        line-height: 28px;
        &:nth-child(1){
          margin-bottom: 16px;
          // height: 56px;
          font-size: 20px;
          // display: table-cell;
          vertical-align: middle;
          cursor: pointer;
        }
        &:last-child{
          margin-bottom: 20px;
        }
        // &:nth-child(2){
        //   margin-bottom: 10px;
        //   line-height: 20px;
        // }
        // &:nth-child(3){
        //   // margin-bottom: 20px;
        //   line-height: 20px;
        // }
      }

      .hidden_hover:hover .title_hover{
        display: block;
      }
      .title_hover{
        position: absolute;
        left: 370px;
        top: 50px;
        border-radius: 4px;
        max-width: 368px;
        line-height: 17px;
        background: rgba(#1A1A1A, 0.85);
        font-size: 12px;
        color: #fff;
        padding: 8px 10px;
        z-index: 100;
        display: none;
      }
    }
    .thumb{
      width: 312px;
      height: 175px;
      position: relative;
      margin-right: 25px;
      background: #1A1A1A;
      border-radius: 4px;
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        border-radius: 4px;
      }
      .liveTag{
        background: rgba(0,0,0, .7);
        // background: rgba(247, 245, 245, 0.7);
        color: #fff;
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 20px;
        position: absolute;
        top: 12px;
        left: 12px;
        .live-status{
          img{
            margin-right:4px;
            width: 8px;
            height: 8px;
          }
        }
      }
      .hot{
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: #fff;
        font-size: 14px;
      }
    }
    .tag{
      border-radius: 20px;
      background: #F2F2F2;
      font-size: 12px;
      padding: 2px 8px;
      margin-right: 8px;
    }
  }
}
//
.invitation-code{
  text-align: center;
  padding: 2px 40px 10px;
  display: block!important;
  left: 50%;
  p{
    line-height: 40px;
  }
  img{
    margin-bottom: 10px;
    width: 132px;
    height: 132px;
  }
  .copy-item{
    text-align: right;
    padding: 24px 0 10px 0;
  }
}
.urlCopy{
  padding: 2px 15px;
  p{
    margin-top: 20px;
    &:nth-child(2){
      padding: 4px;
      font-size: 16px;
      ::v-deep.el-button{
        font-size: 14px;
        line-height: 24px;
        padding: 2px 20px;
        margin-right: 20px;
      }
    }
  }
}

.mainColor{
  color: #1A1A1A;
}
.subColor, .subDuration{
  color: #666666;
}
.action-look{
  margin-top: 10px;
}
.font-20{
  font-size: @20;
  width: 100%;
  position: relative;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: relative;
  // &:hover .info .title_hover {
  //   display: block;
  // }
  // max-width: 500px;
  // height: 56px;
  // overflow: hidden;
  // text-overflow:ellipsis;
  // white-space: nowrap;
}
.liveTime{
  font-size: 14px;
  justify-content: center;
  flex-direction: column;
  i{
    font-style: normal;
  }
  p{
    text-align: center;
    &:nth-child(1){
      margin-bottom: 10px;
    }
    &:nth-child(2){
      span{
        font-size: 22px;
        font-weight: bold;
      }
      i{
        margin: 0 2px;
      }
      margin-bottom: 18px;
    }
  }
  .el-button{
    width: 160px;
    margin: 0 auto;
  }
}
/*.detailBox {
  margin: auto;
  width: 1020px;
}
@media screen and (min-width: 1920px) {
  .detailBox {
    // padding: 0px 140px;
    margin: auto;
    width: 1374px;
  }
}*/
</style>
