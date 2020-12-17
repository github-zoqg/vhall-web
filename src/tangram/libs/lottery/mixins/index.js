const mixins = {
  methods: {
    // 获取奖品列表
    getPrizeList(){
      console.warn('wa');
      this.$fetch('getPrizeList', {
        room_id: this.roomId,
        pos: 0,
        limit: 20,
        source: 0
      }).then(res=>{
        if(res.code == 200){
          console.warn(res.data.list, '奖品列表');
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
          // this.lotteryInfo = res.data;
          // this.lotteryContentShow = false;
          // this.prizeShow = true;
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
        }else{
          this.$message.warning(res.msg)
        }
      })
      // this.$vhallFetch('add',).then(res => {
      //   this.startButtonDisabled = false;
      //   if (res.code === 200) {
      //     console.log(res, 'res------');
      //     this.lotteryInfo = res.data;
      //     this.lotteryContentShow = false;
      //     this.prizeShow = true;
      //     this.disTimeSet = setInterval(() => {
      //         this.disabledTime--;
      //       if(this.disabledTime<=0){
      //         clearInterval(this.disTimeSet);
      //       }
      //     }, 1000);
      //     console.log('dialogtitle>>>>>>>>>>>>>', this.dialogTitle);
      //     this.dialogTitle = '趣味抽奖！';
      //     this.closeShow = false;
      //   }
      // }).catch(() => {
      //   this.startButtonDisabled = false;
      // });
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
