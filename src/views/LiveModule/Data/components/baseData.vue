<template>
  <div class="base-data">
    <div class="base-title">
      <span>
        <b></b>
        基础统计
      </span>
      <el-tooltip effect="dark" placement="right" v-tooltipMove>
        <div slot="content">
          1.预约人数：统计预告状态下有多少人预约了当前活动，数据统计不去重
          <br />
          2.报名表单：应用在直播整个环节（预告+直播+回放），统计当前活动多少人进行报名，数据去重
          <br />
          3.试看：回放或点播观看限制设置试看后，统计多少人进行了试看，数据去重
          <br />
          4.邀请排名：所有生成过邀请卡的观众都参与此排名；邀请人数相同的，按邀请人首次观看时间排名
          <br />
          5.分享用户分享的链接被他人访问1次有效分享数记为1，同设备当天重复访问只统计1次，统计范围：微信、微博、QQ
        </div>
        <i class="iconfont-v3 saasicon_help_m"></i>
      </el-tooltip>
    </div>
    <el-row :gutter="40">
      <el-col class="liveItem">
        <div class="base-item" v-if="isStatus != 4" @click="exportSubscribeInfo">
          <p>导出</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_appointment@2x.png" alt="" />
            </label>
            <!-- <icon icon-class="saasicon_yuyue"></icon> -->
            <div class="base-text">
              <span>预约（人）</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.subscribeNum"
                  :duration="1500"
                  v-if="dataInfo.subscribeNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="exportAnswer">
          <p>导出</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_registration form@2x.png" alt="" />
            </label>

            <!-- <icon icon-class="saasicon_baomingbiaodan"></icon> -->
            <div class="base-text">
              <span>报名表单（人）</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.answerNum"
                  :duration="1500"
                  v-if="dataInfo.answerNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="exportPreviewInfo">
          <p>导出</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_And proved@2x.png" alt="" />
            </label>

            <!-- <icon icon-class="saasicon_shikan"></icon> -->
            <div class="base-text">
              <span>试看（人）</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.previewNum"
                  :duration="1500"
                  v-if="dataInfo.previewNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="lookOption('邀请排名', 100445)">
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_ranking@2x.png" alt="" /></label>
            <!-- <icon icon-class="saasicon_yaoqingpaiming"></icon> -->
            <div class="base-text">
              <span>邀请排名（人）</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.inviteNum"
                  :duration="1500"
                  v-if="dataInfo.inviteNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="exportShare">
          <p>导出</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_share@2x.png" alt="" /></label>
            <!-- <icon icon-class="saasicon_fenxiangpaiming"></icon> -->

            <div class="base-text">
              <span>分享排名（条）</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.shareNum"
                  :duration="1500"
                  v-if="dataInfo.shareNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="base-title">
      <span>
        <b></b>
        互动统计
      </span>
      <el-tooltip effect="dark" placement="right" v-tooltipMove>
        <div slot="content">
          1.聊天：{{
            webinarType == 6
              ? '统计当前活动总计发送了多少条聊天，条数显示为主直播间的，支持查看明细，支持小组聊天记录导出'
              : '统计当前活动总计发送了多少条聊天，支持查看明细'
          }}
          <br />
          2.问答：开启问答后，当前活动总计发送了多少条问答，支持查看明细
          <br />
          3.点赞：当前活动总计收到多少次点赞，数据统计不去重
          <br />
          4.签到：推送签到后，统计多少人进行了签到，支持查看明细
          <br />
          5.问卷：推送问卷后，统计多少人填写了问卷，支持查看明细
          <br />
          6.快问快答：推送快问快答后，统计多少人提交了快问快答，支持查看明细
          <br />
          7.抽奖：推送抽奖后，统计多少人中奖，支持查看明细
          <br />
          8.发群红包：发送红包后，统计发送红包的金额，支持查看明细
          <br />
          9.打赏：观众对当前活动打赏的金额统计
          <br />
          10.礼物：观众对当前活动赠送礼物的金额统计
          <br />
          11.连麦：分组活动支持，统计多少条连麦数据
          <br />
          12.分组：分组讨论后，统计分组时间、分组次数、支持查看明细
        </div>
        <i class="iconfont-v3 saasicon_help_m"></i>
      </el-tooltip>
    </div>
    <el-row :gutter="40">
      <el-col class="liveItem">
        <div class="base-item" @click="lookOption('聊天', 100447)">
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_ban@2x.png" alt="" /></label>
            <div class="base-text">
              <span>聊天(条)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.chatNum"
                  :duration="1500"
                  v-if="dataInfo.chatNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus != 4" @click="lookOption('问答', 100448)">
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_Question@2x.png" alt="" /></label>
            <div class="base-text">
              <span>问答(条)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.recordNum"
                  :duration="1500"
                  v-if="dataInfo.recordNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" style="cursor: default">
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_like@2x.png" alt="" /></label>
            <div class="base-text">
              <span>点赞(次)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.likeNum"
                  :duration="1500"
                  v-if="dataInfo.likeNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus != 4" @click="lookOption('签到', 100449)">
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_Sign@2x.png" alt="" /></label>
            <div class="base-text">
              <span>签到(人)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.signNum"
                  :duration="1500"
                  v-if="dataInfo.signNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus != 4" @click="lookOption('问卷', 100450)">
          <p>查看</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_questionnaire@2x.png" alt="" />
            </label>
            <div class="base-text">
              <span>问卷(人)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.submitNum"
                  :duration="1500"
                  v-if="dataInfo.submitNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="lookOption('快问快答', 'TODO')">
          <p>查看</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_questionnaire@2x.png" alt="" />
            </label>
            <div class="base-text">
              <span>快问快答(人)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.examSubmitNum"
                  :duration="1500"
                  v-if="dataInfo.examSubmitNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div class="base-item" v-if="isStatus != 4" @click="lookOption('抽奖', 100451)">
          <p>查看</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_Lucky draw@2x.png" alt="" />
            </label>
            <div class="base-text">
              <span>抽奖(人)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.prizeNum"
                  :duration="1500"
                  v-if="dataInfo.prizeNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <div
          class="base-item"
          v-if="isStatus != 4 && webinarType != 5"
          @click="lookOption('现金红包', 100452)"
        >
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_envelope@2x.png" alt="" /></label>
            <div class="base-text">
              <span>现金红包(元)</span>
              <h1 class="custom-font-barlow">{{ dataInfo.redpacketMoney }}</h1>
            </div>
          </div>
        </div>
        <div
          class="base-item"
          v-if="isStatus != 4 && webinarType != 5"
          @click="lookOption('口令红包', '')"
        >
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/codeRedPacket.png" alt="" /></label>
            <div class="base-text">
              <span>口令红包(次)</span>
              <h1 class="custom-font-barlow">{{ dataInfo.codeRedPacketCount }}</h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="exportReward">
          <p>导出</p>
          <div class="base-main">
            <label>
              <img src="../../../../common/images/icon/icon_exceptional@2x.png" alt="" />
            </label>
            <div class="base-text">
              <span>打赏(元)</span>
              <h1 class="custom-font-barlow">{{ dataInfo.rewardMoney }}</h1>
            </div>
          </div>
        </div>
        <div class="base-item" @click="exportGift">
          <p>导出</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_gift@2x.png" alt="" /></label>
            <div class="base-text">
              <span>礼物(元)</span>
              <h1 class="custom-font-barlow">
                {{ dataInfo.gitMoney }}
              </h1>
            </div>
          </div>
        </div>
        <!-- 二期关注用户入口，先隐藏 <div class="base-item" @click="lookOption('关注用户', 100445)">
          <p>查看</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_ranking@2x.png" alt=""></label>
            <div class="base-text">
              <span>关注用户（人）</span>
              <h1 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="dataInfo.followersNum"
                  :duration="1500"
                  v-if="dataInfo.followersNum >= 0">
                </count-to>
              </h1>
            </div>
          </div>
        </div> -->
        <div
          class="base-item"
          v-if="isStatus != 4 && [3, 6, '3', '6'].includes(webinarType)"
          @click="exportSpeak"
        >
          <p>导出</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_whea@2x.png" alt="" /></label>
            <div class="base-text">
              <span>连麦(条)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.speakNum"
                  :duration="1500"
                  v-if="dataInfo.speakNum >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
        <!-- 分组直播-分组导出，不是点播&是分组直播展示 -->
        <div class="base-item" v-if="isStatus != 4 && webinarType == 6" @click="exportGroup">
          <p>导出</p>
          <div class="base-main">
            <label><img src="../../../../common/images/icon/icon_group@2x.png" alt="" /></label>
            <div class="base-text">
              <span>分组(次)</span>
              <h1 class="custom-font-barlow">
                <count-to
                  :startVal="0"
                  :endVal="dataInfo.groupSwitchCount"
                  :duration="1500"
                  v-if="dataInfo.groupSwitchCount >= 0"
                ></count-to>
              </h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import CountTo from 'vue-count-to';
  import { sessionOrLocal } from '@/utils/utils';
  import examServer from '@/utils/examServer';
  export default {
    data() {
      return {
        userId: JSON.parse(sessionOrLocal.get('userId')),
        vm: null,
        dataInfo: {
          previewNum: 0,
          answerNum: 0,
          subscribeNum: 0, //预约
          recordNum: 0,
          rewardMoney: 0,
          redpacketMoney: 0,
          codeRedPacketCount: 0,
          gitMoney: 0,
          prizeNum: 0,
          inviteNum: 0,
          shareNum: 0,
          chatNum: 0,
          likeNum: 0,
          signNum: 0,
          submitNum: 0,
          speakNum: 0,
          groupSwitchCount: 0,
          WEBINAR_PES: {}
        }
      };
    },
    components: {
      CountTo
    },
    props: {
      isStatus: {
        type: Number,
        default: 1
      },
      webinarType: {
        type: Number,
        default: 1
      }
    },
    watch: {
      webinarType() {
        if (this.webinarType == 3) {
          this.speakContactInfo();
        } else if (this.webinarType == 6) {
          this.speakContactInfo();
          this.getGroupStatics();
        }
      }
    },
    async mounted() {
      this.roomId = this.$route.query.roomId;
      await this.getConfigListIsOpen(1, this.$route.params.str);
      this.getAllDataInfo();
      if (this.isStatus != 4) {
        // 点播不需要调用
        this.getOtherInfo();
      }
      this.getOtherInfo();
    },
    methods: {
      //文案提示问题
      messageInfo() {
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: '导出申请成功，请去下载中心下载',
          type: 'success',
          customClass: 'zdy-info-box'
        });
      },
      // 获取活动层级 —— 配置项开关 / 具体配置项值
      getConfigListIsOpen(scene = 1, webinar_id = '') {
        let params = {
          webinar_id: webinar_id,
          webinar_user_id: this.userId,
          scene_id: scene
        };
        return this.$fetch('planFunctionGet', this.$params(params), {
          'gray-id': this.userId
        })
          .then(res => {
            if (res && res.code === 200 && res.data.permissions) {
              const data = JSON.parse(res.data.permissions);
              this.WEBINAR_PES = data || {};
            }
          })
          .catch(e => {
            console.log('刷新等情况下获取活动下接口配置项情况，异常不做任何处理');
          });
      },
      getAllDataInfo() {
        // 预约  报名表单（人）  试看（人）
        this.$fetch('getAnswerListInfo', { webinar_id: this.$route.params.str }).then(res => {
          this.dataInfo.previewNum = res.data.preview || 0;
          this.dataInfo.subscribeNum = res.data.subscribe || 0;
          this.dataInfo.answerNum = res.data.regform || 0;
        });
        // 邀请排名
        this.$fetch('getInviteListInfo', { webinar_id: this.$route.params.str }).then(res => {
          this.dataInfo.inviteNum = res.data.total || 0;
        });
        // 分享排名
        this.$fetch('getShareListInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.shareNum = res.data.total || 0;
        });
        // 聊天
        this.$fetch('getChatListInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.chatNum = res.data.total || 0;
        });
        // 点赞
        this.$fetch('getRoomLikeInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.likeNum = res.data.total || 0;
        });
        // 打赏统计
        this.$fetch('getRewardListInfo', { webinar_id: this.$route.params.str }).then(res => {
          this.dataInfo.rewardMoney = res.data.total_money || 0;
        });
        // 礼物(元)
        this.$fetch('getGiftIncome', { room_id: this.roomId }).then(res => {
          this.dataInfo.gitMoney = res.data.total_money || 0;
        });
      },
      getOtherInfo() {
        //问答
        this.$fetch('getRecodrderInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.recordNum = res.data.total || 0;
        });
        // 签到
        this.$fetch('getSignInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.signNum = res.data.total || 0;
        });
        // 问卷提交人数
        this.$fetch('getSurveyInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.submitNum = res.data.submit_nums || 0;
        });
        // 快问快答提交人数
        examServer
          .getExamAnserCount({
            source_id: this.$route.params.str,
            source_type: 1
          })
          .then(res => {
            console.log('🚀 ~ file: baseData.vue ~ line 548 ~ getOtherInfo ~ res', res);
            this.dataInfo.examSubmitNum = res.data.count || 0;
          });
        // 获取抽奖人数
        this.$fetch('getPrizeUserInfo', { webinar_id: this.$route.params.str }).then(res => {
          this.dataInfo.prizeNum = res.data.count || 0;
        });
        // 发红包
        this.$fetch('getRedpacketInfo', { webinar_id: this.$route.params.str }).then(res => {
          this.dataInfo.redpacketMoney = res.data.send_amount || 0;
        });
        // 口令红包
        this.$fetch('getCodeRedpacketInfo', { webinar_id: this.$route.params.str }).then(res => {
          this.dataInfo.codeRedPacketCount = res.data.count || 0;
        });
      },
      // 连麦(条)
      speakContactInfo() {
        this.$fetch('getSpeakListInfo', { room_id: this.roomId }).then(res => {
          this.dataInfo.speakNum = res.data.total || 0;
        });
      },
      // 分组（次）
      getGroupStatics() {
        this.$fetch('getGroupStatics', { room_id: this.roomId }).then(res => {
          this.dataInfo.groupSwitchCount = res.data.group_switch_count || 0;
        });
      },
      // 预约-导出
      exportSubscribeInfo() {
        this.$fetch('exportSubscribe', { webinar_id: this.$route.params.str }).then(res => {
          this.$vhall_paas_port({
            k: 100442,
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
          if (this.vm) {
            console.log('11111111111');
            this.vm.close();
          }
          console.log('222222222');
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 试看-导出
      exportPreviewInfo() {
        this.$fetch('exportPreview', { webinar_id: this.$route.params.str }).then(res => {
          this.$vhall_paas_port({
            k: 100444,
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
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 分享导出
      exportShare() {
        this.$fetch('exportShareInfo', { room_id: this.roomId }).then(res => {
          this.$vhall_paas_port({
            k: 100446,
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
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      //报名表单导出
      exportAnswer() {
        this.$fetch('exportForm', { webinar_id: this.$route.params.str }).then(res => {
          this.$vhall_paas_port({
            k: 100443,
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
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      //打赏---导出
      exportReward() {
        this.$fetch('exportReward', { webinar_id: this.$route.params.str }).then(res => {
          this.$vhall_paas_port({
            k: 100453,
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
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 礼物---导出
      exportGift() {
        this.$fetch('exportGift', { room_id: this.roomId }).then(res => {
          this.$vhall_paas_port({
            k: 100454,
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
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 连麦---导出
      exportSpeak() {
        this.$fetch('exportSpeak', { room_id: this.roomId }).then(res => {
          this.$vhall_paas_port({
            k: 100455,
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
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 分组直播 --- 导出
      exportGroup() {
        this.$fetch('exportGroupList', { room_id: this.roomId }).then(res => {
          // this.$vhall_paas_port({
          //   k: 100455,
          //   data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          // })
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo();
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      lookOption(title, index) {
        if (index) {
          this.$vhall_paas_port({
            k: index,
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
        this.$router.push({
          path: '/live/interactionDetail',
          query: {
            roomId: this.roomId,
            id: this.$route.params.str,
            title: title,
            wType: this.webinarType
          }
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .base-data {
    /deep/.el-button {
      border: none;
      background: transparent;
    }
    /deep/.el-button.is-circle {
      padding: 3px;
    }
    .base-title {
      margin-bottom: 12px;
      span {
        display: inline-block;
        font-size: 20px;
        color: #333333;
        line-height: 20px;
        b {
          float: left;
          width: 4px;
          height: 18px;
          background: #fb3a32;
          margin-right: 5px;
          margin-top: 2px;
        }
      }
      i {
        font-size: 16px;
        padding: 0 2px;
      }
    }
    .liveItem {
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      // margin-right: -24px;
      // align-items: center;
      .base-item {
        height: 120px;
        width: 323px;
        margin-bottom: 24px;
        margin-right: 24px;
        position: relative;
        border-radius: 4px;
        background: #fff;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.15s ease-in;
        &:nth-child(4n) {
          margin-right: 24px;
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
        p {
          position: absolute;
          font-size: 12px;
          top: 14px;
          right: 16px;
          color: #666;
        }
        .base-main {
          height: 100%;
          margin: 35px 0 0 36px;
          display: flex;
          // /deep/.svg-icon{
          //   font-size: 38px;
          //   color: #FB3A32;
          // }
          label {
            width: 44px;
            height: 44px;
            img {
              width: 100%;
              height: 100%;
              object-fit: scale-down;
            }
          }

          .base-text {
            margin-left: 15px;
            span {
              color: #666;
            }
            h1 {
              font-size: 28px;
              color: #1a1a1a;
              font-weight: bold;
              line-height: 35px;
              // padding-top: 5px;
              span {
                color: #1a1a1a;
                font-weight: bold;
              }
            }
          }
        }
        &:hover {
          border: 1px solid #fb3a32;
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
          // border-radius: 4px;
        }
      }
    }
  }
  @media (min-width: 1920px) {
    .base-data .liveItem .base-item {
      &:nth-child(3n) {
        margin-right: 24px;
      }
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
  }
</style>
