<template>
  <div class="list-wrap">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark" @select='select'
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55" align='center'>
      </el-table-column>
      <el-table-column
        :label="typeName" align='center'
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
         <template>
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
        typeName: '文档名称',
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
      },
      tableData: {
        type: Array,
        required: true,
        default: ()=>{return [];}
      }
    },
    created() {
      switch (this.type) {
        case 1:
          this.typeName = '文档名称';
          break;
        case 2:
          this.typeName = '音视频名称';
          break;
        default:
          this.typeName = '文档名称';
          break;
      }
    },
    methods: {
      operating(item,index){
        console.log(item, index);
        this.$emit('operating',{item, index});
      },
      select(data){
        this.$emit('select',data);
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
