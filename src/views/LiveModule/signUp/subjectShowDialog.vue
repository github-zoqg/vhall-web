<template>
    <VhallDialog :visible='visible' title="提示" width='400px' @close="closeDialog" class="subject-show-dialog">
      <!--
        // 直播没有绑定任何专题： 本直播不属于任何专题，本次设置的报名表单生效，观看直播需要填写此报名表单。
        // 绑定专题但没有设置观看限制： 本直播属于专题《客户的力量》，该专题无统一的观看限制，本次设置的报名表单生效，观看直播需要填写此报名表单。
        // 被XXX专题绑定，本次观看限制失效： 本直播属于专题《客户的力量》，该专题提供统一的观看限制-白名单，本直播报名表单失效。
        // 被XXX专题绑定，被设置统一报名表单，本次失效： 本直播属于专题《客户的力量》，该专题提供统一的报名表单，本直播报名表单失效。
        -->
      <div class="tip_content" v-if="resultVo && resultVo.total == 0">本直播不属于任何专题，本次设置的报名表单生效，观看直播需要填写此报名表单。</div>
      <div class="tip_content" v-else-if="resultVo && resultVo.total == 1">
        本直播属于专题<span class="color_blue cursor_pointer" v-if="resultVo && resultVo.list" @click="goSubjectDetail(resultVo.list[0].subject_id)">《{{ subjectTitle }}》</span>，
        <template v-if="verifyText">
          该专题提供统一的 {{ verifyText }} 本直播报名表单<span class="color_red">失效</span>。
        </template>
        <template v-else>
          该专题无统一的观看限制，本次设置的报名表单生效，观看直播需要填写此报名表单。
        </template>
        <!-- {{ verifyText === '' ? '该专题无统一的观看限制，本次设置的报名表单生效，观看直播需要填写此报名表单。' : `该专题提供统一的${verifyText}，本直播报名表单失效。`}} -->
      </div>
      <div class="tip_content" v-else-if="resultVo && resultVo.total > 1">本直播属于多个专题，这些专题无统一的观看限制，本次设置的报名表单生效，观看直播需要填写此报名表单。</div>
      <div class="tip_content" v-else>依据活动ID获取其归属专题信息失败，请联系管理员</div>
      <div slot='footer'>
        <el-button type="primary" size="medium" round v-preventReClick @click.prevent.stop="closeDialog">我知道了</el-button>
      </div>
    </VhallDialog>
</template>
<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 活动ID 或者 专题ID，跟signUpPageType字段组合使用
    webinarOrSubjectId: {
      type: [Number, String],
      default: 0
    },
    // 报名表单类型：webinar--活动；subject--专题
    signUpPageType: {
      type: [Number, String],
      default: ''
    }
  },
  data(){
    return {
      visible: false,
      resultVo: null
    }
  },
  created(){
    this.getVerifyInfo()
  },
  computed: {
    verifyText() {
      if (this.resultVo && this.resultVo.list) {
        if (this.resultVo.list[0].subject_verify == 2) {
          return '观看限制-报名表单'
        } else if (this.resultVo.list[0].subject_verify == 1 && this.resultVo.list[0].verify == 1) {
          return '观看限制-密码'
        } else if (this.resultVo.list[0].subject_verify == 1 && this.resultVo.list[0].verify == 2) {
          return '观看限制-白名单'
        } else if (this.resultVo.list[0].subject_verify == 1 && this.resultVo.list[0].verify == 4) {
          return '观看限制-邀请码（原F码）'
        } else if (this.resultVo.list[0].subject_verify == 1 && this.resultVo.list[0].verify == 0) {
          return '观看限制-免费'
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    subjectTitle() {
      if (this.resultVo && this.resultVo.list) {
        if (this.resultVo.list[0].title && this.resultVo.list[0].title.length > 10) {
          return this.resultVo.list[0].title.substr(0, 10) + '...'
        } else if (this.resultVo.list[0].title) {
          return this.resultVo.list[0].title
        } else {
          return '--'
        }
      } else {
        // 无内容，默认占位
        return '--'
      }
    }
  },
  beforeDestroy(to, from, next) {
    if (this.vm) {
      this.vm.close();
    }
    next();
  },
  methods: {
    initAuthMessage() {
      let that = this;
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        // message: `本直播属于专题《 `,
        message: '<p style="color:#1A1A1A; padding-right: 12px">本直播属于专题《<span id="openSubjectDetails" style="color:#3562fa;cursor: pointer;">'+ that.subjectTitle +'</span>》该专题提供统一的'+ that.verifyText +'  本直播观看限制 <span style="color:#FB3A32">失效   </span></p>',
        type: 'warning'
      });
      let open = document.querySelector('#openSubjectDetails');
        open.addEventListener('click', function(e){
          that.vm.close();
          that.goSubjectDetail();
      });
    },
    getVerifyInfo() {
      this.$fetch('getSubjectByWebinarId', {
        webinar_id: this.webinarOrSubjectId,
        pos: 0,
        limit: 2
      }).then(resV => {
        if (resV && resV.code == 200 && resV.data) {
          this.resultVo = resV.data
          console.log(this.resultVo, '我是报名表单')
          if (this.resultVo && this.resultVo.total == 1 && this.verifyText) {
            this.initAuthMessage()
          }
        } else {
          this.resultVo = null
        }
      }).catch(resV => {
        console.log('获取数据失败', resV)
        this.resultVo = null
      });
    },
    // 关闭
    closeDialog() {
      this.visible = false;
    },
    // 跳转专题界面
    goSubjectDetail() {
      window.open(`${process.env.VUE_APP_WEB_URL}/special/edit/${this.resultVo.list[0].subject_id}?title=编辑`, '_blank')
    }
  }
};
</script>

<style lang="less" scoped>
.subject-show-dialog {
  .tip_content {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    min-height: 40px;
    color: #1A1A1A;
  }
  .cursor_pointer {
    cursor: pointer;
  }
  .color_blue{
    color: #3562fa;
  }
  .color_red{
    color: #FB3A32;
  }
}
</style>
