<template>
    <div class="btn-box-authChat">
        <button class="butt pass" @click="messageOperate(1)">通过</button>
        <button class="butt stop" @click="messageOperate(2)">阻止</button>
        <button class="butt disable-msg" @click="operateUser(3)"  v-if="baseChanelInfo.third_party_user_id!=message.third_party_user_id">禁言</button>
        <button class="butt kick-out" @click="operateUser(4)" v-if="baseChanelInfo.third_party_user_id!=message.third_party_user_id">踢出</button>
        <button class="butt replay" @click="replay">通过并回复</button>
        <div tabindex="-1" role="dialog" aria-modal="true" aria-label="通过并回复" class="el-message-box__wrapper" v-if="isRepaly"
             style="z-index: 2001;">
            <div class="el-message-box">
                <div class="el-message-box__header">
                    <div class="el-message-box__title">
                        <span>通过并回复</span></div>
                    <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="replay">
                        <i class="el-message-box__close el-icon-close"></i></button>
                </div>
                <div class="el-message-box__content">
                    <div class="el-message-box__message"><p>请输入回复信息</p></div>
                    <div class="el-message-box__input" style="">
                       <el-input v-model="replayData.text_content"></el-input>
                        <div class="el-message-box__errormsg" :style="`visibility:${replyError ? 'visible' : 'hidden'}`" ref="replyError">{{ replyError }}</div>
                    </div>
                </div>
                <div class="el-message-box__btns">
                    <button type="button" class="el-button el-button--default sure" @click="sureRepaly">
                        <span>确定</span>
                    </button>
                    <button type="button" class="el-button el-button--default cancel" @click="replay">
                        <span>取消</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="v-modal" tabindex="0" style="z-index: 1999;" v-if="isRepaly" @click="replay"></div>
    </div>
</template>

<script>
export default {
  name: 'btn-box',
  data () {
    return {
      isRepaly: false,
      replayData: {
        type: 'text',
        access_audit: 1,
        text_content: ''
      },
      replyError: ''
    }
  },
  props: {
    roomInfo: Object,
    message: Object,
    baseChanelInfo: Object,
    roleName: String
  },
  watch: {
    replayData: {
      handler (newValue) {
        const value = newValue.text_content ? newValue.text_content.trim() : ''
        if (value && value.length > 140) {
          this.replyError = '回复内容字数限制为140个字'
        } else {
          this.replyError = ''
        }
      },
      deep: true
    }
  },
  methods: {
    // 踢出/踢出
    operateUser (ind) {
      let _url
      if (ind === 3) _url = 'banned'
      else _url = 'kicked'
      let params = {
        ...this.roomInfo,
        receive_account_id: this.message.third_party_user_id,
        status: 1
      }
      // this.$emit('operateUser', _url, params)
      this.$fetch(_url, params).then(res => {
        if (res.code === 200) {

        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 回复
    replay () {
      this.isRepaly = !this.isRepaly
      this.replayData = {
        type: 'text',
        access_audit: 1,
        text_content: ''
      }
    },
    sureRepaly () {
      let user = JSON.parse(sessionStorage.getItem('user'))
      let context = {
        nickname: user.nickname || user.nick_name,
        avatar: user.avatar,
        role_name: this.roleName,
        replyMsg: {...this.message, nickName: this.message.nick_name, content: {text_content: this.message.text_content, type: 'text'}}
      }
      if (this.replyError) return
      if (!this.replayData.text_content) {
        this.replyError = '回复内容不能为空'
        return
      }
      this.messageOperate(1)
      window.chatSend.emit(this.replayData, context)
      this.isRepaly = false
    },
    // 通过/阻止单条信息
    messageOperate (s, item) {
      console.log(this.message)
      let params = {
        ...this.baseChanelInfo,
        msg_id: this.message.msg_id,
        status: s
      }
      this.fetchOperate(params)
    },
    fetchOperate (params) {
      this.$emit('fetchOperate', params)
    }
  },
  mounted () {
    // this.getRoomInfo()
    console.log('this.message', this.message)
  }
}
</script>

<style lang="less" scoped>
    .btn-box-authChat {
        .butt {
            width: 58px;
            height: 32px;
            border: 1px solid #D9D9D9;
            border-radius: 2px;
            outline: none;
            cursor: pointer;
            color: #666666;
            font-size: 14px;
            background-color: #fff;

            &:hover {
                background-color: #FC5659;
                border: 1px solid #FC5659;
                color: #fff;
            }

            &:focus {
                background-color: #FC5659;
                border: 1px solid #FC5659;
                color: #fff;
            }
            &:focus {
                background-color: #e24d4f;
                border: 1px solid #e24d4f;
                color: #fff;
            }

            &.pass {
                background-color: #FC5659;
                border: 1px solid #FC5659;
                color: #fff;

                &:hover {
                    background-color: #FC7b78;
                    border: 1px solid #FC7b78;
                    color: #fff;
                }
            }
            &.replay{
              width: 100px;
            }
        }

        .el-message-box {
            border-top: 0;
            .el-message-box__header {
                border-top: 3px solid #FC5659;
                color: #666;
                font-weight: 500;
            }

            .el-message-box__title {
                font-size: 14px;
            }

            .el-message-box__message {
                color: #666;
                font-size: 14px;
            }

            .el-input ::v-deep input {
                border: 1px solid #D2D2D2;

                &:focus {
                    border: 1px solid #999;
                }
            }

            .el-message-box__btns {
                text-align: center;

                button {
                    width: 80px;
                    height: 30px;
                    border-radius: 2px;
                    font-size: 12px;
                    background-color: #fff;
                    padding: 0;
                    &:hover {
                        border: 1px solid #fc5659;
                        background-color: #fc5659;
                        color: #FFF;
                    }
                }

                .sure {
                    border: 1px solid #ff3333;
                    color: rgba(255, 51, 51, 1);;
                }

                .cancel {
                    border: 1px solid #666;
                    color: #666;
                }

            }
        }

        .v-modal {
            background-color: transparent;
        }
    }

</style>
