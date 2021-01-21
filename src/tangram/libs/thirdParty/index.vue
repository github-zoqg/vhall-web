<template>
  <div class="third-warp">
    <div class="title">
      <h4>推流设置</h4>
    </div>
    <div class="content-scroll-wrap clearfix">
      <div class="left">
        <div class="step clearfix">
          <dl>
            <dt></dt>
            <dd>获取<br>推流地址</dd>
          </dl>
        </div>
        <div class="step step2 clearfix">
          <dl>
            <dt></dt>
            <dd>使用第三方<br>推流工具</dd>
          </dl>
        </div>
      </div>
      <div class="right">
        <div class="block block1 clearfix">
          <div class="clearfix">
            <label>RTMP URL</label>
            <p>
            <input readonly="" unselectable="on" type="text" v-model="push_address" id="link_text_2">
            <a id="copy-button-2" @click="doCopy(1)" class="copy-button" flag="1" >复制</a>
            </p>
          </div>
          <div class="clearfix" style="margin-top:16px;">
            <label>播放路径/串流码</label><p>
            <input readonly="" v-model="stream_number" unselectable="on" type="text" value="530166370" id="link_text_3">
            <a id="copy-button-3" data-clipboard-target="link_text_3" class="copy-button" flag="1" @click="doCopy(2)">复制</a>
          </p>
          </div>
        </div>
        <div class="block block2 clearfix">
          <div class="clearfix bd">
            <p><i></i>使用第三方推流</p>
            <ol>
              <li>1.在第三方工具中添加RTMP URL与串流码</li>
              <li>2.使用第三方工具推流</li>
              <li>3.点击右上方的“开始直播”按钮</li>
            </ol>
          </div>
          <div class="clearfix" style="margin-top: 20px">
            <p><i class="equip"></i>使用设备推流</p>
            <ol>
              <li>1.在设备中添加RTMP URL与串流码</li>
              <li>2.使用设备推流</li>
              <li>3.点击右上方的“开始直播”按钮</li>
            </ol>
          </div>
        </div>
        <a href="https://e.vhall.com/home/vhallapi/streamsetup" target="_blank" class="more-detail">详细教程</a>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    webinarId:{
      type: String,
      required: true
    }
  },
  data () {
    return {
      stream_number: '',
      push_address: ''
    };
  },
  created () {
    this.$fetch('getStreamPushAddress', {
      webinar_id: this.webinarId
    }).then((res) => {
      console.warn(res, '第三方推流');
      if(res.code != 200) return this.$message.warning(res.msg)
      this.stream_number = res.data.stream_code;
      this.push_address = res.data.stream_address;
    });
  },
  mounted () {

  },
  filters: {
  },
  methods: {
    doCopy (type) {
      let _this = this;
      let url;
      if (type == 1) {
        url = this.push_address;
      } else {
        url = this.stream_number;
      }
      this.$copyText(url).then(e => {
        this.$message({
          message: `复制成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(error=>{
        this.$message({
          message: `复制失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    }

  }
};
</script>
<style lang="less">
.third-warp{
  background: #f1f1f1;
  margin: 0px auto;
  padding-top: 50px;
  width: 100%;
  height: 100%;
  h4 {
    height: 40px;
    line-height: 40px;
    padding-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
    width: 750px;
    overflow: auto;
    margin: 0px auto;
  }
  dl {
    margin: 0;
    padding: 0;
    outline: none;
  }
  .clearfix:before {
    display: table;
    content: " ";
  }
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
  .content-scroll-wrap {
    width: 750px;
    overflow: auto;
    margin: 0px auto;
    color: #444;
    font-size: 12px;
    .left::after {
      content: '';
      position: absolute;
      width: 1px;
      height: 195px;
      top: 116px;
      left: 18px;
      background-color: #cccccc;
    }
    .left {
      float: left;
      margin-right: 25px;
      position: relative;
      .step {
        margin-top: 90px;
        margin-left: 5px;
        dt {
          float: left;
          width: 26px;
          height: 26px;
          background-color: #ffffff;
          -webkit-box-shadow: 0 0 9px 0 #cccccc;
          box-shadow: 0 0 9px 0 #cccccc;
          position: relative;
          border-radius: 500px;
          margin-right: 10px;
        }
        dt:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -6px;
          margin-top: -6px;
          width: 12px;
          height: 12px;
          background-color: #cccccc;
          border-radius: 500px;
        }
        dd {
          float: left;
          font-size: 14px;
          color: #333;
        }
      }
      .step2 {
        margin-top: 185px;
      }
    }
    .right {
      float: left;
      width: 608px;
      position: relative;
      .block1 {
        padding: 50px 36px;
        label {
          width: 90px;
          text-align: right;
          font-size: 12px;
          color: #333;
          float: left;
          height: 30px;
          line-height: 30px;
          margin-right: 10px;
        }
        p {
          width: 415px;
          border-radius: 2px;
          background-color: #f7f7f7;
          border: solid 1px #dddddd;
          border-right: none;
          line-height: 30px;
          position: relative;
          float: left;
          overflow: hidden;
          input {
            width: 320px;
            border: none;
            background: #f7f7f7;
            padding-left: 10px;
            color: #999;
          }
          a {
            cursor: pointer;
            position: absolute;
            top: -1px;
            right: 0;
            display: inline-block;
            width: 75px;
            font-size: 12px;
            text-align: center;
            border: 1px solid #dddddd;
            color: rgb(102, 102, 102);
            background: rgb(255, 255, 255);
            border-color: rgb(221, 221, 221);
            &:hover {
              color: rgb(255, 255, 255);
              background: rgb(255, 91, 91);
              border-color: rgb(255, 91, 91);
            }
          }
        }
      }
      .block {
        border-radius: 4px;
        background-color: #ffffff;
        -webkit-box-shadow: 0 2px 9px 0 rgba(0,0,0,0.05);
        box-shadow: 0 2px 9px 0 rgba(0,0,0,0.05);
        margin-bottom: 10px;
      }
      .block2 {
        padding: 40px;
        .bd {
          border-bottom: 1px solid #ddd;
          padding: 0 0 20px 0;
        }
        div {
          line-height: 25px;
          p {
            float: left;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin-right: 10px;
            padding-left: 40px;
            width: 85px;
            text-align: left;
            position: relative;
            i {
              position: absolute;
              left: 0;
              top: -3px;
              width: 28px;
              height: 28px;
              background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/new_host_sprite.png?v=SGnm%2B%2FdyJ64oKrOI%2BJTU%2Fg%3D%3D) no-repeat -179px -127px;
              border-radius: 500px;
            }
          }
          ol {
            float: left;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            li {
              list-style: none;
              font-weight: normal;
            }
            }
          }
        }

      }
    .more-detail {
      position: absolute;
      bottom: 30px;
      right: 38px;
      color: #4da1ff;
      font-size: 12px;
      cursor: pointer;
    }
  }
}

</style>
