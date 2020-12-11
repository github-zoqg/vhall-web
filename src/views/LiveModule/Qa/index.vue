<template>
  <div class="new-qa">
    <OldHeader class="head-wrap"></OldHeader>
    <div class="qa-wrap">
        <h3 class="title">{{baseObj.webinar.subject}}</h3>
        <p class="host">主播：{{baseObj.webinar.userinfo.nickname}}</p>
        <div class="tab-box">
          <ul>
            <li @click="select(index)" :class="['tab-li', {'tab-li-active' : index == active}]"  v-for="(item, index) in List" :key="index">
              {{item.text}}
              <span class="count">({{item.count}})</span>
              <span class="border"></span>
            </li>
          </ul>
          <div class="tab-content">
            <div>

            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';

export default {
  components: {
    OldHeader
  },
  data() {
    return {
      List:[
        {text:'待处理', count: 0},
        {text:'文字回复', count: 0},
        {text:'不处理', count: 0}
      ],
      active: 0,
      baseObj: {},
      $Chat: null
    }
  },
  async created() {
   await this.getUserInfo()
   this.getChat()
   this.initChat()
  },
  methods: {
    getUserInfo(){
      return new Promise((resolve, reject) =>{
        console.warn('this.$router.params', this.$router.currentRoute.params.id);
        this.$fetch('initiatorInfo', { webinar_id:  this.$router.currentRoute.params.id }).then(res => {
          if(res.code == 200){
            console.warn(res, '4578');
            this.baseObj = res.data
            resolve()
          }else{
            reject()
          }
        }).catch(err=>{
          reject()
        })
      })
    },
    getChat(){
      console.warn(45);
      this.$fetch('channelInfo', {
        room_id: this.baseObj.interact.room_id,
        vss_token: ''
      }).then(res=>{
        console.warn('获取res', res)
      }).catch(err=>{
        console.warn('获取err', err);
      })
    },
    // 初始化
    initChat(){
      let option = {
        appId: this.baseObj.interact.paas_app_id, // appId 必须
        accountId: this.baseObj.join_info.third_party_user_id, // 第三方用户ID
        channelId: this.baseObj.interact.channel_id, // 频道id 必须
        token: this.baseObj.interact.paas_access_token, // 必须， token，初始化接口获取
      }
      window.VhallChat.createInstance(option, (event) => {
        console.warn(event, '---------------第三方都是');
        this.$Chat = event.message; // 聊天实例句柄
        let disable = event.disable; // 个人是否被禁言，bool值
        let disable_all = event.disable_all; // 是否频道被禁言，bool值
        this.monitor()
      },err=>{
        console.error(err);
      })
    },
    // 监听
    monitor(){
      this.$Chat.onChat(msg=>{
        console.warn('坚挺到消息的派发-----', msg);
      })
    },
    select(index){
      this.active = index
    }
  },
  beforeCreate() {
    console.log(this)
  },
}
</script>
<style lang="less" scoped>
.new-qa{
  background: #f8f8f8;
  ::v-deep.head-wrap{
    .collapse{
      height: 100%;
      .login-reg{
        height: 100%;
        .head{
          margin-top: -8px;
          border: none;
          vertical-align: middle;
          display: inline-block;
        }
        .caret{
          margin-bottom: 4px;
        }
      }
    }
  }
  .qa-wrap{
    width: 1300px;
    margin: 0 auto;
    .title{
      margin-top: 50px;
      font-size: 24px;
    }
    .host{
      margin: 30px 0 20px;
      font-size: 18px;
    }
    .tab-box{
      border: 1px solid red;
      height: 700px;
      ul{
          height: 44px;
          line-height: 44px;
          border-bottom: 1px solid #ddd;
        .tab-li{
          display: inline-block;
          min-width: 120px;
          text-align: center;
          background: #bbb;
          margin-right: 3px;
          position: relative;
          .count{
            color: #f64a43;
          }
          .border{
            display: none;
            border: 2px solid red;
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          &-active{
            color: #f64a43;
            .border{
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
