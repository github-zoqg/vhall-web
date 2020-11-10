<template>
  <div class="vh-doc-list">
    <div class="vh-doc-list__dialog" v-show="isDoListcShow">
      <div class="vh-doc-list--title">
        <div>{{ t('文档管理') }}</div>
        <div class="vh-icon-close vh-iconfont" @click="isDoListcShow = false"></div>
      </div>
      <div class="vh-doc-list-header" v-if="isSearch">
        <el-upload
          class="vh-doc-list__uploader"
          :action="`${$baseUrl}/v1/document/upload`"
          :show-file-list="false"
          name="document"
          accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .jpeg, .jpg, .png, .bmp"
          :data="{
            vss_token: vssToken,
            room_id: roomId,
            app_id: app_id
          }"
          :on-success="handleAvatarSuccess"
          :on-progress="handleAvatarProgress"
          :before-upload="beforeupload"
        >
          <el-button type="primary" size="mini">{{ t('上传文档') }}</el-button>
        </el-upload>
        <el-tooltip effect="dark" placement="right">
          <span slot="content" class="vh-doc-list-header__tip">
            {{t('文档转换较慢，请于直播前')}}
            <br />
            {{t("从资料管理-文档管理上传文档！")}}
          </span>
          <span class="vh-icon-wenhaoicon vh-iconfont"></span>
        </el-tooltip>
        <el-input class="vh-doc-list-search" placeholder="搜文档" v-model="searchKey">
          <span slot="prefix" class="el-icon-search"></span>
          <span
            v-if="searchKey.trim()"
            slot="suffix"
            class="vh-doc-list-search-btn"
            @click="search()"
          >{{t('搜索')}}</span>
          <!-- <el-button slot="append" @click="search()"> 搜索</el-button> -->
        </el-input>
      </div>
      <div class="vh-doc-list-content">
        <el-table :data="docList" tooltip-effect="dark">
          <el-table-column prop="file_name" :label="t('文件名称')" width="280" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div class="vh-doc-list__icon" :class="[row.ext]"></div>
              <span>{{ row.file_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="t('创建时间')" width="200"></el-table-column>
          <el-table-column prop="page" :label="t('页码')" width="60"></el-table-column>
          <el-table-column prop="transform_schedule_str" :label="t('进度')">
            <template slot-scope="{ row }">
              <el-progress
                :percentage="row.uploadPropress"
                v-if="row.uploadPropress&&!row.isUplaoded"
              ></el-progress>
              <span v-if="row.isUplaoded">{{ t('待转码') }}</span>
              <span v-else>{{ row.transform_schedule_str }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('操作')" width="130">
            <template slot-scope="{ row }">
              <span v-if="row.document_id == docIng" class="vh-doc-list-status">{{t('演示中')}}</span>
              <span
                class="vh-doc-list__btn"
                v-else
                @click="demonstrate(row.document_id)"
                v-show="row.status_jpeg == 200"
              >{{t('演示')}}</span>
              <span
                class="vh-doc-list__btn vh-doc-list__btn--delete"
                @click="deleteFile(row.document_id)"
                v-if="row.document_id != docIng"
              >{{t('删除')}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper" v-if="pageInfo.total > pageInfo.pageSize">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageInfo['pageSize']"
            :total="pageInfo['total']"
            :current-page="pageInfo['currentPage']"
            @current-change="handlePageChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'vhDocList',
  props: {
    accountId: {
      require: true
    },
    roomId: {
      required: true
    },
    vssToken: {
      require: true
    },
    app_id: {
      required: true
    },
    docIng: {
      type: String
    },
    listType: {
      require: false,
      default: '',
      type: String
    },
    // 是否支持搜索功能
    isSearch: {
      require: false,
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      switchStatus: false,
      isDoListcShow: false,
      searchKey: '', // 查询关键字
      docList: [],
      pageInfo: {
        currentPage: 1,
        total: 0,
        pageSize: 200
      }
    };
  },
  created () {},
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
        this.$message.error(this.t('上传文件不可大于100M'));
        return false;
      }
      if (file.type == 'application/x-msdownload') {
        this.$message.error(this.t('文件格式不正确，无法上传'));
        return false;
      }
      const obj = {
        file_name: file.name,
        ext: file.name.split('.')[1],
        created_at: this.formatDate(new Date()),
        page: 0,
        uploadPropress: 0,
        isUplaoded: false,
        uid: file.uid
      };
      this.docList.unshift(obj);
      return true;
    },
    handleAvatarProgress (res, file) {
      const uids = file.uid;
      this.docList.forEach(item => {
        if (uids === item.uid) {
          item.uploadPropress = parseInt(res.percent);
          if (item.uploadPropress == 100) {
            item.isUplaoded = true;
          }
        }
      });
    },
    handleAvatarSuccess (res, flie) {
      if (res.code == 200) {
        const uids = flie.uid;
        this.docList.forEach(item => {
          if (uids === item.uid) {
            item.document_id = res.data.document_id;
          }
        });
      }
    },
    deleteFile (id, index, local) {
      this.$confirm(this.t('删除后将无法恢复，是否确认删除？'), {
        confirmButtonText: this.t('确定'),
        cancelButtonText: this.t('取消'),
        type: 'warning',
        center: true,
        iconClass: 'vh-icon-shanchutishiicon vh-iconfont'
      })
        .then(() => {
          const data = {
            room_id: this.roomId,
            document_id: id,
            app_id: this.app_id
          };
          this.$vhallFetch('deleteDoc', data).then(res => {
            if (res.code === 200) {
              this.$message({
                message: this.t('删除成功'),
                type: 'success',
                customClass: 'el-message--success',
                iconClass: 'vh-icon-chenggongicon vh-iconfont'
              });
              this.getDocList();
            }
          });
        })
        .catch(() => {
          this.$message({
            message: this.t('已取消删除'),
            type: 'info',
            duration: 1000,
            customClass: 'el-message--info',
            iconClass: 'vh-icon-xiaoxiicon vh-iconfont'
          });
        });
    },
    search () {
      this.pageInfo.currentPage = 1;
      this.getDocList();
    },
    // ===============================对外暴露方法 start============================
    /**
     * 显示文档列表
     */
    showDocList () {
      this.isDoListcShow = true;
      this.pageInfo.currentPage = 1;
      this.searchKey = '';
      this.getDocList();
    },
    /**
     * 获取文档列表
     */
    getDocList () {
      let data = {
        room_id: this.roomId,
        curr_page: this.pageInfo.currentPage,
        page_size: this.pageInfo.pageSize,
        app_id: this.app_id
      };
      if (this.listType) {
        data.partition = this.listType;
      }
      if (this.searchKey) {
        data.file_name = this.searchKey.trim();
      }
      this.$vhallFetch('getDocList', data).then(res => {
        if (res.code == 200) {
          this.docList = res.data.detail.map(item => {
            let transformStr;
            const statusJpeg = item.status_jpeg * 1;
            const status = item.status * 1;
            if (statusJpeg === 0 && status === 0) {
              transformStr = this.t('待转码');
            } else if (statusJpeg === 100 || status === 100) {
              transformStr = this.t('转码中');
            } else if (statusJpeg === 200 || status === 200) {
              transformStr = this.t('转码完成');
            } else {
              transformStr = this.t('转码失败');
            }
            return {
              ...item,
              transform_schedule_str: transformStr
            };
          });
          console.log('测试获取文档数据=============', this.docList);
          this.pageInfo.total = res.data.total;
        }
      });
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
      this.$EventBus.$emit('component_doc_demonstration', {
        documentId
      });
      this.isDoListcShow = false;
    },
    t(name){
      return name;
    }
  }
};
</script>

<style lang="less">
.vh-doc {
  &-list {
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 0;
    }
    .el-table {
      margin-top: 0;
      color: #333;
    }
    .el-table tbody td:last-child .cell {
      padding-left: 10px;
      text-align: left;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(30, 144, 255, 0.1);
    }
    color: #b8bbca;
    &__dialog {
      background: #fff;
      position: fixed;
      border-radius: 4px;
      width: 880px;
      height: 520px;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      z-index: 1099;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 0px 10px 0px rgba(51, 82, 113, 0.27);
    }
    &--title {
      width: 100%;
      padding-top: 37px;
      padding-bottom: 26px;
      text-align: center;
      font-size: 20px;
      color: #555555;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-weight: 500;
      .vh-icon-close {
        position: absolute;
        cursor: pointer;
        top: 37px;
        right: 20px;
      }
    }
    &-header {
      padding: 0 40px 20px;
      &__tip {
        display: inline-block;
        width: 202px;
        word-break: break-all;
        font-size: 14px;
        line-height: 20px;
      }
    }
    &-search {
      float: right;
      width: 200px;
      .el-input__inner {
        height: 32px;
        border-radius: 16px;
      }
      .el-input__prefix,
      .el-input__suffix {
        line-height: 32px;
      }
      &-btn {
        color: #333;
        cursor: pointer;
        &:hover {
          color: #1e90ff;
        }
      }
    }
    &__uploader {
      display: inline-block;
    }
    &-content {
      padding: 0 40px;
      flex: 1;
      overflow-y: auto;

      .el-table thead th {
        background-color: #f1f2f6;
      }
      .pagination-wrapper {
        display: flex;
        margin-top: 60px;
        justify-content: center;
      }
      // &::-webkit-scrollbar-track{
      //   border-left: none;
      // }
      // &::-webkit-scrollbar-thumb {
      //   width: 3px;
      //   border-radius: 10px;
      //   background-color: #363636;
      // }
      // &::-webkit-scrollbar {
      //   border: none;
      // }
    }
    &__btn {
      cursor: pointer;
      & + .vh-doc-list__btn {
        margin-left: 10px;
      }
      &:hover {
        color: #1e90ff;
      }
      &--delete {
        &:hover {
          color: #ff1c1f;
        }
      }
    }
    &-status {
      margin-right: 10px;
    }
    &__icon {
      display: inline-block;
      width: 24px;
      height: 28px;

      vertical-align: middle;
      &.pdf {
        background: url('./images/pdf.png') no-repeat;
        background-size: 24px 28px;
      }
      &.doc {
        background: url('./images/doc.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.docx {
        background: url('./images/doc.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.jpg {
        background: url('./images/jpg.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.jpeg {
        background: url('./images/jpg.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.txt {
        background: url('./images/txt.png') no-repeat;
        // background-size: 37px 43px;
        background-size: 24px 28px;
      }
      &.ppt {
        background: url('./images/ppt.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.pptx {
        background: url('./images/ppt.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.xls {
        background: url('./images/xls.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.xlsx {
        background: url('./images/xls.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.png {
        background: url('./images/png.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
      &.gif {
        background: url('./images/gif.png') no-repeat;
        background-size: 24px 28px;
        // background-size: 37px 43px;
      }
    }
    .el-table__empty-block {
      height: 280px !important;
    }
    .el-table__empty-text {
      position: relative;
      display: inline-block;
      width: 150px;
      height: 150px;
      margin: 0 auto;
      background-image: url('./images/list-blank.png');
      background-size: cover;
      color: transparent;
    }
    .el-table td {
      padding: 11px 0;
    }
  }
}
</style>
