<template>
  <div class="prize-create">
    <VhallDialog
      :title="`${title}奖品`"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="468px"
    >
      <el-form
        :model="prizeForm"
        :rules="rules"
        ref="prizeForm"
        label-width="80px"
        onsubmit="return false;"
      >
        <el-form-item label="图片上传" required>
          <upload
            class="giftUpload"
            v-model="prizeForm.img_path"
            :domain_url="prizeForm.img_path"
            :on-success="prizeLoadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            @delete="deleteImg"
            :widthImg="231"
            :heightImg="130"
            :before-upload="beforeUploadHandler"
          >
            <div slot="tip">
              <p>建议尺寸：240*240px，小于2M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="奖品名称" prop="prize_name">
          <VhallInput
            v-model="prizeForm.prize_name"
            :maxlength="10"
            autocomplete="off"
            show-word-limit
          ></VhallInput>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="medium"
          type="primary"
          @click="surePrize"
          round
          :disabled="!prizeForm.prize_name"
          v-preventReClick
        >
          确 定
        </el-button>
        <el-button size="medium" @click.prevent.stop="dialogVisible = false" round>取 消</el-button>
      </span>
    </VhallDialog>
    <VhallDialog
      title="选择奖品"
      :visible.sync="dialogPrizeVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      style="overflow: hidden"
      custom-class="choose-gift"
      width="588px"
    >
      <div class="prizeList">
        <div class="search" v-show="total || isSearch">
          <VhallInput
            v-model="keyword"
            class="search-dialog-tag"
            placeholder="请输入奖品名称"
            style="width: 220px"
            @keyup.enter.native="inputChange"
            @clear="inputChange"
            clearable
          >
            <i
              slot="prefix"
              class="el-icon-search el-input__icon"
              @click="inputChange"
              style="cursor: pointer; line-height: 36px"
            ></i>
          </VhallInput>
        </div>
        <div v-show="total" class="material-box">
          <el-scrollbar style="height: 100%" v-loadMore="moreLoadData">
            <div class="prize">
              <div
                class="prize-item"
                v-for="(item, index) in list"
                :key="index"
                :class="item.isChecked ? 'active' : ''"
                @click.stop="choisePrize(item)"
              >
                <span class="prize-img"><img :src="item.img_path" alt="" /></span>
                <div class="prize-title">
                  <h1>{{ item.prize_name }}</h1>
                  <p>{{ item.prize_id }}</p>
                </div>
                <label class="img-tangle" v-show="item.isChecked">
                  <img src="../../../../common/images/icon-choose.png" alt="" />
                </label>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="no-live" v-show="!total">
          <noData :nullType="nullText" :text="text" :height="50">
            <el-button
              type="primary"
              v-if="nullText == 'nullData'"
              round
              @click.prevent.stop="createPrize"
              v-preventReClick
            >
              创建奖品
            </el-button>
          </noData>
        </div>
        <div class="prize-footer">
          <div class="prize-check" v-show="total || isSearch">
            <span>
              当前选中
              <b>{{ checkedList.length }}</b>
              件奖品
            </span>
          </div>
          <div class="dialog-footer" v-show="total || isSearch">
            <el-button
              size="medium"
              type="primary"
              @click="sureChoisePrize"
              v-preventReClick
              round
              :disabled="!checkedList.length"
            >
              确 定
            </el-button>
            <el-button
              size="medium"
              @click.prevent.stop="dialogPrizeVisible = false"
              v-preventReClick
              round
            >
              取 消
            </el-button>
          </div>
        </div>
      </div>
    </VhallDialog>
    <VhallDialog
      title="提示"
      :visible.sync="dialogTongVisible"
      :close-on-click-modal="false"
      :show-close="false"
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <p>保存奖品同时共享至资料管理，便于其他活动使用？</p>
          <el-checkbox v-model="sureChecked">共享到资料管理</el-checkbox>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" v-preventReClick @click="sureMaterialPrize" round>
            确 定
          </el-button>
          <el-button size="medium" @click="cancelMaterialPrize" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
  import upload from '@/components/Upload/main';
  import noData from '@/views/PlatformModule/Error/nullPage';
  export default {
    data() {
      return {
        dialogVisible: false,
        dialogPrizeVisible: false,
        dialogTongVisible: false,
        keyword: '',
        sureChecked: true,
        checkedList: [],
        maxPage: 0,
        total: 0,
        nullText: 'nullData',
        isSearch: false,
        text: '您还没有奖品，快来创建吧！',
        prizePageInfo: {
          pos: 0,
          limit: 6,
          page: 1
        },
        prizeForm: {
          source: 1,
          img_path: '',
          prize_name: ''
        },
        rules: {
          prize_name: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }]
        },
        list: []
      };
    },
    computed: {
      title() {
        if (this.prizeInfo.prize_id) {
          this.$set(this.prizeForm, 'img_path', this.prizeInfo.img_path);
          this.$set(this.prizeForm, 'prize_name', this.prizeInfo.prize_name);
          this.$set(this.prizeForm, 'prize_id', this.prizeInfo.prize_id);
          this.$set(this.prizeForm, 'source', this.$parent.source);
          return '编辑';
        } else {
          this.prizeResetForm();
          return '创建';
        }
      }
    },
    props: ['prizeInfo', 'liveTotal'],
    components: {
      upload,
      noData
    },
    watch: {
      dialogPrizeVisible() {
        if (this.dialogPrizeVisible) {
          this.list = [];
          this.checkedList = [];
          this.keyword = '';
          this.prizePageInfo = {
            pos: 0,
            limit: 6,
            page: 1
          };
          this.getPrizeList();
        } else {
          this.list = [];
          // this.list.map(item => item.isChecked = false)
        }
      }
    },
    methods: {
      handleClose(done) {
        this.checkedList = [];
        this.prizePageInfo.page = 1;
        done();
      },
      prizeResetForm() {
        this.prizeForm = {
          source: this.$parent.source,
          img_path: '',
          prize_name: ''
        };
      },
      surePrize() {
        if (!this.prizeForm.img_path) {
          this.$message({
            message: `请上传图片`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        this.$refs.prizeForm.validate(valid => {
          if (valid) {
            if (this.$parent.source == 1) {
              this.materiaPrize();
            } else {
              if (this.title == '创建') {
                this.dialogTongVisible = true;
              } else {
                this.liveSurePrize();
              }
            }
          } else {
            return false;
          }
        });
      },
      // 同步资料库的保存
      sureMaterialPrize() {
        if (this.sureChecked) {
          this.$vhall_paas_port({
            k: 100330,
            data: {
              business_uid: this.$parent.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.materiaPrize();
          this.liveSurePrize();
          this.dialogTongVisible = false;
        } else {
          // 不保存资料库
          this.liveSurePrize();
          this.$vhall_paas_port({
            k: 100331,
            data: {
              business_uid: this.$parent.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.dialogTongVisible = false;
        }
      },
      cancelMaterialPrize() {
        this.dialogTongVisible = false;
        this.liveSurePrize();
        this.$vhall_paas_port({
          k: 100331,
          data: {
            business_uid: this.$parent.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      // 资料库保存奖品
      materiaPrize() {
        this.prizeForm.room_id = '';
        this.prizeForm.source = 1;
        this.$fetch('createPrize', this.$params(this.prizeForm))
          .then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.$vhall_paas_port({
                k: this.title === '编辑' ? 100535 : 100534,
                data: {
                  business_uid: this.$parent.userId,
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
                message: `资料中心奖品${this.title === '编辑' ? '修改' : '新建'}成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.$emit('getTableList');
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || `资料中心奖品${this.title === '编辑' ? '修改' : '新建'}失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.dialogVisible = true;
          });
      },
      // 直播下的保存奖品
      liveSurePrize() {
        this.prizeForm.source = 0;
        this.prizeForm.room_id = this.$route.query.roomId || '';
        this.$fetch('createPrize', this.$params(this.prizeForm))
          .then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.$vhall_paas_port({
                k: this.title === '编辑' ? 100325 : 100324,
                data: {
                  business_uid: this.$parent.userId,
                  user_id: '',
                  webinar_id: this.$route.params.str,
                  refer: '',
                  s: '',
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              this.$message({
                message: `直播下奖品${this.title === '编辑' ? '修改' : '新建'}成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.$emit('getTableList');
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || `直播下奖品${this.title === '编辑' ? '修改' : '新建'}失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.dialogVisible = true;
          });
      },
      sureChoisePrize() {
        if (this.liveTotal + this.checkedList.length > 20) {
          this.$message({
            message: `每个活动最多显示20个奖品，超过20个后无法关联，需要将原有奖品删除`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        let params = {
          room_id: this.$route.query.roomId,
          prize_id: this.checkedList.join(',')
        };
        this.$fetch('saveLotteryPrize', params)
          .then(res => {
            this.$vhall_paas_port({
              k: 100326,
              data: {
                business_uid: this.$parent.userId,
                user_id: '',
                webinar_id: this.$route.params.str,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `选择成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.dialogPrizeVisible = false;
            this.list.map(item => {
              item.isChecked = false;
            });
            this.list = [];
            this.checkedList = [];
            this.$emit('getTableList');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `操作失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      createPrize() {
        this.dialogVisible = true;
        this.dialogPrizeVisible = false;
      },
      inputChange() {
        this.prizePageInfo = {
          pos: 0,
          page: 1,
          limit: 6
        };
        this.checkedList = [];
        this.list = [];
        this.getPrizeList();
      },
      moreLoadData() {
        if (this.prizePageInfo.page >= this.maxPage) {
          return false;
        }
        this.prizePageInfo.page++;
        this.prizePageInfo.pos = parseInt((this.prizePageInfo.page - 1) * this.prizePageInfo.limit);
        this.getPrizeList();
      },
      getPrizeList() {
        let params = {
          keyword: this.keyword,
          source: 1,
          ...this.prizePageInfo
        };
        this.$fetch('getPrizeList', params).then(res => {
          let adList = res.data.list;
          adList.map(item => {
            item.isChecked = false;
          });
          this.list.push(...adList);
          this.total = res.data.count;
          if (this.keyword) {
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          } else {
            this.nullText = 'nullData';
            this.text = '您还没有奖品，快来创建吧！';
            this.isSearch = false;
          }
          this.maxPage = Math.ceil(res.data.count / this.prizePageInfo.limit);
        });
      },
      deleteImg() {
        this.prizeForm.img_path = '';
      },
      prizeLoadSuccess(res, file) {
        console.log(res, file);
        // this.prizeForm.imageUrl = URL.createObjectURL(file.raw);
        // this.prizeForm.img_path = res.data.file_url;
        this.prizeForm.img_path = res.data.domain_url;
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
      beforeUploadHandler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message({
            message: `上传奖品图片只能是 ${typeList.join('、')} 格式`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `上传奖品图片大小不能超过 2M`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: `奖品图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      cancelPeize() {
        this.dialogVisible = false;
        this.$refs[prizeForm].resetFields();
      },
      choisePrize(item) {
        item.isChecked = !item.isChecked;
        this.checkedList = this.list.filter(items => items.isChecked).map(item => item.prize_id);
      }
    }
  };
</script>
<style lang="less" scoped>
  .search-dialog-tag {
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
  /deep/.el-upload--picture-card {
    font-size: 36px;
    i.saasicon_shangchuan {
      font-size: 36px;
    }
    .picInco {
      height: 40px;
    }
  }
  /deep/ .choose-gift {
    .el-dialog__title {
      line-height: 28px;
    }
    .el-dialog__body {
      padding: 0;
    }
    .head-btn.el-input {
      width: 220px;
      height: 36px;
      margin-left: 32px;
      .el-input__inner {
        border-radius: 18px;
        border: 1px solid #ccc;
      }
    }
  }
  .prize-create {
    .prizeList {
      padding-bottom: 24px;
      .search {
        margin-bottom: 16px;
        padding: 0 32px;
        /deep/.el-input__inner {
          border-radius: 20px;
          height: 36px;
          background: transparent;
        }
      }
      .material-box {
        height: 300px;
        margin-bottom: 10px;
      }
      .prize {
        max-height: 300px;
        display: flex;
        padding: 0 32px;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        .prize-item {
          width: 256px;
          height: 96px;
          display: flex;
          background: #f7f7f7;
          margin-bottom: 12px;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          border: 1px solid transparent;
          transition: all 0.15s ease-in;
          .prize-img {
            display: inline-block;
            width: 72px;
            height: 72px;
            margin: 12px;
            border: 1px solid #e6e6e6;
            border-radius: 4px;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
            border-radius: 4px;
          }
          .prize-title {
            margin-top: 15px;
            h1 {
              font-weight: 400;
              font-size: 14px;
              color: #1a1a1a;
              line-height: 30px;
            }
            p {
              color: #666;
              // line-height: 30px;
            }
          }
          &:hover {
            box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
          }
          &.active {
            background: #ffffff;
            box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
            border: 1px solid #fb3a32;
          }
          .img-tangle {
            position: absolute;
            right: -1px;
            top: -1px;
            width: 20px;
            height: 20px;
            font-size: 0;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .surePrize {
      padding-bottom: 16px;
      .textPrize {
        padding-left: 50px;
        p {
          font-size: 16px;
          color: #1a1a1a;
          padding-bottom: 15px;
        }
        /deep/.el-checkbox__label {
          color: #666;
        }
      }
      .dialog-footer {
        text-align: center;
        margin-top: 20px;
      }
    }
    .prize-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px 0 32px;
      .prize-check {
        span {
          color: #666;
          //  padding-right: 250px;
          b {
            color: #fb3a32;
          }
        }
      }
      .dialog-footer {
      }
    }
  }
</style>
