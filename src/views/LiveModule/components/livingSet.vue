<template>
  <div class="living-setting">
    <div class="living-setting_form">
       <el-form :model="livingForm" ref="livingForm" :rules="livingFormRules" label-width="100px">
          <el-form-item label="主题色">
            <color-set ref="pageThemeColors"  :themeKeys=pageThemeColors  :colorDefault="livingForm.pageStyle"></color-set>
          </el-form-item>
          <el-form-item label="主题背景" prop="bg_url">
            <!-- <upload
              class="upload__skin"
              v-model="livingForm.bg_url"
              :domain_url="domain_url"
              :saveData="{
                 path: 'interacts/skin-imgs',
                 type: 'image',
              }"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :heightImg="130"
              :widthImg="231"
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl">
              <div slot="tip">
                <p>建议尺寸：1920*1080px，小于4M</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload> -->
          </el-form-item>
          <el-form-item label="模糊程度">
            <el-slider v-model="livingForm.vague" style="width: 315px"></el-slider>
            <span class="isNum">{{livingForm.vague}}%</span>
          </el-form-item>
          <el-form-item label="亮度">
            <el-slider v-model="livingForm.light" style="width: 315px"></el-slider>
            <span class="isNum">{{livingForm.light}}%</span>
          </el-form-item>
          <el-form-item label="聊天布局">
             <el-radio-group v-model="livingForm.chatLayout">
              <el-radio :label="0">上下显示</el-radio>
              <el-radio :label="1">左右显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <p>-以下设置对pc端和移动端同时生效-</p>
          <el-form-item label="视频区【连麦】布局">

          </el-form-item>
           <el-form-item label="视频区底色">

          </el-form-item>
          <!-- <el-form-item label="">
            <el-button type="primary" v-preventReClick round @click.prevent.stop="skinSetSave">保 存</el-button>
          </el-form-item> -->
        </el-form>
    </div>
    <div class="living-setting_opera">
      <el-button size="medium" round v-preventReClick>恢复默认</el-button>
      <el-button type="white-medium" size="medium" round v-preventReClick @click="goPreviewLiving">预览</el-button>
      <el-button type="primary" size="medium" round v-preventReClick>保存</el-button>
    </div>
    <living-preview ref="livingPreview"></living-preview>
  </div>
</template>
<script>
import livingPreview from './livingPreview.vue';
import ColorSet from '@/components/ColorSelect';
export default {
  name: 'livingSet',
  data() {
    return {
      pageThemeColors: ['1A1A1A', 'FB3A32', 'FFB201', '16C973', '3562FA', 'DC12D2'],
      livingForm: {
        pageStyle: '#1A1A1A',
        bg_url: '',
        vague: 60,
        light: 50,
        chatLayout: 0
      }
    }
  },
  components: {
    livingPreview,
    ColorSet
  },
  created() {
    this.initComp()
  },
  methods: {
    initComp(){
      console.log('我是初始化接口')
    },
    goPreviewLiving(){
      this.$refs.livingPreview.dialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
  .living-setting{
    padding-top: 32px;
  }
</style>
