<template>
  <div
    class="son--list"
    v-loading="loading"
    element-loading-text="加载中，请稍候"
    element-loading-background="rgba(255,255,255,.9)"
  >
    <!-- 全部无结果 -->
    <div
      class="all-no-data"
      v-if="sonDao && sonDao.total === 0 && query.role_id === '' && query.keyword === ''"
    >
      <null-page nullType="nullData" text="暂未创建子账号" :height="0">
        <el-button type="primary" round v-preventReClick @click.prevent.stop="addSonShow(null)">
          创建子账号
        </el-button>
      </null-page>
    </div>
    <!-- 全部有结果 -->
    <div class="all-yes-data" v-else>
      <!-- 搜索 -->
      <div class="list--search">
        <el-button
          size="medium"
          type="primary"
          :disabled="isForbidCreate"
          round
          @click.prevent.stop="addSonShow(null)"
        >
          创建
        </el-button>
        <!-- 若当前是知学云账号，不展示用量分配按钮, extends_remark 为1时表示 知学云账号-->
        <el-button
          v-show="userInfo.user_extends.extends_remark == 0"
          size="medium"
          plain
          round
          @click.prevent.stop="toAllocationPage"
        >
          用量分配
        </el-button>
        <el-button
          size="medium"
          round
          @click.prevent.stop="multiMsgDel"
          :disabled="!(this.ids && this.ids.length > 0)"
        >
          批量删除
        </el-button>
        <el-button size="medium" round @click="downloadHandle">导出</el-button>
        <VhallInput
          placeholder="搜索账号/昵称/手机号码"
          v-model="query.keyword"
          clearable
          @clear="initQuerySonList"
          class="search-query"
          @input="checkoutList"
          v-clearEmoij
          @keyup.enter.native="initQuerySonList"
        >
          <i class="el-icon-search el-input__icon" slot="prefix" @click="initQuerySonList"></i>
        </VhallInput>
        <el-select
          placeholder="全部"
          round
          v-model="query.role_id"
          @change="initQuerySonList"
          style="width: 102px"
        >
          <el-option value="">全部</el-option>
          <el-option
            v-for="item in roleList"
            :key="'v_' + item.id"
            :label="item.role_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <!-- 有消息内容 -->
      <div v-if="sonTableColumn.length > 0">
        <!-- 表格与分页 -->
        <table-list
          ref="sonTab"
          :isHandle="true"
          :manageTableData="sonDao.list || []"
          :tabelColumnLabel="sonTableColumn"
          :totalNum="sonDao.total || 0"
          :tableRowBtnFun="tableRowBtnFun"
          :needPagination="true"
          width="150px"
          max-height="auto"
          scene="accountList"
          @getTableList="getSonList"
          @changeTableCheckbox="checkMoreRow"
          @onHandleBtnClick="onHandleBtnClick"
        ></table-list>
      </div>
      <!-- 无消息内容 -->
      <null-page class="search-no-data" :height="0" v-if="sonDao && sonDao.total === 0"></null-page>
    </div>
    <!-- 添加/ 观众子账号 -->
    <VhallDialog
      class="sonAdd"
      :title="sonDialog.title"
      :visible.sync="sonDialog.visible"
      style="overflow: hidden"
      :before-close="handleClose"
      width="460px"
    >
      <el-scrollbar
        :style="{ height: sonDialog.type === 'edit' || sonForm.is_batch == 0 ? 'auto' : '374px' }"
      >
        <!-- 创建子账号（开启-424；关闭374px） -->
        <el-form
          :model="sonForm"
          ref="sonForm"
          :rules="sonFormRules"
          :label-width="sonDialog.formLabelWidth"
          :class="{
            more: sonDialog.type === 'add' && sonForm.is_batch != 0,
            'edit-mini': sonDialog.type === 'edit'
          }"
        >
          <el-form-item
            label="批量创建"
            prop="is_batch"
            v-if="sonDialog.type === 'add'"
            class="switch--item"
          >
            <div class="switch__box">
              <el-switch
                v-model="sonForm.is_batch"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                @change="sonCountGetHandle"
              ></el-switch>
              <span class="leve3_title title--999" v-if="sonForm.is_batch">
                生成子账号的昵称、密码、角色一致
              </span>
            </div>
          </el-form-item>
          <el-form-item label="账号数量" v-if="sonForm.is_batch" prop="nums" class="account--nums">
            <VhallInput v-model.trim="sonForm.nums" autocomplete="off"></VhallInput>
            <span>
              可创建
              <strong>{{ sonCountVo.available_num }}</strong>
              个
            </span>
          </el-form-item>
          <el-form-item label="账号昵称" prop="nick_name">
            <VhallInput
              type="text"
              placeholder="请输入昵称，默认使用账号ID"
              autocomplete="off"
              v-model="sonForm.nick_name"
              :maxlength="30"
              show-word-limit
            ></VhallInput>
          </el-form-item>
          <el-form-item label="预设密码" prop="password" v-if="sonDialog.type === 'add'">
            <pwd-input
              type="password"
              v-model.trim="sonForm.password"
              auto-complete="off"
              placeholder="包含大小写字母,数字在内的6-30个字符"
              :maxlength="30"
              :minlength="6"
              show-word-limit
            ></pwd-input>
          </el-form-item>
          <el-form-item label="预设密码" prop="editPwd" v-else>
            <pwd-input
              type="password"
              v-model.trim="sonForm.editPwd"
              auto-complete="off"
              placeholder="包含大小写字母,数字在内的6-30个字符"
              :maxlength="30"
              show-word-limit
            ></pwd-input>
          </el-form-item>
          <el-form-item label="账号角色" prop="role_id">
            <el-select placeholder="请选择角色" round v-model="sonForm.role_id">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.role_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号码" class="no-execute">
            <VhallInput
              v-model.trim="sonForm.phone"
              autocomplete="off"
              :placeholder="phonePlaceholder"
              class="btn-relative"
              :maxlength="30"
              disabled
              v-if="sonDialog.type !== 'add'"
            >
              <el-button
                class="no-border"
                type="text"
                size="mini"
                slot="append"
                @click="resetPhoneOrEmail('phone', isReset.phone)"
              >
                {{ isReset.phone ? '取消重置' : '重置' }}
              </el-button>
            </VhallInput>
            <VhallInput
              v-model.trim="sonForm.phone"
              autocomplete="off"
              :placeholder="phonePlaceholder"
              class="btn-relative"
              :maxlength="30"
              disabled
              v-else
            ></VhallInput>
          </el-form-item>
          <el-form-item label="邮箱地址" class="no-execute">
            <VhallInput
              v-model.trim="sonForm.email"
              autocomplete="off"
              :placeholder="emailPlaceholder"
              class="btn-relative"
              :maxlength="30"
              disabled
              v-if="sonDialog.type !== 'add'"
            >
              <el-button
                v-show="sonDialog.type !== 'add'"
                class="no-border"
                type="text"
                size="mini"
                slot="append"
                @click="resetPhoneOrEmail('email', isReset.email)"
              >
                {{ isReset.email ? '取消重置' : '重置' }}
              </el-button>
            </VhallInput>
            <VhallInput
              v-model.trim="sonForm.email"
              autocomplete="off"
              :placeholder="emailPlaceholder"
              class="btn-relative"
              :maxlength="30"
              disabled
              v-else
            ></VhallInput>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-preventReClick
          @click="sonSaveSend('sonForm')"
          size="medium"
          round
        >
          确 定
        </el-button>
        <el-button @click="handleClose" size="medium" round>取 消</el-button>
      </div>
    </VhallDialog>
    <!-- 添加子账号 -->
  </div>
</template>

<script>
  import NullPage from '../../PlatformModule/Error/nullPage.vue';
  import { sessionOrLocal } from '@/utils/utils';
  import PwdInput from './pwdInput.vue';
  export default {
    name: 'sonList.vue',
    components: {
      NullPage,
      PwdInput
    },
    props: {
      vipType: {
        type: [Number, String],
        default: 0
      }
    },
    created() {
      const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      this.userInfo = userInfo;
    },
    data() {
      let verifyEnterPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        } else if (!regRule['pwd'].exec(value)) {
          callback(new Error('包含大小写字母,数字在内的6-30个字符'));
        } else {
          callback();
        }
      };
      let verifyEnterEditPwd = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (!regRule['pwd'].exec(value)) {
          callback(new Error('包含大小写字母,数字在内的6-30个字符'));
        } else {
          callback();
        }
      };
      return {
        userInfo: {},
        pwdType: 'text',
        loading: false,
        query: {
          role_id: '',
          keyword: '',
          pos: 0,
          limit: 1000,
          pageNumber: 1
        },
        roleList: [],
        sonDao: {
          total: 0,
          list: []
        },
        sonCountVo: {},
        isHandle: false, // 是否有操作项
        tableRowBtnFun: [
          {
            name: '详情',
            methodName: 'toSonDetail'
          },
          {
            name: '编辑',
            methodName: 'editSonShow'
          },
          {
            name: '删除',
            methodName: 'sonDel'
          }
        ],
        ids: [],
        // 创建子账号与编辑子账号
        sonDialog: {
          visible: false,
          title: '添加观众',
          type: 'add',
          row: null,
          formLabelWidth: '78px'
        },
        sonForm: {
          is_batch: 0,
          nums: null,
          nick_name: '',
          password: '',
          editPwd: '',
          role_id: '',
          phone: '',
          email: ''
        },
        sonFormRules: {
          nick_name: [
            { required: false, message: '请输入账号昵称，不输入默认使用账号ID', trigger: 'blur' }
          ],
          password: [{ required: true, trigger: 'blur', validator: verifyEnterPwd }],
          editPwd: [{ required: false, trigger: 'blur', validator: verifyEnterEditPwd }],
          role_id: [{ required: true, message: '请输入账号角色', trigger: 'change' }],
          nums: [{ required: true, message: '请填写账号数量', trigger: 'blur' }]
        },
        isReset: {
          phone: false,
          email: false
        },
        cacheForm: {
          phone: '',
          email: ''
        }
      };
    },
    methods: {
      checkoutList(newValue) {
        if (!newValue) {
          this.initQuerySonList();
        }
      },
      handleClose() {
        // console.log(1111111)
        this.isReset = {
          phone: false,
          email: false
        };
        this.sonDialog.visible = false;
      },
      // 表格操作列回调函数， val表示每行
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      // 跳转消息详情页
      toSonDetail(that, { rows }) {
        that.$vhall_paas_port({
          k: 100814,
          data: {
            business_uid: that.$parent.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        that.$router.push({
          path: `/sonDetail/${rows.child_id}`
        });
      },
      // 跳转到用量分配
      toAllocationPage() {
        // 1表示并发
        this.$vhall_paas_port({
          k: 100816,
          data: {
            business_uid: this.$parent.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$router.push({
          path: `/allocation`
        });
      },
      // 批量选择
      checkMoreRow(val) {
        console.log(val);
        this.ids = val.map(item => {
          return item.child_id;
        });
      },
      // 批量删除
      multiMsgDel() {
        if (!(this.ids && this.ids.length > 0)) {
          this.$message({
            message: `请至少选择一条子账号信息删除`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          this.sonDel(
            this,
            {
              rows: {
                child_id: this.ids.join(',')
              }
            },
            1
          );
        }
      },
      downloadHandle() {
        let params = {
          role_id: this.query.role_id,
          keyword: this.query.keyword,
          pos: 0,
          limit: 999999 // TODO 跟大龙确定，传值大于0，后台下载依然是所有符合条件的全部数据
        };
        this.$fetch('sonChildExport', params)
          .then(res => {
            this.$vhall_paas_port({
              k: 100809,
              data: {
                business_uid: this.$parent.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: '下载申请成功，请去下载中心下载该项！',
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '下载申请失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 获取子账号个数
      sonCountGetHandle() {
        this.$fetch('sonCountGet', {})
          .then(res => {
            this.sonCountVo = res.data || {};
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '获取子账号个数失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.sonCountVo = {};
          });
      },
      // 删除单条消息数据
      sonDel(that, { rows }, index) {
        that
          .$confirm('正在直播或有未提现收益的账号不会被删除，确定删除？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
          .then(() => {
            that
              .$fetch('sonDel', {
                child_ids: rows.child_id
              })
              .then(res => {
                that.$vhall_paas_port({
                  k: index === 1 ? 100813 : 100812,
                  data: {
                    business_uid: that.$parent.userId,
                    user_id: '',
                    webinar_id: '',
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                that.$message({
                  message: '删除成功',
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                that.ids = [];
                try {
                  that.$refs.sonTab.clearSelection();
                } catch (e) {
                  console.log(e);
                }
                that.initQuerySonList();
                // 通知父级头部更新
                that.$emit('load');
              })
              .catch(res => {
                console.log(res);
                that.$message({
                  message: res.msg || '删除失败',
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          })
          .catch(() => {});
      },
      // 新增子账号
      addSonShow() {
        try {
          if (this.$refs.sonForm) {
            this.$refs.sonForm.resetFields();
          }
        } catch (e) {
          console.log(e);
        }
        this.sonDialog.type = 'add';
        this.sonDialog.title = '添加子账号';
        this.sonDialog.row = null;
        this.$set(this.sonForm, 'isMulti', false);
        this.$set(this.sonForm, 'nick_name', '');
        this.$set(this.sonForm, 'password', '');
        this.$set(this.sonForm, 'roleType', '');
        this.$set(this.sonForm, 'phone', '');
        this.$set(this.sonForm, 'email', '');
        this.sonDialog.visible = true;
      },
      // 编辑子账号
      editSonShow(that, { rows }) {
        try {
          if (that.$refs.sonForm) {
            that.$refs.sonForm.resetFields();
          }
        } catch (e) {
          console.log(e);
        }
        that.sonDialog.type = 'edit';
        that.sonDialog.title = '修改子账号';
        that.sonDialog.row = rows;
        that.$set(that.sonForm, 'is_batch', rows.is_batch);
        that.$set(that.sonForm, 'nick_name', rows.nick_name);
        that.$set(that.sonForm, 'password', '');
        that.$set(that.sonForm, 'role_id', rows.role_id || '');
        that.$set(that.sonForm, 'role_name', rows.role_name);
        that.$set(that.sonForm, 'nums', rows.nums);
        that.$set(that.sonForm, 'phone', rows.phone);
        that.$set(that.sonForm, 'email', rows.email);
        that.sonDialog.visible = true;
      },
      // 添加子账号 or 修改子账号
      sonSaveSend() {
        this.$refs.sonForm.validate(valid => {
          if (valid) {
            console.log('新增 or 修改子账号：' + JSON.stringify(this.sonForm));
            // 判断子账号个数, 批量验证输入个数。
            if (
              this.sonForm.is_batch &&
              Number(this.sonForm.nums) > Number(this.sonCountVo.available_num)
            ) {
              this.$message({
                message: '超过当前可创建的子账号数量',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return;
            }
            let params = null;
            this.$vhall_paas_port({
              k: this.sonDialog.type === 'add' ? 100806 : 100811,
              data: {
                business_uid: this.$parent.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });

            this.$vhall_paas_port({
              k: this.sonForm.is_batch ? 100807 : 100808,
              data: {
                business_uid: this.$parent.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            if (this.sonDialog.type === 'add') {
              params = this.$params({
                is_batch: this.sonForm.is_batch,
                nums: this.sonForm.nums,
                nick_name: this.sonForm.nick_name,
                password: this.sonForm.password,
                role_id: this.sonForm.role_id,
                phone: this.sonForm.phone,
                email: this.sonForm.email
              });
            } else {
              params = Object.assign(
                {
                  id: this.sonDialog.row.id,
                  child_id: this.sonDialog.row.child_id
                },
                this.$params({
                  is_batch: this.sonForm.is_batch,
                  nums: this.sonForm.nums,
                  nick_name: this.sonForm.nick_name,
                  password: this.sonForm.editPwd,
                  role_id: this.sonForm.role_id
                }),
                {
                  phone: this.sonForm.phone,
                  email: this.sonForm.email
                }
              );
            }
            this.$fetch(this.sonDialog.type === 'add' ? 'sonAdd' : 'sonEdit', params)
              .then(res => {
                this.$message({
                  message: `${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作成功`,
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                this.handleClose();
                // 新增成功后，重查列表
                this.initQuerySonList();
                // 通知父级头部更新
                this.$emit('load');
              })
              .catch(res => {
                console.log(res);
                this.$message({
                  message:
                    res.msg ||
                    `${this.sonDialog.type === 'add' ? '添加子账号' : '修改子账号'}操作失败`,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      // 获取列表数据
      getSonList(row) {
        if (row) {
          this.query.pos = row.pos;
          this.query.pageNumber = row.pageNum;
        }
        let params = {
          role_id: this.query.role_id,
          // user_id: sessionOrLocal.get('userId'),
          pos: this.query.pos,
          limit: this.query.limit,
          keyword: this.query.keyword,
          scene_id: 1 // 场景id：1子账号列表 2用量分配获取子账号列表
        };
        this.loading = true;
        this.$fetch('getSonList', this.$params(params))
          .then(res => {
            this.loading = false;
            let dao =
              res && res.code === 200 && res.data
                ? res.data
                : {
                    total: 0,
                    list: []
                  };
            (dao.list || []).map(item => {
              if (this.vipType === 1) {
                if (this.userInfo.user_extends.extends_remark == 1 && item.is_dynamic == 2) {
                  // 知学云 -固定 - 流量（XXXGB）
                  item.round = `流量（${item.vip_info.flow}GB）`;
                } else {
                  if (item.is_dynamic > 0) {
                    // 流量动态
                    item.round = `流量动态`;
                  } else {
                    // 流量（XXXGB）
                    item.round = `流量（${item.vip_info.flow}GB）`;
                  }
                }
              } else if (this.vipType === 0) {
                if (this.userInfo.user_extends.extends_remark == 1 && item.is_dynamic == 2) {
                  // 知学云 - 固定 - 并发（xxx方 + （扩展包xxxxx）方）
                  if (item.vip_info.extend_day > 0) {
                    // 并发（XXX方）
                    item.round = `并发（${
                      Number(item.vip_info.total) + Number(item.vip_info.extend_day)
                    }方）`;
                  } else {
                    // 并发（XXX方）
                    item.round = `并发（${item.vip_info.total}方）`;
                  }
                } else {
                  if (item.is_dynamic > 0) {
                    // 流量动态
                    item.round = `并发动态`;
                    item.extend_day = `并发动态`;
                  } else {
                    if (item.vip_info.extend_day > 0) {
                      // 并发（XXX方）
                      item.round = `并发（${
                        Number(item.vip_info.total) + Number(item.vip_info.extend_day)
                      }方）`;
                    } else {
                      // 并发（XXX方）
                      item.round = `并发（${item.vip_info.total}方）`;
                    }
                  }
                }
              } else if (this.vipType === 2) {
                item.round = `时长（${item.vip_info.duration}分钟）`;
              }
              if (this.userInfo.user_extends.extends_remark != 1) {
                if (item.is_dynamic > 0) {
                  // 短信动态
                  item.sms = `动态分配`;
                } else {
                  // 短信（XXX条）
                  item.sms = `${item.vip_info.sms || 0}条`;
                }
              }
              // item.round = `${item && item.vip_info && item.vip_info.type > 0 ? '流量' : '并发' }（${item && item.is_dynamic > 0 ? '动态' : item.vip_info.type > 0 ? `${item.vip_info.total_flow}GB` : `${item.vip_info.total}方`}）`;
            });
            this.sonDao = dao;
            this.sonCountGetHandle();
          })
          .catch(e => {
            this.loading = false;
            console.log(e);
            this.sonDao = {
              total: 0,
              list: []
            };
          });
      },
      // 查询所有可选择角色列表，加上默认最多可查询出11个
      getRoleList() {
        this.$fetch('sonRoleList', {
          role_name: '',
          pos: 0,
          limit: 500
        })
          .then(res => {
            console.log(res && res.code === 200 && res.data && res.data.list);
            if (res && res.code === 200 && res.data) {
              this.roleList = res.data.list || [];
            } else {
              this.roleList = [];
            }
          })
          .catch(e => {
            console.log(e);
            this.roleList = [];
          });
      },
      // 重置选项
      resetPhoneOrEmail(type, status) {
        this.isReset[type] = !status;
        if (status) {
          // 如果是取消重置
          this.sonForm[type] = this.cacheForm[type];
          this.cacheForm[type] = '';
        } else {
          // 如果是重置
          this.cacheForm[type] = this.sonForm[type];
          this.sonForm[type] = '';
        }
      },
      initComp() {
        this.getRoleList(); // 获取可选角色列表
        this.initQuerySonList();
      },
      initQuerySonList() {
        if (this.query.keyword) {
          this.$vhall_paas_port({
            k: 100810,
            data: {
              business_uid: this.$parent.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.query.pos = 0;
        this.query.pageNumber = 1;
        this.query.limit = 10;
        // 表格切换到第一页
        try {
          this.$refs.sonTab.pageInfo.pageNum = 1;
          this.$refs.sonTab.pageInfo.pos = 0;
        } catch (e) {
          console.log(e);
        }
        this.getSonList();
      }
    },
    computed: {
      phonePlaceholder() {
        if (this.isReset.phone) return '手机号已重置，保存后生效';
        return this.sonForm.phone ? '' : '登录后自行绑定，父账号允许重置';
      },
      emailPlaceholder() {
        if (this.isReset.email) return '邮箱已重置，保存后生效';
        return this.sonForm.email ? '' : '登录后自行绑定，父账号允许重置';
      },
      isForbidCreate() {
        return this.sonCountVo.available_num == 0;
      },
      sonTableColumn() {
        const tableColumns = [
          {
            label: '账号',
            key: 'name',
            width: 'auto'
          },
          {
            label: '昵称',
            key: 'nick_name',
            width: 'auto',
            customTooltip: true
          },
          {
            label: '手机号码',
            key: 'phone',
            width: 'auto'
          },
          {
            label: '角色',
            key: 'role_name',
            width: 'auto'
          },
          {
            label: '用量分配',
            key: 'round',
            width: 'auto'
          }
        ];
        if (this.showSmsModule) {
          tableColumns.push({
            label: '短信分配',
            key: 'sms',
            width: 'auto'
          });
        }
        return tableColumns;
      },
      showSmsModule: function () {
        const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
        const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))[
          'message_notice'
        ];
        // 不是知学云账号 & 开启了 短信通知配置项权限
        return userInfo.user_extends.extends_remark != 1 && isNoticeMessage == 1;
      }
    }
  };
</script>
<style lang="less" scoped>
  // 初始化查询子账号列表信息
  /deep/.all-no-data {
    /* 基于外边框已经有距离： padding: 24px 24px 40px 24px; */
    padding-top: 30px;
    margin-top: 110px;
    .createActive {
      padding-bottom: 30px;
    }
  }
  /deep/.all-yes-data {
    padding: 24px 24px 40px 24px;
    .data-list {
      .el-table {
        margin-bottom: 40px;
        .cell {
          line-height: 25px;
        }
      }
    }
  }
  /deep/.search-no-data {
    padding-top: 148px;
    .search {
      padding-bottom: 0;
    }
  }
  /deep/.list--search {
    margin-bottom: 20px;
    .el-select {
      width: 100px;
      float: right;
      margin-right: 20px;
      .el-input__inner {
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
      .el-select__caret.el-input__icon.el-icon-arrow-up {
        line-height: 36px;
      }
    }
    .el-input {
      width: 220px;
      float: right;
      .el-input__icon {
        line-height: 36px;
      }
      .el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 30px !important;
      }

      .el-input__prefix {
        cursor: pointer;
      }
    }
  }
  /deep/.el-form-item.switch--item {
    margin-bottom: 14px;
  }
  /deep/.el-form-item.account--nums {
    .el-input {
      width: 210px;
      margin-right: 12px;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 20px;
    }
    strong {
      color: #fb3a32;
    }
  }
  /deep/.no-execute {
    .el-input.is-disabled .el-input__inner {
      background-color: #f7f7f7;
      border-color: #cccccc;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      cursor: not-allowed;
    }
    .el-input-group__append {
      background-color: #f7f7f7;
      border-color: #cccccc;
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      border-left: 0;
      cursor: not-allowed;
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      &:hover {
        color: #3562fa;
      }
    }
  }
  /deep/.sonAdd {
    /* .el-dialog__body {
    height: 374px;
    overflow-y: auto;
  } */
    .el-dialog__body {
      padding: 0 0;
    }
    .el-form-item__content {
      width: 316px;
    }
    .el-form {
      display: flex;
      margin: 0 32px;
      flex-wrap: wrap;
      height: 374px;
      &.more {
        height: 424px;
      }
      &.edit-mini {
        margin: 0 32px 54px 32px;
        height: 320px;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-dialog__footer {
      padding: 0 32px 24px 32px;
    }
  }
</style>
