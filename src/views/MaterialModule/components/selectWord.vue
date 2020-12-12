<template>
  <!-- 文档资料库 -->
  <VhallDialog title="文档列表" :visible.sync="dialogVisible" :close-on-click-modal="false" width="878px">
    <div class="word-list">
      <el-input
        class="head-btn search-tag"
        placeholder="请输入文档名称"
        v-model="formParams.keyword"
        @keyup.enter.native="searchHandle">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="searchHandle">
        </i>
      </el-input>
      <!-- 表格 -->
      <el-table
        ref="elTable"
        id="elTable"
        :data="dialogTableList"
        :row-key="setRowKeyFun"
        @selection-change="changeDialogCheck"
        max-height="336px"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
      >
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          align="left"
        />
        <el-table-column
          label="文档名称"
          width="280"
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
          prop="progress"
          width="164px"
        >
        </el-table-column>
      </el-table>
      <div class="btn-center">
        <el-button type="primary" round size="medium" @click="saveCheckHandle">确定</el-button>
        <el-button  round size="medium" @click="cancelCheckHandle">取消</el-button>
      </div>
    </div>
  </VhallDialog>
</template>

<script>
export default {
  name: "selectWord.vue",
  data() {
    return {
      dialogVisible: false,
      dialogTotal: 0,
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
          key: 'progress',
        }
      ],
      formParams: {
        keyword: ''
      },
      currentPage: 1,
      pageSize: 5,
      totalPage: 0
    }
  },
  methods: {
    // 获取资料库-弹出框内容
    getDialogTableList(pageInfo = {pos: 0, limit: 5, pageNumber: 1}) {
      let params = {
        pos: pageInfo.pos,
        limit: pageInfo.limit,
        keyword: this.formParams.keyword,
        type: 1,
        webinar_id: this.$route.params.str
      };
      this.$fetch('getWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          // 当内容为空时，查询到总条数
          if(this.formParams.keyword === '') {
            let dialog = res.data.total;
            this.totalPage = (dialog%this.pageSize) > 0 ? (dialog/this.pageSize) + 1 : dialog/this.pageSize;
          }
          let list = res.data.list;
          list.map(item => {
            // 转换状态 0待转换 100转换中 200完成 500失败
            let statusStr = {
              0: '等待转码',
              100: '转码中',
              200: '转码完成',
              500: '转码失败'
            }
            item.progress = statusStr[item.status];
          })
          if (this.currentPage === 1) {
            this.dialogTotal = res.data.total;
            this.dialogTableList = res.data.list;
          } else {
            this.dialogTableList.concat(res.data.list)
          }
        } else {
          if (this.currentPage === 1) {
            this.dialogTableList = [];
          } else {
            this.dialogTableList.concat([])
          }
          // this.dialogTotal = 0;
        }
      }).catch(e => {
        console.log(e);
        if (this.currentPage === 1) {
          this.dialogTableList = [];
        } else {
          this.dialogTableList.concat([])
        }
      }).finally(()=>{
      });
    },
    setRowKeyFun() {},
    searchHandle() {
      this.dialogMulti = [];
      this.$refs.elTable.clearSelection();
      this.getDialogTableList();
    },
    // 改变资料库-弹出框内容
    changeDialogCheck(val) {
      this.dialogMulti = val.map(item => item.document_id);
    },
    initComp() {
      this.dialogVisible = true;
      this.getDialogTableList();
    },
    saveCheckHandle() {
      if (this.dialogMulti && this.dialogMulti.length > 0) {
        let params = {
          document_id: this.dialogMulti.join(','),
          tag: 2, // 1：同步到资料库 ，2：同步到活动
          webinar_id: this.$route.params.str
        }
        console.log(params, '同步到活动中');
        this.$confirm('确定保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          // 同步到资料库
          this.$fetch('asyncWordInfo', this.$params(params)).then(res=>{
            if(res && res.code === 200) {
              this.$message.success('同步成功');
              this.cancelCheckHandle();
              this.$emit('reload');
            } else {
              this.$message.error(res.msg || '保存失败');
            }
          }).catch(e => {
            console.log(e);
            this.$message.error(e.msg || '保存失败');
          })
        }).catch(() => {
        });
      } else {
        this.$message.info('已取消选择');
        this.dialogVisible = false;
      }
    },
    cancelCheckHandle() {
      this.dialogMulti = [];
      this.$refs.elTable.clearSelection();
      this.dialogVisible = false;
    }
  },
  mounted() {
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
}
.btn-center {
  margin: 24px auto 0 auto;
  text-align: right;
  .el-button {
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.word-list {
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
  /deep/.el-table__header{
    background-color: #FB3A32;
  }
  /deep/.el-table td, .el-table th{
    padding: 15px 0;
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
}
</style>
