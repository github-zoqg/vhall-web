<template>
  <div class="playbackUploade">
    <el-dialog
      title="选择音视频"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="900px"
    >
      <VhallInput
        placeholder="请输入音视频名称"
        autocomplete="off"
        clearable
        v-clearEmoij
        v-model="keyword"
        class="search-tag"
        @clear="getSearchList('search')"
        @keyup.enter.native="getSearchList('search')"
        ><i
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="getSearchList('search')"
        >
        </i>
      </VhallInput>

      <span>一次最多支持选择20个视频文件</span>
      <el-button
        size="medium"
        type="primary"
        class="btn_right"
        round
        @click="jumpPage"
        >上传</el-button
      >

      <el-table
        :data="tableData"
        class="table_base"
        @selection-change="changeTableCheckbox"
        :header-cell-style="{
          background: '#f7f7f7',
          color: '#666',
          height: '56px'
        }"
      >
        <el-table-column
          type="selection"
          width="52"
          align="left"
          :selectable="checkSelectable"
        />
        <el-table-column label="音视频名称">
          <template slot-scope="scope">
            <el-tooltip
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
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column width="180" prop="created_at" label="上传时间">
        </el-table-column>
        <el-table-column width="100" prop="duration" label="时长">
        </el-table-column>
        <el-table-column prop="transcode_status_text" width="110" label="进度">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.uploadObj">
                <!-- 上传 -->
                <span>{{
                  scope.row.uploadObj.num == 100 ? '上传已完成' : '文件上传中'
                }}</span>
                <el-progress
                  :percentage="scope.row.uploadObj.num"
                ></el-progress>
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
        </el-table-column>
        <el-table-column width="110" prop="storage" label="转码后大小">
        </el-table-column>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="preview(scope.row)"
              v-if="scope.row.transcode_status == 1"
              >预览</el-button
            >
          </template>
        </el-table-column>
        <div slot="empty">
          <noData :nullType="'null'" v-if="!total"></noData>
        </div>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit" round size="medium"
          >确定</el-button
        >
        <el-button @click="dialogVisible = false" round size="medium"
          >取消</el-button
        >
      </span>
    </el-dialog>
    <!-- 预览组件 -->
    <span v-if="showDialog">
      <el-dialog
        class="vh-saas-dialog"
        :visible.sync="showDialog"
        :before-close="closeBefore"
        width="640px"
        center
        :close-on-click-modal="true"
        :close-on-press-escape="false"
      >
			<i class="el-icon el-icon-close" @click="closeBefore"></i>
        <video-preview
          ref="videoPreview"
          :videoParam="videoParam"
        ></video-preview>
      </el-dialog>
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
        limit: 20
      },
      tableData: [],
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
      this.getTableList(formParams)
    },
    //
    getTableList(obj) {
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
            this.tableData = res.data.list
            for (let i = 0; i < 30; i++) {
              this.tableData.push(res.data.list[0])
            }
            document
              .querySelector('.table_base')
              .addEventListener('scroll', this.handleScroll)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 更改选中数据
    changeTableCheckbox(item) {
      this.checkedList = item.map(val => val.id)
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
      let domHeight = document.querySelector('.table_base').offsetHeight
      let scrollTop = document.querySelector('.table_base').scrollTop
      let contentH = document.querySelector('.table_base').querySelector('.el-table__body-wrapper').offsetHeight
      console.log(scrollTop, domHeight,contentH, '.scrollTop')
    },
    //
    confirmEdit() {},
    // 跳转 资料管理-音视频
    jumpPage() {
      this.$router.push('/material/video')
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
    .el-input__icon {
      line-height: 36px;
    }
    .el-input__inner {
      border-radius: 50px;
      user-select: none;
      height: 36px;
      line-height: 36px;
      padding-right: 30px !important;
    }
    .el-input__prefix {
      cursor: pointer;
    }
  }
  .btn_right {
    float: right;
  }
  .table_base {
    height: 400px;
    overflow: auto;
  }
  .vh-saas-dialog {
		.el-icon-close{
			position: absolute;
			right: 0;
			top: 20px;
			font-size: 16px;
			color: #fff;
			cursor: pointer;
		}
    .el-dialog {
			box-shadow: none;
      background: transparent !important;
    }
    .el-dialog__header {
      background: transparent !important;
    }
    .el-dialog__body {
      padding: 4px 6px;
      background: #000;
      border-radius: 4px;
    }
  }
}
</style>
