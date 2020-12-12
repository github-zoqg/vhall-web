<template>
  <div class="private-wrap clearFix">
    <ul class="list-name fl">
      <li v-for="(item, index) in userList" :key="index" class="ellsips">
        {{item.name}}
      </li>
    </ul>
    <div class="list-content fr">

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList:[
        {
          name: '车型点三十分开始发鸟'
        }
      ]
    }
  },
}
</script>
<style lang="less" scoped>
.private-wrap{
  position: absolute;
  width: 700px;
  height: 400px;
  border: 1px solid;
  right: 0;
  bottom: 0px;
  .list-name{
    width: 120px;
    height: 100%;
    display: inline-block;
    li{
      height: 40px;
      line-height: 40px;
      color: #666;
      font-size: 15px;
      text-align: left;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
    }
    .active-name{
      color: #f64a43;
    }
  }
  .list-content{
    display: inline-block;
    width: calc(100% - 120px);
    background: rgba(1,32,0,0.5);
    height: 100%;
  }
}
</style>
