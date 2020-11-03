<template>
  <div>
    <pageTitle title="创建直播"></pageTitle>
    <el-form>
      <el-form-item label="直播标题：" prop="name">
        <el-input v-model="formData.title" limit='100'></el-input>
      </el-form-item>
      <el-form-item label="直播时间：">
        <!-- <el-row :gutter="20"> -->
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期时间" v-model="formData.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-date-picker type="date" placeholder="选择日期时间" v-model="formData.date2" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        <!-- </el-row> -->
      </el-form-item>
      <el-form-item label="直播模式：">
        <div class="modeBox">
          <div @click='liveMode="video"' :class="{active: liveMode== 'video'}">
            <el-container class='model'>
              <el-aside width="80px" class="block">
                <i class="el-icon-video-camera icon"></i>
              </el-aside>
              <el-container>
                <el-header height='13px' class="block"></el-header>
                <el-main class="block"></el-main>
              </el-container>
            </el-container>
            <p class="desc">视频直播</p>
          </div>
          <div @click='liveMode="interactive"' :class="{active: liveMode== 'interactive'}">
            <el-container class='model'>
              <el-header height='13px'>
              <el-col :span="3" class="block"></el-col>
              <el-col :span="3" :offset='1' class="block"></el-col>
              <el-col :span="3" :offset='1' class="block"></el-col>
              <el-col :span="3" :offset='1' class="block"></el-col>
              <el-col :span="3" :offset='1' class="block"></el-col>
              <el-col :span="4" :offset='1' class="block"></el-col>
              </el-header>
              <el-container>
                <el-aside width="80px" class="block">
                  <i class="el-icon-s-custom icon"></i>
                </el-aside>
                <el-main class="block"></el-main>
              </el-container>
            </el-container>
            <p class="desc">互动直播</p>
          </div>
          <div @click='liveMode="audio"' :class="{active: liveMode== 'audio'}">
            <el-container class='model'>
              <el-aside width="80px" class="block">
                <i class="el-icon-microphone icon"></i>
              </el-aside>
              <el-container>
                <el-header height='13px' class="block"></el-header>
                <el-main class="block"></el-main>
              </el-container>
            </el-container>
            <p class="desc">音频直播</p>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="直播类别：">
        <span :class="{tag: true, active: tagIndex === index}" v-for="(item, index) in liveTags" :key="item" @click="tagIndex=index">{{item}}</span>
      </el-form-item>
      <el-switch
        style="display: block"
        v-model="docSwtich"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        inline
        inactive-text="文档翻页"
        :active-text="docSwtichDesc">
      </el-switch>
    </el-form>
  </div>
</template>

<script>
import pageTitle from './components/pageTitle'
export default {
  components: {
    pageTitle
  },
  computed: {
    docSwtichDesc(){
      if(this.docSwtich){
        return '已开启，支持观众直播中提前预览文档，进行文档翻页'
      }else{
        return "开启后，支持观众直播中提前预览文档，进行文档翻页"
      }
    }
  },
  data(){
    return {
      formData: {
        title: '',
        date1: '',
        date2: ''
      },
      docSwtich: false,
      liveTags: ["金融", '互联网', '汽车', '教育', '健康', '其他'],
      liveMode: "video",
      tagIndex: 0,
    }
  },
  created(){
    console.log(this)
  }
}
</script>

<style lang="less" scoped>
  .el-form{
    background: #ffffff;
    padding: 60px 80px;
    margin-top: 30px;
    /deep/ .el-switch__label--left{
      color: #1A1A1A;
      pointer-events: none;
      user-select: none;
    }
    /deep/ .el-switch__label--right{
      color: #999999;
      pointer-events: none;
      user-select: none;
    }
  }
  .el-form-item{
    width: 100%;
    max-width: 640px;
  }
  /deep/ .el-form-item__label{
    float: none;
  }
  .line{
    text-align: center;
    width: 20px;
  }
  .modeBox{
    display: flex;
    justify-content: space-between;
    >div{
      height: 112px;
      width: 200px;
      border-radius: 4px;
      border: 1px solid #CCCCCC;
      cursor: pointer;
      &.active{
        border-color: #FB3A32;
        .block{
          background: #FFEBEB;
          .icon{
            color: #FB3A32;
          }
        }
      }
      &:nth-child(2){
        .el-header{
          .block{
            height: 13px;
          }
        }
      }
    }
    .model{
      width: 100px;
      height: 56px;
      margin: 0 auto;
      margin-top: 16px;
      .el-aside{
        margin-right: 2px;
      }
      .el-header{
        margin-bottom: 2px;
      }
      .el-header,.el-main{
        padding: 0;
      }
      .block{
        background: #F2F2F2;
        position: relative;
      }
      .icon{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        font-size: 20px;
        color: #999999;
        height: fit-content;
        width: fit-content;
      }
    }
    .desc{
      font-size: 14px;
      text-align: center;
      line-height: 30px;
    }
  }
  .tag{
    padding: 3px 18px;
    border: 1px solid #CCCCCC;
    font-size: 14px;
    color: #666666;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 16px;
    transition: all .2s ease-out;
    &.active{
      background: #FB3A32;
      color: #fff;
      border-color: transparent;
    }
  }
</style>
<style lang="css">
  html{
    background: #F7F7F7;
  }
</style>
