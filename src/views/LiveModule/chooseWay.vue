<template>
  <div :class="['chooseWay', {'no-login': Number(arr[1]) !== 1}]">
    <OldHeader :is-show-login=false class="old-header" v-if="Number(arr[1]) !== 1"></OldHeader>
    <div class="choose__way__main">
      <!-- <pageTitle title="选择发起方式"></pageTitle> -->
      <div class="choose__way__ctx">
        <h1 class="choose-method">选择发起方式</h1>
        <div class="select-way">
          <div class="choose-p choose-a-way " :class="chooseType === 'browser' ? 'active' : 'choose-a-way'" @click.prevent.stop="changeChoose('browser')">
            <div class="choose-img"><img src="../../common/images/live/net.png" alt=""></div>
            <p class="f-20">网页发起直播</p>
            <p>一键发起直播,无需安装任何直播插件</p>
          </div>
          <!-- <div class="interact_select choose-a-way">

            <p class="choose-p"></p>
            <p class="f-20">网页发起互动直播</p>
            <p>可进行多人连麦</p>
            <p>需要使用chrome浏览器</p>
          </div> -->
          <div class="choose-p choose-a-way " :class="chooseType === 'client' ? 'client active' : 'choose-a-way'" @click.prevent.stop="changeChoose('client')">
            <div class="choose-img"><img src="../../common/images/live/app.png" alt=""></div>
            <p class="f-20">客户端发起</p>
            <p>需安装客户端、支持多种视频采集卡、插入视频等功能</p>
          </div>
          <!-- <div class="choose-a-way other vip">
            <p class="choose-p"></p>
            <p class="f-20"><label style="font-weight: 400">第三方推流方式/工具发起</label></p>
            <p>通过第三方软件实现多样化的推流方式</p>
            <p>拥有更强的扩展性</p>
          </div> -->
        </div>
        <div class="choose-btn">
          <el-button type="primary" round @click="goLive" class="length152" v-preventReClick>发起直播</el-button>
          <iframe src="" class="hide" frameborder="0" scrolling="no" id="start_live"></iframe>
        </div>
        <div class="v-download" v-if="chooseType === 'client'">
          客户端启动遇到问题？您可以尝试：<a target="_blank" href="//t-alistatic01.e.vhall.com/upload/assistant/file_url/ac/12/VhallTool.exe" >下载客户端</a> 联系客服400-888-9970
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import PageTitle from '@/components/PageTitle';
import {sessionOrLocal} from "@/utils/utils";
import OldHeader from '@/components/OldHeader';
import { browserDetect } from '@/utils/utils';
import Env from '@/api/env';
export default {
  name: 'chooseWay.vue',
  components: {
    // PageTitle,
    OldHeader
  },
  data() {
    return {
      chooseType: 'browser',
      scheme: '',
      schemeUrl: '',
      watchUrl: '',
      arr: [],
      browserStatus: false,
      clientOpen: ''
    };
  },
  created(){
    // 动态获取 下载客户端地址 + 启动PC客户端应用程序地址命令
    let _data = this.$route.params
    this.arr = [_data.str, _data.role]
    this.getRoleUrl();
  },
  methods: {
    changeChoose(type) {
      this.chooseType = type;
    },
    goLive(){
      if(this.chooseType !== 'client') {
        // 浏览器检测 => 若失败，跳转浏览器效果页；若成功，跳转观看页
        if(browserDetect()) {
          if (Number(this.arr[1]) === 1) {
            // 进入直播前检测，若是直接发起
            this.$fetch('checkLive', this.$params({
              webinar_id: this.arr[0]
            })).then((res) => {
              if(res && res.code === 200) {
                this.$router.push({
                  path: this.watchUrl
                })
              } else {
                this.$message.error(res.msg || '检测异常');
              }
            }).catch(e => {
              console.log(e);
              this.$message.error(res.msg || '检测异常');
            });
          }else{
            this.$router.push({name: 'LiveRoom', params: {il_id: this.arr[0]}})
          }
        } else {
          this.$router.push({path: '/browser'})
        }
      } else {
        // 客户端启动
        document.querySelector('#start_live').setAttribute('src', this.scheme);
        document.querySelector('#start_live').click();
      }
    },
    getRoleUrl() {
      // 获取当前用户角色 1-主持人，2-嘉宾 ，3-助理
      let params = {
        webinar_id: this.arr[0],
        type: this.arr[1],
        live_token: Number(this.arr[1]) !== 1 ? sessionOrLocal.get('liveToken') : ''
      }; // 若非主持人登录，需传递用户token
      this.$fetch('getJoinUrl', this.$params(params)).then((res) => {
        if(res && res.code === 200) {
          // this.watchUrl = res.data.page_url;
          this.scheme = res.data.client_protocol;
        } else {
          this.$message.error('当前未获取到启动数据');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error('当前未获取到启动数据');
      });
    }
  },
  mounted() {
    this.watchUrl = `/live/room/${this.arr[0]}`
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.chooseWay {
  &.no-login {
    .choose__way__main {
      width: 900px;
      margin: 122px auto;
    }
    .choose__way__ctx {
      background: #ffffff;
    }
  }
}
.choose__way__main {
  width: 900px;
  margin: 122px auto;
}
.old-header {
  margin-bottom: 40px;
}
.choose-method{
    text-align: left;
    font-weight: bold;
    font-size: 22px;
    color: #1A1A1A;
    margin-bottom: 40px;
  }
.select-way {
  display: flex;
  text-align: center;

}
.choose-a-way {
  // display: inline-block;
  margin: 0 24px 0 0;
  width: 400px;
  height: 220px;
  background: #fff;
  border: 1px solid transparent;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  p {
    text-align: center;
    color: #999;
    &.f-20 {
      padding-top: 13px;
      color: #1A1A1A;
      text-align: center;
      padding-bottom: 10px;
    }
  }
  .choose-img{
    width: 56px;
    height: 46px;
    margin: auto;
    margin-top: 55px;
    // text-align: center;
    img{
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
  .choose-p {
    // border-radius: 2px;
    // background: #fff;
    // background-size: 200px;
    // position: relative;
  }
  &:hover{
    border: 1px solid #FB3A32;
  }
  &.active {
    border: 1px solid #FB3A32;
    box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
  }
}
.choose-btn {
  text-align: center;
  margin-top: 32px;
  iframe {
    display: none !important;
  }
}
.v-download {
  margin: 30px auto;
  text-align: center;
  display: block;
  a {
    color: @default--normal;
    &:hover {
      color: @default--hover;
    }
  }
}

.browser-version {
  display: ;
}
</style>
