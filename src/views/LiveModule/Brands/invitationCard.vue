<template>
  <div class="invitation-card">
    <div class="title-data">
      <p>邀请卡</p>
      <el-switch
        style="display: block; padding-top: 4px"
        v-model="invitation"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        active-text="开启后，观众可以在观看页面生成邀请卡，邀请好友观看"
      >
      </el-switch>
      <div class="invitation-look">
        <el-popover
            placement="bottom"
            trigger="hover"
           >
           <div class="invitation-code">
            <img :src="showCode" alt="">
          </div>
            <el-button round slot="reference">扫码查看</el-button>
        </el-popover>
        <el-button round>本地下载</el-button>
      </div>
    </div>
    <div class="invitation-from">
      <div class="form-data">
        <el-form ref="formData" :model="formInvitation" label-width="82px">
          <el-form-item label="背景">
            <div class="data-img">
              <img src="@/common/images/v35-webinar.png" alt="" />
              <span class="choseImg" @click="changeImg">重新选择</span>
            </div>
          </el-form-item>
          <el-form-item label="展示方式">
            <div class="data-show">
              <p :class="showType === '1' ? 'isActiveColor' : ''" @click="changeType('1')">
                <img src="../../../common/images/invite-card/tmpl1.png" alt="">
                <label class="img-tangle" v-if="showType === '1'"><icon icon-class="saasicon-choose-01"></icon></label>
              </p>
               <p :class="showType === '2' ? 'isActiveColor' : ''" @click="changeType('2')">
                <img src="../../../common/images/invite-card/tmpl2.png" alt="">
                <label class="img-tangle" v-if="showType === '2'"><icon icon-class="saasicon-choose-01"></icon></label>
              </p>
               <p :class="showType === '3' ? 'isActiveColor' : ''" @click="changeType('3')">
                <img src="../../../common/images/invite-card/tmpl3.png" alt="">
                <label class="img-tangle" v-if="showType === '3'"><icon icon-class="saasicon-choose-01"></icon></label>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="标题">
            <el-input
              v-model="formInvitation.title"
              maxlength="16"
              show-word-limit
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="主办方">
            <el-input
              v-model="formInvitation.company"
              maxlength="10"
              show-word-limit
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              style="width: 320px"
              v-model="formInvitation.webinar_date"
              type="datetime"
              placeholder="选择时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地点">
            <el-input
              v-model="formInvitation.location"
              maxlength="20"
              show-word-limit
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input
              style="width: 320px"
              v-model="formInvitation.desciption"
              type="textarea"
              maxlength="45"
              :autosize="{ minRows: 5 }"
              resize="none"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="隐藏水印">
                <el-switch
                  v-model="formInvitation.is_show_watermark"
                  active-color="#FB3A32"
                  inactive-color="#ccc"
                >
                </el-switch>
              </el-form-item>
        </el-form>
      </div>
      <div class="invitation-show">
        <p>移动端预览</p>
        <div class="show-img" v-if="isShow==='first'">
          <div class="show-container">
            <div class="show-header">
              <div class="show-avator"></div>
              <p>微吼直播</p>
              <p>邀请你一起看直播</p>
            </div>
            <div class="show-text">
              <h1>遇见生活—生活方<br>式生活方式面面观</h1>
              <p>2020北京国际家具展暨智能生活节于6月14-17日在北京中国国际会展中心（新馆）盛大召开。</p>
              <div class="show-time">
                <p>2020-11-26 14:30</p>
                <p>北京 中国国际会展中心</p>
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
        <div class="watch-img" v-else-if="isShow==='second'">
          <div class="watch-bg">
            <div class="watch-header">
              <div class="watch-avator"></div>
              <p>微吼直播</p>
              <p>邀请你一起看直播</p>
            </div>
          </div>
          <div class="watch-text">
            <h1>遇见生活—生活方式面 面观</h1>
            <p>2020北京国际家具展暨智能生活节于6月14-17日在北接京中国国际会展中心盛大召开。</p>
            <div class="watch-footer">
              <div class="watch-code"><img :src="qrcode" alt=""></div>
              <div class="watch-action">
                <p>扫码观看视频</p>
                <h1>2020-11-26 14:30</h1>
                <h1>中国国际会展中心</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="look-img" v-else>
            <div class="look-header">
              <div class="look-avator"></div>
              <p>微吼直播</p>
              <p>邀请你一起看直播</p>
            </div>
            <div class="look-text">
              <h1>遇见生活—生活方<br>式生活方式面面观</h1>
              <p>2020北京国际家具展暨智能生活节于6月14-17日在北京中国国际会展中心（新馆）盛大召开。</p>
            </div>
            <div class="look-time">
              <span></span>
              <p>时间</p>
              <p>2020-11-26 14:30</p>
              <span></span>
              <p>地点</p>
              <p>北京 中国国际会展中心</p>
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
      <div class="sureBtn">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </div>
    <add-background ref="background"></add-background>
  </div>
</template>
<script>
import addBackground from './components/imgBackground';
import QRcode from 'qrcode';
export default {
  data() {
    return {
      invitation: true,
      qrcode: '',
      showCode: '',
      showType: '1',
      link: 'http://e.vhall.com/mywebinar/invite-card/923464350/1734888',
      isShow: 'first',
      formInvitation: {
        show_type: 1,
        img_type: 0,
        is_show_watermark: false
      },
      showList: [
        {
          url: '../../../common/images/invite-card/tmpl1.png',
          isCheck: true,
          show_type: 1,
          show: 'first'
        },
        {
          url: '../../../common/images/invite-card/tmpl2.png',
          isCheck: false,
          show_type: 2,
          show: 'second'
        },
        {
          url: '../../../common/images/invite-card/tmpl3.png',
          isCheck: false,
          show_type: 3,
          show: 'third'
        }
      ]
    };
  },
  watch: {
    invitation() {
      if (this.invitation) {
        this.getInviteCardInfo();
      }
    }
  },
  created(){
     QRcode.toDataURL(
      this.link,
      (err, url) => {
        console.log(err, url);
        this.showCode = url;
      }
     );
    this.isInviteCard();
  },
  components: {
    addBackground
  },
  methods: {
    changeType(index) {
      this.showType = index;
    },
    isInviteCard() {
      let params = {
        webinar_id: '923464350',
        room_id: 'ls_123423',
        status: this.invitation ? 1 : 0
      };
      this.$fetch('setCardStatus', params).then(res => {
        console.log(res.data, '1111111111');
      });
    },
    getInviteCardInfo() {
      let params = {
        webinar_id: '923464350',
        room_id: 'ls_123423'
      };
      this.$fetch('getCardDetailInfo', params).then(res => {
        this.formInvitation = res.data.invite_card;
        this.formInvitation.is_show_watermark = res.data.invite_card.is_show_watermark === 1 ? false : true;
        this.getShowCode(res.data.invite_qr_url);
      });
    },
    getShowCode(link) {
      QRcode.toDataURL(
      link,
      (err, url) => {
        console.log(err, url);
        this.qrcode = url;
      }
    );
    },
    changeImg() {
      this.$refs.background.dialogVisible = true;
    },
    code() {
      this.$router.push({path: '/code'});
    },
    showMethods(items) {
      this.formInvitation.show_type = items.show_type;
    },
    // 修改邀请卡信息
    onSubmit() {
      let ids = {
        webinar_id: '923464350',
        room_id: 'ls_123423',
        welcome_txt: '欢迎'
      };
      let obj = Object.assign({}, ids, this.formInvitation);
      this.$fetch('editCardStatus', obj).then(res => {
       console.log(res.data, "保存数据");
      });
      // console.log("保存数据");
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
  /deep/.el-switch.is-checked .el-switch__core::after {
    margin-left: -12px;
  }
  /deep/.el-form-item__label {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1a1a1a;
  }
  /deep/.el-input .el-input__count{
    color:#999;
  }
  /deep/.el-textarea .el-input__count{
    color:#999;
  }
  .invitation-from {
    display: flex;
    height: 100%;
    background: #fff;
    padding: 20px 48px 60px 30px;
    position: relative;
  }
  .form-data {
    padding: 10px 0 10px;
    margin-right: 100px;
  }
  .data-img {
    width: 320px;
    height: 135px;
    position: relative;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-top: 10px;
    img {
      width: 70px;
      height: 130px;
      margin: 0 125px;
      z-index: -10;
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
      border: 1px solid #E6E6E6;
      position: relative;
      height: 125px;
      border: 1px solid transparent;
      .img-tangle{
        position: absolute;
        right: -2px;
        top:-8px;
        /deep/.svg-icon{
          font-size: 24px;
        }
      }
      img {
        width: 100%;
        height: 125px;
      }
      &.isActiveColor{
        box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.3);
        border: 1px solid #FB3A32;
      }
    }

  }
  .invitation-show{
    padding-top: 20px;
    padding-right: 200px;
    p {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1a1a1a;
      padding-bottom: 16px;
    }
    .show-img {
      width: 330px;
      border-radius: 4px;
      border: 1px solid #E2E2E2;
      background-image: url('../../../common/images/v35-webinar.png');
      background-size: cover;
      .show-container{
        margin: 50px 24px;
        width: 282px;
        background: #fff;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
        .show-header{
          padding: 20px 24px;
          text-align: center;
          .show-avator{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 1px solid #ccc;
            margin: auto;
            margin-bottom: 4px;
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
          padding: 15px 24px 30px 24px;
          text-align: center;
          h1{
            padding: 0;
            font-size: 26px;
            color:#1A1A1A;
            font-weight: 600;
            line-height: 37px;
          }
          p{
            font-size: 14px;
            color:#1A1A1A;
            font-weight: 400;
            line-height: 20px;
            padding: 2px 0 5px 0;
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
          display: flex;
          padding: 20px 24px 24px 32px;
          border-top: 1px dashed #ccc;
          .show-code{
            width: 60px;
            height: 60px;
            margin-right: 10px;
            margin-left: 10px;
            img{
              width: 60px;
              height: 60px;
            }
          }
          .show-action{
            h1{
              padding:0;
              font-size: 14px;
              color:#1A1A1A;
              font-weight: 600;
              line-height: 20px;
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
      border-radius: 8px;
      background: #FFFFFF;
      box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.5);
      .watch-bg{
        height: 360px;
        background-image: url('../../../common/images/v35-webinar.png');
        background-size: cover;
        .watch-header{
            padding: 20px 24px;
            text-align: center;
            .watch-avator{
              width: 36px;
              height: 36px;
              border-radius: 50%;
              border: 1px solid #ccc;
              margin: auto;
              margin-bottom: 4px;
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
      h1{
        padding:0;
        font-size: 28px;
        color: #1A1A1A;
        line-height: 40px;
        font-weight: 500;
      }
      p{
        padding:0;
        font-size: 14px;
        color: #666;
        line-height: 22px;
        font-weight: 400;
      }
      .watch-footer{
          display: flex;
          padding-top: 25px;
          // padding: 20px 24px 24px 32px;
          .watch-code{
            width: 67px;
            height: 67px;
            margin-right: 10px;
            margin-left: 10px;
            img{
              width: 67px;
              height: 67px;
            }
          }
          .watch-action{
            h1{
              padding:0;
              font-size: 14px;
              color:#1A1A1A;
              font-weight: 400;
              line-height: 20px;
            }
            p{
              padding:0;
              font-size: 12px;
              color:#666;
              font-weight: 400;
              line-height: 20px;
            }
          }
        }
    }
    }
    .look-img{
      width: 330px;
      color:#fff;
      border-radius: 4px;
      border: 1px solid #E2E2E2;
      background-image: url('../../../common/images/v35-webinar.png');
      background-size: cover;
      .look-header{
        padding: 20px 24px;
        text-align: center;
        .look-avator{
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #ccc;
          margin: auto;
          margin-bottom: 4px;
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
        width: 282px;
        // padding: 15px 24px 30px 24px;
        text-align: center;
        border: 4px solid #fff;
        border-radius: 4px;
        margin: auto;
        margin-top: 10px;
        padding: 20px 0;
        h1{
          padding: 0;
          font-size: 26px;
          font-weight: 600;
          line-height: 40px;
        }
        p{
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color:#fff;
          padding: 5px 15px;
        }
      }
      .look-time{
        margin-top: 20px;
        padding-left: 24px;
        p{
          padding:0;
          line-height: 22px;
          color:#fff;
        }
        span{
          display: inline-block;
          width: 24px;
          height: 2px;
          background: #fff;
        }
      }
      .look-footer{
        display: flex;
        width: 250px;
        margin: 30px 24px;
        background: #000;
        border-radius: 4px;
        opacity: 0.2;
        padding: 10px;
        .look-code{
          width: 60px;
          height: 60px;
          margin-right: 10px;
          margin-left: 10px;
          img{
            width: 60px;
            height: 60px;
          }
        }
        .look-action{
          h1{
            padding:0;
            font-size: 14px;
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
      font-family: PingFangSC-Semibold, PingFang SC;
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
      .invitation-code{
        width: 200px;
        height: 190px;
        text-align: center;
        img{
          width: 190px;
          height: 190px;
        }
      }
    }
  }
  .sureBtn {
    position: absolute;
    bottom: 20px;
    left: 110px;
    /deep/.el-button {
      padding: 9px 60px;
      border-radius: 20px;
      margin: auto;
    }
  }
}
</style>
