export default {
  methods: {
    getbroadcast(){
      this.$fetch('rebroadcastList', {
        webinar_id: this.webinar_id,
      }).then(res=>{
        console.log(res, '转播列表');
      }).catch(err=>{
        console.warn(err);
      });
    }
  },
};
