<template>
  <div class="detailBox">
    <pageTitle title='直播详情'></pageTitle>
    <el-row :gutter="16" class="basicInfo">
      <el-col :span="18" :lg='18' :md="24" :sm='24' :xs="24">
        <div class="inner">
          <div class="thumb">
            <img src="../../common/images/v35-webinar.png" alt="">
            <span class="liveTag">dqwdqwld</span>
            <span class="hot">
              <i class="el-icon-view"></i>
              {{3000 | unitCovert}}
            </span>
          </div>

          <div class="info">
            <p class="mainColor font-20">
              创想聚能艾瑞年对高峰会议既定终结会议攀登巅峰
            </p>
            <p class="subColor">活动时间：2020-10-09 09:30:00</p>
            <p class="subColor">观看限制：
              <span class="tag">白名单</span>
              <span class="tag">付费</span>
              <span class="tag">观看限制</span>
            </p>
            <p class="">
              <el-button round size="mini">恢复预告</el-button>
              <el-button round type="primary" size="mini">扫码</el-button>
              <el-button round size="mini">查看</el-button>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :lg='6' :md="24" :sm='24' :xs="24">
        <div class="inner liveTime">
          <p class="subColor">距离直播开始还有</p>
          <p class="mainColor">
            <span>10</span>
            <i>天</i>
            <span>08</span>
            <i>时</i>
            <span>46</span>
            <i>分</i>
            <span>25</span>
            <i>秒</i>
          </p>
          <el-button round type="primary">发起直播</el-button>
        </div>
      </el-col>
    </el-row>
    <item-card :operas="operas" @blockHandler="blockHandler"></item-card>
  </div>
</template>

<script>
import pageTitle from './components/pageTitle';
import ItemCard from '@/components/ItemCard/index.vue';
export default {
  components: {
    pageTitle,
    ItemCard
  },
  data(){
    return {
      msg: '',
      operas: {
        '准备': [
          { icon: '', title: '基本信息', subText: '编辑直播基本信息', path: '/setting-chat' },
          { icon: '', title: '功能配置', subText: '编辑直播功能配置', path: `/plan-function/${this.$route.params.str}` },
          { icon: '', title: '观看限制', subText: '设置直播观看限制', path: '/setting-chat' },
          { icon: '', title: '角色邀请', subText: '设置不同角色参与直播的权限', path: '/setting-chat' },
          { icon: '', title: '暖场视频', subText: '开启后设置暖场视频', path: '/setting-chat' },
          { icon: '', title: '虚拟人数', subText: '添加直播的虚拟人数', path: `/virtual/${this.$route.params.str}`},
          { icon: '', title: '报名表单', subText: '开启后收集目标观众信息', path: '/signup'},
          { icon: '', title: '推广嵌入', subText: '编辑设置直播推广嵌入', path: '/embed-card' },
        ],
        '品牌': [
          { icon: '', title: '品牌设置', subText: '设置观看页品牌信息', path: `/brand-set/${this.$route.params.str}` },
          { icon: '', title: '自定义菜单', subText: '自定义观看页菜单栏', path: `/custom-tab/${this.$route.params.str}` },
          { icon: '', title: '播放器设置', subText: '设置直播跑马灯水印' },
          { icon: '', title: '邀请卡', subText: '用于直播邀请或裂变分享', path: '/invitation-card' },
          { icon: '', title: '广告推荐', subText: '设置观看页广告位信息',  path: '/advertisement-card'},
          { icon: '', title: '公众号展示', subText: '设置观看页展示公众号', path: '/official-card' },
          { icon: '', title: '开屏海报', subText: '设置观看页的开屏海报', path: '/poster-card' },
        ],
        '直播': [
          { icon: '', title: '文档', subText: '直播中使用文档演示' },
          { icon: '', title: '抽奖', subText: '直播中发起抽奖活跃气氛' },
          { icon: '', title: '问卷', subText: '创建问卷收集信息' },
          { icon: '', title: '商品', subText: '直播中展示商品给观众' },
          { icon: '', title: '礼物', subText: '直播中观众发送的礼物' },
        ],
        '回放': [
          { icon: '', title: '回放管理', subText: '管理直播回放内容', path:`/playback/list/${this.$route.params.str}` },
          { icon: '', title: '回放重制', subText: '将文档和视频合并为MP4文件' },
        ],
        '数据': [
          { icon: '', title: '数据报告', subText: '统计直播基本数据', path: '/reports-data' },
          { icon: '', title: '互动统计', subText: '统计直播互动工具数据', path: '/interaction-data' },
          { icon: '', title: '用户统计', subText: '统计直播观众详细数据', path: '/user-data' },
        ]
      }
    };
  },
  filters: {
    unitCovert(val) {
      val = Number(val);
      if (isNaN(val)) return 0;
      if (val > 1e5 && val < 1e8) {
        return `${(val / 1e4).toFixed(2)}万`;
      } else if (val > 1e8) {
        return `${(val / 1e8).toFixed(2)}亿`;
      } else {
        return val;
      }
    },
  },
  methods: {
    blockHandler(item){
      if(item.path){
        this.$router.push({path: item.path});
      }else{
        console.log(item);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.basicInfo{
  display: flex;
  // min-width: 756px;
  flex-wrap: wrap;
  justify-content: space-between;
  .inner{
    background: #fff;
    width: 100%;
    height: 100%;
    padding: 24px;
    display: flex;
    .info{
      flex: 1;
      p{
        font-size: 14px;
        &:nth-child(1){
          margin-bottom: 16px;
          height: 56px;
          font-size: 20px;
          display: table-cell;
          vertical-align: middle;
          line-height: 24px;
        }
        &:nth-child(2){
          margin-bottom: 10px;
          line-height: 20px;
        }
        &:nth-child(3){
          margin-bottom: 20px;
          line-height: 20px;
        }
      }
    }
    .thumb{
      width: 312px;
      height: 175px;
      position: relative;
      margin-right: 25px;
      img{
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
      .liveTag{
        background: rgba(0,0,0, .7);
        color: #fff;
        font-size: 12px;
        padding: 2px 9px;
        border-radius: 20px;
        position: absolute;
        top: 12px;
        left: 12px;
      }
      .hot{
        position: absolute;
        bottom: 10px;
        left: 10px;
        color: #fff;
        font-size: 14px;
      }
    }
    .tag{
      border-radius: 20px;
      background: #F2F2F2;
      font-size: 12px;
      padding: 2px 8px;
      margin-right: 8px;
    }
  }
}
.mainColor{
  color: #1A1A1A;
}
.subColor{
  color: #666666;
}
.font-20{
  font-size: @20;
}
.liveTime{
  font-size: 14px;
  justify-content: center;
  flex-direction: column;
  i{
    font-style: normal;
  }
  p{
    text-align: center;
    &:nth-child(1){
      margin-bottom: 10px;
    }
    &:nth-child(2){
      span{
        font-size: 30px;
        font-weight: bold;
      }
      i{
        margin: 0 2px;
      }
      margin-bottom: 18px;
    }
  }
  .el-button{
    width: 160px;
    margin: 0 auto;
  }
}
.detailBox {
  margin: auto;
  width: 1020px;
}
@media screen and (min-width: 1920px) {
  .detailBox {
    // padding: 0px 140px;
    margin: auto;
    width: 1374px;
  }
}
</style>
