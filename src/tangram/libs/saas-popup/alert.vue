<template>
  <div class="vhall-alert-wrap" v-show="visible">
    <div class=" popup " >
      <div class="recordboxHeader">
        <span>{{title || $t('message.tipText')}}</span>
        <a href="javascript:;" @click="onClose" class="iconfont iconguanbi1" ></a>
      </div>
      <div class="popbody">
        <p class="f-12 tips" style="margin: 10px auto 24px;text-align: center;">
          <slot name="content"></slot>
        </p>
        <p class="btnsbox" v-if="confirm">
          <a class="confirm" href="javascript:;" @click="onSubmit">{{confirmText || $t('message.confirmText')}}</a>
          <a class=" cancel" href="javascript:;" @click="onCancel" >{{cancelText || $t('message.cancelText')}}</a>
        </p>
        <p  class="btnsbox" v-else-if="retry" >
          <a class=" cancel" href="javascript:;" @click="onSubmit" >{{ retry || $t('message.retryText')}}</a>
        </p>
        <p  class="btnsbox" v-else >
          <a class=" cancel" href="javascript:;" @click="onClose" >{{ knowText || $t('message.knowText')}}</a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popup',
  props: {
    visible: {
      type: Boolean
    },
    title: {
      required: false
    },
    confirm: {
      required: false
    },
    knowText: {
      required: false
    },
    retry: {
      required: false
    },
    confirmText: {
      required: false
    },
    cancelText: {
      required: false
    }
  },
  methods: {
    onClose () {
      this.$emit('onClose');
    },
    onCancel () {
      this.$emit('onCancel');
    },
    onSubmit () {
      this.$emit('onSubmit');
    }
  }
};
</script>
<style lang="less">
 .vhall-alert-wrap {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: rgba(0, 0, 0, 0.5);
   z-index: 1200;
   align-items: center;
   display: flex;
   justify-content: center;
   * {
     box-sizing: border-box;
   }
   .popup {
     width: 400px;
     border-top: 3px solid #FC5659;
     box-shadow: 0 1px 2px 0 rgba(0,0,0,0.10), 0 4px 8px 0 rgba(0,0,0,0.20);
     border-radius: 0 0 2px 2px;
     background-color: #fff;
     .recordboxHeader {
       position: relative;
       padding: 10px 20px;
       font-size: 14px;
       .iconguanbi1 {
         position: absolute;
         top: 10px;
         color: #666;
         font-size: 12px;
         right: 10px;
       }
     }
     .popbody {
       font-size: 12px;
       line-height: 2;
       padding-top: 0px;
       padding-bottom: 25px;
       padding: 4px 27px 20px;
       .content {
         margin: 10px auto 24px;
         text-align: center;
       }
       .btnsbox {
         text-align: center;
         a {
           display: inline-block;
           padding: 0;
           width: 90px;
           height: 30px;
           line-height: 29px;
           border-radius: 2px;
           border-color: #999;
           border: 1px solid #d2d2d2;
           display: inline-block;
           margin-bottom: 0;
           font-size: 12px;
           color: #666;
           font-weight: 400;
           text-align: center;
           &.confirm {
             background: #fff;
             border-color: #fc5659;
             color: #fc5659;
             &:hover {
               background: #fc5659;
               border-color: #fc5659;
               color: white;
             }
           }
           &.cancel {
             margin-left: 10px;
             &:hover {
               background: #fc5659;
               border-color: #fc5659;
               color: white;
             }
           }
         }
       }
     }
   }
  }
.vhall-dialog-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1200;
  align-items: center;
  display: flex;
  justify-content: center;
  * {
    box-sizing: border-box;
  }

}
</style>
