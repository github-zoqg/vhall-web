<template>
  <div class="listBox">
    <pageTitle title="回放管理"></pageTitle>
    <div class="operaBlock">
      <el-button size="medium" type="primary" round @click="toTailoring">创建回放</el-button>
      <el-button size="medium" plain round>录制</el-button>
      <el-button size="medium" round @click="settingHandler">回放设置</el-button>
      <el-button size="medium" round :disabled="selectDatas.length < 1" @click="deletePlayBack(selectDatas.map(item=>item.id).join(';'))">批量删除</el-button>
      <el-input
        placeholder="请输入内容标题"
        v-model="keyWords">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="searchHandler">
        </i>
      </el-input>
    </div>
    <div class="tableBox" v-loading="loading">
      <el-table
        ref="playBackTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="内容标题">
          <template slot-scope="scope">
            {{ scope.row.date }}
            <div class="content">
              <div class="imageBox">
                <el-image :src='scope.row.img_url'>
                  <div slot="error" class="image-slot">
                    <img :src="defaultImg" alt="">
                  </div>
                </el-image>
                <span class="defaultSign"><i :class="{active: scope.row.type == 6}"></i>默认回放</span>
              </div>
              <div class="info">
                <p class="name ellipsis"><span class="text">{{ scope.row.name }}</span></p>
                <p>{{ scope.row.created_at }}</p>
                <span class="tag">章节</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="来源"
          width="80">
           <template slot-scope="scope">{{scope.row.source | soruceTotext}}</template>
        </el-table-column>

        <el-table-column
          label="时长"
          width="80"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.duration | secondsFormmat}}</template>
        </el-table-column>

        <el-table-column
          prop="stagingDate"
          label="暂存至"
          width="120"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.date }}
            <el-button type="text" @click="editDialog(scope.row)">编辑</el-button>
            <el-button type="text">下载</el-button>
            <el-button type="text" @click="$router.push({path: '/playback/chapter'})">章节</el-button>
            <el-dropdown @command="handleCommand">
              <el-button type="text">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{command: 'tailoring', data: scope.row}">剪辑</el-dropdown-item>
                <el-dropdown-item :command="{command: 'publish', data: scope.row}">发布</el-dropdown-item>
                <el-dropdown-item :command="{command: 'delete', data: scope.row}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <SPagination :total="totalElement" :page-size='pageSize' :current-page='pageNum' @current-change="currentChangeHandler" align="center"></SPagination>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑"
      v-loading="editLoading"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      width="480px">
      <span>链接地址：</span>
      <el-input placeholder="请输入标记文字" maxlength="30" :autosize="{ minRows: 3 }" resize=none show-word-limit v-model="titleEdit" class="input-with-select" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit" :disabled="editLoading" round size="medium">确 定</el-button>
        <el-button @click="editDialogVisible = false" :disabled="editLoading" round size="medium">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  data(){
    return {
      tableData: [],
      defaultImg: require('../../../common/images/v35-webinar.png'),
      keyWords: '',
      pageSize: 10,
      pageNum: 1,
      loading: false,
      totalElement: 0,
      editDialogVisible: false,
      titleEdit: '',
      editRecord: {},
      editLoading: false,
      selectDatas: []
    };
  },
  computed: {
    pos(){
      return (this.pageNum - 1) * this.pageSize;
    },
    webinar_id(){
      return this.$route.params.str;
    }
  },
  created(){
    this.getList();
  },
  mounted(){
    this.tipMsg = this.$message({
      dangerouslyUseHTMLString: true,
      message: '<span class="msgGray">非默认回放暂存15天。</span><a href="http://webim.qiao.baidu.com/im/index?siteid=113762&ucid=2052738" target="_blank" class="msgBlue">开通点播服务</a>',
      showClose: true,
      duration: 0
    });
  },
  beforeDestroy(){
    this.tipMsg.close();
  },
  methods: {
    handleSelectionChange(val){
      this.selectDatas = val;
    },
    searchHandler(){

    },
    handleCommand(param){
      console.log(param);
      if(param.command == 'delete'){
        this.deletePlayBack(param.data.id);
      }else if(param.command == 'tailoring'){
        this.toTailoring();
      }
    },
    currentChangeHandler(num){
      this.pageNum = num;
    },
    getList(){
      let param = {
        webinar_id: this.webinar_id,
        user_id: '1333',
        pos: this.pos,
        limit: this.pageSize,
        source: "-1",
        order_type: '1'
      };
      this.loading = true;
      this.$fetch('playBackList', param).then(res=>{
        this.tableData = res.data.data;
        this.totalElement = res.data.total;
        console.log(res);
      }).catch(error=>{
        this.$message.error(`获取回访列表失败，${error.msg || error.message}`);
      }).finally(()=>{
        this.loading = false;
      });
      // playBackList
    },
    editDialog(data){
      this.titleEdit = data.name;
      this.editDialogVisible = true;
      this.editRecord = data;
    },
    deletePlayBack(ids){
      this.$confirm('删除回放会导致目前已生成回放的数据丢失，请谨慎操作，确定要删除这段回放么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.$fetch('playBackDelete', { record_id: ids}).then(res=>{
          if(res.code === 200){
            this.$message.success('已删除');
            this.getList();
          }else{
            this.$message.error(`删除失败，${res.msg}`);
          }
        }).catch(error=>{
          this.$message.error(`删除失败，${error.msg || error.message}`);
          this.loading = false;
        });
      }).catch(() => {});

    },
    confirmEdit(){
      if(!this.titleEdit.trim()) return this.$message.error('请输入标题');
      this.editLoading =true;
      this.$fetch('playBackEdit', { record_id: this.editRecord.id, subject: this.titleEdit}).then(res=>{
        if(res.code === 200){
          this.$message.success('修改成功');
          this.getList();
          this.editDialogVisible = false;
        }else{
          this.$message.error(`修改失败，${res.msg}`);
        }

      }).catch(error=>{
        this.$message.error(`修改失败，${error.msg || error.message}`);
      }).finally(()=>{
        this.editLoading = false;
      });
    },
    settingHandler(){
      this.$router.push({path: `/plan-function/${this.webinar_id}`});
    },
    toTailoring(){
      this.$router.push({path: `/playback/video-tailoring`});
    }
  },
  filters: {
    secondsFormmat(val){
      val = Number(val);
      if(isNaN(val)) return val;
      const hours = parseInt(val/3600);
      const minutes = parseInt(val/60) - (hours*60);
      const seconds = val % 60;
      return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },
    soruceTotext(val){
      //  0回放 1录制 2打点 3上传
      val = Number(val);
      let str = val;
      switch (val) {
        case 0:
          str = "回放";
          break;

        case 1:
          str = "录制";
          break;

        case 2:
          str = "打点";
          break;

        case 3:
          str = "上传";
          break;

        default:
          str = val;
          break;
      }
      return str;
    }
  },
  components: {
    PageTitle
  }
};
</script>

<style lang="less" scoped>
  .listBox{
    min-width: 1020px;
  }
  .tableBox{
    padding: 32px 24px;
    background: #fff;
    /deep/ .cell{
      color: #666;
    }
    .el-table{
      margin-bottom: 40px;
    }
  }
  /deep/ .el-table__header{
    th{
      background: #F7F7F7;
    }
  }
  .el-dropdown{
    margin-left: 10px;
  }
  .content{
    display: flex;
    .imageBox{
      position: relative;
      width: 160px;
      height: 90px;
      .defaultSign{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 80px;
        height: 22px;
        background: rgba(0,0,0,.6);
        border-radius: 12px 0px 4px 0px;
        color: #fff;
        font-size: 12px;
        i{
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 8px;
          border: 1px solid #FFFFFF;
          margin-right: 4px;
          margin-bottom: -2px;
          &.active{
            border: 3px solid #FB3A32;
            background: #fff;
          }
        }
        // opacity: 0.66;
      }
    }
    .info{
      flex: 1;
      padding-left: 12px;
      // background: lightcoral;
      font-size: 14px;
      color: #1A1A1A;
      .name{
        line-height: 20px;
      }
      .tag{
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        background: #EBEFFF;
        border-radius: 14px;
        font-size: 12px;
        text-align: center;
        color: #3562FA;
      }
    }
    img{
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
  }
  .operaBlock{
    margin-bottom: 20px;
    .el-input{
      width: 220px;
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
  .input-with-select{
    width: 350px;
    vertical-align: text-top;
  }
</style>
<style lang="less">
  .msgGray{
    color: #1A1A1A;
  }
  .msgBlue{
    color: #3562FA;
  }
</style>
