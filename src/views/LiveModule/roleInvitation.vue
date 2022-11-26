<template>
  <div>
    <pageTitle pageTitle="角色邀请">
      <div slot="content">
        1、互动直播中，通过网页端和客户端登录的主持人和嘉宾，都可以进行连麦互动；
        <br />
        2、权限控制可调整嘉宾和助理在直播中的功能；
        <br />
        3、拥有文档管理权限后，只有拥有演讲权限的人才可进行文档演示、调整观看布局、涂鸦等操作；
        <br />
      </div>
      <div class="switch__box">
        <el-switch
          class="el-role-switch"
          v-model="roleSwitch"
          :active-value="1"
          :inactive-value="0"
          @change="updateSwitch"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          :active-text="
            roleSwitch > 0 ? `已开启，支持邀请特殊角色加入直播` : `开启后，支持邀请特殊角色加入直播`
          "
        ></el-switch>
      </div>
    </pageTitle>
    <!-- 角色邀请卡片 -->
    <div :class="!roleSwitch ? 'role-card-list pre--full-mask' : 'role-card-list'">
      <div class="pre--full-cover" v-show="!roleSwitch"></div>
      <div class="role-card-wrap">
        <!-- 主持人 -->
        <div class="role-card" v-if="webinarVo.webinar_type != 5">
          <div class="role-card-head">
            <div class="title--box">
              <label class="title--label role1">主持人</label>
            </div>
            <p class="role-remark">
              昵称支持自定义，默认为主持人，主持人可发起直播，进行推流、文档演示等操作
            </p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <VhallInput
                :value="privilegeVo && host_join_link ? host_join_link : ''"
                readonly
                autocomplete="off"
              ></VhallInput>
            </el-form-item>
            <el-form-item label="口令">
              <VhallInput
                v-model.trim="privilegeVo.host_password"
                readonly
                class="btn-relative btn-two"
                autocomplete="off"
              >
                <el-button
                  type="text"
                  class="no-border no-hover"
                  size="mini"
                  slot="append"
                  v-preventReClick
                  @click="privilegeShowHandle(2, 'host_password')"
                >
                  编辑
                </el-button>
              </VhallInput>
            </el-form-item>
            <el-form-item label="角色名称">
              <VhallInput
                v-model.trim="customRoleNameInfo.host"
                readonly
                class="btn-relative btn-two"
                autocomplete="off"
              >
                <el-button
                  type="text"
                  class="no-border no-hover"
                  size="mini"
                  slot="append"
                  v-preventReClick
                  @click="setCustomRoleName(1)"
                >
                  编辑
                </el-button>
              </VhallInput>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>主持人权限</label>
            </div>
            <div class="role-qx-list">主持人作为主办方，拥有最高权限</div>
          </div>
          <div>
            <el-button
              type="primary"
              round
              v-preventReClick
              @click.prevent="copy(urlText1, 1)"
              class="copy-text"
            >
              邀请
            </el-button>
          </div>
        </div>
        <div v-else class="role-card">
          <div class="no-timing">
            <img src="../../common/images/roleTime@2x.png" alt="" />
            <p>定时直播不支持发起直播，不支持主持人权限</p>
          </div>
        </div>
        <!-- 嘉宾 -->
        <div
          class="role-card"
          v-if="
            webinarVo &&
            webinarVo.webinar_type != 6 &&
            privilegeVo &&
            privilegeVo.permission_data &&
            guestSortPermission &&
            isInteract == 1
          "
        >
          <div class="role-card-head">
            <div class="title--box">
              <label class="title--label role2">嘉宾</label>
              <el-tooltip v-tooltipMove>
                <div slot="content">
                  1、嘉宾可凭口令进入直播间；
                  <br />
                  2、互动直播中，通过网页端和客户端登录的主持人和
                  <br />
                  <span style="padding-left: 20px">嘉宾，都可以进行连麦；</span>
                  <br />
                  3、每个直播间最多可以登录20位嘉宾；
                  <br />
                  4、直播中无法修改嘉宾权限。
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
            </div>
            <p class="role-remark">
              昵称支持自定义，默认为嘉宾，嘉宾支持连麦，获得主讲人权限后可进行文档演示
            </p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <VhallInput
                :value="privilegeVo && join_link ? join_link : ''"
                readonly
                autocomplete="off"
              ></VhallInput>
            </el-form-item>
            <el-form-item label="口令">
              <VhallInput
                v-model.trim="privilegeVo.guest_password"
                readonly
                class="btn-relative btn-two"
                autocomplete="off"
              >
                <el-button
                  class="no-border no-hover"
                  size="mini"
                  slot="append"
                  @click="privilegeShowHandle(1, 'guest_password')"
                >
                  编辑
                </el-button>
              </VhallInput>
            </el-form-item>
            <el-form-item label="角色名称">
              <VhallInput
                v-model.trim="customRoleNameInfo.guest"
                readonly
                class="btn-relative btn-two"
                autocomplete="off"
              >
                <el-button
                  type="text"
                  class="no-border no-hover"
                  size="mini"
                  slot="append"
                  v-preventReClick
                  @click="setCustomRoleName(2)"
                >
                  编辑
                </el-button>
              </VhallInput>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>嘉宾权限</label>
              <el-button size="mini" round @click="savePremHandle('guest')">保存权限</el-button>
            </div>
            <div class="role-qx-list" v-if="guestSortPermission">
              <!-- <el-checkbox  :value="true" disabled>文档白板</el-checkbox> -->
              <template v-for="(item, key, ins) in guestSortPermission || {}">
                <el-checkbox
                  v-model="item.check"
                  :true-label="1"
                  :false-label="0"
                  :disabled="key == 'white_board'"
                  :key="`guest_${key + ins}`"
                >
                  {{ item.label }}
                </el-checkbox>
              </template>
            </div>
          </div>
          <div>
            <el-button
              type="primary"
              round
              v-preventReClick
              @click="copy(urlText2, 2)"
              class="copy-text"
            >
              邀请
            </el-button>
          </div>
        </div>
        <!-- 助理 -->
        <div
          class="role-card"
          v-if="privilegeVo && privilegeVo.permission_data && assistantSortPermission"
        >
          <div class="role-card-head">
            <div class="title--box">
              <label class="title--label role3">助理</label>
              <el-tooltip v-tooltipMove>
                <div slot="content">
                  1、助理可凭口令进入直播间；
                  <br />
                  2、每个直播间最多可以登录20位助理；
                  <br />
                  3、直播中无法修改助理权限。
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
            </div>
            <p class="role-remark">昵称支持自定义，助理不可推流，可进行聊天过滤、观众管理等操作</p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <VhallInput
                :value="privilegeVo && assistant_join_link ? assistant_join_link : ''"
                readonly
                autocomplete="off"
              ></VhallInput>
            </el-form-item>
            <el-form-item label="口令">
              <VhallInput
                v-model.trim="privilegeVo.assistant_password"
                readonly
                class="input-no-right-border"
                autocomplete="off"
              >
                <el-button
                  class="no-border no-hover"
                  size="mini"
                  slot="append"
                  @click="privilegeShowHandle(0, 'assistant_password')"
                >
                  编辑
                </el-button>
              </VhallInput>
            </el-form-item>
            <el-form-item label="角色名称">
              <VhallInput
                v-model.trim="customRoleNameInfo.assiatant"
                readonly
                class="btn-relative btn-two"
                autocomplete="off"
              >
                <el-button
                  type="text"
                  class="no-border no-hover"
                  size="mini"
                  slot="append"
                  v-preventReClick
                  @click="setCustomRoleName(3)"
                >
                  编辑
                </el-button>
              </VhallInput>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>助理权限</label>
              <el-button size="mini" round @click="savePremHandle('assistant')">保存权限</el-button>
            </div>
            <div class="role-qx-list" v-if="assistantSortPermission">
              <!-- <el-checkbox  :value="true" disabled>文档翻页</el-checkbox> -->
              <template v-for="(item, key, ins) in assistantSortPermission || {}">
                <el-checkbox
                  v-model="item.check"
                  :true-label="1"
                  :false-label="0"
                  :disabled="key == 'white_board'"
                  :key="`assistant_${key + ins}`"
                >
                  {{ key == 'white_board' ? '文档翻页' : item.label }}
                </el-checkbox>
              </template>
            </div>
          </div>
          <div>
            <el-button
              type="primary"
              round
              v-preventReClick
              @click.prevent="copy(urlText3, 3)"
              class="copy-text"
            >
              邀请
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑口令弹出框 -->
    <VhallDialog title="编辑" :visible.sync="visible" width="280px">
      <div class="content">
        <el-form :model="pwdForm" ref="pwdForm" :rules="pwdFormRules" label-width="0">
          <el-form-item label="" prop="password">
            <VhallInput
              v-model.trim="pwdForm.password"
              auto-complete="off"
              placeholder="请输入口令"
              :maxlength="6"
              show-word-limit
            ></VhallInput>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick @click="privilegeEditHandle" round size="medium">
          确 定
        </el-button>
        <el-button @click="visible = false" round size="medium">取 消</el-button>
      </span>
    </VhallDialog>
    <!-- 编辑自定义角色弹出框 -->
    <VhallDialog title="编辑" :visible.sync="customRoleNameVisible" width="280px">
      <div class="content">
        <el-form
          :model="customRoleNameForm"
          ref="editCustomRoleName"
          :rules="customRoleNameRules"
          label-width="0"
        >
          <el-form-item label="" prop="name">
            <VhallInput
              v-model.trim="customRoleNameForm.name"
              auto-complete="off"
              placeholder="请输入角色名称"
              :maxlength="5"
              show-word-limit
            ></VhallInput>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-preventReClick
          @click="editCustomRoleNameHandle"
          round
          size="medium"
        >
          确 定
        </el-button>
        <el-button @click="customRoleNameVisible = false" round size="medium">取 消</el-button>
      </span>
    </VhallDialog>
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5"></begin-play>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import Clipboard from 'clipboard';
  import { sessionOrLocal } from '@/utils/utils';
  import beginPlay from '@/components/beginBtn';
  export default {
    name: 'embedCard.vue',
    components: {
      PageTitle,
      beginPlay
    },
    data() {
      const checkCustomRoleName = (rule, value, callback) => {
        if (value === null || value === undefined || value === '') {
          return callback(new Error('请输入角色名称'));
        } else {
          callback();
        }
      };
      let checkPassword = (rule, value, callback) => {
        if (value === null || value === undefined || value === '') {
          return callback(new Error('请输入口令'));
        } else if (!/^[0-9a-zA-Z]*$/.test(value)) {
          return callback(new Error('口令必须是数字或字母'));
        } else if (value.length < 6) {
          return callback(new Error('口令长度不能少于6位！'));
        } else {
          if (
            (this.pwdForm.keyName === 'guest_password' &&
              value === this.privilegeVo.assistant_password) ||
            (this.pwdForm.keyName === 'assistant_password' &&
              value === this.privilegeVo.guest_password)
          ) {
            // TODO 嘉宾 和 助理是一个页面登录，因此口令不能相同。主持人独立一个页面登录，因此口令可相同。
            return callback(new Error('嘉宾口令与助理口令不能相同'));
          } else {
            callback();
          }
        }
      };
      return {
        customRoleNameInfo: {
          host: '',
          assiatant: '',
          guest: ''
        },
        roleSwitch: null,
        webinarVo: {},
        userId: '',
        isInteract: 1,
        privilegeVo: {
          host_password: '',
          guest_password: '',
          assistant_password: ''
        },
        visible: false,
        customRoleNameVisible: false,
        pwdForm: {
          password: '',
          keyName: '',
          type: null
        },
        customRoleNameForm: {
          name: '',
          role: 0
        },
        pwdFormRules: {
          password: [{ validator: checkPassword, trigger: 'blur' }]
        },
        customRoleNameRules: {
          name: [{ validator: checkCustomRoleName, trigger: 'blur' }]
        },
        urlText: {
          one: '',
          two: '',
          three: ''
        },
        guestVo: null,
        assistantVo: null,
        lowerGradeInterval: null,
        webinarIsDirector: sessionOrLocal.get(`webinar_is_director__${this.$route.params.str}`) || 0 // 是否活动标记为云导播活动
      };
    },
    computed: {
      urlText1: function () {
        return `您好，【${this.privilegeVo.nick_name}】邀您参加《${
          this.privilegeVo.subject
        }》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
  直播名称：${this.privilegeVo.subject}
  直播ID：${this.privilegeVo.webinar_id}
  开始时间：${this.privilegeVo.start_time}
  主持人口令：${
    this.privilegeVo && this.privilegeVo.host_password ? this.privilegeVo.host_password : '未设置'
  }
  加入链接：${this.privilegeVo && this.host_join_link ? this.host_join_link : ''}`;
      },
      urlText2: function () {
        return `您好，【${this.privilegeVo.nick_name}】邀您参加《${
          this.privilegeVo.subject
        }》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
  直播名称：${this.privilegeVo.subject}
  直播ID：${this.privilegeVo.webinar_id}
  开始时间：${this.privilegeVo.start_time}
  嘉宾口令：${
    this.privilegeVo && this.privilegeVo.guest_password ? this.privilegeVo.guest_password : '未设置'
  }
  加入链接：${this.privilegeVo && this.join_link ? this.join_link : ''}`;
      },
      urlText3: function () {
        return `您好，【${this.privilegeVo.nick_name}】邀您参加《${
          this.privilegeVo.subject
        }》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
  直播名称：${this.privilegeVo.subject}
  直播ID：${this.privilegeVo.webinar_id}
  开始时间：${this.privilegeVo.start_time}
  助理口令：${
    this.privilegeVo && this.privilegeVo.assistant_password
      ? this.privilegeVo.assistant_password
      : '未设置'
  }
  加入链接：${this.privilegeVo && this.assistant_join_link ? this.assistant_join_link : ''}`;
      },
      // 主持人
      host_join_link: function () {
        return `${
          window.location.origin + (process.env.VUE_APP_WEB_KEY || '')
        }/lives/keylogin-host/${this.privilegeVo.webinar_id}/1`;
      },
      // 嘉宾
      join_link: function () {
        return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/lives/keylogin/${
          this.privilegeVo.webinar_id
        }/4`;
      },
      // 助理
      assistant_join_link: function () {
        return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/lives/keylogin/${
          this.privilegeVo.webinar_id
        }/3`;
      },
      // 嘉宾权限
      guestSortPermission() {
        return this.privilegeVo.permission_data.guest
          ? this.sortPermission(this.privilegeVo.permission_data.guest)
          : null;
      },
      // 助理权限
      assistantSortPermission() {
        return this.privilegeVo.permission_data.assistant
          ? this.sortPermission(this.privilegeVo.permission_data.assistant)
          : null;
      }
    },
    created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.isInteract = JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')).new_interact;
      // TODO 黄金链路 this.vsConfig = JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage'))
      // TODO 黄金链路 this.handleLowerGradeHeart()
      // 根據活動ID獲取活動信息
      this.getWebinarInfo();
    },
    methods: {
      setCustomRoleName(role) {
        this.customRoleNameVisible = true;
        switch (role) {
          case 1:
            this.customRoleNameForm.name = this.customRoleNameInfo.host;
            break;
          case 3:
            this.customRoleNameForm.name = this.customRoleNameInfo.assiatant;
            break;
          case 2:
            this.customRoleNameForm.name = this.customRoleNameInfo.guest;
            break;
        }
        this.customRoleNameForm.role = role;
      },
      sortPermission(params) {
        const sortKeys = Object.keys(params);
        const defaultSortArr = [
          'white_board', // 文档翻页
          'waiting_video_file', // 插播文件
          'webinar_award', // 抽奖
          'survey', // 问卷
          'exam', // 快问快答
          'personal_chat', // 问答
          'sign_in', // 签到
          'timer', // 计时器
          'video_polling', // 视频轮巡
          'members_manager', // 成员管理
          'webinar_group', // 分组讨论
          'comment_check', // 聊天过滤
          'webinar_notice', // 公告
          'disable_msg', // 全员禁言
          'share', // 分享
          'speak_manage',
          'desktop_share' // 桌面共享
        ];
        // webinar_type: 1.音频 2 视频 3 互动  5 定时直播
        const obj = {};
        defaultSortArr.forEach(item => {
          if (sortKeys.includes(item)) {
            obj[item] = params[item];
          }
        });
        return obj;
      },
      async updateSwitch() {
        let roleSwitch = this.roleSwitch; // 目标
        this.roleSwitch = Number(!roleSwitch);
        // webinar/info调整-直播中不能操作的使用1
        let result = await this.$fetch('getWebinarInfo', {
          webinar_id: this.$route.params.str
        });
        if (result.data) {
          this.webinarVo = result.data;
        }
        // TODO:彩排-彩排中不能设置
        if (this.webinarVo.webinar_state === 1) {
          // 如果為~直播中
          this.$message({
            showClose: true,
            message: `${this.webinarVo.rehearsal_type ? '彩排' : '直播'}中不能设置该功能`,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        } else {
          this.$fetch('privilegeOpen', {
            webinar_id: this.$route.params.str,
            is_privilege: roleSwitch
          })
            .then(res => {
              this.$vhall_paas_port({
                k: res.data.is_privilege == 1 ? 100107 : 100108,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: this.$route.params.str,
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              if (Number(res.data.is_privilege) === 1) {
                this.$message({
                  showClose: true,
                  message: '开启成功',
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                this.roleSwitch = roleSwitch;
                // 获取 getPrivilegeInfo 活动角色配置接口
                this.getPrivilegeInfo();
              } else if (Number(res.data.is_privilege) === 0) {
                this.$message({
                  showClose: true,
                  message: '关闭成功',
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                this.roleSwitch = roleSwitch;
                // 获取 getPrivilegeInfo 活动角色配置接口
                this.getPrivilegeInfo();
              }
            })
            .catch(er => {
              console.log(er);
              this.$message({
                showClose: true,
                message: er.msg || roleSwitch ? `开启失败，` : `开启失败`,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            });
        }
      },
      editCustomRoleNameHandle() {
        this.$refs.editCustomRoleName.validate(valid => {
          if (valid) {
            this.$fetch('setCustomRoleName', {
              need_sign: 1,
              webinar_id: this.$route.params.str,
              type: this.customRoleNameForm.role,
              name: this.customRoleNameForm.name
            })
              .then(res => {
                this.$message({
                  message: '修改成功',
                  showClose: true,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                switch (this.customRoleNameForm.role) {
                  case 1:
                    this.customRoleNameInfo.host = this.customRoleNameForm.name;
                    break;
                  case 2:
                    this.customRoleNameInfo.guest = this.customRoleNameForm.name;
                    break;
                  case 3:
                    this.customRoleNameInfo.assiatant = this.customRoleNameForm.name;
                    break;
                }
                this.customRoleNameVisible = false;
              })
              .catch(e => {
                this.$message({
                  message: e.msg,
                  showClose: true,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      privilegeEditHandle() {
        // type = 0 助理；1 嘉宾；2 主持人。
        this.$refs.pwdForm.validate(valid => {
          if (valid) {
            this.$fetch('privilegeEdit', {
              webinar_id: this.$route.params.str,
              type: this.pwdForm.type,
              password: this.pwdForm.password
            })
              .then(res => {
                if (res.data) {
                  this.$vhall_paas_port({
                    k: this.pwdForm.type == 1 ? 100122 : this.pwdForm.type == 2 ? 100109 : 100111,
                    data: {
                      business_uid: this.userId,
                      user_id: '',
                      webinar_id: this.$route.params.str,
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                  this.$message({
                    message: '修改成功',
                    showClose: true,
                    // duration: 0,
                    type: 'success',
                    customClass: 'zdy-info-box'
                  });
                  this.visible = false;
                  this.getPrivilegeInfo();
                } else {
                  this.$message({
                    message: res.msg || '修改失败',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                }
              })
              .catch(res => {
                console.log(res);
                this.$message({
                  message: res.msg || '修改失败',
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      privilegeShowHandle(type, keyName) {
        this.$nextTick(() => {
          try {
            if (this.pwdForm) {
              this.$refs.pwdForm.resetFields();
            }
          } catch (e) {
            console.log(e);
          }
          this.visible = true;
          this.pwdForm.password = this.privilegeVo[keyName];
          this.pwdForm.keyName = keyName;
          this.pwdForm.type = type;
        });
      },
      // 保存權限
      savePremHandle(keyName) {
        let keysObj = this.privilegeVo.permission_data[keyName];
        let { keys, values } = Object;
        let obj = {};
        // .filter(item => item !== 'white_board')
        keys(keysObj).forEach((keyItem, ins) => {
          console.log(keyItem + 'vvv,' + Number(values(keysObj)[ins].check));
          obj[keyItem] = Number(values(keysObj)[ins].check);
        });
        obj.webinar_id = this.$route.params.str;
        obj.type = keyName === 'assistant' ? 0 : 1; // 0 助理 1 嘉宾
        obj.webinar_type = this.privilegeVo.webinar_type; // 活动类型 1:音频 2:视频 3:互动
        // console.log(obj);
        this.$fetch('privilegePrem', obj)
          .then(res => {
            // 助理
            if (keyName === 'assistant') {
              let assObj = {
                comment_check: 100118,
                disable_msg: 100120,
                members_manager: 100117,
                personal_chat: 100115,
                share: 100121,
                sign_in: 100116,
                survey: 100114,
                webinar_award: 100113,
                webinar_notice: 100119
              };
              keys(keysObj).forEach((keyItem, ins) => {
                if (Number(values(keysObj)[ins].check)) {
                  this.$vhall_paas_port({
                    k: assObj[keyItem],
                    data: {
                      business_uid: this.userId,
                      user_id: '',
                      webinar_id: this.$route.params.str,
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
              });
            } else {
              // 嘉宾
              let assObj = {
                comment_check: 100128,
                disable_msg: 100130,
                members_manager: 100127,
                personal_chat: 100125,
                share: 100131,
                sign_in: 100126,
                survey: 100124,
                webinar_award: 100123,
                webinar_notice: 100129
              };
              keys(keysObj).forEach((keyItem, ins) => {
                if (Number(values(keysObj)[ins].check)) {
                  this.$vhall_paas_port({
                    k: assObj[keyItem],
                    data: {
                      business_uid: this.userId,
                      user_id: '',
                      webinar_id: this.$route.params.str,
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
              });
            }
            this.$message({
              message: `保存成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.getPrivilegeInfo();
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '保存失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      getPrivilegeInfo() {
        this.$fetch('privilegeInfo', {
          webinar_id: this.$route.params.str
        })
          .then(res => {
            if (res.data) {
              // 若是未开启，口令展示为空
              if (Number(res.data.is_privilege) === 0) {
                res.data.host_password = '';
                res.data.guest_password = '';
                res.data.assistant_password = '';
              }
              this.customRoleNameInfo.host = res.data.host_name;
              this.customRoleNameInfo.assiatant = res.data.assistant_name;
              this.customRoleNameInfo.guest = res.data.guest_name;
              // try {
              //   delete res.data.permission_data.guest['white_board'];
              // }catch (e) {
              //   console.log('guest',0);
              // }
              // try {
              //   delete res.data.permission_data.assistant['white_board'];
              // }catch (e) {
              //   console.log('assistant', 1);
              // }
              this.roleSwitch = Number(res.data.is_privilege);
              this.privilegeVo = res.data;
            } else {
              this.privilegeVo = {};
            }
          })
          .catch(e => {
            console.log(e);
            this.privilegeVo = {};
          });
      },
      copy(text, index) {
        let clipboard = new Clipboard('.copy-text', {
          text: () => text
        });
        clipboard.on('success', () => {
          this.$vhall_paas_port({
            k: index == 1 ? 100110 : index == 3 ? 100112 : 100132,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `复制成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on('error', () => {
          this.$message({
            message: `复制失败，暂不支持自动复制`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          // 释放内存
          clipboard.destroy();
        });
      },
      // 直播中不能操作的使用1
      getWebinarInfo() {
        this.$fetch('getWebinarInfo', {
          webinar_id: this.$route.params.str
        })
          .then(res => {
            if (res.data) {
              this.webinarVo = res.data || {};
            } else {
              this.webinarVo = {};
            }
          })
          .catch(e => {
            console.log(e);
            this.webinarVo = {};
          });
        // 根据ID获取活动-角色配置信息
        this.getPrivilegeInfo();
      },
      handleLowerGradeHeart() {
        this.lowerGradeInterval = setInterval(() => {
          this.getLowerGradeConfig();
        }, (Math.random() * 5 + 5) * 1000);
      },
      getLowerGradeConfig() {
        this.$fetch('lowerGrade', {})
          .then(res => {})
          .catch(res => {
            // 降级没有code吗
            const { activity, user, global } = res;
            // 优先顺序：互动 > 用户 > 全局
            const activityConfig =
              activity && activity.length > 0
                ? activity.find(option => option.audience_id == this.$route.params.str)
                : null;
            const userConfig =
              user && user.length > 0
                ? user.find(option => option.audience_id == sessionOrLocal.get('userId'))
                : null;
            console.log('角色邀请配置', res);
            if (activityConfig) {
              this.setLowerGradeConfig(activityConfig.permissions);
            } else if (userConfig) {
              this.setLowerGradeConfig(userConfig.permissions);
            } else if (global && global.permissions) {
              this.setLowerGradeConfig(global.permissions);
            }
          });
      },
      setLowerGradeConfig(data) {
        if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
        const permission = this.vsConfig;
        Object.assign(permission, data);
        this.isInteract = permission.new_interact;
      }
    }
  };
</script>
<style lang="less" scoped>
  .switch__box {
    display: inline-block;
  }
  /deep/ .el-switch__label--right,
  /deep/ .el-switch__label--left {
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  .el-role-switch {
    margin-left: 8px;
    vertical-align: sub;
  }
  .role-card-list {
  }
  .role-card-wrap {
    // display: flex;
    // flex-direction: row;
    // align-items: flex-start;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // width: 1362px;
  }
  .role-card {
    min-height: 540px;
    width: calc(50% - 12px);
    // width: 675px;
    margin-right: 12px;
    margin-left: 0;
    display: inline-block;
    margin-bottom: 24px;
    /* border: 1px dashed #EEEEEE; */
    padding: 32px 0 32px 32px;
    background: #ffffff;
    vertical-align: middle;
    border-radius: 4px;
    &:nth-child(2n) {
      margin-right: 0;
      margin-left: 12px;
    }
    .role-card-head,
    .el-form,
    .role-qx-title {
      padding-right: 32px;
    }
    /deep/.el-input-group__append {
      width: 52px !important;
      height: 38px;
      background: #f7f7f7;
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
  .title--label {
    font-size: 24px;
    font-family: @fontMedium;
    font-weight: 500;
    line-height: 33px;
    margin-right: 8px;
    &.role1 {
      color: #fb3a32;
    }
    &.role2 {
      color: #3562fa;
    }
    &.role3 {
      color: #fa9a32;
    }
  }
  .no-timing {
    margin: 0 auto;
    text-align: center;
    margin-top: 120px;
    img {
      width: 104px;
      height: 108px;
    }
    p {
      color: #666;
      font-size: 12px;
      margin-top: 20px;
    }
  }
  .role-remark {
    font-size: 12px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    margin-top: 4px;
  }
  .role-card-content {
    margin-top: 32px;
    /deep/.el-form-item__label {
      font-size: 14px;
      font-family: @fontRegular;
      padding: 0 10px 0 0;
      width: 70px !important;
      text-align: right;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin-top: 10px;
    }
    /deep/ .el-form-item__content {
      margin-left: 70px !important;
    }
    /deep/.el-input__inner {
      height: 40px;
    }
    /deep/.input-no-right-border {
      .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
    /deep/.btn-relative {
      position: relative;
      cursor: pointer;
      .el-input__inner {
        padding: 0 36px 0 12px;
        border-radius: 4px;
      }
      /deep/.el-input-group__append {
        position: absolute;
        right: 0px;
        top: 10px;
        width: 20px !important;
      }
      // &.btn-two {
      //   /deep/.el-input-group__append {
      //     width: 52px!important;
      //     height: 38px;
      //     background: #F7F7F7;
      //     border-radius: 0 4px 4px 0;
      //     position: absolute;
      //     right: 1px;
      //     top: 1px;
      //     line-height: 38px;
      //     text-align: center;
      //     padding: 0 0;
      //     margin: 0 0;
      //     font-size: 14px;
      //     font-family: @fontRegular;
      //     font-weight: 400;
      //     color: #666666;
      //     border: 0;
      //   }
      // }
    }
    /*/deep/.el-input-group__append, /deep/.el-input-group__prepend {
    width: 52px;
    height: 40px;
    background: #F7F7F7;
    border-radius: 4px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    border-radius: 4px;
    border: 1px solid #F7F7F7;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 0;
  }*/
    /deep/.el-form-item {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .role-qx-title {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 20px;
    height: 26px;
    margin-top: 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    label {
      margin-right: auto;
    }
    /deep/button.el-button.el-button--mini {
      &:focus,
      &:hover {
        border-color: #fb3a32;
        background-color: #fb3a32;
        color: #ffffff;
      }
      &:active,
      &:visited {
        border-color: #e2332c;
        background-color: #e2332c;
        color: #ffffff;
      }
    }
  }
  .role-qx-list {
    height: 118px;
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    padding-top: 8px;
    overflow-y: auto;
    margin-bottom: 24px;
    /deep/.el-checkbox {
      width: 20%;
      margin-right: 0;
      margin-top: 16px;
      min-width: 110px;
    }
  }
  /deep/.el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
  /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #ffebeb;
    border: 1px solid #fed8d6;
  }
  // /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  //   background: #CCCCCC;
  //   border: 1px solid #E6E6E6;
  //   &::after {
  //     border-color: #666666;
  //   }
  // }
  /deep/.el-checkbox__inner::after {
    border-color: #fb3a32;
    top: 2px;
    left: 5px;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label,
  /deep/.el-checkbox__label {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 20px;
  }
  /deep/input.el-input__inner[readonly^='readonly'] {
    &:focus {
      border-color: #e6e6e6;
    }
  }
  /deep/.el-dialog__body {
    /deep/.el-form-item:last-child {
      margin-bottom: 0;
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
  }
  // /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  //   background: #E6E6E6;
  //   border: 1px solid #CCCCCC;
  //   color: #666666;
  // }
  /deep/button.el-button.el-button--mini.no-hover {
    padding: 0 12px !important;
    span {
      color: #666666;
    }
  }
</style>
