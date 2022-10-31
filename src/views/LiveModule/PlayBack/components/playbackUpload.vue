<template>
  <div class="playbackUploade">
    <vh-dialog
      title="选择音视频"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close='cancel'
      width="900px"
    >
      <vh-input
        placeholder="请输入音视频名称"
        autocomplete="off"
        clearable
        v-model="keyword"
        class="search-tag"
        @clear="getSearchList('search')"
        @blur="keyword&&getSearchList('search')"
        @keyup.enter.native="getSearchList('search')"
        ><i
          class="vh-icon-search vh-input__icon"
          slot="prefix"
          @click="getSearchList('search')"
        >
        </i>
      </vh-input>

      <span>一次最多支持选择20个视频文件</span>
      <vh-button
        size="medium"
        type="primary"
        class="btn_right"
        round
        @click="jumpPage"
        >上传</vh-button
      >

      <noData :nullType="'null'" text='您还未上传过音视频，快来创建吧!' v-if="!keyword&&!total">
        <vh-button
          size="medium"
          type="primary"
          round
          @click="jumpPage"
          >上传</vh-button
        >
      </noData>
      <vh-table
        v-else
        :data="tableData"
        class="table_base"
        @selection-change="changeTableCheckbox"
        height="400px"
      >
        <vh-table-column
          type="selection"
          width="55"
          align="left"
          :selectable="checkSelectable"
        />
        <vh-table-column label="音视频名称">
          <template slot-scope="scope">
            <vh-tooltip
              placement="top"
              :content="
                scope.row.video_name == '' ? '- -' : scope.row.video_name
              "
            >
              <div class="videoName custom-tooltip-content">
                <i
                  class="iconfont-v3 saasyinpinwenjian"
                  v-if="
                    scope.row.msg_url == '.mp3' || scope.row.msg_url == '.mav'
                  "
                ></i>
                <i class="iconfont-v3 saasshipinwenjian" v-else></i>
                {{ scope.row.video_name || '- -' }}
              </div>
            </vh-tooltip>
          </template>
        </vh-table-column>
        <vh-table-column width="180" prop="created_at" label="上传时间">
        </vh-table-column>
        <vh-table-column width="100" prop="duration" label="时长">
        </vh-table-column>
        <vh-table-column prop="transcode_status_text" width="110" label="进度">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.uploadObj">
                <!-- 上传 -->
                <span>{{
                  scope.row.uploadObj.num == 100 ? '上传已完成' : '文件上传中'
                }}</span>
                <vh-progress
                  :percentage="scope.row.uploadObj.num"
                ></vh-progress>
              </p>
              <!-- {{scope.row}} -->
              <p v-if="scope.row.transcode_status_text">
                <!-- 列表 -->
                <span
                  class="statusTag"
                  :class="
                    scope.row.transcode_status == 1
                      ? 'success'
                      : scope.row.transcode_status == 0
                      ? 'wating'
                      : 'failer'
                  "
                  >{{ scope.row.transcode_status_text }}</span
                >
              </p>
            </div>
          </template>
        </vh-table-column>
        <vh-table-column width="110" prop="storage" label="转码后大小">
        </vh-table-column>
        <vh-table-column width="100" label="操作">
          <template slot-scope="scope">
            <vh-button
              type="text"
              @click="preview(scope.row)"
              v-if="scope.row.transcode_status == 1"
              >预览</vh-button
            >
          </template>
        </vh-table-column>
        <div slot="empty">
          <noData :nullType="'null'" v-if="!total"></noData>
        </div>
      </vh-table>
      <div class="checked_length">
        当前选择<span>{{ checkedList.length }}</span
        >个文件
      </div>

      <span slot="footer" class="dialog-footer">
        <vh-button type="primary" @click="sure" round size="medium"
          >确定</vh-button
        >
        <vh-button @click="cancel" round size="medium">取消</vh-button>
      </span>
    </vh-dialog>
    <!-- 预览组件 -->
    <span v-if="showDialog">
      <vh-dialog
        class="vh-saas-dialog"
        :visible.sync="showDialog"
        :before-close="closeBefore"
        width="640px"
        center
        :show-close='false'
        :close-on-click-modal="true"
        :close-on-press-escape="false"
      >
        <i class="vh-icon vh-icon-close" @click="closeBefore"></i>
        <video-preview
          ref="videoPreview"
          :videoParam="videoParam"
        ></video-preview>
      </vh-dialog>
    </span>
  </div>
</template>

<script>
import noData from '@/views/PlatformModule/Error/nullPage'
import VideoPreview from '@/views/MaterialModule/VideoPreview/index.vue'
import { sessionOrLocal } from '@/utils/utils'
export default {
  components: { noData, VideoPreview },
  data() {
    return {
      dialogVisible: false,
      keyword: '',
      pageInfo: {
        pageNum: 1,
        pos: 0,
        limit: 10
      },
      tableData: [],
      checkedList: [],
      total: 0,
      videoParam: {},
      showDialog: false
    }
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
  },
  methods: {
    getSearchList(params) {
      if (params == 'search') {
        this.pageInfo.pageNum = 1
        this.pageInfo.pos = 0
      }
      let formParams = {
        get_no_trans: 0,
        user_id: this.userId,
        ...this.pageInfo
      }
      if (this.keyword) {
        formParams = {
          title: this.keyword
        }
      }
      this.isSearch = this.keyword ? true : false
      this.getTableList(formParams,params)
    },
    //
    getTableList(obj,type) {
      this.$fetch('dataVideoList', obj)
        .then(res => {
          if (res.code == 200) {
            this.total = res.data.total
            // 转码状态:0新增排队中 1转码成功 2转码失败 3转码中
            res.data.list.forEach(ele => {
              ele.video_name = ele.name
              ele.msg_url = ele.msg_url.toLowerCase()
              switch (ele.transcode_status) {
                case '0':
                  ele.transcode_status_text = '转码中'
                  ele.duration = '——'
                  break
                case '1':
                  ele.transcode_status_text = '转码成功'
                  break
                case '2':
                  ele.transcode_status_text = '转码失败'
                  ele.duration = '——'
                  break
                case '3':
                  ele.transcode_status_text = '转码中'
                  ele.duration = '——'
                  break
                default:
                  ele.transcode_status_text = '转码中'
                  ele.duration = '——'
                  break
              }
            })
            this.tableData = type == 'search' ? res.data.list : this.tableData.concat(res.data.list)
            this.$nextTick(()=>{
              document
              .querySelector('.table_base')
              .querySelector('.vh-table__body-wrapper')
              .addEventListener('scroll', this.handleScroll)
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 更改选中数据
    changeTableCheckbox(item) {
      this.checkedList = item.map(val => val.id)
      // console.log(this.checkedList, 'this.checkedList')
    },
    checkSelectable(row) {
      if (row.transcode_status_text) {
        return true
      } else {
        return false
      }
    },
    // 滚动加载
    handleScroll() {
      let domHeight = document
        .querySelector('.table_base')
        .querySelector('.vh-table__body-wrapper').offsetHeight
      let scrollTop = document
        .querySelector('.table_base')
        .querySelector('.vh-table__body-wrapper').scrollTop
      let contentH = document
        .querySelector('.table_base')
        .querySelector('.vh-table__body').offsetHeight
      if (
        contentH == scrollTop + domHeight &&
        this.total > this.tableData.length
      ) {
        this.pageInfo.pos += 10
        this.pageInfo.pageNum += 1
        this.getSearchList()
        console.log('加载接口', '.scrollTop')
      }
      // console.log(scrollTop, domHeight, contentH, '.scrollTop')
    },
    // 同步数据接口
    sure() {
      if (!this.checkedList.join()) {
        this.$message.warning('请选择音视频')
        return false
      }
      this.$fetch('recordUpload', {
        webinar_id: this.$route.params.str,
        record_ids: this.checkedList.join()
      }).then(res => {
        if (res.code == 200) {
          this.cancel()
          // this.getSearchList()
          this.$emit('search')
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 关闭上传回放弹框
    cancel() {
      this.dialogVisible = false
      this.checkedList = []
      this.tableData = []
    },
    // 跳转 资料管理-音视频
    jumpPage() {
      this.$confirm('上传资源会离开当前页面，将丢失已编辑信息，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel',
        closeOnClickModal: false
      }).then(()=>{
        this.$router.push('/material/video')
      }).catch(()=>{});
    },
    // 预览
    preview(data) {
      this.showDialog = true
      this.videoParam = data
    },
    //
    closeBefore() {
      this.$refs.videoPreview.destroy()
      this.showDialog = false
    }
  }
}
</script>

<style lang="less">
.playbackUploade {
  .search-tag {
    width: 220px;
    margin-bottom: 20px;
    margin-right: 12px;
    // TODO:vh-ui 需后续支持input圆角
    .vh-input__icon {
      line-height: 36px;
    }
    .vh-input__inner {
      border-radius: 50px;
      user-select: none;
      // height: 36px;
      // line-height: 36px;
      padding-right: 30px !important;
    }
    .vh-input__prefix {
      cursor: pointer;
    }
  }
  .btn_right {
    float: right;
  }
    .checked_length{
      position: absolute;
      bottom: 40px;
      span{
        color: #fb2626;
      }
    }
  .table_base {
    // height: 400px;
    overflow: auto;
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background-color: transparent;
    }
    ::-webkit-scrollbar-thumb {
      height: 60px;
      -webkit-border-radius: 10px;
      border-radius: 10px;
      background: #e0e0e0;
    }
  }
  .vh-saas-dialog {
    .vh-icon-close {
      position: absolute;
      right: 0;
      top: 20px;
      font-size: 16px;
      color: #fff;
      cursor: pointer;
    }
    .vh-dialog {
      box-shadow: none;
      background: transparent !important;
    }
    .vh-dialog__header {
      background: transparent !important;
    }
    .vh-dialog__body {
      padding: 4px 6px;
      background: #000;
      border-radius: 4px;
    }
  }
}
</style>
