<template>
  <el-tabs class="border" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="(item, index) in menus" :key="item.id" :label="item.name" :name="String(index)" v-loading="fetching">
      <template v-if="item.type ==4">
        <span class="desc">{{desc}}</span>
      </template>
      <template v-else-if="item.type ==1 && !!item.details">
        <template v-for="(compontent, compontentindex) in item.details" >
          <!-- 图文 -->
          <div :key="`${item.id}${compontent.id}`" v-if="compontent.component_id ==1" v-html="compontent.content"></div>
          <!-- 二维码 -->
          <img :key="`${item.id}${compontent.id}`" v-else-if="compontent.component_id ==2" :src="compontent.imageSrc" alt="二维码加载失败" class="custom_qrcode">

          <!-- 直播 || 专题-->
          <ul :key="`${item.id}${compontent.component_id}-${compontentindex}`" v-else-if="compontent.component_id == 3 || compontent.component_id == 4" class="lives">
            <li v-for="live in compontent.items" :key="live.id">
              <div class="cover">
                <img :src="live.img_url || '//t-alistatic01.e.vhall.com/static/img/video_default.png'" alt="封面加载失败">
                <i class="el-icon-video-play playBtn"></i>
                <span :class="{'tag': true, red: live.type==1, blue: live.type==2, gray: live.type==3, green: live.auto_record==1}">{{ live | statusFilter}}</span>
                <span class="lb">
                  <i class="el-icon-view"></i>
                  {{compontent.component_id == 3 ? live.num : live.view_num}}
                  <span class="info" v-if="compontent.component_id == 4">
                    <i class="el-icon-video-camera"></i>
                    {{live.webinar_num}}
                  </span>
                </span>
              </div>
              <p class="title">{{compontent.component_id == 3 ? live.subject : live.title}}</p>
              <p class="sub">{{compontent.component_id == 3 ? live.start_time : live.created_at}}</p>
            </li>
          </ul>
          <!-- 文字链接 -->
          <a :key="`${item.id}${compontent.component_id}`" v-else-if="compontent.component_id == 5" :href="compontent.src" target="_blank" class="textLink">{{compontent.text}}</a>

          <!-- 图片链接 -->
          <a :key="`${item.id}${compontent.component_id}`" v-else-if="compontent.component_id == 6" :href="compontent.src" target="_blank" class="textLink">
            <img :src="compontent.imageSrc" alt="图片加载失败">
          </a>
          <!-- 标题 -->
          <h5 class="customTitle" :key="`${item.id}${compontent.component_id}`" v-else-if="compontent.component_id == 7">{{compontent.title}}</h5>
          <!-- 分割线 -->
          <div class="splitLine" :key="`${item.id}${compontent.component_id}`" v-else-if="compontent.component_id == 8"></div>
          <!-- 排行榜 -->
          <div class="rank" :key="`${item.id}${compontent.component_id}`" v-else-if="compontent.component_id == 9">
            <p class="rankTitle">
              <span :class="{active: rankActive ==0}" @click="rankActive=0">邀请榜</span>
              <span :class="{active: rankActive ==1}" @click="rankActive=1">打赏榜</span>
              <span class="right" @click="rankRuleShow=!rankRuleShow">排行榜规则 <i :class="{'el-icon-arrow-down': true, ruleActive: rankRuleShow}"></i></span>
            </p>
            <transition name="el-fade-in">
              <p class="desc" v-show="rankRuleShow" v-html="rankActive ==0? compontent.inContent : compontent.rewardContent"></p>
            </transition>
            <div class="emptyRank">
              <icon icon-class="saasshafa"></icon>
              <p>当前{{emptyRankText}}，快去抢沙发吧~</p>
            </div>

          </div>
        </template>
        <!-- <div  v-if="item.">

        </div> -->
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data(){
    return {
      activeName: "0",
      menus: [],
      fetching: false,
      rankActive: 0,
      rankRuleShow: false
    };
  },
  props: ['desc'],
  created(){
    this.getMenuList();
  },
  computed: {
    emptyRankText(){
      if(this.rankActive==0){
        return '您还没邀请人';
      }else{
        return '还没有人打赏';
      }
    }
  },
  filters: {
    statusFilter(item){
      if(Number(item.auto_record)) return '回放';
      let text = status;
      switch (item.type) {
        case "2":
          text = '预约';
          break;
        case "3":
          text = '结束';
          break;
        case "1":
          text = '直播';
          break;

        default:
          break;
      }
      return text;
    }
  },
  methods: {
    handleClick(tab, event) {
      let menu = this.menus[Number(this.activeName)];
      if(!menu.details){
        this.fetching = true;
        this.getMenuDetail(menu);
      }
    },
    getMenuList(){
      this.$fetch('newWebinarMenus', {webinar_id: this.$route.params.id}).then(res=>{
        this.menus = res.data.list.filter(item=>{
          let str = item.components;
          item.components = item.components ? JSON.parse(item.components) : [];
          return item.type != 2 && item.type != 3;
        });
      }).catch(error=>{
        console.log(error);
      });
    },
    getMenuDetail(menu){
      this.$fetch('webinarCMenuGet', {menu_id: menu.id}).then(res=>{
        this.$set(menu, 'details', res.data.components);
        console.log(res);
      }).catch(error=>{
        console.log(error);
      }).finally(()=>{
        this.fetching = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .border{
    margin-top: 20px;
    border: 1px solid #d2d2d2;
    /deep/ .el-tabs__content{
      padding: 20px;
      font-size: 14px;
      color: #666;
    }
  }
  /deep/ .el-tab-pane{
    overflow: hidden;
    position: relative;
    line-height: 26px;
    min-height: 100px;
  }
  .custom_qrcode{
    margin: 0 auto;
    display: block;
    width: 150px;
  }
  .lives{
    li{
      border: 1px solid #e5e5e5;
      padding: 10px;
      width: 272px;
      height: 214px;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,0.08);
      border: 1px solid #e5e5e5;
      margin: 5px;
      cursor: pointer;
      display: inline-block;
      transition: border .2s linear;
      position: relative;
      &:hover{
        border-color: #FB3A32;
      }
      .cover{
        width: 100%;
        height: 154px;
        position: relative;
        background: #ccc;
        img{
          width: 100%;
          height: 100%;
        }
        .playBtn{
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: fit-content;
          height: fit-content;
          font-size: 40px;
          color: #aaa;
        }
      }
      .title{
        font-size: 14px;
        color: #333;
        // line-height: 20px;
        text-indent: 6px;
      }
      .tag{
        position: absolute;
        top: 0px;
        left: 0px;
        padding: 2px 4px;
        line-height: 16px;
        text-align: center;
        font-size: 12px;
        color: #fff;
        z-index: 2;
        &.blue{
          background-color: #5ea6ec;
        }
        &.red{
          background-color:#fc5659;
        }
        &.gray{
          background-color: #999;
        }
        &.green{
          background-color: #2ab804;
        }
      }

      .lb{
        position: absolute;
        right: 0;
        bottom: 0;
        color: #ddd;
        font-size: 14px;
        padding-right: 6px;
        .info{
          padding-left: 4px;
          border-left: 2px solid 777;
          line-height: 1;
          height: 12px;
          display: inline-block;
        }
      }
      .sub{
        font-size: 12px;
        color: #999;
        line-height: 10px;
        text-indent: 6px;
      }
    }
  }
  .textLink{
    color: #58abff;
    display: block;
    &:hover{
      text-decoration: underline;
    }
  }
  .customTitle{
    font-size: 14px;
    color: #666;
    padding-left: 6px;
    border-left: 4px solid #fc5659;
    line-height: 14px;
    margin: 5px 10px;
    font-weight: bold;
  }
  .splitLine{
    width: 100%;
    margin: 10px;
    height: 1px;
    background: #cdcdcd;
  }
  .rank{
    width: 400px;
    padding: 10px;
    background: url("https://t-alistatic01.e.vhall.com/static/images/menu/rank-bg.png?v=MgM36HIN839xqrAGtTXHJg%3D%3D");
    .desc{
      padding: 10px;
      background: #fff;
    }
    .emptyRank{
      text-align: center;
      background-color: #fff;
      padding: 80px 0;
      margin-top: 10px;
      .iconContainer{
        font-size: 50px;
        color: #999;
      }
    }
  }
  .rankTitle{
    span{
      color: #fff;
      opacity: .8;
      margin-right: 30px;
      cursor: pointer;
      &.active{
        opacity: 1;
      }

    }
    .right{
      float: right;
      margin-right: 0;
      opacity: 1;
      i{
        transition: all .2s linear;
      }
      .ruleActive{
        transform: rotate(-180deg);
      }
    }
  }
  .desc{
    width: 100%;
    min-height: 30px;
    text-align: left;
    display: inline-block;
  }
</style>
