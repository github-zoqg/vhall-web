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
      <h3>第三方渠道推广嵌入</h3>
      <!--  <div class="third-list"></div>
      <p class="third-text">
        提示：目前微吼已支持在各大平台进行同步直播<a @click="goEmbedForm">
          填写推广需求表</a
        >
      </p> -->
      <div class="title_text">
        <div class="title">启动第三方推流</div>
        <el-switch
          v-model="streamOpen"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          @change="closeStreamOpen"
          :active-text="reservationDesc"
        >
        </el-switch>
      </div>
      <div class="head-operat" v-show="total">
        <el-button
          type="primary"
          size="medium"
          round
          @click="addStream"
          v-preventReClick
          >创建推流地址</el-button
        >
        <el-button
          type="primary"
          size="medium"
          round
          @click="refreshStream"
          v-preventReClick
          >刷新推流状态</el-button
        >
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
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
    <el-dialog
      :title="editParams.stream_id ? '编辑推流地址' : '创建推流地址'"
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
        <el-form-item label="平台名称" prop="name">
          <VhallInput
            v-model="editParams.name"
            v-clearEmoij
            show-word-limit
            :maxlength="10"
            autocomplete="off"
            placeholder="请输入平台名称"
          ></VhallInput>
        </el-form-item>
        <el-form-item label="推流地址" prop="url">
          <VhallInput
            @input="handleInput"
            v-model="editParams.url"
            autocomplete="off"
            placeholder="请输入推流地址"
          >
          </VhallInput>
        </el-form-item>
        <el-form-item label="推流类型" prop="type">
          <el-radio-group v-model="editParams.type">
            <el-radio :label="1">国内推流</el-radio>
            <el-radio :label="2">海外推流</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          :disabled="!editParams.url || !editParams.type"
          type="primary"
          size="medium"
          @click="handleUpdateStream"
          round
          >确定</el-button
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
          callback && callback('推流的协议头URL scheme支持rtmp,rtmps')
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
          key: 'name',
        },
        {
          label: '推流地址',
          key: 'name',
        },
        {
          label: '推流类型',
          key: 'price',
          width: 120,
        },
        {
          label: '推流状态',
          key: 'price',
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
        stream_id: '',
        name: '',
        url: '',
        type: 1,
      },
      dialogVisible: false, // 新建流
      rules: {
        url: [{ required: true, validator: urlValidate, trigger: 'blur' }],
      },
      streamOpen: true, //启动第三方推流
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
          message: '流最大数量为30，请删除后再进行操作',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box',
        })
        return
      }
      this.dialogVisible = true
    },
    //刷新流状态
    refreshStream() {},
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods
      methodsCombin[val.type](this, val)
    },
    getTableList(params) {
      // let pageInfo = this.$refs.tableStreamList.pageInfo //获取分页信息
      let pageInfo = {
        pageNum: 1,
        pos: 0,
        limit: 30,
      }
      let obj = {
        ...pageInfo,
        webinar_id: this.$route.params.str,
      }
      this.$fetch('goodsGet', this.$params(obj))
        .then((res) => {
          let tableData = res.data.goods_list
          tableData.map((item) => {
            item.watch = Boolean(!item.status)
            item.img = item.img_url
          })
          this.total = res.data.total
          this.tableData = tableData
        })
        .catch((e) => {
          console.log(e)
        })
    },
    onSwitchChange(option) {
      this.$vhall_paas_port({
        k: option.watch ? 100395 : 100396,
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
      if (option.watch) {
        this.$fetch('goodsEnable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id,
        })
          .then((res) => {
            if (this.vm) {
              this.vm.close()
            }
            this.messageInfo('上架设置成功')
            this.getTableList()
            console.log(res)
          })
          .catch((res) => {
            this.$message({
              message: res.msg || '上架设置失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box',
            })
            this.getTableList()
            console.log(res)
          })
      } else {
        // 下架处理
        this.$fetch('goodsDisable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id,
        })
          .then((res) => {
            if (this.vm) {
              this.vm.close()
            }
            this.messageInfo('下架设置成功')
            this.getTableList()
            console.log(res)
          })
          .catch((res) => {
            this.$message({
              message: res.msg || '下架设置失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box',
            })
            console.log(res)
          })
      }
    },
    // 删除
    del(that, { rows }) {
      that.delConfirm(rows.goods_id, 2)
    },
    delConfirm(id, index) {
      this.$confirm('删除后，正在推流的画面将会中断，是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel',
      })
        .then(() => {
          this.$fetch('goodsBatchDel', {
            webinar_id: this.$route.params.str,
            goods_ids: id,
          })
            .then((res) => {
              if (res.code == 200) {
                this.$vhall_paas_port({
                  k: index === 1 ? 100394 : 100393,
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
                  message: `删除成功`,
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box',
                })
                this.checkedGoodsId = []
                this.getTableList()
              }
            })
            .catch((res) => {
              this.$message({
                message: res.msg || `删除失败, 请下架后删除`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box',
              })
            })
        })
        .catch(() => {
          this.$message({
            message: `已取消删除`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box',
          })
        })
    },
    // 编辑
    edit(that, { rows }) {
      if (!rows.status) {
        that.$alert('商品已上架，如需编辑请先做下架处理', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'zdy-message-box',
          lockScroll: false,
        })
        return
      }
    },
    // 处理编辑新建
    handleUpdateStream() {
      this.$refs.editParamsForm.validate((valid) => {
        if (valid) {
          let price = Number(this.editParams.price)
          if (price || price == 0) {
            if (price < 0 || price > 9999.99) {
              this.$message({
                message: `价格必须介于0-9999.99之间`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box',
              })
              return
            }
            price = Math.floor(price * 100) / 100
            this.editParams.price = price.toFixed(2)
          } else {
            this.$message({
              message: `请输入正确礼物价格`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box',
            })
            return
          }
          if (this.editParams.gift_id) {
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
      this.$confirm('对礼物的更改会同步到资料库，确定保存当前更改？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel',
      }).then(() => {
        this.$fetch('updateGiftInfo', {
          ...this.editParams,
          room_id: this.room_id,
        })
          .then((res) => {
            if (res.code == 200) {
              this.$vhall_paas_port({
                k: 100399,
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
                message: `编辑成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box',
              })
              this.getTableList()
              this.queryMateriaGifts()
              this.handleCancelEdit()
            }
          })
          .catch((err) => {
            if (err.code == 513001) {
              this.$message({
                message: `直播中禁止编辑礼物`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box',
              })
            } else {
              this.$message({
                message: err.msg,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box',
              })
            }
            this.handleCancelEdit()
          })
      })
    },
    // 创建
    handleCreate() {
      this.$confirm('对礼物的更改会同步到资料库，确定保存当前更改？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel',
      }).then(() => {
        this.$fetch('createWebinarGift', {
          ...this.editParams,
          room_id: this.room_id,
        })
          .then((res) => {
            if (res.code == 200) {
              this.$vhall_paas_port({
                k: 100398,
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
                message: `创建成功`,
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
              message: res.msg || `创建失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box',
            })
          })
      })
    },
    // 取消编辑
    handleCancelEdit() {
      this.editParams.gift_id = ''
      this.editParams.name = ''
      this.editParams.price = ''
      this.dialogVisible = false
    },
    closeStreamOpen() {
      let params = {
        webinar_id: this.$route.params.str,
        permission_key: 'is_player_cofig',
        status: Number(this.playerOpen),
      }
      console.log('当前参数传递：', params)
      this.$fetch('planFunctionEdit', params)
        .then((res) => {
          this.$vhall_paas_port({
            k: this.playerOpen ? 100227 : 100228,
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
          if (!this.playerOpen) {
            this.$message({
              message: '正在使用账号下品牌设置',
              showClose: true,
              type: 'warning',
              customClass: 'zdy-info-box',
            })
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
    .title_text {
      display: flex;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 20px;
      .title {
        margin-right: 20px;
      }
    }
    .head-operat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .data-list {
      min-height: 500px;
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
}
</style>
