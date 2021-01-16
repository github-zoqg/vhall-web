<template>
  <div :class="['data-list', {'no-height': manageTableData && manageTableData.length === 0}]">
    <el-table
      ref="elTable"
      :data="manageTableData"
      @selection-change="handleTableCheckbox"
      :max-height="maxHeight"
      :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
      :row-class-name="tableRowClassName"
      :row-style="tableRowStyle"
    >
      <div slot="empty" style="height:0"></div>
      <el-table-column
        type="selection"
        width="55"
        align="left"
        :selectable="checkSelectable"
        v-if="isCheckout"
      />
      <template>
        <el-table-column
          align="left"
          v-for="(item, index) in tabelColumnLabel"
          :key="index"
          :width="item.width"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[item.isEdit] }}</span>
            <div v-if="item.key == 'transcode_status_text'">
              <p v-if="scope.row.uploadObj">
                <!-- 上传 -->
                <span>{{
                  scope.row.uploadObj.num == 100
                    ? '上传已完成'
                    : '文件上传中'
                }}</span>
                <el-progress
                  :percentage="scope.row.uploadObj.num"
                ></el-progress>
              </p>
              <!-- {{scope.row}} -->
              <p v-if="scope.row.transcode_status_text">
                <!-- 列表 -->
                <span class="statusTag" :class="scope.row.transcode_status == 1 ? 'success' : 'failer'">{{ scope.row.transcode_status_text }}</span>
              </p>
            </div>
            <div v-else-if="item.key === 'img'" class="prizeImg">
              <img
                :src="scope.row.img"
              />
            </div>
            <div v-else-if="item.key === 'img_url'" class="advImg">
              <img
                :src="scope.row.img_url"
              />
            </div>
            <div v-else-if="item.key === 'watch'">
              <p class="switch__box">
                <el-switch
                  @change="switchChange(scope.row)"
                  v-model="scope.row.watch"
                  active-color="#ff4949"
                  inactive-color="#ccc">
                </el-switch>
              </p>

            </div>
            <!-- 开发设置，状态 -->
            <div v-else-if="scene === 'development' && item.key === 'statusStr'" class="status-show">
              <p>
                <span :class="scope.row.status > 0 ? 'active-success' : 'active-gray'"></span>
                {{ scope.row.statusStr }}</p>
            </div>
            <div v-else-if="item.key === 'status'" class="status-show">
              <p>
                <span :class="scope.row.status == '1' ? 'active-success': scope.row.status == '-1' ? 'active-error' : 'active-waiting'"></span>
                {{ scope.row.statusText }}</p>
            </div>
            <!-- 消息中心，消息类型 -->
            <div v-else-if="scene === 'msg_list' && item.key === 'msgStatusStr'" class="status-show">
              <p>
                <span :class="scope.row.msg_status > 0 ? 'active-success' : 'active-error'"></span>
                {{ scope.row.msgStatusStr }}</p>
            </div>
            <!-- 下载中心，文件名 -->
            <div v-else-if="scene === 'downloadList' && item.key === 'file_name'">
              <!-- <i class="icon_tag" v-if="Number(scope.row.dow_status) === 0 && Number(scope.row.file_status) === 1"></i> -->
              <p class="text">
                <icon icon-class="saasexcelwendang" v-if="Number(scope.row.dow_status)!= undefined && Number(scope.row.file_status) != undefined"></icon>
                <!--  <icon class="word-status" :icon-class="scope.row.ext | wordStatusCss"></icon> -->
                {{ scope.row.file_name }}
              </p>
            </div>
            <!-- 下载中心，生成状态 -->
            <div class="progressBox" v-else-if="scene === 'downloadList' && item.key === 'fileStatusStr'">
              <el-progress :percentage="scope.row.percentage" v-if="Number(scope.row.file_status) === 0"></el-progress>
              <span :class="[scope.row.fileStatusCss, 'statusTag']" v-else>{{scope.row.fileStatusStr}}<span @click="handleBtnClick(scope, { name: '重新生成', methodName: 'resetDownload' })"><icon v-if="Number(scope.row.file_status) === 2" icon-class="saasicon-reset"></icon></span></span>
            </div>
            <div v-else-if="item.key === 'imgOrText'">
              <p v-html="scope.row.imgOrText"></p>
            </div>
            <!-- 文档，进度 (Old) <div v-else-if="scene === 'word' && item.key === 'transform_schedule_str'">
              <span v-if="!scope.row.transform_schedule_str">{{scope.row.isUpload ? '上传' : ''}}{{scope.row.codeProcess}}%</span><el-progress :show-text=false status="success" :percentage="scope.row.codeProcess" v-if="!scope.row.transform_schedule_str"></el-progress>
              <span v-else v-html="scope.row.transform_schedule_str"></span>
            </div> -->
            <!-- 文档，进度 -->
            <div v-else-if="scene === 'word' && item.key === 'transform_schedule_str'">
              <span v-if="!scope.row.transform_schedule_str">{{scope.row.isUpload ? '上传' : ''}}{{scope.row.codeProcess}}%</span>
              <el-progress v-if="!scope.row.transform_schedule_str" :show-text=false status="success" :percentage="scope.row.codeProcess"></el-progress>
              <div v-else class="progressBox">
                <!-- 样式变化 -->
                <span :class="[scope.row.fileStatusCss, 'statusTag']">{{scope.row.fileStatusStr}}<span><icon v-if="Number(scope.row.showEventType) === 5 || Number(scope.row.showEventType) === 7" icon-class="saasicon-reset"></icon></span></span>
              </div>
            </div>
            <div v-else-if="item.key === 'video_name'" class="videoName">
              <i class="iconfont-v3 saasyinpinwenjian" v-if="scope.row.msg_url == '.mp3' || scope.row.msg_url == '.mav'"></i>
              <i class="iconfont-v3 saasshipinwenjian" v-else></i>
              {{ scope.row[item.key]  || '- -'}}
            </div>
            <p v-else :class="item.key == 'price' || item.key == 'discount_price' ? 'grayText' :  'text'" :title="scope.row[item.key]">
              <icon v-if="scene === 'word' && item.key === 'file_name'" class="word-status" :icon-class="scope.row.ext | wordStatusCss"></icon>{{ scope.row[item.key] == '' ? '- -' : scope.row[item.key] }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          v-if="isHandle && scene === 'development'"
          :width="width"
          class="btn-rows"
        >
          <template slot-scope="scope">
            <el-button v-preventReClick v-if="Number(scope.row.status) === 0" @click="handleBtnClick(scope, {
              name: '启用',
              methodName: 'restartApp'
            })" size="mini" type="text">启用</el-button>
            <el-button v-preventReClick v-if="Number(scope.row.status) === 1" @click="handleBtnClick(scope, {
              name: '停用',
              methodName: 'stopApp'
            })" size="mini" type="text">停用</el-button>
            <el-button v-preventReClick @click="handleBtnClick(scope, {
              name: '删除',
              methodName: 'deleteApp'
            })" size="mini" type="text">删除</el-button>
            <el-button v-preventReClick @click="handleBtnClick(scope, {
               name: '查看',
               methodName: 'viewApp'
            })" size="mini" type="text">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          v-else-if="isHandle && scene === 'downloadList'"
          :width="width"
          class="btn-rows"
        >
           <template slot-scope="scope">
            <a :href="scope.row.dow_url" v-preventReClick v-if="Number(scope.row.file_status) === 1" @click="handleBtnClick(scope, {
              name: '下载',
              methodName: 'download'
            })" style="margin-right: 8px;">
              <el-button style="font-size: 14px" size="mini" type="text">下载</el-button>
            </a>
            <el-button style="font-size: 14px" size="mini" type="text" v-preventReClick @click="handleBtnClick(scope, {
              name: '删除',
              methodName: 'delDownload'
            })">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="left"
          v-if="isHandle && scene !== 'development' && scene !== 'downloadList'"
          :width="width"
          class="btn-rows"
        >
          <template slot-scope="scope">
            <template  v-for="(item, index) in tableRowBtnFun">
              <el-button
                :key="index"
                type="text"
                v-preventReClick
                @click="handleBtnClick(scope, item)"
                v-if="checkShowHandle(scope.row, item)"
              >{{ item.name }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <SPagination
      :total="totalNum"
      v-if="needPagination && totalNum > 10"
      :currentPage="pageInfo.pageNum"
      @current-change="currentChangeHandler"
      align="center"
    >
    </SPagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageInfo: {
        pageNum: 1,
        pos: 0,
        limit: 10,
      },
      isUpdate: 0,
      oldVal: []
    };
  },
  props: {
    tabelColumnLabel: Array,
    manageTableData: Array,
    tableRowBtnFun: Array,
    totalNum: Number,
    isCheckout: {
      type: Boolean,
      default: true,
    },
    isHandle: {
      type: Boolean,
      default: true,
    },
    needPagination: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [Number, String],
      default: 300,
    },
    maxHeight: {
      type: [Number, String],
      default: '100%',
    },
    scene: {
      type: String,
      default: 'normal' // 场景，按场景展示
    },
  },
  watch: {
    manageTableData: {
      handler: function (oldData) {
        // console.log(oldData[0].uploadObj, 'watch变化');
        this.isUpdate = Math.random() * 100;
      },
      immediate: false,
      deep: true,
    },
  },
  created() {
    // console.log('tabelColumnLabel', this.tabelColumnLabel);
    // console.log('manageTableData', this.manageTableData);
  },
  methods: {
    // 开关状态切换的回调
    switchChange(option) {
      this.$emit('switchChange', option);

      console.log(option);
    },
    isImg(_data) {
      if (['.png', '.jpg', 'jpeg'].includes(_data.substr(-4))) {
        return true;
      } else {
        return false;
      }
    },
    // 行内操作按钮点击
    handleBtnClick(scope, item) {
      let obj = {
        rows: scope.row,
        path: item.path || '',
        type: item.methodName,
      };
      this.$emit('onHandleBtnClick', Object.assign({}, obj));
    },
    checkShowHandle(row, item) {
      if (this.scene === 'accountList') {
        return row.parent_id > 0 || (item.methodName === 'toSonDetail' && Number(row.parent_id) === 0);
      } else {
        return true;
      }
    },
    // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageInfo.pageNum = current;
      this.pageInfo.pos = parseInt((current - 1) * this.pageInfo.limit);
      this.$emit('getTableList', this.pageInfo);
    },
    // 复选框操作
    handleTableCheckbox(val) {
      this.oldVal = val;
      this.$emit('changeTableCheckbox', val);
    },
    // 状态栏
    tableRowClassName({row, rowIndex}) {
      if (this.scene === 'msg_list') {
        // 消息状态区分，已读 or 未读
        let ids = this.oldVal.map(item => item.msg_id);
        if (ids && ids.includes(row.msg_id)) {
          return 'ok-check-row'
        } else if (row.msg_status > 0) {
          return 'ok-read-row';
        } else {
          return 'no-read-row';
        }
      } else {
        return '';
      }
    },
    // 给下载中心列表用，给已成功下载的行置灰
    tableRowStyle({row, rowIndex}) {
      if (row.file_status == 1 && row.dow_status == 1) {
        return {
          color: '#BEBEBE'
        }
      }
    },
    // 复选记忆函数
    setRowKeyFun() {
      // console.log(row);
      // return row.liveId || row.riaId;
    },
    // 清除记忆
    clearSelect() {
      this.oldVal = [];
      this.$refs.elTable.clearSelection();
    },
    checkSelectable(row) {
      if (this.scene === 'accountList') {
        return row.parent_id > 0;
      } else if (this.scene === 'downloadList') {
        return Number(row.file_status) === 1;
      } else if(this.scene === 'roleList') {
        return !(row.child_count > 0);
      }else {
        return true;
      }
    }
  },
};
</script>
<style lang="less" scoped>
.data-list {
  min-height: 650px;
  &.no-height {
    min-height: 0;
    /deep/.el-table {
      margin-bottom: 0;
    }
    /deep/.el-table__empty-block {
      height: 0!important;
      min-height: 0;
    }
  }
  .downloadStatus {
    display: inline-block;
    width: 146px;
  }
  .word-status {
    margin-right: 12px;
    &.iconContainer {
      padding-right: 0;
    }
    /deep/i.iconfont-v3 {
      font-size: 20px;
    }
  }
   /deep/.cell .advImg {
    width: 142px;
    height: 80px;
    background: #1a1a1a;
    border-radius: 4px;
    img{
      width:100%;
      height:100%;
      object-fit: scale-down;
    }
  }
  /deep/.cell .prizeImg{
    width: 80px;
    height: 80px;
    background: #FFF;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
    img{
      width:100%;
      height:100%;
      border-radius: 4px;
      object-fit: scale-down;
    }
  }
  /deep/.el-table {
    margin-bottom: 30px;
  }
  /* /deep/.el-table__header{
    background-color: #FB3A32;
  } */
  /deep/.el-table td, .el-table th{
    padding: 15px 0;
  }
  .text{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .grayText{
      color: #666;
    }
  /deep/.el-button.el-button--text {
    color: #1A1A1A;
    border: 0;
    &:hover{
      color: #FB3A32;
    }
    // /deep/.el-button.text--default {
    //   margin-right: 20px;
    //   color: #999999;
    //   font-size: 14px;
    //   &:last-child {
    //     margin-right: 0;
    //   }
    //   &:hover {
    //     color: #5d81fb;
    //     &:after {
    //       border-bottom: 1px solid #5d81fb;
    //     }
    //   }
    //   &:active {
    //     color: #3157e1;
    //     &:after {
    //       border-bottom: 1px solid #3157e1;
    //     }
    //   }
    //   &:disabled {
    //     color: #9db3fc;
    //     &:after {
    //       border-bottom: 1px solid #9db3fc;
    //     }
    //   }
    // }
  }
   .icon_tag {
    width: 8px;
    height: 8px;
    background: #FB3A32;
    position: absolute;
    border-radius: 100%;
    z-index: 20;
    margin-top: 0;
    margin-left: -4px;
  }
  /deep/ .saasexcelwendang{
    font-size: 20px;
    color: #14BA6A;
  }
  .iconContainer {
    padding-right: 5px;
  }
  .progressBox {
    /deep/ .el-progress-bar__inner {
      background-color: #14BA6A;
    }
  }
  .statusTag{
    font-size: 14px;
    &::before{
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    &.wating::before{
      background:#FA9A32;
    }
    &.success::before{
      background:#14BA6A;
    }
    &.failer::before{
      background:#FB3A32;
    }
    .iconContainer {
      padding-left: 10px;
      cursor: pointer;
    }
    /deep/ .saasicon-reset {
      color: #FB3A32;
    }
  }
  .status-show{
    span{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
      margin-top: -3px;
    }
    .active-success {
      background: #14BA6A;
    }
    .active-error {
      background: #FB3A32;
    }
    .active-waiting {
      background: #FA9A32;
    }
    .active-gray {
      background: #999999;
    }
  }
  .empty{
    text-align: center;
  }
  .videoName{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .iconfont-v3{
      font-size: 20px;
      vertical-align: middle;
    }
    .saasyinpinwenjian{
      color: #10d3a8;
      padding-right: 3px;
    }
    .saasshipinwenjian{
      color: #ff733c;
      padding-right: 3px;
    }
  }
}
/* 表格行样式 */
/deep/.el-table .no-read-row {
  font-size: 14px;
  font-weight: 400;
  color: #1A1A1A;
}
/deep/.el-table .ok-read-row {
  font-size: 14px;
  font-weight: 400;
  color: #999999;
}
/deep/.el-table .ok-check-row {
  background: #F7F7F7;
  border-radius: 2px 0 0 2px;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
}
.el-table /deep/.el-button.el-button--text {
  padding: 0 0;
}
/deep/.button.el-button.el-button--mini{
  font-size: 14px;
}
.btn-rows {
  /deep/.el-button {
    margin-left:16px;
    font-size: 14px;
    &:first-child {
      margin-left: 0;
    }
  }
}
/deep/.el-checkbox__inner {
  border-color: #999999;
  &:hover, &:active {
    border-color: #FB3A32;
  }
}
/deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #f7f7f7;
  border-color: #B3B3B3;
  cursor: not-allowed;
}
</style>
