<template>
  <el-card class="main_data">
    <div class="main_header">
      <p>关键数据</p>
    </div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6" v-if="titleType==='直播'">
        <div class="grid-content">
          <span>直播场次</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              直播开始到活动结束后计作1个场次，筛选条件内数据进行相加
            </div>
           <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>123</h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="titleType!=='全部'">
        <div class="grid-content">
          <span>{{ titleType }}总时长</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">每场直播活动的时长，筛选条件内数据进行相加</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>56:03:22</h3>
        </div>
      </el-col>
       <el-col :span="6" v-if="titleType==='全部'">
        <div class="grid-content">
          <span>活动总数</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">筛选条件内的活动总数，包含直播、点播</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.webinar_count}}</h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="titleType!=='点播'">
        <div class="grid-content">
          <span>最高并发</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              观看直播的连接数，即1个人同时打开3个观看页计作3个并发。<br />筛选条件内显示当前活动的最高并发
            </div>
           <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ highData || mainKeyData.max_onlines }}</h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>观看人数</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              直播创建至今，进入观看页面（直播+回放）的观看人数，以播放器sdk上报为准，<br />用户真实观看了视频。筛选条件内同一个用户多次观看会进行去重
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.watch_number}}</h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="titleType!=='直播'">
        <div class="grid-content">
          <span>观看次数</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              直播创建至今，进入观看页面（直播+回放）的观看次数，<br />播放器sdk上报的数据，数据不去重
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.watch_times }}</h3>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg bg-purple" :class="titleType !== '全部' ? 'activeJustify' : ''">
      <el-col :span="6" v-if="titleType==='直播'">
        <div class="grid-content">
          <span>观看次数</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              直播创建至今，进入观看页面（直播+回放）的观看次数，<br />播放器sdk上报的数据，数据不去重
            </div>
           <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.watch_times }}</h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>人均观看次数</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">人均观看次数=观看次数/观看人数</div>
           <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.watch_times_avg }}</h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>观看时长</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">筛选条件内的观看总时长</div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.watch_duration }}</h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>人均观看时长</span>
          <el-tooltip effect="dark" placement="right-start">
            <div slot="content">
              筛选条件内的观看平均时长。人均观看时长=观看时长/观看人数
            </div>
          <i class="el-icon-question"></i>
          </el-tooltip>
          <h3>{{ mainKeyData.watch_duration_avg }}</h3>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    titleType: {
      type: String,
      default: '直播'
    },
    highData: {
      type: Number,
      default: 0
    },
    mainKeyData: {
      type: Object
    }
  }
};
</script>
<style lang="less" scoped>
.main_data {
  padding-bottom: 4px;
  /deep/.el-button {
    border: none;
    background: transparent;
  }
  .main_header {
    text-align: left;
    padding: 12px 0 18px 12px;
    p {
      height: 26px;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 26px;
      margin: 0;
    }
  }
  .row-bg {
    margin: 12px 28px 64px 28px;
  }
  .bg-purple {
    margin-bottom: 26px;
  }
  .activeJustify{
    justify-content: space-around;
  }
  .grid-content {
    text-align: left;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #999;
      margin: 0;
    }
    h3 {
      font-size: 28px;
      font-family: DINAlternate-Bold, DINAlternate;
      font-weight: bold;
      color: #1a1a1a;
      margin: 0;
      padding-top: 6px;
    }
  }
}
</style>
