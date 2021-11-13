[阿里图标库项目地址](https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.12&manage_type=myprojects&projectId=2212678&keyword=&project_type=&page=)

# 参数说明
iconClass 此参数为图标类名，可在阿里图标库复制获得每个图标对应的类名，可直接在图标出复制
className 元素类名，可自定义设置字体大小，颜色等样式，覆盖原有样式

# 已注册为全局组件，可直接使用 例:
<icon icon-class="saasicon_zhiwu"></icon>

# 每次图标变更，需下载新的js文件替换iconfont.js内容

#引入说明
1、Font class下载方式把源文件下载下来
2、替换src\common\icon-font中文件，并修改iconfont.css
>>>
@font-face {
  font-family: "iconfont-v3"; /* Project id 2212678 */
  src: url('iconfont.woff2?t=1636515512217') format('woff2'),
       url('iconfont.woff?t=1636515512217') format('woff'),
       url('iconfont.ttf?t=1636515512217') format('truetype');
}

.iconfont-v3 {
  font-family: "iconfont-v3" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
3、替换src\components\Icon\iconfont.js为最新文件
