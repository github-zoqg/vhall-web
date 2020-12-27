<template>
  <div class="preview-wrap">
    <!-- 0 无验证，1 密码，2 白名单，3 付费活动, 4 F码, 5 报名表单  -->
    <template v-if=" base.verify == 2|| base.verify == 3  || base.verify == 4  || base.verify == 5">
      <img class="cover" src="//cnstatic01.e.vhall.com/static/img/inituser_bg.png" alt="">
      <img class="cover-pos" src="https://cnstatic01.e.vhall.com/static/img/inituser_verify.gif" alt="">
    </template>
    <template v-else>
      <img class="cover" src="//cnstatic01.e.vhall.com/static/img/webinar.png" alt="">
      <div class="time-box">
        <h4 class="title">距离直播开始还有</h4>
        <ul class="time" v-if="showTime">
          <li>
            <span>{{ time.dd }}</span>
            天
          </li>
          <li>
            <span>{{ time.HH }}</span>
            时
          </li>
          <li>
            <span>{{ time.mm }}</span>
            分
          </li>
          <li>
            <span>{{ time.ss }}</span>
            秒
          </li>

        </ul>
      </div>
      <div :class="['footer-ent', {'active': base.webinar_state == 1}]">
        <el-button @click="submit"> {{submitText}}</el-button>
        <p>密码活动</p>
      </div>
      <!--观看限制验证-->
      <el-dialog
        :title="tipTitle"
        width="400px"
        :visible.sync="showModile"
        :close-on-click-modal="true"
        :before-close="handleCancelDelete"
      >
        <span style="margin-bottom: 40px;display: block;">{{tipContent}}</span>
        <el-input v-model="authCheckValue" :placeholder="dialogPlaceholder"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancelDelete">取 消</el-button>
          <el-button type="primary" @click="fillLimitSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import {difSeconds} from '@/utils/general'
export default {
  data() {
    return {
      time: {
        dd: 0,
        HH: 0,
        mm: 0,
        ss: 0
      },
      base:{},
      submitText: '进入活动',
      tipTitle: '密码验证',
      showModile: false,
      dialogPlaceholder: '请输入密码',
      tipContent: '当前活动需要密码',
      authCheckValue: ''
    }
  },
  computed: {
    showTime(){
      return this.time.dd!=0&&this.time.HH!=0&&this.time.mm!=0&&this.time.ss!=0
    },
  },
  created(){
    this.getLiveDetail(this.$route.params.id)
  },
  methods: {
    handleCancelDelete(){
      this.showModile = false
      this.authCheckValue = ''
    },
    submit(){
      if(this.base.webinar_state == 1 &&  base.verify == 1){
        this.showModile = true
      }else{
        this.$route.push({name: 'embedWatch', params: {il_id: this.$route.params.id}})
      }
    },
    fillLimitSubmit () {
      let _data = {
        type: 1,
        verify_value: this.authCheckValue,
        webinar_id: this.$route.params.id
      }
      console.warn(_data, 888);
      this.$fetch('watchAuth', _data).then(res => {
        this.showModile = false
        this.authCheckValue = ''
        if(res.code!=200) return this.$message.warning(res.msg)
        this.$route.push({name: 'embedWatch', params: {il_id: this.$route.params.id}})
      })
    },
    // 获取基本信息
    getLiveDetail(id) {
      this.$fetch('getWebinarInfo', {webinar_id: id}).then(res=>{
        if(res.code != 200) return this.$message.warning(res.msg)
        this.base = res.data
        let _result = difSeconds(this.$moment(), res.data.start_time)
        if(this.base.webinar_state == 2){
          this.submitText = '直播未开始'
        }else if(this.base.webinar_state == 1){
          this.submitText = '进入活动'
        }else if(this.base.webinar_state == 3){
          this.submitText = '直播已结束'
        }
        if(typeof(_result) != 'string'){
          this.timeSet = setInterval(() => {
            this.time.dd = difSeconds(this.$moment(), res.data.start_time)[0]
            this.time.HH = difSeconds(this.$moment(), res.data.start_time)[1]
            this.time.mm = difSeconds(this.$moment(), res.data.start_time)[2]
            this.time.ss = difSeconds(this.$moment(), res.data.start_time)[3]
            if(typeof(difSeconds(this.$moment(), res.data.start_time)) == 'string' ){
              clearInterval(this.timeSet)
            }
          }, 1000);
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.preview-wrap{
  width: 100%;
  height: 100%;
  position: relative;
  .cover{
    display: block;
    width: 100%;
    height: 100%;
  }
  .cover-pos{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    left: 50%;
  }
  .time-box{
    position: absolute;
    top: 50%;
    text-align: center;
    transform: translateX(-50%) translateY(-50%);
    left: 50%;
    .title{
      font-size: 20px;
      color: white;
      margin-bottom: 60px;
    }
    .time{
      display: flex;
      color: white;
      flex: 1;
      li{
        display: inline-block;
        width: 70px;
        height: 90px;
        text-align: center;
        background: rgba(0,0,0,0.4);
        margin: 0 5px;
        padding: 10px 0;
        border-radius: 3px;
        border: 2px solid transparent;
        font-size: 20px;
        span{
          display: block;
          font-size: 33px;
          width: 100%;
          line-height: 46px;
        }
      }
    }
  }
  .footer-ent{
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    text-align: center;
    ::v-deep .el-button{
      background-color: #41414b;
      border-color: #41414b;
      width: 90px!important;
      height: 30px!important;
      color: #fff;
      line-height: 30px!important;
      border-radius: 2px;
      padding: 0px 40px;
      width: 180px!important;
      height: 40px!important;
    }
    p{
      margin-top: 20px;
    }
  }
  .active{
    ::v-deep .el-button{
      background: #fc5659;
      border-color: #fc5659;
    }
  }
}
</style>
