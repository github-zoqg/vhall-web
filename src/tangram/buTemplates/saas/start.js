export default {
  methods: {
    v3Getbroadcast(){
      // 获取转播列表
      console.warn('进入到获取转播列表');
      this.$fetch('rebroadcastList', {
        webinar_id: this.webinar_id,
      }).then(res=>{
        console.warn('v3Getbroadcast', res);
      }).catch(err=>{
        console.warn(err);
      });
    },
    v3RebroadcastStart(){
      this.$fetch('v3RebroadcastStart', {
        webinar_id: this.webinar_id,
        source_id: ''
      }).then(res=>{
        console.warn('v3RebroadcastStart', res);
      }).catch(err=>{
        console.warn('v3RebroadcastStart', err);
      });
    },
    v3RebroadcastStop(){
      this.$fetch('v3RebroadcastStop', {
        webinar_id: this.webinar_id, // 活动ID
        source_id: '' //  被转播的活动ID
      }).then(res=>{
        console.warn('v3RebroadcastStop', res);
      }).catch(err=>{
        console.warn('v3RebroadcastStop', err);
      });
    }
  },
};
