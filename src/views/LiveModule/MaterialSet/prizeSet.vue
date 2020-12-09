<template>
  <div class="prize-card">
    <pageTitle title="抽奖">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <el-card>
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="领奖页设置" name="first">
          <div class="give-item">
            <div class="give-prize">
              <el-form :model="givePrizeForm" ref="ruleForm" label-width="100px">
                <!-- <el-form-item label="姓名">
                  <el-input v-model="formData.name" maxlength="10" placeholder="请输入姓名" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="联系地址">
                    <el-input v-model="formData.adress" type="textarea" placeholder="请输入地址"  :autosize="{ minRows: 4}"></el-input>
                    <el-switch
                      v-model="formData.isPhone"
                      active-color="#ccc"
                      inactive-color="#ff4949"
                      active-text=""
                      inactive-text="必填">
                    </el-switch>
                </el-form-item> -->
                <el-form-item v-for="(item, index) in givePrizeList" :key="index" :label="Boolean(item.is_system) ? item.field : `${item.field}${index - 2}`" :ref="`${item.field_key}`" :contenteditable="Boolean(item.is_system) ? false : true" >
                    <el-input v-model="givePrizeForm[item.field_key]" type="text" placeholder="请输入内容" v-if="Boolean(item.is_system)"></el-input>
                    <el-input v-model="givePrizeForm[item.field_key]"  type="textarea" placeholder="请输入" :autosize="{ minRows: 4}" v-else></el-input>
                    <div class="isDelete">
                      <i class="el-icon-delete" @click="deleteGivePrize(index)" v-if="!Boolean(item.is_system)"></i>
                      <el-switch
                       v-if="index > 1"
                        v-model="givePrizeForm[item.is_required]"
                        inactive-text="必填">
                      </el-switch>
                    </div>
                </el-form-item>
                <div class="add-prize" @click="addField">
                  <i class="el-icon-plus"></i>
                  添加字段
                </div>
                <el-form-item>
                  <el-button type="primary" round @click="sureGivePrize">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>抽奖<i class="el-icon-close"></i></h3>
                <div class="give-msg">
                  <p><el-input v-model="formData.phone" placeholder="请输入姓名" style="width:242px"></el-input></p>
                  <p><el-input v-model="formData.phone" placeholder="请输入手机号" style="width:242px"></el-input></p>
                  <p><el-input v-model="formData.phone" placeholder="请输入地址" style="width:242px"></el-input></p>
                </div>
                <div class="sureBtn"><el-button type="primary" round>确定</el-button></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="抽奖页设置" name="second">
            <div class="give-item">
            <div class="give-prize">
              <el-form :model="formData" ref="ruleForm" label-width="100px">
                <el-form-item label="图片上传">
                  <upload
                    class="giftUpload"
                    v-model="formData.imageUrl"
                    :on-success="prizeLoadSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    :before-upload="beforeUploadHandler">
                    <p slot="tip">推荐尺寸：240*240px，小于2MB <br/> 支持jpg、gif、png、bmp</p>
                  </upload>
                </el-form-item>
                <el-form-item label="模板库">
                    <div class="prize-type">
                      <p v-for="(item, index) in typeList" :key="index" :class="item.isChecked ? 'active' : ''" @click="changeType(item)">
                        <label class="img-tangle" v-show="item.isChecked">
                          <i class="el-icon-check"></i>
                        </label>
                        <img :src="item.url" alt="">
                      </p>
                    </div>
                </el-form-item>
                <el-form-item label="抽奖标题">
                    <el-input v-model="formData.phone" maxlength="10" placeholder="请输入抽奖标题" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="文字说明">
                    <el-input v-model="formData.text" maxlength="20" placeholder="正在进行抽奖" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" round>保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>抽奖<i class="el-icon-close"></i></h3>
                <div class="prize-show">
                  <img :src="prizeImg" alt="">
                </div>
                <div class="sureBtn">正在进行抽奖</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="奖品设置" name="third">
          <div class="prize-info">
             <prize-list></prize-list>
          </div>
          <!-- <div class="prize-list" v-if="total">
            <div class="head-operat">
              <el-button type="primary" round  @click="createPrize">创建奖品</el-button>
              <el-button round @click="changePrize">资料库</el-button>
              <el-button round>批量删除</el-button>
              <search-area class="head-btn fr search"
                ref="searchArea"
                :placeholder="'请输入奖品名称'"
                :isExports='false'
                :searchAreaLayout="searchAreaLayout"
                @onSearchFun="getPrizeList('search')"
                >
              </search-area>
            </div>
            <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
            :totalNum="total" @onHandleBtnClick='onHandleBtnClick' @getTableList="getPrizeList" @changeTableCheckbox="changeTableCheckbox">
            </table-list>
          </div>
          <div class="prize-no" v-else>
            <el-button type="primary" @click="createPrize" round>新建奖品</el-button>
            <el-button round>资料库</el-button>
          </div> -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- <create-prize ref="createPrize"></create-prize> -->
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
// import createPrize from './components/createPrize';
import prizeList from '../../MaterialModule/prize'
export default {
  name: 'prizeSet',
  data() {
    return {
      activeName: 'first',
      formData: {},
      givePrizeForm: {
        adressCheced: false
      },
      total: 100,
      prizeImg: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      typeList: [
        {
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          isChecked: true
        },
        {
          url: '../../../common/images/avatar.png',
          isChecked: false
        },
        {
          url: '../../../common/images/small.png',
          isChecked: false
        }
      ],
      givePrizeList: [
        {
          is_system: 1,
          field: '姓名',
          field_key: 'name',
          rank: 1,
        },
        {
          is_system: 1,
          field: '手机号',
          field_key: 'phone',
          rank: 2,
        },
        {
          is_system: 1,
          field: '地址',
          field_key: 'adress',
          is_required: 'adressCheced',
          rank: 3,
        },
        {
          is_system: 0,
          field: '自定义',
          field_key: 'user_define_4',
          is_required: 'is_required_4',
          rank: 4,
        },
      ],
      prizeForm: {
        name: '',
        imageUrl: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ]
      },
    };
  },
  components: {
    PageTitle,
    upload,
    // createPrize,
    prizeList
  },
  mounted() {
    this.getGivePrize();

  },
  methods: {
    changeZX(item,ind){
      console.warn(item, index, '567890')
    },
    changeVal(e) {
      console.log(e.target.innerHTML, '11111111111');
        // this.editValue = e.target.innerHTML;
    },
    addField() {
      this.givePrizeList.push({
        is_system: 0,
        field: '自定义',
        field_key: 'user_define_' + (this.givePrizeList.length + 1),
        is_required: 'is_required_' + (this.givePrizeList.length + 1),
        rank: this.givePrizeList.length + 1,
      });
    },
    deleteGivePrize(index) {
      this.givePrizeList.splice(index, 1);
    },
    // 获取领奖页信息
    getGivePrize() {
      this.$fetch('getDrawPrizeInfo', {webinar_id: this.$route.params.str}).then(res => {
        console.log(res.data, '111111111111');
      })
    },
    // 保存领奖页信息
    sureGivePrize() {
      console.log(this.$refs.user_define_4.innerHTML, '111111111111');
      console.log(this.givePrizeList, this.givePrizeForm, '00000000000000000000')
    },
    getPrizeList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        // this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 复制
    cope(that, {rows}) {
      console.log('复制', rows);
    },
    // 编辑
    edit(that, {rows}) {
      console.log('编辑', rows);
    },
    // 删除
    del(that, {rows}) {
      console.log('删除', rows);
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
    },
    handleClick(tab) {
      this.activeName = tab.name;
    },
    changeType(items) {
      this.prizeImg = items.url;
      this.typeList.map(item => {
        item.isChecked = false;
        items.isChecked = true;
      });
    },
     prizeLoadSuccess(res, file){
      console.log(res, file);
      // this.prizeForm.imageUrl = URL.createObjectURL(file.raw);
      // this.prizeForm.img_path = res.data.file_url;
      // this.fileList.push({
      //   url: this.form.imageUrl,
      //   cover: false
      // });
      // if (!this.fileList.some(item => item.cover)) {
      //   this.fileList[0].cover = true;
      // }
      // // 生成图片 ID 添加到 imgIdArr 中
      // this.generateImgId(this.form.imageUrl);
      // console.log(this.fileList);
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
      }
      let imgSrc = window.URL.createObjectURL(file);
      let img = new Image();
      img.src = imgSrc;
      let that = this; // onload 里面不能用this
      img.onload = function () {
        // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
        if (img.width > img.height) {
          that.imgType = 'widthMore';
        } else if (img.width < img.height) {
          that.imgType = 'heightMore';
        } else {
          that.imgType = 'default';
        }
      };
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    createPrize() {
      this.$refs.createPrize.dialogVisible = true;
    },
    changePrize() {
      this.$refs.createPrize.dialogPrizeVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
.prize-card{
  height: 100%;
  /deep/.el-card__body {
    padding:0;
  }
  /deep/.el-switch{
    float: right;
    padding-top: 10px;
  }
  /deep/.el-form-item__label{
    color: #1A1A1A;
  }
  /deep/.el-switch__label.is-active {
    color: #1A1A1A;
}
  .prize-info{
    margin: 18px 24px;
  }
  .prize-list{
    padding: 33px 24px;
    .head-operat{
      margin-bottom: 30px;
    }
  }
  .give-item{
    padding: 40px 24px;
    display: flex;
    /deep/.el-form{
      position: relative;
    }
    .give-prize{
      width: 500px;
      margin-right: 120px;
      .isDelete{
        float: right;
        height: 20px;
        i{
          font-size: 16px;
          vertical-align: top;
          margin: 7px 10px 0 0;
          cursor: pointer;
        }
      }
      /deep/.el-button{
        margin-top: 25px;
      }
    }
    .add-prize{
      position: absolute;
      left: 100px;
      bottom: 85px;
      font-size: 14px;
      color: #3562FA;
      cursor: pointer;
      i{
        color: #3562FA;
        border: 1px dashed #3562FA;
      }
    }
    .give-show{
      width: 326px;
      height: 631px;
      background-image: url('../../../common/images/h5-show-phone.png');
      background-size: cover;
      margin-top: -15px;
      .give-people{
        margin: auto;
        margin-top: 287px;
        width: 290px;
        margin-left: 25px;
        h3{
          text-align: center;
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          color:#1A1A1A;
          border-bottom: 1px solid #E6E6E6;
          i{
            float: right;
            margin-top: 13px;
            margin-right: 15px;
            cursor: pointer;
          }
        }
        .sureBtn{
          text-align: center;
          /deep/.el-button{
            margin-top: 25px;
          }
        }
        .give-msg{
          text-align: center;
          margin: auto;
          p{
            margin-top: 24px;
          }
        }
      }
      .prize-show{
        margin: 10px auto;
        text-align: center;
        border-radius: 50%;
        img{
          width: 200px;
          height: 200px;
          border-radius: 50%;
        }
      }
    }
    .prize-type{
      // width: 100%;
      display: flex;
      text-align: center;
      justify-content: space-between;
      p{
        width: 120px;
        height: 120px;
        border-radius: 4px;
        border: 1px solid #ccc;
        position: relative;
        &.active{
          border: 1px solid #FB3A32;
          box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
        }
        img{
          width: 100%;
          height: 120px;
        }
        .img-tangle{
          position: absolute;
          right: 0;
          top:0;
          width: 0;
          height: 0;
          border: 10px solid transparent;
          border-right-color: #FB3A32;
          border-top-color: #FB3A32;
          i{
            color:#fff;
            position: absolute;
            top: -8px;
            right:-11px;
            font-size: 10px;
          }
        }
      }
    }
  }
  .prize-no{
    height: calc(100vh - 260px);
    text-align: center;
    margin-top: 268px;
  }
}
</style>
