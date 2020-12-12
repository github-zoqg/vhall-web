<template>
  <div class="detailBox">
    <pageTitle title='直播详情'></pageTitle>
    <el-row :gutter="16" class="basicInfo">
      <el-col :span="18" :lg='18' :md="24" :sm='24' :xs="24" :class="liveDetailInfo.webinar_state===4 ? 'active' : ''">
        <div class="inner">
          <div class="thumb">
            <img :src="liveDetailInfo.img_url" alt="">
            <span class="liveTag"><label class="live-status" v-if="liveDetailInfo.webinar_state == 1"><img src="../../common/images/live.gif" alt=""></label>{{ liveDetailInfo | liveTag }}</span>
            <span class="hot">
              <i class="el-icon-view"></i>
              {{ liveDetailInfo.hide_pv | unitCovert }}
            </span>
          </div>

          <div class="info">
            <p class="mainColor font-20">
              {{ liveDetailInfo.subject }}
            </p>
            <p class="subColor">活动时间：{{ liveDetailInfo.actual_start_time }}</p>
            <p class="subColor">观看限制：
              <span class="tag">{{ liveDetailInfo.verify | limitTag }}</span>
              <!-- <span class="tag">报名表单</span> -->
            </p>
            <div class="action-look">
              <el-button round size="mini" v-if="[3, 5].includes(liveDetailInfo.webinar_state)" style="margin-right:15px;" @click="resetResume(liveDetailInfo.webinar_state)">恢复预告</el-button>
              <el-popover
                  placement="bottom"
                  trigger="hover"
                  style="margin-right:15px"
                >
                <div class="invitation-code">
                  <p>活动观看页</p>
                  <img :src="showCode" alt="">
                  <p><el-button round type="primary">下载二维码</el-button></p>
                </div>
                  <el-button round size="mini" slot="reference">扫码</el-button>
              </el-popover>
               <el-popover
                  placement="bottom"
                  trigger="hover"
                >
                <div class="invitation-code">
                  <p>直播观看页 <el-input v-model="link" style="width: 320px"></el-input></p>
                  <p style="margin-top:20px;text-align: center;">
                    <el-button round size="mini" type="primary" @click="doCopy">复制</el-button>
                    <el-button round size="mini" type="primary" @click="openLink">打开页面</el-button></p>
                </div>
                  <el-button round size="mini" slot="reference">查看</el-button>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :lg='6' :md="24" :sm='24' :xs="24" v-if="liveDetailInfo.webinar_state !== 4">
        <div class="inner liveTime">
          <p class="subColor">{{ liveDetailInfo.webinar_state | limitText}}</p>
          <p class="mainColor" v-if="liveDetailInfo.webinar_state === 2">
            <span>10</span>
            <i>天</i>
            <span>08</span>
            <i>时</i>
            <span>46</span>
            <i>分</i>
            <span>25</span>
            <i>秒</i>
          </p>
          <p v-else><span>{{ liveDetailInfo.webinar_state | liveText }}</span></p>
          <el-button round type="primary" @click="toRoom">发起直播</el-button>
        </div>
      </el-col>
    </el-row>
    <item-card :operas="operas" @blockHandler="blockHandler"></item-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ItemCard from '@/components/ItemCard/index.vue';
import QRcode from 'qrcode';
import Env from "@/api/env";
export default {
  components: {
    PageTitle,
    ItemCard
  },
  data(){
    return {
      msg: '',
      imgBaseUrl: Env.staticLinkVo.uploadBaseUrl,
      liveDetailInfo: {},
      showCode: '',
      link: `${Env.staticLinkVo.WEB_SHARE_URL}/live/watch/${this.$route.params.str}`,
      operas: {
        '准备': [
          { icon: 'saasicon_jibenxinxi', title: '基本信息', subText: '编辑直播基本信息', path: '/live/edit' },
          { icon: 'saasicon_gongnengpeizhi', title: '功能配置', subText: '编辑直播功能配置', path: `/live/planFunction/${this.$route.params.str}`},
          { icon: 'saasicon_guankanxianzhi', title: '观看限制', subText: '设置直播观看限制', path: `/live/viewerRules/${this.$route.params.str}`},
          { icon: 'saasicon_jiaoseyaoqing', title: '角色邀请', subText: '设置不同角色参与直播的权限', path: `/live/roleInvitation/${this.$route.params.str}`},
          { icon: 'saasicon_nuanchangshipin', title: '暖场视频', subText: '开启后设置暖场视频', path: `/live/warm/${this.$route.params.str}`},
          { icon: 'saasicon_xunirenshu', title: '虚拟人数', subText: '添加直播的虚拟人数', path: `/live/virtual/${this.$route.params.str}`},
          { icon: 'saasicon_baomingbiaodan', title: '报名表单', subText: '开启后收集目标观众信息', path: `/live/signup/${this.$route.params.str}`},
          { icon: 'saasicon_tuiguangqianru', title: '推广嵌入', subText: '编辑设置直播推广嵌入', path: `/live/embedCard/${this.$route.params.str}`},
        ],
        '品牌': [
          { icon: 'saasicon_pinpaishezhi1', title: '品牌设置', subText: '设置观看页品牌信息', path: `/live/brandSet/${this.$route.params.str}`},
          { icon: 'saasicon_zidingyicaidan', title: '自定义菜单', subText: '自定义观看页菜单栏', path: `/live/customTab/${this.$route.params.str}`},
          { icon: 'saasicon_bofangqishezhi', title: '播放器设置', subText: '设置直播跑马灯水印', path: `/live/playerSet/${this.$route.params.str}`},
          { icon: 'saasicon_yaoqingkashezhi', title: '邀请卡', subText: '用于直播邀请或裂变分享', path: `/live/invCard/${this.$route.params.str}`},
          { icon: 'saasicon_guanggaotuijian', title: '广告推荐', subText: '设置观看页广告位信息', path: `/live/advertCard/${this.$route.params.str}`},
          { icon: 'saasicon_gongzhonghaozhanshi', title: '公众号展示', subText: '设置观看页展示公众号', path: `/live/officialCard/${this.$route.params.str}`},
          { icon: 'saasicon_kaipinghaibao', title: '开屏海报', subText: '设置观看页的开屏海报', path: `/live/posterCard/${this.$route.params.str}`},
        ],
        '直播': [
          { icon: 'saasicon_wendang', title: '文档', subText: '直播中使用文档演示', path: `/live/word/${this.$route.params.str}`},
          { icon: 'saasicon_choujiang', title: '抽奖', subText: '直播中发起抽奖活跃气氛', path: `/live/prizeSet/${this.$route.params.str}`},
          { icon: 'saasicon_wenjuan', title: '问卷', subText: '创建问卷收集信息', path: '/live/question' },
          { icon: 'saasicon_shangpin', title: '商品', subText: '直播中展示商品给观众', path: `/live/productSet/${this.$route.params.str}`},
          { icon: 'saasicon_liwu', title: '礼物', subText: '直播中观众发送的礼物', path: `/live/gift/${this.$route.params.str}`},
        ],
        '回放': [
          { icon: 'saasicon_huifangguanli', title: '回放管理', subText: '管理直播回放内容', path: `/live/playback/${this.$route.params.str}` },
          // { icon: '', title: '回放重制', subText: '将文档和视频合并为MP4文件' },
        ],
        '数据': [
          { icon: 'saasicon_shujubaogao', title: '数据报告', subText: '统计直播基本数据', path: `/live/reportsData/${this.$route.params.str}` },
          { icon: 'saasicon_hudongtongji', title: '互动统计', subText: '统计直播互动工具数据', path: `/live/interactionData/${this.$route.params.str}` },
          { icon: 'saasicon_yonghutongji', title: '用户统计', subText: '统计直播观众详细数据', path: `/live/userData/${this.$route.params.str}` },
        ]
      }
    };
  },
  created(){
    // console.log(this.link, '1111111111111111');
    this.getLiveDetail(this.$route.params.str);
  },
  // filters: {
  //   unitCovert(val) {
  //     val = Number(val);
  //     if (isNaN(val)) return 0;
  //     if (val > 1e5 && val < 1e8) {
  //       return `${(val / 1e4).toFixed(2)}万`;
  //     } else if (val > 1e8) {
  //       return `${(val / 1e8).toFixed(2)}亿`;
  //     } else {
  //       return val;
  //     }
  //   },
  // },
  methods: {
    getLiveDetail(id) {
      this.$fetch('getWebinarInfo', {webinar_id: id}).then(res=>{
        this.liveDetailInfo = res.data;
        // this.liveDetailInfo.webinar_state = 5;
        this.getCode();
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 获取扫码查看
    getCode() {
      QRcode.toDataURL(
      this.link,
      (err, url) => {
        this.showCode = url;
      }
     );
    },
    // 复制
    doCopy () {
      this.$copyText(this.link).then(e => {
        this.$message.success('复制成功！');
      }).catch(error=>{
        this.$message.error('复制失败！');
      });
    },
    // 打开页面
    openLink() {
      window.open(this.link, '_blank');
    },
    //恢复预告
    resetResume(status) {
      if (status === 5) {
        this.$confirm('恢复为预告后，回放将不能观看', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reSumeNotice();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      } else {
        this.reSumeNotice();
      }
    },
    reSumeNotice() {
      this.$fetch('liveEdit', {webinar_id:this.$route.params.str, type: 2}).then(res=>{
        this.$message.success('恢复预告成功');
        this.getLiveDetail(this.$route.params.str);
      }).catch(error=>{
        this.$message.error(`恢复预告失败，${error.message}`);
      });
    },
    blockHandler(item){
      if(item.path){
        if (item.path === '/live/edit') {
          this.$router.push({path: item.path, query: {id:this.$route.params.str }});
        } else if (item.path === '/live/question') {
          // 问卷
          this.$router.push({path: item.path, query: {id:this.$route.params.str, roomId: this.liveDetailInfo.vss_room_id }});
        } else if(item.path === `/live/prizeSet/${this.$route.params.str}`) {
          // 奖品
          this.$router.push({path: item.path, query: {roomId:this.liveDetailInfo.vss_room_id }});
        } else if (item.path === `/live/interactionData/${this.$route.params.str}`) {
          // 互动统计
          this.$router.push({path: item.path, query: {roomId:this.liveDetailInfo.vss_room_id }});
        } else {
          this.$router.push({path: item.path});
        }
      }else{
        console.log(item);
      }
    },
    toRoom(){
      // 跳转至发起页面
      // const { href } = this.$router.resolve({path: `/live/room/${this.$route.params.str}`});
      const { href } = this.$router.resolve({path: `/live/chooseWay/${this.$route.params.str},1`});
      window.open(href);
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
  .active{
    width: 100%;
  }
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
        // background: rgba(247, 245, 245, 0.7);
        color: #fff;
        font-size: 12px;
        padding: 2px 9px;
        border-radius: 20px;
        position: absolute;
        top: 12px;
        left: 12px;
        .live-status{
          img{
            margin-right:4px;
            width: 8px;
            height: 8px;
          }
        }
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
/*.detailBox {
  margin: auto;
  width: 1020px;
}
@media screen and (min-width: 1920px) {
  .detailBox {
    // padding: 0px 140px;
    margin: auto;
    width: 1374px;
  }
}*/
</style>
