<template>
  <div class="offical-show">
    <pageTitle title="公众号展示"></pageTitle>
    <div class="show-on">
      <el-switch
        v-model="isShowOffical"
        active-color="#ff4949"
        inactive-color="#ccc"
        :active-text="activeTitle"
        >
      </el-switch>
    </div>
    <el-card>
      <div class="form-phone">
        <div class="official-form">
          <el-form label-width="80px">
            <el-form-item label="二维码">
              <div class="img-box">
                <upload
                    class="giftUpload"
                    v-model="imgUrl"
                    >
                    <p slot="tip">推荐尺寸：400*225px，小于2MB <br> 支持jpg、gif、png、bmp</p>
                  </upload>
              </div>
            </el-form-item>
            <el-form-item label="自动弹出">
            <el-switch
              v-model="autoUp"
              active-color="#ff4949"
              inactive-color="#ccc"
              :active-text="activeTitle"
              >
              </el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" round>保存</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="official-phone">
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      isShowOffical: false,
      autoUp: false
    };
  },
  computed: {
    activeTitle(){
      if(this.isShowOffical){
        return '已开启，进入活动页面时展示公众号';
      }else{
        return "开启后，进入活动页面时展示公众号";
      }
    },
    autoUpText(){
      if(this.autoUp){
        return '已开启，进入活动页公众中自动展示';
      }else{
        return "开启后，进入活动页公众中自动展示";
      }
    }
  },
  components: {
    PageTitle,
    upload
  }
};
</script>
<style lang="less" scoped>
  .offical-show{
    .show-on{
      position: absolute;
      top: 42px;
      left: 200px;
      /deep/.el-switch__label.is-active{
        color: #1a1a1a;
      }
    }
    .form-phone{
      display: flex;
      padding: 30px 12px;
    }
    .official-form{
      width: 450px;
      margin-right: 200px;
      /deep/.el-button{
        margin-top: 100px;
        // padding: 10px 45px;
      }
    }
    .official-phone{
      width: 326px;
      height: 631px;
      background-image: url('../../../common/images/h5-show-phone.png');
      background-size: cover;
      margin-top: -15px;
    }
  }
</style>
