<template>
  <div>
    <VhallDialog
      title="提现"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="sureBangWeixin"
      style="margin-top: 20vh"
      width="320px"
    >
      <div class="box-wei">
        <div class="img-box" v-if="qrcode">
          <img
            :src="`//aliqr.e.vhall.com/qr.png?t=${encodeURIComponent(qrcode)}`"
            alt=""
            v-if="qrcode"
          />
          <p>请用微信扫描二维码，绑定收款账户</p>
          <el-button type="primary" class="length120" round @click="sureBangWeixin">确定</el-button>
          <!-- <div class="isUntime">
            <i class="el-icon-refresh-right"></i>
            <p>已超时</p>
            <p>点击重新加载</p>
          </div> -->
        </div>
        <div class="no-bang" v-else>
          <p>您还未绑定账号，请先绑定</p>
          <el-button type="primary" class="length120" round @click="goBangWeixin">
            立即绑定
          </el-button>
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="更改绑定微信"
      :visible.sync="dialogChangeVisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class="box-wei">
        <h3>为了保障您的账号安全，请验证进行安全验证，手机号是当前账号绑定的手机号</h3>
        <el-form label-width="72px">
          <el-form-item label="">
            <div id="payCaptcha" class="captcha">
              <el-input v-model="withdrawForm.text"></el-input>
            </div>
            <p style="color: #fb3a32; padding: 0; line-height: 25px" v-show="errorMsgShow">
              <i class="el-icon-error"></i>
              图形验证码错误
            </p>
          </el-form-item>
          <el-form-item label="动态密码">
            <div class="inputCode">
              <VhallInput v-model.trim="code" style="width: 150px"></VhallInput>
              <span
                @click="mobileKey && time == 60 && getBangCode()"
                :class="mobileKey ? 'isLoginActive' : ''"
              >
                {{ time == 60 ? '获取验证码' : `${time}秒后发送` }}
              </span>
            </div>
            <p class="codeTitle" v-if="phone">已向绑定手机号{{ phone | filterPhone }}发送验证码</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="nextBtn withdrawBtn">
        <el-button type="primary" class="length120" round @click="nextBinding" :disabled="!code">
          下一步
        </el-button>
      </div>
    </VhallDialog>
    <VhallDialog
      title="提现申请"
      :visible.sync="dialogCashVisible"
      :close-on-click-modal="false"
      width="400px"
    >
      <div class="money">
        <p>
          可用金额
          <span>￥{{ money }}</span>
        </p>
      </div>
      <el-form label-width="70px" :model="withdrawForm" :rules="rules" ref="withdrawForm">
        <el-form-item label="提现金额" prop="money">
          <el-input
            v-model.trim="withdrawForm.money"
            style="width: 265px"
            oninput="this.value=this.value.replace(/[^\d^\.]+/g, '')"
            placeholder="请输入提现金额"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div id="payCaptcha" class="captcha">
            <el-input v-model="withdrawForm.text"></el-input>
          </div>
          <p class="errorText" style="color: #fb3a32" v-show="errorMsgShow">
            <i class="el-icon-error"></i>
            图形验证码错误
          </p>
        </el-form-item>
        <el-form-item label="动态密码" prop="code">
          <div class="inputCode">
            <VhallInput
              v-model.trim="withdrawForm.code"
              v-clearEmoij
              style="width: 150px"
            ></VhallInput>
            <span
              @click="time == 60 && getCode()"
              :class="mobileKey && isTrue ? 'isLoginActive' : ''"
            >
              {{ time == 60 ? '获取验证码' : `${time}秒后发送` }}
            </span>
          </div>
          <p class="codeTitle" v-if="phone">已向绑定手机号{{ phone }}发送验证码</p>
        </el-form-item>
        <el-form-item label="到账账户">
          <div class="live-box">
            <img :src="avatar" alt="" />
            {{ nickName }}
            <span @click="changeBinding">更改</span>
          </div>
          <div class="xieyi">
            <el-checkbox v-model="checked">
              同意
              <span @click="getNetWork">《用户兑换协议》</span>
            </el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <div class="nextBtn">
        <el-button
          type="primary"
          class="length120"
          round
          @click="withdraw()"
          :disabled="!(withdrawForm.code && withdrawForm.money && checked)"
        >
          确认
        </el-button>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
  import { sessionOrLocal } from '@/utils/utils';
  import { defaultAvatar } from '@/utils/ossImgConfig';
  export default {
    props: ['money', 'type'],
    data() {
      const _that = this;
      let validateMoney = (rule, value, callback) => {
        if (!/^\d+$|^\d*\.\d+$/g.test(value)) {
          this.isTrue = false;
          callback(new Error('请输入数字值'));
        } else {
          /*if (1 - value > 0 || value - 800 > 0) {
          this.isTrue = false;
          callback(new Error('请输入大于等于1且小于等于800的数字'));
        } else if (value - this.money > 0) {
          this.isTrue = false;
          callback(new Error('提现值必须小于可用金额'));
        } else {
          this.isTrue = true;
          callback();
        }*/
          if (value < 1) {
            this.handleInputChange(value);
            this.isTrue = false;
            callback(new Error('提现金额最少1元'));
          } else if (value - 800 > 0) {
            if (value > 800) {
              _that.withdrawForm.money = 800;
            }
            this.isTrue = true;
            callback();
            // callback(new Error('请输入大于等于1且小于等于800的数字'))
          } else if (value - this.money > 0) {
            this.handleInputChange(value);
            this.isTrue = false;
            callback(new Error('提现值必须小于可用金额'));
          } else {
            this.handleInputChange(value);
            this.isTrue = true;
            callback();
          }
        }
      };
      return {
        dialogVisible: false,
        dialogChangeVisible: false,
        dialogCashVisible: false,
        withdrawForm: {
          code: '',
          money: ''
        },
        code: '',
        isEditWeixin: false,
        phone: '',
        isTrue: false,
        nickName: '微吼直播',
        errorMsgShow: false,
        checked: false,
        time: 60,
        gettime: 60,
        showCaptcha: false,
        showCode: false,
        qrcode: '',
        avatar: '',
        captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
        mobileKey: '', // 云盾值
        captcha: null, // 云盾本身
        rules: {
          money: [{ validator: validateMoney, trigger: 'blur' }]
        }
      };
    },
    watch: {
      dialogCashVisible() {
        if (this.dialogCashVisible) {
          this.time = 60;
          this.mobileKey = '';
          this.phone = '';
          this.errorMsgShow = '';
          this.callCaptcha();
          const cashWechat = JSON.parse(sessionOrLocal.get('cashWechat'));
          this.$nextTick(() => {
            this.avatar = cashWechat.wechat_profile || defaultAvatar;
            this.nickName = cashWechat.wechat_name_wap || '微吼直播';
            console.log('当前用户头像', this.avatar, this.nickName);
          });
        } else {
          this.mobileKey = '';
          this.showCaptcha = false;
          this.withdrawForm.money = '';
          this.withdrawForm.code = '';
          this.errorText = '';
          this.phone = '';
          this.callCaptcha();
          this.$refs['withdrawForm'].resetFields();
          window.clearInterval(this.timer);
        }
      },
      dialogChangeVisible() {
        if (this.dialogChangeVisible) {
          this.callCaptcha();
          this.time = 60;
          this.mobileKey = '';
          window.clearInterval(this.timer);
        } else {
          this.callCaptcha();
          this.time = 60;
          this.mobileKey = '';
          this.phone = '';
          window.clearInterval(this.timer);
        }
      },
      // showCaptcha() {
      //   if (this.mobileKey && this.isTrue) {
      //     this.showCaptcha
      //   }
      // },
      dialogVisible() {
        if (this.dialogVisible) {
          this.qrcode = '';
        }
      }
    },
    created() {
      this.userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
    },
    methods: {
      /**
       * 价格格式限制
       * 只能输入数字和小数点；
       * 小数点只能有1个
       * 第一位不能是小数点
       * 第一位如果输入0，且第二位不是小数点，则去掉第一位的0
       * 小数点后保留2位
       */
      handleInputChange(value) {
        if (value != '') {
          // this.editParams.price = value.replace(/^[0-9]*$/,'')
          // this.editParams.price = value.replace(/[^\d]/g,'')
          let str = value;
          let len1 = str.substr(0, 1);
          let len2 = str.substr(1, 1);
          //如果第一位是0，第二位不是点，就用数字把点替换掉
          if (str.length > 1 && len1 == 0 && len2 != '.') {
            str = str.substr(1, 1);
          }
          //第一位不能是.
          if (len1 == '.') {
            str = '';
          }
          //限制只能输入一个小数点
          if (str.indexOf('.') != -1) {
            let str_ = str.substr(str.indexOf('.') + 1);
            if (str_.indexOf('.') != -1) {
              str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1);
            }
          }
          //正则替换，保留数字和小数点
          str = str.replace(/[^\d^\.]+/g, '');
          //如果需要保留小数点后两位，则用下面公式
          if (str.indexOf('.') > -1 && str.length - str.indexOf('.') > 3) {
            str = str.slice(0, str.indexOf('.') + 3);
            this.$message({
              message: '金额最多支持两位小数',
              showClose: true,
              // duration: 0,
              type: 'warning',
              customClass: 'zdy-info-box'
            });
          }
          this.withdrawForm.money = str;
        }
      },
      // 获取用户微信昵称
      // getWeinName() {
      //   this.userInfo.user_thirds.map(item => {
      //     if (item.type == 3) {
      //       this.nickName = item.nick_name;
      //     }
      //   });
      // },
      // 提现短信验证码
      getCode() {
        this.$refs['withdrawForm'].validate(valid => {
          if (valid) {
            if (this.mobileKey && this.withdrawForm.money) {
              this.$fetch('withdrawalPhoneCode', {
                // user_id: this.userInfo.user_id,
                captcha: this.mobileKey,
                user_type: 1
              })
                .then(res => {
                  this.phone = res.data.phone;
                  this.countDown();
                })
                .catch(res => {
                  this.$message({
                    message: res.msg || '操作失败',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                  console.log(res);
                });
            }
          } else {
            return false;
          }
        });
      },
      // 提现
      withdraw() {
        this.$refs['withdrawForm'].validate(valid => {
          if (valid) {
            this.withdrawMoney();
          } else {
            console.log('验证未通过');
            return false;
          }
        });
      },
      withdrawMoney() {
        let params = {
          // user_id: this.userInfo.user_id,
          verification_code: this.withdrawForm.code,
          fee: this.withdrawForm.money,
          type: this.type,
          user_type: 1
        };
        this.$fetch('withdrawal', params)
          .then(res => {
            if (res.code == 200) {
              this.$message({
                message: `提现成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.dialogCashVisible = false;
              this.$emit('onreload');
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || '提现失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
      },
      // 绑定微信短信验证码
      getBangCode() {
        if (!this.mobileKey) {
          this.$message({
            message: `图形验证码错误`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        this.phone = this.userInfo.phone;
        let params = {
          type: 1,
          data: this.userInfo.phone,
          scene_id: 6,
          validate: this.mobileKey
        };
        this.$fetch('sendCode', params)
          .then(res => {
            this.countDown();
          })
          .catch(res => {
            this.$message({
              message: res.msg || '发送验证码失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.callCaptcha();
            console.log(res);
          });
      },
      // 绑定微信 ---获取绑定微信二维码
      goBangWeixin() {
        //获取key值
        this.$fetch('getBindKey')
          .then(res => {
            if (res.code == 200) {
              this.qrcode = `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/weixin?source=wap&jump_url=${process.env.VUE_APP_WAP_WATCH}/lives/bindB/${res.data.mark}`;
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || '获取信息失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
        console.log(this.qrcode);
      },
      sureBangWeixin() {
        this.dialogVisible = false;
        if (this.qrcode) {
          this.$fetch('getInfo', { scene_id: 2 })
            .then(res => {
              if (res.code === 200) {
                if (this.isEditWeixin) {
                  this.$vhall_paas_port({
                    k: 100753,
                    data: {
                      business_uid: res.data.user_id,
                      user_id: '',
                      webinar_id: '',
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
                sessionOrLocal.set('userInfo', JSON.stringify(res.data));
                sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
                window.location.reload();
              }
            })
            .catch(e => {
              console.log(e);
            });
          // window.location.reload();
        }
      },
      getNetWork() {
        this.$vhall_paas_port({
          k: 100754,
          data: {
            business_uid: this.userInfo.user_id,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        let href = `https://e.vhall.com/home/vhallapi/exchangeagreement`;
        window.open(href, '_blank');
      },
      /**
       * 倒计时函数
       */
      countDown() {
        if (this.time) {
          this.time--;
          this.timer = setTimeout(() => {
            this.countDown();
          }, 1000);
        } else {
          this.time = 60;
          this.mobileKey = '';
          this.callCaptcha();
        }
      },
      changeBinding() {
        this.qrcode = '';
        this.dialogChangeVisible = true;
        this.dialogCashVisible = false;
        this.time = 60;
        this.callCaptcha();
      },
      nextBinding() {
        let params = {
          type: 1,
          data: this.phone,
          code: this.code,
          scene_id: 6
        };
        this.$fetch('codeCheck', params)
          .then(res => {
            if (res.code == 200) {
              this.isEditWeixin = true;
              this.dialogChangeVisible = false;
              this.goBangWeixin();
              this.dialogVisible = true;
              this.time = 60;
            }
          })
          .catch(res => {
            this.$message.error('验证失败');
          });
      },
      /**
       * 初始化网易易盾图片验证码
       */
      callCaptcha() {
        const that = this;
        // eslint-disable-next-line
        initNECaptcha({
          captchaId: this.captchakey,
          element: '#payCaptcha',
          mode: 'float',
          onReady(instance) {
            console.log('instance', instance);
          },
          onVerify(err, data) {
            if (data) {
              that.mobileKey = data.validate;
              console.log('data>>>', data);
              that.errorMsgShow = false;
            } else {
              that.mobileKey = '';
              console.log('errr>>>', err);
              that.errorMsgShow = true;
            }
          },
          onload(instance) {
            console.log('onload', instance);
            that.captcha = instance;
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  /deep/.el-dialog__body {
    padding: 10px 20px 30px 20px;
  }
  /deep/.el-dialog__title {
    font-weight: 500;
  }
  /deep/.el-input__inner:focus {
    border-color: #ccc;
  }
  /deep/.el-input__inner {
    border-radius: 2px;
    padding: 0 12px;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #666;
  }
  /deep/.el-button.is-round {
    padding: 7px 32px;
  }
  .length120 {
    width: 120px;
    text-align: center;
  }
  .codeTitle {
    line-height: 20px;
    padding-top: 5px;
  }
  .box-wei {
    // padding-bottom: 20px;
    // .el-form-item{
    //   margin-bottom: 20px;
    // }
    .img-box {
      // width: 132px;
      // height: 132px;
      margin: 0 auto;
      text-align: center;
      padding-bottom: 24px;
      img {
        width: 132px;
        height: 132px;
      }
      p {
        padding-bottom: 20px;
      }
    }
    h3 {
      color: #1a1a1a;
      font-weight: 400;
      padding: 20px 0;
      line-height: 20px;
      font-size: 14px;
    }
    p {
      font-size: 14px;
      color: 999;
      text-align: center;
      padding-top: 8px;
    }
    .no-bang {
      padding: 24px 0;
      text-align: center;
      p {
        padding-bottom: 50px;
      }
    }
    .isUntime {
      text-align: center;
      padding-top: 30px;
      cursor: pointer;
      i {
        font-size: 40px;
      }
    }
    .code-data {
      // display: flex;
      padding: 0 10px;
      border: 1px solid #ccc;
      span {
        padding-right: 10px;
        color: #1a1a1a;
        font-weight: 600;
      }
      p {
        // padding-left: 48px;
        line-height: 20px;
        color: #666;
      }
    }
  }
  .code {
    border: 1px solid #ccc;
    border-left: none;
    cursor: pointer;
    display: inline-block;
    width: 120px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    border-radius: 4px;
    margin-left: -5px;
    background: #f2f2f2;
    font-size: 13px;
    color: #666;
  }
  .inputCode {
    height: 38px;
    width: 265px;
    border: 1px solid #ccc;
    border-radius: 2px;
    /deep/.el-input__inner {
      border: none;
      height: 38px;
    }
    span {
      display: inline-block;
      width: 113px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      background: #f2f2f2;
      color: #666666;
      vertical-align: top;
      cursor: not-allowed;
      &.isLoginActive {
        background: #fc5659;
        color: #fff;
        cursor: pointer;
      }
    }
    // i {
    //   font-weight: normal;
    //   color: #ff0000;
    // }
  }
  .money {
    padding: 20px;
    p {
      text-align: center;
      font-size: 14px;
      span {
        color: #1a1a1a;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  .live-box {
    line-height: 22px;
    padding-top: 8px;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #ccc;
      vertical-align: top;
    }
    span {
      font-size: 14px;
      color: #3562fa;
      padding-left: 5px;
      cursor: pointer;
    }
  }
  .xieyi {
    font-size: 14px;
    color: #666;
    span {
      color: #3562fa;
    }
  }
  .nextBtn {
    text-align: center;
    padding-bottom: 24px;
  }
  .withdrawBtn {
    // padding-top: 20px;
  }
  .captcha {
    /deep/.yidun_slider {
      .yidun_slider__icon {
        background-image: url(./images/icon-slide1.png) !important;
        background-size: 28px 20px !important;
        background-position: center !important;
        margin-top: -5px !important;
      }
      &:hover {
        // background-color: #FB3A32;
        .yidun_slider__icon {
          background-image: url(./images/icon-slide.png) !important;
        }
      }
    }
    /deep/ .yidun--success {
      .yidun_control {
        .yidun_slider__icon {
          background-image: url(./images/icon-succeed.png) !important;
        }
        .yidun_slider {
          .yidun_slider__icon {
            background-image: url(./images/icon-succeed.png);
            background-size: 28px 20px;
            background-position: center;
          }
          &:hover {
            // background-color: #FB3A32;
            .yidun_slider__icon {
              background-image: url(./images/icon-succeed.png);
              background-size: 28px 20px;
              background-position: center;
            }
          }
        }
      }
    }
    .yidun.yidun--light {
      .yidun_feedback {
        background-position: 0px -240px;
        height: 30px;
      }
      .yidun_refresh {
        background-position: 0px -339px;
      }
    }
  }
</style>
