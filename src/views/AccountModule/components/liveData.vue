<template>
  <div class="live--data">
    <!-- 搜索 -->
    <div class="list--search">
      <!-- 日期选择器 -->
      <el-date-picker
        v-model="query.timeStr"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 240px"
      />
      <el-input placeholder="搜索子账号信息（ID/昵称/手机号码）" v-model.trim="query.keyword">
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
      <el-button size="medium" round>导出</el-button>
    </div>
    <!-- 数据 -->
    <div class="list--data">
      <table-list
        ref="sonTab"
        :isHandle=false
        :isCheckout=false
        :manageTableData="dataDao.list"
        :tabelColumnLabel="sonTableColumn"
        :totalNum="dataDao.total"
        :needPagination=true
        @getTableList="getLiveData"
        v-if="dataDao.total > 0"
      >
      </table-list>
      <!-- 无消息内容 -->
      <null-page v-else></null-page>
    </div>
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
export default {
  name: "liveData.vue",
  components: {
    NullPage
  },
  data() {
    return {
      query: {
        timeStr: '',
        keyword: ''
      },
      dataDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      sonTableColumn: [
        {
          label: '直播ID',
          key: 'live_id',
          width: 200
        },
        {
          label: '直播标题',
          key: 'title',
          width: 'auto'
        },
        {
          label: '开播时间',
          key: 'timeStr',
          width: 200
        },
        {
          label: '最高并发（方）',
          key: 'count',
          width: 200
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
    initComp() {
      this.getLiveData();
    }
  }
};
</script>

<style lang="less" scoped>
.live--data {
  .padding41-40();
}
.list--search{
  .flex-display();
  .justify(flex-start);
  .align(center);
  margin-bottom: 20px;
  .el-select{
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
    margin-left: 24px;
    width: 270px;
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
  .el-button {
    margin-left: auto;
  }
}
</style>
