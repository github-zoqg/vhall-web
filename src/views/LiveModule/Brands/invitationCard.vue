<template>
  <div class="invitation-card">
    <div class="title-data">
      <p>邀请卡</p>
      <p class="switch__box">
      <el-switch
        style="display: block; padding-top: 4px"
        v-model="invitation"
        @change="changeOpen"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        active-text="开启后，观众可以在观看页面生成邀请卡，邀请好友观看"
      >
      </el-switch>
      </p>
      <div class="invitation-look">
        <el-popover
            placement="bottom"
            trigger="hover"
           >
           <div class="invitation-code">
            <img :src="showCode" alt="">
          </div>
          <el-button round size="medium" class="transparent-btn" slot="reference" :disabled="!invitation">扫码查看</el-button>
        </el-popover>
        <el-button size="medium" round class="transparent-btn" :disabled="!invitation" @click="loadDownInvition">本地下载</el-button>
      </div>
    </div>
    <div class="invitation-from">
      <div class="form-data">
        <el-form ref="formData" :model="formInvitation" label-width="82px" :disabled="!invitation" :rules="rules">
          <el-form-item label="封面背景">
            <div class="data-img" @click="invitation && changeImg()">
              <div class="advor_img"><img :src="img" alt=""/></div>
              <span class="choseImg">选择封面</span>
            </div>
          </el-form-item>
          <el-form-item label="展示方式">
            <div class="data-show">
              <p :class="showType === 1 ? 'isActiveColor' : ''" @click="invitation && changeType(1)">
                <img src="../../../common/images/invite-card/tmpl1.png" alt="">
                <label  class="img-tangle" v-if="showType === 1"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
               <p :class="showType === 2 ? 'isActiveColor' : ''" @click="invitation && changeType(2)">
                <img src="../../../common/images/invite-card/tmpl2.png" alt="">
               <label  class="img-tangle" v-if="showType === 2"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
               <p :class="showType === 3 ? 'isActiveColor' : ''" @click="invitation && changeType(3)">
                <img src="../../../common/images/invite-card/tmpl3.png" alt="">
                <label  class="img-tangle" v-if="showType === 3"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <VhallInput
              v-model="formInvitation.title"
              :maxlength="16"
              v-clearEmoij
              autocomplete="off"
              show-word-limit
              style="width: 320px"
            ></VhallInput>
          </el-form-item>
          <el-form-item label="主办方" prop="company">
            <VhallInput
              v-model="formInvitation.company"
              :maxlength="10"
              v-clearEmoij
              autocomplete="off"
              show-word-limit
              style="width: 320px"
            ></VhallInput>
          </el-form-item>
          <el-form-item label="时间">
            <VhallInput
              v-model="formInvitation.webinar_date"
              :maxlength="20"
              v-clearEmoij
              autocomplete="off"
              show-word-limit
              style="width: 320px"
            ></VhallInput>
          </el-form-item>
          <el-form-item label="地点" prop="location">
            <VhallInput
              v-model="formInvitation.location"
              :maxlength="20"
              v-clearEmoij
              autocomplete="off"
              show-word-limit
              style="width: 320px"
            ></VhallInput>
          </el-form-item>
          <el-form-item label="简介" prop="desciption">
            <VhallInput
              class="desc"
              style="width: 320px"
              v-model="formInvitation.desciption"
              type="textarea"
              :maxlength="45"
              autocomplete="off"
              :autosize="{ minRows: 5 }"
              resize="none"
              show-word-limit
            ></VhallInput>
          </el-form-item>
          <!-- <el-form-item label="隐藏水印">
                <el-switch
                  v-model="formInvitation.is_show_watermark"
                  active-color="#FB3A32"
                  inactive-color="#ccc"
                >
                </el-switch>
              </el-form-item> -->
        </el-form>
      </div>
      <div class="invitation-show">
        <!-- <img :src="img" alt="" class="img_invite" v-show="false">
        <img :src="avatar" alt="" class="img_invite" v-show="false"> -->
        <!-- <p>移动端预览</p> -->
        <div class="show-img" :style="`backgroundImage: url(${img})`" v-if="showType==1" id="shopInvent">
          <div class="show-container">
            <div class="show-header">
              <div class="show-avator">
                <img :src="avatar" alt="">
              </div>
              <p>{{formInvitation.company || '微吼直播'}}</p>
              <p>邀请你一起看直播</p>
            </div>
            <div class="show-text">
              <h1>{{ formInvitation.title }}</h1>
              <p>{{ formInvitation.desciption }}</p>
              <div class="show-time">
                <p>{{ formInvitation.webinar_date }}</p>
                <p>{{ formInvitation.location }}</p>
              </div>
            </div>
            <div class="show-footer">
              <div class="show-code">
                <img :src="qrcode" alt="">
              </div>
              <div class="show-action">
                <p>扫 / 描 / 二 / 维 / 码</p>
                <h1>立 即 参 与 活 动</h1>
                <p>长按保存图片后分享</p>
              </div>
            </div>
          </div>
        </div>
        <div class="watch-img" v-else-if="showType===2"  id="shopInvent" :style="`backgroundImage: url(${img})`">
          <div class="watch-container">
            <div class="watch-bg">
              <div class="watch-color">
                <div class="watch-header">
                  <div class="watch-avator">
                    <img :src="avatar" alt="">
                  </div>
                  <p style="color:#fff;">{{formInvitation.company || '微吼直播'}}</p>
                  <p style="color:#fff;">邀请你一起看直播</p>
                </div>
              </div>
            </div>
            <div class="watch-text">
              <h1>{{ formInvitation.title }}</h1>
              <p>{{ formInvitation.desciption }}</p>
              <div class="watch-footer">
                <div class="watch-code"><img :src="qrcode" alt=""></div>
                <div class="watch-action">
                  <!-- <p>扫码观看视频</p> -->
                  <h1 :title="formInvitation.webinar_date">{{ formInvitation.webinar_date }}</h1>
                  <h1 :title="formInvitation.location">{{ formInvitation.location }}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="look-img" :style="`backgroundImage: url(${img})`"  id="shopInvent" v-else>
          <div class="look-color-shadow"></div>
          <div class="look-color">
            <div class="look-header">
              <div class="look-avator">
                <img :src="avatar" alt="">
              </div>
              <p>{{formInvitation.company || '微吼直播'}}</p>
              <p>邀请你一起看直播</p>
            </div>
            <div class="look-text" v-if="formInvitation.title || formInvitation.desciption">
              <h1>{{ formInvitation.title }}</h1>
              <p>{{ formInvitation.desciption }}</p>
            </div>
            <div class="look-time">
              <span v-if="formInvitation.webinar_date"></span>
              <p v-if="formInvitation.webinar_date">时间</p>
              <p>{{ formInvitation.webinar_date }}</p>
              <span v-if="formInvitation.location"></span>
              <p v-if="formInvitation.location">地点</p>
              <p>{{ formInvitation.location }}</p>
            </div>
            <div class="look-footer">
              <div class="look-code"><img :src="qrcode" alt=""></div>
              <div class="look-action">
                <p>扫 / 描 / 二 / 维 / 码</p>
                <h1>立 即 参 与 活 动</h1>
                <p>长按保存图片后分享</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sureBtn">
        <el-button type="primary length152" round   :disabled="!invitation" v-preventReClick @click="onSubmit">保存</el-button>
      </div>
      <div class="white-show" v-show="!invitation"></div>
    </div>
    <add-background ref="background" @onChangePic="onSubmitImg" :url="imgUrl" :type="formInvitation.img_type"></add-background>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4"></begin-play>
  </div>
</template>
<script>
import addBackground from './components/imgBackground';
import {sessionOrLocal} from "@/utils/utils";
import { isBrower } from '@/utils/getBrowserType';
import Env from "@/api/env";
import html2canvas from 'html2canvas';
import beginPlay from '@/components/beginBtn';
export default {
  data() {
    const locationValidate = (rule, value, callback) => {
      if (value && value.length > 20) {
        callback && callback('地点在20个字符以内');
      } else {
        callback();
      }
    };
    const timeValidate = (rule, value, callback) => {
      if (value && value.length > 20) {
        callback && callback('时间在20个字符以内');
      } else {
        callback();
      }
    };
    const desciptionValidate = (rule, value, callback) => {
      if (value && value.length > 45) {
        callback && callback('简介在45个字符以内');
      } else {
        callback();
      }
    };
    const companyValidate = (rule, value, callback) => {
      if (value && value.length > 10) {
        callback && callback('主办方在10个字符以内');
      } else {
        callback();
      }
    };
    const titleValidate = (rule, value, callback) => {
      if (value && value.length > 16) {
        callback && callback('标题在16个字符以内');
      } else {
        callback();
      }
    };
    return {
      invitation: true,
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      qrcode: '',
      showCode: '',
      showType: 1,
      avatar: '',
      img: '',
      imgType: 0,
      isShowMethod: '1',
      information: {},
      imgUrl: '',
      formInvitation: {
        show_type: 1,
        img_type: 0,
        is_show_watermark: false,
      },
      fileList: [
        `${Env.staticImgs.invitation[0]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[1]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[2]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[3]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[4]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[5]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[6]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[7]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
        `${Env.staticImgs.invitation[8]}?x-oss-process=image/resize,m_fill,w_100,h_100,limit_0`,
      ],
      rules: {
        title: [
          { required: false, validator: titleValidate, trigger: 'blur' },
        ],
        desciption: [
          { required: false, validator: desciptionValidate, trigger: 'blur' },
        ],
        location: [
          { required: false, validator: locationValidate, trigger: 'blur' },
        ],
        webinar_date: [
          { required: false, validator: timeValidate, trigger: 'blur' },
        ],
        company: [
          { required: false, validator: companyValidate, trigger: 'blur' },
        ],
      },
    };
  },
  created(){
    this.webinarId = this.$route.params.str;
    this.avatar = JSON.parse(sessionOrLocal.get("userInfo")).avatar || require('../../../common/images/avatar.png');
    let token = sessionOrLocal.get('token', 'localStorage');
    this.showCode = `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/lives/invite/${this.$route.params.str}?token=${token}`;
    this.getInviteCardInfo();
  },
  components: {
    addBackground,
    beginPlay
  },
  methods: {
    changeType(index) {
      this.showType = index;
    },
    changeOpen() {
      this.isInviteCard();
    },
    isInviteCard() {
      let params = {
        webinar_id: this.webinarId,
        status: Number(this.invitation)
      };
      this.$fetch('setCardStatus', params).then(res => {
        this.$message({
          message: this.invitation ? '开启邀请卡成功' : '关闭邀请卡成功',
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(res => {
        this.$message({
          message: res.msg || (this.invitation ? '开启邀请卡失败' : '关闭邀请卡失败'),
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    getInviteCardInfo() {
      let params = {
        webinar_id: this.webinarId
      };
      this.$fetch('getCardDetailInfo', params).then(res => {
        this.formInvitation = res.data.invite_card;
        this.qrcode = `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}?invite=${res.data.invite}`;
        this.img = this.formInvitation.img || this.fileList[0];
        if (!this.formInvitation.img_type) {
          this.img = this.formInvitation.img || this.fileList[0];
        } else {
          this.img = this.fileList[this.formInvitation.img_type - 1];
        }
        this.imgUrl = this.formInvitation.img || '';
        this.showType = this.formInvitation.show_type;
        this.invitation = Boolean(res.data.status);
        this.formInvitation.is_show_watermark = Boolean(this.formInvitation.is_show_watermark);
      });
    },
    changeImg() {
      this.$refs.background.dialogVisible = true;
    },
    code() {
      this.$router.push({path: '/code'});
    },
    onSubmitImg(type, url, trueImg) {
      if (!type) {
        this.formInvitation.img = url;
        this.img = trueImg;
      } else {
        this.img = this.fileList[type - 1];
      }
      this.formInvitation.img_type = type;
      // this.onSubmit();
    },
    // 修改邀请卡信息
    onSubmit() {
      let ids = {
        webinar_id: this.webinarId,
      };
      this.formInvitation.is_show_watermark = Number(this.formInvitation.is_show_watermark);
      this.formInvitation.show_type = this.showType;
      this.formInvitation.img = this.formInvitation.img_type ?  '' : this.img;
      let obj = Object.assign({}, ids, this.formInvitation);
      this.$fetch('editCardStatus', this.$params(obj)).then(res => {
       if (res.code == 200) {
         this.$message({
          message: `保存数据成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
       }
      }).catch(res => {
        this.$message({
          message: res.msg || `保存数据失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    fileDownLoad(imgUrl, name) {
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      if (window.navigator.msSaveOrOpenBlob) {
        var bstr = atob(imgUrl.split(',')[1])
        var n = bstr.length
        var u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        var blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(blob, 'chart-download' + '.' + 'png')
      } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement('a')
        a.href = imgUrl
        a.setAttribute('download', 'chart-download')
        a.click()
      }
    },
    // 本地下载
    loadDownInvition() {
      console.log(isBrower())
      let browerType = isBrower();
      // const image = new Image();
      // let canvas1 = document.createElement('canvas');
      let _canvas = document.getElementById('shopInvent');
      // let w = parseInt(window.getComputedStyle(_canvas).width)
      // let h = parseInt(window.getComputedStyle(_canvas).height)
      // canvas1.width = w * 2;
      // canvas1.height = h * 2;
      // canvas1.style.width = w * 2  + 'px';
      // canvas1.style.height = h * 2 + 'px';
      // let context = canvas1.getContext('2d');
      // context.scale(2,2);
      // context.drawImage(image, 0, 0);
      html2canvas(_canvas, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        scrollY: 0,
        scrollX: browerType === 'safari' ? 115 : browerType === 'firefox' ? 10 : 0,
        width: _canvas.offsetWidth,
        height: _canvas.offsetHeight,
        backgroundColor: null
      }).then(canvas => {
        let dataUrl = canvas.toDataURL('image/png', 1.0);
        // this.canvasImg = dataUrl;
        this.fileDownLoad(dataUrl)
      })
    }
  }
};
</script>
<style lang="less" scoped>
.invitation-card {
  /deep/.el-switch__core {
    width: 28px !important;
    height: 16px;
  }
  /deep/.el-switch__core:after {
    width: 12px;
    height: 12px;
  }
  /deep/.el-switch__label {
    color: #999;
  }
  // /deep/.el-switch.is-checked .el-switch__core::after {
  //   margin-left: -13px;
  // }
  /deep/.el-form-item__label {
    font-family: @fontRegular;
    font-weight: 400;
    color: #1a1a1a;
  }
  /deep/.el-input .el-input__count{
    color:#999;
  }
  /deep/.el-input__count-inner{
    color: #999;
  }
  /deep/.el-textarea .el-input__count{
    color:#999;
    font-size: 14px;
  }
  /deep/.invite-card-button {
    width: 106px;
    height: 36px;
  }
  /deep/.el-input__count {
    line-height: 20px;
    bottom:7px;
  }
  /deep/.el-input__inner, /deep/.el-textarea__inner {
    padding: 5px 12px;
    color: #1A1A1A;
  }
  .invitation-from {
    display: flex;
    height: 100%;
    background: #fff;
    padding: 20px 48px 85px 30px;
    position: relative;
    border-radius: 4px;
  }
  .form-data {
    padding: 10px 0 10px;
    margin-right: 100px;
    /deep/ .desc .el-textarea__inner{
      font-family: "-apple-system", "BlinkMacSystemFon", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    }
  }
  .data-img {
    width: 320px;
    height: 135px;
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    cursor: pointer;
    .advor_img{
      width: 70px;
      height: 132px;
      position: absolute;
      margin: 0 125px;
      img {
        width: 100%;
        height: 100%;
        // object-fit: scale-down;
      }
    }

    .choseImg {
      width: 100%;
      display: inline-block;
      height: 26px;
      line-height: 26px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 0px 0px 4px 4px;
      position: absolute;
      bottom: 0;
      left: 0;
      cursor: pointer;
    }
  }
  .data-show {
    margin-right: 100px;
    display: flex;
    p {
      width: 70px;
      margin-right: 20px;
      border-radius: 2px;
      // border: 1px solid #E6E6E6;
      position: relative;
      height: 124px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease-in;
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
      .img-tangle{
        position: absolute;
        right: -1px;
        top:-1px;
        width: 20px;
        height: 20px;
        font-size: 0;
        img{
          width: 100%;
          height: 100%;
        }
      }
      &:hover {
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        // border: 1px solid transparent;
        border: 1px solid #f2f2f2;
      }
      &.isActiveColor{
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        border: 1px solid #FB3A32;
      }
    }

  }
  .invitation-show{
    padding-top: 20px;
    padding-right: 200px;
    p {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1a1a1a;
      padding-bottom: 16px;
    }
    .show-img {
      width: 330px;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      background-image: url('../../../common/images/v35-webinar.png');
      background-size: 100% 100%;
      height: 622px;
      .show-container{
        margin: 50px 24px;
        width: 282px;
        height: 520px;
        // background-image: url('../../../common/images/invite-card/show.png');
        background-size: 100% 100%;
        background-color: #fff;
        box-shadow: 0px 0 6px 0px rgba(0, 0, 0, 0.1);
        position: relative;
        border-radius: 4px;
        .show-header{
          padding: 20px 24px;
          text-align: center;
          .show-avator{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            margin: auto;
            margin-bottom: 10px;
            img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          p{
            padding: 0;
            font-size: 14px;
            color: #666;
            font-weight: 400;
            line-height: 18px;
          }
        }
        .show-text{

          padding: 24px;
          text-align: center;
          h1{
            width: 218px;
            padding: 0;
            font-size: 26px;
            color:#1A1A1A;
            font-weight: 600;
            line-height: 37px;
            word-wrap: break-word;
            white-space: normal;
            word-break: break-all;
          }
          p{
            font-size: 14px;
            color:#1A1A1A;
            font-weight: 400;
            line-height: 20px;
            padding: 2px 0 5px 0;
            overflow: hidden;
            // text-emphasis: wrap;
            word-wrap: break-word;
            white-space: normal;
            word-break: break-all;
            // min-height: 45px;
          }
          .show-time{
            margin-top: 10px;
            p{
              padding:0;
              color: #666;
              line-height: 20px;
            }
          }
        }
        .show-footer{
          // width: 180px;
          position: absolute;
          display: flex;
          bottom: 24px;
          left: 30px;
          padding: 20px 20px 0 20px;
          justify-content: center;
          align-items: center;
          .show-code{
            width: 60px;
            height: 60px;
            margin-right: 10px;
            // margin-left: 10px;
            img{
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
          }
          .show-action{
            h1{
              padding:0;
              font-size: 14px;
              color:#1A1A1A;
              font-weight: 600;
              line-height: 28px;
            }
            p{
              padding:0;
              font-size: 12px;
              color:#666;
              font-weight: 400;
            }
          }
        }
      }
    }
    .watch-img{
      width: 330px;
      background: #FFFFFF;
      height: 620px;
      position: relative;
      border: 1px solid #E6E6E6;
      // box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.5);
      // height: 360px;
      background-image: url('../../../common/images/v35-webinar.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 4px;
      z-index: 0;
      .watch-container{
        width: 100%;
        height: 100%;
      }
      .watch-bg{
        height: 360px;
        // background-image: url('../../../common/images/v35-webinar.png');
        // background-size: 100% 100%;
        // background-repeat: no-repeat;
        border-radius: 4px 4px 0 0;
        // background-color: rgba(0, 0, 0, 0.1);
        .watch-color{
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px 4px 0 0;
        }
        .watch-header{
            padding: 20px 24px;
            text-align: center;
            .watch-avator{
              width: 36px;
              height: 36px;
              border-radius: 50%;
              // border: 1px solid #ccc;
              margin: auto;
              margin-bottom: 10px;
              img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
            p{
              padding: 0;
              font-size: 14px;
              color: #666;
              font-weight: 400;
              line-height: 18px;
            }
          }
      }
    .watch-text{
      padding: 10px 20px 24px 24px;
      background: #fff;
      z-index: 1;
      height: 258px;
      position: relative;
      border-radius: 0 0 3px 3px;
      text-align: center;
      letter-spacing: 2px;
      h1{
        padding:0;
        font-size: 28px;
        color: #1A1A1A;
        line-height: 40px;
        font-weight: 500;
        word-wrap: break-all;
        word-wrap:break-word;
      }
      p{
        padding-top:6px;
        font-size: 14px;
        color: #666;
        line-height: 18px;
        font-weight: 400;
        min-height: 50px;
        word-wrap: break-word;
        white-space: normal;
        word-break: break-all;
      }
      .watch-footer{
          position: absolute;
          left: 24px;
          bottom: 24px;
          display: flex;
          padding-top: 25px;
          // padding: 20px 24px 24px 32px;
          .watch-code{
            width: 67px;
            height: 67px;
            margin-right: 10px;
            margin-top: 2px;
            // margin-left: 10px;
            img{
              width: 67px;
              height: 67px;
            }
          }
          .watch-action{
            width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            vertical-align: middle;
            text-align: left;
            h1{
              padding:0;
              font-size: 14px;
              color:#1A1A1A;
              font-weight: 500;
              line-height: 18px;
              // white-space: nowrap;
              // overflow: hidden;
              // text-overflow: ellipsis;
            }
            // p{
            //   padding:0;
            //   font-size: 12px;
            //   color:#666;
            //   font-weight: 400;
            //   line-height: 20px;
            //   min-height: 20px;
            // }
          }
        }
    }
    }
    .look-img{
      width: 330px;
      color:#fff;
      height: 622px;
      border-radius: 4px;
      // border: 1px solid #E2E2E2;
      background-image: url('../../../common/images/v35-webinar.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
      .look-color-shadow {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.2);
      }
      .look-color{
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 20px 24px;
      }
      .look-header{
        padding-bottom: 20px;
        text-align: center;
        .look-avator{
          width: 36px;
          height: 36px;
          border-radius: 50%;
          // border: 1px solid #ccc;
          margin: auto;
          margin-bottom: 10px;
          img{
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
        }
        p{
          padding: 0;
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
          color:#fff;
        }
      }
      .look-text{
        width: 100%;
        text-align: center;
        border: 4px solid #fff;
        border-radius: 4px;
        // margin: auto;
        margin-top: 10px;
        padding: 5px 0;
        letter-spacing: 2px;
        h1{
          padding: 0 15px;
          font-size: 26px;
          font-weight: 600;
          line-height: 40px;
          word-wrap: break-word;
          white-space: normal;
          word-break: break-all;
        }
        p{
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color:#fff;
          padding: 5px 15px;
          word-wrap: break-word;
          white-space: normal;
          word-break: break-all;
        }
      }
      .look-time{
        margin-top: 30px;
        // padding-left: 24px;
        p{
          padding:0;
          line-height: 25px;
          color:#fff;
        }
        span{
          display: inline-block;
          width: 24px;
          height: 4px;
          background: #fff;
        }
      }
      .look-footer{
        position: absolute;
        display: flex;
        bottom: 20px;
        left: 40px;
        width: 250px;
        // background: #000;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        // opacity: 0.2;
        padding: 10px;
        .look-code{
          width: 60px;
          height: 60px;
          // float: left;
          margin: 0 16px;
          img{
            width: 60px;
            height: 60px;
          }
        }
        .look-action{
          h1{
            padding:0;
            font-size: 14px;
            color: #fff;
            font-weight: 600;
            line-height: 30px;
          }
          p{
            padding:0;
            color: #fff;
            font-size: 12px;
            font-weight: 400;
          }
        }
      }
    }
  }
  .title-data {
    margin-bottom: 32px;
    position: relative;
    line-height: 30px;
    display: flex;
    p {
      font-size: 22px;
      font-family: @fontSemibold;
      font-weight: 600;
      color: #1a1a1a;
      padding-right: 8px;
    }
    .invitation-look {
      position: absolute;
      right: 0;
      top: 0;
      /deep/.el-button:last-child{
        margin-left: 10px;
      }
    }
  }
  .sureBtn {
    position: absolute;
    bottom: 40px;
    left: 110px;
    // /deep/.el-button {
    //   padding: 9px 60px;
    //   border-radius: 20px;
    //   margin: auto;
    // }
  }
  .white-show{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background: rgba(255, 255, 255, 0.5);
    z-index: 9;
  }
}
.invitation-code{
  width: 132px;
  height: 132px;
  text-align: center;
  img{
    width: 132px;
    height: 132px;
    object-fit: scale-down;
  }
}
</style>
