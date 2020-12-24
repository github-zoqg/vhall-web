/**
 * @author Sean.shi
 *
 * 问卷模块
 *
 */
import {VHall_Questionnaire_Service, VHall_Questionnaire_Const} from '@/common/js/questionarie/questionnaire_service';
export default {
  props: {
    roleName: {
      required: false
    },
    roomId: {
      required: false
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
      required: false // webinarid
    },
    userId: {
      required: false // userId
    },
    defaultPhone: {
      required: false // userId
    },
    preQuestionId: {
      required: false // 预览用于传值
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
      formSDK: null,
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
      webviewType: '',
    };
  },

  created () {
    this.webviewType = this.$route.query.webviewType;
    this.type = this.$route.query.type;
    this.initQuestionSDK();
    if (sessionStorage.getItem('watch')) {
      this.questionShow = false;
    }
  },

  mounted () {
    let role_value = sessionStorage.getItem('role_val') ? sessionStorage.getItem('role_val') : ''
    if (!role_value && !this.type  && !this.preQuestionId) {
      this.getQuestionList();
    }
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
      window.open(`/live/lookSingleQuestion/${questionId}`);
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
      let params = {
        webinar_id: this.$route.params.il_id,
        room_id: this.roomId,
        keyword: this.searchKey,
        limit: '20',
        pos: '0'
      }
      this.$fetch('getLiveQuestionList', params).then(res => {
        console.log('问卷 列表', res);
        this.docList = res.data.list || [];

        this.pageInfo = {
          currentPage: res.data.pos,
          pagesize: res.data.limit,
          total: res.data.total
        };
      });
    },
    // 资料库列表
    materialQuestionList() {
      let params = {
        keyword: this.searchKey,
        limit: '20',
        pos: '0'
      }
      this.$fetch('getLiveQuestionList', params).then(res => {
        console.log('问卷 列表', res);
        this.docList = res.data.list || [];

        this.pageInfo = {
          currentPage: res.data.pos,
          pagesize: res.data.limit,
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
      document.getElementById('qs-preview-box').innerHTML = '';
      this.$service['renderPagePC']('#qs-preview-box', questionId);
      if (chat) {
          document.querySelector('.q-btns').style.display = 'none';
      }
    },
    publishPreview () {
      this.publish(this.previewId, this.previewDoc);
    },
    // 发布问卷
    publish (questionId, doc) {
      this.$fetch('sendQuestion', {
        survey_id: questionId,
        room_id: this.roomId
      }).then(res => {
        this.$service
          .$http(VHall_Questionnaire_Const.HTTP.PUBLISH_QUESTIONNAIRE, questionId)
          .then(res => {
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
      console.log(90,this.appId )
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
        this.sdkInitReady = true;
        if (this.$route.query.questionId) {
          this.isCreate = true;
          this.$nextTick(() => {
            this.$service.renderPageEdit('#qs-create-box', this.$route.query.questionId);
          })
        }
        if (this.preQuestionId) {
          this.$nextTick(() => {
            this.showPreview = true;
            this.previewId = this.preQuestionId;
            this.$service['renderPagePC']('#qs-preview-box-content', this.preQuestionId);
            document.querySelector('#qs-preview-box-content .q-btns').style.display = 'none';
          })

        }
      });
      this.$service.$on(VHall_Questionnaire_Const.EVENT.SUBMIT, (data) => {
          this.submitQuestion(data);
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.CREATE, data => {
        // data  回答Id
        // naire_id  问卷Id
        console.log(1212,)
        if (this.type == 1) {
          // 资料库问卷创建
          this.materialQuestion(data.id, data.title, data.description);
        } else if (this.type == 2) {
          this.liveMaterialQuestion(data.id, data.title, data.description);
        }else {
          this.createQuestionAction(data.id, data.title, data.description);
        }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.UPDATE, data => {
        if (this.type == 1) {
          // 资料库问卷编辑
          this.materialEditQuestion(data.id, data.title, data.description);
        } else if (this.type == 2) {
          this.liveMaterialEditQuestion(data.id, data.title, data.description);
        }else {
          this.$fetch('liveEditQuestion', {
            survey_id: data.id,
            webinar_id: this.ilId,
            room_id: this.roomId,
            title: data.title,
            description: data.description,
            user_id: this.accountId
          })
            .then(res => {
              this.isCreate = false;
              this.showPreview = false;
              this.getQuestionList();
              this.$message.success('编辑成功')
            })
            .catch(e => {
              console.log('编辑问卷失败>>>', e);
            });
          }
      });

      this.$service.$on(VHall_Questionnaire_Const.EVENT.ERROR, data => {
        console.log('问卷错误', data);
      });
    },

    answerQuestion (questionId) {
      this.questionnaireId = questionId;
      this.showPreview = true;
      document.getElementById('qs-preview-box').innerHTML = '';
      this.$service['renderPagePC']('#qs-preview-box', questionId);
      this.isDoListcShow = true;
    },

    createQuestion (id) {
      localStorage.setItem('create', 'true');
      this.isCreate = true;
      console.log("1111111111111111");
      document.querySelector('#qs-create-box').innerHTML = '';
      this.$service.renderPageEdit('#qs-create-box', id || '');
    },
    createQuestionAction (id, title, description) {
      this.$fetch('createLiveQuestion', {
        room_id: this.roomId,
        title: title,
        survey_id: id,
        description,
        webinar_id: this.ilId,
        user_id: this.userId
      }).then(() => {
        console.log('vss 接口创建成功');
        this.isCreate = false;
        localStorage.setItem('create', '');
        this.showPreview = false;
        this.getQuestionList();
      });
    },
    materialQuestion(id, title, description) {
      this.$fetch('createQuestion', {survey_id: id, title: title, description: description}).then(res => {
        this.$message.success('新建成功');
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    materialEditQuestion(id, title, description) {
      this.$fetch('editQuestion', {survey_id: id, title: title, description: description}).then(res => {
        this.$message.success('编辑成功');
        this.$router.push({
          path: '/material/question',
        });
      })
    },
    liveMaterialQuestion(id, title, description) {
      let params = {
        survey_id: id,
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId,
        title: title,
        description: description,
      }
      this.$fetch('createLiveQuestion', params).then(res => {
        this.$message.success('新建成功');
         this.$router.push({
            path: '/live/question',
            query: {
              id: this.$route.query.webinarId,
              roomId: this.$route.query.roomId
            }
          });
      })
    },
    liveMaterialEditQuestion(id, title, description) {
      let params = {
        survey_id: id,
        webinar_id: this.$route.query.webinarId,
        room_id: this.$route.query.roomId,
        title: title,
        description: description,
      }
      this.$fetch('editLiveQuestion', params).then(res => {
        this.$message.success('编辑成功');
         this.$router.push({
            path: '/live/question',
            query: {
              id: this.$route.query.webinarId,
              roomId: this.$route.query.roomId
            }
          });
      })
    },
    // 提交问卷
    submitQuestion (opt) {
      let {naire_id, data, answer} = opt
      let quesData = {};
      // vss数据
      opt.report && opt.report.length > 0 && opt.report.forEach(item => {
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
      this.$fetch('userSendQuestion', {
        survey_id: naire_id,
        room_id: this.roomId,
        answer_id: data,
        user_id: this.userId,
        visit_id: sessionStorage.getItem('visitor_id') ? sessionStorage.getItem('visitor_id') : '',
        webinar_id: this.ilId,
        vss_token: this.accessToken,
        extend: JSON.stringify(quesData),
        res: answer
      }).then(res => {
        this.showPreview = false;
        this.isDoListcShow = false;
      }).catch(e => {
        this.$message.error('提交失败')
        console.log('提交失败', e)
        this.showPreview = false;
        this.isDoListcShow = false;
      });
      this.$emit('onCloses', '');
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
