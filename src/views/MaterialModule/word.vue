<template>
  <div class="word-wrap">
    <pageTitle title="文档">
      <div slot="content">
        1.支持的文档格式: doc/docx，xls/xlsx，ppt/pptx，pdf，jpeg/jpg，png，bmp
        <br>
        2.上传的文档内容不能超过200页，不超过100M
        <br>
        3.如果ppt格式转换失败或文档打开失败请尝试用office转为pdf后上传
        <br>
        4.直播过程中发现ppt自动翻页，请检查源文件是否设置自动放映
        <br>
        5.文档转换较慢，请于直播前提前上传
      </div>
    </pageTitle>
    <!-- 无权限，未创建 -->
    <div v-if="no_show">
      <null-page text="您还没有文档，快来上传吧" nullType="noAuth">
        <el-upload
          class="btn-upload"
          :action=actionUrl
          :headers="{token: token, platform: 17}"
          :data=saveData
          name="resfile"
          :show-file-list=false
          :on-success='uploadSuccess'
          :on-error="uploadError"
          :before-upload="beforeUploadHandler"
          :on-preview="uploadPreview"
        >
          <el-button round type="primary" class="length152">上传</el-button>
        </el-upload>
      </null-page>
    </div>
    <div v-else>
      <div class="head-operat">
        <el-upload
          class="btn-upload"
          :action=actionUrl
          :headers="{token: token, platform: 17}"
          :data=saveData
          name="resfile"
          :show-file-list=false
          :on-success='uploadSuccess'
          :on-error="uploadError"
          :before-upload="beforeUploadHandler"
          :on-progress="uploadProcess"
          :on-preview="uploadPreview"
        >
          <el-button round type="primary" size="medium">上传</el-button>
        </el-upload>
        <el-button type="primary" round @click="openCheckWord" size="medium" v-if="$route.params.str">资料库</el-button>
        <el-button round @click="wordMultiDel" size="medium">批量删除</el-button>
        <el-input
          class="head-btn search-tag"
          placeholder="请输入文档名称"
          v-model="formParams.keyword"
          clearable
          @clear="initPage"
          @keyup.enter.native="initPage">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="initPage">
          </i>
        </el-input>
      </div>
      <div class="word-list">
        <table-list
          ref="tableListWord"
          v-if="totalNum > 0"
          scene="word"
          :manageTableData="tableList"
          :tabelColumnLabel="tableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          max-height="auto"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getTableWordList"
          @changeTableCheckbox="changeTableCheckbox"
        >
        </table-list>
        <null-page text="未搜索到相关内容" nullType="search" v-if="totalNum === 0"></null-page>
      </div>
    </div>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" width="30%" center>
        <doc-preview ref="videoPreview" :docParam='docParam' v-if="docParam"></doc-preview>
      </el-dialog>
    </template>
    <!-- 文档列表 -->
    <select-word ref="dialogWordComp" @reload="initPage"></select-word>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import DocPreview from './DocPreview/index.vue';
import NullPage from '../PlatformModule/Error/nullPage.vue';
import SelectWord from './components/selectWord.vue';

import {sessionOrLocal} from "@/utils/utils";
import EventBus from "@/utils/Events";
export default {
  name: 'word.vue',
  components: {
    PageTitle,
    DocPreview,
    NullPage,
    SelectWord
  },
  data() {
    return {
      no_show: false,
      token: sessionOrLocal.get('token', 'localStorage') || '',
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/interacts/document/upload-webinar-document`,
      formParams: {
        keyword: ''
      },
      totalNum: 0,
      tableList: [],
      tableColumn: [
        {
          label: '文档名称',
          key: 'file_name',
        },
        {
          label: '上传时间',
          key: 'created_at',
        },
        {
          label: '页码',
          key: 'page',
        },
        {
          label: '进度',
          key: 'transform_schedule_str',
        }
      ],
      tableRowBtnFun: [
        {
          name: '预览',
          methodName: 'preShow'
        },
        {
          name: '删除',
          methodName: 'deleteHandle'
        }
      ],
      searchAreaLayout: [
        {
          type: "",
          key: "searchTitle",
        }
      ],
      multipleSelection: [],
      showDialog: false,
      docParam: null,
      dialogVisible: false,
      dialogTotal: 0,
      dialogTableList: [],
      dialogMulti: [],
      channel_id: null,
      query: {
        pos: 0,
        limit: 1000,
        pageNumber: 1
      }
    };
  },
  computed: {
    saveData: function() {
      let data = {
        path: 'interacts/docs',
        type: 1, // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
      }
      if(this.$route.params.str) {
        // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
        data.type = 0;
        data.webinar_id = this.$route.params.str;
      } else {
        data.type = 1;
      }
      return data;
    },
  },
  methods: {
    uploadSuccess(res, file, fileList){
      console.log(res, file, fileList);
      if(res.code !== 200) {
        this.$message.error(res.msg || '上传失败');
      } else {
        this.$message.success('上传成功');
        if (this.$route.params.str) {
          // 弹出框提示是否同步
          this.$confirm('确定同步到资料库？', '提示', {
            confirmButtonText: '同步',
            cancelButtonText: '不同步',
            customClass: 'zdy-message-box'
          }).then(() => {
            // 同步到资料库
            this.asyncWord(res);
          }).catch(() => {
            // 取消同步，刷新列表
            this.initPage();
          });
        } else {
          // 判断文件上传情况
          this.initPage();
        }
      }
    },
    asyncWord(resV) {
      let params = {
        document_id: resV.data.document_id,
        tag: 1, // 1：同步到资料库 ，2：同步到活动
        webinar_id: this.$route.params.str
      }
      this.$fetch('asyncWordInfo', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.$message.success('同步成功');
          try {
            this.$nextTick(() => {
              this.$refs.tableListWord.clearSelect();
            })
          } catch(e) {
            console.log(e);
          }
        } else {
          this.$message.error(res.msg || '同步失败');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error(e.msg || '同步失败');
      }).finally(()=>{
        this.initPage();
      });
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['doc','docx','xls','xlsx','ppt','pptx','pdf','jpeg','jpg','png','bmp'];
      let fileNameArr = file.name.split('.');
      let lastFileKey = fileNameArr[fileNameArr.length - 1];
      console.log(lastFileKey);
      const isType = typeList.includes(lastFileKey.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isType) {
        this.$message.error(`上传文件只能是 ${typeList.join('、')} 格式!`);
        return;
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!');
        return;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`文件上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    // 从资料库选择文档
    openCheckWord() {
      this.dialogVisible = true;
      this.$refs.dialogWordComp.initComp();
    },
    // 批量删除
    wordMultiDel() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.$confirm('删除后将会影响文档演示和观看，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          let ids = this.multipleSelection.map(item => {
            return item.id;
          });
          this.deleteSend({
            id: ids.join(',')
          })
        }).catch(() => {
        });
      } else {
        this.$message({
          type: 'error',
          message: '请至少选择一条记录进行删除'
        });
      }
    },
    // 获取文档列表数据
    getTableWordList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      let params = {
        pos: this.query.pos,
        limit: this.query.limit,
        keyword: this.formParams.keyword,
        type: 1,
        webinar_id: this.$route.params.str
      };
      this.$fetch(this.$route.params.str ? 'getWebinarWordList' : 'getWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.totalNum = res.data.total;
          this.no_show = this.totalNum === 0 && this.formParams.keyword === '';
          let list = res.data.list;
          list.map(item => {
            let transformStr;
            const statusJpeg = item.status_jpeg * 1;
            const status = item.status * 1;
            if (statusJpeg === 0 && status === 0) {
              transformStr = '待转码';
            } else if (statusJpeg === 100 || status === 100) {
              transformStr = '转码中';
            } else if (statusJpeg === 200 || status === 200) {
              transformStr = '转码完成';
            } else {
              transformStr = '转码失败';
            }
            item.transform_schedule_str = transformStr;
            item.codeProcess = 0;
            item.transcoded = false;
          })
          this.tableList = res.data.list;
        } else {
          this.totalNum = 0;
          this.tableList = [];
        }
      }).catch(e => {
        console.log(e);
        this.totalNum = 0;
        this.tableList = [];
      }).finally(()=>{
      });
    },
    // 预览
    preShow(that, { rows }) {
      console.log('预览', rows);
      that.showDialog = true;
      that.docParam = rows;
    },
    // 删除
    deleteHandle(that, { rows }) {
      console.log('删除', rows);
      that.$confirm(that.$route.params.str ? '删除后将会影响文档演示和观看，确定删除？' : '删除后将会影响文档演示和观看，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        that.deleteSend(rows);
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteSend(rows) {
      let params = {
        ids: rows.id,
        tag: this.$route.params.str ? 1 : 2,
        webinar_id: this.$route.params.str
      };
      this.$fetch('delWordList', this.$params(params)).then(res=>{
        if(res && res.code === 200) {
          this.$message.success('删除成功');
          try {
            this.$nextTick(() => {
              this.$refs.tableListWord.clearSelect();
            })
          } catch(e) {
            console.log(e);
          }
          this.initPage();
        } else {
          this.$message.error(res.msg || '删除失败');
        }
      }).catch(e => {
        console.log(e);
        this.$message.error(e.msg || '删除失败');
      }).finally(()=>{
      });
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    initPage() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.tableListWord.pageInfo.pageNum = 1;
        this.$refs.tableListWord.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
      this.getTableWordList();
    },
    // 初始化
    initChat(){
      let option = {
        appId: 'fd8d3653', // appId 必须
        accountId: sessionOrLocal.get('userId') || '', // 第三方用户ID
        channelId: this.channel_id, // 频道id 必须
        token: sessionOrLocal.get('token', 'localStorage'), // 必须， token，初始化接口获取
      }
      window.VhallChat.createInstance(option, (event) => {
        // alert('初始化成功')
        this.$Chat = event.message; // 聊天实例句柄
        this.monitor()
      },err=>{
        // alert('初始化错误')
        console.error(err);
      })
    },
    // 监听
    monitor(){
      /**
       * 接收聊天自定义消息*/
      this.$Chat.onCustomMsg(async msg => {
        try {
          if (typeof msg !== 'object') {
            msg = JSON.parse(msg)
          }
          if (typeof msg.context !== 'object') {
            msg.context = JSON.parse(msg.context)
          }
          if (typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data)
          }
        } catch (e) {
          console.log(e)
        }
        console.log('============收到聊天消息2===============' + JSON.stringify(msg.data))
        if (msg.data.type === 'host_msg_webinar') {
          EventBus.$emit('host_msg_webinar', msg.data.data)
        }
        if (msg.data.type === 'doc_convert_jpeg') {
          EventBus.$emit('doc_convert_jpeg', msg.data.data)
        }
      })
    },
    getWebinarInfo() {
      this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
        if (res && res.code === 200) {
          this.channel_id = res.data.vss_channel_id;
          this.initPage();
          this.initChat();
        }
      }).catch(error=>{
        console.log(error);
      }).finally(()=>{
      });
    }
  },
  created() {
    // 如果存在活动Id，查询活动接口
    let id = this.$route.params.str;
    if(id) {
      this.getWebinarInfo();
    } else {
      this.channel_id = sessionOrLocal.get('SAAS_V3_CHANNEL_ID', 'localStorage') || '';
      this.initPage();
      this.initChat();
    }
  },
  mounted() {
    /* EventBus.$on('converted_process_msg', res => { // 转码进度
      // console.log(res, '监听到converted_process_msg转码进度事件');
      this.tableList.forEach((item) => {
        if (res.document_id === item.document_id && !item.transcoded) {
          item.codeProcess = Number(res.converted_process.replaceAll('%', ''));
        }
      });
    }); */
    function CalculatePercent(convert, total, dynamic_convert) {
        total = total >= 1 ? total : 1;
        var _percent = typeof dynamic_convert !== "undefined" ? (parseInt(convert) + parseInt(dynamic_convert)) / 2 / total * 100 : parseInt(convert) / parseInt(total) * 100;
        return (_percent + "").substr(0, 4) + "%";
    }
    function getDocErrorText(error_status) {
        var textArr = {
            "500": "转换失败",
            "501": "文档打开失败",
            "502": "转换失败",
            "503": "文档不可用",
            "504": "文档受保护"
        };
        return textArr[error_status + ""];
    }
    EventBus.$on('doc_convert_jpeg', res => { // 转码状态
      console.log(res, '监听到doc_convert_jpeg转码状态事件');
      this.tableList.forEach((item) => {
        if (res.document_id === item.document_id) {
          const statusJpeg = Number(res.status_jpeg);
          const status = Number(res.status);
          if (status === 200) {
            item.transform_schedule_str ='动画版转换失败，请尝试极速版';
          }else {
            let _percent = CalculatePercent(res.converted_page, res.page, 0);
            if (_percent == "100%") {
              item.transform_schedule_str = '转换成功';
            } else {
              item.transform_schedule_str = `转换${_percent}`;
            }
          }
        }
      });
    });

    EventBus.$on('host_msg_webinar', res => { // 转码状态
      console.log(res, '监听到host_msg_webinar转码状态事件');
      /*
        converted_page: "0" // 动态页数
        converted_page_jpeg: "1" // 静态页数
        document_id: "01b17b82"
        page: "1"
        status: "200"
        status_jpeg: "200"
      */
      this.tableList.forEach((item) => {
        if (res.document_id === item.document_id) {
          const statusJpeg = Number(res.status_jpeg);
          const status = Number(res.status);
          if (status === 0) {
            if(statusJpeg === 200) {
              if (!/pptx?/.test(item.ext)) {
                 item.transform_schedule_str = '转码完成';
                 item.page = Number(res.page);
                 item.transcoded = true;
              } else {
                 item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
              }
            } else if(statusJpeg > 500){
              item.transform_schedule_str = getDocErrorText(statusJpeg);
            } else if (statusJpeg === 100) {
              if (/pptx?/.test(item.ext)) {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
              } else {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page)}`;
              }
            } else {
                item.transform_schedule_str = '等待转换';
            }
          } else if (status === 100) {
             if (/pptx?/.test(item.ext)) {
                item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
            }
            if (statusJpeg == 200) {
                if (!/pptx?/.test(item.ext)) {
                  item.transform_schedule_str = '转码完成';
                  item.page = Number(res.page);
                  item.transcoded = true;
                }
            } else if (statusJpeg >= 500) {
                item.transform_schedule_str = getDocErrorText(res.status_jpeg);
            }
          } else if (status === 200) {
            if (statusJpeg == 0) {
                if (/pptx?/.test(item.ext)) {
                   item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
                } else {
                    item.transform_schedule_str = '等待转换';
                }
            } else if (statusJpeg >= 500) {
                item.transform_schedule_str = getDocErrorText(res.status_jpeg);
            } else if (statusJpeg === 100) {
                if (/pptx?/.test(item.ext)) {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
                } else {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page)}`;
                }
            } else if (statusJpeg === 200) {
                item.transform_schedule_str = '转码完成';
                item.page = Number(res.page);
                item.transcoded = true;
            }
          } else if (status >= 500) {
            if (statusJpeg === 0) {
               item.transform_schedule_str = '等待转换';
            } else if (statusJpeg === 100) {
                if (/pptx?/.test(item.ext)) {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
                } else {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page)}`;
                }
            } else if (statusJpeg === 200) {
                if (/pptx?/.test(item.ext)) {
                  item.transform_schedule_str = "动画版转换失败，请尝试极速版";
                } else {
                  item.transform_schedule_str = `转换${CalculatePercent(res.converted_page_jpeg, res.page, res.converted_page)}`;
                }
            } else if (r.status_jpeg >= 500) {
                item.transform_schedule_str = getDocErrorText(res.status_jpeg);
            }
          }
          /* if (statusJpeg === 0 && status === 0) {
            item.transform_schedule_str = '待转码';
            item.page = Number(res.page);
            item.transcoded = false;
          } else if (statusJpeg === 100 || status === 100) {
            item.transform_schedule_str = '转码中';
            item.page = Number(res.page);
            item.transcoded = false;
          } else if (statusJpeg === 200 || status === 200) {
            item.transform_schedule_str = '转码完成';
            item.page = Number(res.page);
            item.transcoded = true;
          } else {
            item.transform_schedule_str = '转码失败';
            item.page = Number(res.page);
            item.transcoded = false;
          } */
        }
      });
    });
  }
};
</script>
<style lang="less" scoped>
.btn-upload {
  display: inline-block;
  margin-right: 16px;
  /deep/.el-upload {
    width: auto;
    height: auto;
    line-height: unset;
    background: transparent;
    border: none;
  }
}
.word-wrap {
  height: 100%;
   .word-list{
    width: 100%;
  }
  /deep/.el-card__body{
    padding: 32px 24px;
  }
  ::v-deep .vh-dialog{
    .el-dialog{
      width: 960px!important;
      height: 623px;
      .el-dialog__body{
        height: calc(100% - 44px);
      }
      .el-dialog__header{
        padding-top: 10px;
      }
      .el-dialog__headerbtn{
        top: 15px;
      }
      .el-dialog--center .el-dialog__body{
        padding: 0 10px 10px;
      }
    }
  }
  .head-operat{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .head-btn{
      display: inline-block;
      margin-left: auto;
    }
    .el-input{
      width: 220px;
      .el-input__icon{
        cursor: pointer;
      }
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
    ::v-deep.set-upload{
      position: relative;
      span{
        input{
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
