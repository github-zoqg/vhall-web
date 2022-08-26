<template>
  <VhallDialog :visible="dialogVisible"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    width="800px"
    title="发送记录">
    <!-- 搜索层 -->
    <div class="search-data">
      <el-date-picker
        v-model="searchDate"
        value-format="yyyy-MM-dd"
        type="daterange"
        prefix-icon="iconfont-v3 saasicon_date"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        style="width: 240px"
        @change="searchSendNoticeList"
      />
      <VhallInput v-model="query.keyword"  placeholder="搜索昵称/手机号" class="search-tag" style="width: 220px;marginLeft:15px;" maxlength="50" v-clearEmoij clearable
        @clear="searchSendNoticeList"
        @keyup.enter.native="searchSendNoticeList">
        <i slot="prefix" class="el-icon-search el-input__icon" style="cursor: pointer;line-height: 36px;"></i>
      </VhallInput>
      <el-button round  size="medium" class="export-data"  @click="exportSendData">导出数据</el-button>
    </div>
    <!-- tab切换层 -->
    <vh-tabs v-model="activeName" @tab-click="handleClick">
      <vh-tab-pane :label="item.label" :name="item.key" v-for="(item, index) in tabList" :key="index"></vh-tab-pane>
    </vh-tabs>
    <!-- 表格层 -->
    <div class="tab-content">
      <el-table
      :header-cell-style="{
        background: '#f7f7f7',
        color: '#666',
        height: '56px',
      }"
      ref="noticeTable" :data="noticeResults.list">
        <el-table-column
          align="left"
          v-for="(item, index) in tableColumn"
          :key="index"
          :width="item.width"
          :label="item.label"
          :show-overflow-tooltip="!item.customTooltip"
        >
          <template slot-scope="scope">
            <span v-if="item.key === 'send_status'" :class="scope.row[item.key] == 1 ? 'color-green' : 'color-red'">{{ ['- -', '发送成功', '发送失败'][scope.row[item.key]] || '' }}</span>
            <span v-else>{{ scope.row[item.key] || '- -' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <p class="notice-info">发送成功：<span class="color-green">{{noticeResults.success_total}}</span> 条     发送失败：<span class="color-red">{{noticeResults.fail_total}}</span> 条</p>
      <SPagination
        :total="noticeResults.total"
        v-show="noticeResults.total > 10"
        :currentPage="pageNum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="query.limit"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="currentChangeHandler"
        @size-change="handleSizeChange"
        align="center"
      >
      </SPagination>
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
          },
          {
            label: '微信关注通知',
            key: 'wx_flower'
          },
          {
            label: '微信开播提醒',
            key: 'wx_start'
          },
          {
            label: '微信回放通知',
            key: 'wx_playback'
          }
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
  .search-data{
    position: relative;
    padding: 0 0 32px 0;
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
    }
    /deep/.el-input__inner{
      border-radius: 18px;
      height: 36px;
      background: transparent;
    }
    .search-tag{
      /deep/.el-input__inner{
        padding-right: 30px!important;
      }
      /deep/.el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__prefix{
          cursor: pointer;
        }
    }
    /deep/.el-icon-arrow-up, .is-reverse{
      line-height: 36px;
    }
    /deep/.el-range-editor.el-input__inner{
      padding: 1px 10px;
    }
    /deep/.el-date-editor .el-range-separator{
      padding: 2px 5px;
    }
  }
  .tab-content {
    padding-bottom: 40px;
    padding-top: 24px;
    .notice-info {
      margin-top: 32px;
    }
    .color-red {
      color: #fb3a32;
    }
    .color-green {
      color: #14ba6a;
    }
    .pageBox {
      margin-top: 32px;
    }
  }
</style>
