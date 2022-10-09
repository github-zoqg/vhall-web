<template>
  <vh-dialog :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    width="840px"
    class="send-notice-list__dialog">
    <div slot="title" class="dialog__title">
      <span class="el-dialog__title vh-dialog__title">发送记录</span>
      <vh-tooltip effect="dark" content="仅保留近一年的发送记录" :visible-arrow="false" placement="right">
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
        size="medium"
      />
      <vh-input
        type="text"
        class="search-data__input" size="medium" round placeholder="请输入昵称/手机号" v-model.trim="query.keyword" clearable @clear="searchSendNoticeList" @keyup.enter.native="searchSendNoticeList">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="searchSendNoticeList"></i>
      </vh-input>
      <vh-button round ghost size="medium" class="search-data__btn"  @click="exportSendData" :disabled="!noticeResults.is_export">导出数据</vh-button>
    </div>
    <!-- tab切换层 -->
    <vh-tabs v-model="query.config_type" @tab-click="handleClick">
      <vh-tab-pane :label="item.label" :name="item.key" v-for="(item, index) in tabList" :key="index"></vh-tab-pane>
    </vh-tabs>
    <!-- 表格层 -->
    <div class="tab-content">
      <vh-table ref="noticeTable" :data="noticeResults.list" max-height="384">
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
              <!-- 发送状态 ，发送状态  0,发送中 1，发送成功 2，发送失败	 -->
              <span>{{ ['发送中', '发送成功', '发送失败'][scope.row[item.key]] || '' }}</span>
            </div>
            <span v-else>{{ scope.row[item.key] || '-' }}</span>
          </template>
        </vh-table-column>
        <div slot="empty"></div>
      </vh-table>
      <noData :nullType="'nullData'" height=52 v-if="!noticeResults.total" :text="'暂未搜索到您想要的内容'"></noData>
    </div>
    <div class="tab-content_page" v-if="noticeResults.total > 0">
      <p class="notice-info">发送成功：<span class="color-blue">{{noticeResults.success_num||0}}</span> 条<span class="span-between">&nbsp;</span>发送失败：<span class="color-red">{{noticeResults.fail_num || 0}}</span> 条</p>
      <div class="pageBox">
        <vh-pagination
        background
        :total="noticeResults.total"
        v-show="noticeResults.total > 10"
        :currentPage="pageNum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="query.limit"
        layout="prev, pager, next"
        @current-change="currentChangeHandler"
        @size-change="handleSizeChange"
        align="center"></vh-pagination>
      </div>
    </div>
  </vh-dialog>
</template>
<script>
  import noData from '@/views/PlatformModule/Error/nullPage';
  export default {
    components: {
      noData
    },
    data() {
      return {
        dialogVisible: true,
        query: {
          start_time: '',
          end_time: '',
          keyword: '',
          config_type: '',
          pos: 0,
          limit: 10
        },
        searchDate: '',
        pageNum: 1,
        vm: null,
        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: (time) => {
            return this.dealDisabledDate(time);
          }
        },
        tabList: [
          {
            label: '短信成功通知',
            key: '1'
          },
          {
            label: '短信开播提醒',
            key: '2'
          },
          {
            label: '短信回放通知',
            key: '3'
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
        tableColumn: [
          {
            label: '昵称',
            key: 'nickname',
            width: '120px'
          },
          {
            label: '手机号',
            key: 'phone',
            width: '120px'
          },
          {
            label: '来源',
            key: 'sms_souce_str',
            width: 'auto'
          },
          {
            label: '发送状态',
            key: 'send_status',
            width: '120px'
          },
          {
            label: '发送时间',
            key: 'send_time',
            width: '180px'
          },
          {
            label: '备注',
            key: 'remark',
            width: '120px'
          }
        ],
        isHandle: false,
        noticeResults: {
          total: 0,
          is_export: 0,
          success_num: 0,
          fail_num: 0,
          list: []
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
        const day = 365 * 24 * 3600 * 1000
        // 可以选择当天，及近一年的数据
        return time.getTime() > Date.now() || time.getTime() < Date.now() - day; //设置选择今天以及今天以前的日期
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
          this.query.start_time = this.$moment(this.searchDate[0]).format('YYYY-MM-DD 00:00:00') // 有效期 - 开始时间
          this.query.end_time = this.$moment(this.searchDate[1]).format('YYYY-MM-DD 23:59:59')
        } else {
          this.query.start_time = ''
          this.query.end_time = ''
        }
        this.$fetch('getNoticeRecordList', this.$params({
          webinar_id: this.$route.params.str || '',
          ...this.query,
          config_type: Number(this.query.config_type)
        })).then(res => {
          if (res && res.code == 200 && res.data) {
            res.data.list.map(item => {
              // 格式化预约对象
              let smsSource = item.sms_source.split(',') || []
              const newSmsSouce = []
              smsSource.forEach(sItem => {
                newSmsSouce.push(['-','预约/报名用户','白名单','导入','预约/报名中未观看直播用户'][sItem])
              });
              item.sms_souce_str = newSmsSouce.join(',')
              if (item.is_test == 1) {
                // 当前是 测试发送
                item.remark = item.send_status == 1 ? '测试发送' : `测试发送-${item.remark}`
              }
            })
            this.noticeResults = res.data
          } else {
            this.noticeResults = {
              total: 0,
              is_export: 0,
              success_num: 0,
              fail_num: 0,
              list: []
            }
          }
        }).catch(() => {
          this.noticeResults = {
            total: 0,
            is_export: 0,
            success_num: 0,
            fail_num: 0,
            list: []
          }
        });
      },
      //文案提示问题
      messageInfo(title, type) {
        if (this.vm) {
          this.vm.close()
        }
        this.vm = this.$message({
          showClose: true,
          duration: 2000,
          message: title,
          type: type,
          customClass: 'zdy-info-box'
        });
      },
      // 导出发送记录数据
      exportSendData() {
        this.$fetch('exportNoticeRecord', this.$params({
          webinar_id: this.$route.params.str || '',
          ...this.query,
          config_type: Number(this.query.config_type)
        })).then(res => {
          this.messageInfo('导出申请成功，请去下载中心下载', 'success');
          this.$EventBus.$emit('saas_vs_download_change');
        }).catch(res => {
          this.messageInfo(res.msg || `导出失败`, 'error');
        })
      },
      initPage() {
        // 初始化设置日期为最近一周
        const end = new Date()
        const start = new Date()
        end.setTime(end.getTime())
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
        this.searchDate = [
          this.$moment(start).format('YYYY-MM-DD'),
          this.$moment(end).format('YYYY-MM-DD')
        ]
        this.query.start_time = this.$moment(this.searchDate[0]).format('YYYY-MM-DD 00:00:00')
        this.query.end_time = this.$moment(this.searchDate[1]).format('YYYY-MM-DD 00:00:00')
        this.searchSendNoticeList('init')
      }
    },
    created() {
      this.dialogVisible =  this.visible;
      this.cardVo = this.app.info; // TODO inject传入的内容，在小组件内，只做赋值，不动cardVo数据
      this.query.config_type = `${this.cardVo.config_type}`;
      this.initPage()
    }
  };
</script>
<style lang="less" scoped>
  .send-notice-list__dialog {
    /deep/.saasicon_help_m {
      color: #999999;
      &:hover {
        color: #666666;
      }
    }
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
      height: 36px;
      line-height: 36px;
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
  /deep/.vh-table__empty-block {
    min-height: 0;
  }
  /deep/.vh-input__prefix {
    top: -2px;
  }
  .tab-content {
    min-height: 314px;
    .icon-status {
      height: 20px;
      display: flex;
      align-items: center;
    }
    .icon-status span {
      line-height: 20px;
    }
    .icon-dot {
      width: 6px;
      height: 6px;
      display: block;
      margin-right: 8px;
      border-radius: 50%;
    }
  }
  .tab-content_page {
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
    color: #1E4EDC;
  }
  .span-between {
    display: inline-block;
    width: 12px;
  }
</style>
