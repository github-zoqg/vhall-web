<template>
  <div class="detailBox" v-loading="loading" element-loading-text="数据获取中" v-if="!loading">
    <pageTitle :title='titleText(liveDetailInfo.webinar_state) + "详情"'></pageTitle>
    <el-row :gutter="16" class="basicInfo">
      <el-col :span="18" :lg='18' :md="24" :sm='24' :xs="24" :class="liveDetailInfo.webinar_state===4 ? 'active' : ''">
        <div class="inner">
          <div class="thumb">
            <img :src="liveDetailInfo.img_url" alt="">
            <span class="liveTag"><label class="live-status" v-if="liveDetailInfo.webinar_state == 1"><img src="../../common/images/live.gif" alt=""></label>
              {{ liveDetailInfo | liveTag }}
            </span>
            <span class="hot">
              <i class="iconfont-v3 saasicon_redu"></i>
              {{ liveDetailInfo.pv | unitCovert }}
            </span>
          </div>

          <div class="info">
            <p class="mainColor font-20">
              {{ fontNumber(liveDetailInfo.subject) }}
            </p>
            <p class="subColor" v-if="liveDetailInfo.webinar_state != 4">直播时间：{{ liveDetailInfo.webinar_state == 2 ? liveDetailInfo.created_at : liveDetailInfo.first_broad || liveDetailInfo.start_time }}</p>
            <p class="subDuration" v-else>点播时长：{{ liveDetailInfo.duration }}</p>
            <p class="subColor">观看限制：
              <span class="tag">{{ liveDetailInfo.verify | limitTag }}</span>
              <span class="tag" v-if="isForm">报名表单</span>
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
                  <img :src="h5WapLink" alt="" v-if="h5WapLink">
                  <p><el-button round type="primary" @click="downErCode">下载二维码</el-button></p>
                </div>
                <el-button round size="mini" slot="reference">扫码</el-button>
              </el-popover>
              <el-popover
                placement="bottom"
                trigger="hover"
              >
                <div class="invitation-code urlCopy">
                  <p>观看页 <el-input v-model="link" style="width: 320px"></el-input></p>
                  <p>
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
        <div class="inner liveTime" v-if="!outLiveTime">
          <p class="subColor">{{ liveDetailInfo.webinar_state | limitText}}</p>
          <p class="mainColor" v-if="liveDetailInfo.webinar_state === 2">
            <span>{{ time.day }}</span>
            <i>天</i>
            <span>{{ time.hours }}</span>
            <i>时</i>
            <span>{{ time.minute }}</span>
            <i>分</i>
            <span>{{ time.second }}</span>
            <i>秒</i>
          </p>
          <p v-else><span>{{ liveDetailInfo.webinar_state | liveText }}</span></p>
          <el-button round type="primary" @click="toRoom" :disabled="isAnginOpen">发起直播</el-button>
        </div>
        <div class="inner liveTime" v-if="outLiveTime && liveDetailInfo.webinar_state == 2">
          <p class="subColor">直播即将开始</p>
          <p><span>观众等待中</span></p>
          <el-button round type="primary" @click="toRoom">发起直播</el-button>
        </div>
      </el-col>
    </el-row>
    <item-card :type='liveDetailInfo.webinar_state' :isTrue="isTrue" :perssionInfo="perssionInfo" @blockHandler="blockHandler"></item-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ItemCard from '@/components/ItemCard/index.vue';
import Env from "@/api/env";
import { formateDates } from "@/utils/general.js"
import { sessionOrLocal } from '@/utils/utils';
export default {
  components: {
    PageTitle,
    ItemCard
  },
  data(){
    return {
      msg: '',
      perssionInfo:JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage')),
      loading: true,
      isForm: false,
      isAnginOpen: false,
      outLiveTime: false,
      liveDetailInfo: {
        webinar_state: 0,
        webinar_type: 0
      },
      link: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      h5WapLink: `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/watch/${this.$route.params.str}`,
      time: {
        day: 0,
        hours: 0,
        minute: 0,
        second: 0
      },
      operasOld: {
        '准备': [
          { icon: 'saasicon_jibenxinxi', title: '基本信息', subText: '编辑直播基本信息', path: '/live/edit' },
          { icon: 'saasicon_gongnengpeizhi', title: '功能配置', subText: '编辑直播功能配置', path: `/live/planFunction/${this.$route.params.str}`},
          { icon: 'saasicon_guankanxianzhi', title: '观看限制', subText: '设置直播观看限制', path: `/live/viewerRules/${this.$route.params.str}`},
          { icon: 'saasicon_jiaoseyaoqing', title: '角色邀请', subText: '设置不同角色参与直播的权限', index: 4, path: `/live/roleInvitation/${this.$route.params.str}`},
          { icon: 'saasicon_nuanchangshipin', title: '暖场视频', subText: '开启后设置暖场视频',index: 4, path: `/live/warm/${this.$route.params.str}`},
          { icon: 'saasicon_xunirenshu', title: '虚拟人数', subText: '添加直播的虚拟人数', path: `/live/virtual/${this.$route.params.str}`},
          { icon: 'saasicon_baomingbiaodan', title: '报名表单', subText: '开启后收集目标观众信息', path: `/live/signup/${this.$route.params.str}`},
          { icon: 'saasicon_tuiguangqianru', title: '推广嵌入', subText: '编辑设置直播推广嵌入', path: `/live/embedCard/${this.$route.params.str}`},
        ],
        '品牌': [
          { icon: 'saasicon_pinpaishezhi1', title: '品牌设置', subText: '设置观看页品牌信息', path: `/live/brandSet/${this.$route.params.str}`},
          { icon: 'saasicon_zidingyicaidan', title: '自定义菜单', subText: '自定义观看页菜单栏', path: `/live/customTab/${this.$route.params.str}`},
          { icon: 'saasicon_bofangqishezhi', title: '播放器设置', subText: '设置直播跑马灯水印', path: `/live/playerSet/${this.$route.params.str}`},
          { icon: 'saasicon_yaoqingkashezhi', title: '邀请卡', subText: '用于直播邀请或裂变分享', path: `/live/invCard/${this.$route.params.str}`},
          { icon: 'saasicon_guanggaotuijian', title: '广告', subText: '设置观看页广告位信息', path: `/live/advertCard/${this.$route.params.str}`},
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
  computed: {
    titleText(){
      return function(val){
        let _text = '直播'
        val == 5 ? _text = '回放' : val == 4 ? _text = '点播' : _text = '直播'
        return _text
      }
    },
    operas() {
      if (this.liveDetailInfo && this.liveDetailInfo.webinar_state === 4) {
        // 点播
        let { keys, values} = Object;
        let operas = this.operasOld;
        keys(this.operasOld).map((item, ins) => {
          operas[item] = values(this.operasOld)[ins].filter(vItem =>{
            vItem.title = vItem.title.replace(/回放/, '点播')
            vItem.subText = vItem.subText.replace(/直播/, '点播')
            if(vItem.title == '点播管理'){
               vItem.subText = '管理点播内容'
               vItem.path = `/live/recordplayback/${this.$route.params.str}`
            }
            if(vItem.title == '基本信息'){
              vItem.path = `/live/vodEdit/${this.$route.params.str}`
            }
            return vItem.index !== 4
          });
        })
        if (keys(this.operasOld).includes('直播')) {
          delete operas['直播'];
        }
        // console.log(operas, '过滤后内容');
        return operas;
      } else {
        return this.operasOld;
      }
    }
  },
  created(){
    this.getLiveDetail(this.$route.params.str);
    this.getPermission()
    let arr = ['component_1','component_2','component_3','component_4','component_5','component_6','component_7','component_8','component_9'];
    this.isTrue = arr.some(item => {
      // eslint-disable-next-line no-prototype-builtins
      return this.perssionInfo.hasOwnProperty(item)
    })
  },
  mounted() {
    console.log(this.$route.meta.title, '1111111111111111');
  },
  methods: {
    // 字符截取显示...兼容ie，用js
    fontNumber (date) {
      const length = date.length
      if (length > 35) {
          var str = ''
          str = date.substring(0, 35) + '...'
          return str
        } else {
          return date
        }
    },
    getPermission() {
      let perssionInfo = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      console
    },
    // 获取基本信息
    getLiveDetail(id) {
      this.loading = true;
      this.$fetch('getWebinarInfo', {webinar_id: id}).then(res=>{
        this.liveDetailInfo = res.data;
        if (res.data.webinar_state == 4) {
          this.$route.meta.title = '点播详情';
        } else {
          this.$route.meta.title = '直播详情';
        }
        this.getFormInfo(id);
        if (res.data.webinar_state == 1) {
          this.getOpenLive();
        }
        if (res.data.webinar_state == 2) {
          let date = new Date();
          let nowTime = date.setTime(date.getTime());
          this.downTime(formateDates(nowTime).replace(/-/g,'/'), res.data.start_time.replace(/-/g,'/'));
        }
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 获取是否有报名表单
    getFormInfo(id) {
      this.$fetch('regFromGet', {webinar_id: id}).then(res => {
        if (res.code == 200 && res.data.enable_status == 1) {
          this.isForm = true;
        } else {
          this.isForm = false;
        }
      })
    },
    // 下载二维码
    downErCode() {
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
        let a = document.createElement("a"); // 生成一个a元素
        let event = new MouseEvent("click"); // 创建一个单击事件
        a.download = `code${new Date().getTime()}`; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = this.h5WapLink;
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
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
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
    // 判断是否有起直播的权限
    getOpenLive() {
      this.$fetch('checkLive', this.$params({
        webinar_id: this.$route.params.str
      })).then((res) => {
        if(res && res.code === 200) {
          this.isAnginOpen = false;
        } else {
          this.isAnginOpen = true;
        }
      }).catch(e => {
        this.isAnginOpen = true;
      });
    },
    blockHandler(item){
      if(item.path){
        if (item.path === '/live/edit') {
          if (this.liveDetailInfo.webinar_state == 4) {
            this.$router.push({path: `/live/vodEdit/${this.$route.params.str}`, query: {type: 2 }});
          } else {
            this.$router.push({path: `${item.path}/${this.$route.params.str}`, query: {type: 2 }});
          }
        } else if (item.path === '/live/question') {
          // 问卷
          this.$router.push({path: `${item.path}/${this.$route.params.str}`, query: {roomId: this.liveDetailInfo.vss_room_id }});
        } else if(item.path === `/live/prizeSet/${this.$route.params.str}` || item.path === `/live/gift/${this.$route.params.str}`) {
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
      if (this.liveDetailInfo.webinar_type == 1) {
        let href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.$route.params.str}`;
        window.open(href, '_target');
      } else {
         const { href } = this.$router.resolve({path: `/live/chooseWay/${this.$route.params.str}/1?type=ctrl`});
        window.open(href);
      }
      // const { href } = this.$router.resolve({path: `/lives/room/${this.$route.params.str}`});

    },
    downTime(targetStartDate, targetEndDate) {
      let targetStart = new Date(targetStartDate);
      let targetEnd = new Date(targetEndDate);
      if (targetEnd.getTime() - targetStart.getTime() < 0) {
        this.outLiveTime = true;
        return false;
      } else {
        let diff = targetEnd.getTime() - targetStart.getTime();
        targetStart.setTime(targetStart.getTime() + 1000);
        let day = Math.floor(diff / (24 * 3600 * 1000));
        this.time.day = day > 9 ? day : `0${day}`;
        let limit1 = diff % (24 * 3600 * 1000);
        let hours = Math.floor(limit1 / (3600 * 1000));
        this.time.hours = hours > 9 ? hours : `0${hours}`;
        let limit2 = limit1 % (3600 * 1000);
        let minute = Math.floor(limit2 / (60 * 1000));
        this.time.minute = minute > 9 ? minute : `0${minute}`;

        let limit3 = limit2 % (60 * 1000);
        let second = Math.floor(limit3 / 1000);
        this.time.second = second > 9 ? second : `0${second}`;
        // console.log(diff, '????????????????????')
        if (diff) {
          let diffSetTime = window.setTimeout(() => {
            this.downTime(targetStart, targetEnd);
            window.clearTimeout(diffSetTime);
          }, 1000);
        } else {
          return `0天0时0分0秒`;
        }
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
        line-height: 28px;
        &:nth-child(1){
          margin-bottom: 16px;
          height: 56px;
          font-size: 20px;
          display: table-cell;
          vertical-align: middle;
        }
        &:last-child{
          margin-bottom: 20px;
        }
        // &:nth-child(2){
        //   margin-bottom: 10px;
        //   line-height: 20px;
        // }
        // &:nth-child(3){
        //   // margin-bottom: 20px;
        //   line-height: 20px;
        // }
      }
    }
    .thumb{
      width: 312px;
      height: 175px;
      position: relative;
      margin-right: 25px;
      background: #1A1A1A;
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
        border-radius: 6px;
      }
      .liveTag{
        background: rgba(0,0,0, .7);
        // background: rgba(247, 245, 245, 0.7);
        color: #fff;
        font-size: 12px;
        padding: 4px 12px;
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
//
.invitation-code{
  text-align: center;
  padding: 2px 40px;
  display: block!important;
  left: 50%;
  p{
    line-height: 40px;
  }
  img{
    margin-bottom: 10px;
  }
}
.urlCopy{
  padding: 2px 15px;
  p{
    margin-top: 20px;
    &:nth-child(2){
      padding: 4px;
      font-size: 16px;
      ::v-deep.el-button{
        font-size: 14px;
        line-height: 24px;
        padding: 2px 20px;
        margin-right: 20px;
      }
    }
  }
}

.mainColor{
  color: #1A1A1A;
}
.subColor, .subDuration{
  color: #666666;
}
.action-look{
  margin-top: 10px;
}
.font-20{
  font-size: @20;
  max-width: 500px;
  // height: 56px;
  // overflow: hidden;
  // text-overflow:ellipsis;
  // white-space: nowrap;
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
