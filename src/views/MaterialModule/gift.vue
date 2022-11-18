<template>
  <div class="gift-wrap">
    <pageTitle pageTitle="礼物">
      <div slot="content">
        1.支持创建免费礼物。观看端最多显示40个礼物
        <br />
        2.为保证显示效果，图片尺寸240 *240px，文件大小不超过
        <br />
        2MB，格式jpg、gif、png、bmp
        <br />
        3.礼物名称不支持特殊字符、表情
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" size="medium" round class="head-btn set-upload" @click="addGift">
        创建礼物
      </el-button>
      <el-button
        round
        size="medium"
        :class="['transparent-btn', { 'no-data': selectIds.length <= 0 }]"
        :disabled="selectIds.length <= 0"
        @click="handleDelete('', 1)"
      >
        批量删除
      </el-button>
      <VhallInput
        @keyup.enter.native="searchGifts"
        clearable
        @clear="searchGifts"
        style="width: 220px"
        v-clearEmoij
        class="head-btn fr search resetRightBrn search-tag"
        v-model="searchName"
        autocomplete="off"
        placeholder="请输入礼物名称"
      >
        <i
          style="cursor: pointer; line-height: 36px"
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="searchGifts"
        ></i>
      </VhallInput>
    </div>
    <div class="gift-list">
      <el-table
        @select-all="onSelectAll"
        :cell-class-name="freeFilter"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%; margin-bottom: 30px"
        ref="multipleTable"
        :header-cell-style="{ background: '#f7f7f7', color: '#666', height: '56px' }"
        v-if="total > 0"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="selectHandle" type="selection" width="55" align="left" />
        <el-table-column label="图片">
          <template slot-scope="scope">
            <div class="gift-cover">
              <img :src="scope.row.img" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="价格" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="gift-price">
              {{ `￥${scope.row.price}` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="left" width="120">
          <template slot-scope="scope" v-if="scope.row.source_status == 1">
            <el-button v-preventReClick class="btns" type="text" @click="handleEditGift(scope.row)">
              编辑
            </el-button>
            <el-button
              v-preventReClick
              class="btns"
              type="text"
              @click="handleDelete(scope.row, 2)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <SPagination
        :total="total"
        :page-size="10"
        v-show="total > searchParams.page_size"
        :currentPage="searchParams.page"
        @current-change="currentChangeHandler"
        align="center"
      ></SPagination>
      <null-page text="未搜索到相关内容" nullType="search" v-if="total === 0"></null-page>
    </div>
    <el-dialog
      v-if="dialogVisible"
      :title="editParams.gift_id ? '编辑礼物' : '创建礼物'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="create-gift"
      width="468px"
    >
      <el-form label-width="80px" :model="editParams" ref="editParamsForm" :rules="rules">
        <el-form-item label="图片上传" prop="img">
          <upload
            ref="uploadimg"
            :domain_url="domain_url"
            class="giftUpload"
            v-model="editParams.img"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :widthImg="231"
            :heightImg="130"
            @delete="(editParams.img = ''), (domain_url = '')"
            :before-upload="beforeUploadHandler"
          >
            <div slot="tip">
              <p>建议尺寸：240*240px，小于2MB</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="礼物名称" prop="name">
          <VhallInput
            v-model.trim="editParams.name"
            v-clearEmoij
            show-word-limit
            :maxlength="10"
            autocomplete="off"
            placeholder="请输入礼物名称"
          ></VhallInput>
        </el-form-item>
        <el-form-item label="礼物价格" prop="price">
          <!-- TODO:支付牌照问题 -->
          <VhallInput
            @input="handleInput"
            v-model.trim.number="editParams.price"
            autocomplete="off"
            :maxlength="10"
            placeholder="只允许输入0"
          >
            <span style="padding-left: 10px; padding-top: 1px" slot="prefix">￥</span>
          </VhallInput>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="!editParams.img || !editParams.name || !editParams.price"
          type="primary"
          v-preventReClick
          @click="handleUpdateGift"
          size="medium"
          round
        >
          确定
        </el-button>
        <el-button @click="handleCancelEdit" size="medium" round>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import PageTitle from '@/components/PageTitle';
  import upload from '@/components/Upload/main';
  import SPagination from '@/components/Spagination/main';
  import { sessionOrLocal } from '@/utils/utils';
  import NullPage from '../PlatformModule/Error/nullPage.vue';

  import Env from '@/api/env';

  export default {
    name: 'gift',
    data() {
      // 礼物价格
      const priceValidate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入礼物价格'));
        } else {
          // TODO:支付牌照问题
          if (value != 0) {
            callback && callback('价格必须等于0');
          } else if (value.length - value.indexOf('.') > 3 && value.indexOf('.') > -1) {
            callback && callback('价格最多支持两位小数');
          } else {
            callback();
          }
        }
      };
      return {
        total: 0,
        tableData: [],
        currentTableData: [],
        searchParams: {
          gift_name: '',
          page_size: 10,
          page: 1
        },
        pos: 0,
        selectIds: [],
        userId: JSON.parse(sessionOrLocal.get('userId')),
        defaultImgHost: `http:${Env.staticLinkVo.uploadBaseUrl}`,
        searchName: '',
        editParams: {
          gift_id: '',
          img: '',
          name: '',
          price: ''
        },
        domain_url: '',
        dialogVisible: false,
        deleteId: '',
        rules: {
          name: [{ required: true, validator: this.validTitle, trigger: 'blur' }],
          img: [{ required: true, message: '请输入礼物图片', trigger: 'change' }],
          price: [{ required: true, validator: priceValidate, trigger: 'blur' }]
        }
      };
    },
    watch: {
      total(newVal, oldVal) {
        if (newVal == 4 && newVal != oldVal) {
          this.$nextTick(() => {
            document
              .querySelector('.gift-list .el-table__header-wrapper th .el-checkbox__original')
              .setAttribute('disabled', 'true');
            document.querySelector(
              '.gift-list .el-table__header-wrapper th .el-checkbox'
            ).className += ' is-disabled';
            document.querySelector(
              '.gift-list .el-table__header-wrapper th .el-checkbox__input'
            ).className += ' is-disabled';
          });
        } else {
          this.$nextTick(() => {
            document
              .querySelector('.gift-list .el-table__header-wrapper th .el-checkbox__original')
              .setAttribute('disabled', 'false');
            document.querySelector(
              '.gift-list .el-table__header-wrapper th .el-checkbox'
            ).className = 'el-checkbox';
            document.querySelector(
              '.gift-list .el-table__header-wrapper th .el-checkbox__input'
            ).className = 'el-checkbox__input';
          });
        }
      }
    },
    components: {
      PageTitle,
      upload,
      SPagination,
      NullPage
    },
    created() {
      this.searchHandle();
    },
    methods: {
      /**
       * 价格格式限制
       * 只能输入数字和小数点；
       * 小数点只能有1个
       * 第一位不能是小数点
       * 第一位如果输入0，且第二位不是小数点，则去掉第一位的0
       * 小数点后保留2位
       */
      handleInput(value) {
        if (value != '') {
          // this.editParams.price = value.replace(/^[0-9]*$/,'')
          // this.editParams.price = value.replace(/[^\d]/g,'')
          let str = value;
          let len1 = str.substr(0, 1);
          let len2 = str.substr(1, 1);
          //如果第一位是0，第二位不是点，就用数字把点替换掉
          if (str.length > 1 && len1 == 0 && len2 != '.') {
            str = str.substr(1, 1);
          }
          //第一位不能是.
          if (len1 == '.') {
            str = '';
          }
          //限制只能输入一个小数点
          if (str.indexOf('.') != -1) {
            let str_ = str.substr(str.indexOf('.') + 1);
            if (str_.indexOf('.') != -1) {
              str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1);
            }
          }
          //正则替换，保留数字和小数点
          str = str.replace(/[^\d^\.]+/g, '');
          //如果需要保留小数点后两位，则用下面公式
          if (str.indexOf('.') > -1 && str.length - str.indexOf('.') > 3) {
            str = str.slice(0, str.indexOf('.') + 3);
            this.$message({
              message: `价格最多支持两位小数`,
              showClose: true,
              // duration: 0,
              type: 'warning',
              customClass: 'zdy-info-box'
            });
          }
          this.editParams.price = str;
        }
      },
      validTitle(rule, value, callback) {
        const reg = /[^\w\u4e00-\u9fa5]/g;
        if (!value) {
          return callback ? callback(new Error('请输入礼物名称')) : false;
        } else if (reg.test(value)) {
          return callback ? callback(new Error('请输入正确的礼物名称')) : false;
        } else {
          if (callback) {
            callback();
          } else {
            return true;
          }
        }
      },
      freeFilter({ row }) {
        if (row.source_status == 0) {
          return 'mycell';
        }
      },
      searchGifts() {
        if (this.searchName) {
          this.$vhall_paas_port({
            k: 100561,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.searchHandle();
      },
      searchHandle() {
        this.searchParams.page = 1;
        this.pos = 0;
        this.getTableList(true);
      },
      selectHandle(row) {
        return !(row.source_status == 0);
      },
      // 获取礼物列表
      getTableList(isSearch) {
        const opts = {
          limit: this.searchParams.page_size,
          pos: this.pos
        };
        this.searchName && (opts.name = this.searchName);
        this.$fetch('shareGiftList', opts).then(res => {
          if (res.code == 200 && res.data) {
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        });
      },
      // 全选方法
      onSelectAll() {
        if (this.total == 4) {
          this.$refs.multipleTable.clearSelection();
        }
      },
      // 处理批量操作
      handleSelectionChange(val) {
        let ids = [];
        val.length > 0 &&
          val.forEach((item, index) => {
            ids.push(item.gift_id);
          });
        this.selectIds = ids;
        // this.$refs.multipleTable.clearSelection()
      },
      // 上传进度
      uploadProcess(event, file, fileList) {
        // console.log('uploadProcess', event, file, fileList);
      },
      // 上传礼物封面成功
      handleuploadSuccess(res, file) {
        if (res.data) {
          let domain_url = res.data.domain_url || '';
          let file_url = res.data.file_url || '';
          this.editParams.img = file_url;
          this.domain_url = domain_url;
          this.$refs.editParamsForm.validateField('img');
        }
      },
      // 上传失败处理
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: `封面上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      // 上传预览
      uploadPreview(file) {
        // console.log('uploadPreview', file);
      },
      // 上传格式校验
      beforeUploadHandler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message({
            message: `文件格式不支持，请检查图片`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `上传封面图片大小不能超过 2M`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      // 打开编辑面板
      handleEditGift(data) {
        this.editParams = {
          gift_id: data.gift_id,
          name: data.name,
          price: data.price,
          img: data.img
        };
        this.domain_url = this.editParams.img;
        this.dialogVisible = true;
      },
      // 新建
      addGift() {
        this.editParams = {
          gift_id: '',
          name: '',
          img: '',
          price: ''
        };
        this.dialogVisible = true;
      },
      // 处理编辑新建
      handleUpdateGift() {
        this.$refs.editParamsForm.validate(valid => {
          if (valid) {
            let price = Number(this.editParams.price);
            if (price || price == 0) {
              if (price < 0 || price > 9999.99) {
                this.$message({
                  message: `价格必须介于0-9999.99之间`,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
                return;
              }
              price = Math.floor(price * 100) / 100;
              this.editParams.price = price.toFixed(2);
            } else {
              this.$message({
                message: `请输入正确礼物价格`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return;
            }
            if (this.editParams.gift_id) {
              this.handleEdit();
            } else {
              this.handleCreate();
            }
          }
        });
      },
      // 编辑
      handleEdit() {
        this.$fetch('updateGiftInfo', {
          ...this.editParams
        })
          .then(res => {
            if (res.code == 200) {
              this.$vhall_paas_port({
                k: 100558,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: '',
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              this.$message({
                message: `编辑成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.searchHandle();
              this.handleCancelEdit();
            }
          })
          .catch(e => {
            this.$message({
              message: `编辑失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 创建
      handleCreate() {
        this.$fetch(
          'createGiftInfo',
          this.$params({
            ...this.editParams
          })
        )
          .then(res => {
            if (res.code == 200) {
              this.$vhall_paas_port({
                k: 100557,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: '',
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              this.$message({
                message: `创建成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.searchHandle();
              this.handleCancelEdit();
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || `创建失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 取消礼品编辑
      handleCancelEdit() {
        this.editParams.gift_id = '';
        this.editParams.name = '';
        this.editParams.img = '';
        this.editParams.price = '';
        this.dialogVisible = false;
        this.$refs.uploadimg.domainUrl = '';
        this.domain_url = '';
      },
      // 删除礼品
      handleDelete(data, index) {
        if (data.gift_id) {
          this.selectIds = [];
          this.selectIds.push(data.gift_id);
        }
        this.$confirm('观众端礼物显示将受到影响, 确认删除?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.handleDeleteGift(index);
        });
      },
      handleDeleteGift(index) {
        this.$fetch('deleteGift', {
          gift_ids: this.selectIds.join(',')
        })
          .then(res => {
            if (res.code == 200) {
              this.$vhall_paas_port({
                k: index === 1 ? 100560 : 100559,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: '',
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              this.$message({
                message: `删除成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.searchHandle();
              this.selectIds = [];
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || `删除失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 翻页
      currentChangeHandler(val) {
        this.searchParams.page = val;
        this.pos = (val - 1) * this.searchParams.page_size;
        this.getTableList();
        // 切换table显示的内容
        // this.currentTableData = this.tableData.filter((item, index) => {
        //   return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
        // })
      }
    }
  };
</script>

<style lang="less" scoped>
  .gift-cover {
    display: inline-block;
    margin: 3px 0;
    width: 80px;
    height: 80px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e6e6e6;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
  .gift-wrap {
    /deep/ .create-gift .el-dialog__footer {
      padding-top: 0;
    }
    /deep/ .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
      content: '*';
      color: #fb3a32;
      margin-right: 4px;
    }
    /deep/ .mycell .el-checkbox {
      display: none;
    }
    /deep/.el-upload {
      border: 1px solid #ccc;
    }
    height: 100%;
    width: 100%;
    /deep/.el-card__body {
      width: 100%;
      padding: 32px 24px;
    }
    /deep/.el-upload--picture-card {
      width: 100%;
    }
    // /deep/.el-upload--picture-card{
    //   font-size: 36px;
    //   i.saasicon_shangchuan{
    //     font-size: 36px;
    //   }
    //   .picInco{
    //     height: 40px;
    //   }
    // }
    .head-operat {
      margin-bottom: 20px;
      /deep/ .el-input__prefix-inner .el-input__icon {
        line-height: 36px;
      }
      .search-tag {
        float: right;
        width: 220px;
        /* /deep/.el-input__inner{
        border-radius: 18px;
        padding: 0 12px;
      } */
        /deep/ .el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__inner {
          border-radius: 20px;
          height: 36px;
          padding-right: 30px !important;
        }
        /deep/ .el-input__prefix {
          cursor: pointer;
        }
      }
      .head-btn {
        display: inline-block;
        border-radius: 20px;
      }
      .no-data {
        color: #b3b3b3;
        background: #ffffff;
      }
      .resetRightBrn {
        /deep/ .el-input__inner {
          border-radius: 20px;
          height: 36px;
          padding-right: 50px !important;
        }

        /deep/ .el-input__suffix {
          cursor: pointer;

          /deep/ .el-input__icon {
            width: auto;
            margin-right: 5px;
            line-height: 36px;
          }
        }
      }
      ::v-deep .set-upload {
        position: relative;
        span {
          input {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
      /deep/.el-input {
        height: 36px;
        input {
          border-radius: 18px;
          border: 1px solid #ccc;
        }
      }
    }
    .gift-list {
      .layout--right--main();
      .padding-table-list();
      .gift-price {
        color: #fb3a32;
      }
      /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background: #e6e6e6;
      }
    }
    /deep/ .dialog-footer {
      .el-button {
        padding: 4px 23px;
      }
    }
  }
</style>
