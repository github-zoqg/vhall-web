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
          本专题下有 <span>{{ 0 || checkList.length }}</span> 个直播被重复使用，先移除重复直播才可统一设置观看权限。
          <p>详情如下:</p>
        </div>
        <div class="check_list">
          <div class="check_list_item" v-for="(item, index) in checkList" :key="index">
           {{ index + 1 }}、<span>《{{ item.webinar_name }}》</span>属于 <span @click="goEditSubject(item.subject_id)" class="color_blue">《{{ item.subject_name }}》</span> 专题
          </div>
        </div>
      </div>
      <div class="subject_btn">
        <el-button type="primary" size="medium" v-preventReClick round  @click="checkVisible=false">确定</el-button>
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
      checkVisible: false
    }
  },
  methods: {
    goEditSubject(id) {
      window.open(`${process.env.VUE_APP_WEB_URL}/subject/edit/${id}?title=编辑`, '_blank')
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
            margin-top: 24px;
            padding-bottom: 8px;
          }
        }
        .check_list{
          height: 285px;
          overflow: auto;
          &_item{
            line-height: 30px;
            font-size: 14px;
            color: #666;
            span{
              color: #1a1a1a;
              font-weight: 500;
            }
            .color_blue{
              color: #3562FA;
              cursor: pointer;
              font-weight: 400;
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
