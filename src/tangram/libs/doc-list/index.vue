<template>
  <div class="vhall-doc-control" v-show="isDoListcShow">
    <div class="vhall-doc-control-content">
      <!-- <slot name="switchDoc">
        <span class="vhall-doc-switch-text">文档</span>
        <el-switch v-model="switchStatus" @change="switchChange"></el-switch>
      </slot> -->
      <!-- <div class="doc-pick"> -->
      <!-- <slot name="chooseDoc">
        <el-button
          round
          size="mini"
          type="primary"
          :disabled="!switchStatus"
          @click="_showDocList"
          class="mini-chose-btn"
        >选择文档</el-button>
      </slot> -->
      <!-- </div> -->
    </div>
    <div class="vhall-list-dialog">
      <div class="vhall-list-dialog-title">
        <div>文档管理</div>
        <div class="vhall-list-dialog-title--close-btn" @click="isDoListcShow = false"></div>
      </div>
      <div class="vhall-list-dialog-content">
        <ul class="search-tab">
          <div class="upload-container">
            <el-upload
            class="avatar-uploader"
            :action="`${$baseUrl}/v3/interacts/document/upload-webinar-document`"
            :show-file-list="false"
            :headers="{
              token: token,
              'interact-token': interact_token
            }"
            name="resfile"
            accept="*/*"
            :data="{
              webinar_id: this.webinar_id,
              type: 2
            }"
            :on-success="handleAvatarSuccess"
            :on-progress="handleAvatarProgress"
            :before-upload="beforeupload"
            >
            <button class="upload" >上传</button>
          </el-upload>
          <el-tooltip placement="right">
            <div slot="content">
              <div class="help-tips">
                <p style="line-height: 20px">1.支持的文档格式： doc/docx,xls/xlsx,ppt</p>
                <p style="line-height: 20px">/pptx,pdf,jpeg/jpg,png,bmp</p>
                <p style="line-height: 20px">2.单份文档不能超过200页,不超过100M</p>
                <p style="line-height: 20px">3.如果ppt格式转换失败或文档打开失败请尝</p>
                <p style="line-height: 20px">试用office转为pdf后上传</p>
                <p style="line-height: 20px">4.直播过程中发现PPT自动翻页，请检查源文件</p>
                <p style="line-height: 20px">是否设置自动放映</p>
                <p style="line-height: 20px">5.文档转换较慢，请于直播前从资料管理-文档</p>
                <p style="line-height: 20px">管理上传文档</p>
              </div>
            </div>
            <div class="help"></div>
          </el-tooltip>
          </div>
          <div class="search">
            <div class="search-icon" :style="{'background-image': `url(//${domains.static + '/static/images/account-file/account-file-search.png'}`}"></div>
            <input type="text" placeholder="搜索关键词" v-model.trim="searchKey">
            <div class="keyword-clear" @click="searchKey = ''" v-show="searchKey" :style="{'background-image': `url(//${domains.static + '/static/images/account-file/account-file-close.png'}`}"></div>
          </div>
        </ul>
        <div class="vhall-list-dialog-content--table" v-if="!empty && !noResult">
          <ul class="thead">
            <span class="name">文档名称</span>
            <span class="create">创建时间</span>
            <span class="page">页码</span>
            <span class="progress">进度</span>
            <span class="action">操作</span>
          </ul>
          <ul class="tbody">
            <li v-for="(localitem, index) in locaListFiltered" :key="index" class="local">
              <div class="icon">
               <div :class="[localitem.ext]"></div>
              </div>
              <div class="name">{{localitem.file_name}}</div>
              <div class="create-date">{{localitem.created_at}}</div>
              <div class="page">{{localitem.page}}页</div>
              <div class="convert">

                <template v-if="localitem.transcoded">
                  <span>转码完成</span>
                </template>
                <template v-else-if="localitem.codeProcess && !localitem.transcoded">
                  <el-progress :percentage="localitem.codeProcess"></el-progress>
                </template>
                <template v-else>
                  <span v-if="localitem.completed">待转码</span>
                  <el-progress :percentage="localitem.uploadPropress" v-else></el-progress>
                </template>

              </div>
              <div class="action" v-show="localitem.transcoded">
                <button class="btn small blue-line" @click="demonstrate(localitem.document_id)">演示</button>
              </div>
              <div class="icon-warp" v-show="localitem.document_id">
                <i class="el-icon-delete" @click="showDeleteDialog(localitem.id, index, true)"></i>

              </div>
            </li>
            <li v-for="doc in docListFiltered" :key="doc.document_id">
              <div class="icon">
                <div :class="[doc.ext]"></div>
              </div>
              <div class="name">{{doc.file_name}}</div>
              <div class="create-date">{{doc.created_at}}</div>
              <div class="page">{{doc.page}}页</div>
              <div class="convert">
                <el-progress :percentage="doc.codeProcess" v-if="doc.codeProcess && !doc.transcoded"></el-progress>
                <span v-else-if="doc.transcoded">转码完成</span>
                <span v-else>{{doc.transform_schedule_str}}</span>
              </div>
              <div class="action">
                <button class="btn small blue-line" @click="demonstrate(doc.document_id)" v-show="doc.status_jpeg == 200 || doc.transcoded">演示</button>
              </div>
              <div class="icon-warp">
                <i class="el-icon-delete" @click="showDeleteDialog(doc.id)"></i>

              </div>
            </li>
          </ul>
        </div>
        <div class="pagination-wrapper" v-if="pageInfo.total > pageInfo.pageSize && !empty && !noResult">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageInfo['pageSize']"
            :total="pageInfo['total']"
            :current-page="pageInfo['currentPage']"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
        <div class="empty-container" v-if="empty">
          <div></div>
          <p>文档列表为空</p>
        </div>
        <div class="noresult-container" v-if="noResult && !empty">
          <div></div>
          <p>无法找到相关文档</p>
        </div>
      </div>
      <div class="footer">
        <div class="audience-visible">
          观众可见
          <div
            :class="
              docVisibleToAudience
                ? 'toggle-button enabled'
                : 'toggle-button'
            "
            @click="toggleDocumenVisiblity(!docVisibleToAudience)"
          >
            <span></span>
          </div>
        </div>
        <div class="tip">默认开启，文档演示将自动对观众可见</div>
      </div>
    </div>
     <SassAlert
        :visible="isShowDeleteDialog"
        :confirm="true"
        @onClose="deleteClose"
        @onSubmit="deleteFile"
        @onCancel="deleteClose"
      >
        <div slot="content">删除后将会影响文档演示和观看，确定删除？</div>
      </SassAlert>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import SassAlert from '../../libs/saas-popup/alert';
import { sessionOrLocal } from '@/utils/utils'
export default {
  props: {
    accountId: {
      require: true
    },
    roomId: {
      required: true
    },
    isEnjoy: {
      default: true
    },
    vssToken: {
      require: true
    },
    docLowPriority: {
      required: true
    },
    domains: {
      required: true
    },
    permission: {
      required: false
    },
    webinar_id:{
      required: true
    }
  },
  data () {
    return {
      token: sessionOrLocal.get('token') || '',
      interact_token: sessionOrLocal.get('interact_token') || '',
      switchStatus: false,
      isDoListcShow: false,
      searchKey: '', // 查询关键字
      docList: [],
      locaList: [],
      pageInfo: {
        currentPage: 1,
        total: 0,
        pageSize: 200
      },
      docListFiltered: [],
      locaListFiltered: [],
      empty: false,
      isShowDeleteDialog: false, // 删除的二次确认弹窗
      docVisibleToAudience: true // 默认开启文档
    };
  },
  components: {
    SassAlert
  },
  computed: {
    noResult: function () {
      return (!this.docListFiltered.length && !this.locaListFiltered.length);
    }
  },
  created () {
    this.listenEvent();
  },
  watch: {
    searchKey (value) {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        if (value) {
          this.docListFiltered = this.docList.filter(d => d.file_name && d.file_name.indexOf(value) != -1);
          this.locaListFiltered = this.locaList.filter(d => d.file_name && d.file_name.indexOf(value) != -1);
        } else {
          this.getDocList();
        }
      }, 400);
    },
    docList: {
      handler (value) {
        this.empty = (!value.length && !this.locaList.length);
      },
      deep: true
    },
    locaList: {
      handler (value) {
        this.empty = (!value.length && !this.docList.length);
      },
      deep: true
    }
  },
  methods: {
    formatDate (datetime) {
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      let year = datetime.getFullYear();
      let month = ('0' + (datetime.getMonth() + 1)).slice(-2);
      let date = ('0' + datetime.getDate()).slice(-2);
      let hour = ('0' + datetime.getHours()).slice(-2);
      let minute = ('0' + datetime.getMinutes()).slice(-2);
      let second = ('0' + datetime.getSeconds()).slice(-2);
      // 拼接
      let result = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
      // 返回
      return result;
    },
    beforeupload (file) {
      if (file.size / 1024 / 1024 > 100) {
        this.$message.customerror('上传文件不可大于100M');
        return false;
      }
      const acceptFileTypes = /(jpe?g|png|pptx?|xlsx?|docx?|pdf|bmp)$/i;
      const cacheArr = file.name.split('.');
      var curExt = cacheArr[cacheArr.length - 1];
      if (!acceptFileTypes.test(curExt)) {
        this.$message.customerror('文件格式不正确，无法上传');
        return false;
      }
      console.log(file);
      const obj = {
        file_name: file.name,
        ext: file.name.split('.')[1],
        created_at: this.formatDate(new Date()),
        page: 1,
        uploadPropress: 0,
        completed: false,
        transcoded: false,
        codeProcess: 0,
        uid: file.uid
      };
      this.locaList.unshift(obj);
      return true;
    },
    handleAvatarProgress (res, file) {
      const uids = file.uid;
      this.locaList.forEach((item) => {
        if (uids === item.uid) {
          item.uploadPropress = parseInt(res.percent);
          if (item.uploadPropress == 100) {
            item.completed = true;
          }
        }
      });
    },
    handleAvatarSuccess (res, flie) {
      console.warn(res, flie, '文档的上传-----');
      if (res.code == 200) {
        const uids = flie.uid;
        this.locaList.forEach((item) => {
          if (uids === item.uid) {
            item.document_id = res.data.document_id;
          }
        });
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      }else{
        this.$message.warning(res.msg)
      }
    },
    showDeleteDialog (id, index, local) {
      this.deletParam = {
        id,
        index,
        local
      };
      this.isShowDeleteDialog = true;
    },
    deleteFile () {
      console.log('删除文档=============',this.deletParam);
      const data = {
        tag: 1,
        webinar_id: this.webinar_id,
        ids: this.deletParam.id
      };
      console.warn('test-----文档列表的删除', data);
      this.$fetch('delWordList', data).then(res => {
        if (this.deletParam.local) {
          this.locaList.splice(this.deletParam.index, 1);
        }
        if (res.code === 200) {
          this.isShowDeleteDialog = false;
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getDocList();
        }
      });
    },
    deleteClose () {
      this.isShowDeleteDialog = false;
      this.deletParam = {};
    },
    // ===============================对外暴露方法 start============================
    /**
         * 显示文档列表
         */
    showDocList () {
      this.locaList = [];
      this.isDoListcShow = true;
      this.pageInfo.currentPage = 1;
      this.searchKey = '';
      this.getDocList();
    },
    // ===============================对外暴露方法 end==============================
    listenEvent () {
      EventBus.$on('doc_convert_jpeg', res => { // 极速版
        console.log('监听到doc_convert_jpeg事件');
        let data = res.data;
        this.locaList.forEach((item) => {
          if (data.document_id === item.document_id) {
            item.page = data.converted_page;
            item.codeProcess = parseInt(data.converted_page / data.page * 100);
            if (data.converted_page == data.page) {
              item.transcoded = true; // 转码完成
            }
          }
        });
        this.docList.forEach((item) => {
          if (data.document_id === item.document_id) {
            item.page = data.converted_page;
            item.codeProcess = parseInt(data.converted_page / data.page * 100);
            if (data.converted_page == data.page) {
              item.transcoded = true; // 转码完成
            }
          }
        });
      });
      // EventBus.$on('doc_convert', data => { // 动画版
      //   console.log(data, 'doc_convertdoc_convertdoc_convertdoc_convertdoc_convert')
      // })
      EventBus.$on('docSDK_ready', data => {
        this.docSDK = data;
      });
      // 直播中初始化文档时，文档组件派发的是否显示文档的事件
      EventBus.$on('hostDocShow', flag => {
        this.switchStatus = flag;
      });
      // 开始直播事件
      EventBus.$on('startLive', () => {
        this.isPlaying = true;
      });
      // 结束直播事件
      EventBus.$on('endLive', () => {
        this.isPlaying = false;
        this.switchStatus = false;
      });
      EventBus.$on('component_doc_watch_containner', (status) => {
        if (status) {
          this.toggleDocumenVisiblity(true);
        }
      });
    },
    /**
         * 显示文档列表
         */
    _showDocList () {
      if (this.switchStatus) {
        this.showDocList();
      }
    },
    /**
         * 获取文档列表
         */
    getDocList () {

      let data = {};
      data = {
        pos: this.pageInfo.currentPage,
        limit: this.pageInfo.pageSize,
        webinar_id: this.webinar_id,
        type: '2'
      };
      // if(this.permission.includes(100031)) {
        data.room_id = this.roomId;
      // }

      if (this.searchKey) {
        data.file_name = this.searchKey;
      }

      console.warn('doc----选择文档', data);
      this.$fetch('getWebinarWordList', data).then(res => {
        if (res.code == 200) {
          this.docList = res.data.list.map((item) => {
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
            //
            return {
              ...item,
              transform_schedule_str: transformStr,
              codeProcess: 0,
              transcoded: false
            };
          });

          this.locaList = this.locaList.filter((doc) => {
            return !this.docList.map((d) => d.document_id).includes(doc.document_id);
          });
          // if (!this.docList.length && !this.locaList.length) {
          //   this.empty = true
          // } else {
          //   this.empty = false
          // }
          this.locaListFiltered = this.locaList;
          this.docListFiltered = this.docList;
          this.pageInfo.total = res.data.total;
        }
      });
    },
    /**
         * switch变化事件
         */
    switchChange (isShowDocContainer) {
      // 轻享控制主持端显示隐藏文档，观看端显示
      if (this.isEnjoy) {
        if (this.isPlaying) {
          // 控制观看端显示隐藏
          if (isShowDocContainer) {
            this.docSDK.switchOnContainer();
          } else {
            this.docSDK.switchOffContainer();
          }

          // 主持端显示隐藏文档容器
          EventBus.$emit('docContainerShow', isShowDocContainer);
        } else {
          this.$message('请先开启直播');
          this.switchStatus = false;
        }
      } else {
        // saas端只控制显示隐藏文档
        EventBus.$emit('docContainerShow', isShowDocContainer);
      }
    },
    /**
         * 文档列表翻页事件
         */
    handlePageChange (page) {
      this.pageInfo.currentPage = page;
      this.getDocList();
    },
    /**
         * 演示文档
         */
    demonstrate (documentId) {
      EventBus.$emit('demonstration', {
        documentId, docVisibleToAudience: this.docVisibleToAudience
      });
      this.isDoListcShow = false;
    },
    toggleDocumenVisiblity (value) {
      console.log('测试文档的开关状态============');
      // 观众是否可见
      this.docVisibleToAudience = value;
    }
  }
};
</script>

<style lang="less" scoped>
.vhall-doc-control {
  // color: #b8bbca;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1200;
  align-items: center;
  display: flex;
  justify-content: center;
  .vhall-doc-control-content {
    display: flex;
    align-items: center;
  }
  .vhall-doc-switch-text {
    font-size: 14px;
    margin-right: 10px;
    color: #b8bbca;
  }
  .mini-chose-btn {
    height: 24px;
    line-height: 24px !important;
    vertical-align: middle;
    padding: 0 15px !important;
    margin-left: 20px;
  }
}

.vhall-list-dialog {
  background: #f3f4f6;
  position: fixed;
  border-radius: 4px;
  width: 782px;
  height:500px;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  // z-index:999999;
  z-index: 1099;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px rgba(51, 82, 113, 0.27);
  @media (max-width: 1366px) {
    /*width: 783px;*/
    /*height: 604px;*/
  }
  .vhall-list-dialog-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    background: #edecec;
    color: #555555;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: 1px solid #dfdfdf;
    font-weight: 500;
    @media (max-width: 1366px) {
      /*height: 39.82px;*/
      /*line-height: 39.82px;*/
      /*font-size: 14px;*/
    }
    &--close-btn {

      position: absolute;
      background: url('../../assets/images/publish/close-icon.png') no-repeat;

      cursor: pointer;
      width: 10.62px;
      height: 10.62px;
      background-size: 10.62px 10.62px;
      top: 16.59px;
      right: 19.91px;
      @media (max-width: 1366px) {
        /*width: 10.62px;*/
        /*height: 10.62px;*/
        /*background-size: 10.62px 10.62px;*/
        /*top: 16.59px;*/
        /*right: 19.91px;*/
      }
    }
  }
  .vhall-list-dialog-content {
    /*padding-left: 80px;*/
    /*padding-right: 80px;*/
    flex: 1;
    overflow-y: auto;
    @media (max-width: 1366px) {
      /*padding-left: 53.1px;*/
      /*padding-right: 53.1px;*/
    }
    .search-tab {
      padding: 6px 15px;
      display: flex;
      justify-content: space-between;
      background: white;
      .upload-container{
        display: flex;
        align-items: center;
      }
      .upload{
        width: 80px;
        height: 30px;
        border-radius: 2px;
        border: solid 1px #d2d2d2;
        background-color: #fff;
        font-size: 12px;
        color: #666;
        &:hover{
          color: #fff;
          border: 1px solid #fc5659;
          background-color: #fc5659;
        }
        &:active{
          border: 1px solid #E1504E;
          background-color: #E1504E;
        }
      }
      .help{
        width: 14px;
        height: 14px;
        margin-left: 5px;
        background: url('../../assets/images/publish/account-file-help.png') no-repeat;
        &:hover{
          background: url('../../assets/images/publish/account-file-helpH.png') no-repeat;
        }
      }
      .search{
        width: 200px;
        border-radius: 2px;
        background-color: #fff;
        border: solid 1px #d2d2d2;
        .search-icon{
          display: inline-block;
          vertical-align: middle;
          background-size: 16px 16px;
          width: 16px;
          height: 16px;
          margin-left: 6px;
        }
        input{
          height: 28px;
          width: 160px;
          border: none;
          font-size: 12px;
          padding-left: 4px;
          outline: none;
        }
        .keyword-clear{
          position: absolute;
          width: 15px;
          height: 15px;
          background-size: 15px 15px;
          margin-top: -21px;
          margin-left: 176px;
          cursor: pointer;
        }
      }
    }
    &--table {
      /*margin-top: 30px;*/
      @media (max-width: 1366px) {
        /*margin-top: 19.91px;*/
      }
      .thead {
        color: #363636;
        overflow: hidden;
        padding-left: 15px;
        border-bottom: 1px solid #e5e5e5;
        font-size: 14px;
        line-height: 28px;
        background-color: #f2f2f2;
        @media (max-width: 1366px) {
          /*height: 33.18px;*/
          /*line-height: 33.18px;*/
          /*font-size: 12px;*/
          /*padding-left: 14.91px;*/
        }
        span {
          display: inline-block;
          text-align: center;
        }
        .name {
          width: 312px;
          @media (max-width: 1366px) {
          }
        }
        .create {
          width: 125px;
          @media (max-width: 1366px) {
            width: 125px;
          }
        }
        .page {
          width: 79.65px;
          @media (max-width: 1366px) {
            width: 79.65px;
          }
        }
        .progress {
          width: 79.65px;
          @media (max-width: 1366px) {
            width: 79.65px;
          }
        }
        .action {
          width: 86.29px;

        }
      }
      .tbody {
        overflow-y:scroll;
        height: 334px;
        padding-right:2px;
        li {
          transform: translate3d(1px, 1px, 1px);
          height: 50px;
          line-height: 50px;
          background: #ffffff;
          border-radius: 4px;
          margin-top: 1px;
          font-size: 12px;
          padding-left: 20px;
          color: #555555;
          &:nth-child(2n) {
            background-color: #f2f2f2;
          }
          &:hover {
            background: #ddecfb;
            .icon-warp .el-icon-delete {
              display: inline-block;
              &:hover {
                color: rgb(255, 51, 51);
                cursor: pointer;
              }
            }
          }

          div {
            display: inline-block;
          }
          div.el-progress--line {
            width: 100%;
          }
          .icon {
            width: 50px;
            margin-left: 36px;

            .pdf {
              background: url('../../assets/images/publish/pdf.png') no-repeat;
              background-size: 37px 43px;

            }
            .doc {
              background: url('../../assets/images/publish/doc.png') no-repeat;
              background-size: 37px 43px;

            }
            .docx {
              background: url('../../assets/images/publish/doc.png') no-repeat;
              background-size: 37px 43px;

            }
            .jpg {
              background: url('../../assets/images/publish/jpg.png') no-repeat;
              background-size: 37px 43px;

            }
            .jpeg {
              background: url('../../assets/images/publish/jpg.png') no-repeat;
              background-size: 37px 43px;

            }
            .txt {
              background: url('../../assets/images/publish/txt.png') no-repeat;
              background-size: 37px 43px;

            }
            .ppt {
              background: url('../../assets/images/publish/ppt.png') no-repeat;
              background-size: 37px 43px;

            }
            .pptx {
              background: url('../../assets/images/publish/ppt.png') no-repeat;
              background-size: 37px 43px;

            }
            .xls {
              background: url('../../assets/images/publish/xls.png') no-repeat;
              background-size: 37px 43px;

            }
            .xlsx {
              background: url('../../assets/images/publish/xls.png') no-repeat;
              background-size: 37px 43px;

            }
            .png {
              background: url('../../assets/images/publish/png.png') no-repeat;
              background-size: 37px 43px;

            }
            .gif {
              background: url('../../assets/images/publish/gif.png') no-repeat;
              background-size: 37px 43px;

            }
            & > div {
              width: 37px;
              height: 43px;

              vertical-align: middle;
            }
          }
          .name {
            text-align: left;
            width: 220px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            vertical-align: middle;

          }
          .create-date {
            width: 139.39px;
            height: 49px;
            vertical-align: middle;
          }
          .page {
            width: 60px;
            text-align: center;

          }
          .convert {
            width: 90px;
            text-align: center;
            div.el-progress--line {
              width: 100%;
            }

          }
          .action {
            position: relative;
            width: 86.29px;

          }
          .icon-warp{
            width: 20px;
            .el-icon-delete {
              font-size: 16px;
              display: none;
            }
          }

        }
        .local {
          .process {
            width: 60px;
          }
        }
      }
    }
    .pagination-wrapper {
      display: flex;
      margin-top: 60px;
      justify-content: center;
    }
    .empty-container,.noresult-container{
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 346px;
      justify-content: center;
      p{
        font-size: 14px;
        color: #999;
      }
    }
    .empty-container{
      div{
        background: url('../../assets/images/publish/blank-page.png') no-repeat;
        height: 114px;
        width: 156px;
        background-size: contain;
      }
      p{
        width: 96px;
      }
    }
    .noresult-container{
      div{
        background: url('../../assets/images/publish/account-file-empty2.png') no-repeat;
        height: 114px;
        width: 156px;
        background-size: contain;
      }
      p{
        width: 131px;
        margin-top: 5px;
      }
    }
  }
  .footer {
    padding: 10px;
    background: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    color: #363636;
    display: flex;
    span{
      color: red;
      font-size: 12px;
    }
    & > .tip {
      margin-left: 8px;
      line-height: 20px;
      font-size: 12px;
    }
    & > .audience-visible {
        font-size: 12px;
        color: #363636;
        line-height: 17px;
        display: flex;
        align-items: center;
        margin-left: 20px;
        position: relative;
        & > .toggle-button {
          margin-left: 10px;
          width: 38px;
          height: 20px;
          box-sizing: border-box;
          border-radius: 10px;
          border: 1px solid rgba(221, 221, 221, 1);
          cursor: pointer;
          & > span {
            margin-bottom: 1px;
            transition: all 0.3s ease;
            display: inline-block;
            vertical-align: middle;
            height: 12px;
            width: 12px;
            background: rgba(132, 132, 132, 1);
            margin-left: 4px;
            border-radius: 50%;
          }
        }

        & > .toggle-button.enabled {
          border-color: #7db7f0;
          & > span {
            background: #7db7f0;
            margin-left: 21px;
            transition: all 0.3s ease;
          }
        }
      }
    .avatar-uploader {
      float: right;
    }
  }
  .blue-line {
    color: #666;
    border: 1px solid #d2d2d2;
    &:hover {
      color: rgb(255, 51, 51);
      border: 1px solid rgb(255, 51, 51);
    }
    &:active {
      color: #fff;
      background-color: rgb(255, 51, 51);
    }
  }
}
</style>
