<template>
  <div class="data-list">
          <!-- :row-key="setRowKeyFun" -->
    <el-table
      ref="elTable"
      :data="manageTableData"
      empty-text="暂无数据"
      @selection-change="handleTableCheckbox"
      max-height="450"
    >
      <el-table-column :reserve-selection="true" type="selection" width="55" align="center" v-if="isCheckout"/>
      <template v-if="totalNum">
        <el-table-column
          align="center"
          v-for="(item, index) in tabelColumnLabel"
          :key="index"
          :label="item.label"
        >
        <template slot-scope="scope">
          <img :src="scope.row.img" width="40" height="40" v-if="item.key==='img'"/>
          <span v-else>{{scope.row[item.key]}}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :width="width" v-if="isHandle">
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in tableRowBtnFun"
            :key="index"
            size="mini"
            type="text"
            @click="handleBtnClick(scope, item.methodName)"
          >{{item.name}}</el-button>
        </template>
      </el-table-column>
      </template>
      <div slot="empty">
        <div>
          <img src="../../common/images/v35-webinar.png" alt="" width="140" height="140" />
        </div>
        <p :style="{'marginTop': '23px'}">没有数据</p>
      </div>
    </el-table>
    <SPagination
      :total="totalNum"
      v-show="totalNum"
      :currentPage="pageInfo.pageNum"
      @current-change="currentChangeHandler"
      align="center"
    >
    </SPagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
      }
    };
  },
  props: {
    tabelColumnLabel: Array,
    manageTableData: Array,
    tableRowBtnFun: Array,
    totalNum: Number,
    isCheckout: {
      type: Boolean,
      default: true
    },
    isHandle: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    },
  },
  methods: {
    isImg(_data){
      if(['.png', '.jpg','jpeg'].includes(_data.substr(-4))){
        return true;
      }else{
        return false;
      }
    },
     // 行内操作按钮点击
    handleBtnClick(scope, type) {
      let obj = {
        rows: scope.row,
        index: scope.$index,
        type,
      };
      this.$emit("onHandleBtnClick", obj);
    },
    // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageInfo.pageNum = current;
      this.$emit("getTableList", this.pageInfo);
    },
    // 复选框操作
    handleTableCheckbox(val) {
      this.$emit("changeTableCheckbox", val);
    },
    // 复选记忆函数
    setRowKeyFun (row) {
      console.log(row);
      // return row.liveId || row.riaId;
    },
    // 清除记忆
    clearSelect () {
      this.$refs.elTable.clearSelection();
    },
  }
};
</script>
<style lang="less" scoped>
   .data-list{
     /deep/.cell img{
       width: 100px;
       height: 100px;
     }
     /deep/.el-table{
       margin-bottom: 30px;
     }
   }
</style>
