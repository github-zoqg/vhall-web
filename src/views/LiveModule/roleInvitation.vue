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
        @change="updateSwitch"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        active-text="开启后，可邀请特殊角色加入直播">
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
            <p class="role-remark">主持人发起直播，进行推流、文档演示等操作</p>
          </div>
          <el-form label-width="38px" class="role-card-content">
            <el-form-item label="链接">
              <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234" readonly></el-input>
            </el-form-item>
            <el-form-item label="口令">
              <el-input placeholder="173245" class="btn-relative btn-two">
                <template slot="append">编辑</template>
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
              <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234" readonly></el-input>
            </el-form-item>
            <el-form-item label="口令">
              <el-input placeholder="173245"  class="btn-relative btn-two">
                <template slot="append">编辑</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>主持人权限</label>
              <el-button size="mini" round>保存</el-button>
            </div>
            <div class="role-qx-list">
              <el-checkbox>问答</el-checkbox>
              <el-checkbox>分享</el-checkbox>
              <el-checkbox>公告</el-checkbox>
              <el-checkbox>成员管理</el-checkbox>
              <el-checkbox>文档白板</el-checkbox>
              <el-checkbox>问卷</el-checkbox>
              <el-checkbox>全员签到</el-checkbox>
              <el-checkbox>抽奖</el-checkbox>
              <el-checkbox>聊天过滤</el-checkbox>
              <el-checkbox>全员禁言</el-checkbox>
            </div>
          </div>
          <div>
            <el-button type="primary" v-preventReClick @click.prevent="copy(urlText2)" class="copy-text">邀请</el-button>
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
              <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234" readonly></el-input>
            </el-form-item>
            <el-form-item label="口令">
              <el-input placeholder="173245" class="btn-relative btn-two">
                <template slot="append">编辑</template>
              </el-input>
            </el-form-item>
          </el-form>
          <div class="role-card-qx-content">
            <div class="role-qx-title">
              <label>主持人权限</label>
              <el-button size="mini" round>保存</el-button>
            </div>
            <div class="role-qx-list">
              <el-checkbox v>问答</el-checkbox>
              <el-checkbox>分享</el-checkbox>
              <el-checkbox>公告</el-checkbox>
              <el-checkbox>成员管理</el-checkbox>
              <el-checkbox>文档白板</el-checkbox>
              <el-checkbox>问卷</el-checkbox>
              <el-checkbox>全员签到</el-checkbox>
              <el-checkbox>抽奖</el-checkbox>
              <el-checkbox>聊天过滤</el-checkbox>
              <el-checkbox>全员禁言</el-checkbox>
            </div>
          </div>
          <div>
            <el-button type="primary" v-preventReClick @click.prevent="copy(urlText3)" class="copy-text">邀请</el-button>
          </div>
        </div>
      </div>
    </div>
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
    return {
      roleSwitch: false,
      privilegeVo: null,
      urlText: {
        one: '',
        two: '',
        three: ''
      }
    };
  },
  computed: {
    urlText1: function() {
      return `您好，【${this.privilegeVo.nick_name}】邀您参加《${this.liveVo.subject}》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
              直播名称：${this.liveVo.subject}
              直播ID：${this.liveVo.id}
              开始时间：${this.liveVo.start_time}
              主持人口令：${this.liveVo && this.liveVo.host_password ? this.liveVo.host_password : '未设置'}
              加入链接：${'/mywebinar/host-login/'+ this.liveVo.id }`;
    },
    urlText2: function() {
      return `您好，【${this.privilegeVo.nick_name}】邀您参加《${this.liveVo.subject}》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
              直播名称：${this.liveVo.subject}
              直播ID：${this.liveVo.id}
              开始时间：${this.liveVo.start_time}
              嘉宾口令：${this.liveVo && this.liveVo.guest_password ? this.liveVo.guest_password : '未设置'}
              加入链接：${'/mywebinar/login/'+ this.liveVo.id }`;
    },
    urlText3: function() {
      return `您好，【${this.privilegeVo.nick_name}】邀您参加《${this.liveVo.subject}》的直播，以下为直播的详细信息及参会信息，请准时参加，谢谢
              直播名称：${this.liveVo.subject}
              直播ID：${this.liveVo.id}
              开始时间：${this.liveVo.start_time}
              助理口令：${this.liveVo && this.liveVo.assistant_password ? this.liveVo.assistant_password : '未设置'}
              加入链接：${'/mywebinar/login/'+ this.liveVo.id }`;
    }
  },
  methods: {
    updateSwitch() {
      let roleSwitch = this.roleSwitch; // 目标
      this.roleSwitch = !roleSwitch;
      this.$fetch('privilegeOpen', {
        webinar_id: this.$route.params.str,
        is_privilege: Number(roleSwitch)
      }).then(res => {
        if (res && res.code === 200 && res.data.is_privilege === 1) {
          this.$message.success('开启成功');
          this.roleSwitch = !this.roleSwitch;
          // 获取 getPrivilegeInfo 活动角色配置接口
        }else if (res && res.code === 200 && res.data.is_privilege === 0) {
          this.$message.success('关闭成功');
          this.roleSwitch = !this.roleSwitch;
          // 获取 getPrivilegeInfo 活动角色配置接口
        } else if (res && res.code === 200 && res.data.type === 1) {
          this.$message.error('直播中不能设置该功能');
        } else if (res && res.code === 1001) {
          this.$message.error('直播中不能设置该功能');
        } else {
          this.$message.error(res.msg || roleSwitch ? `开启失败` : `开启失败`);
        }
      }).catch(er => {
        console.log(er);
        this.$message.error(roleSwitch ? `开启失败，` : `开启失败`);
      });
    },
    getPrivilegeInfo() {
      this.$fetch('privilegeInfo', {
        webinar_id: this.$route.params.str,
      }).then(res => {
          res && res.code === 200 && res.data ? this.privilegeVo = res.data : this.privilegeVo = {};
      }).catch(e => {
        console.log(e);
        this.privilegeVo = {};
      });
    },
    async getLiveInfo() {
      await this.$fetch('getWebinarInfo', {
        webinar_id: this.$route.params.str,
        user_id: '1330'
      }).then(res => {
        res && res.code === 200 && res.data ? this.liveVo = res.data : this.liveVo = {};
      }).catch(e => {
        console.log(e);
        this.liveVo = {};
      });
      this.getPrivilegeInfo();
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
    }
  },
  created() {
    // 根据ID获取活动信息
    this.getLiveInfo();
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
  font-family: PingFangSC-Medium, PingFang SC;
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
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
  margin-top: 4px;
}
.role-card-content {
  margin-top: 32px;
  /deep/.el-form-item__label {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
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
    font-family: PingFangSC-Regular, PingFang SC;
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
  font-family: PingFangSC-Regular, PingFang SC;
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
  font-family: PingFangSC-Regular, PingFang SC;
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
/deep/.el-checkbox__inner::after {
  border-color: #FB3A32;
  top: 2px;
  left: 5px;
}
</style>
