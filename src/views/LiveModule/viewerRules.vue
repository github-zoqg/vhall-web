<template>
  <div>
    <pageTitle title="观看限制">
      <div slot="content">
        可联系客服开通“单点观看”功能，即开启付费/邀请码/白名单后，一个账号仅允许同时一台设备观看直播。
      </div>
    </pageTitle>
    <!-- 内容区域 -->
    <div class="viewer-rules">
      <el-radio-group v-model="form.verify" @change="handleClick">
        <el-radio :label="0">免费</el-radio>
        <el-radio :label="3">付费</el-radio>
        <el-radio :label="4" v-if="perssionInfo.f_code">邀请码（原F码）</el-radio>
        <el-radio :label="6" v-if="perssionInfo.f_code">付费/邀请码</el-radio>
        <el-radio :label="1">密码</el-radio>
        <el-radio :label="2" v-if="perssionInfo.white_list">白名单</el-radio>
      </el-radio-group>
      <!-- 选值区域 -->
      <div class="viewer-rules-content">
        <!-- 免费 0 -->
        <div v-show="Number(form.verify) === 0" class="viewer-rules-ctx--0">
          <p>观看无需任何验证，即可观看直播</p>
        </div>
        <!-- 付费 3 -->
        <div v-show="Number(form.verify) === 3" class="viewer-rules-ctx--3">
          <el-form :model="payForm" ref="payForm" :rules="payFormRules"  label-width="70px">
            <el-form-item label="付费金额" prop="fee">
              <!--<div class="rules-ctx-inline">
                <el-input v-model.trim="payForm.fee" autocomplete="off" placeholder="0.01-99999.99"></el-input>
                <span class="ctx-span">元</span>
              </div>-->
              <VhallInput v-model.trim="payForm.fee" autocomplete="off" placeholder="0.01-99999.99" class="btn-relative no-border" ref="payForm_fee" @input="formatInputs($event, 'payForm', 'fee')">
                <template slot="append">元</template>
              </VhallInput>
            </el-form-item>
            <el-form-item label="试看" class="switch__height">
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
                <VhallInput v-model.trim="fCodeForm.nums" autocomplete="off" placeholder="1-1000个" class="btn-relative btn-two"   @input="formatInputs($event, 'fCodeForm', 'nums')">
                  <el-button type="text" class="no-border" size="mini" slot="append" v-preventReClick @click.prevent.stop="fCodeExecute('fCodeForm')">生成</el-button>
                </VhallInput>
                <span class="inline-count">已生成<strong>{{viewerDao && viewerDao.fcodes ? viewerDao.fcodes : 0}}</strong>个</span>
                <el-button class="down-btn" size="medium" type="white-primary" v-preventReClick round @click="downFCodeHandle">下载邀请码</el-button>
              </div>
            </el-form-item>
            <el-form-item label="试看" class="switch__height">
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
                <template slot="append">元</template>
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
            <el-form-item label="试看" class="switch__height">
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
            <el-form-item label="试看" class="switch__height">
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
            <el-form-item label="选择观众组">
              <ul class="tab__white tab__white__group">
                <li :class="['tab__btn--solid', {'active': whiteId === item.id }]"  v-for="(item, ins) in groupList" :key="`group${ins}`" @click.prevent.stop="selectGroup(item)">
                  <span>{{item.subject}}</span>
                </li>
                <li class="">
                  <router-link :to="{path:'/material/viewer'}"><el-button type="white-primary" size="small" round><i class="el-icon-plus"></i>添加观众组</el-button></router-link>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="试看" class="switch__height">
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
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import env from "@/api/env";
import {formateDate} from "@/utils/general";
import { parse } from 'qs';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: 'viewerRules.vue',
  components: {
    PageTitle
  },
  // 无极版、标准版、新享版 没有邀请码 付费 白名单 试看 权限
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
      viewerDao: {},
      perssionInfo: JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')),
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
      payForm: {
        fee: ''
      },
      payFormRules: {
        fee: [
          { required: false, message: '请按正确格式填写，0.01-99999.99', trigger: 'blur' },
          { pattern: /^\d{0,5}(\.\d{0,2})?$/, message: '请按正确格式填写，0.01-99999.99' , trigger: 'blur'},
          { validator: checkFee, trigger: 'blur' }
        ]
      },
      fCodeForm: {
        nums: ''
      },
      fCodeFormRules: {
        nums: [
          { required: false, message: '邀请码数量1-1000', trigger: 'blur' },
          { pattern: /^(1000|[1-9][0-9]{0,2})$/, message: '邀请码数量1-1000' , trigger: 'blur'},
          { validator: checkNums, trigger: 'blur' }
        ]
      },
      fCodePayForm: {
        nums: '',
        fee: null
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
      pwdForm: {
        password: null
      },
      pwdFormRules: {
        password: [
          { required: false, message: '密码只能由1-12位数字或字母组成', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]{1,12}$/, message: '密码只能由1-12位数字或字母组成' , trigger: 'blur'},
          { validator: checkPwd, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
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
         this.viewerDao = res.data;
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
          this.whiteId = verify === 2 ? white_id : null;
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
        flag = this.whiteId !== null && this.whiteId !== undefined && this.whiteId !== '';
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
          preview_time: this.form.preview_time
        }
      } else if (formName === '') {
        flag = true; // 免费不验证
        params = {
          webinar_id: this.$route.params.str,
          verify: 0
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
    sendViewerSetSave(params) {
      this.$fetch('viewerSetSave', this.$params(params)).then(res => {
        console.log(res);
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
          type: 'error',
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
    formatInput() {
      this.$nextTick(() => {
      })
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
    getLiveDetail(id) {
      this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
        this.liveDetailInfo = res.data;
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
  },
  created() {
    this.getLiveDetail(); // 获取活动信息，知晓是否设置过报名表单
    this.initPage();
  }
};
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.viewer-rules {
  .layout--right--main();
  min-height: 544px;
  padding: 49px 56px 40px 56px;
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
.viewer-rules-content {
  margin-top: 32px;
  /*height: 353px;*/
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
    margin-bottom: 32px;
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
  .down-btn {
    /* width: 118px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid #FB3A32;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #FB3A32;
    line-height: 20px;
    text-align: center;
    padding: 0 0; */
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
  &.btn-two {
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
  }
}
/deep/.saasicon_help_m {
  color: #999999;
}
</style>
