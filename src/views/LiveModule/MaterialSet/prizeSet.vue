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
              <el-form :model="formData" ref="ruleForm" label-width="100px">
                <el-form-item label="姓名">
                  <el-input v-model="formData.name" maxlength="10" placeholder="请输入姓名" show-word-limit></el-input>
                  <!-- <upload
                    class="giftUpload"
                    v-model="imageUrl"
                    :on-success="handleuploadSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    :before-upload="beforeUploadHnadler">
                    <p slot="tip">推荐尺寸：160*160px，小于2MB<br/> 支持jpg、gif、png、bmp</p>
                  </upload> -->
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
                </el-form-item>
                <el-form-item label="自定义1">
                    <el-input v-model="formData.title" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 4}"></el-input>
                    <div class="isDelete">
                      <i class="el-icon-delete"></i>
                      <el-switch
                        v-model="formData.isTitle"
                        active-color="#ccc"
                        inactive-color="#ff4949"
                        active-text=""
                        inactive-text="必填">
                      </el-switch>
                    </div>
                </el-form-item>
                <div class="add-prize">
                  <i class="el-icon-plus"></i>
                  添加字段
                </div>
                <el-form-item>
                  <el-button type="primary" round>保存</el-button>
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
                    :on-success="handleuploadSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    :before-upload="beforeUploadHnadler">
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
          <div class="prize-list" v-if="total">
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
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <create-prize ref="createPrize"></create-prize>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import createPrize from './components/createPrize';
export default {
  name: 'prizeSet',
  data() {
    return {
      activeName: 'third',
      formData: {},
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
      prizeForm: {
        name: '',
        imageUrl: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ]
      },
      searchAreaLayout: [
        {
          prizeName: ''
        }
      ],
      tabelColumn: [
        {
          label: '奖品图片',
          key: 'img',
        },
        {
          label: '奖品ID',
          key: 'id',
        },
        {
          label: '奖品名称',
          key: 'name',
        },
        {
          label: '创建时间',
          key: 'time',
        }
      ],
      tableRowBtnFun: [
       {name:'编辑', methodName: 'edit'},{name:'复制', methodName: 'cope'},{name:'删除', methodName: 'del'}
      ],
      tableData: [
        {
          id: '12',
          time: '2020-10-10',
          name: '请输入000',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          id: '13',
          time: '2020-10-10',
          name: '请输入111',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ]
    };
  },
  components: {
    PageTitle,
    upload,
    createPrize
  },
  methods: {
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
