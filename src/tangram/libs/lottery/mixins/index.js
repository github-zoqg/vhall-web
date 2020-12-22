const mixins = {
  methods: {
    ClearUserList(){
      return new Promise((resolve, reject)=>{
        this.$fetch('v3ClearUserList',{}).then(res=>{
          console.warn(999);
          if(res.code != 200){
            this.$message.warning(res.msg)
          }
          resolve()
        }).catch(err=>{
          resolve()
        })
      })
    },
    checkLottery(){
      this.$fetch('v3CheckLottery', {}).then(res=>{
        if(res.code == 200){
          if(res.data.lottery_status == 0){
            this.lotteryInfo = res.data
            this.prizeShow = true
            this.lotteryContentShow = false
            this.processingObj = {
              url: res.data.icon,
              text: res.data.remark,
              title: res.data.title
            }
            this.processingObj.title = res.data.title
          }else{
            // 未开始抽奖  开始获取可抽奖人数及其他信息
            this.joinLottery = '1'
            this.participationPass = ''
            this.getLotteryCount()
          }
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 获取奖品列表
    getPrizeList(){
      console.warn('wa');
      this.$fetch('v3GetPrizeList', {
        room_id: this.roomId,
        pos: 0,
        limit: 20,
        source: 0
      }).then(res=>{
        if(res.code == 200){
          this.prizeList = res.data.list
          this.prize = res.data.list[1]
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 选择奖品
    prizeChange(val){
      console.warn('选择奖品', val);
      this.prize = val
    },
    // 符合抽奖的人员列表
    getLotteryCount(){
      let _data = {
        room_id: this.roomId,
        lottery_type: this.joinLottery,
        is_repetition: Number(this.repeatWinning),
      }
      if(this.userKeywords){
        _data.keyword = this.userKeywords
      }
      this.$fetch('v3SearchUser', _data).then(res=>{
        if(res.code == 200){
          console.warn('获取符合抽奖的人数',res);
          this.getPrizeCount = res.data.count || 0;
          this.userList = res.data.list
          if(res.data.list.length !=0){
            this.userList = res.data.list.filter((u) => {
              return !this.chooseList.find((c) => {
                return c.account_id == u.account_id;
              });
            });
            this.userListShow = true;
          }
          console.warn(res);
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
    // 开始抽奖
    startReward () {
      if(this.prizeList.length ==0 ){
        this.$message.warning('中奖商品不能为空，请先去控制台进行添加!!!')
        return
      }
      if(this.lotteryResultShow){
        this.getPrizeCount = 0
        this.getLotteryCount()

        this.lotteryResultShow = false
        this.lotteryContentShow = true
        return
      }
      if (this.prizeNum > this.getPrizeCount) {
        this.$message.customerror('中奖人数不可以大于参与抽奖人员数');
        return;
      }
      if (!/^[1-9]\d*$/.test(this.prizeNum)) {
        this.$message.customerror('中奖人数只能为正整数');
        return;
      }
      let deliverId = [];
      if (this.chooseList) {
        this.chooseList.map(item => {
          deliverId.push(item.account_id);
        });
        deliverId = deliverId.join(',');
      } else {
        deliverId = null;
      }
      let _data = {
        room_id: this.roomId,
        lottery_type: this.joinLottery,// 1:全体参会者 2:参与问卷的用户 3:参与签到的用户 8:口令抽奖
        lottery_number: this.prizeNum,  // 中奖人数(正整数)
        lottery_user_ids: deliverId,// 设置中奖用户ID
        is_repetition: Number(this.repeatWinning),  // 是否允许重复中奖1:允许0:不允许
        is_publish: Number(this.WinningList), // 是否公布中奖名单1:公布0:不公布
        prize_id: this.prize.prize_id,// 奖品ID
      }
      if(this.joinLottery == 8){
        //  口令 <=15个字符, lottery_type=8时不能为空
        _data.command = this.participationPass
      }
      console.warn(_data, this.prize);

      this.$fetch('v3CreateLottery', _data).then(res=>{
        if(res.code == 200){
          console.warn('创建抽奖成功',res.data);
          this.lotteryInfo = res.data
          this.lotteryContentShow = false
          this.prizeShow = true
          this.processingObj.url = res.data.icon
          this.processingObj.text = res.data.remark
          this.processingObj.title = this.dialogTitle = res.data.title
          this.prizeObj = res.data.award_snapshoot
        }else{
          this.$message.warning(res.msg)
        }
      })
    },
























    getPrizeList2(){
      console.warn('wa');
    },
    getPrizeList1(){
      console.warn('wa');
      this.$fetch('getPrizeList', {}).then(res=>{
        if(res.code == 200){
          console.warn(res);
        }else{
          this.$message.warning(res.msg)
        }
      })
    }
  },
}
export default mixins
