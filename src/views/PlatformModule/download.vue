<template>
	<div class="download">
    <pageTitle title="下载中心"></pageTitle>
    <!-- 搜索 -->
    <div class="list--search">
      <el-button size="medium" plain round @click.prevent.stop="multiDownload">批量下载</el-button>
      <!-- 日期选择器 -->
      <el-date-picker
        v-model="timeStr"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="margin-left: 24px;width: 240px"
        @change="getTableList(null)"
      />
      <el-input placeholder="搜索文件名称" v-model.trim="file_name"  @keyup.enter.native="getTableList(null)">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="getTableList(null)"></i>
      </el-input>
    </div>
    <div class="download-list" v-show="file_name !== null && file_name !== undefined && file_name !== '' || docDao.total >0">
      <el-table
        ref="downloadTable"
        :data="docDao.list"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        :row-key="setRowKeyFun"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          align="left"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column
          label="文件名"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <i class="icon_tag" v-if="Number(scope.row.dow_status) === 0 && Number(scope.row.file_status) === 1"></i>
            <p class="text">
              <!--  <icon class="word-status" :icon-class="scope.row.ext | wordStatusCss"></icon> -->
              {{ scope.row.file_name }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="webinar_name"
          label="所属活动"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="生成时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="生成状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.percentage" v-if="Number(scope.row.file_status) === 0"></el-progress>
            <span :class="[scope.row.fileStatusCss, 'statusTag']" v-else>{{scope.row.fileStatusStr}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <a :href="scope.row.dow_url" v-if="Number(scope.row.file_status) === 1" @click="download(scope.row)">
              <el-button size="mini" type="text">下载</el-button>
            </a>
            <el-button size="mini" type="text" v-if="Number(scope.row.file_status) === 2" @click="resetDownload(scope.row)">重新生成</el-button>
            <el-button size="mini" type="text" @click="delDownload(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <SPagination
        :total="docDao.total"
        v-show="docDao.total > limit"
        :currentPage="pageNumber"
        @current-change="currentChangeHandler"
        align="center"
      >
      </SPagination>
    </div>
    <!-- 无消息内容 -->
    <null-page v-show="!file_name && docDao.total === 0"></null-page>
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
      limit: 10,
      pageNumber: 1,
      pos: 0,
      docDao: {
        total: 0,
        list: []
      },
      selectRows: []
    };
  },
  methods: {
    initPage() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.timeStr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      this.search();
    },
    search() {
      this.pos = 0;
      this.pageNumber = 1;
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
        this.$message.error('请至少选择一条下载记录');
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
        if (res && res.code === 200) {
          // 重新拉取数据
          this.search();
        } else {
          console.log('下载状态更新失败');
        }
      }).then(e => {
        console.log(e, '下载状态更新失败');
      });
    },
    // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageNumber = current;
      this.pos = (Number(current) - 1) * this.limit;
      this.getTableList({
        pos: this.pos,
        limit: this.limit,
        pageNumber: this.pageNumber
      });
    },
    getTableList(row) {
      if (row) {
        this.pos = row.pos;
        this.pageNumber = row.pageNum;
      }
      let params = {
        start_time: this.timeStr[0] || '',
        end_time: this.timeStr[1] || '',
        file_name: this.file_name || '',
        limit: this.limit,
        pos: this.pos,
      };
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
    download(rows) {
      // window.open(rows.dow_url, "_blank");
      // 如果当前已经是下载状态，不触发状态修改
      if (Number(rows.dow_status) !== 1) {
        this.downloadedEdit(rows.dow_task_id);
      }
    },
    // 重新生成
    async resetDownload(rows) {
      try {
        // 第一步，拿取其余服务接口请求地址
        let result = await this.$fetch('downloadedReload', {dow_task_id: rows.dow_task_id});
        if(result.code === 200 && result.data) {
          let header = {
            platform: sessionOrLocal.get('platform', 'localStorage') || 17,
            token: sessionOrLocal.get('token', 'localStorage') || '',
            'request-id': uuidV1(),
            'interact-token': sessionStorage.getItem('interact_token') || null
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
          this.search();
        }
      } catch (e) {
        console.log(e);
        this.$message.error('重新生成失败');
      }
    },
    // 删除某条下载任务
    delDownload(rows) {
      let that = this;
      that.$confirm('是否要删除当前下载文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        that.$fetch('downloadedDel', {
          dow_task_id: rows.dow_task_id
        }).then(res => {
          if(res && res.code === 200) {
            that.$message.success(`删除成功`);
            that.ids = [];
            try {
              that.$refs.downloadTable.clearSelection();
            } catch (e) {
              console.log(e);
            }
            that.initPage();
          }else {
            that.$message({
              type: 'error',
              message: res.msg || '删除失败1'
            });
          }
        }).catch(e => {
          console.log(e);
          that.$message({
            type: 'error',
            message: '删除失败'
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
          EventBus.$emit('down_center_msg', {
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
    this.initChat();
  },
  mounted() {
    this.initPage();
    EventBus.$on('down_center_msg', res => { // 转码状态
      console.log(res, '监听到down_center_msg转码状态事件');
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
    /deep/ .el-input__suffix{
      cursor: pointer;
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
  }
}
.download-list {
  .layout--right--main();
  .padding-table-list();
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
.download-list {
  /deep/.cell img {
    width: 100px;
    height: 100px;
  }
  /deep/.el-table {
    margin-bottom: 30px;
  }
  /deep/.el-table__header{
    background-color: #FB3A32;
  }
  /deep/.el-table td, .el-table th{
    padding: 10px 0 9px 0;
  }
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
  /deep/.el-button.el-button--text {
    color: #1A1A1A;
    border: 0;
    &:hover{
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
