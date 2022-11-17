<template>
  <!-- 关联文档 -->
  <VhallDialog title="关联文档"  :before-close="handleClose" :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false width="800px">
    <div class="word-list">
      <VhallInput
        class="head-btn search-tag"
        placeholder="请输入文档名称"
        v-model="formParams.keyword"
        @keyup.enter.native="searchHandle"
        clearable
        v-clearEmoij
        @clear="searchHandle"
        >
        <i
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="searchHandle">
        </i>
      </VhallInput>
      <!-- 表格 -->
      <el-table
        ref="elTable"
        :data="dialogTableList"
        tooltip-effect="dark"
        style="width: 100%"
        height="336px"
        v-loadMore="moreLoadData"
        v-if="dialogTableList.length > 0"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        @selection-change="changeDialogCheck"
        @select-all="checkAllRow"
      >
        <!-- <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          align="left"
        /> -->
        <el-table-column
          type="selection"
          width="52"
          align="left"
        />
        <el-table-column
          label="文档名称"
          width="250"
        >
          <template slot-scope="scope">
            <p class="text"><icon class="word-status" :icon-class="scope.row.ext | wordStatusCss"></icon>{{ scope.row.file_name }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="created_at"
        >
        </el-table-column>
        <el-table-column
          label="页码"
          prop="page"
          width="84px"
        >
        </el-table-column>
        <el-table-column
          label="进度"
          width="164px"
        >
          <template slot-scope="scope">
           <!--  <span v-if="!scope.row.transform_schedule_str">{{scope.row.isUpload ? '上传' : ''}}{{scope.row.codeProcess}}%</span>
            <el-progress v-if="!scope.row.transform_schedule_str" :show-text=false status="success" :percentage="scope.row.codeProcess"></el-progress>
            <div v-else class="progressBox">
              <span :class="[scope.row.fileStatusCss, 'statusTag']">{{scope.row.fileStatusStr}}<span><icon v-if="Number(scope.row.showEventType) === 5 || Number(scope.row.showEventType) === 7" icon-class="saasicon-reset"></icon></span></span>
            </div> -->
            <div v-if="!scope.row.transform_schedule_str" class="progressBox">
              <el-progress :percentage="scope.row.codeProcess" ></el-progress>
            </div>
            <div v-else class="progressBox">
              <!-- 样式变化 -->
              <template v-for="(item, ins) of scope.row.transform_schedule_str.split('<br/>')" >
                <span :class="[scope.row.fileStatusCss, 'statusTag']" :key="ins">{{item}}</span><br />
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <null-page text="未搜索到相关内容" nullType="search" v-else :height=60></null-page>
      <div class="btn-center">
        <span class="select-option">当前选中 <strong>{{dialogMulti.length}}</strong> 个文档</span>
        <el-button  v-preventReClick type="primary" round size="medium" @click="saveCheckHandle" :disabled="!(dialogMulti && dialogMulti.length > 0)">确认</el-button>
        <el-button  round size="medium" @click="cancelCheckHandle">取消</el-button>
      </div>
    </div>
  </VhallDialog>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import EventBus from "@/utils/Events";

export default {
  name: "selectWord.vue",
  components: {
    NullPage
  },
  props: {
    tableDataLength: {
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      total: 0,
      isCheckAll: false,
      dialogTableList: [],
      dialogMulti: [],
      tableColumn: [
        {
          label: '文档名称',
          key: 'file_name',
        },
        {
          label: '上传时间',
          key: 'created_at',
        },
        {
          label: '页码',
          key: 'page',
        },
        {
          label: '进度',
          key: 'transform_schedule_str',
        }
      ],
      formParams: {
        keyword: ''
      },
      pageInfo: {
        pos: 0,
        limit: 6,
        pageNum: 1
      },
      totalPages: 0
    }
  },
  methods: {
    handleClose(done) {
      this.pageInfo.pageNum = 1;
      done();
    },
    moreLoadData() {
      if (this.pageInfo.pageNum >= this.totalPages) {
        return false;
      }
      this.pageInfo.pageNum ++ ;
      this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
      this.getDialogTableList();
    },
    // 获取资料库-弹出框内容
    getDialogTableList() {
      let params = {
        keyword: this.formParams.keyword,
        type: 1,
        webinar_id: this.$route.params.str,
        ext: 'ppt,pptx',
        ...this.pageInfo
      }
      this.$fetch('getWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          let list = res.data.list;
          list.map(item => {
            /*
              converted_page: "0" // 动态页数
              converted_page_jpeg: "1" // 静态页数
              document_id: "01b17b82" // 文档ID
              page: "1" // 文档总页数
              status: "200" // 动态转换状态 0待转换 100转换中 200完成 500失败
              status_jpeg: "200" // 静态转换状态 0待转换 100转换中 200完成 500失败
            */
            const statusJpeg = item.status_jpeg * 1;
            const status = item.status * 1;
            if (statusJpeg === 0) {
              item.showEventType = 0;
              item.fileStatusCss = 'wating';
              item.fileStatusStr = '等待转码';
              item.transform_schedule_str = `等待转码`;
            } else if (statusJpeg === 100) {
              item.showEventType = 1;
              item.transform_schedule_str = ``; // 静态转码中
              let _percent = parseInt(item.converted_page_jpeg) / parseInt(item.page) * 100;
              item.codeProcess = (_percent + "").substr(0, 4);
            } else if (statusJpeg === 200) {
              if (/pptx?/.test(item.ext)) {
                // 如果是ppt or pptx
                if (status === 0) {
                  item.showEventType = 2;
                  item.fileStatusCss = 'wating';
                  item.fileStatusStr = '等待转码';
                  item.transform_schedule_str = `等待转码`; // 静态转码完成，动态待转码
                } else if (status === 100) {
                  item.showEventType = 3;
                  item.fileStatusCss = 'success';
                  item.fileStatusStr = '动态转码中';
                  item.transform_schedule_str = `静态转码成功，动态转码中...`; // 静态转码完成，动态转码中
                } else if (status === 200) {
                  item.showEventType = 4;
                  item.fileStatusCss = 'success';
                  item.fileStatusStr = '转码成功';
                  item.transform_schedule_str = `静态转码成功<br/>动态转码成功`; // 静态转码完成，动态转码完成
                } else {
                  item.showEventType = 5;
                  item.fileStatusCss = 'failer';
                  item.fileStatusStr = '转码失败';
                  item.transform_schedule_str = `转码失败`; // 静态转码完成，动态转码失败
                }
              } else {
                // 非PPT静态转码完成
                item.showEventType = 6;
                item.fileStatusCss = 'success';
                item.fileStatusStr = '转码成功';
                item.transform_schedule_str = `转码成功`; // 静态转码完成，动态转码失败
              }
            } else if (statusJpeg >= 500) {
              item.showEventType = 7;
              item.fileStatusCss = 'failer';
              item.fileStatusStr = '转码失败';
              item.transform_schedule_str = `转码失败`; // 静态转码失败
            }
          })
          if (this.pageInfo.pos === 0) {
            this.dialogTableList = res.data.list;
          } else {
            this.dialogTableList.push(...res.data.list);
          }
          if(this.isCheckAll) {
            this.$refs.elTable.toggleAllSelection();
          }
          this.total = res.data.total;
          this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
        }
      }).catch(e => {
        console.log(e);
      }).finally(()=>{
      });
    },
    setRowKeyFun() {},
    searchHandle() {
      // this.dialogMulti = [];
      try {
        this.$refs.elTable.clearSelection();
      } catch (e) {
        console.log(e);
      }
      this.pageInfo.pos = 0;
      this.pageInfo.pageNum = 1;
      this.getDialogTableList();
    },
    // 改变资料库-弹出框内容
    changeDialogCheck(val) {
      this.dialogMulti = val.map(item => item.document_id);
    },
    checkAllRow(selection) {
      console.log('全选与非全选', selection);
      // 只要数量大于0，即是够了全选
      this.isCheckAll = selection && selection.length > 0;
    },
    initComp() {
      // 历史已经选择过的数据清空
      this.dialogTableList = [];
      // this.dialogVisible = true;
      this.formParams.keyword = '';
      this.searchHandle();
    },
    saveCheckHandle() {
      console.log('this.dialogMulti', this.dialogMulti)
      if (this.dialogMulti && this.dialogMulti.length > 0) {
        if (this.tableDataLength) {
          this.$confirm("当前视频内容已有关联文档，再次关联文档，将会清除已设置的全部章节内容，确认继续？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          }).then(() => {
            this.$parent.isLinkDoc = true;
            this.$EventBus.$emit('demonstration', {
              documentIds: this.dialogMulti
            });
            this.$emit('getChapters', this.dialogMulti);
            try {
              this.$refs.elTable.clearSelection();
            } catch (e) {
              console.log(e);
            }
            this.dialogMulti = []
            this.dialogVisible = false;
          })
        } else {
          // this.$message.info('已取消选择');
          this.$EventBus.$emit('demonstration', {
            documentIds: this.dialogMulti
          });
          this.$emit('getChapters', this.dialogMulti);
          try {
            this.$refs.elTable.clearSelection();
          } catch (e) {
            console.log(e);
          }
          this.dialogMulti = []
          this.dialogVisible = false;
        }
      } else {
        this.$EventBus.$emit('demonstration', {
          documentIds: this.dialogMulti
        });
        this.$emit('getChapters', this.dialogMulti);
        try {
          this.$refs.elTable.clearSelection();
        } catch (e) {
          console.log(e);
        }
        this.dialogMulti = []
        this.dialogVisible = false;
      }
    },
    cancelCheckHandle() {
      this.dialogMulti = [];
      try {
        this.$refs.elTable.clearSelection();
      } catch (e) {
        console.log(e);
      }
      this.dialogVisible = false;
    }
  },
  created() {
    this.initComp();
  },
  mounted() {
    this.$EventBus.$on('host_msg_webinar', res => { // 转码状态
      console.log(res, '监听到host_msg_webinar转码状态事件');
      /*
        converted_page: "0" // 动态页数
        converted_page_jpeg: "1" // 静态页数
        document_id: "01b17b82" // 文档ID
        page: "1" // 文档总页数
        status: "200" // 动态转换状态 0待转换 100转换中 200完成 500失败
        status_jpeg: "200" // 静态转换状态 0待转换 100转换中 200完成 500失败
      */
      this.dialogTableList.map((item) => {
        if (res.document_id === item.document_id) {
          const statusJpeg = res.status_jpeg * 1;
          const status = res.status * 1;
          if (statusJpeg === 0) {
            item.showEventType = 0;
            item.fileStatusCss = 'wating';
            item.fileStatusStr = '等待转码';
            item.transform_schedule_str = `等待转码`;
          } else if (statusJpeg === 100) {
            item.showEventType = 1;
            item.transform_schedule_str = ``; // 静态转码中
            let _percent = parseInt(item.converted_page_jpeg) / parseInt(item.page) * 100;
            item.codeProcess = (_percent + "").substr(0, 4);
          } else if (statusJpeg === 200) {
            if (/pptx?/.test(item.ext)) {
              // 如果是ppt or pptx
              if (status === 0) {
                item.showEventType = 2;
                item.fileStatusCss = 'wating';
                item.fileStatusStr = '等待转码';
                item.transform_schedule_str = `等待转码`; // 静态转码完成，动态待转码
              } else if (status === 100) {
                item.showEventType = 3;
                item.fileStatusCss = 'success';
                item.fileStatusStr = '动态转码中';
                item.transform_schedule_str = `静态转码成功，动态转码中...`; // 静态转码完成，动态转码中
              } else if (status === 200) {
                item.showEventType = 4;
                item.fileStatusCss = 'success';
                item.fileStatusStr = '转码成功';
                item.transform_schedule_str = `静态转码成功<br/>动态转码成功`; // 静态转码完成，动态转码完成
              } else {
                item.showEventType = 5;
                item.fileStatusCss = 'failer';
                item.fileStatusStr = '转码失败';
                item.transform_schedule_str = `转码失败`; // 静态转码完成，动态转码失败
              }
            } else {
              // 非PPT静态转码完成
              item.showEventType = 6;
              item.fileStatusCss = 'success';
              item.fileStatusStr = '转码成功';
              item.transform_schedule_str = `转码成功`; // 静态转码完成，动态转码失败
            }
          } else if (statusJpeg >= 500) {
            item.showEventType = 7;
            item.fileStatusCss = 'failer';
            item.fileStatusStr = '转码失败';
            item.transform_schedule_str = `转码失败`; // 静态转码失败
          }
          item.page = res.page || '';
        }
      });
    });
  }
};
</script>

<style lang="less" scoped>
.word-list {
  padding-bottom: 24px;
  .word-status {
    margin-right: 12px;
  }
  .head-btn {
    margin-bottom: 16px;
  }
  .el-input{
    width: 220px;
    .el-input__icon{
      cursor: pointer;
    }
    /deep/ .el-input__icon{
      line-height: 36px;
    }
  }
  /deep/ .el-input__inner{
    user-select: none;
    border-radius: 50px;
    font-size: 14px;
    color: #666666;
    height: 36px;
    line-height: 36px;
  }
  .search-tag {
    /deep/.el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 50px!important;
    }
    /deep/ .el-input__suffix {
      cursor: pointer;
      /deep/ .el-input__icon {
        width: auto;
        margin-right: 5px;
        line-height: 36px;
      }
    }
  }
}
.btn-center {
  margin: 24px auto 0 auto;
  text-align: right;
  .el-button {
    &:last-child {
      margin-right: 0;
    }
  }
}
/deep/.select-option{
  float: left;
  line-height: 20px;
  margin-top: 8px;
  /deep/strong {
    color: #FB3A32;
  }
}
.word-list {
  /deep/ .el-table__body .el-table__row td:nth-child(2) .cell{
    padding-left: 10px;
  }
  /deep/ thead tr th:nth-child(2) .cell{
    padding-left: 10px;
  }
  /deep/.cell .imgs {
    width: 100px;
    height: 100px;
  }
  /deep/.cell .advImg {
    width: 142px;
    height: 80px;
  }
  /deep/.el-table {
    margin-bottom: 30px;
  }
  /* /deep/.el-table__header{
    background-color: #FB3A32;
  } */
  /deep/.el-table td, .el-table th{
    padding: 15px 0;
  }
  /deep/.word-status i.iconfont-v3 {
    font-size: 20px;
  }
  .text{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/.el-button.el-button--text {
    color: #1A1A1A;
    border: 0;
    &:hover{
      color: #FB3A32;
    }
    // /deep/.el-button.text--default {
    //   margin-right: 20px;
    //   color: #999999;
    //   font-size: 14px;
    //   &:last-child {
    //     margin-right: 0;
    //   }
    //   &:hover {
    //     color: #5d81fb;
    //     &:after {
    //       border-bottom: 1px solid #5d81fb;
    //     }
    //   }
    //   &:active {
    //     color: #3157e1;
    //     &:after {
    //       border-bottom: 1px solid #3157e1;
    //     }
    //   }
    //   &:disabled {
    //     color: #9db3fc;
    //     &:after {
    //       border-bottom: 1px solid #9db3fc;
    //     }
    //   }
    // }
  }
  .status-show{
    span{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
      margin-top: -3px;
    }
    .active-success {
      background: #14BA6A;
    }
    .active-error {
      background: #FB3A32;
    }
    .active-waiting {
      background: #FA9A32;
    }
  }
  .empty{
    text-align: center;
  }

  .progressBox {
    /deep/ .el-progress-bar__inner {
      background-color: #14BA6A;
    }
  }
  .statusTag{
    font-size: 14px;
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
    .iconContainer {
      padding-left: 10px;
      cursor: pointer;
    }
    /deep/ .saasicon-reset {
      color: #FB3A32;
    }
  }
}
</style>
