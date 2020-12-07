<template>
  <div class="doc-preview-wrap">
    <ul class="Thumbnail">
      <li :class="activeIns === index ? 'imgActive' : ''" v-for="index of docParam.page" :key="index">
        <img :index="index" :src="`${env.staticLinkVo.wordShowUrl}/${docParam.hash}/${index}.jpg`"><span>{{index}}</span></li>
    </ul>
    <div class="del_imgBox">
      <div class="imgBox">
        <img v-for="sIndex of docParam.page" :key="`s_${sIndex}`" :class="['imgHidden', {'imgShow': activeIns === sIndex}]" :index="sIndex" :src="`${env.staticLinkVo.wordShowUrl}/${docParam.hash}/${sIndex}.jpg`">
      </div>
      <img class="imgLoading" :src="`${env.staticLinkVo.tmplDownloadUrl}/images/delFlash/load.gif`" style="display: none;">
      <p class="arrow" style="display: block;">
        <span class="left" @click="showLastImg">&lt;</span>
        <strong class="page">{{activeIns}}/ {{ docParam.page }}</strong>
        <span class="right" @click="showNextImg">&gt;</span>
      </p>
    </div>
  </div>
</template>
<script>
import Env from '@/api/env.js';
export default {
  props: {
    docParam: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      env: Env,
      activeIns: 1
    };
  },
  created() {
    this.initSize();
  },
  methods: {
    initSize(){

    },
    showNextImg() {
      if(this.activeIns === this.docParam.page) {
        return;
      } else {
        this.activeIns++;
      }
    },
    showLastImg() {
      if(this.activeIns === 1) {
        return;
      } else {
        this.activeIns--;
      }
    }
  },
};
</script>
<style lang="less" scoped>
.doc-preview-wrap {
  width: calc(100% - 40px);
  height: 540px;
  position: absolute;
}
.Thumbnail {
  width: 120px;
  height: 540px;
  overflow-y: auto;
  display: inline-block;
  float: left;
  margin-left: 0;
  border: 2px solid #ccc;
}
.Thumbnail li {
  position: relative;
  border: 2px solid #ccc;
}
.Thumbnail li img {
  display: inline-block;
  width: 100%;
}
.Thumbnail li span {
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 4px;
  color: white;
  background: #ccc;
}
.imgActive {
  border: 2px solid #fc5659!important;
}
.del_imgBox {
  width: calc(100% - 140px);
  display: inline-block;
  height: 540px;
}
.del_imgBox .imgBox {
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
}
.imgHidden {
  display: none;
}
.imgShow {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.del_imgBox .imgBox img {
  height: 100%;
}
.imgLoading {
  width: 40px!important;
  position: absolute;
  height: 40px!important;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.del_imgBox .arrow {
  position: absolute;
  left: 50%;
  transform: translateX(-28%);
  bottom: 30px;
  min-width: 114px;
  border: 1px solid #999;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  border-radius: 4px;
  background: #999;
  padding: 0 4px;
}
.del_imgBox strong {
  height: 30px;
  line-height: 30px;
  float: left;
  color: #eee;
}
.del_imgBox .arrow span {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #eee;
  float: left;
}
.del_imgBox span.right{
  text-align: right;
}
.del_imgBox .arrow span:nth-child(1) {
  margin-left: 10px;
}
b, strong {
  font-weight: 700;
}
.del_imgBox .arrow span {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  color: #eee;
  float: left;
}
.del_imgBox {
  img {
    height: 100%;
    width: auto;
  }
}
</style>
