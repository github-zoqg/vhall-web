<template>
  <el-dialog
    title="预览"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    width="520px"
  >
    <div class="living_preview">
      <div class="living_preview_wap">
        <span class="wap_title">移动端H5:</span>
        <span class="wap_code"><img :src="h5WapLink" alt=""></span>
      </div>
      <div class="living_preview_pc">
        <span class="pc_title">PC观看页:</span>
        <span class="pc_address">
          <el-input id="copy-val" v-model="link" style="width: 200px"></el-input>
          <el-button round size="small" type="primary" data-clipboard-target="#copy-val" class="copy-preview" @click="doCopy">复制</el-button>
          <el-button round size="small" @click="openLink">打开页面</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import Env from '@/api/env'
export default {
  data() {
    return {
      dialogVisible: false,
      link: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      h5WapLink: `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
    }
  },
  methods: {
    // 复制
    doCopy() {
      let clipboard = new this.$clipboard('.copy-preview')
      clipboard.on('success', (e) => {
        this.$message({
          message: `复制成功`,
          showClose: true,
          type: 'success',
          customClass: 'zdy-info-box',
        })
        e.clearSelection()
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$message({
          message: `复制失败`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box',
        })
        clipboard.destroy()
      })
    },
    // 打开页面
    openLink() {
      window.open(this.link, '_blank')
    },
  }
}
</script>
<style lang="less" scoped>
  .living_preview{
    &_wap{
      margin-bottom: 24px;
      .wap_title{
        font-size: 14px;
        color: #1a1a1a;
        padding-right: 12px;
      }
      .wap_code{
        display: inline-block;
        width: 120px;
        height: 120px;
        border-radius: 4px;
        vertical-align: top;
        img{
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
    }
    &_pc{
      padding-bottom: 32px;
      .pc_title{
        padding-right: 12px;
      }
      .el-input{
        padding-right: 8px;
      }
    }
  }
</style>
