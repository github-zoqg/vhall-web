<template>
  <div class="embed-card">
    <pageTitle pageTitle="推广嵌入"></pageTitle>
    <div class="weixinWork">
      <h3>微信嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>我的主页</span>
          <el-input v-model="myMain" readonly style="max-width: 640px">
            <template slot="suffix">
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
                placement="top"
                v-tooltipMove
              >
                <i
                  class="iconfont-v3 saasicon_copy"
                  :title="'复制'"
                  @click="cope(myMain, 1)"
                ></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <div class="input-item">
          <span>观看直播</span>
          <!-- <el-tooltip class="item" effect="dark" content="复制" placement="top">
            <i class="el-input__icon el-icon-document-copy" @click="cope(liveContent)"></i>
          </el-tooltip> -->
          <el-input v-model="liveContent" readonly style="max-width: 640px">
            <template slot="suffix">
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
                placement="top"
                v-tooltipMove
              >
                <i
                  class="iconfont-v3 saasicon_copy"
                  :title="'复制'"
                  @click="cope(liveContent, 2)"
                ></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <p>
          提示：在微信公众号管理平台，自定义菜单添加链接，用户点击菜单可快速观看直播，详细信息参见<a
            @click="goForm('https://saas-doc.vhall.com/docs/show/1243', 1)"
          >
            微信嵌入</a
          >
        </p>
      </div>
    </div>
    <div class="network">
      <h3>网页嵌入</h3>
      <div class="input-card">
        <div class="input-item">
          <span>完全嵌入</span>
          <el-input v-model="completion" readonly style="max-width: 640px">
            <template slot="suffix">
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
                placement="top"
                v-tooltipMove
              >
                <i
                  class="iconfont-v3 saasicon_copy"
                  :title="'复制'"
                  @click="cope(completion, 3)"
                ></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <div
          class="input-item"
          v-if="isInteract != 3 && $route.query.type != 6"
        >
          <span>视频嵌入</span>
          <el-input v-model="video" readonly style="max-width: 640px">
            <template slot="suffix">
              <el-tooltip
                class="item"
                effect="dark"
                content="复制"
                placement="top"
                v-tooltipMove
              >
                <i
                  class="iconfont-v3 saasicon_copy"
                  :title="'复制'"
                  @click="cope(video, 4)"
                ></i>
              </el-tooltip>
            </template>
          </el-input>
        </div>
        <p v-if="$route.query.type != 6">
          提示：<span v-if="isInteract == 3"
            >互动连麦功能必须要求浏览器地址为https协议进入！</span
          ><span v-if="isInteract != 3">1.视频嵌入不支持无延迟直播；2.</span
          >当前只支持默认活动和密码活动的嵌入，更多嵌入信息参见<a
            @click="goForm('https://saas-doc.vhall.com/docs/show/1238', 2)"
          >
            网页嵌入指南</a
          >
        </p>
        <p v-else>
          提示：<span>互动连麦功能必须要求浏览器地址为https协议进入！</span>当前只支持密码活动的嵌入，更多嵌入信息参见<a
            @click="goForm('https://saas-doc.vhall.com/docs/show/1238', 2)"
          >
            网页嵌入指南</a
          >
        </p>
      </div>
    </div>
    <div class="thirdMethod" v-if="$route.query.type != 6">
      <div class="title_text">
        <h3>第三方渠道推广嵌入</h3>
        <el-switch
          v-if="btn_thirdway_push && total"
          v-model="streamOpen"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          @change="closeStreamOpen"
          :active-text="reservationDesc"
        >
        </el-switch>
      </div>
      <template v-if="btn_thirdway_push">
        <div class="head-operat" v-show="total">
          <el-button
            type="primary"
            size="medium"
            round
            @click="addStream"
            v-preventReClick
            >创建推流地址</el-button
          >
          <span class="refresh" @click="refreshStream">刷新推流状态</span>
        </div>
        <div class="stream-list" v-show="total">
          <table-list
            ref="tableStreamList"
            :manageTableData="tableData"
            :tabelColumnLabel="tabelColumn"
            :tableRowBtnFun="tableRowBtnFun"
            :width="150"
            max-height="500"
            :isCheckout="false"
            :needPagination="false"
            :totalNum="total"
            @onHandleBtnClick="onHandleBtnClick"
            @getTableList="getTableList"
            @switchChange="onSwitchChange"
          >
          </table-list>
          <noData :nullType="'search'" v-if="!total"></noData>
        </div>
        <div class="empty" v-show="!total">
          <noData
            :height="63"
            :nullType="'nullData'"
            :text="'您还没有创建推流地址，快来创建吧！'"
          >
            <el-button
              type="primary"
              round
              class="length152"
              @click="addStream"
              v-preventReClick
              >创建推流地址</el-button
            >
          </noData>
        </div>
      </template>
      <template v-else>
        <div class="third-list"></div>
        <p class="third-text">
          提示：目前微吼已支持在各大平台进行同步直播<a @click="goEmbedForm">
            填写推广需求表</a
          >
        </p>
      </template>
      <div class="give-white" v-show="!streamOpen && total"></div>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
    <el-dialog
      :title="editParams.push_id ? '编辑' : '创建'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="create-stream"
      width="468px"
    >
      <el-form
        label-width="80px"
        :model="editParams"
        ref="editParamsForm"
        :rules="rules"
      >
        <el-form-item label="平台名称" prop="pf_name">
          <VhallInput
            v-model="editParams.pf_name"
            v-clearEmoij
            show-word-limit
            :maxlength="10"
            autocomplete="off"
            placeholder="请输入平台名称"
          ></VhallInput>
        </el-form-item>
        <el-form-item label="推流地址" prop="dest_url">
          <VhallInput
            v-model="editParams.dest_url"
            autocomplete="off"
            placeholder="请输入推流地址"
          >
          </VhallInput>
        </el-form-item>
        <el-form-item label="推流类型" prop="oversea">
          <el-radio-group v-model="editParams.oversea">
            <el-radio :label="0">国内推流</el-radio>
            <el-radio :label="1">海外推流</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="!editParams.dest_url"
          type="primary"
          size="medium"
          @click="handleUpdateStream"
          round
          >保存</el-button
        >
        <el-button size="medium" @click="handleCancelEdit" round
          >取消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import { sessionOrLocal } from '@/utils/utils'
import noData from '@/views/PlatformModule/Error/nullPage'
import beginPlay from '@/components/beginBtn'
import Env from '@/api/env'

const PushStatus = ['未推流', '推流中', '推流失败']

export default {
  name: 'embedCard',
  data() {
    //流地址校验
    const urlValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入推流地址'))
      } else {
        const reg = /^(rtmp:\/\/)|(rtmps:\/\/)/g
        if (reg.test(value)) {
          callback()
        } else {
          callback && callback('请输入正确的推流地址')
        }
      }
    }
    return {
      env: Env,
      isInteract: '',
      userId: '',
      webinarState: JSON.parse(sessionOrLocal.get('webinarState')),
      myMain: `${
        window.location.origin + (process.env.VUE_APP_WEB_KEY || '')
      }/user/home/${sessionOrLocal.get('userId')}`,
      liveContent: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      completion: `<iframe allow="camera *;microphone *; display-capture" allowfullscreen="true" border="0" src="${process.env.VUE_APP_WAP_WATCH}/lives/embedclient/watch/${this.$route.params.str}" width="800" height="600"></iframe>`,
      video: `<iframe border="0" allow="display-capture" allowfullscreen="true" src="${process.env.VUE_APP_WAP_WATCH}/lives/embedclient/watch/${this.$route.params.str}?embed=video" width="800" height="600"></iframe>`,
      total: 1,
      tableData: [],
      tabelColumn: [
        {
          label: '平台名称',
          key: 'pf_name',
          width: 200,
        },
        {
          label: '推流地址',
          key: 'dest_url',
        },
        {
          label: '推流类型',
          key: 'overseaTxt',
          width: 120,
        },
        {
          label: '推流状态',
          key: 'pushStatusTxt',
          width: 120,
        },
        {
          label: '是否推流',
          key: 'watch',
          width: 120,
        },
      ],
      tableRowBtnFun: [
        { name: '编辑', methodName: 'edit' },
        { name: '删除', methodName: 'del' },
      ],
      editParams: {
        push_id: '', //推流id
        pf_name: '', //pf_name
        dest_url: '', //第三方推流地址
        oversea: 0, //推流类型：1-海外，0-国内（默认）
      },
      dialogVisible: false, // 新建流
      rules: {
        dest_url: [{ required: true, validator: urlValidate, trigger: 'blur' }],
      },
      streamOpen: false, //默认关闭，启动第三方推流
    }
  },
  components: {
    PageTitle,
    noData,
    beginPlay,
  },
  computed: {
    reservationDesc() {
      if (this.streamOpen) {
        return '已开启，即将直播数据推送到第三方平台'
      } else {
        return '开启后，即将直播数据推送到第三方平台'
      }
    },
    // admin有无权限logo替换 嵌入推广
    btn_thirdway_push() {
      //  webinar.director 1:有无延迟权限  0:无权限
      if (
        JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))[
          'btn_thirdway_push'
        ] == '1'
      ) {
        return true
      } else {
        return false
      }
    },
  },
  created() {
    this.userId = sessionOrLocal.get('userId')
    this.isInteract = this.$route.query.type
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    goForm(url, index) {
      this.$vhall_paas_port({
        k: index === 1 ? 100189 : 100190,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: this.$route.params.str,
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
      window.open(url, '_blank')
    },
    goEmbedForm() {
      this.$vhall_paas_port({
        k: 100191,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: this.$route.params.str,
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
      let url = `${
        process.env.VUE_APP_E_COMPANY_URL
      }/auth/check-token?after_login=webinar/marketing/index&token=${sessionOrLocal.get(
        'SAAS_V3_SSO_TOKEN',
        'localStorage'
      )}`
      window.open(url, '_blank')
    },
    cope(url, index) {
      console.log(url)
      let copeArr = [100192, 100193, 100194, 100195]
      this.$copyText(url)
        .then((e) => {
          this.$vhall_paas_port({
            k: copeArr[index - 1],
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: '',
            },
          })
          this.$message({
            message: `复制成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box',
          })
        })
        .catch((error) => {
          this.$message({
            message: '复制失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
        })
    },
    // 新建流
    addStream() {
      if (this.total > 30) {
        this.$message({
          message: '活动下最多创建30路推流',
          showClose: true,
          // duration: 0,
          type: 'warning',
          customClass: 'zdy-info-box',
        })
        this.$vhall_paas_port({
          k: 100853,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: '',
          },
        })
        return
      }
      this.dialogVisible = true
    },
    //刷新流状态
    refreshStream() {
      this.getTableList()
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods
      methodsCombin[val.type](this, val)
    },
    getTableList() {
      let obj = {
        webinar_id: this.$route.params.str,
      }
      this.$fetch('getStreamPushList', this.$params(obj))
        .then((res) => {
          this.streamOpen = !!res.data.status
          let tableData = res.data.list || []
          tableData.map((item) => {
            item.watch = Boolean(item.status)
            item.pf_name = item.pf_name ? item.pf_name : '——'
            item.overseaTxt = item.oversea ? '海外' : '国内'
            item.pushStatusTxt = PushStatus[item.push_status]
          })
          this.total = res.data.list.length
          this.tableData = tableData
        })
        .catch((e) => {
          console.log(e)
        })
    },
    onSwitchChange(option) {
      this.$fetch('updateStreamPush', {
        webinar_id: this.$route.params.str,
        push_id: option.push_id,
        status: option.watch ? 1 : 0,
      })
        .then((res) => {
          if (this.vm) {
            this.vm.close()
          }
          this.getTableList()
        })
        .catch((res) => {
          this.$message({
            message: res.msg,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
          this.getTableList()
        })
    },
    // 删除
    del(that, { rows }) {
      that.delConfirm(rows.push_id)
    },
    delConfirm(id) {
      this.$confirm('删除后，正在推流的画面将会中断，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel',
      }).then(() => {
        this.$fetch('deleteStreamPush', {
          webinar_id: this.$route.params.str,
          push_id: id,
        })
          .then((res) => {
            if (res.code == 200) {
              this.$message({
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box',
              })
              this.getTableList()
            }
          })
          .catch((res) => {
            this.$message({
              message: res.msg || `删除失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box',
            })
          })
      })
    },
    // 编辑
    edit(that, { rows }) {
      that.editParams.push_id = rows.push_id
      that.editParams.pf_name = rows.pf_name
      that.editParams.dest_url = rows.dest_url
      that.editParams.oversea = rows.oversea
      that.dialogVisible = true
    },
    // 处理编辑新建
    handleUpdateStream() {
      this.$refs.editParamsForm.validate((valid) => {
        if (valid) {
          if (this.editParams.push_id) {
            // 编辑
            this.handleEdit()
          } else {
            // 创建
            this.handleCreate()
          }
        }
      })
    },
    // 编辑
    handleEdit() {
      this.$fetch('updateStreamPush', {
        ...this.editParams,
        webinar_id: this.$route.params.str,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: `推流地址保存成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box',
            })
            this.getTableList()
            this.handleCancelEdit()
          }
        })
        .catch((err) => {
          this.$message({
            message: err.msg || `推流地址保存失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
        })
    },
    // 创建
    handleCreate() {
      this.$fetch('createStreamPush', {
        ...this.editParams,
        webinar_id: this.$route.params.str,
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: `推流地址创建成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box',
            })
            this.getTableList()
            this.handleCancelEdit()
          }
        })
        .catch((res) => {
          this.$message({
            message: res.msg || `推流地址创建失败`,
            showClose: true,
            // duration: 0,
            type: 'warning',
            customClass: 'zdy-info-box',
          })
        })
    },
    // 取消编辑
    handleCancelEdit() {
      this.editParams.push_id = ''
      this.editParams.pf_name = ''
      this.editParams.dest_url = ''
      this.editParams.oversea = 0
      this.dialogVisible = false
    },
    closeStreamOpen() {
      let params = {
        webinar_id: this.$route.params.str,
        status: Number(this.streamOpen),
      }
      console.log('当前参数传递：', params)
      this.$fetch('updateStreamPushEnabled', params)
        .then((res) => {
          //关闭时提交
          if (!this.streamOpen) {
            this.tableData.map((item) => {
              if (item.push_status == 1) {
                item.push_status = 0
              }
              item.pushStatusTxt = PushStatus[item.push_status]
            })
            this.$vhall_paas_port({
              k: 100852,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.$route.params.str,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: '',
              },
            })
          } else {
            this.getTableList()
          }
        })
        .catch((res) => {
          this.$message({
            message: res.msg || `操作失败`,
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box',
          })
        })
    },
  },
}
</script>

<style lang="less" scoped>
.embed-card {
  /deep/.el-input__inner {
    padding-left: 12px;
  }
  .weixinWork,
  .network,
  .thirdMethod {
    background: #fff;
    padding: 24px 20px;
    border-radius: 4px;
    position: relative;
    .title_text {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      h3 {
        margin-right: 8px;
        font-size: 16px;
        color: #1a1a1a;
      }
      /deep/.el-switch__core {
        width: 28px !important;
        height: 16px;
      }
      /deep/ .el-switch__label span {
        font-size: 14px;
        color: #999999;
      }
      /deep/.el-switch__core:after {
        width: 12px;
        height: 12px;
      }
      /deep/.el-switch.is-checked .el-switch__core::after {
        margin-left: -13px;
      }
      /deep/.el-switch__label--right {
        margin-left: 8px;
      }
    }
    .head-operat {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .refresh {
        font-size: 14px;
        color: #3b67f9;
        margin-left: 12px;
        cursor: pointer;
      }
    }
    .stream-list {
      height: 504px;
    }
    .give-white {
      position: absolute;
      width: 100%;
      height: 570px;
      top: 60px;
      left: 0;
      background: rgba(255, 255, 255, 0.5);
      z-index: 9;
    }
  }
  h3 {
    font-weight: normal;
    font-size: 14px;
    color: #383838;
  }
  p {
    padding: 10px 0 0 100px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
    a {
      color: #3562fa;
      cursor: pointer;
    }
  }
  .input-item {
    display: flex;
    padding: 24px 50px 0 30px;
    span {
      display: inline-block;
      width: 70px;
      line-height: 35px;
      font-size: 14px;
      color: #1a1a1a;
    }
    i {
      cursor: pointer;
      &:hover {
        color: #3562fa;
      }
    }
    .el-button {
      display: inline-block;
      margin-left: 20px;
      padding: 10px 20px;
    }
    .iconfont-v3 {
      padding: 3px;
      // padding-right: 12px;
      line-height: 38px;
      color: #666;
      &:hover {
        color: #1a1a1a;
      }
    }
  }
  .network {
    margin: 30px 0;
  }
  .third-text {
    padding-left: 35px;
    line-height: 20px;
  }
  .third-list {
    width: 724px;
    height: 131px;
    // border: 1px dashed #ccc;
    margin: 20px 36px 5px 30px;
    background: url(../../common/images/third-promote.png) no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
  }
  /deep/.el-dialog__footer {
    padding: 0 32px 24px;
  }
}
</style>
