<template>
  <div class="grouping-card">
    <draggable
      id="first"
      class="list-group"
      data-source="juju"
      :list="list"
      draggable=".item"
      group="a">
      <div slot="header" class="btn-group" role="group">
        <span>待分配({{list.length}})</span>
        <div class="btn-group-right">
          <el-button type="text">解散</el-button>
          <el-button type="text" v-show="!batchGroupState" @click="batchGroupState = !batchGroupState">批量换组</el-button>
          <el-button type="text" @click="batchGroupState = false">取消</el-button>
          <el-button type="text" @click="changeGroup">换组</el-button>
        </div>
      </div>
      <div class="list-group-item item" v-for="item in list" :key="item.name">
        <el-checkbox v-if="batchGroupState" :label="item.name" border size="medium" :name="name">{{item.name}}</el-checkbox>
        <div class="list-group-item-state" v-if="!batchGroupState">
          <el-popover
            placement="bottom"
            width="100%"
            popperClass="list-group-popover"
            trigger="click">
            <div class="list-group-item-button">
              <div>换组</div>
              <div>移出小组</div>
            </div>
            <span slot="reference">{{item.name}}</span>
          </el-popover>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable"
let id=1
export default {
  props:{
    name:{
      type:String,
      default:''
    }
  },
  components: {
    draggable
  },
  data(){
    return{
      batchGroupState:false,//批量换组
      list: [
        { name: "John 1", id: 0,show:false },
        { name: "Joao 2", id: 1,show:false },
        { name: "Jean 3", id: 2 ,show:false}
      ],
      id:2
    }
  },
  methods: {
    /*换组*/
    changeGroup(){

    }
  }
}
</script>

<style lang="less" scoped>
.grouping-card{
  border: 1px solid #ccc;
  .btn-group{
    padding: 0 12px;
    height: 36px;
    line-height: 36px;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
    .btn-group-right{
      float: right;
    }
  }
  .list-group{
    overflow: auto;
    height: 200px;
    background: #fff;
    .list-group-item{
      margin-top: 8px;
      width: 100px;
      line-height: 34px;
      text-align: center;
      height: 34px;
      margin-left: 8px;
      float: left;
      cursor: pointer;
      .list-group-popover{
        width: 100px;
      }
    }
    .list-group-item-state{
      border: 1px solid #ccc;
      width: 100px;
      border-radius: 4px;
      span{
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="less">
.list-group-popover{
  box-sizing: border-box;
  min-width: 100px;
  .list-group-item-button{
    background: #fff;
    div{
      cursor: pointer;
    }
    div:hover{
      color: #FB3A32;
    }
  }
}
</style>