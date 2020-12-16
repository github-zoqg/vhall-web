<template>
  <div class="section-footer">
    <div class="inner-center">
      <div class="about-us">
        <a href="https://www.vhall.com/about" target="_blank" rel="noopener noreferrer">关于我们</a>
        <a href="https://www.vhall.com/page-664.html" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/login'">直播案例</a>
        <a href="https://www.vhall.com/blog/" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/register'">客户案例</a>
        <a href="https://www.vhall.com/" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/login'">加入微吼</a>
        <a href="https://www.vhall.com/" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/register'">区域代理</a>
        <a href="https://www.vhall.com/" target="_blank" rel="noopener noreferrer">平台介绍</a>
        <a href="https://t.e.vhall.com/home/vhallapi/serviceterms" target="_blank" rel="noopener noreferrer">服务条款及隐私协议</a>
        <a href="https://test.vhall.com/index.php?r=doc/detail/index&project_id=14&doc_id=173" target="_blank" rel="noopener noreferrer">常见问题</a>
      </div>
      <p>京ICP备10024636号-4京公网安备11010502008915</p>
      <p>© Vhall 2020.All Rights Reserved.</p>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .section-footer{
    z-index: 1;
    font-size: 12px;
    .inner-center{
      padding: 20px 0;
      text-align: center;
      .about-us{
        padding-bottom: 10px;
        a{
          color: #eaeaea;
          border-right: 1px solid #eaeaea;
          padding: 0 10px;
          &:last-child{
            border-right:0;
          }
          &:hover{
            text-decoration: underline;
          }
        }
      }
      p{
        color: #808080;
        line-height: 25px;
      }
    }
  }
</style>
