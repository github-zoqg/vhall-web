<template>
   <el-dialog
      title="直播活动校验"
      width="590px"
      :visible.sync="checkVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      custom-class="choose-viewer"
    >
    <div class="choose-viewer_container">
      <div class="subject_check">
        <div class="check_title">
          本专题下有 <span>{{ 0 || checkList.length }}</span> 个直播被其他专题使用，请从其他专题移除后再更改观看限制
          <p>以下直播被其他专题使用，请前往专题去移除。详情如下:</p>
        </div>
        <div class="check_list">
          <div class="check_list_item" v-for="(item, index) in list" :key="index">
           {{ index + 1 }}、<span>《{{ item.webinar_name }}》</span>属于 <span>《{{ item.subject_name }}》</span> 专题
          </div>
        </div>
      </div>
      <div class="subject_btn">
        <el-button type="primary" size="medium" v-preventReClick round @click="goEditSubject">去修改</el-button>
        <el-button size="medium" v-preventReClick round  @click="checkVisible=false">取消</el-button>
      </div>
    </div>
   </el-dialog>
</template>
<script>
export default {
  props: {
    checkList: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      checkVisible: false,
      list: [
        {
          subject_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示',
          webinar_name: '2222222'
        },
        {
          subject_name: '333333',
          webinar_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示'
        },
        {
          subject_name: '4444444',
          webinar_name: '2222222'
        },
        {
          subject_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示',
          webinar_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示'
        },
        {
          subject_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示',
          webinar_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示'
        },
        {
          subject_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示',
          webinar_name: '我是直播专到底是多少世世代代但是大多数的思思的但是多多少少对的事到底是题文字超多时怎么显示，回行两行显示'
        }
      ]
    }
  },
  methods: {
    goEditSubject() {
      this.$router.push({path: `/special/edit/${this.$route.params.id}`, query: {
        check: true
      }})
    }
  }
}
</script>
<style lang="less" scoped>
  .choose-viewer {
    &_container{
      padding-bottom: 24px;
      .subject_check{
        // margin-bottom: 24px;
        .check_title{
          font-size: 14px;
          color: #1a1a1a;
          line-height: 20px;
          span{
            color: #fb3a32;
          }
          p{
            margin-top: 32px;
            padding-bottom: 5px;
          }
        }
        .check_list{
          height: 285px;
          overflow: auto;
          &_item{
            line-height: 28px;
            font-size: 14px;
            color: #666;
            span{
              color: #1a1a1a;
              font-weight: 600;
            }
          }
        }
      }
      .subject_btn{
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  ::-webkit-scrollbar {
      width:5px !important;
    }
</style>
