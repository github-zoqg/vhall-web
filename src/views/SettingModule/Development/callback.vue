<template>
  <div class="page-callback">
    <div class="title-callback">
      <pageTitle title="回调设置"></pageTitle>
      <a href="https://www.vhall.com/saas/doc/20.html" target="_blank">回调设置说明</a>
    </div>
    <div class="layout-callback">
      <el-form :model="form" ref="form" :rules="formRules" label-width="91px">
        <el-form-item label="签名Key" prop="secret_key">
          <VhallInput v-model.trim="form.secret_key" auto-complete="off" placeholder="请输入签名规则" :maxlength="32" show-word-limit></VhallInput>
        </el-form-item>
        <el-form-item label="回调地址" prop="callback_url">
          <VhallInput v-model.trim="form.callback_url" auto-complete="off" placeholder="请输入Https或http开头的完整url" :maxlength="255" show-word-limit></VhallInput>
        </el-form-item>
      </el-form>
      <div class="div__func div__view" v-if="keyList.length > 0">
        <ul class="switch__list">
          <li class="switch__box" v-for="(item, ins) in keyList" :key="`view_`+ins">
            <label class="leve3_title label__r12">{{ item.key_name }}</label>
            <el-switch
              v-model="item.value"
              :active-value="1"
              :inactive-value="0"
              active-color="#FB3A32"
              inactive-color="#CECECE">
            </el-switch>
            <span class="leve3_title title--999">{{!!item.value ? item.closeShow : item.openShow}}</span>
          </li>
        </ul>
      </div>
      <el-form label-width="91px">
        <el-form-item label="" class="callback-btn">
          <el-button type="primary" class="length152" v-preventReClick round @click.prevent.stop="saveCallbackInfo">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "callback.vue",
  components: {
    PageTitle
  },
  data() {
    return {
      callbackVo: {},
      isAdd: null,
      form: {
        secret_key: null,
        callback_url: null
      },
      formRules: {
        secret_key: [
          { required: true, message: '请输入签名规则', trigger: 'blur' }
        ],
        callback_url: [
          { required: true, message: '请输入Https或http开头的完整url', trigger: 'blur' },
          { pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入Https或http开头的完整url' , trigger: 'blur'}
        ]
      },
      keyList: []
    }
  },
  created() {
    this.getCallbackInfo();
  },
  methods: {
    getCallbackInfo() {
      let eventsList = [];
      this.$fetch('getCallbackInfo', {}).then(res => {
        if (res && res.code === 200) {
          this.form = res.data;
          eventsList = (res.data.callback_event || '').split(',');
        } else {
          this.form = {
            secret_key: null,
            callback_url: null
          }
        }
        this.isAdd = !(res.data && res.data.id);
        let keyList = [
          {
            type: 'key_1',
            key_name: '活动状态',
            openShow: '开启后，直播开始或结束时进行通知',
            closeShow: '已开启，直播开始或结束时进行通知',
            value: Number(eventsList.includes('1') ? 1 : 0) || 0
          },
          {
            type: 'key_4',
            key_name: '生成回放',
            openShow: '开启后，直播结束并生成回放成功进行通知',
            closeShow: '已开启，直播结束并生成回放成功进行通知',
            value: Number(eventsList.includes('4') ? 1 : 0) || 0
          },
          {
            type: 'key_8',
            key_name: '裁剪回放',
            openShow: '开启后，裁剪视频成功后进行通知',
            closeShow: '已开启，裁剪视频成功后进行通知',
            value: Number(eventsList.includes('8') ? 1 : 0) || 0
          },
          {
            type: 'key_5',
            key_name: '回放分辨率',
            openShow: '开启后，回放转码成功后支持获取不同分辨率',
            closeShow: '已开启，回放转码成功后支持获取不同分辨率',
            value: Number(eventsList.includes('5') ? 1 : 0) || 0
          },
          {
            type: 'key_6',
            key_name: '回放下载',
            openShow: '开启后，回放下载成功进行通知',
            closeShow: '已开启，回放下载成功进行通知',
            value: Number(eventsList.includes('6') ? 1 : 0) || 0
          },
          {
            type: 'key_3',
            key_name: '视频转码',
            openShow: '开启后，JSSDK上传视频并转码成功进行通知',
            closeShow: '已开启，JSSDK上传视频并转码成功进行通知',
            value: Number(eventsList.includes('3') ? 1 : 0) || 0
          },
          {
            type: 'key_7',
            key_name: '文档转码',
            openShow: '开启后，文档上传并转码成功进行通知',
            closeShow: '已开启，文档上传并转码成功进行通知',
            value: Number(eventsList.includes('7') ? 1 : 0) || 0
          }
        ];
        this.keyList = keyList;
      }).catch(e => {
        console.log(e);
        this.form = {
          secret_key: null,
          callback_url: null
        }
      })
    },
    saveCallbackInfo() {
      console.log(this.keyList)
      let numKeys = this.keyList.filter(item => Number(item.value) === 1).map(item => item.type.substring(4));
      this.$refs.form.validate((valid) => {
        if(valid) {
          let callback_event = '';
          let params = {
            secret_key: this.form.secret_key,
            callback_url: this.form.callback_url,
            callback_event: numKeys.join(',')
          }
          this.$fetch(this.isAdd ? 'addCallbackInfo' : 'editCallbackInfo', params).then(res => {
            this.$message({
              message:  `设置成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            // 数据刷新
            this.getCallbackInfo();
          }).catch( res => {
            this.$message({
              message:  res.msg || `设置失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.callback-page {
}
.title-callback {
  .titleBox {
    float: left;
  }
  a {
    float: right;
    font-size: 14px;
    font-weight: 400;
    color: #3562FA;
    line-height: 20px;
  }
}
.layout-callback {
  clear: both;
  .el-form {
    /deep/.el-input {
      width: 640px;
    }
    /deep/.el-form-item {
      margin-bottom: 32px;
      &.callback-btn {
        margin-bottom: 0;
      }
    }
  }
  .layout--right--main();
  .padding48-40();
}

.page-padding {
  padding: 0 0;
}
.h1__title {
  margin-bottom: 32px;
}
.div__func {
  min-height: 190px;
  background: @background_white;
  border-radius: 4px;
  margin: 0 auto 40px auto;
}
.div__view__title {
  margin-left: 24px;
  font-size: @font_size_16;
  font-family: @fontRegular;
  font-weight: 400;
  color: @font_color_h1;
  line-height: 22px;
}
.switch__list {
  li {
    display: block;
    list-style-type: none;
    margin-bottom: 12px;
    line-height: 40px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.leve3_title {
  display: inline-block;
  text-align: right;
  min-width: 91px;
}
</style>
