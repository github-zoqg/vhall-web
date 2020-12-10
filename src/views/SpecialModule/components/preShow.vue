<template>
  <div class="show-special">
    <OldHeader></OldHeader>
    <div class="special-show-ctx">
      <pageTitle title="专题详情"></pageTitle>
      <el-card>
        <div class="special-main">
          <div class="special-img">
            <img src="//cnstatic01.e.vhall.com/static/img/v35-subject.png">
          </div>
          <div class="special-detail">
            <h1>看的见</h1>
            <p>2020-03-20 10:08</p>
            <h2>共<b>3</b>个直播<span><b>32</b>次观看</span><b>0</b>次预约</h2>
            <h3 @click="specialShare"><i class="el-icon-share"></i>分享</h3>
          </div>
        </div>
      </el-card>
      <el-card class="special-list">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="专题简介" name="first">
            <p class="text">专题简介............</p>
          </el-tab-pane>
          <el-tab-pane label="目录列表" name="second">
            <el-row :gutter="40" class="lives">
              <el-col class="liveItem" :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in liveList" :key="index">
                <div class="inner">
                  <div class="top">
                    <span class="liveTag">{{item.status}}</span>
                    <!-- <span class="hot">
                      <i class="el-icon-view"></i>
                      {{item.pv}}
                    </span> -->
                    <img :src="item.img_url" alt="">
                  </div>
                  <div class="bottom">
                    <div class="">
                      <p class="liveTitle">{{item.subject}}</p>
                      <p class="liveTime">{{item.start_time}} <span><i class="el-icon-view"></i> {{item.pv}}</span></p>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <share ref="share"></share>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import OldHeader from '@/components/OldHeader';
import share from './share';
export default {
  data() {
    return {
      activeName: 'second',
      liveList: [
        {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        },
         {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        },
         {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        },
         {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        },
         {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        }, {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        },
         {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        }, {
          status: '直播',
          pv: 1232,
          subject:'哈哈哈哈哈',
          start_time: '2020-12-10'
        }
      ]
    };
  },
  components: {
    PageTitle,
    OldHeader,
    share
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name;
    },
    specialShare() {
      this.$refs.share.specialVisible = true;
    }
  }

};
</script>
<style lang="less">
.titleBox {
  margin-top: 40px;
}
.special-show-ctx {
  width: 1300px;
  margin: 0 auto 50px auto;
}
  .show-special{
    height: 100%;
    /deep/.el-card__body {
      padding: 24px 32px;
    }
    .special-main{
      display: flex;
    }
    .special-img{
      img{
        width: 722px;
        height: 406px;
      }
    }
    .special-detail{
      margin-left: 23px;
      h1{
        font-size: 20px;
        color: #333333;
        padding-top: 10px;
        margin-bottom: 20px;
      }
      p{
        font-size: 16px;
        color: #8c8786;
        margin-bottom: 20px;
      }
      h2{
        font-size: 16px;
        color: #666666;
        margin-bottom: 25px;
        span{
          padding: 0 25px;
        }
        b{
          font-weight: 500;
          color: #ff3333;
          padding: 0 3px;
        }
      }
      h3{
        font-size: 12px;
        color: #999999;
        cursor: pointer;
        i{
          padding-right: 5px;
          font-size: 14px;
        }
      }
    }
    /deep/.el-tabs__content{
      min-height: 300px;
      padding: 20px;
    }
    .special-list{
      margin-top: 20px;
      .text{
        color: #383838;
        height: calc(100% - 592px);
      }
      .lives{
        .liveItem{
          height: 255px;
          margin-bottom: 20px;
          // border: 1px solid #ccc;
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
              bottom: 10px;
              left: 10px;
              color: #fff;
              font-size: 14px;
              z-index: 2;
            }
          }
          .bottom{
            height: 70px;
            background: #fff;
            box-sizing: border-box;
            padding: 10px 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .liveTitle{
              color: #1A1A1A;
              font-size: 16px;
              margin-bottom: 6px;
            }
            .liveTime{
              font-size: 14px;
              color: #666;
              span{
                float: right;
              }
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
    }
  }
</style>
