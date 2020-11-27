const qqShare = {
  methods: {
    QQShare(data) {
      window.mqq.invoke('data', 'setShareInfo', {
        share_url: data.link,
        title: data.title || '微吼直播',
        desc: data.desc || '微吼直播',
        image_url: data.imgUrl
      });
    }
  }
};
export default qqShare;
