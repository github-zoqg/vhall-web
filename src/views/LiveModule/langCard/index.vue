<template>
  <div class="embed-card">
    <pageTitle pageTitle="多语言链接"></pageTitle>
    <div class="weixinWork" v-for="(item, index) in languageList" :key="index">
      <h3>{{item.language_type == 1 ? '中文观看页' : '英文观看页'}}</h3>
      <div class="input-card">
        <div class="input-item">
          <span>标准观看页</span>
          <el-input :value="handleLiveContent(item.language_type)" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top" v-tooltipMove>
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(handleLiveContent(item.language_type), 1)"></i>
              </el-tooltip>
            </template>
          </el-input>
          <el-popover popper-class="lang-scan" placement="bottom" trigger="hover">
            <div class="invitation-code">
              <img class="lang-code-img" :src="renderCodeImg(item.language_type)" alt="" />
              <div class="download" @click="download(item.language_type,  item.subject)">下载二维码</div>
            </div>
            <el-button
              round
              size="medium"
              class="transparent-btn"
              slot="reference"
              >扫码观看</el-button
            >
          </el-popover>
        </div>
        <div class="input-item">
          <span>完全嵌入页</span>
          <el-input :value="handleCompletion(item.language_type)" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top" v-tooltipMove>
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(handleCompletion(item.language_type), 2)"></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <div class="input-item" v-if="isInteract != 3">
          <span>视频嵌入页</span>
          <el-input :value="handlerVideo(item.language_type)" readonly style="max-width:640px">
            <template slot="suffix" >
              <el-tooltip class="item" effect="dark" content="复制" placement="top" v-tooltipMove>
                <i class="iconfont-v3 saasicon_copy" :title="'复制'" @click="cope(handlerVideo(item.language_type), 2)"></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import {sessionOrLocal} from "@/utils/utils";
import beginPlay from '@/components/beginBtn';
import Env from "@/api/env";
export default {
  name: 'langCard',
  data() {
    return {
      languageList: [],
      env: Env,
      isInteract: '',
      userId: '',
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      myMain: `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/user/home/${sessionOrLocal.get('userId')}`,
      liveContent: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      completion: '',
      video: ''
    };
  },
  components: {
    PageTitle,
    beginPlay
  },
  created() {
    this.userId = sessionOrLocal.get('userId')
    this.isInteract = this.$route.query.type;
    this.getLangList()
  },
  methods: {
    handleLiveContent(lang = 1) {
      return this.liveContent + `?lang=${lang}`
    },
    handlerVideo(lang = 1) {
      const env = process.env.VUE_APP_WAP_WATCH
      const il_id = this.$route.params.str
      const url =  `<iframe border="0" allow="display-capture" allowfullscreen="true" src="${env}/lives/embedclient/watch/${il_id}?embed=video&lang=${lang == 2 ? 2 : 1}" width="800" height="600"></iframe>`
      return url
    },
    handleCompletion(lang = 1) {
      const env = process.env.VUE_APP_WAP_WATCH
      const il_id = this.$route.params.str
      const url = `<iframe allow="camera *;microphone *; display-capture" allowfullscreen="true" border="0" src="${env}/lives/embedclient/watch/${il_id}?lang=${lang == 2 ? 2 : 1}" width="800" height="600"></iframe>`
      // this.completion = url
      return url
    },
    renderCodeImg(lang) {
      const url = `${Env.staticLinkVo.aliQr}${encodeURIComponent(this.liveContent)}`
      if (!lang) return url
      else return url + `?lang=${lang}`
    },
    download(lang, subject) {
      const url = `${Env.staticLinkVo.aliQr}${encodeURIComponent(this.liveContent)}`
      const imgurl =  url + `${lang == 2 ? '?lang=2' : '?lang=1'}`
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        // canvas.width = image.width
        // canvas.height = image.height
        canvas.width = 217
        canvas.height = 217
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, 217, 217)
        // context.drawImage(image, 0, 0, image.width, image.height)
        let ext = imgurl.substring(imgurl.lastIndexOf('.') + 1).toLowerCase()
        ext = ext.split('?')[0]
        let imgData = canvas.toDataURL('image/' + ext)
        let a = document.createElement('a')
        let event = new MouseEvent('click')
        a.download = `${subject}观看端二维码（${lang == 1 ? '中文' : lang == 2 ? '英文' : ''}）.png`
        a.href = imgData
        a.dispatchEvent(event)
      }
      image.src = imgurl
    },
    getLangList() {
      return this.$fetch('getLanguageList', {
        webinar_id: this.$route.params.str
      }).then(res => {
        if (res.code == 200) {
          this.languageList = res.data.list
        }
      })
    },
    goForm(url, index) {
      this.$vhall_paas_port({
        k: index === 1 ? 100189 : 100190,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      window.open(url, "_blank");
    },
    goEmbedForm() {
      this.$vhall_paas_port({
        k: 100191,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      let url = `${process.env.VUE_APP_E_COMPANY_URL}/auth/check-token?after_login=webinar/marketing/index&token=${sessionOrLocal.get('SAAS_V3_SSO_TOKEN', 'localStorage')}`;
      window.open(url, "_blank");
    },
    cope(url, index) {
      console.log(url);
      let copeArr = [100192, 100193, 100194, 100195]
      this.$copyText(url).then(e => {
        this.$vhall_paas_port({
          k: copeArr[index - 1],
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: `复制成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(error=>{
        this.$message({
          message: "复制失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.embed-card{
  /deep/.el-input__inner {
    padding-left: 12px;
  }
  .weixinWork, .network, .thirdMethod{
    background: #fff;
    padding: 24px 20px;
    border-radius: 4px;
  }
  .weixinWork{
    margin-bottom: 24px;
  }
  h3{
    font-weight: normal;
    font-size: 14px;
    color: #383838;
  }
  p{
    padding: 10px 0 0 100px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
    a{
      color: #3562FA;
      cursor: pointer;
    }
  }
  .input-item{
    display: flex;
    padding: 24px 50px 0 30px;
    span{
      display: inline-block;
      width: 70px;
      line-height: 35px;
      font-size: 14px;
      color: #1a1a1a;
      margin-right: 12px;
    }
    i{
      cursor: pointer;
      &:hover{
        color: #3562FA;
      }
    }
    .el-button{
      display: inline-block;
      margin-left: 20px;
      padding: 10px 20px;
    }
    .iconfont-v3{
      padding: 3px;
      // padding-right: 12px;
      line-height: 38px;
      color: #666;
      &:hover{
        color: #1a1a1a;
      }
    }
    .el-popover__reference{
      width: 104px;
      height: 38px;
      border-radius: 20px;
      border: 1px solid #CCCCCC;
      line-height: 0px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      display: inline-block;
      &:hover{
        background: #FB3A32;
        color: #fff;
        border-color: #FB3A32;
      }
    }
  }
  .network{
    margin: 30px 0;
  }
  .third-text{
    padding-left: 35px;
    line-height: 20px;
  }
  .third-list{
    width:724px;
    height: 131px;
    // border: 1px dashed #ccc;
    margin: 20px 36px 5px 30px;
    background: url(../../../common/images/third-promote.png) no-repeat;
    background-position: 0 0;
    background-size:100% 100%;
  }
}

.invitation-code {
  text-align: center;
  color: #3562FA;
  padding: 0px!important;
  margin: 0px!important;
  img {
    width: 132px;
    height: 132px;
    object-fit: scale-down;
    padding: 0px!important;
    margin: 0px!important;
  }
  .download:hover{
    cursor: pointer;
  }
}
// ::v-deep.el-popper{
//   .invitation-code .download{
//     width: 100%!important;
//     text-align: center!important;
//     color: #3562FA!important;
//     font-size: 14px;
//     font-family: PingFangSC-Regular, PingFang SC;
//     font-weight: 400;
//     color: #3562FA;
//     line-height: 20px;
//   }
// }
</style>
