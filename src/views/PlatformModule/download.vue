<template>
	<div class="download">
    <pageTitle pageTitle="下载中心"></pageTitle>
    <!-- 搜索 -->
    <div class="list--search">
      <el-button class="downloadBtn" size="medium" plain round @click.prevent.stop="multiDownload" v-preventReClick :disabled="!(selectRows && selectRows.length > 0)">批量下载</el-button>
      <!-- 日期选择器 -->
      <el-date-picker
        v-model="timeStr"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        prefix-icon="iconfont-v3 saasicon_date"
        style="margin-left: 12px;width: 240px"
        @change="search"
      />
      <VhallInput
        class="search-tag"
        placeholder="搜索文件名称"
        v-clearEmoij
        v-model="file_name"
        clearable
        @change="search"
        @keyup.enter.native="search">
        <i
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="search">
        </i>
      </VhallInput>
    </div>
    <div class="download-list" v-if="docDao.total >0">
      <table-list
        ref="downloadTable"
        :isHandle=true
        :manageTableData="docDao.list"
        :tabelColumnLabel="tableColumn"
        :totalNum="docDao && docDao.total ? docDao.total : 0"
        :tableRowBtnFun="tableRowBtnFun"
        :needPagination=true
        max-height="auto"
        width="120px"
        scene="downloadList"
        @getTableList="getTableList"
        @changeTableCheckbox="handleSelectionChange"
        @onHandleBtnClick="onHandleBtnClick"
      >
      </table-list>
    </div>
    <!-- 无消息内容 -->
    <null-page v-else text="暂无可下载内容" nullType="noAuth"></null-page>
  </div>
</template>

<script>
import 'whatwg-fetch';
import PageTitle from '@/components/PageTitle';
import NullPage from '../PlatformModule/Error/nullPage.vue';
import {v1 as uuidV1} from "uuid";
import {sessionOrLocal} from "@/utils/utils";
import qs from "qs";
import EventBus from "@/utils/Events";
export default {
  name: "download.vue",
  components: {
    PageTitle,
    NullPage
  },
  data() {
    return {
      timeStr: '',
      file_name: '',
      query: {
        pos: 0,
        limit: 10,
        pageNumber: 1
      },
      docDao: {
        total: 0,
        list: []
      },
      selectRows: [],
      isHandle: false, // 是否有操作项
      tableColumn: [
        {
          label: '文件名',
          key: 'file_name',
          width: 'auto'
        },
        {
          label: '所属活动',
          key: 'webinar_name',
          width: 200
        },
        {
          label: '生成时间',
          key: 'created_at',
          width: 200
        },
        {
          label: '生成状态',
          key: 'fileStatusStr',
          width: 200
        }
      ],
      tableRowBtnFun: [
        {
          name: "下载",
          methodName: 'download'
        },
        {
          name: "重新生成",
          methodName: 'resetDownload'
        },
        {
          name: "删除",
          methodName: 'delDownload'
        }
      ]
    };
  },
  methods: {
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    initPage(type) {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      // 若type不为空，不做重置
      if (type !== 1) {
        this.timeStr = [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')];
      }
      this.search();
    },
    search() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.downloadTable.pageInfo.pageNum = 1;
        this.$refs.downloadTable.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
       // 表格切换到第一页
      this.getTableList();
    },
    checkSelectable(row) {
      return Number(row.file_status) === 1;
    },
    setRowKeyFun() {},
    // 批量勾选
    handleSelectionChange(val){
      this.selectRows = val;
    },
    multiDownload() {
      let arr = this.selectRows;
      let that = this;
      if (!(this.selectRows && this.selectRows.length > 0)) {
        this.$message({
          message: `请至少选择一条下载记录`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      } else {
        let index = 0;
        let interDown = setInterval(function() {
          window.open(that.selectRows[index].dow_url);
          if(index === arr.length - 1) {
            window.clearInterval(interDown);
            // 最后一次结束后，批量状态修改
            let ids = arr.map(item => {
              return item.dow_task_id;
            });
            that.downloadedEdit(ids.join(','));
          }
          index ++;
        }, 3000);
      }
    },
    downloadedEdit(dow_task_ids) {
      let params = {
        dow_task_ids: dow_task_ids // 可能多个可能单个
      };
      this.$fetch('downloadedEdit', this.$params(params)).then(res =>{
        // 通知右上角导航，需要更新下载消息
        this.$EventBus.$emit('saas_vs_download_count', true);
        // 重新拉取数据
        this.search();
      }).then(e => {
        console.log(e, '下载状态更新失败');
      });
    },
  /*   // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageNumber = current;
      this.pos = (Number(current) - 1) * this.limit;
      this.getTableList({
        pos: this.pos,
        limit: this.limit,
        pageNumber: this.pageNumber
      });
    }, */
    getTableList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      let params = {
        file_name: this.file_name || '',
        limit: this.query.limit,
        pos: this.query.pos,
      };
      if(this.timeStr && this.timeStr[0] && this.timeStr[1]) {
        params.start_time = this.timeStr[0] || '';
        params.end_time = this.timeStr[1] || '';
      } else {
        params.start_time = ''
        params.end_time = ''
      }
      this.$fetch('downloadedList', this.$params(params)).then(res =>{
        let dao =  res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
        console.log(dao);
        let list = dao.list || [];
        list.map(item => {
          item.dowStatusStr = ['未下载' ,'已下载'][item['dow_status']]; // 0:未下载1已下载
          item.fileStatusCss = ['wating', 'success', 'failer'][item['file_status']];
          item.fileStatusStr = ['生成中', '生成成功', '生成失败'][item['file_status']]; // 0:初始(生成中),1:生成成功2:生成失败
          item.percentage = 90;
          item.webinar_name = item.webinar_name || '--'
          let dow_urlArr = item.dow_url.split('.');
          item.ext = dow_urlArr[dow_urlArr.length - 1];
        });
        this.docDao =  dao;
      }).catch(e=>{
        console.log(e);
        this.docDao = {
          total: 0,
          list: []
        };
      });
    },
    // 下载
    download(that, {rows}) {
      // window.open(rows.dow_url, "_blank");
      // 如果当前已经是下载状态，不触发状态修改
      if (Number(rows.dow_status) !== 1) {
        that.downloadedEdit(rows.dow_task_id);
      }
    },
    // 重新生成
    async resetDownload(that, {rows}) {
      try {
        // 第一步，拿取其余服务接口请求地址
        let result = await that.$fetch('downloadedReload', {dow_task_id: rows.dow_task_id});
        if(result.code === 200 && result.data) {
          // 通知右上角导航，需要更新下载消息
          that.$EventBus.$emit('saas_vs_download_count', true);
          let header = {
            platform: sessionOrLocal.get('platform', 'localStorage') || 17,
            token: sessionOrLocal.get('token', 'localStorage') || '',
            'request-id': uuidV1(),
            // 'interact-token': sessionStorage.getItem('interact_token') || null
          };
          let option = {
            method: result.data.request_method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors',
            credentials: 'same-origin',
            headers: header,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
          console.log(result.data)
          if (result.data.request_method.toUpperCase() === 'POST') {
            let obj =  JSON.parse(result.data.select_json); // body data type must match "Content-Type" header
            let formData = new FormData();
            for (let key in obj) {
              if(obj[key] !== null &&  obj[key] !== undefined && obj[key] !== '') {
                formData.append(key, obj[key]);
              }
            }
            console.log(obj, '参数1111111111');
            option.body = formData
          }
          fetch(`${result.data.send_url}`, option).then(res => {
            console.log(res.json(), '模拟导出申请请求，重新下载');
          }).catch(e => {
            console.log(e);
          });
          // 重新拉取数据
          that.search();
        }
      } catch (e) {
        console.log(e);
        that.$message({
          message: e.msg || '重新生成失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }
    },
    // 删除某条下载任务
    delDownload(that, {rows}) {
      that.$confirm('是否要删除当前下载文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.$fetch('downloadedDel', {
          dow_task_id: rows.dow_task_id
        }).then(res => {
          if(res && res.code === 200) {
            // 通知右上角导航，需要更新下载消息
            that.$EventBus.$emit('saas_vs_download_count', true);
            that.$message.success(`删除成功`);
            that.ids = [];
            try {
              that.$refs.downloadTable.clearSelection();
            } catch (e) {
              console.log(e);
            }
            that.initPage(1);
          }else {
            that.$message({
              type: 'error',
              message: res.msg || '删除失败'
            });
          }
        }).catch(e => {
          console.log(e);
          that.$message({
            type: 'error',
            message: e.msg || '删除失败'
          });
        });
      }).catch(() => {
      });
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
        if (msg.data.type === 'down_center_msg') {
          this.$EventBus.$emit('down_center_msg', {
            dow_task_id: msg.data.dow_task_id,
            status: msg.data.status
          })
        }
      })
    },
    // 初始化
    async initChat(){
      let result = await this.$fetch('msgInitConsole');
      if (result) {
        console.log(result, '值');
        let option = {
          appId: result.data.paasAppId || '', // appId 必须
          accountId: result.data.accountId || '', // 第三方用户ID
          channelId: result.data.channelId || '', // 频道id 必须
          token: result.data.paasAccessToken || '', // 必须， token，初始化接口获取
          hide: true
        }
        window.VhallChat.createInstance(option, (event) => {
          this.$Chat = event.message; // 聊天实例句柄
          this.monitor()
        },err=>{
          // alert('初始化错误')
          console.error(err);
        })
      }
    },
  },
  created() {
    // this.initChat();
  },
  mounted() {
    this.initPage();
    this.$EventBus.$on('saas_vs_down_num', this.search);
    this.$EventBus.$on('down_center_msg', res => { // 转码状态
      console.log(res, '监听到down_center_msg123转码状态事件');
      this.docDao.list.map(item => {
        if (Number(item.dow_task_id) === Number(res.dow_task_id)) {
          item.fileStatusCss = ['wating', 'success', 'failer'][res.status];
          item.fileStatusStr = ['生成中', '生成成功', '生成失败'][res.status]; // 0:初始(生成中),1:生成成功2:生成失败
          item.file_status = Number(res.status);
        }
      })
    });
  },
  beforeDestroy() {
  }
};
</script>

<style lang="less" scoped>
.download-ctx {
  .layout--right--main;
  .padding41-40;
  .min-height;
}
.list--search{
  margin-bottom: 20px;
  .downloadBtn {
    background: transparent;
    &:hover {
      background: #FB3A32;
      border: 1px solid #FB3A32;
    }
    &:active {
      background: #E2332C;
      border: 1px solid #E2332C;
    }
    &.is-disabled {
      border: 1px solid #E6E6E6;
      background: transparent;
      color: #B3B3B3;
      &:hover,&:active {
        background: transparent;
      }
    }
  }
  .el-button {
    vertical-align: middle;
  }
  .el-input {
    vertical-align: middle;
  }
  .el-date-editor {
    vertical-align: middle;
  }
  .el-select{
    float: right;
    margin-right: 20px;
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input{
    width: 270px;
    float: right;
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
    }
    /deep/ .el-input__icon{
      line-height: 36px;
    }
    /deep/ .el-input__prefix{
      cursor: pointer;
    }
  }
  .search-tag {
    width: 220px;
    /deep/.el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px!important;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;
    }
  }
}
.download-list {
  .layout--right--main();
  .padding-table-list();
  /deep/.data-list {
    min-height: 500px;
  }
}
.pageBox {
  margin-top: 40px;
}
@red: #FB3A32;
@redBg: #FFEBEB;
.statusTag{
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
}
/deep/.el-date-editor .el-range__icon{
  line-height: 29px;
}
/deep/.el-date-editor .el-range__close-icon {
  line-height: 28px;
}
.download-list {
  /deep/.cell img {
    width: 100px;
    height: 100px;
  }
  /deep/.el-table {
    margin-bottom: 30px;
  }
  /* /deep/.el-table__header{
    background-color: #FB3A32;
  } */
  /* /deep/.el-table td, .el-table th{
    padding: 10px 0 9px 0;
  } */
  .text{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  // /deep/.el-button.el-button--text {
  //   color: #1A1A1A;
  //   border: 0;
  //   &:hover{
  //     color: #FB3A32;
  //   }
  // }
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
}
/deep/.el-button.hide {
  visibility: hidden;
}
.list--search {
  /deep/.el-input__inner{
    border-radius: 18px;
    height: 36px;
    background: transparent;
  }
  /deep/.el-range-separator{
    width: 10%;
    line-height: 28px;
  }
  /deep/.el-form-item__content {
    line-height: 34px;
  }
  /deep/.el-range-editor .el-range-input {
    background: transparent;
  }
}
</style>
