<template>
  <div class="code-login-wrap">
    <div class="title">
      <p class="subject">标题：{{baseObj.subject}}<span :class="['type', activeClass]"> {{type(baseObj.webinar_state || 1)}}</span></p>
      <p>
        <i class="iconfont iconzhubanfang1-copy"></i> 主办方：<span>{{baseObj.user_name}}</span>
        <i class="iconfont iconshijian"></i> 时间：{{baseObj.start_time}}</p>
    </div>
    <div class="content clearFix">
      <div class="img-box fl">
        <img :src="baseObj.img_url ? baseObj.img_url : defaultImg" alt="">
      </div>
      <div class="keyLogin fr">
        <p class="keyIcon">请输入参会口令</p>
        <p v-if="!ishost" class="inputItem">
          <input type="text" placeholder="姓名" maxlength="30" v-model="name">
        </p>
        <p class="inputItem">
          <input type="text" placeholder="口令 (6位数字)" maxlength="10" v-model="keyCode">
        </p>
        <em class="errorTips">{{ warnningVal }}</em>
        <div class="enterBtn" @click="entryLive">进入直播</div>
      </div>
    </div>
    <!-- <div style="width:100%; baclground:white"> -->
      <div class="foot">
        <p class="text">
          <span>活动简介</span>
        </p>
        <div class="foot-con">
          <p v-html="baseObj.introduction"></p>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { sessionOrLocal } from '@/utils/utils';
import { liveTag } from '@/utils/filter';
  export default {
    data() {
      return {
        ishost: this.$route.path.startsWith('/keylogin-host'),
        name: '',
        keyCode: '',
        warnningVal: '',
        roleName: this.$route.params.role_name,
        baseObj:{},
        activeClass: 'status-preview',
        defaultImg: require('./../components/image/video_default_nologo.png')
      }
    },
    created() {
      this.getUserMess()
    },
    computed:{
      type(){
        return function(val){
          // 2 预告 1 直播 3 结束 5 回放 4 点播
          if(val == 1){
            this.activeClass = 'status-live'
            return '直播'
          }else if(val == 2){
            this.activeClass = 'status-preview'
            return '预约'
          }else if(val == 3){
            this.activeClass = 'status-end'
            return '结束'
          }else{
             this.activeClass = 'status-end'
            return '回放'
          }
        }
      }
    },
    methods: {
      getUserMess(){
        console.warn(this.$route);
        // webinar/info调整-正常的信息展示使用 0
        this.$fetch('getWebinarInfo', {
          webinar_id: this.$route.params.id,
          is_no_check:1,
          is_rehearsal: 0
        }, {
          token: ''
        }).then(res=>{
          if(res.code == 200){
            this.baseObj = res.data
            console.warn(res.data, '获取活动的基础信息');
          } else {
            this.$message({
              message: res.msg || `获取活动的基础信息失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          }
        }).catch(res => {
          this.$message({
            message: res.msg || `获取活动的基础信息失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        })
      },
      entryLive() {
        console.log(this.$route.params)
        if (!this.name && !this.ishost) {
          this.warnningVal = '参会昵称不能为空'
        } else if (!this.keyCode) {
          this.warnningVal = '直播口令不能为空'
        } else {
          let role = this.roleName == 1 ? 1 : (this.roleName == 4 ? 2 : 3)
          let _data ={
            webinar_id: this.$route.params.id,
            type: role, // 1主持 2嘉宾 3助理
            password: this.keyCode,
            refer: '',
            nickname: this.name,
            visitor_id: sessionOrLocal.get('visitor_id') ? sessionOrLocal.get('visitor_id') : ''
          }
          this.$fetch('roleLogin', _data, {
            token: ''
          }).then(res => {
            if (res.code == 200) {
              sessionOrLocal.set('interact_token', res.data.live_token)
              sessionOrLocal.set('live_token', res.data.live_token, 'localStorage');
              sessionOrLocal.set('visitor_id', res.data.visitor_id)
              setTimeout(() => {
                if(role == 3){
                  this.$router.push({name: 'LiveRoom', params: {il_id: this.$route.params.id}})
                }else{
                  this.$router.push({path: `/chooseWay/${this.$route.params.id}/${role}?type=code`})
                }
                // this.$router.push({name: 'LiveRoom', params: {il_id: this.$route.params.id}})
              }, 300)
            } else {
              this.$message({
                message: res.msg || `登录失败`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            }
          }).catch(res => {
            this.$message({
              message: res.msg || `登录失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.code-login-wrap{
  width:100%;
  padding-bottom: 100px;
  margin: 0 auto;
  .title{
    width: 75%;
    min-width: 1100px;
    margin: 0 auto;
    color: #7c8287;
    font-size: 14px;
    line-height: 25px;
    .subject{
      color: #333333;
      font-size: 24px;
      line-height: 32px;
      margin: 40px 0 20px;
      .type{
        color: #fff;
        display: inline-block;
        background-color: #1087dc;
        font-size: 14px;
        padding: 0 8px;
        border-radius: 3px;
        margin: 8px 0 0 20px;
        height: 20px;
        line-height: 20px;
      }
      .status-live{
        background-color: #ff3333
      }
      .status-preview{
        background-color: #1087dc;
      }
      .status-end{
        background-color: #2ab804
      }
    }
    p{
      &:nth-child(2){
        margin-bottom: 30px;
        line-height: 26px;
        i{
          vertical-align: middle;
        }
        span{
          color: #1087dc;
          margin-right: 20px;
        }
      }
    }
  }
  .content{
    width: 75%;
    min-width: 1100px;
    height: 670px;
    margin: 0 auto 40px;
    .img-box{
      display: inline-block;
      width: calc(100% - 300px);
      height: 100%;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .keyLogin {
      display: inline-block;
      width: 300px;
      height: 100%;
      background: url(./../components/image/login_left_bg.png);
      position: relative;
      padding: 189px 16px 39px;
      .keyIcon {
        position: absolute;
        top: 90px;
        left: 0;
        width: 100%;
        text-align: center;
        padding-top: 53px;
        line-height: 36px;
        background: url(./../components/image/password-login-icon.png) no-repeat top center/53px 53px;
        font-size: 14px;
        color: #333333;
      }
      .inputItem {
        margin: 0 auto;
        text-align: center;
        margin-bottom: 12px;
        input {
          outline: 0 none !important;
          padding: 0 10px;
          font-size: 12px;
          width: 238px;
          height: 40px;
          border-radius: 2px;
          border-color: #d2d2d2;
          background-color: #fff;
          border-width: 1px;
          border-style: solid;
          &:hover {
            border-color: #999;
          }
        }
      }
      .errorTips {
        color: #fc5659;
        font-size: 12px;
        position: absolute;
        font-style: normal;
        padding: 0 20px;
        left: 30px;
        background: url(./../components/image/exclamation.png) no-repeat 4px 1px;
      }
      .enterBtn {
        width: 250px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 2px;
        background-color: #fc5659;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        margin: 60px auto 0px;
        &:hover {
          background: #ff3333;
        }
      }
    }
  }
  .foot{
    .text{
      font-size: 18px;
      border-bottom: 1px solid #e1e1e1;
      height: 40px;
      line-height: 38px;
      span{
        border-bottom: 2px solid #fc5659;
        display: inline-block;
        padding: 0 10px;
        // width: ;
      }
    }
    &-con{
      padding: 20px 15px;
      margin-bottom: 40px;
    }
    border: 1px solid #d2d2d2;
    width: 75%;
    min-width: 1100px;
    margin: 0 auto;
  }
}

</style>
