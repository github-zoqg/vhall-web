<template>
  <div class="data-center">
    <div class="main-center">
      <data-usage :upgrade_version="upgrade_version"></data-usage>
      <el-row type="flex" class="row-center" justify="space-between">
        <el-col :span="5">
          <div class="center-item">
            <p></p>
            <h3>创建直播</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item">
            <p></p>
            <h3>上传文档</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item">
            <p></p>
            <h3>品牌设置</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item">
            <p></p>
            <h3>账号数据</h3>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="center-item">
            <p></p>
            <h3>财务总览</h3>
          </div>
        </el-col>
      </el-row>
      <div class="row-list">
        <p class="list-title">直播列表</p>
        <el-row type="flex" class="row-buttom" justify="space-around">
          <el-col :span="6">
            <div class="buttom-item">
              <p>活动总数</p>
              <h2>88888888</h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看次数</p>
              <h2>550</h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看人数</p>
              <h2>550</h2>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="buttom-item">
              <p>观看时长(分)</p>
              <h2>55:00:00</h2>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="line-updata">
        <div class="line-tip">
          <p>用量统计</p>
        </div>
        <line-echarts></line-echarts>
      </div>
    </div>
    <div class="advert-banner">
      <div class="web-download">
        <button class="download-btn">立即下载</button>
      </div>
      <div class="app-download">
        <button class="download-btn">立即下载</button>
      </div>
      <div class="data-document">
        <h2>文档中心</h2>
        <p>API文档</p>
        <p>SDK文档</p>
      </div>
    </div>
  </div>
</template>
<script>
import LineEcharts from '@/components/Echarts/lineEcharts.vue';
import DataUsage from '@/components/DataUsage/index.vue';
export default {
  data() {
    return {
      upgrade_version: '无极版'
    };
  },
  components: {
    LineEcharts,
    DataUsage
  }
};
</script>
<style lang="less" scoped>
  .data-center{
    margin: auto;
    max-width: 1374px;
    border: 1px solid #ccc;
    display: flex;
    /deep/.el-col-5{
      width: 18.8%;
    }
    .main-center{
      flex: 1;
      .row-center{
        margin: 24px 0;
      }
      .center-item{
        height: 130px;
        background: #fff;
        border-radius: 4px;
        padding-top: 38px;
        text-align: center;
        cursor: pointer;
        &:hover{
          border: 2px solid #FB3A32;
        }
        p{
          width: 30px;
          height: 30px;
          margin: auto;
          border: 1px solid #ccc;
        }
        h3{
          font-size: 16px;
          color: #1A1A1A;
          line-height: 24px;
          padding-top: 5px;
        }
      }
      .row-list{
        height: 146px;
        background: #fff;
        .list-title{
          font-size: 16px;
          font-weight: 600;
          color: #1A1A1A;
          padding: 24px 0 0 32px;
        }
        .row-buttom{
          margin-bottom: 24px;
          .buttom-item{
           p{
              font-size: 14px;
              color: #999;
              padding: 17px 0 4px 40px;
            }
            h2{
              font-size: 22px;
              color: #1A1A1A;
              line-height: 30px;
              margin: auto;
              padding-left: 40px;
              font-weight: bold;
            }
          }
        }
      }
      .line-updata{
        margin-top: 24px;
        background: #fff;
        padding-bottom: 10px;
        .line-tip{
          padding: 24px 0 0 32px;
          font-size: 16px;
          color: #1A1A1A;
        }
      }
    }
    .advert-banner{
      width: 224px;
      height: 100px;
      margin-left: 32px;
      .download-btn{
        outline: none;
        width: 110px;
        height: 36px;
        border-radius: 18px;
        border: 1px solid #FB3A32;
        text-align: center;
        line-height: 36px;
        background: #fff;
        color: #FB3A32;
        position: absolute;
        left: 53px;
        bottom: 24px;
        cursor: pointer;
      }
      .web-download{
        height: 279px;
        background: #fff;
        border-radius: 4px;
        position: relative;
      }
      .app-download{
        height: 278px;
        background: #fff;
        margin:16px 0;
        border-radius: 4px;
        position: relative;
      }
      .data-document{
        background: #fff;
        h2{
          font-size: 16px;
          color: #1A1A1A;
          padding: 12px 0 14px 14px;
        }
        p{
          font-size: 14px;
          color: #666;
          padding: 0 0 11px 14px;
        }
      }
    }

  }
</style>
