<template>
  <div class="new-qa">
    <OldHeader class="head-wrap"></OldHeader>
    <div class="qa-wrap">
        <h3 class="title">{{baseObj.webinar && baseObj.webinar.subject}}</h3>
        <p class="host">主播：{{ baseObj.webinar && baseObj.webinar.userinfo && baseObj.webinar.userinfo.nickname}}</p>
        <div class="tab-box">
          <ul>
            <li @click="select(index)" :class="['tab-li', {'tab-li-active' : index == active}]"  v-for="(item, index) in List" :key="index">
              {{item.text}}
              <span class="count">({{item.count}})</span>
              <span class="border"></span>
            </li>
          </ul>
          <div class="tab-content">
            <ul class="await-deal" v-show="active == 0">
              <li v-for="(item, index) in awaitList" :key="index" class="clearFix">
               <div class="fl">
                 <p class="await-name">
                  <span>{{item.name}}</span>
                  <span>{{filterTime(item.time)}}</span>
                 </p>
                 <p class="await-content">{{item.content}}</p>
               </div>
               <div class="fr">
                  <el-button @click="reply('text')" size="small" class="setBut">文字回复</el-button>
                  <el-button @click="reply('audio')" size="small" class="setBut">标记为语音回复</el-button>
                  <el-dropdown @command="reply" size="small" class="setBut">
                    <el-button size="small"  class="el-dropdown-link">更多</el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='private'>私聊</el-dropdown-item>
                        <el-dropdown-item command='no'>不处理</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>
               </div>
              </li>
            </ul>
            <ul class="await-deal text-deal" v-show="active == 1">
              <!-- textDealList -->
              <li v-for="(item, index) in awaitList" :key="index"  class="clearFix">
               <div class="fl">
                 <p class="await-name">
                  <span>{{item.name}}</span>
                  <span>{{filterTime(item.time)}}</span>
                 </p>
                 <p class="await-content">{{item.content}}</p>
               </div>
               <div class="fr">
                  <el-button @click="reply('text')" size="small" class="setBut">文字回复</el-button>
                  <el-button @click="reply('audio')" size="small" class="setBut">私聊</el-button>
               </div>
              </li>
            </ul>
            <ul class="no-deal" v-show="active == 2">
              <li v-for="(item, index) in noDealList" :key="index">{{item}}</li>
            </ul>
            <div class="messChat">
              <el-button v-show="!privateFlag" @click="messClick" size='small' type="success">私聊</el-button>
              <template v-show="privateFlag">
                <Private ></Private>
              </template>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import OldHeader from '@/components/OldHeader';
import Private from './PrivateMess/index';

export default {
  components: {
    OldHeader,
    Private
  },
  computed:{
    filterTime(){
      return function(time){
        console.warn(time, 77);
        return this.$moment(time).format('hh:mm')
      }
    }
  },
  data() {
    return {
      List:[
        {text:'待处理', count: 0},
        {text:'语音回复', count: 0},
        {text:'文字回复', count: 0},
        {text:'不处理', count: 0}
      ],
      active: 0,
      baseObj: {},
      awaitList: [{
        name: '东方闪电',
        content: '测试提交的内容',
        time: new Date()

      }], // 待处理
      textDealList: [], // 文字回复
      noDealList: [
        {
          name: 'content',
          content: 'dfs',
          time: '2020-12-06'
        }
      ], // 不处理
      $Chat: null,
      privateFlag: true
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
      this.$fetch('getAutherQa', {
        room_id: this.baseObj.interact.room_id,
        type: 0
      }).then(res=>{
        console.warn('获取res', res)
      }).catch(err=>{
        console.warn('获取err', err);
      })
    },
    reply(val){
      console.warn(val,789, this.active);
      if(val == 'text'){
        console.warn('文字回复')
      }else if(val == 'audio'){
        console.warn('语音回复');
      }else if(val == 'private'){
        console.warn('私聊回复');
      }else{
        console.warn('不处理');
      }
    },
    messClick(){
      console.warn('右下角私聊');
      this.privateFlag = true
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
      .tab-content{
        border: 1px solid red;
        height: calc(100% - 44px);
        position: relative;
        ul{
          height: 100%;
          overflow-y: auto;
        }
        .await-deal{
          font-size: 14px;
          li{
            border-bottom: 1px solid #c2c2c2;
            padding: 10px 20px;
          }
          .fl{
            width: calc(100% - 330px);
            line-height: 25px;
            .await-name{
              color: #888;
              font-size: 12px;
              span{
                margin-right: 30px;
              }
            }
            .await-content{
              font-size: 12px;
            }
          }
          .fr{
            float: right;
            width: 330px;
            margin-top: 10px;
            text-align: right;
            .setBut{
              margin-left: 10px;
            }
          }
        }
        .messChat{
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }
  }
}
</style>
