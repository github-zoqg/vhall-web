<template>
  <div class="list-wrap">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55" align='center'>
      </el-table-column>
      <el-table-column v-if="type==1"
        label="文档名称" align='center'
        width="120">
      </el-table-column>
      <el-table-column v-if="type==2"
        label="音视频名称" align='center'
        width="120">
      </el-table-column>
      <el-table-column
        label="上传时间" align='center'
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column v-if="type==1"
        prop="address"
        label="页码" align='center'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column v-if="type==2"
        prop="address"
        label="时长" align='center'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="address"
        label="进度" align='center'
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="address" align='center'
        label="操作"
        show-overflow-tooltip>
         <template slot-scope="scope">
           <el-button type="text" v-for="(item, index) in operatingArray" :key="index" @click="operating(item, index)">{{item}}</el-button>
         </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        multipleSelection: []
      };
    },
    props:{
      type:{
        // 传入的类型
        type: Number,
        required: true,
        default: 1
      },
      operatingArray:{
        // 传入的类型
        type: Array,
        default:()=>{
          return ['预览', '删除'];
        }
      }
    },
    methods: {
      operating(item,index){
        console.log(item, index);
        this.$emit('operating',{item, index});
      }
    }
  };
</script>
<style lang="less" scoped>
.list-wrap{
  height: calc(100% - 60px);
  border: 1px solid red;
}
.data-manage-wrap{

}
</style>
