<template>
  <div class="liveListBox" v-loading="loading" element-loading-text="数据获取中">
    <pageTitle title="专题管理">
      <!-- <div slot="content">
        1.热度：创建至今，进入观看页面（直播和回放、点播）的浏览量
        <br/>
        2.控制台数据为真实数据，不统计虚拟数据
      </div> -->
    </pageTitle>

    <!-- 操作栏 -->
    <div class="operaBox" v-show="totalElement || isSearch">
      <el-button size="medium" type="primary" round @click="$router.push({path:'/special/edit',query: {title: '创建'}})">创建专题</el-button>
      <div class="searchBox">
        <el-select v-model="orderBy" placeholder="请选择" @change="searchHandler">
          <el-option
            v-for="item in orderOptions"
            :key="item.value+item.label"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input
          placeholder="请输入专题标题"
          clearable
          @change="searchHandler"
          v-model.trim="keyWords">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="searchHandler">
          </i>
        </el-input>
      </div>
    </div>
    <!-- 操作栏 -->

    <el-row :gutter="40" class="lives" v-show="totalElement">
      <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in liveList" :key="index">
        <div class="inner">
          <div class="top">
           <!-- <span class="liveTag">{{item | liveTag}}</span>-->
            <span class="hot">
              <i class="iconfont-v3 saasicon_redu"> {{item.pv | unitCovert}}</i>
            </span>
            <img :src="item.cover || `${env.staticLinkVo.tmplDownloadUrl}/img/v35-subject.png`" alt="">
          </div>
          <div class="bottom">
            <div class="">
              <p class="liveTitle" :title="item.title">{{item.title}}</p>
              <p class="liveTime">{{item.created_at}}</p>
            </div>
            <p class="liveOpera">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit-outline" @click="$router.push({path:'/special/edit',query: {id: item.id, title: '编辑'}})"></i>
                <!-- <router-link :to="'/special/edit' + item.webinar_id"><i class="el-icon-edit-outline"></i></router-link> -->
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="预览" placement="top">
                <i class="el-icon-reading" @click="specialDetail(item)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分享" placement="top">
                <i class="el-icon-share" @click.prevent.stop="toShare(item.id)"></i>
              </el-tooltip>
              <el-tooltip class="item isDelete" effect="dark" content="删除" placement="top">
                <i class="el-icon-delete" @click="deleteHandle(item.id)"></i>
              </el-tooltip>
            </p>
          </div>
          <transition name="el-zoom-in-bottom">
            <div class="mask" v-show="!!item.liveDropDownVisible"></div>
          </transition>
        </div>
      </el-col>
    </el-row>
    <SPagination :total="totalElement" :page-size='pageSize' :current-page='pageNum' @current-change="currentChangeHandler" align="center" v-if="totalElement > pageSize"></SPagination>
     <div class="no-live" v-show="!totalElement">
      <noData :nullType="nullText" :text="text">
        <el-button type="primary" round @click="$router.push({path:'/special/edit',query: {title: '创建'}})" v-if="nullText==='nullData'">创建专题</el-button>
      </noData>
    </div>
    <VhallDialog
      title="分享"
      :visible.sync="dialogShareVisible"
      :close-on-click-modal="false"
      width="28%">
      <div class="content">
        <share slot="content" :url="home_link"></share>
      </div>
   </VhallDialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import noData from '@/views/PlatformModule/Error/nullPage';
import Env from '@/api/env.js';
import share from '@/components/Share'
export default {
  data() {
    return {
      liveStatus: 0,
      isSearch: false,
      nullText: 'nullData',
      text: '暂未创建专题活动',
      dialogShareVisible: false,
      orderBy: 1,
      keyWords: '',
      pageSize: 12,
      pageNum: 1,
      pos: 0,
      home_link: '',
      totalElement: 0,
      liveDropDownVisible: false,
      orderOptions: [
        { label: '按创建时间排序', value: 1 },
        { label: '按照标题排序', value: 2 }
      ],
      loading: true,
      liveList: [],
      shareUrl: null,
      env: Env
    };
  },
  components: {
    PageTitle,
    share,
    noData
  },
  created() {
    this.getLiveList();
  },
  methods: {
    searchHandler() {
      this.pageNum = 1;
      this.pos = 0;
      this.getLiveList();
      console.log('searchHandler');
    },
    currentChangeHandler(current) {
      this.pageNum = current;
      this.pos = parseInt((current - 1) * this.pageSize);
      console.log(this.pos, this.pageNum);
      this.getLiveList();
    },
    getLiveList(){
      const data = {
        pos: this.pos,
        limit: this.pageSize,
        title: this.keyWords,
        order_type: this.orderBy,
      };
      this.loading = true;
      console.log(data);
      this.$fetch('subjectList', this.$params(data)).then(res=>{
        this.liveList = res.data.list;
        this.totalElement = res.data.total;
        if (this.orderBy == 1 && !this.keyWords) {
          // 默认状态
          this.nullText = 'nullData';
          this.isSearch = false;
          this.text = '暂未创建专题活动';
        } else {
          // 搜索状态
          this.nullText = 'search';
          this.isSearch = true;
          this.text = '';
        }
      }).catch(error=>{
        this.$message.error(`获取专题列表失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 删除
    deleteHandle(id) {
      this.$confirm('您确定要删除选中的专题吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          this.trueDelete(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    trueDelete(id) {
      this.$fetch('subjectDel', {subject_ids: id}).then(res=>{
        if(res && res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 刷新列表
          this.searchHandler();
        }
      }).catch(error=>{
        this.$message.error(`删除失败，${error.message}`);
      }).finally(()=>{
        this.loading = false;
      });
    },
    toShare(id) {
      this.home_link = `${process.env.VUE_APP_WEB_URL}/special/detail/?id=${id}`;
      this.dialogShareVisible = true;
    },
    // 预览页面
    specialDetail(item) {
      let routeData = this.$router.resolve({ path: '/special/detail', query: {id: item.id } });
      window.open(routeData.href, '_blank');
    }
  },
  filters: {
    liveTag(val) {
      /**
       * type  1预约 2直播 3回放 4点播 5结束
       * is_interact 是否互动
       *
       * type: 0直播  1点播  2回放
       * status：0互动直播  1音频直播 2视频直播
       */
      const liveTypeStr = ['', '预约', '直播', '回放', '点播', '结束'];
      const liveStatusStr = ['互动直播', '音频直播', '视频直播'];
      let str = liveTypeStr[val.type];
      if (val.type != 4) {
        str += ` | ${liveStatusStr[val.is_interact]}`;
      }
      return str;
    },
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
    subLiveTitle(str) {
      if (typeof str == 'string') {
        str = `${str.substring(0, 32)}...`;
      }
      return str;
    }
  }
};
</script>

<style lang="less" scoped>
  .liveListBox{
    user-select: none;
    // padding: 0px 60px;
  /*  .el-button{
      color:#FB3A32;
      border-color:#FB3A32;
      &:hover{
        background: #ffebeb;
      }
    }
    .el-button--primary{
      background:#FB3A32;
      border-color:#FB3A32;
      color: #fff;
      &:hover{
        background: #fc615b;
      }
    }*/
    /deep/.el-dialog__body{
      padding-bottom: 20px;
    }
  /*  .el-button.is-round{
      padding: 10px 23px;
    }*/
  }
  .pageTitle{
    color: #1A1A1A;
    font-size: 22px;
    font-weight: 600;
  }
  .operaBox{
    overflow: hidden;
    margin-top: 30px;
    margin-bottom: 20px;
    .searchBox{
      float: right;
      .el-select{
        &:nth-child(1){
          width: 200px;
          margin-right: 20px;
        }
      }
      .el-input{
        width: 220px;
        .el-input__icon{
          cursor: pointer;
        }
        /deep/ .el-input__icon{
          line-height: 36px;
        }
      }
      /deep/ .el-input__inner{
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .lives{
    // overflow: hidden;
    // display: flex;
    // justify-content: space-between;
    // flex-flow: wrap;
    // margin-bottom: 20px;
    .liveItem{
      // width: 312px;
      height: 314px;
      margin-bottom: 20px;
      // float: left;
      // margin-right: 40px;
      .inner{
        transition: all .15s ease-in;
        position: relative;
      }
      .inner:hover{
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.15);
      }
      .top{
        height: 175px;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        padding: 10px 10px;
        box-sizing: border-box;
        position: relative;
        img{
          width: 100%;
          height: 100%;
          position: absolute;
          top:0;
          left: 0;
        }
        .liveTag{
          background: rgba(0,0,0, .7);
          color: #fff;
          font-size: 12px;
          padding: 2px 9px;
          border-radius: 20px;
          position: relative;
          z-index: 2;
        }
        .hot{
          position: absolute;
          height: 50px;
          width: 100%;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
          bottom: 0px;
          left: 0px;
          color: #fff;
          font-size: 14px;
          z-index: 2;
          i{
            position: absolute;
            left: 14px;
            bottom: 10px;
          }
        }
      }
      .bottom{
        height: 139px;
        background: #fff;
        box-sizing: border-box;
        padding: 14px 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .liveTitle{
          color: #1A1A1A;
          font-size: 16px;
          margin-bottom: 6px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .liveTime{
          font-size: 14px;
          color: #666;
        }
        .liveOpera{
          color: #666666;
          font-size: 18px;
          i{
            cursor: pointer;
            &:nth-child(2){
              margin: 0 20px;
            }
          }
          .el-dropdown{
            float: right;
            &.active{
              z-index: 2;
              color: #fff;
            }
          }
          .isDelete{
            float: right;
          }
        }
      }
    }
  }
  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, .8) 100%);
    z-index: 1;
  }
  .liveListBox {
    margin: auto;
    width: 1020px;
  }
  @media screen and (min-width: 1920px) {
    .liveListBox {
      // padding: 0px 140px;
      margin: auto;
      width: 1374px;
    }
  }
  // @media screen and (min-width: 1920px) {
  //   .liveListBox {
  //     padding: 0px 160px;
  //   }
  // }
</style>

<style lang="css">
  html{
    background: #F7F7F7;
  }
</style>
