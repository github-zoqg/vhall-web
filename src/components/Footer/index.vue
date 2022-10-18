<template>
  <div  class="footer">
    <div>
      <a href="https://www.vhall.com/about" target="_blank" rel="noopener noreferrer">关于我们<em>｜</em></a>
      <a href="https://www.vhall.com/page-664.html" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/login'">直播案例<em>｜</em></a>
      <a href="https://www.vhall.com/blog/" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/register' || $route.path=='/forgetPassword'">客户案例<em>｜</em></a>
      <a href="https://www.vhall.com/" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/login'">加入微吼<em>｜</em></a>
      <a href="https://www.vhall.com/" target="_blank" rel="noopener noreferrer" v-if="$route.path=='/register' || $route.path=='/forgetPassword'">区域代理<em>｜</em></a>
      <a href="https://www.vhall.com/" target="_blank" rel="noopener noreferrer">平台介绍<em>｜</em></a>
      <a href="https://e.vhall.com/home/vhallapi/serviceterms" target="_blank" rel="noopener noreferrer">服务条款及隐私协议<em>｜</em></a>
      <a href="https://www.vhall.com/index.php?r=doc/detail/index&project_id=14&doc_id=173" target="_blank" rel="noopener noreferrer">常见问题</a>
    </div>
    <div class="copy-right">
      京ICP备10024636号-4京公网安备11010502008915 © Vhall 2021.All Rights Reserved.
    </div>
  </div>

</template>
<style lang="less" scoped>
  .footer {
    text-align: center;
    font-weight: 100;
    font-size: 12px;
    line-height: 18px;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 30px;
  }
  .footer a {
    color: #cccccc;
    em {
      font-style: normal;
    }
    &:hover{
      color: #1a1a1a;
      em {
        color: #cccccc;
      }
    }
  }
  .copy-right {
    color: #cccccc;
    margin-top: 8px;
  }
</style>
