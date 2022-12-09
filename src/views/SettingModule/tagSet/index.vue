<template>
  <div
    class="tagListBox"
    v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)"
    v-if="!loading"
  >
    <pageTitle pageTitle="标签设置">
      <div slot="content">
        1.账号下最多创建100个直播标签
        <br />
        2.直播设置中引用标签
        <br />
      </div>
    </pageTitle>
    <span v-if="!nullDate">
      <!-- 操作栏  -->
      <div class="operaBox">
        <el-button
          type="primary"
          round
          @click="create"
          v-preventReClick
          size="medium"
          class="length104"
        >
          创建标签
        </el-button>
        <el-button
          size="medium"
          round
          @click="remove"
          :disabled="!checkList.length"
          class="transparent-btn"
          v-preventReClick
        >
          批量删除
        </el-button>
        <el-button type="text" size="medium" @click="reset" v-preventReClick class="text_button">
          恢复默认排序
        </el-button>
        <div class="searchBox">
          <VhallInput
            class="search-tag"
            placeholder="请输入标签名称"
            v-model="searchName"
            clearable
            v-clearEmoij
            @change="searchHandler()"
          >
            <i class="el-icon-search el-input__icon" slot="prefix"></i>
          </VhallInput>
        </div>
      </div>
      <div class="word-list">
        <table-list
          ref="tableListWord"
          :manageTableData="tableList"
          :tabelColumnLabel="tableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          max-height="auto"
          width="194"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="searchHandler"
          @changeTableCheckbox="changeTableCheckbox"
        ></table-list>
        <null-page text="未搜索到相关内容" nullType="search" v-if="totalNum === 0"></null-page>
      </div>
    </span>
    <div v-if="nullDate">
      <null-page text="您还没有标签，快来创建吧！" nullType="button">
        <el-button
          type="primary"
          round
          @click="create"
          v-preventReClick
          size="medium"
          class="create_but"
        >
          创建标签
        </el-button>
      </null-page>
    </div>

    <!-- 创建标签弹框 -->
    <VhallDialog
      :title="title"
      :visible.sync="createDialog"
      top="20vh"
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <VhallInput
            placeholder="请输入标签名称"
            v-model="keyWords"
            v-clearEmoij
            show-word-limit
            maxlength="10"
          ></VhallInput>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" v-preventReClick @click="sureAsyncHandle" round>
            确 定
          </el-button>
          <el-button size="medium" @click="unSureAsyncHandle" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import NullPage from '@/views/PlatformModule/Error/nullPage.vue';
  import Env from '@/api/env.js';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    data() {
      return {
        loading: false,
        tableList: [],
        tableColumn: [
          {
            label: '标签名称',
            key: 'name',
            width: 'auto',
            customTooltip: true
          },
          {
            label: '创建时间',
            key: 'created_at',
            width: 200
          },
          {
            label: '最新修改时间',
            key: 'updated_at',
            width: 200
          },
          {
            label: '是否被引用',
            key: 'isQuote',
            width: 120
          }
        ],
        tableRowBtnFun: [
          {
            name: '置顶',
            methodName: 'setTop',
            disabledKey: 'is_order_one'
          },
          {
            name: '编辑',
            methodName: 'editItem'
          },
          {
            name: '删除',
            methodName: 'deleteHandle'
          }
        ],
        query: {
          pos: 0,
          limit: 10,
          pageNumber: 1
        },
        totalNum: 0,
        keyWords: '',
        searchName: '',
        checkList: [],
        nullDate: false,
        createDialog: false,
        status: 'new', // 操作状态
        selectId: '', // 编辑数据id
        title: ''
      };
    },
    computed: {},
    components: {
      PageTitle,
      NullPage
    },
    mounted() {
      this.searchHandler();
    },
    beforeDestroy() {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
    },
    methods: {
      // 创建标签
      create() {
        if (this.totalNum >= 100) {
          this.$message.warning('账号下最多创建100个直播标签');
          return false;
        }
        this.status = 'new';
        this.title = '创建';
        this.createDialog = true;
      },
      //   重置排序
      reset() {
        this.$fetch('labelResetOrder', {}).then(res => {
          if (res.code == 200) {
            this.searchHandler();
            this.$message({
              message: `重置排序成功`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            });
          }
        });
      },
      // 搜索
      searchHandler(row) {
        if (typeof row == 'object') {
          this.query.pos = row.pos;
          this.query.pageNumber = row.pageNum;
        } else {
          this.query.pos = 0;
          if (this.totalNum > 10) {
            this.$refs.tableListWord.pageInfo.pageNum = 1;
          }
        }
        this.$fetch('labelList', {
          name: this.searchName,
          pos: this.query.pos,
          limit: 10
        }).then(res => {
          if (res.code == 200) {
            if (!this.searchName && res.data.total == 0) {
              this.nullDate = true;
            } else {
              this.nullDate = false;
            }
            this.tableList = res.data.list;
            this.totalNum = res.data.total;
            if (this.tableList.length == 0 && this.query.pos > 0) {
              this.searchHandler({
                pos: this.query.pos - 10
              });
            }
            this.tableList.forEach((item, ind) => {
              item.isQuote = item.is_quote ? '是' : '否';
              if (ind == 0 && this.query.pos == 0) {
                item.is_order_one = true;
              }
            });
          }
        });
      },
      //
      onHandleBtnClick(val) {
        console.log(this.$options.methods, val, 'onHandleBtnClick');
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      // 选中数据
      changeTableCheckbox(val) {
        console.log(val, 'changeTableCheckbox');
        this.checkList = val;
      },
      // 置顶
      setTop(t, row) {
        t.$fetch('labelTop', {
          label_id: row.rows.label_id
        }).then(res => {
          if (res.code == 200) {
            t.searchHandler();
            t.$message({
              message: `保存成功`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            });
          }
        });
        console.log(row, 'setTop');
      },
      // 编辑前获取详情
      editItem(t, row) {
        t.status = 'edit';
        t.selectId = row.rows.label_id;
        t.createDialog = true;
        t.keyWords = row.rows.name;

        // 扩展列表中没有字段时 须调用接口
        // t.$fetch('labelGetInfo', {
        //     label_id: row.rows.label_id
        //   }).then(res=>{
        //     if(res.code == 200){
        //       t.keyWords = res.data.name
        //       t.title = '编辑'
        //       t.createDialog = true
        //     }
        //   })
      },
      // 删除
      deleteHandle(t, row, arr) {
        if (row && row.rows.is_quote) {
          t.$confirm('该标签已被引用，不支持删除', '提示', {
            confirmButtonText: '知道到了',
            customClass: 'zdy-message-box',
            lockScroll: false,
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          });
          return false;
        }
        t.$confirm('是否删除该标签？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            let label_ids = '';
            let arr_ids = [];
            if (row) {
              label_ids = row.rows.label_id;
            } else {
              t.checkList.forEach(item => {
                arr_ids.push(item.label_id);
                label_ids = arr_ids.join(',');
              });
            }
            console.log(label_ids, 'label_ids');
            t.$fetch('labelDelete', {
              label_ids
            })
              .then(res => {
                if (res.code == 200) {
                  t.searchHandler();
                  t.$message({
                    message: `标签删除成功`,
                    showClose: true,
                    type: 'success',
                    customClass: 'zdy-info-box'
                  });
                }
              })
              .catch(err => {
                if (err.code == 512079) {
                  t.$message({
                    message: err.msg,
                    showClose: true,
                    type: 'warning',
                    customClass: 'zdy-info-box'
                  });
                }
              });
          })
          .catch();
      },
      //   批量删除
      remove() {
        this.deleteHandle(this, false, this.checkList);
      },
      // 创建保存
      sureAsyncHandle() {
        let api = '';
        let params = {
          name: this.keyWords
        };
        let tip;
        if (this.status == 'new') {
          api = 'labelCreate';
          tip = '标签保存成功';
        } else {
          api = 'labelEdit';
          tip = '标签修改成功';
          params.label_id = this.selectId;
        }
        let http = () =>
          this.$fetch(api, params)
            .then(res => {
              if (res.code == 200) {
                this.$message.success(tip);
                this.unSureAsyncHandle();
                this.searchHandler();
              }
            })
            .catch(err => {
              this.$message.warning(err.msg);
            });
        if (this.status == 'new') {
          http();
        } else {
          this.$confirm('修改后，直播下的标签引用会同步更新，确认修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
            .then(() => {
              http();
            })
            .catch(() => {});
        }
      },
      // 创建取消
      unSureAsyncHandle() {
        this.createDialog = false;
        this.keyWords = '';
      }
    }
  };
</script>
<style lang="less">
  .tagListBox {
    .no-live /deep/.el-button {
      padding: 9px 24px;
    }
    .pageTitle {
      color: #1a1a1a;
      font-size: 22px;
      font-weight: 600;
    }
    .operaBox {
      overflow: hidden;
      margin-top: 30px;
      margin-bottom: 20px;
      .text_button {
        color: #3562fa;
        padding: 0;
      }
      .searchBox {
        float: right;
        .el-input__inner {
          // user-select: none;
          border-radius: 50px;
          font-size: 14px;
          color: #666666;
          height: 36px;
          line-height: 36px;
        }
        .el-input__icon {
          line-height: 36px;
        }
      }
    }
    .word-list {
      width: 100%;
      .layout--right--main();
      .padding-table-list();
    }
    .create_but {
      padding: 6px 41px !important;
    }
    .zdy-async-dialog {
      top: 20vh;
      .el-dialog__title {
        font-weight: bold;
      }
    }
  }
</style>
