<template>
  <div class="section-footer">
    <div class="inner-center">
      <div class="about-us">
        <a href="">关于我们</a>
        <a href="">客户案例</a>
        <a href="">区域代理</a>
        <a href="">平台介绍</a>
        <a href="">服务条款</a>
        <a href="">常见问题</a>
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
        }
      }
      p{
        color: #808080;
        line-height: 25px;
      }
    }
  }
</style>
