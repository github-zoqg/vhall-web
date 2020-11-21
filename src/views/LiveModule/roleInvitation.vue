<template>
  <div>
    <pageTitle title="角色设置">
      <div slot="content">
        1、互动直播中，通过网页端和客户端登录的主持人和嘉宾，都可以进行连麦互动；<br/>
        2、权限控制可调整嘉宾和助理在直播中的功能；<br/>
        3、拥有文档管理权限后，只有拥有演讲权限的人才可进行文档演示、调整观看布局、涂鸦等操作；<br/>
      </div>
      <el-switch
        class="el-role-switch"
        v-model="roleSwtich"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        active-text="开启后，可邀请特殊角色加入直播">
      </el-switch>
    </pageTitle>
    <!-- 角色邀请卡片 -->
    <div class="role-card-list">
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
            <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234"></el-input>
          </el-form-item>
          <el-form-item label="口令">
            <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234">
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
          <el-button type="primary" round>邀请</el-button>
        </div>
      </div>
      <!-- 嘉宾 -->
      <div class="role-card">
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
            <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234"></el-input>
          </el-form-item>
          <el-form-item label="口令">
            <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234">
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
          <el-button type="primary" round>邀请</el-button>
        </div>

      </div>
      <!-- 助理 -->
      <div class="role-card">
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
            <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234"></el-input>
          </el-form-item>
          <el-form-item label="口令">
            <el-input placeholder="https://t.e.vhall.com/mywebinar/host-login/394637234">
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
          <el-button type="primary" round>邀请</el-button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: 'embedCard.vue',
  components: {
    PageTitle
  },
  data() {
    return {
      roleSwtich: false
    };
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
  /deep/.el-input-group__append, /deep/.el-input-group__prepend {
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
  }
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
