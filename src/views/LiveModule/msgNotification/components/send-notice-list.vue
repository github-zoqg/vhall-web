<template>
  <VhallDialog :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    width="840px"
    class="send-notice-list__dialog">
    <div slot="title" class="dialog__title">
      <span class="el-dialog__title vh-dialog__title">发送记录</span>
      <vh-tooltip effect="dark" content="仅保留近一年的发送记录" placement="right">
        <i class="iconfont-v3 saasicon_help_m dialog__title__icon"></i>
      </vh-tooltip>
    </div>
    <!-- 搜索层 -->
    <div class="search-data">
      <vh-date-picker
        v-model="searchDate"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator=" 至 "
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="searchSendNoticeList"
        class="search-data__date"
      />
      <vh-input
        type="text"
        class="search-data__input" size="medium" round placeholder="搜索昵称/手机号" v-model.trim="query.keyword" clearable @clear="searchSendNoticeList" @keyup.enter.native="searchSendNoticeList">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </vh-input>
      <vh-button round ghost size="medium" class="search-data__btn"  @click="exportSendData">导出数据</vh-button>
    </div>
    <!-- tab切换层 -->
    <vh-tabs v-model="activeName" @tab-click="handleClick">
      <vh-tab-pane :label="item.label" :name="item.key" v-for="(item, index) in tabList" :key="index"></vh-tab-pane>
    </vh-tabs>
    <!-- 表格层 -->
    <div class="tab-content">
      <vh-table ref="noticeTable" :data="noticeResults.list">
        <vh-table-column
          align="left"
          v-for="(item, index) in tableColumn"
          :key="index"
          :width="item.width"
          :label="item.label"
          :show-overflow-tooltip="!item.customTooltip"
        >
          <template slot-scope="scope">
            <div class="icon-status" v-if="item.key === 'send_status'">
              <i class="icon-dot" :style="{background: scope.row[item.key] == 1 ? '#0FBA5A' : '#FB2626'}"></i>
              <span>{{ ['- -', '发送成功', '发送失败'][scope.row[item.key]] || '' }}</span>
            </div>
            <span v-else>{{ scope.row[item.key] || '- -' }}</span>
          </template>
        </vh-table-column>
      </vh-table>
      <div class="tab-content_page">
        <p class="notice-info">发送成功：<span class="color-blue">{{noticeResults.success_total}}</span> 条<span class="span-between">&nbsp;</span>发送失败：<span class="color-red">{{noticeResults.fail_total}}</span> 条</p>
        <SPagination
          :total="noticeResults.total"
          v-show="noticeResults.total > 10"
          :currentPage="pageNum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="query.limit"
          layout="prev, pager, next"
          @current-change="currentChangeHandler"
          @size-change="handleSizeChange"
          align="center"
        >
        </SPagination>
      </div>
    </div>
  </VhallDialog>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: true,
        query: {
          start_time: '',
          end_time: '',
          keyword: '',
          pos: 0,
          limit: 10
        },
        searchDate: '',
        pageNum: 1,
        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: (time) => {
            return this.dealDisabledDate(time);
          }
        },
        tabList: [
          {
            label: '短信成功通知',
            key: 'dx_success'
          },
          {
            label: '短信开播提醒',
            key: 'dx_start'
          },
          {
            label: '短信回放通知',
            key: 'dx_playback'
          }
          // {
          //   label: '微信关注通知',
          //   key: 'wx_flower'
          // },
          // {
          //   label: '微信开播提醒',
          //   key: 'wx_start'
          // },
          // {
          //   label: '微信回放通知',
          //   key: 'wx_playback'
          // }
        ],
        activeName: 'dx_success',
        tableColumn: [
          {
            label: '昵称',
            key: 'nick_name',
            width: 'auto'
          },
          {
            label: '手机号',
            key: 'phone',
            width: 'auto'
          },
          {
            label: '来源',
            key: 'refer',
            width: 'auto'
          },
          {
            label: '发送状态',
            key: 'send_status',
            width: 'auto'
          },
          {
            label: '发送时间',
            key: 'send_date',
            width: 'auto'
          },
          {
            label: '备注',
            key: 'remark',
            width: '200px'
          }
        ],
        isHandle: false,
        noticeResults: {
          total: 1000,
          success_total: 200,
          fail_total: 800,
          list: [
            {
              nick_name: 'aaaa',
              send_status: 1
            },
            {
              nick_name: 'aaaa',
              send_status: 2
            },
            {
              nick_name: 'aaaa'
            },
            {
              nick_name: 'aaaa'
            },
            {
              nick_name: 'aaaa'
            }
          ]
        }
      };
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    inject: ['app'],
    methods: {
      dealDisabledDate(time) {
        return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
      },
      // 每页改变条数事件
      handleSizeChange(val) {
        this.query.limit = val
        this.searchSendNoticeList('init')
      },
      // 页码改变按钮事件
      currentChangeHandler(current) {
        this.pageNum = current
        this.query.pos = parseInt((current - 1) * this.query.limit)
        this.searchSendNoticeList()
      },
      handleClick(tab, event) {
        console.log(tab, event);
        this.searchSendNoticeList('init')
      },
      // 关闭弹出框
      handleClose() {
        this.dialogVisible = true
        this.$emit('close')
      },
      // 搜索(重置第1页 或者 不重置)
      searchSendNoticeList(type = null) {
        if (type) {
          this.query.pos = 0;
          this.pageNum = 1;
        }
        if (this.searchDate) {
          this.query.start_time = this.searchDate[0];
          this.query.end_time = this.searchDate[1];
        }
        this.$fetch('getAdvList', this.$params({
          webinar_id: this.$route.params.str || '',
          ...this.query
        })).then(res => {
          if (res && res.code == 200 && res.data) {
            this.noticeResults = res.data
          } else {
            this.noticeResults = {
              total: 0,
              success_total: 0,
              fail_total: 0,
              list: []
            }
          }
        }).catch(() => {
          this.noticeResults = {
            total: 0,
            success_total: 0,
            fail_total: 0,
            list: []
          }
        });
      },
      // 导出发送记录数据
      exportSendData() {
        if (this.searchDate) {
          this.query.start_time = this.searchDate[0];
          this.query.end_time = this.searchDate[1];
        }
        this.$fetch('exportOnline', this.$params({
          webinar_id: this.$route.params.str || '',
          ...this.query
        })).then(res => {
          this.$message({
            message: `导出申请成功，请去下载中心下载`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$EventBus.$emit('saas_vs_download_change');
        }).catch(res => {
          this.$message({
            message: res.msg || `导出失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        })
      }
    },
    created() {
      this.dialogVisible =  this.visible;
      this.cardVo = this.app.info; // TODO inject传入的内容，在小组件内，只做赋值，不动cardVo数据
    }
  };
</script>
<style lang="less" scoped>
  .send-notice-list__dialog {
    .dialog__title {
      &__icon {
        color: rgba(0, 0, 0, 0.45);
        margin-left: 8px;
      }
    }
  }
  .search-data {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    /deep/.vh-date-editor .vh-range-separator {
      width: 20px;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
    }
    .search-data__date {
      width: 276px;
      border-radius: 100px;
    }
    .search-data__input {
      margin-left: auto;
      width: 180px;
      height: 40px;
      line-height: 40px;
      /deep/.vh-input__inner {
        border-radius: 100px;
      }
    }
    .search-data__btn {
      margin-left: 12px;
    }
  }
  /deep/.vh-tabs__header {
    margin: 0 0 12px;
  }
  .tab-content {
    .icon-status {
      height: 20px;
      display: flex;
      align-items: center;
    }
    .icon-status span {
      line-height: 20px;
    }
    .icon-dot {
      width: 8px;
      height: 8px;
      display: block;
      margin-right: 8px;
      border-radius: 50%;
    }
    &_page {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      .pageBox {
        margin-left: 24px;
        margin-right: auto;
      }
    }
    .color-red {
      color: #FB2626;
    }
    .color-blue {
      color: #3562FA;
    }
    .span-between {
      width: 12px;
    }
  }
</style>
