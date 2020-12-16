<template>
  <div class="question-wrap">
    <pageTitle title="奖品" v-if="$route.meta.title === '奖品'">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload" @click="createPrize">新建</el-button>
      <el-button round v-if="$route.meta.title !== '奖品'" @click="prizeMeterial">资料库</el-button>
      <el-button round class="head-btn batch-del" @click="allDelete(null)">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :isExports='false'
        :placeholder="'请输入奖品名称'"
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableList('search')"
        >
      </search-area>
    </div>
    <div class="question-list" v-if="total">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
    </div>
    <div class="no-live" v-else>
      <noData :nullType="nullText" :text="'暂未创建奖品'">
      </noData>
    </div>
    <create-prize ref="createPrize" @getTableList="getTableList" :prizeInfo="prizeInfo"></create-prize>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import createPrize from '../LiveModule/MaterialSet/components/createPrize';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: "prize",
  props: {
    source: {
      type: String,
      required: false,
      default:'1'
    },
    roomId: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      total: 1,
      nullText: 'noData',
      prizeInfo: {},
      searchAreaLayout: [
        {
          key: 'keyword'
        }
      ],
      tabelColumn: [
        {
          label: '奖品id',
          key: 'prize_id',
        },
        {
          label: '奖品图片',
          key: 'img',
        },
        {
          label: '奖品名称',
          key: 'prize_name',
        },
        {
          label: '创建时间',
          key: 'create_time',
        }
      ],
      tableRowBtnFun: [
        {name:'复制', methodName: 'cope'} ,{name:'编辑', methodName: 'edit'},{name:'删除', methodName: 'del'}
      ],
      prizeChecked: [],
      tableData: []
    };
  },
  components: {
    PageTitle,
    createPrize,
    noData
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = {}
      if (this.tableData.length) {
        pageInfo = this.$refs.tableList.pageInfo;
      } else {
        pageInfo = {limit:1,pageNum:1,pos:0}
      }
       //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        if (this.tableData.length) {
          this.$refs.tableList.clearSelect();
        }
      }
        if (this.source == '0') {
          formParams = {...formParams,...{room_id:this.roomId}}
        }
      formParams.source =  this.source;
      let obj = Object.assign({}, pageInfo, formParams);

      this.$fetch('getPrizeList', obj).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.count;
        if (!res.data.count && params === 'search') {
          this.nullText = 'search';
        }
        this.tableData.map(item => {
        // 临时写死的，后期调
        item.img = `http://t-vhallsaas-static.oss-cn-beijing.aliyuncs.com/upload/${item.img_path}`;
      })
        // console.log(res.data, '22222');
      })
    },
    // 复制
    cope(that, {rows}) {
      that.$fetch('copyPrize', {prize_id: rows.prize_id, source: this.source}).then(res => {
        that.$message.success('复制成功');
        that.getTableList();
      })
    },
    // 编辑
    edit(that, {rows}) {
      that.$refs.createPrize.dialogVisible = true;
      that.prizeInfo = rows;
      console.log(that.prizeInfo, '0000000000000000000')
    },
    // 删除
    del(that, {rows}) {
      that.deleteConfirm(rows.prize_id);
    },
    deleteConfirm(id) {
      this.$confirm('确定要删除此奖品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        this.$fetch('delPrize', {prize_id: id, source: this.source}).then(res=>{
          if (res.code == 200) {
            this.getTableList();
            this.$message.success('删除成功');
          } else {
            this.$message.success('删除失败');
          }
        });
      }).catch(() => {});
    },
    allDelete(id) {
       if (this.prizeChecked.length < 1) {
          this.$message.warning('请选择要删除的选项');
        } else {
          id = this.prizeChecked.join(',')
          this.deleteConfirm(id);
        }
    },
    // 选中
    changeTableCheckbox(val) {
      this.prizeChecked = val.map(item => item.prize_id);
    },
    // 创建奖品
    createPrize() {
      if (this.tableData.length) {
         this.$refs.tableList.clearSelect();
      }
      this.$refs.createPrize.dialogVisible = true;
    },
    // 从资料库中选择
    prizeMeterial() {
      this.$refs.createPrize.dialogPrizeVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
.question-wrap{
  height: 100%;
  width: 100%;
  .question-list{
    width: 100%;
  }
  /deep/.el-card__body{
    width: 100%;
    padding: 32px 24px;
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    ::v-deep.set-upload{
      position: relative;
      span{
        input{
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .prize-no{
    // height: calc(100vh - 260px);
    text-align: center;
    margin-top: 208px;
  }
}
</style>
