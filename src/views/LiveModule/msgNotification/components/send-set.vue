<template>
  <vh-dialog :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    width="744px"
    title="发送设置"
    class="send-set-dialog">
      <div v-loading="isLoading">
        <!-- 发送对象 -->
        <div class="set-item">
          <label class="set-item__label">发送对象</label>
          <div class="set-item__content">
            <!-- 预约发送：预约/报名用户、白名单用户 -->
            <!-- 开播提醒发送设置：预约/报名用户、导入用户、白名单用户 -->
            <!-- 回放通知发送设置：预约/报名用户、预约/报名中未观看直播用户、导入用户、白名单用户 -->
            <vh-checkbox-group v-model="send_user" @change="checkSelect" :disabled="senderUserShowLength == 1">
              <template v-for="(item, index) in senderUserOptions">
                <vh-checkbox :label="item.label" :key="`send_${index}`" v-if="item.isShow">{{item.text}}
                  <vh-tooltip v-tooltipMove v-if="item.label == 1" :visible-arrow="false" placement="right-start">
                    <div slot="content" v-if="cardInfo.config_type == 1">
                      <p>当专题下开启统一观看限制或统一报名时，<br/>则不触发预约报名成功的通知消息</p>
                    </div>
                    <div slot="content" v-else>
                      <p>1. 无统一观看限制时，各活动下的短信通知正常发送；</p>
                      <p>2. 当开启专题统一观看限制、统一报名表单时（免费条件及密码条件无<br/>预约提交手机号功能因此无法触发短信）：如果专题下的多个活动开启了<br/>短信通知，则将对该活动下设置的短信发送对象+通过专题观看权限的用<br/>户发送开播提醒或回放提醒。</p>
                    </div>
                    <i class="iconfont-v3 saasicon_help_m tip"></i>
                  </vh-tooltip>
                </vh-checkbox>
              </template>
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
            }" :isOneChange="isOneChange" @uploadKey="uploadKeySet" v-if="cardInfo && noticeDetailVo" :visible="cardInfo && noticeDetailVo" @setBtnDisabled="setBtnDisabled"></import-excel>
          </div>
        </div>
        <!-- 短信内容 -->
        <div class="set-item send_info">
          <label class="set-item__label">短信内容</label>
          <div class="set-item__content">
            <div class="set-item__content_center">
              <div class="set-item__content_center__ctx">{{cardQueryVo && cardQueryVo.content_str_max ? cardQueryVo.content_str_max : ''}} <span @click="openShortLink" class="set-item__content_center__link">{{cardQueryVo && cardQueryVo.short_url ? hideString(cardQueryVo.short_url, 20) : ''}}</span></div>
            </div>
            <p class="set-item__content_bottom">
              <span>短信字数：<strong>{{smsCensus.wordage}}</strong>（含退订后缀）</span>
              <span>单条计费 (条)：<strong>{{smsCensus.rowCount}}</strong>（70字符为一条）</span>
              <span>可用余额 (条)：<strong>{{userSmsAmount}}</strong></span>
            </p>
          </div>
        </div>
        <!-- 发送时间 -->
        <div class="set-item send_time">
          <label class="set-item__label">发送时间</label>
          <div class="set-item__content">
            <vh-checkbox-group v-model="send_time" v-if="cardInfo.config_type == 2" size="small">
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
              :class="send_time.includes(item.value) && getCheckStatus(item) == 3 ? 'old-timer' : (send_time.includes(item.value) && getCheckStatus(item) != 3 ? 'yes-timer' : '')">
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
          <vh-button type="primary"  size="medium" round borderRadius="50" @click="saveInfo" :disabled="send_user.includes('3') && btnDisabled" v-preventReClick>确定</vh-button>
          <vh-button type="info" ghost @click="handleClose" size="medium" borderRadius="50">取消</vh-button>
        </div>
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
          <vh-button type="primary" round size="medium" borderRadius="50" v-preventReClick @click="sendTest" :disabled="!phoneForm.phone || (phoneForm.phone && phoneForm.phone.length != 11)">立即发送</vh-button>
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
        <div class="tip">余额不足，请联系您的专属客服充值</div>
        <div slot='footer'>
          <vh-button type="primary" size="medium" round borderRadius="50" v-preventReClick @click="closeNoBalanceDialog">我知道了</vh-button>
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
        noticeDetailVo: {}, // 短信模板详情
        cardQueryVo: {}, // 卡片sms_info设置内容
        userSmsAmount: 0, // 用户短信余额
        smsCensus: {
          wordage: 0, // 短信字数
          rowCount: 0 // 短信单条计费
        },
        sms_send_num: 0, // 预发短信数量【消息类型】
        uploadKey: null,
        isUploadChange: false, // 导入文件是否有做出修改
        isSetWhite: '', // 观看限制 - 是否设置为白名单
        isLoading: false,
        btnDisabled: false, // 是否禁用按钮
        saveLoading: false, // 是否保存执行中
        saveSetParams: null,
        isOneChange: null
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
    computed: {
      senderUserOptions: function () {
        return [
          {
            label: '1',
            text: '预约/报名用户',
            isShow: true
          },
          {
            label: '4',
            text: '预约/报名中未观看直播用户',
            isShow: this.cardInfo.config_type == 3
          },
          {
            label: '3',
            text: '导入用户',
            isShow: this.cardInfo.config_type != 1
          },
          {
            label: '2',
            text: '白名单用户',
            isShow: this.cardInfo.config_type != 1 && this.noticeApp && this.noticeApp.WEBINAR_PES['white_list'] && this.isSetWhite
          }
        ]
      },
      senderUserShowLength: function() {
        const list = this.senderUserOptions || []
        return list.filter(item => item.isShow == true).length
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
      // 设置按钮是否禁用
      setBtnDisabled(status) {
        console.log('当前按钮是否禁用btnDisabled', status)
        this.btnDisabled = status
      },
      // 打开短链接
      openShortLink() {
        const short_url = this.cardQueryVo.short_url
        const isJoinStr = short_url.indexOf('https://') != -1 || short_url.indexOf('http://') != -1 || short_url.indexOf('//') != -1
        this.cardQueryVo.short_url && window.open(`${isJoinStr ? '' : '//'}${this.cardQueryVo.short_url}`, '_blank');
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
        this.isOneChange = obj.isOneChange || false
      },
      // 保持验证余额数量
      async saveInfo() {
        this.validRefer = 'save';
        let params = {
          webinar_id: this.cardInfo.webinar_id,
          config_type: this.cardInfo.config_type,
          send_user: this.send_user.join(','),
          notice_switch: Number(this.cardInfo.notice_switch) // 开关影响收发短信消息
        }
        if (this.send_user && this.send_user.length == 0) {
          this.messageInfo('请选择发送对象', 'warning')
          return
        }
        if (this.cardInfo.config_type == 2) {
          if (this.send_time && this.send_time.length <= 0) {
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
        this.saveSetParams = params;
        await this.getSmsBalance(); // 获取最新的短信余额数量
        if (this.userSmsAmount <= 0) {
          // 余额不足提醒
          this.noBalanceVisible = true;
          return;
        }
        this.ajaxSetSave()
      },
      // 发送设置 - 接口发送组装
      async ajaxSetSave() {
        if (!this.saveSetParams) {
          console.log('参数处理错误，无法触发逻辑')
          return
        }
        this.saveLoading = true;
        this.$fetch('saveSendSet', this.$params(this.saveSetParams)).then((res) => {
          this.saveLoading = false;
          if (res.code == 200) {
            this.messageInfo('设置成功', 'success')
            this.handleClose()
            this.$emit('saveChange')
          } else {
            this.messageInfo(res.msg || '接口调用失败', 'error')
          }
        })
        .catch((res) => {
          this.saveLoading = false;
          this.messageInfo(res.msg || '接口调用失败', 'error')
          console.log(res)
        })
      },
      // 余额不足提示
      closeNoBalanceDialog() {
        this.noBalanceVisible = false;
        if (this.validRefer == 'save') {
          this.ajaxSetSave()
        } else {
          this.ajaxSendTest()
        }
      },
      // 打开测试发送弹出框
      openTestDialog() {
        this.innerVisible = true
      },
      // 测试发送
      sendTest() {
        this.validRefer = 'test';
        this.$refs.phoneForm.validate(async (valid) => {
          if (valid) {
            await this.getSmsBalance(); // 获取最新的短信余额数量
            if (this.userSmsAmount <= 0) {
              // 余额不足提醒
              this.noBalanceVisible = true;
              return;
            }
            this.ajaxSendTest();
          }
        })
      },
      ajaxSendTest() {
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
            this.messageInfo(res.msg || '接口调用失败', 'error')
          }
        }).catch(res => {
          this.messageInfo(res.msg || '接口调用失败', 'error')
        });
      },
      checkSelect(oldVal) {
        console.log('数据', oldVal)
        this.isOneChange = false;
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
              let maxLen = [0, 36, 44, 56][this.cardInfo.config_type]
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
            this.isOneChange = this.send_user.includes('3') ? true : false;
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
      formatContentStr(resVo, len) {
        console.log('当前resVo', resVo , len)
        if (!resVo.sms_info.content_template) {
          return ''
        }
        const smsSign = resVo?.config_info?.sms_sign || '微吼直播'
        const subject = resVo?.webinar_info?.subject || ''
        // 举例 —— 最小展示规则：中文加签名长度16个字长度，若超出，活动名称长度=14-签名长度，拼接上...
        let subjectByType = (subject.length + smsSign.length) > len ? subject.substring(0, (len-2) - smsSign.length) + '...' : subject
        let text = resVo.sms_info.content_template.replace('${sms_sign}', smsSign).replace('${subject}', subjectByType).replace(new RegExp(resVo.sms_info.short_url, 'g'), '')
        // 格式化列表展示文案
        console.log('当前数据', text)
        return text;
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
          this.$emit('reloadBalance')
        })
        .catch((res) => {
          console.log('获取短信余额异常', res)
          this.userSmsAmount = 0
          this.$emit('reloadBalance')
        })
      },
      // 获取观看限制是否是白名单
      getWebinarVerify() {
       return this.$fetch('viewerSetGet', {
         webinar_id: this.cardInfo.webinar_id
       })
      .then((res) => {
          if (res.code == 200 && res.data) {
            this.isSetWhite = res.data.verify == 2 || (res.data.parent_verify == 2 && res.data.subject_verify == 1);
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
      await this.getWebinarVerify();
      // 设置当前是否是初次修改(每次修改时，此时的值都会发生变化)
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
  /deep/.saasicon_help_m {
    color: #999999;
    &:hover {
      color: #666666;
    }
  }
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
.vh-input /deep/.vh-input__count {
  font-size: 14px;
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
  .vh-checkbox.is-bordered.vh-checkbox--small {
    padding: 5px 12px;
    line-height: 20px;
    border-radius: 4px;
    .vh-checkbox__inner::after {
      left: 4px;
      top: 1px;
    }
    &:hover {
      border: 1px solid #FFAAA1;
      .vh-checkbox__inner {
        border-color: #fb2626;
      }
    }
    &:active {
      background: #FFF2F0;
      border: 1px solid #FFAAA1;
      color: #262626;
    }
    &.is-checked {
      background: #FFF2F0;
      border: 1px solid #FFAAA1;
      color: #262626;
      &.yes-timer {
        border: 1px solid #D9D9D9;
        background: unset;
      }
    }
    &.old-timer {
      background: #F5F5F5;
      border: 1px solid #D9D9D9;
      border-radius: 4px;
      color: rgba(0, 0, 0, 0.25);
      .vh-checkbox__input.is-checked .vh-checkbox__inner, .vh-checkbox__input.is-indeterminate .vh-checkbox__inner {
        background-color: #BFBFBF;
        border-color: #BFBFBF;
      }
    }
  }
  .send_time_status {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.45);
    position: absolute;
    right: 12px;
    top: 5px;
    img {
      width: 14px;
      height: 14px;
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
.send-set-dialog {
  /deep/.el-loading-mask {
    background-color: rgba(255,255,255,.65);
  }
  /deep/.vh-button+.vh-button {
    margin-left: 12px;
  }
}
</style>
