<template>
  <div class="main_data">
    <div class="main_header">
      <p>关键数据</p>
    </div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6" v-if="titleType == 1">
        <div class="grid-content">
          <span>直播场次</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">直播开始到活动结束后计作1个场次，筛选条件内数据进行相加</div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            <count-to
              :startVal="0"
              :endVal="mainKeyData.total"
              :duration="1500"
              v-if="mainKeyData.total >= 0"
            ></count-to>
          </h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="titleType">
        <div class="grid-content">
          <span>{{ titleType == 1 ? '直播' : '' }}总时长</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">
              {{
                titleType == 1 ? '每场直播活动的时长，筛选条件内数据进行相加' : '点播视频的总时长'
              }}
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            {{ mainKeyData.total_live_time }}
            <!-- <count-to :startVal="0"
              :endVal="mainKeyData.total_live_time"
              :duration="1500"
              v-if="mainKeyData.total_live_time >= 0">
            </count-to> -->
          </h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="!titleType">
        <div class="grid-content">
          <span>活动总数</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">
              筛选条件内创建的活动总数，包含直播、点播
              <br />
              删除活动或者删除子账号不影响已统计的历史数据
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            <count-to
              :startVal="0"
              :endVal="mainKeyData.webinar_count"
              :duration="1500"
              v-if="mainKeyData.webinar_count >= 0"
            ></count-to>
          </h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="titleType != 4">
        <div class="grid-content">
          <span>最高并发（方）</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">
              观看直播的连接数，即1个人同时打开3个观看页计作3个并发。
              <br />
              筛选条件内显示当前活动的最高并发
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            <count-to
              :startVal="0"
              :endVal="mainKeyData.max_onlines"
              :duration="1500"
              v-if="mainKeyData.max_onlines >= 0"
            ></count-to>
          </h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>观看人数</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content" v-if="!titleType">
              统计进入观看页面的观看人数，以播放器sdk上报为准，用户真实观看了视频。
              <br />
              筛选条件内将活动数据进行相加，数据不去重
            </div>
            <div slot="content" v-else>
              {{ titleType == 4 ? '点播' : '直播' }}创建至今，进入观看页面{{
                titleType == 4 ? '' : '（直播+回放）'
              }}的观看人数，以播放器sdk上报为准，
              <br />
              用户真实观看了视频。筛选条件内同一个用户多次观看会进行去重
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            <count-to
              :startVal="0"
              :endVal="mainKeyData.watch_number"
              :duration="1500"
              v-if="mainKeyData.watch_number >= 0"
            ></count-to>
          </h3>
        </div>
      </el-col>
      <el-col :span="6" v-if="titleType != 1">
        <div class="grid-content">
          <span>观看次数</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content" v-if="titleType == 4">
              点播创建至今，进入观看页面的观看次数，播放器sdk上报的数据，数据不去重
            </div>
            <div slot="content" v-else>
              统计进入观看页面的观看次数，播放器sdk上报的数据。
              <br />
              筛选条件内将活动数据进行相加，数据不去重
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            <count-to
              :startVal="0"
              :endVal="mainKeyData.watch_times"
              :duration="1500"
              v-if="mainKeyData.watch_times >= 0"
            ></count-to>
          </h3>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg bg-purple" :class="titleType ? 'activeJustify' : ''">
      <el-col :span="6" v-if="titleType == 1">
        <div class="grid-content">
          <span>观看次数</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content">
              直播创建至今，进入观看页面（直播+回放）的观看次数，
              <br />
              播放器sdk上报的数据，数据不去重
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            <count-to
              :startVal="0"
              :endVal="mainKeyData.watch_times"
              :duration="1500"
              v-if="mainKeyData.watch_times >= 0"
            ></count-to>
          </h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>人均观看次数</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content" v-if="!titleType">
              人均观看次数=观看次数/观看人数，筛选条件内将活动数据进行相加，数据不去重
            </div>
            <div slot="content" v-else>人均观看次数=观看次数/观看人数</div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            {{ mainKeyData.watch_times_avg }}
            <!-- <count-to :startVal="0"
              :endVal="mainKeyData.watch_times_avg"
              :duration="1500"
              v-if="mainKeyData.watch_times_avg >= 0">
            </count-to> -->
          </h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>观看时长（分）</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content" v-if="!titleType">
              筛选条件内的观看总时长，将活动数据进行相加，数据不去重
            </div>
            <div slot="content" v-else>筛选条件内的观看总时长</div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            {{ mainKeyData.watch_duration }}
          </h3>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <span>人均观看时长（分）</span>
          <el-tooltip effect="dark" placement="right" v-tooltipMove>
            <div slot="content" v-if="!titleType">
              筛选条件内的观看平均时长，将活动数据进行相加，数据不去重。人均观看时长=观看时长/观看人数
            </div>
            <div slot="content" v-else>
              筛选条件内的观看平均时长。人均观看时长=观看时长/观看人数
            </div>
            <i class="iconfont-v3 saasicon_help_m"></i>
          </el-tooltip>
          <h3 class="custom-font-barlow">
            {{ mainKeyData.watch_duration_avg }}
          </h3>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import CountTo from 'vue-count-to';
  export default {
    props: {
      titleType: {
        type: Number,
        default: 0
      },
      highData: {
        type: Number,
        default: 0
      },
      mainKeyData: {
        type: Object
      }
    },
    components: {
      CountTo
    },
    created() {
      console.log(this.titleType, 23234432534535);
    }
  };
</script>
<style lang="less" scoped>
  .main_data {
    padding: 24px 32px;
    background: #fff;
    border-radius: 4px;
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
        font-family: @fontRegular;
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
    .activeJustify {
      justify-content: space-around;
    }
    .grid-content {
      text-align: left;
      > span {
        font-size: 14px;
        font-family: @fontRegular;
        color: #999;
        margin: 0;
      }
      i {
        font-size: 14px;
        padding: 0 2px;
      }
      h3 {
        padding-top: 6px;
        font-size: 28px;
        font-weight: bold;
        color: #1a1a1a;
        span {
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin: 0;
        }
      }
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
  }
</style>
