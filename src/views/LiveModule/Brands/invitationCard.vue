<template>
  <div class="invitation-card">
    <div class="title-data">
      <span>邀请卡</span>
      <el-switch
        style="display: block"
        v-model="invitation"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        active-text="开启后，观众可以在观看页面生成邀请卡，邀请好友观看"
      >
      </el-switch>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="form-data">
          <el-form ref="formData" :model="formInvitation" label-width="100px">
            <el-form-item label="封面背景">
              <div class="data-img">
                <img src="@/common/images/v35-webinar.png" alt="" />
                <transition name="el-fade-in">
                  <span class="choseImg">选择封面</span>
                </transition>
              </div>
            </el-form-item>
            <el-form-item label="展示方式">
              <div class="data-show">
                <p><img src="@/common/images/v35-webinar.png" alt="" /></p>
                <p><img src="@/common/images/v35-webinar.png" alt="" /></p>
                <p><img src="@/common/images/v35-webinar.png" alt="" /></p>
                <p><img src="@/common/images/v35-webinar.png" alt="" /></p>
              </div>
            </el-form-item>
            <el-form-item label="标题">
              <el-input
                v-model="formInvitation.title"
                maxlength="16"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="主办方">
              <el-input v-model="formInvitation.mainHost" maxlength="10" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <el-input v-model="formInvitation.time" maxlength="10" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="活动地点">
              <el-input v-model="formInvitation.adress" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="活动简介">
              <el-input
                v-model="formInvitation.introduction"
                type="textarea"
                maxlength="45"
                :autosize="{ minRows: 5 }"
                resize=none
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="隐藏水印">
              <el-switch
                v-model="formInvitation.hideWaterMark"
                active-color="#13ce66"
                inactive-color="#ccc"
              >
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          这是移动端或者pc端预览
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      invitation: false,
      formInvitation: {},
    };
  },
};
</script>
<style lang="less" scoped>
.invitation-card {
  .form-data {
    border: 1px solid #ccc;
    background: #fff;
    padding:20px;
  }
  .data-img {
    width: 150px;
    height: 100px;
    position: relative;
    img {
      width: 100%;
    }
    .choseImg{
      width: 100%;
      display: inline-block;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color:#fff;
      background: rgba(0, 0, 0, .6);
      position: absolute;
      bottom: 16px;
      left:0;
      cursor: pointer;
      display: none;
    }
    &:hover .choseImg{
      // visibility: visible;
      display: block;
      // transition: all 1s ease-in-out;
    }
  }
  .data-show {
    margin-right: 100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      width: 23%;
      img {
        width: 100%;
        height: 150px;
      }
    }
  }
  .grid-content{
    border: 1px solid #ccc;
    height: 200px;
  }
  .title-data {
    margin: 10px 0 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
    }
    .button-tip {
      vertical-align: top;
    }
  }
}
</style>
