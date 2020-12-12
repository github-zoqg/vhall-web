<template>
    <div class="infos">
        <p>{{message.nick_name?message.nick_name:''}}</p>
        <template v-if="message.type==='text'">
            <p>{{message.text_content||message.data}}</p>
        </template>
        <template v-else-if="message.type==='image'">
            <img v-for="(item, ind) in message.image_urls" :src="item" alt="" :key="ind"
                 @click="infoClick(item, message.type)">
            <span v-if="message.text_content||message.data">{{message.text_content||message.data}}</span>
        </template>
        <template v-else-if="message.type==='link'">
            <a :href="message.link_url" target="_blank">{{message.link_url}}</a>
        </template>
        <template v-else-if="message.type==='voice'">
            <audio controls>
                <source :src="message.voice_url" type="audio/mpeg">
                您的浏览器不支持 audio 元素。
            </audio>
        </template>
        <template v-else-if="message.type==='video'">
            <p class="video" alt="" @click="infoClick(message.video_url, message.type)">
                视频消息：{{message.video_url}}</p>
        </template>
        <p>{{message.time||message.date_time}}</p>

        <div class="modal-bg" v-if="isModalShow" @click="isModalShow=false">
            <div id="imgModal" @click.stop="">
                <div class="head">
                <span class="close el-icon-close" @click="isModalShow=false">
                </span>
                </div>
                <div class="content">
                    <template v-if="msgDetail.type==='image'">
                        <img :src='msgDetail.url' alt="">
                    </template>
                    <template v-if="msgDetail.type==='video'">
                        <video width="300" height="240" controls="controls" autoplay="autoplay">
                            <source :src="msgDetail.url" type="video/mp4"/>
                        </video>
                    </template>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  name: 'message',
  props: {
    message: Object
  },
  data () {
    return {
      isModalShow: false,
      msgDetail: {
        url: '',
        type: ''
      }
    }
  },
  methods: {
    infoClick (url, type) {
      this.msgDetail.url = url
      this.msgDetail.type = type
      this.isModalShow = true
    }
  }
}
</script>

<style scoped lang="less">
    .infos {
        width: calc(100% - 240px);
        padding: 15px 0 3px;
        flex: 1;
        margin-right: 20px;

        p {
            font-size: 14px;
            word-break: break-all;
            word-wrap: break-word;
            margin-bottom: 5px;
        }

        img {
            display: inline-block;
            width: 30px;
            cursor: pointer;
            margin-right: 10px;
        }

        .video {
            cursor: pointer;
        }
    }
    #imgModal {
        width: 790px;
        /*height: 380px;*/
        background-color: #F3F3F3;
        position: fixed;
        top: calc(50% - 250px);
        left: calc(50% - 395px);
        z-index: 5;

        .head {
            position: relative;
            /*height: 30px;*/
            background-color: #F3F3F3;
        }

        .close {
            display: inline-block;
            position: absolute;
            bottom: -38px;
            right: 5px;
            padding: 6px;
            cursor: pointer;
            color: #D8D8D8;
            font-size: 24px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
        }

        img {
            width: 100%;
            max-height: 500px;
            cursor: default;
            /*height: 300px;*/
        }
    }

    .modal-bg {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background:rgba(51, 51, 51, 0.2);
        z-index: 4;
    }

</style>
