<template>
  <div class="data-info">
    <div class="title-data">
      <span>{{ $route.name }}</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <search-area
      ref="searchArea"
      :searchAreaLayout="searchAreaLayout"
      @onSearchFun="getDataList('search')"
      >
      </search-area>
  </div>
</template>

<script>
// import searchArea from '@/components/SearchArea/index.vue';
export default {
  name: "dataInfo",
  components: {
    // searchArea
  },
  data() {
    return {
      searchAreaLayout: [
        {
          type: "1"
        },
        {
          type: "2",
          key: "searchDate",
        },
        {
          type: "3",
          key: "searchVersion",
          options: [
            {
              label: '主账号',
              value: 1
            },
            {
              label: '主账号+子账号',
              value: 2
            }
          ]
        }
      ],
    };
  },
  methods: {
    getDataList(params) {
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      console.log(formParams, params);
    }
  },
};
</script>

<style lang="less" scoped>
.data-info{
  /deep/.el-button {
      border: none;
      background: transparent;
    }
    /deep/.el-button.is-circle{
      padding:3px;
    }
    .title-data {
      margin: 10px 0 20px 0;
      text-align: left;
      line-height: 30px;
      span{
        font-size: 22px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #1a1a1a;
      }
      .button-tip {
        vertical-align: top;
      }
    }
}
</style>
