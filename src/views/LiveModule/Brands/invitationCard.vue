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
        <span>扫码查看</span>
        <span>本地预览</span>
      </div>
    </div>
    <div class="invitation-from">
      <div class="form-data">
        <el-form ref="formData" :model="formInvitation" label-width="100px">
          <el-form-item label="邀请卡背景">
            <div class="data-img">
              <img src="@/common/images/v35-webinar.png" alt="" />
              <span class="choseImg" @click="changeImg">重新选择</span>
            </div>
          </el-form-item>
          <el-form-item label="展示方式">
            <div class="data-show">
              <p v-for="(item, index) in showList" :key="index" :class="item.isCheck ? 'isActiveColor' : ''">
                <label class="img-tangle" v-show="item.isCheck">
                  <i class="el-icon-check"></i>
                </label>
                <img :src="item.url" alt="" @click="showMethods(item)"/>
              </p>
            </div>
          </el-form-item>
          <el-form-item label="邀请卡标题">
            <el-input
              v-model="formInvitation.title"
              maxlength="16"
              show-word-limit
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="主办方">
            <el-input
              v-model="formInvitation.mainHost"
              maxlength="10"
              show-word-limit
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              style="width: 320px"
              v-model="formInvitation.time"
              type="datetime"
              placeholder="选择时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="活动地点">
            <el-input
              v-model="formInvitation.adress"
              maxlength="20"
              show-word-limit
              style="width: 320px"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动简介">
            <el-input
              style="width: 320px"
              v-model="formInvitation.introduction"
              type="textarea"
              maxlength="45"
              :autosize="{ minRows: 5 }"
              resize="none"
              show-word-limit
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="隐藏水印">
                <el-switch
                  v-model="formInvitation.hideWaterMark"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                >
                </el-switch>
              </el-form-item> -->
        </el-form>
      </div>
      <div class="invitation-show">
        <p>移动端预览</p>
        <div class="show-img"></div>
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
export default {
  data() {
    return {
      invitation: true,
      formInvitation: {},
      showList: [
        {
          url: '@/common/images/v35-webinar.png',
          isCheck: true
        },
        {
          url: '@/common/images/v35-webinar.png',
          isCheck: false
        },
        {
          url: '@/common/images/v35-webinar.png',
          isCheck: false
        }
      ]
    };
  },
  components: {
    addBackground
  },
  methods: {
    changeImg() {
      this.$refs.background.dialogVisible = true;
    },
    showMethods(items) {
       this.showList.map(item => {
        item.isCheck = false;
        items.isCheck = true;
      });
    },
    onSubmit() {
      console.log("保存数据");
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
    flex: 1;
    padding: 10px 0 10px;
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
      .img-tangle{
        position: absolute;
        right: 0;
        top:0;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-right-color: #FB3A32;
        border-top-color: #FB3A32;
        i{
          color:#fff;
          position: absolute;
          top: -8px;
          right:-11px;
          font-size: 10px;
        }
      }
      img {
        width: 100%;
        height: 125px;
      }
    }
    .isActiveColor{
      box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.3);
      border: 1px solid #FB3A32;
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
      height: 622px;
      border-radius: 4px;
      border: 1px solid #E2E2E2;
      background-image: url('../../../common/images/v35-webinar.png');
      background-size: cover;
    }
    // height: 200px;
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
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666;
        padding: 5px 20px;
        border-radius: 20px;
        border: 1px solid #ccc;
        margin-left: 12px;
      }
    }
  }
  .sureBtn {
    position: absolute;
    bottom: 32px;
    left: 45%;
    /deep/.el-button {
      padding: 9px 60px;
      border-radius: 20px;
      margin: auto;
    }
  }
}
</style>
