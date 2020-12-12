<template>
  <el-dialog
    title="关联文档"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="810px">
    <div class="tabs">
      <div :class="{active: tabs==1}">1.选择文档</div>
      <div :class="{active: tabs==2}">2.生成章节</div>
    </div>
    <template v-if="tabs === 1">
      <el-table
        ref="docList"
        :data="docList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="name"
          label="文档名称"></el-table-column>
        <el-table-column
          prop="uploadTime"
          label="上传日期"
          width="170">
        </el-table-column>

        <el-table-column
          label="页数"
          prop="pages"
          width="70"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="进度"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress v-if="scope.row.status=='transcoding'" color="#14BA6A" :percentage="scope.row.process" :stroke-width="8" :width="100"></el-progress>
            <span v-else :class="[scope.row.status, 'statusTag']">{{scope.row.status | statusStr}}</span>
          </template>
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
        <el-button type="primary" @click="nextStep" round size="medium">下一步</el-button>
      </span>
    </template>
    <template v-else>
      转换完成
      <el-button type="primary" @click="transOver" round size="medium">确认</el-button>
    </template>
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
        pageSize: 200
      },
      docList: [],
      dialogVisible: false,
      tabs: 1,
      tableSelect: []
    };
  },
  created() {
    this.getDocList()
  },
  methods: {
    nextStep() {
      if (!this.tableSelect.length) {
        this.$message.error('请选择要关联的文档')
      } else if (false) {
        this.$confirm("当前视频内容已有关联文档，再次关联文档，将会清除已设置的全部章节内容，确认继续？", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          center: true
        }).then(() => {
          this.tabs = 2
          this.$emit('getChapters', this.tableSelect)
        })
      } else {
        this.tabs = 2
        this.$emit('getChapters', this.tableSelect)
      }
    },
    transOver() {
      this.dialogVisible = false
      this.tabs = 1
    },
    handleSelectionChange(val){
      let ids = []
      val.length > 0 && val.forEach((item, index) => {
        ids.push(item.id)
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
        pos: (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1,
        limit: this.pageInfo.pageSize,
        webinar_id: this.webinar_id,
        type: '1'
      };
      this.$fetch('getWebinarWordList', data).then(res => {
        if (res.code == 200) {
          this.docList = res.data.list.map((item) => {
            let transformStr;
            const statusJpeg = item.status_jpeg * 1;
            const status = item.status * 1;
            if (statusJpeg === 0 && status === 0) {
              transformStr = '待转码';
            } else if (statusJpeg === 100 || status === 100) {
              transformStr = '转码中';
            } else if (statusJpeg === 200 || status === 200) {
              transformStr = '转码完成';
            } else {
              transformStr = '转码失败';
            }
            return {
              ...item,
              transform_schedule_str: transformStr,
              codeProcess: 0,
              transcoded: false
            };
          });

          this.pageInfo.total = res.data.total;
        }
      });
    }
  },
  filters: {
    statusStr(val){
      let str= '';
      switch (val) {
        case 'wating':
          str='等待转码';
          break;

        case 'success':
          str='转码成功';
          break;

        case 'failer':
          str='等待失败';
          break;

        default:
          str=val;
          break;
      }
      return str;
    }
  }
};
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  .tabs{
    width: 100%;
    overflow: hidden;
    margin: 8px 0 24px 0;
    >div{
      width: 50%;
      float: left;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      border-radius: 4px 0px 0px 4px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      transition: all .2s linear;
      cursor: pointer;
      &:nth-child(1){
        border-right: 0px none;
      }
      &:nth-child(2){
        border-left: 0px none;
      }
      &.active{
        border: 1px solid @red;
        background: @redBg;
        color: @red;
      }
    }
  }
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
    margin-top: 60px;
    justify-content: center;
  }
</style>
