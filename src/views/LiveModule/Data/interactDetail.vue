<template>
  <div class="data-detail">
    <pageTitle :pageTitle="title">
      <div slot="content" v-if="title == '现金红包'">
        主办方发送的红包未领取完时，会在直播结束时退回到财务中心-账户收益-
        <br />
        红包收益中。
      </div>
      <div slot="content" v-if="title == '聊天' && $route.query.wType == 6">
        1.分组模式下，仅展示主直播间最近聊天数据，更多内容请「导出分组数据」查看
        <br />
        2.点击“导出分组数据”，将导出每个小组内的聊天数据
      </div>
      <div slot="content" v-if="title == '聊天' && $route.query.wType != 6">
        1.仅展示最近聊天数据，更多内容请「导出全部数据」查看
      </div>
      <div slot="content" v-if="title == '关注用户'">
        此列表用户来自于微信，在直播页中主动点击关注接受发送消息通知的用户（非微信粉丝）
      </div>
      <div slot="content" v-if="title == '快问快答'">
        1.查看人数：主办方推送快问快答至观看端，仅查看题目未进行作答的人数，人数排重
        <br />
        2.答题人数：主办方推送快问快答至观看端，参与答题的人数（包含主动交卷、人工及系统收卷），人数排重
        <br />
        3.满分率：（满分人数/提交人数）*100%
        <br />
        4.平均分：本次答题的总分数除以答题人数
        <br />
      </div>
    </pageTitle>
    <div class="operaBox">
      <div class="searchBox" v-show="totalNum || isSearch">
        <VhallInput
          v-model="searchText"
          v-clearEmoij
          :placeholder="placeholder"
          v-if="title == '邀请排名'"
          style="margin-right: 20px"
          @keyup.enter.native="searchInviteInfo"
          @clear="searchInviteInfo"
          clearable
        >
          <i
            slot="suffix"
            class="el-icon-search el-input__icon"
            @click="searchInviteInfo"
            style="cursor: pointer; line-height: 36px"
          ></i>
        </VhallInput>
        <!-- <el-input
          :placeholder="placeholder"
          v-if="title=='邀请排名'"
          style="margin-right: 20px;"
          v-model="searchText">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix">
          </i>
        </el-input> -->
        <el-date-picker
          v-model="searchTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          @change="changeDate"
          prefix-icon="iconfont-v3 saasicon_date"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width: 240px; margin-right: 20px"
          v-if="title === '聊天' || title === '问答' || title === '关注用户'"
        />
        <el-button
          size="medium"
          round
          v-if="title === '聊天' || title === '问答'"
          :disabled="!isSeletedCheckout"
          @click="deleteAll(null)"
        >
          批量删除
        </el-button>
      </div>
      <span class="search-export">
        <el-button round size="medium" @click="exportData" v-if="title != '聊天' && totalNum">
          导出数据
        </el-button>
        <el-dropdown
          v-if="$route.query.wType != 6 && title == '聊天' && totalNum"
          @command="exportData"
          trigger="click"
        >
          <el-button type="primary" round size="medium" class="create_but_padding">
            &nbsp; 导出数据 &nbsp;
          </el-button>
          <el-dropdown-menu slot="dropdown" class="dropdown_width">
            <el-dropdown-item command="1" v-preventReClick size="medium">
              导出筛选数据
            </el-dropdown-item>
            <el-dropdown-item command="2" v-preventReClick>导出全部数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          round
          size="medium"
          @click="exportData"
          v-if="$route.query.wType == 6 && totalNum && title == '聊天'"
        >
          导出主直播间数据
        </el-button>
        <el-button
          round
          size="medium"
          @click="getGroupRound"
          v-if="$route.query.wType == 6 && title == '聊天'"
        >
          导出分组数据
        </el-button>
      </span>
    </div>
    <div class="interact-detail" v-show="totalNum">
      <table-list
        ref="tableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout"
        :totalNum="totalNum"
        :width="120"
        @changeTableCheckbox="changeTableCheckbox"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
      ></table-list>
    </div>
    <div class="no-live" v-show="!totalNum">
      <noData :nullType="nullText" :text="text"></noData>
    </div>
    <!-- 导出分组数据 - 选择场次面板  -->
    <VhallDialog
      title="选择活动场次"
      v-if="groupRoundVisible"
      :visible.sync="groupRoundVisible"
      width="410px"
    >
      <el-form @submit.native.prevent label-width="64px">
        <el-form-item class="no-border" label="请选择">
          <el-select placeholder="请选择活动场次" round v-model="groupRound" style="width: 100%">
            <el-option
              v-for="item in groupRoundList"
              :key="'gr_' + item.id"
              :label="
                dayjs(item.start_time).format('YYYY-MM-DD HH:mm') +
                ' 至 ' +
                dayjs(item.end_time).format('YYYY-MM-DD HH:mm')
              "
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="exportGroupByRound" round size="medium">确定</el-button>
        <el-button @click="closeGroupRoundDialog" round size="medium">取消</el-button>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import { textToEmoji } from './js/emoji';
  import noData from '@/views/PlatformModule/Error/nullPage';
  import { sessionOrLocal } from '@/utils/utils';
  import examServer from '@/utils/examServer';
  export default {
    components: {
      PageTitle,
      noData
    },
    data() {
      return {
        nullText: 'nullData',
        isSearch: false, //是否是搜索
        text: '暂无数据',
        isCheckout: false,
        isSeletedCheckout: false,
        placeholder: '',
        title: '',
        webinarId: '',
        num: 0,
        roomId: '',
        userId: JSON.parse(sessionOrLocal.get('userId')),
        searchTime: null,
        searchText: '',
        params: {},
        seleteAllOptionList: [],
        seleteAnwerList: [], //答案
        seleteQuestionList: [], //问题
        totalNum: 0,
        pageInfo: {
          pos: 0,
          pageNum: 1,
          limit: 10
        },
        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: time => {
            return this.dealDisabledData(time);
          }
        },
        tableList: [],
        groupRoundList: [], // 是否选择分组导出
        groupRoundVisible: false, // 是否展示选择分组导出 - 选择场次弹框
        groupRound: null,
        tabelColumn: [],
        // 邀请排名
        inviteColumn: [
          {
            label: '排名',
            key: 'index'
          },
          {
            label: '昵称',
            key: 'nick_name'
          },
          {
            label: '邀请人数',
            key: 'num'
          }
        ],
        // 聊天
        chatColumn: [
          {
            label: '昵称',
            key: 'nickname',
            width: 300
          },
          {
            label: '身份',
            key: 'name',
            width: 100
          },
          {
            label: '发送时间',
            key: 'date_time'
          },
          {
            label: '消息内容',
            key: 'imgOrText'
          },
          {
            label: '接收方',
            key: 'accept_name',
            width: 100
          }
        ],
        // 问答
        questColumn: [
          {
            label: '问答',
            key: 'name',
            width: 100
          },
          {
            label: '问答内容',
            key: 'imgOrText'
          },
          {
            label: '发送时间',
            key: 'created_at',
            width: 200
          },
          {
            label: '私密',
            key: 'is_open',
            width: 100
          },
          {
            label: '状态',
            key: 'statusText',
            width: 150
          }
        ],
        // 问卷
        questnaireColumn: [
          {
            label: '序号',
            key: 'survey_id'
          },
          {
            label: '推送问卷时间',
            key: 'send_time'
          },
          {
            label: '问卷标题',
            key: 'subject'
          },
          {
            label: '填写人数',
            key: 'filled_number'
          }
        ],
        // 签到
        signColumn: [
          {
            label: '序号',
            key: 'index'
          },
          {
            label: '推送签到时间',
            key: 'created_at'
          },
          {
            label: '签到人数',
            key: 'count'
          }
        ],
        // 抽奖
        drawColumn: [
          {
            label: '序号',
            key: 'index'
          },
          {
            label: '推送抽奖时间',
            key: 'create_time'
          },
          {
            label: '抽奖方式',
            key: 'lottery'
          },
          {
            label: '实际中奖人数',
            key: 'num'
          },
          {
            label: '实际奖品',
            key: 'prize_name'
          }
        ],
        // 现金红包
        packetColumn: [
          {
            label: '序号',
            key: 'index',
            width: 80
          },
          {
            label: '发红包时间',
            key: 'created_at'
          },
          {
            label: '支付方式',
            key: 'method'
          },
          {
            label: '红包金额',
            key: 'money'
          },
          {
            label: '红包个数',
            key: 'num',
            width: 120
          },
          {
            label: '红包类型',
            key: 'typeStr'
          }
        ],
        // 口令红包
        packetCodeColumn: [
          {
            label: '序号',
            key: 'index',
            width: 80
          },
          {
            label: '发红包时间',
            key: 'created_at'
          },
          {
            label: '红包个数',
            key: 'num',
            width: 120
          },
          {
            label: '领取人数',
            key: 'get_user_count',
            width: 120
          }
        ],
        // 关注用户
        followersColumn: [
          {
            label: '微信信息',
            key: 'wechat_info'
          },
          {
            label: 'OpenID',
            key: 'open_id',
            width: 120
          },
          {
            label: '手机号',
            key: 'phone',
            width: 120
          },
          {
            label: '关注时间',
            key: 'created_at',
            width: 120
          },
          {
            label: '观看时长',
            key: 'timer',
            width: 120
          }
        ],
        // 快问快答
        examColumn: [
          {
            label: '推送时间',
            key: 'push_time'
          },
          {
            label: '名称',
            key: 'title'
          },
          {
            label: '查看人数',
            key: 'check_num'
          },
          {
            label: '答题人数',
            key: 'answer_num'
          },
          {
            label: '满分率(%)',
            key: 'full_score_rate'
          },
          {
            label: '平均分',
            key: 'avg_score'
          }
        ],
        tableRowBtnFun: [],
        inviteBtnFun: [
          {
            name: '导出明细',
            methodName: 'reportDetail'
          }
        ],
        chatBtnFun: [
          {
            name: '删除',
            methodName: 'chatDetele'
          }
        ],
        anwerBtnFun: [
          {
            name: '删除',
            methodName: 'anwerDetele'
          }
        ],
        questnaireBtnFun: [
          {
            name: '查看',
            methodName: 'lookDetail',
            path: '/live/lookSingleQuestion'
          }
        ],
        examBtnFun: [
          {
            name: '查看明细',
            methodName: 'lookExamDetail',
            path: '/live/lookSingleExam'
          }
        ]
      };
    },
    async created() {
      // await this.getCustomRoleName()
    },
    mounted() {
      this.title = this.$route.query.title;
      this.webinarId = this.$route.query.id;
      this.roomId = this.$route.query.roomId;
      this.changeColumn(this.title);
    },
    methods: {
      getCustomRoleName() {
        this.$fetch('getCustomRoleName', { webinar_id: this.$route.query.id }).then(res => {
          if (res.code == 200) {
            console.log('7777777', res.data, res.data.host_name);
            sessionStorage.setItem('getCustomHostRoleName', res.data.host_name);
            sessionStorage.setItem('getCustomAssistantRoleName', res.data.assistant_name);
            sessionStorage.setItem('getCustomGuestRoleName', res.data.guest_name);
          }
        });
      },
      dealDisabledData(time) {
        return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
      },
      emojiToText(content) {
        if (!content) {
          return '';
        }
        console.warn(content, 'content');
        return textToEmoji(content)
          .map(c => {
            return c.msgType == 'text'
              ? c.msgCont
              : `<img width="24" src="${c.msgImage}" border="0" />`;
          })
          .join(' ');
      },
      changeColumn(title) {
        let pageInfo = this.$refs.tableList.pageInfo;
        this.params = {};
        switch (title) {
          case '邀请排名':
            this.isCheckout = false;
            this.tabelColumn = this.inviteColumn;
            this.tableRowBtnFun = this.inviteBtnFun;
            this.placeholder = '搜索用户昵称';
            this.inviteInfo(pageInfo);
            break;
          case '签到':
            this.isCheckout = false;
            this.tabelColumn = this.signColumn;
            this.tableRowBtnFun = this.inviteBtnFun;
            this.signInfoList();
            break;
          case '聊天':
            this.isCheckout = true;
            this.placeholder = '请输入聊天内容';
            this.tabelColumn = this.chatColumn;
            this.tableRowBtnFun = this.chatBtnFun;
            this.chatInfo(pageInfo);
            break;
          case '问答':
            this.isCheckout = true;
            this.tabelColumn = this.questColumn;
            this.tableRowBtnFun = this.anwerBtnFun;
            this.getRecordList(pageInfo);
            break;
          case '抽奖':
            this.isCheckout = false;
            this.tabelColumn = this.drawColumn;
            this.tableRowBtnFun = this.inviteBtnFun;
            this.prizeList();
            break;
          case '问卷':
            this.isCheckout = false;
            this.tabelColumn = this.questnaireColumn;
            this.tableRowBtnFun = this.questnaireBtnFun;
            this.getQuestionInfo();
            break;
          case '现金红包':
            this.tabelColumn = this.packetColumn;
            this.isCheckout = false;
            this.tableRowBtnFun = this.inviteBtnFun;
            this.getRedpacketList();
            break;
          case '口令红包':
            this.tabelColumn = this.packetCodeColumn;
            this.isCheckout = false;
            this.tableRowBtnFun = this.inviteBtnFun;
            this.getCodeRedpacketList();
            break;
          case '关注用户':
            this.isCheckout = false;
            this.tabelColumn = this.followersColumn;
            this.placeholder = '搜索微信昵称/手机号';
            this.text = '还没有人关注哦';
            this.getFollowersList();
            break;
          case '快问快答':
            this.isCheckout = false;
            this.tabelColumn = this.examColumn;
            this.tableRowBtnFun = this.examBtnFun;
            this.getExamInfo();
            break;
          default:
            break;
        }
      },
      changeDate() {
        if (this.title === '问答') {
          this.getRecordList(this.pageInfo);
        } else {
          this.chatInfo(this.pageInfo);
        }
      },
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      searchInviteInfo() {
        this.inviteInfo(this.pageInfo);
      },
      // 邀请排名
      inviteInfo(pageInfo) {
        // let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          webinar_id: this.webinarId,
          keyword: this.searchText,
          ...pageInfo
        };
        this.$fetch('getInviteListInfo', this.$params(params)).then(res => {
          this.tableList = res.data.list;
          this.tableList.map((item, index) => {
            item.index = index + 1;
          });
          this.totalNum = res.data.total;
          if (this.searchText) {
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          } else {
            this.nullText = 'nullData';
            this.text = '您还没有邀请排名记录！';
            this.isSearch = false;
          }
        });
      },
      // 聊天
      async chatInfo(pageInfo) {
        await this.getCustomRoleName();
        // let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          room_id: this.roomId,
          ...pageInfo
        };
        if (this.searchTime) {
          this.$refs.tableList.clearSelect();
          params.start_time = this.searchTime[0] + ' 00:00:00';
          params.end_time = this.searchTime[1] + ' 23:59:59';
          this.params = {
            room_id: this.roomId,
            start_time: this.searchTime[0] + ' 00:00:00',
            end_time: this.searchTime[1] + ' 23:59:59'
          };
        } else {
          this.params = {
            room_id: this.roomId
          };
        }
        // setTimeout(() => {
        // let obj = Object.assign({}, pageInfo, params);
        this.$fetch('getChatListInfo', params).then(res => {
          this.tableList = res.data.list;
          this.tableList.map(item => {
            const hostName = sessionStorage.getItem('getCustomHostRoleName', res.data.host_name);
            const assistantName = sessionStorage.getItem(
              'getCustomAssistantRoleName',
              res.data.assistant_name
            );
            const guestName = sessionStorage.getItem('getCustomGuestRoleName', res.data.guest_name);
            item.name =
              item.role_name == 1
                ? hostName
                  ? hostName
                  : '主持人'
                : item.role_name == 2
                ? '观众'
                : item.role_name == 3
                ? assistantName
                  ? assistantName
                  : '助理'
                : guestName
                ? guestName
                : '嘉宾';
            if (item.data.barrage_txt && /\[|\]/g.test(item.data.barrage_txt)) {
              item.data.barrage_txt = this.emojiToText(item.data.barrage_txt) || '';
            }
            if (item.data.text_content && /\[|\]/g.test(item.data.text_content)) {
              item.data.barrage_txt = this.emojiToText(item.data.text_content);
            } else {
              item.data.barrage_txt = item.data.text_content || '';
            }
            if (item.data.image_urls && item.data.image_urls.length != 0) {
              item.chatImg = this.chartsImgs(item.data.image_urls);
            } else {
              item.chatImg = '';
            }
            item.data.barrage_txt = item.data.barrage_txt.replace(/\*\*\*/g, '@');
            item.imgOrText = item.data.barrage_txt + item.chatImg;
          });
          this.totalNum = res.data.total;
          if (this.searchTime) {
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          } else {
            this.nullText = 'nullData';
            this.text = '您还没有聊天记录！';
            this.isSearch = false;
          }
        });
        // }, 500)
      },
      chartsImgs(list) {
        let arr = '';
        if (list.length) {
          list
            .map((item, index) => {
              arr += `<img style="display:inline-block;width: 40px;object-fit: scale-down;height: 100%;" src="${item}" border="0" />`;
            })
            .join(' ');
        }
        return arr;
      },
      //删除聊天（二次确认）
      chatConfirmSure(id, index) {
        this.$confirm('确定要删除该聊天记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            let obj = {
              msg_id: id,
              room_id: this.roomId
            };
            this.$fetch('deleteChatList', obj).then(res => {
              this.$vhall_paas_port({
                k: index === 1 ? 100459 : 100460,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: this.$route.params.str || this.$route.query.id,
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              this.$message({
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.chatInfo(this.pageInfo);
            });
          })
          .catch(() => {
            this.$message({
              message: `已取消删除`,
              showClose: true,
              // duration: 0,
              type: 'info',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 聊天删除
      chatDetele(that, { rows }) {
        that.chatConfirmSure(rows.msg_id, 2);
      },
      // 批量删除(问答和聊天)
      deleteAll(id) {
        if (this.title === '聊天') {
          if (this.seleteAllOptionList.length < 1) {
            this.$message({
              message: `请选择要操作的对象`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          } else {
            id = this.seleteAllOptionList.join(',');
            this.chatConfirmSure(id, 1);
          }
        } else {
          if (this.seleteAnwerList.length < 1 && this.seleteQuestionList.length < 1) {
            this.$message({
              message: `请选择要操作的对象`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          } else {
            this.recordAllDelete();
          }
        }
      },
      // 问答批量删除
      recordAllDelete() {
        this.$confirm('是否要删除此条问答？?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            let obj = {
              ques_ids: this.seleteQuestionList.join(','),
              answer_ids: this.seleteAnwerList.join(','),
              room_id: this.roomId
            };
            this.$fetch('deleteAllRecodrder', this.$params(obj)).then(res => {
              this.$vhall_paas_port({
                k: 100463,
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
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.getRecordList(this.pageInfo);
            });
          })
          .catch(() => {
            this.$message({
              message: `已取消删除`,
              showClose: true,
              // duration: 0,
              type: 'info',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 问答单个删除
      anwerDetele(that, { rows }) {
        that
          .$confirm('确定要删除该文件吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
          .then(() => {
            let obj = {
              id: rows.id,
              type: rows.name === '问' ? 2 : 1,
              room_id: that.roomId
            };
            that.$fetch('deleteRecodrder', obj).then(res => {
              that.$vhall_paas_port({
                k: 100462,
                data: {
                  business_uid: that.userId,
                  user_id: '',
                  webinar_id: that.$route.params.str,
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              that.$message.success('删除成功');
              that.getRecordList(that.pageInfo);
            });
          })
          .catch(() => {
            that.$message({
              message: `已取消删除`,
              showClose: true,
              // duration: 0,
              type: 'info',
              customClass: 'zdy-info-box'
            });
          });
      },
      //签到
      signInfoList() {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          room_id: this.roomId
        };
        let obj = Object.assign({}, pageInfo, params);
        this.$fetch('getSignList', obj).then(res => {
          this.tableList = res.data.list;
          this.tableList.map((item, index) => {
            item.index = index + 1;
          });
          this.totalNum = res.data.total;
          if (!res.data.total) {
            this.nullText = 'nullData';
            this.text = '您还没有签到记录！';
          }
        });
      },
      // 问卷
      getQuestionInfo() {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          room_id: this.roomId,
          webinar_id: this.webinarId
        };
        let obj = Object.assign({}, pageInfo, params);
        this.$fetch('getSurveyUsageInfo', obj).then(res => {
          this.tableList = res.data.list;
          this.totalNum = res.data.total;
          if (!res.data.total) {
            this.nullText = 'nullData';
            this.text = '您还没有问卷记录！';
          }
        });
      },
      // 快问快答
      getExamInfo() {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          source_type: 1,
          source_id: this.webinarId,
          pos: pageInfo.pageNum
        };
        let obj = Object.assign({}, pageInfo, params);
        examServer
          .getExamPushedList(obj)
          .then(res => {
            this.tableList = res.data.list;
            this.totalNum = res.data.total || 0;
            if (!res.data.total) {
              this.nullText = 'nullData';
              this.text = '您还没有快问快答数据！';
            }
          })
          .catch(() => {
            this.tableList = [];
            this.totalNum = 0;
            this.nullText = 'nullData';
            this.text = '您还没有快问快答数据！';
          });
      },
      // 抽奖
      prizeList() {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          webinar_id: this.webinarId
        };
        this.params = params;
        let obj = Object.assign({}, pageInfo, params);
        this.$fetch('getPrizeListInfo', obj).then(res => {
          this.tableList = res.data.list;
          this.tableList.map((item, index) => {
            item.index = index + 1;
            item.lottery = this.lotteryType(item.lottery_type);
          });
          this.totalNum = res.data.total;
          if (!res.data.total) {
            this.nullText = 'nullData';
            this.text = '您还没有抽奖记录！';
          }
        });
      },
      lotteryType(type) {
        if (type == 1) {
          return '全体参会者';
        } else if (type == 2) {
          return '参与问卷的用户';
        } else if (type == 3) {
          return '参与签到的用户';
        } else if (type == 8) {
          return '口令抽奖';
        } else {
          return '全体参会者';
        }
      },
      // 回答
      async getRecordList(pageInfo) {
        await this.getCustomRoleName();
        // let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        let params = {
          room_id: this.roomId
        };
        if (this.searchTime) {
          this.$refs.tableList.clearSelect();
          params.start_time = this.searchTime[0];
          params.end_time = this.searchTime[1];
        }
        this.tableList = [];
        let obj = Object.assign({}, pageInfo, params);
        this.params = params;
        this.$fetch('getRecodrderList', obj).then(res => {
          // this.params.start_time = res.data.start_time;
          // this.params.end_time = res.data.end_time;
          // this.tableList = res.data.list;
          // this.tableList.map(item => {
          //   item.statusText = item.status == 1 ? '不处理' : item.status == 2 ? '转给主持人 即语音回复' : item.status == 3 ? '文字回复' : '未处理';
          //   item.name = '问';
          //   if (item.answer.length) {
          //     item.answer[0].name = '答';
          //     item.answer[0].is_open = item.answer[0].is_open == 1 ? '公开' : '私密';
          //   }
          // })
          const hostName = sessionStorage.getItem('getCustomHostRoleName', res.data.host_name);
          const assistantName = sessionStorage.getItem(
            'getCustomAssistantRoleName',
            res.data.assistant_name
          );
          const guestName = sessionStorage.getItem('getCustomGuestRoleName', res.data.guest_name);
          let tableList = res.data.list;
          tableList.map((item, index) => {
            if (item.content && /\[|\]/g.test(item.content)) {
              item.content = this.emojiToText(item.content) || '';
            } else {
              item.content = item.content || '';
            }
            item.statusText =
              item.status == 1
                ? '不处理'
                : item.status == 2
                ? '语音回复'
                : item.status == 3
                ? '文字回复'
                : '未处理';
            item.name = '问';
            item.imgOrText = `${item.nick_name} | 观众 <br /> ${item.content}`;
            this.tableList.push(item);
            if (item.answer.length) {
              item.answer.map(opt => {
                opt.is_open = opt.is_open == 1 ? '公开' : '私密';
                opt.name = '答';
                opt.imgOrText = `${opt.nick_name} | ${
                  opt.role == 'host'
                    ? hostName
                      ? hostName
                      : opt.role_name
                    : opt.role == 'assistant'
                    ? assistantName
                      ? assistantName
                      : opt.role_name
                    : guestName
                    ? guestName
                    : opt.role_name
                } </br> ${opt.content}`;
                this.tableList.push(opt);
              });
            }
          });
          this.totalNum = res.data.total;
          if (this.searchTime) {
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          } else {
            this.nullText = 'nullData';
            this.text = '您还没有问答记录！';
            this.isSearch = false;
          }
        });
      },
      // 问答删除
      handleDelete(item) {
        this.$confirm('确认要删除该问答记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            let obj = {
              id: item.id,
              type: item.name === '问' ? 2 : 1,
              room_id: this.roomId
            };
            this.$fetch('deleteRecodrder', obj).then(res => {
              this.$message({
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.getRecordList(this.pageInfo);
            });
          })
          .catch(() => {
            this.$message({
              message: `已取消删除`,
              showClose: true,
              // duration: 0,
              type: 'info',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 现金红包列表
      getRedpacketList() {
        let pageInfo = this.$refs.tableList.pageInfo;
        pageInfo.pos = pageInfo.pageNum;
        let formParams = {
          webinar_id: this.webinarId
        };
        let obj = Object.assign({}, pageInfo, formParams);
        this.$fetch('getRedpacketList', obj).then(res => {
          this.tableList = res.data.data;
          this.totalNum = res.data.total;
          if (!res.data.total) {
            this.nullText = 'nullData';
            this.text = '您还没有发红包记录！';
          }
          this.tableList.map((item, index) => {
            item.method =
              item.pay_channel == 1
                ? '微信'
                : item.pay_channel == 2
                ? '支付宝'
                : item.pay_channel == 3
                ? '余额支付'
                : '-';
            item.typeStr = item.type === 1 ? '均分红包' : '拼手气';
            item.index = index + 1;
          });
        });
      },
      // 红包列表
      getCodeRedpacketList() {
        let pageInfo = this.$refs.tableList.pageInfo;
        pageInfo.pos = pageInfo.pageNum;
        let formParams = {
          webinar_id: this.webinarId
        };
        let obj = Object.assign({}, pageInfo, formParams);
        this.$fetch('getCodeRedpacketList', obj).then(res => {
          this.tableList = res.data.data;
          this.totalNum = res.data.total;
          if (!res.data.total) {
            this.nullText = 'nullData';
            this.text = '您还没有发红包记录！';
          } else {
            this.tableList.map((item, index) => {
              item.index = index + 1;
            });
          }
        });
      },
      // 关注用户列表
      getFollowersList() {
        let params = {
          room_id: this.roomId
        };
        if (this.searchTime) {
          this.$refs.tableList.clearSelect();
          params.start_time = this.searchTime[0];
          params.end_time = this.searchTime[1];
        }
        this.tableList = [];
        let obj = Object.assign({}, pageInfo, params);
        this.params = params;
        this.$fetch('getFollowersList', obj).then(res => {
          this.tableList = res.data.data;
          this.totalNum = res.data.total;
          if (!res.data.total) {
            this.nullText = 'nullData';
            this.text = '还没有人关注哦';
          } else {
            this.tableList.map((item, index) => {
              item.index = index + 1;
            });
          }
        });
      },
      getTableList(params) {
        this.changeColumn(this.title);
      },
      // 导出明细
      reportDetail(that, { rows }) {
        if (that.title === '现金红包') {
          that.exportRedpacketDetailInfo(rows.id, rows.type);
        } else if (that.title === '口令红包') {
          that.exportCodeRedpacketDetailInfo(rows.id);
        } else if (that.title === '签到') {
          that.exportDetailSignInfo(rows.id);
        } else if (that.title === '邀请排名') {
          that.exportInviteDetailInfo(rows.invite_id);
        } else {
          that.exportPrizeDetailInfo(rows);
        }
      },
      changeTableCheckbox(val) {
        if (this.title === '聊天') {
          this.seleteAllOptionList = val.map(item => item.msg_id);
          this.isSeletedCheckout = this.seleteAllOptionList.length > 0 ? true : false;
        } else {
          this.seleteAnwerList = val.filter(item => item.name == '答').map(item => item.id);
          this.seleteQuestionList = val.filter(item => item.name == '问').map(item => item.id);
          if (this.seleteAnwerList.length > 0 || this.seleteQuestionList.length > 0) {
            this.isSeletedCheckout = true;
          } else {
            this.isSeletedCheckout = false;
          }
        }
      },
      exportData(type) {
        switch (this.title) {
          case '邀请排名':
            this.exportInviteInfo();
            break;
          case '签到':
            this.exportSignInfo();
            break;
          case '聊天':
            this.exportChatInfo(type); // 基本聊天导出，or分组直播中 - 导出聊天 - 主直播间数据
            break;
          case '问答':
            this.exportRecordInfo();
            break;
          case '抽奖':
            this.exportPrizeInfo();
            break;
          case '问卷':
            this.exportQuestionInfo();
            break;
          case '现金红包':
            this.exportRedpacketInfo();
            break;
          case '口令红包':
            this.exportCodeRedpacketInfo();
            break;
          case '关注用户':
            this.exportFollowersInfo();
            break;
          case '快问快答':
            this.exportExamInfo();
            break;
          default:
            break;
        }
      },
      // 获取可选场次
      async getGroupRound() {
        try {
          let roundResult = await this.$fetch(
            'getWebinarSwitchList',
            this.$params({ webinar_id: this.webinarId, ...this.params })
          );
          if (roundResult && roundResult.code == 200) {
            this.groupRoundList = roundResult.data.switch_list || [];
            if (this.groupRoundList.length > 0) {
              this.groupRoundVisible = true;
            } else {
              this.groupRoundVisible = false;
              this.$message({
                message: `没有可选场次的数据`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            }
          }
        } catch (e) {
          this.groupRoundVisible = false;
          this.$message({
            message: `没有可选场次的数据`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      },
      closeGroupRoundDialog() {
        this.groupRoundVisible = false;
      },
      exportGroupByRound() {
        if (this.groupRound) {
          const vo = this.groupRoundList.filter(item => item.id == this.groupRound);
          if (!(vo && vo.length > 0)) {
            console.log('未筛选到有效场次，直接阻止不返回');
            return;
          }
          this.$fetch('exportChatSwitch', {
            room_id: this.roomId,
            switch_id: this.groupRound,
            start_time: vo[0].start_time,
            end_time: vo[0].end_time
          }).then(res => {
            // 暂无上报 this.$vhall_paas_port({
            //   k: 100457,
            //   data: {business_uid: this.userId, user_id: '', webinar_id: this.webinarId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            // })
            this.$message({
              message: `导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
            this.groupRoundVisible = false;
          });
        } else {
          this.$message({
            message: `请选择活动场次`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      },
      // 邀请详情导出
      exportInviteDetailInfo(id) {
        this.$fetch('exportDetailInvite', { webinar_id: this.webinarId, join_id: id }).then(res => {
          this.$vhall_paas_port({
            k: 100457,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 邀请导出
      exportInviteInfo() {
        this.$fetch('exportInvite', { webinar_id: this.webinarId }).then(res => {
          this.$vhall_paas_port({
            k: 100456,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 聊天
      exportChatInfo(type) {
        let params = JSON.parse(JSON.stringify(this.params));
        if (type == 1) {
          if (!params.start_time) {
            this.$message.warning('请选择时间范围');
            return false;
          }
        }
        if (type == 2) {
          delete params.start_time;
          delete params.end_time;
        }
        this.$fetch('exportChat', params)
          .then(res => {
            this.$vhall_paas_port({
              k: 100458,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.webinarId,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(err => {
            this.$message({
              message: err.msg,
              showClose: true,
              type: 'warning',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 问答
      exportRecordInfo() {
        this.$fetch('exportRecodrder', this.$params(this.params)).then(res => {
          this.$vhall_paas_port({
            k: 100461,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 签到
      exportSignInfo() {
        this.$fetch('exportSign', { room_id: this.roomId }).then(res => {
          this.$vhall_paas_port({
            k: 100465,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      exportDetailSignInfo(id) {
        this.$fetch('exportDetailSign', { room_id: this.roomId, sign_id: id }).then(res => {
          this.$vhall_paas_port({
            k: 100464,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 问卷
      exportQuestionInfo() {
        this.$fetch('exportSurvey', { webinar_id: this.webinarId, room_id: this.roomId }).then(
          res => {
            this.$vhall_paas_port({
              k: 100469,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.webinarId,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          }
        );
      },
      // 快问快答导出
      exportExamInfo() {
        this.$fetch('exportExam', { webinar_id: this.webinarId, room_id: this.roomId }).then(
          res => {
            this.$message({
              message: `导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          }
        );
      },
      // 抽奖
      exportPrizeInfo() {
        this.$fetch('exportLottery', this.params).then(res => {
          this.$vhall_paas_port({
            k: 100471,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 抽奖单个
      exportPrizeDetailInfo(item) {
        this.$fetch('exportDetailLottery', { webinar_id: this.webinarId, id: item.id }).then(
          res => {
            this.$vhall_paas_port({
              k: 100472,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.webinarId,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          }
        );
      },
      // 现金红包
      exportRedpacketInfo() {
        this.$fetch('exportRedpacket', { webinar_id: this.webinarId }).then(res => {
          this.$vhall_paas_port({
            k: 100473,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 现金红包---导出明细
      exportRedpacketDetailInfo(uuid, type) {
        this.$fetch('exportDetailRedpacket', {
          webinar_id: this.webinarId,
          red_packet_uuid: uuid,
          type: type
        }).then(res => {
          this.$vhall_paas_port({
            k: 100474,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 口令红包--导出全部
      exportCodeRedpacketInfo() {
        this.$fetch('exportCodeRedpacket', { webinar_id: this.webinarId }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: `导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          } else {
            this.$message({
              message: res.msg,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          }
        });
      },
      // 口令红包--导出明细详情（单个）
      exportCodeRedpacketDetailInfo(uuid, type) {
        this.$fetch('exportDetailCodeRedpacket', {
          webinar_id: this.webinarId,
          red_packet_uuid: uuid,
          type: type
        }).then(res => {
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 关注用户 - 导出全部（支持条件筛选）
      exportFollowersInfo() {
        let params = {
          webinar_id: this.webinar_id
        };
        if (this.searchTime) {
          params.start_time = this.searchTime[0] + ' 00:00:00';
          params.end_time = this.searchTime[1] + ' 23:59:59';
        }
        this.$fetch('exportFollowersInfo', params).then(res => {
          this.$vhall_paas_port({
            k: 100473,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        });
      },
      // 问卷查看
      lookDetail(that, val) {
        let rows = val.rows;
        that.$vhall_paas_port({
          k: 100470,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.webinarId,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        that.$router.push({
          path: `${val.path}/${that.webinarId}`,
          query: {
            surveyId: rows.survey_id,
            roomId: that.$route.query.roomId,
            subject: rows.subject,
            number: rows.filled_number
          }
        });
      },
      // 快问快答查看
      lookExamDetail(that, val) {
        let rows = val.rows;
        that.$router.push({
          path: `${val.path}/${that.webinarId}`,
          query: { paperId: rows.paper_id, roomId: that.$route.query.roomId }
        });
      }
    }
  };
</script>
<style lang="less">
  .el-tooltip__popper {
    max-width: 100%;
    line-height: 17px;
  }
</style>
<style lang="less" scoped>
  .title-data {
    height: 100%;
    span {
      font-size: 22px;
      font-family: @fontSemibold;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
  /deep/.el-range-editor .el-range-input {
    background: transparent;
  }
  /deep/.el-date-editor .el-range__icon {
    line-height: 29px;
  }
  /deep/.el-date-editor .el-range__close-icon {
    line-height: 28px;
  }
  /deep/.el-button,
  .el-button.is-disabled {
    background: transparent;
  }
  .interact-detail {
    .layout--right--main();
    .min-height();
    padding: 24px;
    /deep/.el-table td,
    .el-table th {
      padding: 15px 0;
    }
    /deep/.el-button.el-button--text {
      color: #1a1a1a;
      border: 0;
      &:hover {
        color: #fb3a32;
      }
    }
  }

  .operaBox {
    // overflow: hidden;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    position: relative;
    min-height: 36px;
    .searchBox {
      display: flex;
      &:first-child {
        margin-right: 20px;
      }
    }
    // &.flex-between {
    //   float: unset;
    //   .flex-display();
    //   .justify(space-between);
    // }
    .el-link {
      margin-left: 20px;
    }
    .searchBox {
      /* float: right;*/
      .el-input {
        width: 220px;
        .el-input__icon {
          cursor: pointer;
        }
        /deep/ .el-input__icon {
          line-height: 36px;
        }
      }
      /deep/ .el-input__inner {
        user-select: none;
        border-radius: 50px;
        font-size: 14px;
        color: #666666;
        height: 36px;
        line-height: 36px;
      }
    }
  }
  .search-export {
    position: absolute;
    top: 0;
    right: 0;
    // float: right;
    // /deep/.el-button{
    //   background: transparent;
    //   &:hover{
    //     background: #fb3a32;
    //     span{
    //       color: #fff;
    //     }
    //   }
    // }
  }
  .el-form-item.no-border {
    margin-bottom: 0;
  }
</style>
