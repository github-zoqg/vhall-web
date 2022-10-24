<template>
  <div class="question-wrap">
    <pageTitle pageTitle="商品"></pageTitle>
      <div class="head-operat" v-show="total || isSearch">
        <el-button type="primary" size="medium" round  @click="addProduct" v-preventReClick>创建商品</el-button>
        <el-button round @click="batchDel(null)" size="medium" class="transparent-btn" v-preventReClick :disabled="!checkedGoodsId.length">批量删除</el-button>
         <div class="inputKey">
          <VhallInput v-model="keyword" v-clearEmoij placeholder="请输入商品名称"  @keyup.enter.native="searchTableList" maxlength="50" @clear="searchTableList" clearable>
            <i slot="prefix" @click="searchTableList" class="el-icon-search el-input__icon" style="cursor: pointer; line-height: 36px;"></i>
          </VhallInput>
        </div>
      </div>
      <div class="question-list" v-show="total || isSearch">
        <table-list
          ref="tableProductList"
          :manageTableData="tableData"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :width="150"
          :totalNum="total"
          @onHandleBtnClick='onHandleBtnClick'
          @getTableList="getTableList"
          @changeTableCheckbox="changeTableCheckbox"
          @switchChange="onSwitchChange"
        >
        </table-list>
        <noData :nullType="'search'" v-if="!total"></noData>
      </div>
       <div class="empty" v-show="!total && !isSearch">
        <noData :nullType="'nullData'" :text="'您还没有商品，快来创建吧！'">
          <el-button type="primary" round class="length152"  @click="addProduct" v-preventReClick>创建</el-button>
        </noData>
      </div>
      <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5 && webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import noData from '@/views/PlatformModule/Error/nullPage';
import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: "prize",
  data() {
    return {
      formData: {},
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      imageUrl: '',
      keyword:'',
      saleTotal: 0,
      isSearch: false, //是否是搜索
      checkedGoodsId: [],
      total: 1,
      userId: JSON.parse(sessionOrLocal.get("userId")),
      searchAreaLayout: [
        {
          key: 'questionName'
        }
      ],
      tabelColumn: [
        {
          label: '图片',
          key: 'img',
          width: 120
        },
        {
          label: '商品名称',
          key: 'name',
        },
        {
          label: '单价',
          key: 'price',
          width: 120
        },
        {
          label: '优惠价',
          key: 'discount_price',
          width: 120
        },
        {
          label: '上下架',
          key: 'watch',
          width: 80
        }
      ],
      tableRowBtnFun: [
       {name:'编辑', methodName: 'edit'},{name:'复制', methodName: 'cope'},{name:'删除', methodName: 'del'}
      ],
      vm: null,
      tableData: []
    };
  },
  components: {
    PageTitle,
    noData,
    beginPlay
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onSwitchChange(option) {
      this.$vhall_paas_port({
        k: option.watch ? 100395 : 100396,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      if(option.watch) {
        if (this.saleTotal >= 100) {
          option.watch = false;
          this.$message({
            message: `商品最大上架数量为100，请下架后再进行操作`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        // 上架处理
        this.$fetch('goodsEnable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id
        }).then(res => {
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo('上架设置成功');
          this.getTableList();
          console.log(res);
        }).catch(res => {
          this.$message({
            message: res.msg || '上架设置失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          this.getTableList();
          console.log(res);
        });
      } else {
        // 下架处理
        this.$fetch('goodsDisable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id
        }).then(res => {
          if (this.vm) {
            this.vm.close();
          }
          this.messageInfo('下架设置成功');
          this.getTableList();
          console.log(res);
        }).catch(res => {
          this.$message({
            message: res.msg || '下架设置失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          console.log(res);
        });
      }
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    searchTableList() {
      if (this.keyword) {
        this.$vhall_paas_port({
          k: 100397,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.getTableList('search');
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableProductList.pageInfo; //获取分页信息
      if (params == 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        if (this.$refs.tableProductList) {
          this.$refs.tableProductList.currentChangeHandler(1)
        }
      }
      let obj = {
        ...pageInfo,
        keyword: this.keyword,
        webinar_id: this.$route.params.str
      };
      this.isSearch = this.keyword ? true : false;
      this.$fetch('goodsGet', this.$params(obj)).then(res => {
        let tableData = res.data.goods_list;
        tableData.map(item => {
          item.watch = Boolean(!item.status);
          item.img = item.img_url;
        });
        this.total = res.data.total;
        this.tableData = tableData;
        this.addCover();
        this.getSaleGoodsList();
      }).catch(e => {
        console.log(e);
      });
    },
    //文案提示问题
    messageInfo(msg) {
      this.vm = this.$message({
        message: msg,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
        // showClose: false,
        // duration: 2000,
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
      if (that.saleTotal >= 100) {
        that.$message.error('商品最大上架数量为100，请删除后再进行操作');
        return;
      }
      that.$fetch('goodsCopy', {
        webinar_id: that.$route.params.str,
        goods_id: rows.goods_id
      }).then(res => {
        that.$vhall_paas_port({
          k: 100392,
          data: {business_uid: that.userId, user_id: '', webinar_id: that.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        that.$message.success("复制成功！");
        that.getTableList();
      }).catch(err => {
        that.$message.error("复制失败！");
        console.log(err);
      });
    },
    // 编辑
    edit(that, {rows}) {
      if (!rows.status) {
        that.$alert('商品已上架，如需编辑请先做下架处理', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'zdy-message-box',
          lockScroll: false,
        });
        return;
      }
      that.$router.push({
        path: `/live/editProduct/${that.$route.params.str}`,
        query: {
          goodId: rows.goods_id
        }
      });
    },
    delConfirm(id, index) {
      this.$confirm('确定要删除该商品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('goodsBatchDel', {webinar_id: this.$route.params.str, goods_ids: id}).then(res => {
          if (res.code == 200) {
            this.$vhall_paas_port({
              k: index === 1 ? 100394 : 100393,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            this.$message({
              message: `删除成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.checkedGoodsId = [];
            this.getTableList('search');
          }
        }).catch(res => {
          this.$message({
            message: res.msg || `删除失败, 请下架后删除`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        })
      }).catch(() => {
        this.$message({
          message:  `已取消删除`,
          showClose: true,
          // duration: 0,
          type: 'info',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 删除
    del(that, {rows}) {
      that.delConfirm(rows.goods_id, 2);
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
      this.checkedGoodsId = val.map(item => item.goods_id);
    },
    // 批量删除
    batchDel(id) {
     if (this.checkedGoodsId.length < 1) {
        this.$message({
          message: '请选择要操作的文件',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      } else {
        id = this.checkedGoodsId.join(',');
        this.delConfirm(id, 1);
      }
    },
    // 获取在线商品列表
    getSaleGoodsList() {
      this.$fetch('goodsList', {webinar_id: this.$route.params.str, pos:0, limit: 1}).then(res => {
        if (res.code == 200) {
          this.saleTotal = res.data.total;
        }
      }).catch(res => {
        // this.$message.error(res.msg);
      })
    },
    // 新建商品
    addProduct() {
      if (this.saleTotal >= 100) {
        this.$message({
          message: '商品最大上架数量为100，请删除后再进行操作',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
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
    background: #fff;
    width: 100%;
    padding: 24px 32px;
    border-radius: 4px;
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
    .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        line-height: 36px;
        padding-right: 30px!important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
  }
}
</style>
