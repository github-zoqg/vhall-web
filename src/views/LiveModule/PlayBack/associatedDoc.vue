<template>
  <el-dialog
    title="关联文档"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="810px"
  >
    <!-- <div class="tabs">
      <div :class="{active: tabs==1}">1.选择文档</div>
      <div :class="{active: tabs==2}">2.生成章节</div>
    </div> -->
    <template>
      <el-table
        ref="docList"
        :data="docList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          width="55">
        </el-table-column>
        <el-table-column
          prop="file_name"
          label="文档名称"></el-table-column>
        <el-table-column
          prop="created_at"
          label="上传日期"
          width="170">
        </el-table-column>

        <el-table-column
          label="页数"
          prop="page"
          width="70"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="进度"
          prop="progress"
          width="180"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper" v-if="pageInfo.total > pageInfo.pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageInfo['pageSize']"
          :total="pageInfo['total']"
          :current-page="pageInfo['currentPage']"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nextStep" round size="medium">确认</el-button>
      </span>
    </template>
    <!-- <template v-else>
      转换完成
      <el-button type="primary" @click="transOver" round size="medium">确认</el-button>
    </template> -->
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      webinar_id: this.$route.params.str,
      pageInfo: {
        currentPage: 1,
        total: 0,
        pageSize: 6
      },
      docList: [],
      dialogVisible: false,
      // tabs: 1,
      tableSelect: []
    };
  },
  props: {
    tableDataLength: {
      required: true
    }
  },
  created() {
    this.getDocList()
  },
  methods: {
    nextStep() {
      if (!this.tableSelect.length) {
        this.$message.error('请选择要关联的文档');
      } else {
        if (this.tableDataLength) {
          this.$confirm("当前视频内容已有关联文档，再次关联文档，将会清除已设置的全部章节内容，确认继续？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          }).then(() => {
            // this.tabs = 2
            this.$emit('getChapters', this.tableSelect);
            this.$refs.docList.clearSelection()
            this.tableSelect = []
            this.dialogVisible = false;
          })
        } else {
          this.$emit('getChapters', this.tableSelect);
          this.$refs.docList.clearSelection()
          this.tableSelect = []
          this.dialogVisible = false;
        }
      }
    },
    // transOver() {
    //   this.dialogVisible = false
    //   this.tabs = 1
    // },
    handleSelectionChange(val){
      let ids = []
      val.length > 0 && val.forEach((item, index) => {
        ids.push(item.document_id)
      })
      this.tableSelect = ids
    },
    handlePageChange (page) {
      this.pageInfo.currentPage = page;
      this.getDocList();
    },
    getDocList () {
      let data = {};
      data = {
        pos: (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize,
        limit: this.pageInfo.pageSize,
        webinar_id: this.webinar_id,
        type: '1',
        keyword: '',
        ext: 'ppt,pptx',
        created_at: '2020-09-30'
      };
      this.$fetch('getWordList', data).then(res => {
        if (res.code == 200) {
          this.docList = res.data.list.map(item => {
            // 转换状态 0待转换 100转换中 200完成 500失败
            let statusStr = {
              0: '等待转码',
              100: '转码中',
              200: '转码完成',
              500: '转码失败'
            }
            item.progress = statusStr[item.status];
            return {
              ...item,
            };
          })

          this.pageInfo.total = res.data.total;
        }
      });
    }
  },
};
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  // .tabs{
  //   width: 100%;
  //   overflow: hidden;
  //   margin: 8px 0 24px 0;
  //   >div{
  //     width: 50%;
  //     float: left;
  //     border-radius: 4px;
  //     border: 1px solid #E6E6E6;
  //     border-radius: 4px 0px 0px 4px;
  //     line-height: 40px;
  //     height: 40px;
  //     text-align: center;
  //     transition: all .2s linear;
  //     cursor: pointer;
  //     &:nth-child(1){
  //       border-right: 0px none;
  //     }
  //     &:nth-child(2){
  //       border-left: 0px none;
  //     }
  //     &.active{
  //       border: 1px solid @red;
  //       background: @redBg;
  //       color: @red;
  //     }
  //   }
  // }
  .statusTag{
    &::before{
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    &.wating::before{
      background:#FA9A32;
    }
    &.success::before{
      background:#14BA6A;
    }
    &.failer::before{
      background:#FB3A32;
    }
  }
  .pagination-wrapper {
    display: flex;
    margin-top: 10px;
    justify-content: center;
  }
</style>
