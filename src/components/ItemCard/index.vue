<template>
  <div>
    <!-- <section v-for="(item, index) in operas" :key="index">
      <p class="subject">{{type == 4 && index == '回放' ? '点播' : index}}</p>
      <div class="subjectOuter">
        <div class="sunjectInner" v-for="opera in item" :key='opera.title' @click="blockHandler(opera)">
          <icon class="icon" :icon-class="opera.icon"></icon>
          <div class="desc">
            <p class="mainText">{{opera.title}}</p>
            <p class="subText">{{opera.subText}}</p>
          </div>
        </div>
      </div>
    </section> -->
    <section>
      <p class="subject">准备</p>
      <div class="subjectOuter">
        <div class="sunjectInner" v-for="item in readyList" @click="blockHandler(item)" :key="item.id" v-if="item.isShow">
          <template>
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt=""></span>
            <div class="desc">
              <p class="mainText">{{item.title}}</p>
              <p class="subText">{{item.subText}}</p>
            </div>
          </template>
        </div>
      </div>
    </section>
    <section>
      <p class="subject">品牌</p>
      <div class="subjectOuter">
        <template>
          <div class="sunjectInner" v-for="item in brandList" :key="item.id" @click="blockHandler(item)" v-if="item.isShow">
          <!-- <icon class="icon" :icon-class="item.icon"></icon> -->
          <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt=""></span>
          <div class="desc">
            <p class="mainText">{{item.title}}</p>
            <p class="subText">{{item.subText}}</p>
          </div>
        </div>
        </template>
      </div>
    </section>
    <section>
      <p class="subject">互动</p>
      <div class="subjectOuter">
        <template v-for="item in liveDataList">
          <div class="sunjectInner" :key="item.id" @click="blockHandler(item)" v-if="item.isShow">
            <!-- <icon class="icon" :icon-class="item.icon"></icon> -->
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt=""></span>
            <div class="desc">
              <p class="mainText">{{item.title}}</p>
              <p class="subText">{{item.subText}}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section v-if="!(childPremission && Number(childPremission.permission_content) === 0)">
      <p class="subject">{{ type == 4 ? '点播' : '回放'}}</p>
      <div class="subjectOuter">
        <div class="sunjectInner" @click="goHandler(type == 4 ? `/live/recordplayback/${$route.params.str}` : `/live/playback/${$route.params.str}`)">
          <!-- <icon class="icon" icon-class="saasicon_huifangguanli"></icon> -->
          <span><img src="../../common/images/icon/icon_review.png" alt=""></span>

          <div class="desc">
            <p class="mainText">{{ type == 4 ? '点播管理' : '回放管理'}}</p>
            <p class="subText">{{ type == 4 ? '管理点播内容' : '管理直播回放内容'}}</p>
          </div>
        </div>
      </div>
    </section>
     <section  v-if="!(childPremission && Number(childPremission.permission_data) === 0)">
      <p class="subject">数据</p>
      <div class="subjectOuter">
        <template  v-for="item in reportDataList">
          <div class="sunjectInner" @click="blockHandler(item)" :key="item.id" v-if="item.isShow">
            <!-- <icon class="icon" :icon-class="item.icon"></icon> -->
            <span><img :src="require(`../../common/images/icon/${item.icon}.png`)" alt=""></span>
            <div class="desc">
              <p class="mainText">{{item.title}}</p>
              <p class="subText">{{item.subText}}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<script>
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: "index.vue",
  props: {
    operas: {
      type: Object
    },
    type:{
      type: Number,
      default: 1
    },
    perssionInfo: {
      type: Object
    },
    webinarType: {
      type: Number,
      default: 2
    },
    childPremission: {
      type: Object
    },
    isTrue: {
      type:Boolean,
      default: true
    }
  },
  created() {
    console.log(this.perssionInfo, this.isTrue,  '????>>>>>>>>>>>')
  },
  data() {
    return {
      loading: false,
      readyList: [
        {icon: 'icon_information@2x', id: 1, title: '基本信息', subText: `编辑${this.type == 4 ? '点播' :'直播'}基本信息`, path: '/live/edit', isShow: true},
        { icon: 'icon_Functional@2x', id: 2, title: '功能配置', subText: `设置观看页功能是否展示`, path: `/live/planFunction/${this.$route.params.str}`,isShow: true},
        { icon: 'icon_watch@2x', id: 3, title: '观看限制', subText: `设置${this.type == 4 ? '点播' :'直播'}观看限制`, path: `/live/viewerRules/${this.$route.params.str}`, isShow: true},
        { icon: 'icon_role@2x', id: 4, title: '角色邀请', subText: '设置不同角色参与直播的权限', index: 4, path: `/live/roleInvitation/${this.$route.params.str}`, isShow: this.type != 4},
        { icon: 'icon_video@2x', id: 5, title: '暖场视频', subText: '开启后设置暖场视频',index: 4, path: `/live/warm/${this.$route.params.str}`, isShow: this.type != 4 && this.webinarType!=1},
        { icon: 'icon_virtual@2x', id: 6, title: '虚拟人数', subText: `添加${this.type == 4 ? '点播' :'直播'}的虚拟人数`, path: `/live/virtual/${this.$route.params.str}`, isShow: this.perssionInfo.virtual_user==1},
        { icon: 'icon_registration form@2x', id: 7, title: '报名表单', subText: '开启后收集目标观众信息', path: `/live/signup/${this.$route.params.str}`, isShow: this.perssionInfo.join_check==1},
        { icon: 'icon_embedded@2x', id: 8, title: '推广嵌入', subText: `获取活动推广嵌入的方法`, path: `/live/embedCard/${this.$route.params.str}`, isShow: true}
      ],
      brandList: [
        { icon: 'icon_brand@2x', id: 1, title: '品牌设置', subText: '设置观看页品牌信息', path: `/live/brandSet/${this.$route.params.str}`,isShow: true},
        { icon: 'icon_custom@2x', id: 2, title: '自定义菜单', subText: '自定义观看页菜单栏', path: `/live/customTab/${this.$route.params.str}`,isShow: this.isTrue},
        { icon: 'icon_player@2x',id: 3, title: '播放器设置', subText: `设置${this.type == 4 ? '点播' :'直播'}跑马灯水印`, path: `/live/playerSet/${this.$route.params.str}`,isShow: this.perssionInfo.player_config==1},
        { icon: 'icon_invitation@2x', id: 4, title: '邀请卡', subText: `用于${this.type == 4 ? '点播' :'直播'}邀请或裂变分享`, path: `/live/invCard/${this.$route.params.str}`,isShow: this.perssionInfo.btn_invite==1},
        { icon: 'icon_advertising@2x', id: 5, title: '广告', subText: '设置观看页广告位信息', path: `/live/advertCard/${this.$route.params.str}`,isShow: this.perssionInfo.ad_recommend==1},
        { icon: 'icon_public@2x', id: 6, title: '公众号', subText: '设置观看页展示公众号', path: `/live/officeSet/${this.$route.params.str}`,isShow: this.perssionInfo.live_broadcast_window==1},
        { icon: 'icon_posters@2x', id: 7, title: '开屏海报', subText: '设置观看页的开屏海报', path: `/live/posterCard/${this.$route.params.str}`,isShow: this.perssionInfo.market_open_posters==1},
      ],
      liveDataList: [
        { icon: 'icon_document@2x', id: 1, title: '文档', subText: '直播中使用文档演示', path: `/live/word/${this.$route.params.str}`,isShow: this.type != 4},
        { icon: 'icon_Lucky draw@2x', id: 2, title: '抽奖', subText: '直播中发起抽奖活跃气氛', path: `/live/prizeSet/${this.$route.params.str}`, isShow: this.perssionInfo['ui.hide_lottery']==0 && this.type != 4},
        { icon: 'icon_questionnaire@2x', id: 3,title: '问卷', subText: '创建问卷收集信息', path: '/live/question',isShow: this.perssionInfo['ui.hide_survey']==0 && this.type != 4 },
        { icon: 'icon_goods@2x', id: 4, title: '商品', subText: '设置展示给观众的商品', path: `/live/productSet/${this.$route.params.str}`,isShow: this.perssionInfo.product_show==1 || (this.type == 4 && this.perssionInfo.product_show==1)},
        { icon: 'icon_gift@2x', id: 5, title: '礼物', subText: '设置观众发送的礼物信息', path: `/live/gift/${this.$route.params.str}`,isShow: this.perssionInfo['ui.show_gift']==1 || (this.type == 4 && this.perssionInfo['ui.show_gift']==1)},
      ],
      reportDataList: [
        { icon: 'icon_data@2x',  id: 1, title: '数据报告', subText: `统计${this.type == 4 ? '点播' :'直播'}基本数据`, path: `/live/reportsData/${this.$route.params.str}`,isShow: true },
        { icon: 'icon_interactive@2x', id: 2, title: '互动统计', subText: `统计${this.type == 4 ? '点播' :'直播'}互动工具数据`, path: `/live/interactionData/${this.$route.params.str}`, isShow: true },
        { icon: 'icon_User statistics@2x', id: 3, title: '用户统计', subText: `统计${this.type == 4 ? '点播' :'直播'}观众详细数据`, path: `/live/userData/${this.$route.params.str}`, isShow: true },
      ]
    }
  },
  methods: {
    blockHandler(item) {
      this.$emit('blockHandler', item)
    },
    goHandler(path) {
      this.$router.push({path: path});
    }
  }
};
</script>

<style lang="less" scoped>
.subject{
  font-size: 20px;
  color: #333333;
  border-left: 4px solid #FB3A32;
  line-height: 16px;
  height: 18px;
  margin-top: 32px;
  margin-bottom: 12px;
  padding-left: 5px;
}
.subjectOuter{
  display: flex;
  flex-wrap: wrap;
  margin-right: -24px;
// justify-content: space-between;
}
.sunjectInner{
  display: flex;
  background: #fff;
  width: 330px;
  height: 110px;
  align-items: center;
  margin-bottom: 24px;
  margin-right: 18px;
  box-sizing: border-box;
  background-clip: content-box;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid transparent;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &:nth-child(4n) {
    margin-right: 18px;
  }
  &:hover{
    box-shadow: 0 6px 12px 0 rgba(251, 58, 50, 0.16);
    border: 1px solid #FB3A32;
  }
  span{
    width: 44px;
    height: 44px;
    display: inline-block;
    margin-right: 15px;
    border-radius: 50%;
    margin-left: 35px;
    img{
      width: 100%;
      height: 100%;
      // background: #FB3A32;
      // border: 1px solid #ccc;
    }
  }
  /deep/.svg-icon{
    text-align: center;
    font-size: 50px;
    vertical-align: top;
    color: #FB3A32;
  }
  .desc{
    .mainText{
      font-size: 20px;
      color: #1A1A1A;
      margin-bottom: 12px;
    }
    .subText{
      font-size: 14px;
      color: #666666;
    }
  }
}
@media screen and (min-width: 1920px) {
  .sunjectInner {
    &:nth-child(3n) {
      margin-right: 18px;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
</style>
