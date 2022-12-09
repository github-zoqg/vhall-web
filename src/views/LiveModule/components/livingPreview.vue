<template>
  <el-dialog
    title="预览"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="518px"
  >
    <div class="living_preview">
      <div class="living_preview_wap">
        <p class="wap_code"><img :src="h5WapLink" alt="" /></p>
        <span class="wap_title">手机扫码预览</span>
      </div>
      <div class="living_preview_pc">
        <span class="pc_address">
          <vh-input id="copy-val" size="medium" v-model="link" style="width: 350px">
            <vh-button
              size="small"
              slot="append"
              data-clipboard-target="#copy-val"
              class="copy-preview"
              icon="el-icon-copy-document"
              @click="doCopy"
            ></vh-button>
          </vh-input>
        </span>
        <vh-button size="medium" type="primary" @click="openLink">打开页面</vh-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import Env from '@/api/env';
  export default {
    data() {
      return {
        dialogVisible: false,
        link: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
        h5WapLink: `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`
      };
    },
    methods: {
      // 复制
      doCopy() {
        let clipboard = new this.$clipboard('.copy-preview');
        clipboard.on('success', e => {
          this.$message({
            message: `复制成功`,
            showClose: true,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          e.clearSelection();
          clipboard.destroy();
        });
        clipboard.on('error', e => {
          this.$message({
            message: `复制失败`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          clipboard.destroy();
        });
      },
      // 打开页面
      openLink() {
        window.open(this.link, '_blank');
      }
    }
  };
</script>
<style lang="less" scoped>
  .living_preview {
    &_wap {
      margin-bottom: 20px;
      width: 100%;
      height: 190px;
      background: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .wap_title {
        font-size: 14px;
        color: #595959;
        line-height: 22px;
      }
      .wap_code {
        display: inline-block;
        width: 132px;
        height: 132px;
        border-radius: 4px;
        img {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
    }
    &_pc {
      padding-bottom: 24px;
      .pc_address {
        padding-right: 8px;
      }
    }
  }
</style>
