<template>
  <el-dialog :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    width="800px"
    title="发送设置">
      <!-- 发送对象 -->
      <div class="set-item">
        <label class="set-item__label">发送对象：</label>
        <div class="set-item__content">
          <!-- 预约发送：预约/报名用户、白名单用户 -->
          <!-- 开播提醒发送设置：预约/报名用户、导入用户、白名单用户 -->
          <!-- 回放通知发送设置：预约/报名用户、预约/报名中未观看直播用户、导入用户、白名单用户 -->
          <el-checkbox-group v-model="sender_person">
            <el-checkbox label="1">预约/报名用户
              <el-tooltip v-tooltipMove>
                <div slot="content">
                  <p>当活动专题下开启统一观看限制时，且已关联的活动下开启了消息通知，则将分别对预约/报名用户进行消息触达</p>
                </div>
                <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999;"></i>
              </el-tooltip>
            </el-checkbox>
            <el-checkbox label="2" v-if="cardVo.iconType === 'base_playback'">预约/报名中未观看直播用户</el-checkbox>
            <el-checkbox label="3">导入用户</el-checkbox>
            <el-checkbox label="4" v-if="isOpenWhite">白名单用户</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 导入用户模板 -->
      <div class="set-item import_excel_info" v-if="sender_person.includes('3')">
        <label class="set-item__label"></label>
        <import-excel></import-excel>
      </div>
      <!-- 短信内容 -->
      <div class="set-item send_info">
        <label class="set-item__label">短信内容：</label>
        <div class="set-item__content">
          <p class="set-item__content_top"><span class="set-item__test" @click="openTestDialog">发送测试短信</span></p>
          <div class="set-item__content_center">
            {{cardVo && cardVo.content ? cardVo.content+cardVo.link : ''}}
          </div>
          <p class="set-item__content_bottom">
            <span>短信字数：<strong>75</strong>条（含退订后缀）</span>
            <span>计费条数：<strong>2</strong>条（70字符为一条）</span>
            <span>可用余额：<strong>500</strong>条</span>
          </p>
        </div>
      </div>
      <!-- 发送时间 -->
      <div class="set-item send_time">
        <label class="set-item__label">发送时间：</label>
        <div class="set-item__content">
          <el-checkbox-group v-model="send_timer" v-if="cardVo.iconType === 'base_start'">
            <el-checkbox label="4320">开播前3天</el-checkbox>
            <el-checkbox label="1440">开播前1天</el-checkbox>
            <el-checkbox label="120">开播前2小时</el-checkbox>
            <el-checkbox label="60">开播前1小时</el-checkbox>
            <el-checkbox label="30">开播前30分钟</el-checkbox>
            <el-checkbox label="15">开播前15分钟</el-checkbox>
          </el-checkbox-group>
          <span v-else-if="cardVo.iconType === 'base_subscribe'">预约/报名成功后发送</span>
          <span v-else-if="cardVo.iconType === 'base_playback'">设置默认回放后发送</span>
          <span v-else>——</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  size="medium" round @click="saveInfo">确 定</el-button>
        <el-button @click="handleClose"  size="medium" round>取 消</el-button>
      </div>
      <el-dialog
        width="400px"
        title="测试发送   "
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <el-form :model="phoneForm" ref="phoneForm" :rules="phoneFormRules" label-width="0">
          <el-form-item label="" prop="phone">
            <VhallInput v-model.trim="phoneForm.phone"  @input="handleInput(scope.row)" autocomplete="off" placeholder="请输入手机号" :maxlength="11" show-word-limit></VhallInput>
          </el-form-item>
          <p>注意：测试短信也将扣除您的短信余额</p>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary"  size="medium" round @click="sendTest">立即发送</el-button>
        </div>
      </el-dialog>
  </el-dialog>
</template>
<script>
  import { validPhone } from '@/utils/validate.js'
  import ImportExcel from './import-excel.vue'
  export default {
    data() {
      return {
        dialogVisible: true,
        sender_person: ['1'], // 发送对象
        send_timer: ['15'], // 发送时间
        innerVisible: false,
        phoneForm: {
          phone: ''
        },
        phoneFormRules: {
          phone: {
            required: true,
            validator: validPhone,
            trigger: 'blur'
          }
        }
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    inject: ['app'], // 卡片对象
    components: {
      ImportExcel
    },
    computed: {
      // 是否展示白名单
      isOpenWhite: ()=> {
        return false
      }
    },
    methods: {
      // 输入限制，只能输入0-9数字
      handleInput(value) {
        if (value.phone.length == 0) {
          return;
        }
        const pattern = /^[0-9]*$/ // 正整数的正则表达式
        if (!pattern.test(value.phone)) {
          value.phone = ''
        }
      },
      handleClose() {
        this.dialogVisible = true
        this.$emit('close')
      },
      // 保存数据
      saveInfo() {},
      // 打开测试发送弹出框
      openTestDialog() {
        this.innerVisible = true
      },
      // 测试发送
      sendTest() {
        this.$refs.phoneForm.validate((valid) => {
          if (valid) {
            this.$fetch('', this.$params(this.phoneForm)).then(res => {
              if (res && res.code == 200) {
                this.$message.success('已发送，请观察短信是否能正常收到')
              } else {
                this.$message.error(res.msg || '发送失败')
              }
            }).catch(res => {
              this.$message.error(res.msg || '发送失败')
            });
          }
        })
      }
    },
    created() {
      this.dialogVisible =  this.visible;
      this.cardVo = this.app.info; // TODO inject传入的内容，在小组件内，只做赋值，不动cardVo数据
    }
  };
</script>
<style lang="less" scoped>
.set-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 16px;
  &__label {
    margin-right: 10px;
    width: 100px;
  }
  &__content {
    width: calc(100% - 100px);
    &_top {
      text-align: right;
      color:#3562FA;
      .set-item__test {
        cursor: pointer;
      }
    }
    &_center {
      clear: both;
      background: #eaeaea;
      padding: 10px 10px;
      margin: 12px auto;
      line-height: 22px;
    }
    &_bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      strong {
        color:#3562FA;
      }
    }
  }
  &.send_time {
    /deep/.el-checkbox {
      display: block;
      margin-bottom: 8px;
    }
  }
  &:last-child {
    /* 最后一条记录，保留间距 */
    padding-bottom: 40px;
  }
}
</style>
