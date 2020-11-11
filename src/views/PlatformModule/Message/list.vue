<template>
  <div>
    <pageTitle title='消息中心'></pageTitle>
    <!-- 有消息内容 -->
    <div v-if="msgDao.total > 0">
      <div class="">
        <el-button type="primary" round @click.prevent.stop="multiMsgDel">批量删除</el-button>
        <el-button round @click.prevent.stop="executeUseRead">标记为已读</el-button>
      </div>
      <!-- 表格与分页 -->
      <table-list
        ref="msgTable"
        :isHandle=true
        :manageTableData="msgDao.list"
        :tabelColumnLabel="msgTableColumn"
        :totalNum="msgDao.total"
        :tableRowBtnFun="tableRowBtnFun"
        @getTableList="getMsgList"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
    </div>
    <!-- 无消息内容 -->
    <null-page v-else></null-page>
  </div>
</template>

<script>
import PageTitle from '../../LiveModule/components/pageTitle';
import NullPage from '../Error/nullPage.vue';
export default {
  name: 'msgList.vue',
  components: {
    PageTitle,
    NullPage
  },
  data() {
    return {
      msgDao: {
        total: 12,
        list: []
      },
      isHandle: false, // 是否有操作项
      msgTableColumn: [
        {
          label: '标题',
          key: 'title',
          width: 200
        },
        {
          label: '接收时间',
          key: 'create_at',
          width: 200
        },
        {
          label: '消息类型',
          key: 'msgTypeStr',
          width: 200
        },
        {
          label: '消息类型',
          key: 'msgStatusStr',
          width: 200
        },
      ],
      tableRowBtnFun: [
        {
          name: "查看",
          methodName: 'toMsgDetail'
        },
        {
          name: "删除",
          methodName: 'msgDel'
        }
      ],
      ids: []
    }
  },
  methods: {
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 删除单条消息数据
    msgDel(that, { rows }) {
      that.$confirm('是否要删除选中的消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        that.$fetch('msgDel', {
          msg_id: rows.id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            that.getMsgList();
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
    // 跳转消息详情页
    toMsgDetail(that, { rows }) {
      that.$router.push({
        path: `/msg-detail/${rows.id}`,
      });
    },
    // 获取消息中心列表数据
    getMsgList(pageInfo = {pageNum: 1, pageSize: 10}) {
      this.$fetch('getMsgList', {
        user_id: '1111',
        pos: (pageInfo.pageNum-1)*pageInfo.pageSize,
        limit: pageInfo.pageSize
      }).then(res =>{
        res = {
          "code": 200,
          "msg": "查询成功",
          "data": {
            "list": [{
              "id": 1,
              "title": "这个是一个标题",
              "content": "这里啥内容都有",
              "create_at": "2019-12-15",
              "msg_status": "0",
              "msg_type": "1"
            },{
              "id": 2,
              "title": "这个是一个标题2",
              "content": "这里啥内容都有2",
              "create_at": "2019-12-15",
              "msg_status": "0",
              "msg_type": "1"
            },{
              "id": 3,
              "title": "这个是一个标题3",
              "content": "这里啥内容都有3",
              "create_at": "2019-12-15",
              "msg_status": "0",
              "msg_type": "1"
            }],
            "total": 50
          }
        };
        let dao =  res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
        (dao.list||[]).map(item => {
          item.msgTypeStr = ['' ,'财务消息'][item['msg_type']];
          item.msgStatusStr = ['未读', '已读'][item['msg_status']];
        });
        this.msgDao = dao;
      }).catch(e=>{
        console.log(e);
        this.msgDao = {
          total: 0,
          list: []
        };
      });
    },
    // 批量选择
    checkMoreRow(val) {
      console.log(val);
      this.ids = val.map(item => {
        return item.id;
      });
    },
    // 标记为已读取
    executeUseRead() {
      console.log(this.ids);
      if (!(this.ids && this.ids.length > 0)) {
        this.$message.error('请至少选择一条信息标记为已读');
      } else {
        this.$confirm('是否要标记选中内容为已读？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$fetch('msgDel', {
            msg_id: this.ids.join(',')
          }).then(res => {
            if(res && res.code === 200) {
              this.$message.success(`操作成功`);
              this.ids = [];
              this.getMsgList();
            }else {
              this.$message({
                type: 'error',
                message: res.msg || '操作失败'
              });
            }
          }).catch(e => {
            console.log(e);
            this.$message({
              type: 'error',
              message:  '操作失败'
            });
          });
        }).catch(() => {
        });
      }
    },
    // 批量删除
    multiMsgDel() {
      if (!(this.ids && this.ids.length > 0)) {
        this.$message.error('请至少选择一条信息删除');
      } else {
        this.msgDel(this, {
          rows: {
            id: this.ids.join(',')
          }
        });
      }
    }
  },
  created() {
    this.getMsgList();
  }
}
</script>

<style lang="less" scoped>

</style>
