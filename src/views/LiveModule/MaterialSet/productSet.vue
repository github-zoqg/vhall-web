<template>
  <div class="question-wrap">
    <pageTitle title="商品">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上传视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
      <div class="head-operat">
        <el-button type="primary" round  @click="addProduct">创建</el-button>
        <el-button round @click="batchDel(null)">批量删除</el-button>
        <search-area class="head-btn fr search"
          ref="searchArea"
          :placeholder="'请输入商品名称'"
          :isExports='false'
          :searchAreaLayout="searchAreaLayout"
          @onSearchFun="getTableList('search')"
          >
        </search-area>
      </div>
      <el-card class="question-list" v-if="total">
        <table-list
          ref="tableProductList"
          :manageTableData="tableData"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :width="btnsWidth"
          :totalNum="total"
          @onHandleBtnClick='onHandleBtnClick'
          @getTableList="getTableList"
          @changeTableCheckbox="changeTableCheckbox"
          @switchChange="onSwitchChange"
        >
        </table-list>
      </el-card>
       <div class="empty" v-else>
        <noData :nullType="nullText" :text="'暂未创建商品'">
        </noData>
      </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: "prize",
  data() {
    return {
      formData: {},
      imageUrl: '',
      nullText: 'noData',
      checkedGoodsId: [],
      total: 1,
      btnsWidth: 230,
      searchAreaLayout: [
        {
          key: 'questionName'
        }
      ],
      tabelColumn: [
        {
          label: '商品ID',
          key: 'goods_id',
        },
        {
          label: '图片',
          key: 'img',
        },
        {
          label: '商品名称',
          key: 'name',
        },
        {
          label: '单价',
          key: 'price',
        },
        {
          label: '优惠价',
          key: 'discount_price',
        },
        {
          label: '上下架',
          key: 'watch',
        }
      ],
      tableRowBtnFun: [
       {name:'编辑', methodName: 'edit'},{name:'复制', methodName: 'cope'},{name:'删除', methodName: 'del'}
      ],
      tableData: []
    };
  },
  components: {
    PageTitle,
    noData
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onSwitchChange(option) {
      if(option.watch) {
        // 上架处理
        this.$fetch('goodsEnable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id
        }).then(res => {
          this.$message.success("上架设置成功！");
          this.getTableList();
          console.log(res);
        }).catch(err => {
          this.$message.error("上架设置失败！");
          console.log(err);
        });
      } else {
        // 下架处理
        this.$fetch('goodsDisable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id
        }).then(res => {
          this.$message.success("下架设置成功！");
          this.getTableList();
          console.log(res);
        }).catch(err => {
          this.$message.error("下架设置失败！");
          console.log(err);
        });
      }
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableProductList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableProductList.clearSelect();
      }
      let obj = {
        ...pageInfo,
        keyword: formParams.questionName,
        webinar_id: this.$route.params.str
      };
      this.$fetch('goodsGet', obj).then(res => {
        this.tableData = res.data.goods_list;
        this.tableData.map(item => {
          item.watch = Boolean(!item.status);
          item.img = item.img_url;
        });
        this.total = res.data.total;
        if (params === 'search' && !res.data.total) {
          this.nullText = 'search';
        }
        this.addCover();
      }).catch(e => {
        console.log(e);
      });
    },
    // 为每个商品设置显示的封面
    addCover() {
      this.tableData.length &&
      this.tableData.forEach(item => {
        item.img = item.img_list.find(item => item.is_cover) > -1 ?
          item.img_list.find(item => item.is_cover).img_url :
          item.img_list[0].img_url;
      });
    },
    // 复制
    cope(that, {rows}) {
      that.$fetch('goodsCopy', {
        webinar_id: that.$route.params.str,
        goods_id: rows.goods_id
      }).then(res => {
        that.$message.success("复制成功！");
        that.getTableList();
        console.log(res);
      }).catch(err => {
        that.$message.error("复制失败！");
        console.log(err);
      });
    },
    // 编辑
    edit(that, {rows}) {
      that.$router.push({
        path: `/live/addProduct/${that.$route.params.str}`,
        query: {
          goodId: rows.goods_id
        }
      });
    },
    // 删除
    del(that, {rows}) {
      that.$confirm('确定要删除该文件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.batchDel(rows.goods_id);
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
      this.checkedGoodsId = val.map(item => item.goods_id);
    },
    // 批量删除
    batchDel(id) {
      if (!id) {
        if (this.checkedGoodsId.length < 1) {
          this.$message.error("请选择要操作的文件");
        } else {
          id = this.checkedGoodsId.join(',');
          console.log(this.checkedGoodsId, '111111111111111')
        }
      }
      this.$fetch('goodsBatchDel', {webinar_id: this.$route.params.str, goods_ids: id}).then(res => {
        this.$message.success("删除成功！");
        this.checkedGoodsId = [];
        this.getTableList();
      }).catch(err => {
        this.$message.error("删除失败！");
      })
    },
    // 新建礼物
    addProduct() {
      this.$router.push({path: `/live/addProduct/${this.$route.params.str}`});
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
  // /deep/.el-upload--picture-card{
  //   width:83%;
  // }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
      border-radius: 20px;
    }
  }
}
</style>
