<template>
  <div class="data-list">
    <el-table
      ref="elTable"
      :data="manageTableData"
      :row-key="setRowKeyFun"
      @selection-change="handleTableCheckbox"
      :max-height="maxHeight"
      :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
    >
      <el-table-column
        type="selection"
        width="55"
        align="left"
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
                    : '视频正在上传中'
                }}</span>
                <el-progress
                  :percentage="scope.row.uploadObj.num"
                ></el-progress>
              </p>
              <!-- {{scope.row}} -->
              <p v-if="scope.row.transcode_status_text">
                <!-- 列表 -->
                <span>{{ scope.row.transcode_status_text }}</span>
              </p>
            </div>
            <div v-else-if="item.key === 'img'">
              <img
                class="imgs"
                :src="scope.row.img"
                width="40"
                height="40"
              />
            </div>
            <div v-else-if="item.key === 'img_url'">
              <img
                :src="scope.row.img_url"
               class="advImg"
              />
            </div>
            <div v-else-if="item.key === 'watch'">
              <el-switch
                @change="switchChange(scope.row)"
                v-model="scope.row.watch"
                active-color="#ff4949"
                inactive-color="#ccc">
              </el-switch>
            </div>
            <div v-else-if="item.key === 'status'" class="status-show">
              <p>
                <span :class="scope.row.status =='1' ? 'active-success': scope.row.status =='2' ? 'active-error' : 'active-waiting'"></span>
                {{ scope.row.statusText }}</p>
            </div>
            <div v-else-if="item.key === 'imgOrText'">
              <p v-html="scope.row.imgOrText"></p>
            </div>
            <div v-else-if="scene === 'word' && item.key === 'transform_schedule_str'">
              <el-progress :percentage="scope.row.codeProcess" v-if="scope.row.codeProcess && !scope.row.transcoded"></el-progress>
              <span v-else-if="scope.row.transcoded">转码完成</span>
              <span v-else>{{scope.row.transform_schedule_str}}</span>
            </div>
            <p v-else class="text">
              <icon v-if="scene === 'word' && item.key === 'file_name'" class="word-status" :icon-class="scope.row.ext | wordStatusCss"></icon>
              {{ scope.row[item.key] }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          v-if="isHandle"
          :width="width"
        >
          <template slot-scope="scope">
            <template  v-for="(item, index) in tableRowBtnFun">
              <el-button
                :key="index"
                size="mini"
                type="text"
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
      v-if="needPagination && totalNum"
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
      type: Number,
      default: 300,
    },
    maxHeight: {
      type: [Number, String],
      default: 450,
    },
    scene: {
      type: String,
      default: 'normal' // 场景，按场景展示
    }
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
      this.$emit('changeTableCheckbox', val);
    },
    // 复选记忆函数
    setRowKeyFun() {
      // console.log(row);
      // return row.liveId || row.riaId;
    },
    // 清除记忆
    clearSelect() {
      this.$refs.elTable.clearSelection();
    },
  },
};
</script>
<style lang="less" scoped>
.data-list {
  .word-status {
    margin-right: 12px;
  }
  /deep/.cell .imgs {
    width: 100px;
    height: 100px;
  }
   /deep/.cell .advImg {
    width: 142px;
    height: 80px;
  }
  /deep/.el-table {
    margin-bottom: 30px;
  }
  /deep/.el-table__header{
    background-color: #FB3A32;
  }
  /deep/.el-table td, .el-table th{
    padding: 15px 0;
  }
  .text{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  }
  .empty{
    text-align: center;
  }
}
</style>
