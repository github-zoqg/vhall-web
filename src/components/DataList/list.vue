<template>
  <div class="data-list">
    <el-table
      :data="manageTableData"
      max-height="450"
    >
      <el-table-column :reserve-selection="true" type="selection" width="55" align="center" v-if="isCheckout"/>
      <el-table-column
        align="center"
        v-for="(item, index) in tabelColumnLabel"
        :key="index"
        :label="item.label"
        :prop="item.key"
      ></el-table-column>
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
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tabelColumnLabel: Array,
    manageTableData: Array,
    tableRowBtnFun: Array,
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
     // 行操作按钮点击
    handleBtnClick(scope, type) {
      let obj = {
        rows: scope.row,
        index: scope.$index,
        type,
      };
      this.$emit("onHandleBtnClick", obj);
    }
  }
};
</script>
