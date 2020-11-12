<template>
  <div>
    <pageTitle title="聊天严禁词">
      <div slot="content">
        1.聊天、评论，包含关键词自动过滤,适用于所有直播。垃圾信息系统已过滤无需添加
        <br/>
        2.批量上传时每个关键词的长度为1~20个字符，超出范围的会自动丢弃
      </div>
    </pageTitle>
    <el-form :model="chatForm" ref="chatForm" label-width="120px">
      <el-form-item label="严禁词列表：">
        {{checkNames.join('，')}}
        <br />
        <el-button @click.prevent.stop="setKeyWordShow">设置</el-button>
      </el-form-item>
    </el-form>
    <!-- 聊天严禁词弹出框 -->
    <el-dialog title="聊天严禁词设置" :visible.sync="listPanelShow" center width="680px">
      <!-- 操作栏 -->
      <div class="operaBox">
        <el-button round @click.prevent.stop="multiKeywordDel">批量删除</el-button>
        <el-button type="primary" round @click.prevent.stop="addKeywordShow">添加</el-button>
        <el-button round @click.prevent.stop="multiUploadKeywordShow">批量添加</el-button>
        <el-link :href="downloadHref" target="_blank" v-if="downloadHref">下载模板</el-link>
        <el-link :href="downloadHref" v-else>下载模板</el-link>
        <div class="searchBox">
          <el-input
            placeholder="搜索严禁词"
            v-model="query.keyword">
            <i
              class="el-icon-search el-input__icon"
              slot="suffix"
              @click="getKeywordList">
            </i>
          </el-input>
        </div>
      </div>
      <!-- 操作栏 -->
      <table-list
        ref="msgTable"
        :isHandle=true
        :manageTableData="keyWordDao.list"
        :tabelColumnLabel="tableColumn"
        :totalNum="keyWordDao.total"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=false
        @getTableList="getKeywordList"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
      <!-- 添加关键词 -->
      <el-dialog
        width="30%"
        :title="addForm.executeType === 'edit' ? '编辑严禁词' : '添加严禁词'"
        :visible.sync="addShow"
        append-to-body>
        <el-input
          :type="addForm.executeType === 'add' ? 'textarea' : 'text'"
          :placeholder="addForm.executeType === 'add' ? '可同时添加多个关键词，中间以逗号(不区分中英文)分隔,每个关键词的长度为1~20个字符，超出范围的会自动丢弃' : '每个关键词的长度为1~20个字符'"
          v-model="addForm.name"
          :maxlength="addForm.executeType === 'add' ? 1000 : 20"
          show-word-limit
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="addShow = false">取 消</el-button>
          <el-button type="primary" @click.prevent.stop="keywordSend">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 批量上传 -->
      <el-dialog
        width="30%"
        title="内层 Dialog"
        :visible.sync="multiUploadShow"
        append-to-body>
        待调用组件~~~
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import PageTitle from '../LiveModule/components/pageTitle';
export default {
  name: "chat.vue",
  components: {
    PageTitle
  },
  data() {
    return {
      chatForm: {},
      checkNames: [],
      keyWordDao: {
        total: 0,
        list: []
      },
      query: {
        keyword: '',
        pos: 0,
        limit: 1000
      },
      downloadHref: '',
      // 列表展示开始
      listPanelShow: false,
      isHandle: false, // 是否有操作项
      tableColumn: [
        {
          label: '严禁词',
          key: 'name'
        },
      ],
      tableRowBtnFun: [
        {
          name: "编辑",
          methodName: 'keywordEdit'
        },
        {
          name: "删除",
          methodName: 'keywordDel'
        }
      ],
      ids: [],
      // 添加关键词
      addShow: false,
      addForm: {
        id: null,
        name: null,
        type: 'add',
      },
      // 批量添加关键词
      multiUploadShow: false
    };
  },
  methods: {
    getKeywordList() {
      this.$fetch('getKeywordList', this.query).then(res =>{
        res = {
          "code":200,
          "msg":"success",
          "data":{
            "list":[
              {"id":4514628094337192,"user_id":-7953428073147252,"name":"!b$","created_at":"1978-03-10 16:11:36","updated_at":"1976-02-01 06:17:05"},
              {"id":2657730129258440,"user_id":3339650132788128,"name":"6JP3pn","created_at":"1971-09-24 23:14:34","updated_at":"1985-01-08 08:53:52", "isEdit": false},
              {"id":7264203787179592,"user_id":-4228398043365332,"name":"AQyq^dz","created_at":"2008-07-31 07:22:11","updated_at":"1996-09-23 10:17:31", "isEdit": false},
              {"id":8129603401981776,"user_id":-6395470898044532,"name":"M35","created_at":"2010-10-26 04:42:41","updated_at":"2000-04-28 22:21:21", "isEdit": false},
              {"id":4514628094337193,"user_id":-7953428073147252,"name":"!b$123","created_at":"1978-03-10 16:11:36","updated_at":"1976-02-01 06:17:05", "isEdit": false},
              {"id":2657730129258440,"user_id":3339650132788128,"name":"6JP3pn","created_at":"1971-09-24 23:14:34","updated_at":"1985-01-08 08:53:52", "isEdit": false},
              {"id":7264203787179592,"user_id":-4228398043365332,"name":"AQyq^dz","created_at":"2008-07-31 07:22:11","updated_at":"1996-09-23 10:17:31", "isEdit": false},
              {"id":8129603401981776,"user_id":-6395470898044532,"name":"M35","created_at":"2010-10-26 04:42:41","updated_at":"2000-04-28 22:21:21", "isEdit": true}
            ],
            "total": 100
          }
        };
        this.keyWordDao = res && res.code === 200 && res.data && res.data.list ? res.data : {
          total: 0,
          list: []
        };
        this.checkNames = this.keyWordDao.list.map(item => {
          return item.name;
        });
      }).catch(e=>{
        console.log(e);
        this.keyWordDao = {
          total: 0,
          list: []
        };
      });
    },
    setKeyWordShow() {
      this.listPanelShow = true;
    },
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 批量选择
    checkMoreRow(val) {
      console.log(val);
      this.ids = val.map(item => {
        return item.id;
      });
    },
    // 编辑
    keywordEdit(that, { rows }) {
      that.addShow = true;
      that.addForm.executeType = 'edit';
      that.addForm.id = rows.id;
      that.addForm.name = rows.name;
    },
    // 关键词新增 or 关键词修改
    keywordSend() {

    },
    // 删除
    keywordDel(that, { rows }) {
      that.$confirm('是否要删除选中的严禁词？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.$fetch('multiKeywordDel', {
          keyword_ids: rows.id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            that.getKeywordList();
          }else {
            that.$message({
              type: 'error',
              message: res.msg || '删除失败'
            });
          }
        }).catch(e => {
          console.log(e);
          that.$message({
            type: 'error',
            message:  '删除失败'
          });
        });
      }).catch(() => {
      });
    },
    // 批量删除
    multiKeywordDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message.error('请至少选择一条严禁词删除');
      } else {
        this.keywordDel(this, {
          rows: {
            id: this.ids.join(',')
          }
        });
      }
    },
    // 打开新增弹出框
    addKeywordShow() {
      this.addShow = true;
      this.addForm.executeType = 'add';
      this.addForm.id = null;
      this.addForm.name = null;
    },
    // 打开批量添加弹出框
    multiUploadKeywordShow() {
      this.multiUploadShow = true;
    },
    // 获取模板下载地址
    getKeywordTemplate() {
      this.$fetch('getKeywordTemplate', {}).then(res =>{
        this.downloadHref = res && res.code === 200 && res.data.url ? res.data.url : 'javascript:void(0);';
      }).catch(e => {
        console.log(e);
      });
    }
  },
  created() {
    this.getKeywordList();
    this.getKeywordTemplate();
  }
};
</script>

<style lang="less" scoped>
.operaBox{
  overflow: hidden;
  margin-bottom: 20px;
  .el-link {
    margin-left: 20px;
  }
  .searchBox{
    float: right;
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
}
/deep/.el-dialog__footer {
  text-align: center;
}
/deep/.el-textarea {
  textarea {
    min-height: 150px!important;
  }
}
</style>
