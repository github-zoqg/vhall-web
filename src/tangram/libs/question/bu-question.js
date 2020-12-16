/**
 * @author Sean.shi
 *
 * 问卷模块
 *
 */
import {VHall_Questionnaire_Service, VHall_Questionnaire_Const} from '../../utils/questionnaire_service';
console.log('VHall_Questionnaire_Service', VHall_Questionnaire_Service);
export default {
  props: {
    roleName: {
      required: true
    },
    roomId: {
      required: true
    },
    accountId: {
      required: true
    },
    accessToken: {
      required: true
    },
    appId: {
      required: true
    },
    ilId: {
      required: true // webinarid
    },
    userId: {
      required: false // userId
    },
    defaultPhone: {
      required: false // userId
    },
    showControl: {
      require: false,
      default: false
    },
    isEmbed: {
      required: false // 是否为嵌入页
    },
    // 问卷类型 room , user - room 获取房间相关问卷， user 获取用户相关问卷
    questionType: {
      require: false,
      default: 'room'
    }
  },

  data () {
    return {
      questionnaireId: '', // 问卷Id
      sdkInitReady: false,
      isDoListcShow: false,
      showPreview: false,
      questionShow: true, // 列表的显示
      docList: [],
      searchKey: '',
      $service: null,
      pageInfo: {},
      previewId: '',

      isCreate: false,
      assistantType: '',
      webviewType: ''
    };
  },

  created () {
    this.assistantType = this.$route.query.assistantType;
    this.webviewType = this.$route.query.webviewType;
    this.initQuestionSDK();
    if (sessionStorage.getItem('watch')) {
      this.questionShow = false;
    }
  },

  mounted () {
    this.getQuestionList();
  },
  watch: {
    $route (to, from) {
      if (localStorage.getItem('create')) {
        this.isCreate = false;
      }
    }
  },
  methods: {
    goDetail (questionId) {
      if (this.webviewType == 'cef') return;
      window.open(`/user/question/detail?survey_id=${questionId}&webinar_id=${this.ilId}`);
    },
    blackCreate () {
      this.isCreate = false;
    },
    // 观看端修改样式
    watchQuestion (questionId) {
      this.checkSurveyQuestion(questionId);
    },

    showQuestion () {
      this.isDoListcShow = true;
    },
    closeDialog () {
      this.isDoListcShow = false;
      this.showPreview = false;
    },

    getQuestionList () {
      let params =
        this.questionType == 'room'
          ? {
            room_id: this.roomId,
            keyword: this.searchKey,
            from_room_id: this.roomId,
            pagesize: '100',
            page: '1'
          }
          : {
            account_id: this.accountId,
            keyword: this.searchKey,
            pagesize: '100',
            page: '1'
          };

      this.$fetch('questionList', params).then(res => {
        console.log('问卷 列表', res);
        this.docList = res.data.list || [];

        this.pageInfo = {
          currentPage: res.data.page,
          pagesize: res.data.pagesize,
          total: res.data.total
        };
      });
    },

    handlePageChange (page) {
      this.pageInfo.currentPage = page;
      this.getDocList();
    },

    preview (questionId, doc) {
      this.showPreview = true;
      this.previewId = questionId;
      this.previewDoc = doc;

      document.getElementById('qs-preview-box-content').innerHTML = '';
      this.$service['renderPagePC']('#qs-preview-box-content', questionId);
      document.querySelector('#qs-preview-box-content .q-btns').style.display = 'none';
    },
    chatPreview (questionId, chat) {
      this.showPreview = true;
      this.previewId = questionId;
      console.log('chat>>>>>>>>>>>>>', chat);
      if (chat) {
        this.$nextTick(() => {
          document.getElementById('qs-preview-box').innerHTML = '';
          this.$service['renderPagePC']('#qs-preview-box', questionId);
          document.querySelector('.q-btns').style.display = 'none';
        });
      } else {
        document.getElementById('qs-preview-box').innerHTML = '';
        this.$service['renderPagePC']('#qs-preview-box', questionId);
      }
    },
    publishPreview () {
      this.publish(this.previewId, this.previewDoc);
    },
    publish (questionId, doc) {
      this.$fetch('publicQuestion', {
        question_id: questionId,
        room_id: this.roomId
      }).then(res => {
        this.$service
          .$http(VHall_Questionnaire_Const.HTTP.PUBLISH_QUESTIONNAIRE, questionId)
          .then(res => {
            console.log('问卷发布成功3');
            this.showPreview = false;
            this.$message({
              message: '问卷发布成功',
              type: 'success'
            });
            doc.publish = 1;
          })
          .catch(function (e) {
            // e请求错误对象
          });
      });
    },

    /**
     * 初始化 问卷SDK
     */
    initQuestionSDK () {
      this.$service = new VHall_Questionnaire_Service({
        auth: {
          // paas的应用id,必填
          app_id: this.appId,
          // paas的第三方用户id,必填
          third_party_user_id: this.roleName == 2 ? this.userId : this.accountId,
          // paas的授权token,必填
          access_token: this.accessToken
        },
        // 是否开启消息提示，非必填,默认是true
        notify: true,
        iphoneNumber: this.defaultPhone
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
        console.log('初始化完成');
        this.sdkInitReady = true;
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.SUBMIT, data => {
        console.log('提交问卷成功', data);
        this.$emit('onCloses', '111111');
        this.submitQuestion(data.naire_id, data.data, data.report);
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.CREATE, data => {
        console.log('创建问卷成功', data);

        // data  回答Id
        // naire_id  问卷Id
        this.$emit('createSuccess', { ...data });
        console.log('data>>>>>>>>>>>>>>>>>>>', data);
        this.createQuestionAction(data.id, data.title, data.description);
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        this.$fetch('updatesurvey', {
          survey_id: data.id,
          user_id: this.accountId
        })
          .then(res => {
            console.log('res', res);
          })
          .catch(e => {
            console.log('error', e);
          });
        console.log('更新问卷成功了', data);
        // data  回答Id
        this.updateQuestionAction(data.id, data.title, data.description);
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.ERROR, data => {
        console.log('错误1', data);
      });
    },

    answerQuestion (questionId) {
      this.questionnaireId = questionId;
      console.log('zoudao >>>>>>>>>>>>>>>>>>>>>>>>>>', questionId);
      console.log('thisss>>>>>>>>>>>>>>>>', this);
      this.showPreview = true;
      document.getElementById('qs-preview-box').innerHTML = '';
      this.$service['renderPagePC']('#qs-preview-box', questionId);
      this.isDoListcShow = true;

      // debugger;
    },

    createQuestion (id) {
      // this.$router.push({ query: { creat: 'true' } })
      localStorage.setItem('create', 'true');
      this.isCreate = true;
      document.querySelector('#qs-create-box').innerHTML = '';
      this.$service.renderPageEdit('#qs-create-box', id || '');
    },

    createQuestionAction (id, title, description) {
      this.$fetch('createQuestion', {
        room_id: this.roomId,
        title: title,
        question_id: id,
        description,
        account_id: this.accountId,
        app_id: this.appId
      }).then(() => {
        console.log('vss 接口创建成功');
        this.isCreate = false;
        // this.$router.push({ query: {creat: ''} })
        localStorage.setItem('create', '');
        this.showPreview = false;
        this.getQuestionList();
      });
    },

    updateQuestionAction (id, title, description) {
      this.$fetch('updateQuestion', {
        room_id: this.roomId,
        title: title,
        question_id: id,
        description,
        account_id: this.accountId,
        app_id: this.appId
      }).then(() => {
        console.log('vss 接口创建成功');
        this.isCreate = false;
        this.showPreview = false;
        this.getQuestionList();
      });
    },

    submitQuestion (questionId, answerId, report) {
      let quesData = {};
      report.forEach(item => {
        switch (item.style) {
          case 'name':
            quesData.real_name = item.value;
            quesData.real_name_source = 'SURVEY';
            break;
          case 'area':
            quesData.address = item.value;
            break;
          case 'industry':
            quesData.industry = item.value;
            break;
          case 'education':
            quesData.education_level = item.value;
            break;
          case 'company':
            quesData.company = item.value;
            break;
          case 'phone':
            quesData.phone = item.value;
            break;
          case 'email':
            quesData.email = item.value;
            break;
          case 'birthday':
            quesData.birthday = item.value;
            break;
          case 'position':
            quesData.position = item.value;
            break;
          case 'sex':
            quesData.sex = item.value == '男' ? 'M' : 'W';
            break;
        }
      });
      // TODO:
      this.$fetch('submitQuestion', {
        survey_id: questionId,
        room_id: this.roomId,
        answers: JSON.stringify(quesData)
      }).then(res => {
        this.showPreview = false;
        this.isDoListcShow = false;
      });
    },
    // content样式修改
    contentQuestion (questionId) {
      const questionStyle = document.querySelector('.vhall-list-dialog-content');
      questionStyle.style.width = '600px';
      this.showPreview = true;
      this.answerQuestion(questionId);
    },
    // 校验checkSurvey
    checkSurveyQuestion (questionId, chat) {
      this.$fetch('checkSurvey', {
        survey_id: questionId,
        user_id: this.userId,
        webinar_id: this.ilId
      }).then(res => {
        // debugger
        if (res.code == 200) {
          this.showPreview = true;
          this.answerQuestion(questionId);
        } else {
          if (chat) {
            document.querySelector('.q-btns').style.display = 'none';
          } else {
            this.$emit('onCloses', '111111');
            this.$message.success('你已提交过问卷！');
          }
        }
      });
    },
    // 退出预览
    exitPreview () {
      this.isCreate = false;
      this.showPreview = false;
      this.getQuestionList();
    }
  }
};
