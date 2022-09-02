<template>
  <div>
    <pageTitle pageTitle="观看限制">
      <!-- <div slot="content">
        可联系客服开通“单点观看”功能，即开启付费/邀请码/白名单后，一个账号仅允许同时一台设备观看直播。
      </div> -->
      <div class="setting_detail" @click="toSettingDetail" v-if="tabType=='viewingProtocol'">查看账号下观看协议设置</div>
      <div class="limit_detail" @click="toDetail" v-else>若直播关联专题，以专题鉴权模式为准。<span>查看详情</span></div>
    </pageTitle>
    <!-- 内容区域 -->
    <div class="viewer-rules_container">
      <el-tabs v-model="tabType" @tab-click="handleClick">
        <el-tab-pane label="观看限制" name="viewerLimit"></el-tab-pane>
        <el-tab-pane label="观看协议" name="viewingProtocol" v-if="permissionInfo['watch.viewing_protocol'] > 0"></el-tab-pane>
      </el-tabs>
      <div class="viewer-rules" v-show="liveDetailInfo && tabType === 'viewerLimit'">
        <el-radio-group v-model="form.verify" @change="handleClick">
          <el-radio :label="0" v-if="liveDetailInfo && liveDetailInfo.webinar_type != 6">免费</el-radio>
          <el-radio :label="3">付费</el-radio>
          <el-radio :label="4" v-if="permissionInfo.f_code">邀请码（原F码）</el-radio>
          <el-radio :label="6" v-if="permissionInfo.f_code">付费/邀请码</el-radio>
          <el-radio :label="1">密码</el-radio>
          <el-radio :label="2" v-if="permissionInfo.white_list">白名单</el-radio>
        </el-radio-group>
        <!-- 选值区域 -->
        <div class="viewer-rules-content">
          <template v-if="liveDetailInfo && liveDetailInfo.webinar_type != 6">
            <!-- 免费 0 -->
            <div v-show="Number(form.verify) === 0" class="viewer-rules-ctx--0">
              <span v-if='webinarState != 4'>
                <span class="color1a1a1a">预约按钮：</span>
                <el-switch class="pl10 address" v-model="hide_subscribe" active-color="#FB3A32" inactive-color="#cecece"></el-switch>
                <span class="pl10 fontStyle">{{hide_subscribe?'已开启':'开启后'}}，预告状态下且未设置报名表单时显示&lt;立即预约&gt;按钮</span>
              </span>
              <p class="mt30">观看无需任何验证，即可观看直播</p>
            </div>
          </template>
          <!-- 付费 3 -->
          <div v-show="Number(form.verify) === 3" class="viewer-rules-ctx--3">
            <el-form :model="payForm" ref="payForm" :rules="payFormRules"  label-width="70px">
              <el-form-item label="付费金额" prop="fee">
                <!--<div class="rules-ctx-inline">
                  <el-input v-model.trim="payForm.fee" autocomplete="off" placeholder="0.01-99999.99"></el-input>
                  <span class="ctx-span">元</span>
                </div>-->
                <VhallInput v-model.trim="payForm.fee" autocomplete="off" placeholder="0.01-99999.99" class="btn-relative no-border" ref="payForm_fee" @input="formatInputs($event, 'payForm', 'fee')">
                  <i slot="suffix">元</i>
                  <!-- <template slot="append">元</template> -->
                </VhallInput>
              </el-form-item>
              <el-form-item label="试看" class="switch__height" v-if="permissionInfo.btn_preview">
                <div class="switch__box">
                  <el-switch
                    v-model="form.is_preview"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#FB3A32"
                    inactive-color="#CECECE">
                  </el-switch>
                  <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
                </div>
              </el-form-item>
              <el-form-item label="试看时长" v-show="form.is_preview">
                <el-select v-model="form.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 邀请码（原F码）4-->
          <div v-show="Number(form.verify) === 4" class="viewer-rules-ctx--4">
            <el-form :model="fCodeForm" ref="fCodeForm" :rules="fCodeFormRules"  label-width="82px">
              <el-form-item label="生成邀请码" prop="nums">
                <div class="fCode__flex">
                  <VhallInput v-model.trim="fCodeForm.nums" autocomplete="off" placeholder="1-1000个" class="btn-relative btn-two" @input="formatInputs($event, 'fCodeForm', 'nums')">
                    <el-button type="text" class="no-border" size="mini" slot="append" v-preventReClick @click.prevent.stop="fCodeExecute('fCodeForm')">生成</el-button>
                  </VhallInput>
                  <span class="inline-count">已生成<strong>{{viewerDao && viewerDao.fcodes ? viewerDao.fcodes : 0}}</strong>个</span>
                  <el-button class="down-btn" size="medium" type="white-primary" v-preventReClick round @click="downFCodeHandle">下载邀请码</el-button>
                </div>
              </el-form-item>
              <el-form-item label="设置提示" prop="">
                <VhallInput v-model.trim="fCodeForm.fcode_verify" class="pr60" autocomplete="off" placeholder="请输入邀请码" :maxlength="30" show-word-limit></VhallInput>
                <!-- <el-input type="text" placeholder="请输入邀请码" v-model="fCodeForm.fcode_verify" maxlength="30" show-word-limit></el-input> -->
                <span class="pl10 color-3562FA cursor" @click="openDialog(fCodeForm.fcode_verify|| '请输入邀请码')">查看效果</span>
              </el-form-item>
              <el-form-item label="试看" class="switch__height" v-if="permissionInfo.btn_preview">
                <div class="switch__box">
                  <el-switch
                    v-model="form.is_preview"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#FB3A32"
                    inactive-color="#CECECE">
                  </el-switch>
                  <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
                </div>
              </el-form-item>
              <el-form-item label="试看时长" v-show="form.is_preview">
                <el-select v-model="form.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 付费/邀请码 6 -->
          <div v-show="Number(form.verify) === 6" class="viewer-rules-ctx--6">
            <el-form :model="fCodePayForm" ref="fCodePayForm" :rules="fCodePayFormRules"  label-width="82px">
              <el-form-item label="付费金额" prop="fee">
                <VhallInput v-model.trim="fCodePayForm.fee" autocomplete="off" placeholder="0.01-99999.99" class="btn-relative no-border" @input="formatInputs($event, 'fCodePayForm', 'fee')">
                  <i slot="suffix">元</i>
                </VhallInput>
              </el-form-item>
              <el-form-item label="生成邀请码" prop="nums">
                <div class="fCode__flex">
                  <VhallInput v-model.trim="fCodePayForm.nums" autocomplete="off" placeholder="1-1000个" class="btn-relative btn-two" @input="formatInputs($event, 'fCodePayForm', 'nums')">
                    <el-button type="text" class="no-border" size="mini" slot="append" v-preventReClick @click.prevent.stop="fCodeExecute('fCodePayForm')">生成</el-button>
                  </VhallInput>
                  <span class="inline-count">已生成<strong>{{viewerDao && viewerDao.fcodes ? viewerDao.fcodes : 0}}</strong>个</span>
                  <el-button class="down-btn" size="medium" type="white-primary" v-preventReClick round @click="downFCodeHandle">下载邀请码</el-button>
                </div>
              </el-form-item>
              <el-form-item label="设置提示" prop="">
                <VhallInput v-model.trim="fCodePayForm.fee_verify" class="pr60" autocomplete="off" placeholder="请输入邀请码" :maxlength="30" show-word-limit></VhallInput>
                <!-- <el-input type="text" placeholder="请输入邀请码" v-model="fCodePayForm.fee_verify" maxlength="30" show-word-limit ></el-input> -->
                <span class="pl10 color-3562FA cursor" @click="openDialog(fCodePayForm.fee_verify || '请输入邀请码')">查看效果</span>
              </el-form-item>
              <el-form-item label="试看" class="switch__height" v-if="permissionInfo.btn_preview">
                <div class="switch__box">
                  <el-switch
                    v-model="form.is_preview"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#FB3A32"
                    inactive-color="#CECECE">
                  </el-switch>
                  <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
                </div>
              </el-form-item>
              <el-form-item label="试看时长" v-show="form.is_preview">
                <el-select v-model="form.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 密码 1 -->
          <div v-show="Number(form.verify) === 1" class="viewer-rules-ctx--1">
            <el-form :model="pwdForm" ref="pwdForm" :rules="pwdFormRules"  label-width="70px">
              <el-form-item label="观看密码" prop="password">
                <VhallInput v-model.trim="pwdForm.password" autocomplete="off" placeholder="请输入密码" :maxlength="12" show-word-limit></VhallInput>
              </el-form-item>
              <el-form-item label="设置提示" prop="">
                <VhallInput v-model.trim="pwdForm.password_verify" class="pr60" autocomplete="off" placeholder="请输入密码" :maxlength="30" show-word-limit></VhallInput>
                <!-- <el-input type="text" placeholder="请输入密码" v-model="pwdForm.password_verify" maxlength="30" show-word-limit ></el-input> -->
                <span class="pl10 color-3562FA cursor" @click="openDialog(pwdForm.password_verify || '请输入密码')">查看效果</span>
              </el-form-item>
              <el-form-item label="试看" class="switch__height" v-if="permissionInfo.btn_preview">
                <div class="switch__box">
                  <el-switch
                    v-model="form.is_preview"
                    :active-value="1"
                    :inactive-value="0"
                    active-color="#FB3A32"
                    inactive-color="#CECECE">
                  </el-switch>
                  <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
                </div>
              </el-form-item>
              <el-form-item label="试看时长" v-show="form.is_preview">
                <el-select v-model="form.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <!-- 白名单 2 -->
          <div v-show="Number(form.verify) === 2" class="viewer-rules-ctx--2">
            <el-form label-width="82px">
              <el-form-item label="设置提示" prop="">
                <VhallInput v-model.trim="white_verify" class="pr60" autocomplete="off" placeholder="请输入手机号/邮箱/工号" :maxlength="30" show-word-limit></VhallInput>
                <!-- <el-input type="text" placeholder="请输入手机号/邮箱/工号" v-model="white_verify" maxlength="30" show-word-limit ></el-input> -->
                <span class="pl10 color-3562FA cursor" @click="openDialog(white_verify || '请输入手机号/邮箱/工号')">查看效果</span>
              </el-form-item>
              <el-form-item label="选择观众组">
                <ul class="tab__white tab__white__group">
                  <li :class="['tab__btn--solid', {'active': whiteId === item.id }]"  v-for="(item, ins) in groupList" :key="`group${ins}`" @click.prevent.stop="selectGroup(item)">
                    <span>{{item.subject}}</span>
                  </li>
                  <li class="">
                    <router-link :to="{path:'/material/viewer'}"><el-button type="white-primary" class="changeIconCol" size="small" round><i class="el-icon-plus"></i>添加观众组</el-button></router-link>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="试看" class="switch__height" v-if="permissionInfo.btn_preview">
                <div class="switch__box">
                  <el-switch
                    v-model="form.is_preview"
                    :active-value=1
                    :inactive-value=0
                    active-color="#FB3A32"
                    inactive-color="#CECECE">
                  </el-switch>
                  <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
                </div>
              </el-form-item>
              <el-form-item label="试看时长" v-show="form.is_preview">
                <el-select v-model="form.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 保存 -->
        <div class="save-margin-top40">
          <el-form label-width="82px">
            <el-button type="primary" class="length152" v-preventReClick round @click.prevent.stop="viewerSetSave">保 存</el-button>
          </el-form>
        </div>
      </div>
      <viewing-protocol ref="viewingProtocolComp" type="1" :tabType="tabType" v-if="permissionInfo['watch.viewing_protocol'] > 0 && tabType === 'viewingProtocol'"></viewing-protocol>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5 && webinarState!=4"></begin-play>
    <VhallDialog :visible='visible' title="权限验证" width='400px' @close="visible = false;">
      <span class="pr" v-if='!showPwd'>
        <el-input :placeholder="showText" v-model="stash" type="password" maxlength="12"></el-input>
        <span class="iconfont-v3 saaseyeclose_huaban1 inputIcon cursor" @click='showPwd = true'></span>
      </span>
      <span class="pr" v-else>
        <el-input :placeholder="showText" v-model="stash"></el-input>
        <span class="iconfont-v3 saasicon-eye inputIcon cursor" @click='showPwd = false'></span>
      </span>
      <div slot='footer'>
        <el-button type="primary" round @click="visible = false;" class="button_size">确定</el-button>
      </div>
    </VhallDialog>
    <VhallDialog :visible='limitVisible' title="提示" width='400px' @close="limitVisible = false;">
      <div class="limit_tip">
        <template v-if="subjectInfo.subject_type==1">
          <span>本直播属于多个专题，这些专题无统一的观看限制，本直播观看限制生效</span>
        </template>
        <template v-else-if="subjectInfo.subject_type==2">
          本直播属于专题 <span class="color_blue" @click="goSubjectDetail">《{{ titleFormat() }}》</span> ，
         <span>该专题提供统一的观看限制-{{ handleFormat() }}，本直播观看限制<span class="color_red">失效</span>。 </span>
        </template>
        <template v-else-if="subjectInfo.subject_type==3">
          本直播属于专题 <span class="color_blue" @click="goSubjectDetail">《{{ titleFormat() }}》</span> ，
          <span>该专题无统一的观看限制，本直播观看限制生效。</span>
        </template>
        <template v-else>
         <span>本直播不属于任何专题，本次设置的观看限制生效。</span>
        </template>
      </div>
      <div slot='footer'>
        <el-button type="primary" size="medium" round @click="limitVisible = false;">我知道了</el-button>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import env from "@/api/env";
import {formateDate} from "@/utils/general";
import { parse } from 'qs';
import { sessionOrLocal } from '@/utils/utils';
import beginPlay from '@/components/beginBtn';
import ViewingProtocol from './components/viewingProtocol';
export default {
  name: 'viewerRules.vue',
  components: {
    PageTitle,
    beginPlay,
    ViewingProtocol
  },
  // 无极版、标准版、新享版 没有邀请码 付费 白名单 试看 权限 按钮-试看
  data() {
    let checkNums = (rule, value, callback) => {
      if (this.viewerDao && this.viewerDao.fcodes > 0) {
        callback();
      } else if (!value) {
        return callback(new Error('邀请码数量1-1000'));
      } else if (value > 1000 || value < 1) {
        return callback(new Error('邀请码数量1-1000'));
      } else if (isNaN(value)) {
        return callback(new Error('邀请码数量1-1000'));
      } else {
        callback();
      }
    };
    let checkFee = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请按正确格式填写，0.01-99999.99'));
      } else if (isNaN(value)) {
        return callback(new Error('请按正确格式填写，0.01-99999.99'));
      } else if (parseFloat(value) < 0.01 || parseFloat(value) > 99999.99) {
        return callback(new Error('请按正确格式填写，0.01-99999.99'));
      } else {
        callback();
      }
    };
    let checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码只能由1-12位数字或字母组成'));
      } else if (!/^[0-9a-zA-Z]{1,12}$/.test(value)) {
        return callback(new Error('密码只能由1-12位数字或字母组成'));
      } else {
        callback();
      }
    };
    return {
      timeOption: [
        {
          label: '5分钟',
          value: 5
        },
        {
          label: '10分钟',
          value: 10
        },
        {
          label: '15分钟',
          value: 15
        },
        {
          label: '20分钟',
          value: 20
        }
      ],
      tabType: 'viewerLimit',
      lowerGradeInterval: null,
      viewerDao: {},
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      permissionInfo: JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')),
      perssionWebInfo: JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage')), //账号下配置项
      form: {
        webinar_id: this.$route.params.str,
        verify: 0,
        password: '', // 观看密码
        white_id: '', // 白名单-观众组字符拼接串
        fee: null, // 付费金额,
        is_preview: 0, // 是否开启试看（1-试看；0-否；）
        preview_time: 5, // 试看时长-分钟计
      },
      whiteIds: [],
      whiteId: null, // 观众组只可选择一个
      groupList: [],
      payForm: { // 付费表单
        fee: ''
      },
      payFormRules: {
        fee: [
          { required: false, message: '请按正确格式填写，0.01-99999.99', trigger: 'blur' },
          { pattern: /^\d{0,5}(\.\d{0,2})?$/, message: '请按正确格式填写，0.01-99999.99' , trigger: 'blur'},
          { validator: checkFee, trigger: 'blur' }
        ]
      },
      fCodeForm: {  // 邀请码表单
        nums: '',
        fcode_verify: ''// placeholder
      },
      fCodeFormRules: {
        nums: [
          { required: false, message: '邀请码数量1-1000', trigger: 'blur' },
          { pattern: /^(1000|[1-9][0-9]{0,2})$/, message: '邀请码数量1-1000' , trigger: 'blur'},
          { validator: checkNums, trigger: 'blur' }
        ]
      },
      fCodePayForm: { // 付费/邀请码
        nums: '',
        fee: null,
        fee_verify: '' // placeholder
      },
      fCodePayFormRules: {
        nums: [
         /*  { required: true, message: '邀请码数量1-1000', trigger: 'blur' }, */
          { pattern: /^(1000|[1-9][0-9]{0,2})$/, message: '邀请码数量1-1000' , trigger: 'blur'},
          { validator: checkNums, trigger: 'blur' }
        ],
        fee: [
          { required: false, message: '请按正确格式填写，0.01-99999.99', trigger: 'blur' },
          { pattern: /^\d{0,5}(\.\d{0,2})?$/, message: '请按正确格式填写，0.01-99999.99' , trigger: 'blur'},// /^\d{1,6}\.{0,1}(\d{1,2})?$/
          { validator: checkFee, trigger: 'blur' }
        ]
      },
      pwdForm: { // 密码
        password: '',
        password_verify: '' // placeholder
      },
      pwdFormRules: {
        password: [
          { required: false, message: '密码只能由1-12位数字或字母组成', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]{1,12}$/, message: '密码只能由1-12位数字或字母组成' , trigger: 'blur'},
          { validator: checkPwd, trigger: 'blur' }
        ]
      },
      showText: '123',   //placeholder自定义
      visible: false,
      white_verify: '', // 白名单placeholder
      hide_subscribe: true,  // 预约状态
      showPwd: false,
      stash:'',               // 仅占位用
      liveDetailInfo: null,
      limitVisible: false,
      vm: {},
      subjectInfo: {
        subject_verify: '', //专题鉴权
        subject_type: '', // 绑定
        subject_title: '', //专题标题
        subject_id: '' // 活动对应的专题
      }
    };
  },
  beforeDestroy(to, from, next) {
    if (this.subjectInfo && this.subjectInfo.subject_type) {
      this.vm.close();
    }
    next();
  },
  methods: {
    handleLowerGradeHeart() {
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      let userId = JSON.parse(sessionOrLocal.get('userId'));
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { activity, user, global } = res;
        // 优先顺序：互动 > 用户 > 全局
        const activityConfig = activity && activity.length > 0 ? activity.find(option => option.audience_id == this.$route.params.str) : null;
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == userId) : null;
        console.log('777777777', res)
        if (activityConfig) {
          this.setLowerGradeConfig(activityConfig.permissions)
        } else if (userConfig) {
          this.setLowerGradeConfig(userConfig.permissions)
        } else if (global && global.permissions) {
          this.setLowerGradeConfig(global.permissions)
        }
      });
    },
    setLowerGradeConfig(data) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      const permission = this.permission
      this.permissions = Object.assign(permission, data)
    },
    formatInputs(value, formName, key) {
      if (key === 'nums') {
        if (!/^(1000|[1-9][0-9]{0,2})$/.test(value)) {
          if(!value.match(/^(1000|[1-9][0-9]{0,2})$/g)) {
            this[formName][key] = '';
          } else {
            this[formName][key] = parseFloat(value).toFixed(2);
          }
        }
      } else {
        if (!/^\d{0,5}(\.\d{0,2})?$/.test(value)) {
          if(!value.match(/^\d{0,5}(\.\d{0,2})?$/g)) {
            this[formName][key] = '';
          } else {
            this[formName][key] = parseFloat(value).toFixed(2);
          }
        }
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
      // 每次选项卡切换，之前选择项清空。
      this.form.password = '';
      this.form.white_id = '';
      this.form.fee = '';
      this.form.is_preview = 0;
      this.form.preview_time = 5;
      console.log(this.form, '切换后表单值')
    },
    // 获取已经设置过的观看限制信息
    viewerSetGet() {
      this.$fetch('viewerSetGet', {
        webinar_id: this.$route.params.str
      }).then(res => {
        console.log(res.data,'7777777777777777')
         this.viewerDao = res.data;
        // 预约按钮是否展示
        this.hide_subscribe = res.data.hide_subscribe?true:false;
        // 密码、付费、f码、白名单提示语
        this.pwdForm.password_verify = res.data.password_verify;
        this.fCodePayForm.fee_verify = res.data.fee_verify;
        this.fCodeForm.fcode_verify = res.data.fcode_verify;
        this.white_verify = res.data.white_verify;
        // 数据初始化渲染（verify字段控制类别=> 0 无验证，1 密码，2 白名单，3 付费活动, 4 F码 ,6 付费+F码）
        let { webinar_id, verify, password, white_id, fee, is_preview, preview_time} = res.data;
        this.$nextTick(() => {
          this.form = {
            webinar_id: webinar_id,
            verify: verify,
            password: password, // 观看密码
            white_id: white_id, // 白名单-观众组字符拼接串
            fee: fee, // 付费金额,
            is_preview: is_preview, // 是否开启试看（1-试看；0-否；）
            preview_time: is_preview > 0 ? preview_time : 5 // 试看时长-分钟计，若已经设置过反显。若未设置过默认为5
          };
          this.subjectInfo = {
            subject_verify: res.data.subject_verify, //专题鉴权
            subject_type: res.data.subject_type, // 绑定
            subject_title: res.data.subject_title, //专题标题
            parent_verify: res.data.parent_verify,
            subject_id: res.data.subject_id // 活动对应的专题
          }
          this.whiteId = verify === 2 ? white_id : null;
          if (res.data.subject_type == 2) {
            this.initAuthMessage();
          }
          console.log(this.form, '当前');
          // 表单选项初始化
          this.initViewerSet();
        })
      }).catch(err => {
        console.log(err);
        this.viewerDao = {};
      });
    },
    initViewerSet() {
      // let arr = ['', 'pwdForm', 'whiteForm', 'payForm', 'fCodeForm', '', 'fCodePayForm'];
      if(this.form.verify === 1) {
        this.pwdForm.password = this.viewerDao.password;
      } else if (this.form.verify === 2) {
        this.whiteIds = this.viewerDao.white_id;
      } else if (this.form.verify === 3) {
        this.payForm.fee = this.viewerDao.fee;
      } else if (this.form.verify === 4) {
        this.fCodeForm.nums = null;
      } else if (this.form.verify === 6) {
        this.fCodePayForm.nums = null;
        this.fCodePayForm.fee = this.viewerDao.fee;
      }
    },
    // 观看限制保存
    async viewerSetSave() {
      let formList = ['', 'pwdForm', 'whiteForm', 'payForm', 'fCodeForm', '', 'fCodePayForm'];
      let formName = formList[this.form.verify];
      let flag = false;
      let params = {};
      if (this.$refs[formName]) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            flag = true;
            params = Object.assign(this.form, this[formName]);
            // 若是非白名单，不传递white_id
            if(formName !== 'whiteForm') {
              try {
                delete params.white_id;
              } catch (e) {
                console.log('去除白名单参数', e);
              }
            }
            // 若是非观看密码
            if(formName !== 'pwdForm') {
              try {
                delete params.password;
              } catch (e) {
                console.log('去除观看密码参数', e);
              }
            }
            // 若是非支付类
            if(formName !== 'fCodePayForm' && formName !== 'payForm') {
              try {
                delete params.fee;
              } catch (e) {
                console.log('去除支付金额参数', e);
              }
            }
          }
        });
      } else if(formName === 'whiteForm') {
        /*flag = this.whiteIds.length > 0;*/
        flag = this.whiteId !== null && this.whiteId !== undefined && this.whiteId !== '' && this.whiteId !== 0;
        if (!flag) {
          this.$message({
            message:  `请选择观众组`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        params = {
          webinar_id: this.form.webinar_id,
          verify: this.form.verify,
          white_id: this.whiteId,
          is_preview: this.form.is_preview,
          preview_time: this.form.preview_time,
          white_verify: this.white_verify
        }
      } else if (formName === '') {
        flag = true; // 免费不验证
        params = {
          webinar_id: this.$route.params.str,
          verify: 0,
          hide_subscribe: this.hide_subscribe?1:0
        }
      }
      // 若是邀请码 和 付费/邀请码里面
      if(formName === 'fCodeForm' || formName === 'fCodePayForm') {
        if (!(this.viewerDao.fcodes > 0)) {
          this.$message({
            message:  `您暂无邀请码，请生成后保存`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
      }
      if (formName === 'whiteForm') {
        try {
          // 设置白名单的时候，每次点击保存之前，先获取下活动是否设置过报名表单
          await this.getLiveDetail()
        } catch(e) {
          console.log(e)
        }
      }
      // 若是当前白名单，开启了报名表单，直接提示不可和白名单直接使用。
      if (formName === 'whiteForm' && Number(this.liveDetailInfo.reg_form) === 1) {
        this.$message({
          message:  `您已选择报名表单不可和白名单叠加使用`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      if (flag) {
        console.log('当前保存参数存储：' + JSON.stringify(params));
        if(formName !== '' && formName !== 'whiteForm' && Number(this.liveDetailInfo.reg_form) === 1) {
          // 若设置了报名表单，调取报名表单是否配置独立链接，配置了提示，没配置直接保存。
          let result = await this.$fetch('regFromGet', {
            webinar_id: this.$route.params.str
          })
          if (result.code === 200 && result.data.open_link > 0) { // 报名表单是否为独立链接，1开启 0关闭,默认为0
            this.$confirm('已开启报名表单的独立链接功能，修改观看限制将会导致链接失效?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: 'zdy-message-box',
              lockScroll: false,
              cancelButtonClass: 'zdy-confirm-cancel'
            }).then(() => {
              // 设置了报名表单，开启了报名表单独立链接。
              this.sendViewerSetSave(params);
            });
          } else if(result.code === 200) {
            // 设置了报名表单，没开启独立链接
            this.sendViewerSetSave(params);
          }
        } else {
          // 未设置报名表单，直接保存
          this.sendViewerSetSave(params);
        }
      }
    },
    toDetail() {
      // 有绑定
      this.limitVisible = true;
    },
    initAuthMessage() {
      let that = this;
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        // message: `本直播属于专题《 `,
        message: '<p style="color:#1A1A1A; padding-right: 12px">本直播属于专题《<span id="openSubjectDetails" style="color:#3562fa;cursor: pointer;">'+ that.titleFormat() +'</span>》该专题提供统一的观看限制-'+ that.handleFormat() +'  本直播观看限制 <span style="color:#FB3A32">失效   </span></p>',
        type: 'warning'
      });
      let open = document.querySelector('#openSubjectDetails');
        open.addEventListener('click', function(e){
          that.vm.close();
          that.goSubjectDetail();
      });
    },
    goSubjectDetail() {
      window.open(`${process.env.VUE_APP_WEB_URL}/special/edit/${this.subjectInfo.subject_id}?title=编辑`, '_blank')
    },
    getReportData() {
      let userId = JSON.parse(sessionOrLocal.get('userId'));
      let limitType = [100097, 100101, 100102, 100098, 100099, '', 100100]
      this.$vhall_paas_port({
        k: limitType[this.form.verify],
        data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '',s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      if (this.form.is_preview) {
        let previewType = [100103, 100104, 100105, 100106];
        this.$vhall_paas_port({
          k: previewType[this.form.preview_time / 5 - 1],
          data: {business_uid: userId, user_id: '', webinar_id: this.$route.params.str, refer: '',s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
    },
    sendViewerSetSave(params) {
      Object.assign(params,{
        password_verify: this.pwdForm.password_verify,
        fee_verify: this.fCodePayForm.fee_verify,
        fcode_verify: this.fCodeForm.fcode_verify,
        white_verify: this.white_verify,
        hide_subscribe: this.hide_subscribe?1:0,
      })
      this.$fetch('viewerSetSave', this.$params(params)).then(res => {
        console.log(res);
        this.getReportData();
        this.$message({
          message:  `设置成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.initPage();
      }).catch(res =>{
         this.$message({
          message:  res.msg || '设置失败',
          showClose: true,
          // duration: 0,
          type: res.code == 512999 ? 'warning' : 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 获取观众分组列表
    audienceGet() {
      let params = {
        pos: 0,
        limit: 1000, // TODO 默认分组查询1000条
      };
      this.$fetch('audienceGet', params).then(res => {
        if (res.data && res.data.list) {
          this.groupList = res.data.list;
        } else {
          this.groupList = [];
        }
      }).catch(e => {
        console.log(e);
        this.groupList = [];
      });
    },
    selectGroup(item) {
      console.log(item);
      /*if(!this.whiteIds.includes(item.id)) {
        this.whiteIds.push(item.id);
      } else {
        if(this.whiteIds.includes(item.id)) {
          this.whiteIds.splice(this.whiteIds.indexOf(item.id), 1);
        }
      }
      console.log('当前已经选中分组集合'+this.whiteIds.join('.'));
      */
      this.whiteId = item.id;
    },
    toSettingDetail() {
      // 针对某一个活动，开启了观看协议
      if (this.perssionWebInfo['watch.viewing_protocol'] == 0) {
        this.$alert('尊敬的用户，您的账号无此权限。如需使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          lockScroll: false,
          customClass: 'zdy-message-box',
          callback: action => {}
        });
        return;
      }
      const { href } = this.$router.resolve({path:'/setting/protocol'});
      window.open(href, '_blank');
    },
    formatInput() {
      this.$nextTick(() => {
      })
    },
    titleFormat() {
      let val = this.subjectInfo.subject_title;
      return val.length < 10 ? val : val.substr(0, 10) + '...'
    },
    // 格式化鉴权格式
    handleFormat() {
      let ret = '';
      if (this.subjectInfo.subject_verify == 1) {
        const verify = this.subjectInfo.parent_verify;
        switch (verify) {
          case 0:
            ret = '免费'
            break;
          case 1:
            ret = '密码'
            break;
          case 2:
            ret = '白名单'
            break;
          case 4:
            ret = '邀请码（原F码）'
            break;
        }
      } else {
        ret = '报名表单'
      }
      return ret;
    },
    // 验证码生成
    fCodeExecute(formName) {
      let errorMsg = '';
      this.$refs[formName].validateField('nums', (msg) => {
        errorMsg = msg;
      });
      if(!errorMsg) {
        this.$fetch('fCodeExecute', {
          webinar_id: this.$route.params.str,
          nums: this[formName].nums
        }).then(res => {
          this.$message({
            message:  `生成成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // this.viewerSetGet();
          // 更新已生成邀请码数量
          this.viewerDao.fcodes = res.data.code_count;
        }).catch(res => {
          console.log(e);
          this.$message({
            message:  res.msg || '生成失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      }
    },
    // 下载邀请码
    downFCodeHandle() {
      this.$fetch('getFCodeExcel', {
        webinar_id: this.$route.params.str
      }).then(res => {
        this.$message({
          message:  `邀请码下载申请成功，请去下载中心查看`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        console.log(res);
        this.$message({
          message:  res.msg || '邀请码下载申请失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    initPage() {
      this.viewerSetGet();
      this.audienceGet();
    },
    // 获取基本信息
    getLiveDetail() {
      // webinar/info调整-与活动状态无关的调用
      return this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
        this.liveDetailInfo = res.data;
        console.log(this.liveDetailInfo)
      }).catch(res=>{
        console.log(res);
        this.liveDetailInfo = {};
        this.$message({
          message: res.msg,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }).finally(()=>{
      });
    },
    // 打开弹框
    openDialog(data){
      this.visible = true;
      this.showText = data;
      this.stash = '';
      this.showPwd = false;
    }
  },
  created() {
    this.getLiveDetail(); // 获取活动信息，知晓是否设置过报名表单
    this.initPage();
  },
  // beforeDestroy() {
  //   if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
  // },
  // mounted() {
  //   this.handleLowerGradeHeart()
  // }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.pl10{
  padding-left: 10px;
}
.cursor{
  cursor: pointer;
}
.mt30{
  margin-top: 30px;
}
.fontStyle{
  font-size: 14px;
  color: #999999;
}
.address{
  position: relative;
  top: -1px;
  /deep/ span.el-switch__core{
    width: 28px!important;
    height: 16px!important;
    border-radius: 10px!important;
  }
  /deep/ span.el-switch__core:after {
    width: 12px;
    height: 12px;
    background: #fff;
  }
}
/deep/ .el-switch.is-checked .el-switch__core::after {
  margin-left: -13px !important;
}
.pr{
  position: relative;
}
.inputIcon{
  position: absolute;
  right: 10px;
  top: 0px;
  display: inline-block;
  height: 16px;
  background: #fff;
  text-align: right;
}
.setting_detail{
  color: #3562FA;
  cursor: pointer;
  font-size: 14px;
}
.limit_detail{
  font-size: 14px;
  color: #999;
  span{
    color: #3562fa;
    cursor: pointer;
  }
}
.viewer-rules {
  padding: 49px 56px 40px 56px;
  /deep/.el-radio__inner{
    width: 16px;
    height: 16px;
    &::after{
      width: 8px;
      height: 8px;
    }
  }
  /deep/.el-radio__label {
    font-size: 14px;
    font-weight: 400;
    font-family: @fontRegular;
    color: #1A1A1A;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
  }
}
.viewer-rules_container{
  min-height: 544px;
  .layout--right--main();
}
.viewer-rules-content {
  margin-top: 32px;
  /*height: 353px;*/
  /deep/.el-form-item {
    i{
      font-style: normal;
      padding: 0 10px;
      color: #1a1a1a;
      font-size: 14px;
      font-family: @fontRegular;
    }
  }
   /deep/.el-input-group__append {
      width: 52px!important;
      height: 38px;
      background: #F7F7F7;
      border-radius: 0 4px 4px 0;
      position: absolute;
      right: 1px;
      top: 1px;
      line-height: 38px;
      text-align: center;
      padding: 0 0;
      margin: 0 0;
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      border: 0;
      span{
        font-size: 14px;
        color: #666666;
      }
    }
  /deep/.el-form-item__label {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
  }
  /deep/.el-input {
    width: 320px;
  }
  /deep/.el-input__inner {
    height: 40px;
  }
  /deep/.el-form-item {
    margin-bottom: 24px;
  }
  /deep/.el-form-item.switch__height {
    margin-bottom: 16px;
    /deep/.el-form-item__label {
      height: 20px;
      line-height: 20px;
    }
    /deep/.el-form-item__content {
      height: 20px;
      line-height: 20px;
    }
  }
}
.viewer-rules-ctx--0 {
  p {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
}
.viewer-rules-ctx--3 {
  /deep/.el-input {
    width: 320px;
  }
  /deep/.el-input__inner {
    height: 40px;
    border-radius: 4px;
  }
  /deep/.el-input-group__append {
    width: 38px;
    text-align: center;
    border: 0;
    background: #ffffff;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
    padding: 0 0;
  }
  .rules-ctx-inline {
    width: 320px;
    height: 40px;
    border-radius: 4px;
    border: 1px solid #CCCCCC;
    line-height: 40px;
    /deep/.el-input {
      width: calc(100% - 38px);
      display: inline-block;
      vertical-align: middle;
      margin-top: -4px;
      color: #999999;
    }
    /deep/.el-input__inner {
      border: 0;
      padding: 0 12px;
      margin-right: 12px;
    }
    .ctx-span {
      width: 38px;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      margin-top: -4px;
    }
    &:hover {
      border-color: #999999;
      /deep/.el-input {
        color: #999999;
      }
    }
    &:active {
      border-color: #CCCCCC;
      /deep/.el-input {
        color: #1A1A1A;
      }
    }
    &.is-disabled {
      border-color: #E6E6E6;
      cursor: not-allowed;
      /deep/.el-input {
        color: #B3B3B3;
      }
    }
    &.invalid {
      border-color: #FB3A32;
      /deep/.el-input {
        color: #FB3A32;
      }
    }
  }
}
.viewer-rules-ctx--4, .viewer-rules-ctx--6, .viewer-rules-ctx--1 {
  /deep/.el-input {
    width: 320px;
  }
  /deep/.el-input__inner {
    height: 40px;
    border-radius: 4px;
  }
  /deep/.el-input-group__append {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
  }
  .inline-count {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1A1A1A;
    line-height: 20px;
    margin-left: 8px;
    margin-right: 24px;
    strong {
      color: #FB3A32;
      margin: 0 8px;
    }
  }
}
.viewer-rules-ctx--2 {
  .tab__white {
    li {
      display: inline-block;
      list-style-type: none;
      text-align: center;
      padding: 3px 16px;
      margin-right: 12px;
      line-height: 24px;
      background: #F7F7F7;
      border-radius: 16px;
      &:last-child {
        background: #ffffff;
        /* display: block; */
        text-align: left;
        padding: 3px 16px 3px 0;
      }
      span {
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #666666;
        line-height: 24px;
      }
    }
  }
  .tab__btn--solid {
    border: 1px solid #F7F7F7;
    cursor: pointer;
    &.active,&:hover{
      background: #FFEBEB;
      border-color: #FFEBEB;
      span {
        color: #FB3A32;
      }
    }
  }
  i.el-icon-plus {
    margin-right: 3px;
    padding: 0;
    color: #FB3A32;
  }
  /* .tab__btn--dashed {
    border-radius: 16px;
    border: 1px solid #FB3A32;
    a {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #FB3A32;
      line-height: 24px;
      i {
        margin-right: 3px;
      }
    }
  } */
}
/deep/.btn-relative {
  position: relative;
  .el-input__inner {
    padding: 0 36px 0 12px;
  }
  /deep/.el-input-group__append {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 20px!important;
  }
  &.no-border{
    /deep/.el-input-group__append {
      border: 1px solid #ffffff;
      background: transparent;
    }
  }
  // &.btn-two {
    /deep/.el-input-group__append {
      width: 52px!important;
      height: 38px;
      background: #F7F7F7;
      border-radius: 0 4px 4px 0;
      position: absolute;
      right: 1px;
      top: 1px;
      line-height: 38px;
      text-align: center;
      padding: 0 0;
      margin: 0 0;
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      border: 0;
    }
  // }
}
/deep/.saasicon_help_m {
  color: #999999;
}

/deep/.el-select-dropdown__list .el-select-dropdown__item {
  max-width: 100%;
}
.color1a1a1a{
  color: #1A1A1A;
  font-size: 14px;
}
.button_size{
  padding: 0 !important;
  width: 60px;
  height: 32px;
}
.changeIconCol:hover{
  .el-icon-plus{
    color: white;
  }
}
.pr60 /deep/.el-input__inner{
  padding-right: 65px !important;
}
.limit_tip{
  font-size: 14px;
  line-height: 22px;
  .color_blue{
    color: #3562fa;
    cursor: pointer;
  }
  .color_red{
    color: #FB3A32;
  }
}
</style>
