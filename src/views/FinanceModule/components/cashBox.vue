<template>
  <div>
    <el-dialog
      title="提现"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="320px"
    >
    <div class="box-wei">
      <div class="img-box">
        <div class="isUntime">
          <i class="el-icon-refresh-right"></i>
          <p>已超时</p>
          <p>点击重新加载</p>
        </div>
      </div>
      <p>您还未绑定账号，请先绑定</p>
    </div>
    <div class="nextBtn">
      <el-button type="primary" round size="medium">立即绑定</el-button>
    </div>
  </el-dialog>
  <el-dialog
      title="更改绑定微信"
      :visible.sync="dialogChangeVisible"
      :close-on-click-modal="false"
      width="400px"
    >
    <div class="box-wei">
      <h3>为了保障您的账号安全，请验证进行安全验证，手机号是当前账号绑定的手机号</h3>
      <div class="code-data">
        <span>动态密码</span>
        <el-input placeholder="验证码" v-model="code" style="width: 150px">
        </el-input>
        <b class="code" @click="getCode"><i v-show="!getCodeBtnDisable">{{ waitTime }}s</i>{{ codeBtnWord }}</b>
        <p>已向绑定手机号159****3421发送验证码</p>
      </div>
    </div>
    <div class="nextBtn">
      <el-button type="primary" round size="medium" :disabled="!code">下一步</el-button>
    </div>
  </el-dialog>
  <el-dialog
      title="提现申请"
      :visible.sync="dialogCashVisible"
      :close-on-click-modal="false"
      width="400px"
    >
    <div class="money">
      <p>可用金额<span>￥40.00</span></p>
    </div>
    <el-form label-width="85px">
        <el-form-item label="提现金额">
          <el-input v-model="money" style="width: 265px" placeholder="请输入提现金额"></el-input>
        </el-form-item>
        <el-form-item label="动态密码" >
          <el-input v-model="code" style="width: 150px"></el-input>
          <b class="code" @click="getCode"><i v-show="!getCodeBtnDisable">{{ waitTime }}s</i>{{ codeBtnWord }}</b>
          <p class="codeTitle">已向绑定手机号159****3421发送验证码</p>
        </el-form-item>
        <el-form-item label="到账账户">
          <div class="live-box"><img src="../../../common/images/logo.png" alt=""> 微吼直播 <span>更改</span></div>
          <div class="xieyi">
            <el-checkbox v-model="checked">同意<span>《用户兑换协议》</span></el-checkbox>
          </div>
        </el-form-item>
      </el-form>
    <div class="nextBtn">
      <el-button type="primary" round size="medium">确认</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['type'],
  data() {
    return {
      dialogVisible: false,
      dialogChangeVisible: false,
      dialogCashVisible: false,
      code: '',
      money: '',
      waitTime: 60,
      codeBtnWord: '获取验证码',
      getCodeBtnDisable: true
    };
  },
  methods: {
    getCode() {
      if (!this.getCodeBtnDisable) {
        return;
      }
      console.log("1111111111111");
      this.phoneTimer();
    },
    phoneTimer() {
      const that = this;
      that.waitTime--;
      that.getCodeBtnDisable = false;
      // this.codeBtnWord = `${this.waitTime}s 后重新获取`;
      this.codeBtnWord = ` 后重新获取`;
      console.log('获取时间的值2：' + this.waitTime);
      const timer = setInterval(function() {
        if (that.waitTime > 1) {
          that.waitTime--;
          that.codeBtnWord = ` 后重新获取`;
        } else {
          clearInterval(timer);
          that.codeBtnWord = '获取验证码';
          that.getCodeBtnDisable = true;
          that.waitTime = 60;
        }
      }, 1000);
    },
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body{
  padding:10px 20px 30px 20px;
}
/deep/.el-dialog__title{
  font-size: 16px;
  font-weight: 500;
}
/deep/.el-input__inner:focus{
  border-color: #ccc;
}
/deep/.el-input-group__append{
  color: #666;
  padding: 0 10px;
}
/deep/.el-checkbox__input.is-checked+.el-checkbox__label{
  color: #666;
}
  .box-wei{
    .img-box{
      width: 132px;
      height: 132px;
      background: #F7F7F7;
      margin: 0 auto;
    }
    h3{
      color: #1A1A1A;
      font-weight: 400;
      padding: 20px 10px;
      line-height: 20px;
    }
    p{
      font-size: 14px;
      color:999;
      text-align: center;
      padding-top: 8px;
    }
    .isUntime{
      text-align: center;
      padding-top: 30px;
      cursor: pointer;
      i{
        font-size: 40px;
      }
    }
    .code-data{
      padding: 0 10px;
      span{
        padding-right: 10px;
        color: #1A1A1A;
        font-weight: 600;
      }
      p{
        padding-left: 48px;
        line-height: 20px;
        color:#666;
      }
    }
  }
  .code{
        border: 1px solid #ccc;
        border-left: none;
        cursor: pointer;
        display: inline-block;
        width: 120px;
        height:38px;
        line-height: 38px;
        text-align: center;
        border-radius: 4px;
        margin-left: -5px;
        background: #F2F2F2;
        font-size: 13px;
        color:#666;
      }
      i{
        font-weight: normal;
        color:#FF0000;
      }
  .money{
    padding: 20px;
    p{
      text-align: center;
      font-size: 14px;
      span{
        color:#1A1A1A;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  .live-box{
    line-height: 22px;
    padding-top: 8px;
    img{
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #ccc;
        vertical-align: top;
      }
    span{
      font-size: 14px;
      color:#3562FA;
      padding-left: 5px;
    }
  }
  .xieyi {
    font-size: 14px;
    color: #666;
    span {
      color: #3562fa;
    }
  }
  .nextBtn{
    text-align: center;
    padding-top: 30px;
    .el-button{
      padding: 10px 38px;
    }
  }
</style>
