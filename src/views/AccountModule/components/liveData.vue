<template>
  <div class="live--data">
    <!-- 搜索 -->
    <div class="list--search">
      <el-button size="medium" round>导出</el-button>
      <el-input placeholder="搜索子账号信息（ID/昵称/手机号码）" v-model.trim="query.keyword">
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
      <el-select placeholder="全部" round  v-model="query.type">
        <el-option
          v-for="item in []"
          :key="item.value+item.label"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!-- 数据 -->
    <div class="list--data">
      <table-list
        ref="sonTab"
        :isHandle=true
        :manageTableData="dataDao.list"
        :tabelColumnLabel="sonTableColumn"
        :totalNum="dataDao.total"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=true
        @getTableList="getLiveData"
        @changeTableCheckbox="checkMoreRow"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "liveData.vue",
  data() {
    return {
      query: {
        keyword: '',
        type: ''
      },
      dataDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      sonTableColumn: [
        {
          label: '直播ID',
          key: 'account_id',
          width: 200
        },
        {
          label: '直播标题',
          key: 'nick_name',
          width: 200
        },
        {
          label: '开播时间',
          key: 'phone',
          width: 200
        },
        {
          label: '最高并发（方）',
          key: 'roleStr',
          width: 200
        }
      ],
      tableRowBtnFun: [
        {
          name: "详情",
          methodName: 'toSonDetail'
        },
        {
          name: "编辑",
          methodName: 'editSonShow'
        },
        {
          name: "删除",
          methodName: 'sonDel'
        }
      ]
    }
  },
  methods: {
    getLiveData(pageInfo = {pageNum: 1, pageSize: 10}) {
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
              "account_id": 1,
              "nick_name": "昵称111111",
              "phone": "18310410964",
              "type": 1,
              "role": 1
            },{
              "account_id": 2,
              "nick_name": "昵称2222",
              "phone": "18310410964",
              "role": 1,
              "type": 1
            },{
              "account_id": 3,
              "nick_name": "昵称33333",
              "phone": "18310410964",
              "role": 1,
              "type": 1
            }],
            "total": 50
          }
        };
        let dao =  res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
        (dao.list||[]).map(item => {
          item.roleStr = ['默认角色', '角色1'][item['role']];
          item.typeStr = ['并发（动态）' ,'并发（固定）'][item['type']];
        });
        this.dataDao = dao;
      }).catch(e=>{
        console.log(e);
        this.dataDao = {
          total: 0,
          list: []
        };
      });
    },
    checkMoreRow() {},
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    initComp() {}
  }
};
</script>

<style lang="less" scoped>
.live--data {
  .padding41-40();
}
.list--search{
  margin-bottom: 20px;
  .el-select{
    float: right;
    margin-right: 20px;
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input{
    width: 270px;
    float: right;
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
    }
    /deep/ .el-input__suffix{
      cursor: pointer;
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
  }
}
</style>
