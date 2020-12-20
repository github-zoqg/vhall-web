<template>
  <div class="vhall-question-box">
    <div
      class="vhall-question__content"
      v-show="!showPreview && !isCreate && questionShow"
    >
      <div class="popbody">
        <ul
          class="vhall-question__content-list"
          id="surveyslist"
          v-if="docList.length"
        >
          <li class="vhall-question__content-list__title">
            <span class="vhall-question__content-list__colmun-title">问卷标题</span>
            <span class="vhall-question__content-list__colmun-time">更新时间</span>
            <span class="vhall-question__content-list__colmun-source">来源</span>
            <span class="vhall-question__content-list__colmun-action">操作</span>
          </li>
          <li v-for="doc in docList" :key="doc.question_id">
            <span class="vhall-question__content-list__colmun-title">{{
              doc.title
            }}</span>
            <span class="vhall-question__content-list__colmun-time">{{
              doc.updated_at
            }}</span>
            <span class="vhall-question__content-list__colmun-source">{{
              doc.bind == 1 ? '当前直播' : '资料库'
            }}</span>
            <span class="vhall-question__content-list__colmun-action">
              <el-tooltip effect="dark" content="发送" placement="bottom" :open-delay="600">
                <span class="item">
                  <a
                    class="vhall-question__content-list__colmun-action--send"
                    @click="publish(doc.question_id, doc)"
                  ></a>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="预览" placement="bottom" :open-delay="600">
                <span class="item">
                  <a
                    class="vhall-question__content-list__colmun-action--preview"
                    @click="preview(doc.question_id, doc)"
                  ></a>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="bottom" :open-delay="600">
                <span class="item" >
                  <a
                    class="vhall-question__content-list__colmun-action--editor"
                    @click="createQuestion(doc.question_id)"
                  ></a>
                </span>
              </el-tooltip>
              <el-tooltip effect="dark" content="详情" placement="bottom" :open-delay="600">
                <span
                  v-if="doc.is_public == 0 && !isEmbed && roleName == '1'"
                >
                  <a
                    class="vhall-question__content-list__colmun-action--detail"
                    @click="goDetail(doc.question_id)"
                  ></a>
                </span>
              </el-tooltip>
            </span>
          </li>
        </ul>
        <p class="text-center show-no-msg" v-if="docList.length == 0">
          <span class="no-msg">您还没有创建过问卷！</span>
        </p>

        <p
          class="creatBtn"
          style="height: 50px;border-top:1px solid #e5e5e5; text-align: center;"
        >
          <a class="vhall-question-btn" target="_blank" @click="createQuestion('')"
            >创建问卷</a
          >
        </p>
      </div>
    </div>

    <!-- 预览 -->
    <div id="qs-preview-box" class="vhall-list-dialog-content" v-show="showPreview">
      <div class="qs-preview-box-content cef-q-wrap" id="qs-preview-box-content"></div>
      <div class="btn-container">
        <button class="btn vhall-question-btn small blue-line" @click="publishPreview()">
          发布
        </button>
        <button class="btn vhall-question-btn small blue-line" @click="exitPreview()">
          返回
        </button>
      </div>
    </div>
    <!-- 创建 -->
    <div id="qs-create-box" v-show="isCreate">
           <!-- <div class="black" @click="blackCreate">返回</div> -->
    </div>
  </div>
</template>
<script src="./bu-question.js"></script>

<style lang="less">
#qs-preview-box {
  height: 500px;
  overflow: auto;
  background: #fff;
  .btn-container {
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    .vhall-question-btn {
      margin: 20px;
      display: block;
      width: 140px;
    }
  }
}
#qs-create-box {
  height: 500px;
  background: #fff;
  overflow: auto;
  .goback-btn{
    display: none;
  }
}
.vhall-question__content {
  height: 500px;
  overflow: hidden;
  background: #fff;
  &.assistantStyle {
    height: 420px;
  }
  &-title {
    height: 42px;
    line-height: 42px;
    background: #fff;
  }
  .popbody {
    height: 100%;
    .vhall-question__content-list {
      height: 450px;
      &.assistantStyle {
        height: 370px;
      }
      overflow-y: scroll;
      li {
        display: flex;
      }
    }
    .creatBtn {
      height: 50px;
      line-height: 50px;
    }
    .vhall-question__content-list__colmun-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &-list {
    font-size: 12px;
    color: #666;
    li {
      height: 40px;
      line-height: 40px;
      padding-left: 40px;
      padding-right: 15px;
      &:nth-child(odd) {
        background: #f8f8f8;
      }
      span {
        display: inline-block;
      }
    }
    &__colmun-title {
      width: 264px;
      padding-right: 50px;
    }

    &__colmun-time {
      width: 160px;
    }

    &__colmun-source {
      width: 130px;
    }

    &__colmun-action {
      width: 180px;
      a {
        display: inline-block;
        width: 36px;
        height: 20px;
        vertical-align: middle;
      }

      &--send {
        background: url(./imgs/fq.png) no-repeat;
        background-size: 100%;
        &:hover {
          background: url(./imgs/fq-hover.png) no-repeat;
          background-size: 100%;
        }
      }
      &--preview {
        background: url(./imgs/yl.png) no-repeat;
        background-size: 100%;
        &:hover {
          background: url(./imgs/yl-hover.png) no-repeat;
          background-size: 100%;
        }
      }
      &--editor {
        background: url(./imgs/xg.png) no-repeat;
        background-size: 100%;
        &:hover {
          background: url(./imgs/xg-hover.png) no-repeat;
          background-size: 100%;
        }
      }
      &--detail {
        background: url(./imgs/xq.png) no-repeat;
        background-size: 100%;
        &:hover {
          background: url(./imgs/xq-hover.png) no-repeat;
          background-size: 100%;
        }
      }
    }
  }

  &-list__title {
    height: 40px;
    line-height: 40px;
  }

  .vhall-question-btn {
    background-color: #fff;
    border: 1px solid #fc5659;
    color: #fc5659;
    font-size: 12px;
    width: 100px;
    height: 30px;
    box-sizing: border-box;
    border-radius: 2px;
    padding: 0;
    line-height: 26px;
    display: inline-block;
    cursor: pointer;
    &:hover {
      background: #f34b46;
      color: #fff;
    }
  }
  .show-no-msg {
    line-height: 50px;
    text-align: center;
  }
}
#qs-create-box {
  .question-edit-wrap {
    margin: 10px 20px 20px;
    .question-bottom {
      & > .el-button {
        line-height: 0px !important;
      }
    }
  }
  .black {
    font-size: 12px;
    height: 30px;
    line-height: 28px;
    width: 80px;
    border: solid 1px #999999;
    border-radius: 2px;
    background-color: #fff;
    color: #666;
    outline: none;
    cursor: pointer;
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    text-decoration: none;
    text-align: center;
    float: right;
    top: 50px;
    right: 37px;
    z-index: 100;
    &:hover {
      color: #fff;
      border: 1px solid #fc5659;
      background-color: #fc5659;
    }
  }
}
#qs-preview-box-content {
  .vhall-question-title {
    overflow-x: hidden;
  }
}
.q-wrap{
  padding-bottom: 30px;
}
.cef-q-wrap{
  .q-wrap{
      overflow-y: hidden;
    }
}
</style>
