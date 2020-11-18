<template>
  <div class="embed-card">
    <pageTitle title="推广嵌入"></pageTitle>
    <el-card>
      <h3>微信嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>我的主页</span>
          <el-input v-model="myMain" ></el-input>
          <el-button type="primary">复制</el-button>
        </div>
        <div class="input-item">
          <span>观看直播</span>
          <el-input v-model="myMain" ></el-input>
          <el-button type="primary">复制</el-button>
        </div>
        <p>帮助：在微信公众号管理平台好的声卡本报独家卡来设计的萨克环境来看 <span>微信嵌入</span></p>
      </div>
    </el-card>
    <el-card class="network">
      <h3>网页嵌入</h3>
    </el-card>
    <el-card>
      <h3>第三方渠道推广嵌入</h3>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: 'embedCard',
  data() {
    return {
      myMain: '',
    };
  },
  components: {
    PageTitle
  }
};
</script>

<style lang="less" scoped>
.embed-card{
  h3{
    font-weight: normal;
    font-size: 16px;
    color: #333;
  }
  p{
    padding: 10px 0 0 20px;
    line-height: 30px;
    span{
      color: darkblue;
      cursor: pointer;
    }
  }
  .input-item{
    display: flex;
    padding: 30px 50px 0 50px;
    span{
      display: inline-block;
      width: 100px;
      line-height: 35px;
    }
    .el-button{
      display: inline-block;
      margin-left: 20px;
      padding: 10px 20px;
    }
  }
  .network{
    margin: 30px 0;
  }
}
</style>
