<template>
  <div class="vhall-saas-member">
    <div class="vhall-saas-member--list">
      <scroll class="vhall-list-container" ref="scroll" @pullingUp="handlePullingUp">
        <div v-show="tab===1" class="vhall-member-list-allusers">
          <div v-if="searchEmpty" class="empty-container" :style="{'padding-top': `${this.emptyContainerPaddingTop}px`}"><span class="iconzanwusousuo iconfont"></span><p>很抱歉，没有搜索到您要找的人</p></div>
          <template v-else v-for="user in onlineUsers">
            <div class="vhall-member-user" :key="user.account_id" v-if="user.is_kicked != 1">
              <div class="vhall-avatar-wrapper">
                <img
                  width="28"
                  height="28"
                  class="vhall-avatar"
                  :src="user.avatar ? user.avatar : defaultAvatar"
                />
                <img
                  v-show="user.device_type == '1'"
                  class="vhall-avatar-phone"
                  width="9"
                  height="12"
                  src="../../assets/images/common/phone.png"
                  alt
                />
              </div>
              <span class="vhall-member-user--name">{{user.nickname}}</span>
              <span
                class="vhall-member-user--role"
                :class="user.role_name | roleClassFilter"
                v-if="user.role_name != '2'"
              >{{user.role_name | roleFilter}}</span>
              <div class="vhall-member-user--control">
                <!-- 主讲人 -->
                <i
                  v-if="currentSpeakerId ==user.account_id"
                  class="vhall-member-user--control--user-icon iconfont iconxing"
                ></i>
                <!-- 显示条件：被禁言 -->
                <i
                  v-show="user.is_banned == 1"
                  class="vhall-member-user--control--user-icon iconfont iconjinyan"
                  style="color:#cccccc;"
                ></i>
                <!-- 显示条件：申请上麦 -->
                <i
                  v-show="user.isApply && applyUsers.find(u => u.account_id == user.account_id)"
                  class="vhall-member-user--control--user-icon iconfont iconxiamai"
                  style="color:#cccccc;font-size:15px;"
                ></i>
                <!-- 显示条件：上麦中 -->
                <i
                  v-if="currentSpeakerId !=user.account_id && user.is_speak"
                  class="vhall-member-user--control--user-icon iconfont iconxiamai1"
                  style="color:#fc5659;font-size:15px;"
                ></i>
                <!-- 显示条件：被踢出 -->
                <!-- <i class="vhall-member-user--control--user-icon iconfont"></i> -->
                <!-- 设备有问题不能上麦 -->
                <i
                  v-show="isInteract == '1' && user.device_status ==2"
                  style="color:#fc5659;font-size:15px;vertical-align: middle;"
                  class="iconfont iconhebingxingzhuang vhall-member-user--control--device-abnormal"
                ></i>
                <!-- 显示条件：列表中该用户不是是主持人 -->
                <template v-if="roleName == '1' && user.role_name != 1 && (isEnjoy && user.role_name == 3 || user.role_name != 3)">
                  <!--互动直播 没有被禁言 没有上麦 不是移动端 设备可以上麦-->
                  <i
                    v-show="isInteract == '1' && !user.is_banned && !user.is_speak && user.device_status ==1"
                    class="vhall-member-user--control--upmic"
                    @click="onMic(user.isApply,user.account_id)"
                  >上麦</i>
                  <!-- 显示条件：当前登录者是主持人  正在上麦 -->
                  <i
                    v-show="isInteract == '1' && user.is_speak"
                    class="vhall-member-user--control--downmic"
                    @click="downMic(user.account_id)"
                  >下麦</i>
                </template>
                <!-- 显示条件：列表中该用户是是主持人 -->
                <template v-if="roleName == '1' && user.role_name == 1 && user.device_status ==1">
                  <i
                    v-show="isInteract == '1' && !user.is_speak"
                    class="vhall-member-user--control--upmic"
                    @click="onMic(user.isApply,user.account_id)"
                  >上麦</i>
                  <!-- 显示条件：当前登录者是主持人  正在上麦 -->
                  <i
                    v-show="isInteract == '1' && user.is_speak && currentSpeakerId != userId"
                    class="vhall-member-user--control--downmic"
                    @click="downMic(user.account_id)"
                  >下麦</i>
                </template>
                <!-- class上的hide是为了hover的时候也不显示 -->

                <!-- more显示条件：当前登录者是主持人 1不是自己  2是自己但不是主讲人 -->
                <!-- more显示条件：当前登录者是嘉宾助理并且所选用户是观众 -->
                <i
                  v-if="roleName == '1' && user.account_id != userId"
                  @click.stop="getMore(user.account_id,user.role_name)"
                  class="vhall-member-user--control--more"
                ></i>
                <i
                  v-else-if="roleName == '1' && user.account_id == userId && currentSpeakerId != userId"
                  @click.stop="getMore(user.account_id,user.role_name)"
                  class="vhall-member-user--control--more"
                ></i>
                <i
                  v-else-if="(roleName == '3' || roleName=='4') && user.role_name == '2'"
                  @click.stop="getMore(user.account_id,user.role_name)"
                  class="vhall-member-user--control--more"
                ></i>
                <i v-else class="vhall-member-user--control--moreplaceholder"></i>
                <div v-show="user.showControl" class="vhall-member-user--control--detail">
                  <!-- 设置主讲显示条件：主讲/嘉宾 正在上麦  当前主讲人不是自己 -->
                  <div
                    v-if="isInteract && (user.role_name=='1' || user.role_name=='4') && user.is_speak && currentSpeakerId != user.account_id"
                    class="setspeaker"
                    @click="setSpeaker(user.account_id)"
                  >
                    <i></i>
                    <span>设为主讲</span>
                  </div>
                  <div
                    v-if="user.role_name != '1'"
                    class="setspeak"
                    @click="setBanned(user.account_id,user.is_banned)"
                  >
                    <i></i>
                    <span>{{user.is_banned ? '取消' : '聊天'}}禁言</span>
                  </div>
                  <div
                    v-if="user.role_name != '1'"
                    class="setkick"
                    @click="setKicked(user.account_id,user.is_kicked)"
                  >
                    <i></i>
                    <span>{{user.is_kicked ? '取消踢出' : '踢出活动'}}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-show="tab===2" class="vhall-member-list-raised">
          <div v-if="!applyUsers.length" class="empty-container" :style="{'padding-top': `${this.emptyContainerPaddingTop}px`}"><span class="iconzanwujushou iconfont"></span><p>暂无人举手</p></div>
          <div v-else class="vhall-member-user" v-for="user in applyUsers" :key="user.account_id">
            <div class="vhall-avatar-wrapper">
              <img
                width="28"
                height="28"
                class="vhall-avatar"
                :src="user.avatar ? user.avatar : defaultAvatar"
              />
              <img
                v-show="user.device_type == '1'"
                class="vhall-avatar-phone"
                width="9"
                height="12"
                src="../../assets/images/common/phone.png"
                alt
              />
            </div>
            <span class="vhall-member-user--name">{{user.nickname}}</span>
            <span
              class="vhall-member-user--role"
              :class="user.role_name | roleClassFilter"
              v-if="user.role_name != '2'"
            >{{user.role_name | roleFilter}}</span>
            <div class="vhall-member-user--control">
              <!-- 申请上麦图标 -->
              <i
                class="vhall-member-user--control--user-icon iconfont iconxiamai"
                style="color:#cccccc;font-size:15px;"
              ></i>

              <!-- 设备检测故障图标 -->
              <!-- <i
                v-if="user.device_type==2 && user.device_status ==2"
                class="vhall-member-user--control--device-abnormal"
              ></i>-->

              <!-- 同意上麦显示条件：当前登录者是主持人-->
              <i
                v-if="roleName == '1'"
                class="vhall-member-user--control--upmic"
                @click="consent(user.account_id)"
              >上麦</i>

              <!-- more显示条件：1、当前登录者是主持人-->
              <!-- more显示条件：2、当前登录者是嘉宾助理并且所选用户是观众 -->
              <i
                v-if="roleName == '1'"
                @click.stop="getMore(user.account_id,user.role_name)"
                class="vhall-member-user--control--more"
              ></i>
              <i
                v-else-if="(roleName == '3' || roleName=='4') && user.role_name == '2'"
                @click.stop="getMore(user.account_id,user.role_name)"
                class="vhall-member-user--control--more"
              ></i>
              <i v-else class="vhall-member-user--control--moreplaceholder"></i>

              <div v-show="user.showControl" class="vhall-member-user--control--detail">
                <div class="setspeak" @click="setBanned(user.account_id,user.is_banned)">
                  <i></i>
                  <span>聊天禁言</span>
                </div>
                <div class="setkick" @click="setKicked(user.account_id,user.is_kicked)">
                  <i></i>
                  <span>踢出活动</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="tab===3" class="vhall-member-list-limited">
          <div v-if="limitedUsersEmpty" class="empty-container" :style="{'padding-top': `${this.emptyContainerPaddingTop}px`}"><span class="iconzanwuchengyuan iconfont"></span><p>没有禁言或者踢出的成员</p></div>
          <div v-else class="vhall-member-user" v-for="user in limitedUsers" :key="user.account_id">
            <div class="vhall-avatar-wrapper">
              <img
                width="28"
                height="28"
                class="vhall-avatar"
                :src="user.avatar ? user.avatar : defaultAvatar"
              />
              <img
                v-show="user.device_type == '1'"
                class="vhall-avatar-phone"
                width="9"
                height="12"
                src="../../assets/images/common/phone.png"
                alt
              />
            </div>
            <span class="vhall-member-user--name">{{user.nickname}}</span>
            <span
              class="vhall-member-user--role"
              :class="user.role_name | roleClassFilter"
              v-if="user.role_name != '2'"
            >{{user.role_name | roleFilter}}</span>
            <div class="vhall-member-user--control">
              <!-- 显示条件：被禁言 -->
              <i
                v-show="user.is_banned"
                class="vhall-member-user--control--user-icon iconfont iconjinyan"
                style="color:#cccccc;"
              ></i>
              <!-- 显示条件：被踢出 -->
              <i
                v-show="user.is_kicked"
                class="vhall-member-user--control--user-icon iconfont icontichu"
                style="color:#cccccc;"
              ></i>
              <!-- 设备有问题不能上麦 -->
              <!-- <i
                v-if="user.device_type==2 && user.device_status ==2"
                class="vhall-member-user--control--device-abnormal"
              ></i>-->
              <!-- more显示条件：1、当前登录者是主持人-->
              <!-- more显示条件：2、当前登录者是嘉宾助理并且所选用户是观众 -->
              <i
                v-if="roleName == '1'"
                @click.stop="getMore(user.account_id,user.role_name)"
                class="vhall-member-user--control--more"
              ></i>
              <i
                v-else-if="(roleName == '3' || roleName=='4') && user.role_name == '2'"
                @click.stop="getMore(user.account_id,user.role_name)"
                class="vhall-member-user--control--more"
              ></i>
              <i v-else class="vhall-member-user--control--moreplaceholder"></i>

              <div v-show="user.showControl" class="vhall-member-user--control--detail">
                <!-- 显示条件：被禁言没被踢出 -->
                <div
                  v-show="user.is_banned && !user.is_kicked"
                  class="setspeak"
                  @click="setBanned(user.account_id,user.is_banned)"
                >
                  <i></i>
                  <span>{{user.is_banned ? '取消' : '聊天'}}禁言</span>
                </div>
                <div class="setkick" @click="setKicked(user.account_id,user.is_kicked)">
                  <i></i>
                  <span>{{user.is_kicked ? '取消踢出' : '踢出活动'}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
    </div>
    <div class="vhall-saas-member--control">
      <div class="vhall-saas-member--control__info">
        <i class="iconfont iconzaixianrenshu"></i>
        <span v-auth="100009" class="vhall-info-online-num">{{totalNum | transformWatchNum}}人在线</span>
        <span class="vhall-info-refresh" @click="refreshOnlineUsers">刷新</span>
        <div v-auth="100010" class="vhall-info-allow-handup">
          <label class="lb-raisehands" for="lb-raisehands">
            允许举手
            <input
              style="display:none;"
              v-model="allowHandup"
              @change="HandleAllwoHandup"
              type="checkbox"
              id="lb-raisehands"
            />
            <i class="ss">
              <em></em>
            </i>
          </label>
        </div>
      </div>
      <div class="vhall-saas-member--control__btns">
        <ul>
          <li @click="chooseTab(1)" class="vhall-member-btns-tab" :class="tab===1? 'active':''">全部</li>
          <li
            v-auth="100024"
            @click="chooseTab(2)"
            :class="['vhall-member-btns-tab', raiseHandTip ? 'raise-hand' : '',tab===2? 'active':'']"
          >举手</li>
          <li
            v-auth="100026"
            @click="chooseTab(3)"
            class="vhall-member-btns-tab"
            :class="tab===3? 'active':''"
          >受限</li>
        </ul>
        <div
          v-show="tab===1"
          @click="searchTab"
          class="vhall-member-btns-tab search-btn"
        >找人</div>
      </div>
      <div v-show="tab===1 && searchShow" class="vhall-saas-member--control__search">
        <input
          type="text"
          v-model.trim="searchUserInput"
          class="vhall-saas-member-input"
          placeholder="输入成员名称…"
        />
        <a href="javascript:;" @click="searchShow=false;searchUserInput='';" class="v-clear-btn"></a>
        <span class="v-search-confirm" @click="searchSomebody">确定</span>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import Scroll from '../scroll/scroll';
import _ from 'lodash';
export default {
  props: {
    speakerList: {
      required: true
    },
    status: {
      required: true
    },
    roomId: {
      required: true
    },
    // 是否允许举手
    PorpAllowHandup: {
      required: true
    },
    // 当前主讲人
    docPermissionId: {
      required: true
    },
    userId: {
      required: true
    },
    // 当前登录角色类型 1主持人 2观众 3助理 4嘉宾
    roleName: {
      required: true
    },
    isInteract: {
      required: true // 1是 0否
    },
    isEnjoy: {
      required: false, //
      default: false
    }
  },
  components: {
    Scroll
  },
  data () {
    return {
      allowHandup: this.PorpAllowHandup,
      onlineUsers: [],
      applyUsers: [],
      limitedUsers: [],
      tab: 1,
      searchShow: false,
      totalNum: 0,
      page: 0,
      searchUserInput: '',
      defaultAvatar: 'https://cnstatic01.e.vhall.com/3rdlibs/vhall-static/img/default_avatar.png',
      currentSpeakerId: this.docPermissionId, // 当前主讲人ID
      raiseHandTip: false, // 举手提示
      handsUpTimerList: {}, // 举手列表定时器列表
      searchEmpty: false, // 找人结果是否为空
      limitedUsersEmpty: false, // 被踢出用户是否为空
      emptyContainerPaddingTop: 10 // 容器内边距
    };
  },
  mounted () {
    this.init();

    this.listenEvent();
  },
  watch: {
    docPermissionId (newval) {
      this.currentSpeakerId = newval;
    },
    tab (newval) {
      this.$refs.scroll.refresh();
    },
    totalNum (newval) {
      this.$refs.scroll.refresh();
    }
  },
  filters: {
    roleFilter (value) {
      let ret = '';
      switch (Number(value)) {
        case 1:
          ret = '主持人';
          break;
        case 3:
          ret = '助理';
          break;
        case 4:
          ret = '嘉宾';
          break;
        default:
          ret = '未定义';
      }
      return ret;
    },
    roleClassFilter (value) {
      return value == '1' ? 'host' : value == '3' ? 'assistant' : 'guest';
    },
    transformWatchNum (num) {
      if (num < 10000) {
        return num;
      } else {
        let n = Math.floor(num / 10000);
        console.log('n', n);
        let l = Math.floor((num % 10000) / 1000);
        l = l === 0 ? '' : '.' + l;
        console.log('l', l);
        return n + l + '万';
      }
    }
  },
  methods: {
    init () {
      setTimeout(() => {
        this.getOnlineUsers();
      }, 2000);
      this.showControlClick = () => {
        if (!this.showControlAccountId) {
          return;
        }
        let list =
          this.tab === 1
            ? this.onlineUsers
            : this.tab === 2
              ? this.applyUsers
              : this.limitedUsers;
        this.changeUserStatus(this.showControlAccountId, list, {
          showControl: false
        });
        document.removeEventListener('click', this.showControlClick);
      };
    },
    listenEvent () {
      EventBus.$on('endLive', () => {
        this.allowHandup = false;
      });
      // 用户申请上麦
      EventBus.$on('vrtc_connect_apply', msg => {
        if (this.tab !== 2) {
          this.raiseHandTip = true;
        }
        // 如果申请人是自己
        if (msg.room_join_id == this.userId) {
          return;
        }
        let user = {
          account_id: msg.room_join_id,
          avatar: msg.avatar,
          device_status: msg.device_status,
          device_type: msg.device_type,
          nickname: msg.nick_name,
          role_name: msg.room_role
        };
        this.applyUsers.unshift(user);

        this.applyUsers = _.uniqBy(this.applyUsers, 'account_id');// 去重
        this.changeUserStatus(user.account_id, this.onlineUsers, {
          isApply: true
        });
        // 申请30秒后从列表去掉
        clearTimeout(this.handsUpTimerList[user.account_id]);
        delete this.handsUpTimerList[user.account_id];
        this.handsUpTimerList[user.account_id] = window.setTimeout(() => {
          clearTimeout(this.handsUpTimerList[user.account_id]);
          delete this.handsUpTimerList[user.account_id];
          this.changeUserStatus(user.account_id, this.onlineUsers, {
            isApply: false
          });
          this.applyUsers = this.applyUsers.filter(u => u.account_id != user.account_id);
          if (!this.applyUsers.length) {
            this.raiseHandTip = false;
          }
        }, 30000);
        this.$emit('memberUpdata');

        //  删除申请上麦消息提示 - 改用 主持端自动提示
        // if (this.roleName == 1)
        // this.$message.success({
        //   message: `收到${role}${msg.nick_name}的上麦申请`
        // })
      });

      // 用户取消申请上麦
      EventBus.$on('vrtc_connect_apply_cancel', msg => {
        this.raiseHandTip = false;
        this._deleteUser(msg.room_join_id, this.applyUsers);
        this.changeUserStatus(msg.room_join_id, this.onlineUsers, {
          isApply: false
        });
        clearTimeout(this.handsUpTimerList[msg.room_join_id]); // 取消下麦清楚定时器
        delete this.handsUpTimerList[msg.room_join_id];
      });
      // 同意用户申请上麦
      EventBus.$on('vrtc_connect_agree', msg => {
        this.raiseHandTip = false;
      });

      // 用户同意上麦邀请
      EventBus.$on('vrtc_connect_invite_agree', msg => {
        // if (msg.room_join_id == this.userId || this.roleName != 1) {
        //   return
        // }
        // let role = ''
        // if (msg.room_role == 2) {
        //   role = '观众'
        // } else if (msg.room_role == 4) {
        //   role = '嘉宾'
        // }
        // this.$message.warning({
        //   message: `${role}${msg.nick_name}同意了你的上麦邀请`
        // })
      });
      // 用户拒绝上麦邀请
      EventBus.$on('vrtc_connect_invite_refused', msg => {
        // 如果申请人是自己
        if (msg.room_join_id == this.userId || this.roleName != 1) {
          return;
        }
        let role = '';
        if (msg.room_role == 2) {
          role = '观众';
        } else if (msg.room_role == 4) {
          role = '嘉宾';
        }
        this.$message.warning({
          message: `${role}${msg.nick_name}拒绝了你的上麦邀请`
        });
      });
      // // 互动连麦成功
      EventBus.$on('vrtc_connect_success', msg => {
        this.changeUserStatus(msg.room_join_id, this.onlineUsers, {
          isApply: false,
          is_speak: 1
        });
        if (msg.room_join_id == this.userId && msg.room_role == 2) {
          return;
        }
        if (this.isInteract != 1 && msg.room_role == 1) {
          this.$message.success({ message: `直播发起成功` });
          return;
        }
        if (msg.room_join_id == this.userId) {
          this.$message.success({ message: `您已上麦` });
        } else {
          msg.room_role != 2 &&
            this.$message.success({ message: `${msg.nick_name}已上麦` });
        }
        clearTimeout(this.handsUpTimerList[msg.room_join_id]); // 取消下麦清楚定时器
        delete this.handsUpTimerList[msg.room_join_id];
        //
      });
      // 互动连麦断开成功
      EventBus.$on('vrtc_disconnect_success', msg => {
        this.changeUserStatus(msg.target_id, this.onlineUsers, {
          is_speak: 0
        });
        if (msg.target_id == this.userId) {
          this.$message.success({ message: `您已下麦` });
          return;
        }
        // 当前用户ID,解决俩次触发vrtc_connect_success会提示两次下麦消息
        if (this.LocalCatchTarget_id == msg.target_id) {
        } else {
          this.LocalCatchTarget_id = msg.target_id;
          if (msg.room_role != 2) {
            this.$message.success({ message: `${msg.nick_name}已下麦` });
          }
          setTimeout(() => {
            this.LocalCatchTarget_id = null;
          }, 3000);
        }
      });
      // 互动设置主讲人
      EventBus.$on('vrtc_speaker_switch', msg => {
        this.currentSpeakerId = msg.room_join_id;
      });

      // 加入房间
      EventBus.$on('Join', msg => {
        // 上线的人是自己，不做操作
        if (msg.sender_id == this.userId) {
          return;
        }
        let index = this._getUserIndex(msg.sender_id, this.onlineUsers);
        this.totalNum += 1;
        if (index >= 0) {
          return;
        }
        // 在线人数大于200不再添加到列表里，只能加载更多
        if (this.totalNum > 200) {
          return;
        }
        // 隐身模式登录
        if (msg.data.hide) {
          return;
        }
        // 从上麦人员列表中获取加入房间着是否上麦
        let speakIndex = this._getUserIndex(msg.sender_id, this.speakerList);
        console.log('speakerLists', JSON.stringify(this.speakerList));
        let { context } = msg;
        let user = {
          account_id: msg.sender_id,
          avatar: context.avatar,
          device_status: context.device_status,
          device_type: context.device_type,
          is_banned: Number(context.is_banned),
          nickname: context.nickname,
          role_name: context.role_name,
          is_speak: speakIndex >= 0 ? 1 : 0
        };
        this.onlineUsers.push(user);
        this.onlineUsers = this._sortUsers(this.onlineUsers);
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 50);
        if (msg.context.role_name == 4) {
          if (msg.sender_id == this.userId) {
            return;
          }
          this.$message.warning({ message: `${msg.context.nickname}加入房间` });
        }
      });
      // 离开房间
      EventBus.$on('Leave', msg => {
        if (msg.context.isAuthChat) return; // 如果是聊天审核页面不做任何操作d
        this.totalNum -= 1;
        this.totalNum < 0 && (this.totalNum = 0);
        this._deleteUser(msg.sender_id, this.onlineUsers);
        this._deleteUser(msg.sender_id, this.applyUsers); // 14273
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 50);
        if (msg.context.role_name == 1 && this.roleName != 1) {
          this.$message.warning({ message: `主持人暂时离开了页面，请稍等...` });
        }
        if (msg.context.role_name == 4) {
          this.$message.warning({ message: `${msg.context.nickname}离开房间` });
        }
      });
      // 设备检测
      EventBus.$on('vrtc_connect_device_check', msg => {
        if (msg.device_type != 2) {
          this.changeUserStatus(msg.room_join_id, this.onlineUsers, {
            device_type: msg.device_type
          });
        }
        if (msg.device_status != 0) {
          this.changeUserStatus(msg.room_join_id, this.onlineUsers, {
            device_status: msg.device_status
          });
        }
      });
      // 结束直播
      EventBus.$on('live_over', () => {
        setTimeout(() => {
          this.refreshOnlineUsers();
        }, 1000);
      });
      // 禁言某个用户
      EventBus.$on('disable', msg => {
        this.changeUserStatus(msg.data.target_id, this.onlineUsers, {
          is_banned: 1
        });
        this.changeUserStatus(msg.data.target_id, this.limitedUsers, {
          is_banned: 1
        });
        this.changeUserStatus(msg.data.target_id, this.applyUsers, {
          is_banned: 1
        });
        // 禁言并且是举手列表
        if (this.tab === 2) {
          this._deleteUser(msg.data.target_id, this.applyUsers);
        }
      });
      // 取消禁言某个用户
      EventBus.$on('permit', msg => {
        this.changeUserStatus(msg.data.target_id, this.onlineUsers, {
          is_banned: 0
        });
        this.changeUserStatus(msg.data.target_id, this.limitedUsers, {
          is_banned: 0
        });
        this.changeUserStatus(msg.data.target_id, this.applyUsers, {
          is_banned: 0
        });
      });
      // 在聊天列表里提出
      EventBus.$on('kicked_in_chat', msg => {
        if (msg.nextStatus) {
          this._deleteUser(msg.accountId, this.onlineUsers);
          this._deleteUser(msg.accountId, this.applyUsers);
        } else {
          // 取消踢出只能在受限列表操作
          this.getLimitedUsers();
        }
        this.refreshOnlineUsers();
      });
    },
    /**
     * 改变在线人员列表的状态
     */
    changeUserStatus (accountId, list, obj) {
      let item = list.find(item => item.account_id == accountId);
      if (!item) {
        return;
      }
      let index = list.findIndex(item => item.account_id == accountId);
      if (index >= 0) {
        Object.assign(item, obj);
        this.$set(list, index, item);
      }
    },
    /**
     * 得到在线人员列表
     */
    getOnlineUsers () {
      let data = {
        room_id: this.roomId,
        pos: this.page,
        limit: 10
      };
      if (this.searchUserInput) {
        Object.assign(data, { nickname: this.searchUserInput });
      }
      this.$fetch('getOnlineList', data).then(res => {
        console.warn('当前在线人员列表', res)
        if(res.code == 200){
          this.$refs.scroll.finishPullUp();
          if (this.isRefesh) {
            this.onlineUsers = this._sortUsers(res.data.list);
            this.isRefesh = false;
          } else {
            if (res.data.list.length) {
              let list = this.onlineUsers.concat(res.data.list);
              const deduplicatedList = _.uniqBy(list, 'account_id'); // 嘉宾主持人同时刷新页面 14069
              this.onlineUsers = this._sortUsers(deduplicatedList);
            } else {
              this.page--;
            }
          }
          if (this.searchUserInput && res.data.list.length == 0) {
            this.searchEmpty = true;
          } else {
            this.searchEmpty = false;
          }
          this.totalNum = res.data.total;
          setTimeout(() => {
            this.$refs.scroll.refresh();
          }, 50);
        }else{
          this.page--
        }
      }).catch(() => {
        this.page--
        this.isRefesh = false;
      });
    },
    /**
     * 得到在线人员列表
     */
    async getLimitedUsers () {
      let data = { room_id: this.roomId };
      try {
        let bannedList = await this.$fetch('v3GetBannedList', data);
        let kickedList = await this.$fetch('v3GetKickedList', data);
        let list = bannedList.data.list.concat(kickedList.data.list);
        let hash = {};
        this.limitedUsers = list.reduce((preVal, curVal) => {
          !hash[curVal.account_id] && (hash[curVal.account_id] = true && preVal.push(curVal));
          return preVal;
        }, []);
      } catch (error) {
        console.error('获取受限人员列表接口错误', error);
      }
    },
    /**
     * 将在线人员列表分为五个部分排序 主持人 / 上麦嘉宾 / 下麦嘉宾 / 助理 / 上麦观众 / 普通观众
     */
    _sortUsers (list) {
      let host = []; // 主持人
      let onMicGuest = []; // 上麦嘉宾
      let downMicGuest = []; // 下麦嘉宾
      let assistant = []; // 助理
      let onMicAudience = []; // 上麦观众
      let downMicAudience = []; // 普通观众
      list.forEach(item => {
        switch (Number(item.role_name)) {
          // 主持人
          case 1:
            host.push(item);
            break;

          // 观众
          case 2:
            item.is_speak
              ? onMicAudience.push(item)
              : downMicAudience.push(item);
            break;

          // 助理
          case 3:
            assistant.push(item);
            break;

          // 嘉宾
          case 4:
            item.is_speak ? onMicGuest.push(item) : downMicGuest.push(item);
            break;
          default:
            console.error('角色未定义');
        }
      });

      // 加载更多的时候，如果普通观众超过200，只显示后200
      if (downMicAudience.length > 200) {
        downMicAudience = downMicAudience.slice(-200);
      }
      return host.concat(
        onMicGuest,
        downMicGuest,
        assistant,
        onMicAudience,
        downMicAudience
      );
    },
    /**
     * 选择全部/举手/受限
     */
    async chooseTab (index) {
      this.searchUserInput = '';
      this.tab = index;
      if (index === 1) {} else if (index === 2) {
        this.raiseHandTip = false;
      } else if (index === 3) {
        await this.getLimitedUsers();
        if (this.limitedUsers.length == 0) {
          this.limitedUsersEmpty = true;
        } else {
          this.limitedUsersEmpty = false;
        }
      }
      if (this.$refs.scroll && this.$refs.scroll.$refs && this.$refs.scroll.$refs.vhallBaseScroll) {
        this.emptyContainerPaddingTop = this.$refs.scroll.$refs.vhallBaseScroll.scrollHeight / 2 - 60;
      }
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 50);
    },
    HandleAllwoHandup (e) {
      let data = {
        room_id: this.roomId,
        status: e.target.checked ? 1 : 0
      };
      this.$fetch('v3SetHandsup', data)
        .then(() => {
          this.$message.success({ message: '设置成功' });
        })
        .catch(error => {
          this.allowHandup = false;
          console.error('设置允许举手接口错误', error);
        });
    },
    /**
     * @description: 同意上麦
     * @param accountId {String} 用户ID
     * @return:
     */
    consent (accountId) {
      let data = {
        room_id: this.roomId,
        receive_account_id: accountId
      };
      console.warn('同意上麦------', data);
      // , {}, 4000 此处本要做 节流   暂去除
      this._deleteUser(accountId, this.applyUsers);
      this.$fetch('allowSpeak', data).then(res => {
        this._deleteUser(accountId, this.applyUsers);
      }).catch(() => {});
    },
    /**
     * 邀请上麦 / 同意上麦
     */
    onMic (isApply, accountId) {
      if (!this.status == 1) {
        this.$message.warning('活动还未开始');
        return;
      }

      if (isApply) {
        this.consent(accountId);
      } else {
        if (this.userId == accountId) {
          // 主持人自己上麦
          EventBus.$emit('applyByHost');
        } else {
          // 邀请其他人上麦
          let data = {
            room_id: this.roomId,
            receive_account_id: accountId
          };
          this.$fetch('v3InviteMic', data).then(res => {
            console.warn(res, '邀请上麦');
            this.$message.success({ message: '邀请发送成功' });
          }).catch(() => {});
        }
      }
    },
    /**
     * 用户下麦
     */
    downMic (accountId) {
      let data = {
        room_id: this.roomId,
        receive_account_id: accountId
      };
      console.warn('对上麦的用户进行下麦操作---------',data);
      this.$fetch('speakUserOff', data).then((res) => {
        console.warn(res, '8888');
      }).catch(error => {
        console.error('邀请上麦接口错误', error);
      });
    },
    /**
     *  列表删除用户
     * @param accountId {number} - 用户三方id
     */
    _deleteUser (accountId, list) {
      let index = this._getUserIndex(accountId, list);
      if (index >= 0) {
        list.splice(index, 1);
      }
    },
    /**
     * 获取用户信息
     * @param accountId {number} - 用户三方id
     */
    _getUserIndex (accountId, list) {
      return list.findIndex(item => item.account_id == accountId);
    },
    /**
     * 点击出现右侧操作条
     */
    getMore (accountId, roleName) {
      document.addEventListener('click', this.showControlClick);
      this.showControlAccountId = accountId;
      let list =
        this.tab === 1
          ? this.onlineUsers
          : this.tab === 2
            ? this.applyUsers
            : this.limitedUsers;
      list.forEach((l, index) => {
        this.$set(list, index, {...l, showControl: false});
      });
      this.changeUserStatus(accountId, list, {
        showControl: true
      });
    },
    refreshOnlineUsers () {
      if (this.isRefesh) {
        return;
      }
      this.page = 0;
      this.searchUserInput = '';
      this.isRefesh = true;
      this.getOnlineUsers();
    },
    /**
     * 禁言/取消禁言
     */
    setBanned (accountId, isBanned) {
      let nextStatus = isBanned==1 ? 0 : 1;
      let data = {
        receive_account_id: accountId,
        status: nextStatus,
        room_id: this.roomId
      };
      this.$fetch('setBanned', data).then(res=>{
        console.warn('禁言---res',res)
      }).catch(err=>{
        console.warn('禁言---res',err);
      });
    },
    /**
     * 踢出/取消踢出
     */
    setKicked (accountId, isKicked) {
      console.log(isKicked ,'isKicked')
      let nextStatus = isKicked==1 ? 0 : 1;
      let confirmText = nextStatus
        ? '您确定要执行踢出操作？'
        : '您确定要执行取消踢出操作？';
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      })
        .then(() => {
          let data = {
            receive_account_id: accountId,
            status: nextStatus,
            room_id: this.roomId
          };
          this.$fetch('setKickOut', data).then(() => {
            // 踢出只能在在线和举手列表操作
            if (nextStatus) {
              this._deleteUser(accountId, this.onlineUsers);
              this._deleteUser(accountId, this.applyUsers);
            } else {
              // 取消踢出只能在受限列表操作
              this.getLimitedUsers();
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 设置主讲人
     */
    setSpeaker (accountId) {
      const data = {
        receive_account_id: accountId,
        room_id: this.roomId
      };
      EventBus.$emit('SETSPEAKER', data);
    },
    /**
     * 找人
     */
    searchSomebody () {
      if (!this.searchUserInput) {
        return;
      }
      this.page = 0;
      this.isRefesh = true;
      this.getOnlineUsers();
    },

    handlePullingUp () {
      this.page++;
      console.warn(this.page, 'dsf');
      this.getOnlineUsers();
    },
    refresh () {
      this.$refs.scroll.refresh();
    },
    searchTab () {
      this.searchShow = !this.searchShow;
      if (this.$refs.scroll && this.$refs.scroll.$refs && this.$refs.scroll.$refs.vhallBaseScroll) { // 计算提示高度
        this.emptyContainerPaddingTop = this.$refs.scroll.$refs.vhallBaseScroll.scrollHeight / 2 - 60;
      }
    }
  }
};
</script>
<style lang="less">
ul,
li {
  list-style: none;
}
.vhall-saas-member {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #434343;
  font-size: 12px;
  &--list {
    flex: 1;
    position: relative;
    .vhall-list-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .empty-container{
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        span{
          font-size: 80px;
          color: #7e7e7e;
        }
        p{
          margin-top: 10px;
          color: #999999;
        }
      }
      // overflow-y: scroll;
      .vhall-member-user {
        color: #999999;
        height: 44px;
        line-height: 44px;
        padding: 8px 10px 8px 14px;
        position: relative;
        font-size: 12px;
        box-sizing: content-box;
        .vhall-avatar-wrapper {
          display: inline-block;
          position: relative;
          .vhall-avatar {
            display: inline-block;
            border-radius: 50%;
            border: 1px solid rgba(221, 221, 221, 0.3);
            vertical-align: middle;
          }
          .vhall-avatar-phone {
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
        &--name {
          display: inline-block;
          max-width: 108px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
          margin: 0 6px 0 9px;
        }
        &--role {
          display: inline-block;
          text-align: center;
          width: 44px;
          height: 15px;
          line-height: 15px;
          border-radius: 100px;
          vertical-align: middle;
          font-size: 10px;
          &.host {
            background-color: rgba(252, 86, 89, 0.15);
            color: #fc5659;
          }
          &.assistant {
            background-color: rgba(166, 166, 166, 0.15);
            color: #a6a6a6;
          }
          &.guest {
            background-color: rgba(77, 161, 255, 0.15);
            color: #4da1ff;
          }
        }
        &--control {
          float: right;
          // margin-top: 3px;
          &--user-icon {
            color: #ff9446;
            font-size: 13px;
            vertical-align: middle;
          }
          &--device-abnormal {
          }
          &--upmic,
          &--downmic {
            display: inline-block;
            width: 30px;
            height: 16px;
            background: rgba(221, 221, 221, 0.15);
            border-radius: 4px;
            color: #dddddd;
            text-align: center;
            vertical-align: middle;
            line-height: 14px;
            font-style: normal;
            letter-spacing: 1px;
            cursor: pointer;
          }
          &--more {
            display: inline-block;
            width: 13px;
            height: 13px;
            vertical-align: middle;
            margin-left: 3px;
            opacity: 0;
            color: #cccccc;
            font-size: 12px;
            background: url('../../assets/images/common/more.png') no-repeat
              center;
            background-size: 13px 3px;
            // &.hide {
            //   opacity: 0;
            // }
          }
          &--moreplaceholder {
            display: inline-block;
            width: 13px;
            height: 13px;
            vertical-align: middle;
            margin-left: 3px;
            opacity: 0;
          }
          &--detail {
            position: absolute;
            top: 5px;
            right: 8px;
            z-index: 2;
            width: 96px;
            padding: 6px 0;
            background-color: #ffffff;
            border-radius: 4px;
            box-shadow: 0px 1px 9px 0px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            box-sizing: border-box;
            cursor: pointer;
            & > div {
              height: 28px;
              color: #666666;
              text-align: center;
              line-height: 28px;
              padding: 0;
              &:hover {
                background-color: #fc5659;
                color: #fff;
              }
            }
          }
        }
        &:hover {
          background-color: #2d2d2d;
          .vhall-member-user--control--more {
            opacity: 1;
            &.hide {
              opacity: 0;
            }
          }
        }
      }
    }
  }
  &--control {
    position: relative;
    width: 100%;
    height: 80px;
    padding: 10px;
    background-color: #34363a;
    box-sizing: border-box;
    &__info {
      color: #e2e2e2;
      .iconzaixianrenshu {
        margin-top: -3px;
        vertical-align: middle;
        margin-right: 4px;
      }
      .vhall-info-online-num {
        display: inline-block;
        margin-left: 6px;
        color: #ababab;
      }
      .vhall-info-refresh {
        display: inline-block;
        margin-left: 6px;
        color: #ababab;
        cursor: pointer;
        &:hover {
          color: #4da1ff;
        }
      }
      .vhall-info-allow-handup {
        float: right;
        .lb-raisehands {
          cursor: pointer;
          color: #ccc;
          font-size: 12px;
          margin-right: 1px;
          & > input:checked + i em {
            border-color: #ff9446;
            left: 22px;
            transition: all 0.1s ease-in-out;
          }
          & > i {
            display: inline-block;
            width: 30px;
            height: 14px;
            background-color: #242527;
            border-radius: 100px;
            position: relative;
            margin-left: 5px;
            position: relative;
            top: 3px;
            & > em {
              box-sizing: border-box;
              position: absolute;
              top: 2px;
              left: 0px;
              content: '';
              width: 10px;
              height: 10px;
              background-color: #242527;
              border: 2px solid #aaaaaa;
              border-radius: 10px;
              transition: all 0.1s ease-in-out;
              backface-visibility: hidden;
              transform-style: preserve-3d;
            }
          }
        }
      }
    }
    &__btns {
      margin-top: 10px;
      & > ul {
        float: left;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        overflow: hidden;
      }
      .vhall-member-btns-tab {
        width: 74px;
        height: 30px;
        text-align: center;
        background-color: #666666;
        color: #cacaca;
        float: left;
        cursor: pointer;
        position: relative;
        margin-right: 1px;
        &:hover {
          background-color: #969696;
          color: #fff;
        }
        &.active {
          background-color: #fc5659;
          color: #fff;
          &:hover {
            color: #fff;

            background-color: #fc5659;
          }
        }
        &.raise-hand {
          &::before {
            content: ' ';
            top: 6px;
            right: 6px;
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background-color: #fc5659;
            position: absolute;
          }
        }
      }
      .search-btn {
        float: right;
        width: 50px;
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        background-color: #666666;
      }
    }
    &__search {
      width: 300px;
      height: 30px;
      position: absolute;
      top: 4px;
      left: 10px;
      background-color: #34363a;
      border-radius: 4px;
      overflow: hidden;
      .vhall-saas-member-input {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 0 75px 0 10px;
        border: none;
        color: #666666;
      }
      .v-clear-btn {
        width: 15px;
        height: 15px;
        position: absolute;
        top: 7px;
        right: 55px;
        background-image: url('../../assets/images/common/account-file-close-default.png');
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .v-search-confirm {
        display: inline-block;
        width: 50px;
        height: 30px;
        line-height: 30px;
        border-radius: 0 4px 4px 0;
        text-align: center;
        background-color: #a6a6a8;
        color: #ffffff;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
    }
  }
}
</style>
