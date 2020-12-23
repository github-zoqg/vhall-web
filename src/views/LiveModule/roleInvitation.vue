<template>
  <div>
    <pageTitle title="角色邀请">
      <div slot="content">
        1、互动直播中，通过网页端和客户端登录的主持人和嘉宾，都可以进行连麦互动；<br/>
        2、权限控制可调整嘉宾和助理在直播中的功能；<br/>
        3、拥有文档管理权限后，只有拥有演讲权限的人才可进行文档演示、调整观看布局、涂鸦等操作；<br/>
      </div>
      <el-switch
        class="el-role-switch"
        v-model="roleSwitch"
        :active-value="1"
        :inactive-value="0"
        @change="updateSwitch"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        :active-text="roleSwitch > 0 ? `已开启，支持邀请特殊角色加入直播` : `开启后，支持邀请特殊角色加入直播`"
      >
      </el-switch>
    </pageTitle>
    <!-- 角色邀请卡片 -->
    <div :class="!roleSwitch ? 'role-card-list pre--full-mask' : 'role-card-list'">
      <div class="pre--full-cover" v-show="!roleSwitch"></div>
      <div>
        <!-- 主持人 -->
        <div class="role-card">
          <div class="role-card-head">
            <div class="title--box">
              <label class="title--label role1">主持人</label>
            </div>
            <p class="role-remark">主持人可发起直播，进行推流、文档演示等操作</p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <el-input :value="privilegeVo && host_join_link ? host_join_link : ''" readonly></el-input>
            </el-form-item>
            <el-form-item label="口令">
              <el-input v-model.trim="privilegeVo.host_password" readonly>
                <el-button class="no-border" size="mini" slot="append" @click="privilegeShowHandle(2, 'host_password')">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>主持人权限</label>
            </div>
            <div class="role-qx-list">
              主持人作为主办方，拥有最高权限
            </div>
          </div>
          <div>
            <el-button type="primary" round v-preventReClick @click.prevent="copy(urlText1)" class="copy-text">邀请</el-button>
          </div>
        </div>
        <!-- 嘉宾 -->
        <div class="role-card" v-if="privilegeVo && privilegeVo.permission_data && privilegeVo.permission_data.guest">
          <div class="role-card-head">
            <div class="title--box">
              <label class="title--label role2">嘉宾</label>
              <el-tooltip>
                <div slot="content">
                  1、嘉宾可凭口令进入直播间；<br/>
                  2、互动直播中，通过网页端和客户端登录的主持人和<br/>
                  <span style="padding-left:20px;">嘉宾，都可以进行连麦；</span><br />
                  3、每个直播间最多可以登录10位嘉宾；<br/>
                  4、直播中无法修改嘉宾权限。
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <p class="role-remark">嘉宾可进行推流，嘉宾切换、文档演示等操作</p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <el-input :value="privilegeVo && join_link ? join_link : ''" readonly></el-input>
            </el-form-item>
            <el-form-item label="口令">
              <el-input v-model.trim="privilegeVo.guest_password" readonly>
                <el-button class="no-border" size="mini" slot="append" @click="privilegeShowHandle(1, 'guest_password')">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>嘉宾权限</label>
              <el-button size="mini" round @click="savePremHandle('guest')">保存权限</el-button>
            </div>
            <div class="role-qx-list" v-if="privilegeVo.permission_data.guest">
              <el-checkbox  :value="true" disabled>文档白板</el-checkbox>
              <template v-for="(item, key, ins) in privilegeVo.permission_data.guest">
                <el-checkbox v-model="item.check"
                             :true-label="1"
                             :false-label="0"
                             v-if="key !== 'white_board'"
                             :key="`guest_${key + ins}`">{{ item.label }}</el-checkbox>
              </template>
            </div>
          </div>
          <div>
            <el-button  type="primary" round v-preventReClick @click="copy(urlText2)" class="copy-text">邀请</el-button>
          </div>
        </div>
        <!-- 助理 -->
        <div class="role-card" v-if="privilegeVo && privilegeVo.permission_data && privilegeVo.permission_data.assistant">
          <div class="role-card-head">
            <div class="title--box">
              <label class="title--label role3">助理</label>
              <el-tooltip>
                <div slot="content">
                  1、助理可凭口令进入直播间；<br />
                  2、每个直播间最多可以登录10位助理；<br />
                  3、直播中无法修改助理权限。
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <p class="role-remark">助理不可推流，可进行聊天过滤、观众管理等操作</p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <el-input  :value="privilegeVo && assistant_join_link ? assistant_join_link : ''"  readonly></el-input>
            </el-form-item>
            <el-form-item label="口令">
              <el-input v-model.trim="privilegeVo.assistant_password" readonly>
                <el-button class="no-border" size="mini" slot="append" @click="privilegeShowHandle(0, 'assistant_password')">编辑</el-button>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>助理权限</label>
              <el-button size="mini" round @click="savePremHandle('assistant')">保存权限</el-button>
            </div>
            <div class="role-qx-list" v-if="privilegeVo.permission_data.assistant">
              <el-checkbox  :value="true" disabled>文档翻页</el-checkbox>
              <template v-for="(item, key, ins) in privilegeVo.permission_data.assistant || []">
                <el-checkbox v-model="item.check"
                             :true-label="1"
                             :false-label="0"
                             v-if="key !== 'white_board'"
                             :key="`assistant_${key + ins}`">{{ item.label }}</el-checkbox>
              </template>
            </div>
          </div>
          <div>
            <el-button type="primary" round v-preventReClick @click.prevent="copy(urlText3)" class="copy-text">邀请</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑口令弹出框 -->
    <VhallDialog title="编辑" :visible.sync="visible"
                 :close-on-click-modal="false"
                 width="280px">
      <div class="content">
        <el-form :model="pwdForm" ref="pwdForm" :rules="pwdFormRules" label-width="0">
          <el-form-item label="" prop="password">
            <el-input v-model.trim="pwdForm.password" auto-complete="off" placeholder="请输入口令" :maxlength="6" show-word-limit/>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-preventReClick  @click="privilegeEditHandle" round size="mini">确 定</el-button>
        <el-button @click="visible = false" round size="mini">取 消</el-button>
      </span>
    </VhallDialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Clipboard from 'clipboard';
export default {
  name: 'embedCard.vue',
  components: {
    PageTitle,
  },
  data() {
    let checkPassword = (rule, value, callback) => {
      if (value === null || value === undefined || value === '') {
        return callback(new Error('请输入口令'));
      } else if (!/^[0-9]*$/.test(value)) {
        return callback(new Error('口令必须是数字'));
      } else if (value.length < 6) {
        return callback(new Error('口令长度不能少于6位！'));
      } else {
        if (
          (this.pwdForm.keyName === 'guest_password' && value === this.privilegeVo.assistant_password) ||
          (this.pwdForm.keyName === 'assistant_password' && value === this.privilegeVo.guest_password)
        ) {
          // TODO 嘉宾 和 助理是一个页面登录，因此口令不能相同。主持人独立一个页面登录，因此口令可相同。
          return callback(new Error('嘉宾口令与助理口令不能相同'));
        } else {
          callback();
        }
      }
    };
    return {
      roleSwitch: null,
      webinarVo: {},
      privilegeVo: {
        host_password: '',
        guest_password: '',
        assistant_password: ''
      },
      visible: false,
      pwdForm: {
        password: '',
        keyName: '',
        type: null
      },
      pwdFormRules: {
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      },
      urlText: {
        one: '',
        two: '',
        three: ''
      }
    };
  },
  computed: {
    urlText1: function() {
      return `您好，【${this.privilegeVo.nick_name}】邀您参加《${this.privilegeVo.subject}》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
直播名称：${this.privilegeVo.subject}
直播ID：${this.privilegeVo.webinar_id}
开始时间：${this.privilegeVo.start_time}
主持人口令：${this.privilegeVo && this.privilegeVo.host_password ? this.privilegeVo.host_password : '未设置'}
加入链接：${this.privilegeVo && this.host_join_link ? this.host_join_link : ''}`;
    },
    urlText2: function() {
      return `您好，【${this.privilegeVo.nick_name}】邀您参加《${this.privilegeVo.subject}》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
直播名称：${this.privilegeVo.subject}
直播ID：${this.privilegeVo.webinar_id}
开始时间：${this.privilegeVo.start_time}
嘉宾口令：${this.privilegeVo && this.privilegeVo.guest_password ? this.privilegeVo.guest_password : '未设置'}
加入链接：${this.privilegeVo && this.join_link ? this.join_link : ''}`;
    },
    urlText3: function() {
      return `您好，【${this.privilegeVo.nick_name}】邀您参加《${this.privilegeVo.subject}》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
直播名称：${this.privilegeVo.subject}
直播ID：${this.privilegeVo.webinar_id}
开始时间：${this.privilegeVo.start_time}
助理口令：${this.privilegeVo && this.privilegeVo.assistant_password ? this.privilegeVo.assistant_password : '未设置'}
加入链接：${this.privilegeVo && this.assistant_join_link ? this.assistant_join_link : ''}`;
    },
    // 主持人
    host_join_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/keylogin-host/${this.privilegeVo.webinar_id}/1`;
    },
    // 嘉宾
    join_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/keylogin/${this.privilegeVo.webinar_id}/4`;
    },
    // 助理
    assistant_join_link: function() {
      return `${window.location.origin + (process.env.VUE_APP_WEB_KEY || '')}/keylogin/${this.privilegeVo.webinar_id}/3`;
    }
  },
  methods: {
    updateSwitch() {
      let roleSwitch = this.roleSwitch; // 目标
      this.roleSwitch = Number(!roleSwitch);
      if(this.webinarVo.webinar_state === 1) {
        // 如果為~直播中
        this.$message.error('直播中不能设置该功能');
      } else {
        this.$fetch('privilegeOpen', {
          webinar_id: this.$route.params.str,
          is_privilege: roleSwitch
        }).then(res => {
          if (res && res.code === 200 && Number(res.data.is_privilege) === 1) {
            this.$message.success('开启成功');
            this.roleSwitch = roleSwitch;
            // 获取 getPrivilegeInfo 活动角色配置接口
            this.getPrivilegeInfo();
          }else if (res && res.code === 200 && Number(res.data.is_privilege) === 0) {
            this.$message.success('关闭成功');
            this.roleSwitch = roleSwitch;
            // 获取 getPrivilegeInfo 活动角色配置接口
            this.getPrivilegeInfo();
          } else {
            this.$message.error(res.msg || roleSwitch ? `开启失败` : `开启失败`);
          }
        }).catch(er => {
          console.log(er);
          this.$message.error(roleSwitch ? `开启失败，` : `开启失败`);
        });
      }
    },
    privilegeEditHandle() {
      // type = 0 助理；1 嘉宾；2 主持人。
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.$fetch('privilegeEdit', {
            webinar_id: this.$route.params.str,
            type: this.pwdForm.type,
            password: this.pwdForm.password
          }).then(res => {
            if(res && res.code === 200 && res.data) {
              this.$message.success('修改成功');
              this.visible = false;
              this.getPrivilegeInfo();
            } else {
              this.$message.error(res.msg || '修改失败');
            }
          }).catch(e => {
            console.log(e);
            this.$message.error('修改失败');
          });
        }
      });
    },
    privilegeShowHandle(type, keyName) {
      this.$nextTick(() => {
        try {
          if(this.pwdForm) {
            this.$refs.pwdForm.resetFields();
          }
        } catch (e) {console.log(e);}
      });
      this.visible = true;
      this.pwdForm.password = this.privilegeVo[keyName];
      this.pwdForm.keyName = keyName;
      this.pwdForm.type = type;
    },
    // 保存權限
    savePremHandle(keyName) {
      let keysObj = this.privilegeVo.permission_data[keyName];
      let {keys,values} = Object;
      let obj = {};
      keys(keysObj).filter(item => item !== 'white_board').forEach((keyItem, ins) => {
        console.log(keyItem + ',' + ins);
        obj[keyItem] = Number(values(keysObj)[ins].check);
      });
      obj.webinar_id = this.$route.params.str;
      obj.type = keyName === 'assistant' ? 0 : 1; // 0 助理 1 嘉宾
      obj.webinar_type = this.privilegeVo.webinar_type; // 活动类型 1:音频 2:视频 3:互动
      // console.log(obj);
      this.$fetch('privilegePrem', obj).then(res => {
        if(res && res.code === 200) {
          this.$message.success('保存成功');
          this.getPrivilegeInfo();
        } else {
          this.$message.error(res.msg || '保存失败');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error('保存失败');
      });
    },
    getPrivilegeInfo() {
      this.$fetch('privilegeInfo', {
        webinar_id: this.$route.params.str,
      }).then(res => {
          if(res && res.code === 200 && res.data) {
            // 若是未开启，口令展示为空
            if (Number(res.data.is_privilege) === 0) {
              res.data.host_password = '';
              res.data.guest_password = '';
              res.data.assistant_password = '';
            }
            this.roleSwitch = Number(res.data.is_privilege);
            this.privilegeVo = res.data;
          } else {
            this.privilegeVo = {};
          }
      }).catch(e => {
        console.log(e);
        this.privilegeVo = {};
      });
    },
    copy(text) {
      let clipboard = new Clipboard('.copy-text', {
        text: () => text
      });
      clipboard.on('success', () => {
        this.$message.success('复制成功');
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        this.$message.error('复制失败，暂不支持自动复制');
        // 释放内存
        clipboard.destroy();
      });
    },
    getWebinarInfo() {
      this.$fetch('getWebinarInfo', {
        webinar_id: this.$route.params.str,
      }).then(res => {
        if(res && res.code === 200 && res.data) {
          this.webinarVo = res.data || {};
        } else {
          this.webinarVo = {};
        }
      }).catch(e => {
        console.log(e);
        this.webinarVo = {};
      });
      // 根据ID获取活动-角色配置信息
      this.getPrivilegeInfo();
    }
  },
  created() {
    // 根據活動ID獲取活動信息
    this.getWebinarInfo();
  }
};
</script>
<style lang="less" scoped>
/deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
  color: #999999;
  pointer-events: none;
  user-select: none;
}
.el-role-switch{
  margin-left: 8px;
  vertical-align: sub;
}
.role-card-list {
}
.role-card {
  min-height: 472px;
  width: calc(50% - 12px);
  margin-right: 12px;
  margin-left: 0;
  display: inline-block;
  margin-bottom: 24px;
  border: 1px dashed #EEEEEE;
  padding: 32px 32px;
  background: #FFFFFF;
  vertical-align: middle;
  &:nth-child(2n) {
    margin-right: 0;
    margin-left: 12px;
  }
}
.title--label {
  font-size: 24px;
  font-family: @fontMedium;
  font-weight: 500;
  line-height: 33px;
  margin-right: 8px;
  &.role1 {
    color: #FB3A32;
  }
  &.role2 {
    color: #3562FA;
  }
  &.role3 {
    color: #FA9A32;
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
    font-weight: 400;
    color: #666666;
    padding: 0 10px 0 0;
  }
  /deep/.el-input__inner {
    height: 40px;
  }
  /deep/.btn-relative {
    position: relative;
    cursor: pointer;
    .el-input__inner {
      padding: 0 36px 0 12px;
    }
    /deep/.el-input-group__append {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 20px!important;
    }
    &.btn-two {
      /deep/.el-input-group__append {
        width: 52px!important;
        height: 40px;
        background: #F7F7F7;
        border-radius: 0 4px 4px 0;
        position: absolute;
        right: -1px;
        top: 0;
        line-height: 38px;
        text-align: center;
        padding: 0 0;
        margin: 0 0;
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #666666;
      }
    }
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
  color: #666666;
  line-height: 20px;
  margin-top: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  label {
    margin-right: auto;
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
    width: 25%;
    margin-right: 0;
    margin-top: 16px;
    min-width: 110px;
  }
}
/deep/.el-checkbox__inner {
  width: 16px;
  height: 16px;
}
/deep/.el-checkbox__input.is-checked .el-checkbox__inner, /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #FFEBEB;
  border: 1px solid #FED8D6;
}
/deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background: #CCCCCC;
  border: 1px solid #E6E6E6;
  &::after {
    border-color: #666666;
  }
}
/deep/.el-checkbox__inner::after {
  border-color: #FB3A32;
  top: 2px;
  left: 5px;
}
/deep/.el-checkbox__input.is-checked+.el-checkbox__label, /deep/.el-checkbox__label {
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #1A1A1A;
  line-height: 20px;
}
/deep/input.el-input__inner[readonly^=readonly]{
  &:focus {
    border-color: #E6E6E6;
  }
}
/deep/.el-dialog__body {
  /deep/.el-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>
