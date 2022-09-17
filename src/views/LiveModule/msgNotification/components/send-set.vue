<template>
  <vh-dialog :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    v-loading="isLoading"
    width="744px"
    title="发送设置">
      <!-- 发送对象 -->
      <div class="set-item">
        <label class="set-item__label">发送对象</label>
        <div class="set-item__content">
          <!-- 预约发送：预约/报名用户、白名单用户 -->
          <!-- 开播提醒发送设置：预约/报名用户、导入用户、白名单用户 -->
          <!-- 回放通知发送设置：预约/报名用户、预约/报名中未观看直播用户、导入用户、白名单用户 -->
          <vh-checkbox-group v-model="send_user" @change="checkSelect" :min="1">
            <vh-checkbox label="1">预约/报名用户
              <el-tooltip v-tooltipMove>
                <div slot="content">
                  <p>当活动专题下开启统一观看限制时，且已关联的活动下开启了开播提醒，<br/>则将分别对预约/报名用户进行消息触达</p>
                </div>
                <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999;"></i>
              </el-tooltip>
            </vh-checkbox>
            <vh-checkbox label="4" v-if="cardInfo.config_type == 3">预约/报名中未观看直播用户</vh-checkbox>
            <vh-checkbox label="3">导入用户</vh-checkbox>
            <vh-checkbox label="2" v-if="noticeApp && noticeApp.WEBINAR_PES['white_list'] && isSetWhite">白名单用户</vh-checkbox>
          </vh-checkbox-group>
        </div>
      </div>
      <!-- 导入用户模板 -->
      <div class="set-item import_excel_info" v-if="send_user.includes('3')">
        <label class="set-item__label">导入文件</label>
        <div class="set-item__content">
          <import-excel ref="importNoticeExcel" :cardInfo="{
            webinar_id: cardInfo.webinar_id,
            config_type: cardInfo.config_type
          }" :importExcelBase="{
            import_user_url: noticeDetailVo.sms_info.import_user_url,
            import_user_fail_url: noticeDetailVo.sms_info.import_user_fail_url,
            import_result: noticeDetailVo.sms_info.import_result
          }" @uploadKey="uploadKeySet" v-if="cardInfo && noticeDetailVo" :visible="cardInfo && noticeDetailVo"></import-excel>
        </div>
      </div>
      <!-- 短信内容 -->
      <div class="set-item send_info">
        <label class="set-item__label">短信内容</label>
        <div class="set-item__content">
          <div class="set-item__content_center">
            <div class="set-item__content_center__ctx">{{cardQueryVo && cardQueryVo.content_str_max ? cardQueryVo.content_str_max : ''}} <span @click="openShortLink" class="set-item__content_center__link">{{cardQueryVo && cardQueryVo.short_url ? hideString(cardQueryVo.short_url, 28) : ''}}</span></div>
          </div>
          <p class="set-item__content_bottom">
            <span>短信字数：<strong>{{smsCensus.wordage}}</strong>（含退订后缀）</span>
            <span>计费条数 (条)：<strong>{{smsCensus.rowCount}}</strong>（70字符为一条）</span>
            <span>可用余额 (条)：<strong>{{userSmsAmount}}</strong></span>
          </p>
        </div>
      </div>
      <!-- 发送时间 -->
      <div class="set-item send_time">
        <label class="set-item__label">发送时间</label>
        <div class="set-item__content">
          <vh-checkbox-group v-model="send_time" v-if="cardInfo.config_type == 2">
            <vh-checkbox v-for="item in [{
              label: '开播前1天',
              value: '86400'
            },{
              label: '开播前2小时',
              value: '7200'
            },{
              label: '开播前1小时',
              value: '3600'
            },{
              label: '开播前30分钟',
              value: '1800'
            },{
              label: '开播前10分钟',
              value: '600'
            }]"
            :key="item.value"
            :label="item.value"
            border
            round
            size="medium">
             <span>{{item.label}}</span>
             <template v-if="send_time.includes(item.value)">
              <!-- 1=已发送，0=未发送（默认），2=发送中 ，3=已过时-->
              <template v-if="getCheckStatus(item) == 1">
                <span class="send_time_status"><img src="../images/fill-success.svg"/>已发送</span>
              </template>
              <template v-else-if="getCheckStatus(item) == 2">
                <span class="send_time_status"><img src="../images/fill-send.svg"/>发送中</span>
              </template>
              <template v-else-if="getCheckStatus(item) == 3">
                <span class="send_time_status"><img src="../images/fill-warning.svg"/>已过时</span>
              </template>
              <template v-if="getCheckStatus(item) === 0">
                <span class="send_time_status"><img src="../images/fill-wait.svg"/>未发送</span>
              </template>
             </template>
            </vh-checkbox>
          </vh-checkbox-group>
          <span class="set-item__content__default" v-else-if="cardInfo.config_type == 1">预约/报名成功后发送</span>
          <span class="set-item__content__default" v-else-if="cardInfo.config_type == 3">设置默认回放后发送</span>
          <span class="set-item__content__default" v-else>——</span>
          <p v-if="[2,3].includes(cardInfo.config_type)" class="set-item__content__desc">{{cardInfo.config_type == 2 ? `注意：若勾选已错过的时间点将不进行发送，当前开播时间：${noticeDetailVo && noticeDetailVo.webinar_info && noticeDetailVo.webinar_info.start_time ? noticeDetailVo.webinar_info.start_time : '--'}` : '注意：当前活动仅发送一次'}}</p>
        </div>
      </div>
      <div class="set-dialog__footer">
        <p class="set-dialog__footer_left"><span class="set-item__test" @click="openTestDialog">发送测试短信</span></p>
        <vh-button type="primary"  size="medium" round @click="saveInfo" :disabled="btnDisabled || saveLoading">{{ saveLoading ? '执行中' : '确 定' }}</vh-button>
        <vh-button @click="handleClose"  size="medium" round>取 消</vh-button>
      </div>
      <!-- 发送测试短信 -->
      <vh-dialog
        width="380px"
        title="测试发送"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        class="send-test__dialog">
        <vh-form :model="phoneForm" ref="phoneForm" :rules="phoneFormRules" label-width="0">
          <vh-form-item label="" prop="phone">
            <vh-input type="text" maxlength="11" show-word-limit v-model.trim="phoneForm.phone" autocomplete="off" placeholder="请输入手机号" @input="handleInput"></vh-input>
         </vh-form-item>
        </vh-form>
        <div class="dialog-footer">
          <span class="send-test__desc">注意：测试短信也将扣除您的短信余额</span>
          <vh-button type="primary" round size="medium" @click="sendTest">立即发送</vh-button>
        </div>
      </vh-dialog>
      <!-- 余额不足提示 -->
      <vh-dialog width="380px"
        title="提示"
        :visible.sync="noBalanceVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        class="send-no-balance__dialog">
        <div class="tip">当前预计发送 <span class="color-blue">{{preSmsCount > 0 ? preSmsCount : noticeApp.sms_send_num}}</span> 条短信，余额不足，为避免影响您的业务请及时充值。</div>
        <div slot='footer'>
          <el-button type="primary" size="medium" round @click="closeNoBalanceDialog">我知道了</el-button>
        </div>
    </vh-dialog>
  </vh-dialog>
</template>
<script>
  import { validPhone } from '@/utils/validate.js'
  import {sessionOrLocal} from "@/utils/utils";
  import ImportExcel from './import-excel.vue';
  import EventBus from "@/utils/Events";
  export default {
    data() {
      return {
        dialogVisible: false,
        send_user: ['1'], // 发送对象
        send_time: ['600'], // 发送时间
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
        },
        vm: null,
        noBalanceVisible: false,
        preSmsCount: 0, // 预发短信数量【测试发送】
        noticeDetailVo: {}, // 短信模板详情
        cardQueryVo: {}, // 卡片sms_info设置内容
        userSmsAmount: 0, // 用户短信余额
        smsCensus: {
          wordage: 0, // 短信字数
          rowCount: 0 // 短信计费条数
        },
        sms_send_num: 0, // 预发短信数量【消息类型】
        uploadKey: null,
        isUploadChange: false, // 导入文件是否有做出修改
        isSetWhite: '', // 观看限制 - 是否设置为白名单
        isLoading: false,
        btnDisabled: false, // 是否禁用按钮
        saveLoading: false // 是否保存执行中
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      cardInfo: {
        type: Object,
        require: true
      }
    },
    inject: ['app', 'noticeApp'], // 卡片对象
    components: {
      ImportExcel
    },
    methods: {
      // 格式化字符串
      hideString(str, len) {
        return str.length > len ? str.substring(0, len) + '...' : str
      },
      //文案提示问题
      messageInfo(title, type) {
        if (this.vm) {
          this.vm.close();
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box',
        })
      },
      // 输入限制，只能输入0-9数字
      handleInput(value) {
        if (value.length == 0) {
          return;
        }
        const pattern = /^[0-9]*$/ // 正整数的正则表达式
        if (!pattern.test(value)) {
          value = ''
          this.phoneForm.phone = ''
        }
      },
      // 打开短链接
      openShortLink() {
        this.cardQueryVo.short_url && window.open(this.cardQueryVo.short_url, '_blank');
      },
      getCheckStatus(item) {
        if (this.noticeDetailVo && this.noticeDetailVo.sms_info && this.noticeDetailVo.sms_info.send_res) {
          const list = this.noticeDetailVo.sms_info.send_res || []
          let send_status = null
          for (let i = 0; i<list.length; i++) {
            if (list[i].send_time == item.value) {
              send_status = list[i].send_status
              break;
            }
          }
          return send_status
        } else {
          return null
        }
      },
      handleClose() {
        this.dialogVisible = false
        this.$emit('close')
      },
      // 导入文件地址记录
      uploadKeySet(obj = {}) {
        this.uploadKey = obj.key || ''
        this.isUploadChange = obj.isEdit || false
      },
      // 保持验证余额数量
      saveInfo() {
        // 预发短信数量是否大于余额
        if (this.noticeApp.sms_send_num > this.userSmsAmount) {
          this.preSmsCount = 0;
          this.noBalanceVisible = true;
          return;
        } else {
          this.ajaxSetSave()
        }
      },
      // 发送设置 - 接口发送组装
      ajaxSetSave() {
        let params = {
          webinar_id: this.cardInfo.webinar_id,
          config_type: this.cardInfo.config_type,
          send_user: this.send_user.join(','),
          notice_switch: 1
        }
        if (this.send_user.includes('1')) {
          if (this.cardInfo.config_type == 2 && this.send_time && this.send_time <= 0) {
            this.messageInfo('请选择发送时间', 'warning')
            return
          }
          // 预约报名不能为空
          params.send_time = this.send_time.join(',');
        } else {
          params.send_time = '';
        }
        if (this.send_user.includes('3')) {
          console.log('当前数据状态', this.uploadKey, this.isUploadChange)
          // 选择了发送对象 - 导入用户，但从来没上传过，提示 [uploadKey为空，isUploadChange为false，noticeDetailVo.sms_info.import_user_url 为空]
          // 选择了发送对象 - 导入用户，上传过，但是没有编辑 [uploadKey为空，isUploadChange 为false，noticeDetailVo.sms_info.import_user_url 不为空]，不提示，不传递key
          // 选择了发送对象 - 导入用户，上传过，有编辑 [uploadKey不为空，isUploadChange 为true，noticeDetailVo.sms_info.import_user_url 之前不为空]，不提示，传递key
          // 不选择发送对象 - 无导入用户key入参
          if (this.noticeDetailVo.sms_info.import_user_url == '') {
            if (!this.uploadKey && !this.isUploadChange) {
              // 未上传过
              this.messageInfo('请导入文件', 'warning')
              return
            } else {
              // uploadKey有值表示有上传
              params.key = this.uploadKey
            }
          } else {
            if (!this.uploadKey && !this.isUploadChange) {
              // 之前有反显，当前无编辑 —— 无任何操作
            } else {
              if (this.uploadKey && this.isUploadChange) {
                // 有反显，当前有编辑，更新文件
                params.key = this.uploadKey
              } else if (!this.uploadKey && this.isUploadChange) {
                // 有反显，当前有编辑，但是没有上传key，表示只是删除
                this.messageInfo('请导入文件', 'warning')
                setTimeout(() => {
                  this.$refs.importNoticeExcel && this.$refs.importNoticeExcel.resetSelectFile();
                }, 2000)
                return
              } else {
                // 有反显，当前无key，未作出任何修改 —— 无任何操作
              }
            }
          }
        }
        this.saveLoading = true;
        this.$fetch('saveSendSet', this.$params(params)).then((res) => {
          this.saveLoading = false;
          if (res.code == 200) {
            this.messageInfo('设置成功', 'success')
            this.handleClose()
            this.$emit('saveChange')
          } else {
            this.messageInfo(res.msg || '获取信息失败', 'error')
          }
        })
        .catch((res) => {
          this.saveLoading = false;
          this.messageInfo(res.msg || '获取信息失败', 'error')
          console.log(res)
        })
      },
      // 余额不足提示
      closeNoBalanceDialog() {
        this.noBalanceVisible = false;
        if (this.preSmsCount > 0) {
          // 测试发送触发
        } else {
          // 发送设置触发
          this.ajaxSetSave()
        }
      },
      // 打开测试发送弹出框
      openTestDialog() {
        this.innerVisible = true
      },
      // 测试发送
      sendTest() {
        this.$refs.phoneForm.validate((valid) => {
          if (valid) {
            if (this.userSmsAmount <= 0 || this.smsCensus.rowCount > this.userSmsAmount) {
              // 短信余额本身不足  或者 预计发送的计费条数>短信余额， 当前不可发送
              this.preSmsCount = this.smsCensus.rowCount;
              this.noBalanceVisible = true;
              return;
            }
            this.$fetch('noticeTestSend', this.$params({
              webinar_id: this.cardVo.webinar_id,
              phone: this.phoneForm.phone,
              config_type: this.cardVo.config_type
            })).then(res => {
              if (res && res.code == 200) {
                this.messageInfo('已发送，请观察短信是否能正常收到', 'success')
                this.innerVisible = false;
                // 刷新余额
                this.getSmsBalance();
                this.$emit('saveChange')
              } else {
                this.messageInfo(res.msg || '发送失败', 'error')
              }
            }).catch(res => {
              this.messageInfo(res.msg || '发送失败', 'error')
            });
          }
        })
      },
      checkSelect(oldVal) {
        console.log('数据', oldVal)
      },
      // 获取消息模板详情
      getNoticeDetail() {
        this.$fetch('getNoticeDetail', this.$params({
          webinar_id: this.cardInfo.webinar_id,
          config_type: this.cardInfo.config_type
        })).then((res) => {
          this.isLoading = false
          if (res.code == 200 && res.data) {
            if (res.data.sms_info && res.data.sms_info.content_template) {
              // 每个开播类型，最多支持展示的文字长度
              let maxLen = [0, 48, 57, 72][this.cardInfo.config_type]
              res.data.sms_info.content_str_max = this.formatContentStr(res.data, maxLen)
            }
            this.noticeDetailVo = res.data
            this.cardQueryVo = res.data.sms_info
            // 计算短信长度
            /* const smsStr = res.data.sms_info.content_str + res.data.sms_info.short_url
            this.smsCensus.wordage = smsStr.length
            this.smsCensus.rowCount = smsStr.length > 70 ? Math.ceil(smsStr.length / 67) : 1 */
            this.smsCensus.wordage = res.data.config_info?.length || 0
            this.smsCensus.rowCount = res.data.config_info?.multiple || 0
            // 转换发送对象
            this.send_user = res.data.sms_info.send_user.split(',')
            // 转换发送时间
            this.send_time = res.data.sms_info.send_time.split(',')
          } else {
            this.noticeDetailVo = {}
            this.cardQueryVo = {}
          }
        })
        .catch((res) => {
          this.isLoading = false
          this.messageInfo(res.msg || '获取发送设置信息失败', 'error')
          console.log(res)
          this.noticeDetailVo = {}
          this.cardQueryVo = {}
        })
      },
      // 格式化短信部分内容呈现
      formatContentStr(resVo, len = 96) {
        console.log('当前resVo', resVo)
        if (!resVo.sms_info.content_template) {
          return ''
        }
        const smsSign = resVo?.config_info?.sms_sign || '微吼直播'
        const subject = resVo?.webinar_info?.subject || ''
        // 举例 —— 最小展示规则：中文加签名长度16个字长度，若超出，活动名称长度=14-签名长度，拼接上...
        let subjectByType = (subject.length + smsSign.length) > len ? subject.substring(0, (len-2) - smsSign.length) + '...' : subject
        // 格式化列表展示文案
        return resVo.sms_info.content_template.replace('${sms_sign}', smsSign).replace('${subject}', subjectByType).replace(new RegExp(resVo.sms_info.short_url, 'g'), '')
      },
      // 获取短信套餐余额
      getSmsBalance() {
       return this.$fetch('getSmsBalance', {})
      .then((res) => {
          if (res.code == 200 && res.data) {
            this.userSmsAmount = res.data.sms || 0;
          } else {
            this.userSmsAmount = 0
          }
        })
        .catch((res) => {
          console.log('获取短信余额异常', res)
          this.userSmsAmount = 0
        })
      },
      // 获取观看限制是否是白名单
      getWebianrVerify() {
       return this.$fetch('viewerSetGet', {
         webinar_id: this.cardInfo.webinar_id
       })
      .then((res) => {
          if (res.code == 200 && res.data) {
            this.isSetWhite = res.data.verify || (res.data.parent_verify == 2 && res.data.subject_verify == 1);
          } else {
            this.isSetWhite = '';
          }
        })
        .catch((res) => {
          console.log('获取观看限制是否开启白名单异常', res)
          this.isSetWhite = ''
        })
      }
    },
    async created() {
      this.dialogVisible =  this.visible;
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.cardVo = this.app.info; // TODO inject传入的内容，在小组件内，只做赋值，不动cardVo数据
      // this.isOpenWhite = noticeApp && noticeApp.WEBINAR_PES['white_list'] && isSetWhite;
      this.isLoading = true;
      await this.getSmsBalance();
      await this.getWebianrVerify();
      this.getNoticeDetail();
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
    margin-right: 12px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    text-align: justify;
    color: rgba(0, 0, 0, 0.65);
  }
  &__content {
    width: calc(100% - 68px);
    &_center {
      clear: both;
      padding: 8px 12px;
      width: 612px;
      height: 60px;
      background: rgba(217, 217, 217, 0.85);
      border-radius: 4px;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      text-align: justify;
      color: rgba(0, 0, 0, 0.85);
      &.css_flex {
        display: inline-flex;
        flex-direction: column;
        justify-content: space-between;
      }
      &__ctx {
        word-break: break-all;
        max-height: 40px;
        overflow-y: auto;
      }
      &__link {
        color: #1E4EDC;
        cursor: pointer;
        max-height: 48px;
        overflow-y: auto;
        &:hover {
          color: #1E4EDC;
        }
      }
    }
    &_bottom {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 8px;
      span {
        margin-right: 8px;
      }
      strong {
        color:#1E4EDC;
      }
    }
    &__desc {
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-align: justify;
      color: rgba(0, 0, 0, 0.45);
    }
    &__default {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      text-align: justify;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 4px;
    }
  }
  &:last-child {
    /* 最后一条记录，保留间距 */
    padding-bottom: 40px;
  }
}
/deep/.send_time {
  .vh-checkbox-group {
    width: 612px;
  }
  .vh-checkbox {
    width: 196px ;
    margin-bottom: 12px;
    margin-left: 0!important;
    margin-right: 12px!important;
    position: relative;
  }
  .vh-checkbox:nth-child(3n+3) {
    margin-right: 0!important;
  }
  .vh-checkbox:nth-child(4) {
    margin-bottom: 8px!important;
  }
  .vh-checkbox:nth-child(5) {
    margin-bottom: 8px!important;
  }
  .vh-checkbox:nth-child(6) {
    margin-bottom: 8px!important;
  }
  .send_time_status {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.45);
    position: absolute;
    right: 12px;
    img {
      width: 12px;
      height: 12px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      margin-top: -2px;
    }
  }
}
.set-dialog__footer {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .set-dialog__footer_left {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #1E4EDC;
    margin-right: auto;
    .set-item__test {
      cursor: pointer;
    }
  }
}
/* 测试发送弹出框 */
.send-test__dialog {
  /deep/.dialog-footer {
    text-align: right;
  }
  .send-test__desc {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    text-align: justify;
    color: rgba(0, 0, 0, 0.45);
    float: left;
    line-height: 36px;
  }
}
/* 余额不足弹出框 */
.send-no-balance__dialog {
  .tip {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: justify;
    color: rgba(0, 0, 0, 0.65);
  }
  .color-blue {
    color: #1E4EDC;
  }
}
</style>
