// pages/base/base.js
import { changeSelectTime } from '../../utils/index.js'
import md5 from '../../utils/md5.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minTemp: 16,
    maxTemp: 30,
    modes: ['自动', '除湿', '送风', '制热', '制冷'],
    supportMode: ['自动', '除湿', '制热', '制冷'], // 空调所支持的模式
    speeds: ['自动', '低风', '中风', '高风'],
    supportSpeed: ['低风', '中风', '高风'], // 空调所支持的风速
    isShowModeBox: false, // 控制模式弹出框的变量
    isShowWindBox: false, // 控制风速弹出框变量
    isShowDelayBox: false, // 控制倒计时弹出框的变量
    hhmmss: '', // 倒计时 00:00:00
    delayTimer: null, // 倒计时timer
    devList: [], // 设备列表
    deviceId: '', // 设备ID
    devDetails: {}, // 设备详情
    devStatus: {
      power: 1,
      temp: 26,
      mode: 0, // 0-自动，1-除湿，2-送风，3-制热，4-制冷
      speed: 0, // 0-自动，1-低风，2-中风, 3-高风
      windLr: 1, // 0-不支持, 1-左右扫风开，2-关
      windUd: 1 // 0-不支持, 1-上下扫风开，2-关
    }, // 设备状态
    delayOff: {
      id: 5,
      type: 2,
      runtime: 0,
      lifetime: 0,
      state: 0,
      repeatDay: ''
    }, // 倒计时关
    delayOn: {
      id: 0,
      type: 1,
      runtime: 0,
      lifetime: 0,
      state: 0,
      repeatDay: ''
    }, // 定时开，开多久关闭
  },
  /**
   * 空调开关
   */
  switchFn: function () {
    this.setData({
      ['devStatus.power']: +!this.data.devStatus.power
    })
    let params = {
      deviceId: this.data.deviceId,
      ...this.data.devStatus
    }
    this.sendDataToDev(params);
  },
  /**
   * 调整温度
   */
  adjustTemp: function (options) {
    let $id = options.target.dataset.id;
    if (+$id) {
      if (this.data.devStatus.temp >= this.data.maxTemp) return
      let $temp = +this.data.devStatus.temp + 1;
      this.setData({
        ['devStatus.temp']: $temp
      })
    } else {
      if (this.data.devStatus.temp <= this.data.minTemp) return
      let $temp = +this.data.devStatus.temp - 1;
      this.setData({
        ['devStatus.temp']: $temp
      })
    }
    let params = {
      deviceId: this.data.deviceId,
      ...this.data.devStatus
    }
    this.sendDataToDev(params);
  },
  /**
   * 点击模式引出弹出框
   */
  clickMode: function () {
    this.setData({
      isShowModeBox: true
    })
  },
  /**
   * 点击风速引出弹出框
   */
  clickWind: function () {
    this.setData({
      isShowWindBox: true
    })
  },
  /**
   * 关闭模式弹出框
   */
  closeBoxModeFn: function () {
    this.setData({
      isShowModeBox: false
    })
  },
  /**
   * 关闭风速弹出框
   */
  closeBoxWindFn: function () {
    this.setData({
      isShowWindBox: false
    })
  },
  /**
   * 获取选中的条目
   */
  handleSelectItem: function (e) {
    console.log(e.detail)
    let $n = e.detail.split('-');
    console.log($n);
    if ($n[0] === 'mode') {
      this.setData({
        ['devStatus.mode']: +$n[1]
      })
    } else {
      this.setData({
        ['devStatus.speed']: +$n[1]
      })
    }
    let params = {
      deviceId: this.data.deviceId,
      ...this.data.devStatus
    }
    this.sendDataToDev(params);
  },
  /**
   *点击上下扫风
   */
  handleSwingUd: function (e) {
    console.log(232)
    this.setData({
      ['devStatus.windUd']: this.data.devStatus.windUd === 1? 2:1
    })
    let params = {
      deviceId: this.data.deviceId,
      ...this.data.devStatus
    }
    this.sendDataToDev(params);
  },
  /**
   *点击左右扫风
   */
  handleSwingLr: function (e) {
    this.setData({
      ['devStatus.windLr']: this.data.devStatus.windLr === 1? 2:1
    })
    let params = {
      deviceId: this.data.deviceId,
      ...this.data.devStatus
    }
    this.sendDataToDev(params);
  },
  /**
   * 点击倒计时关
   */
  handleDelay: function () {
    this.setData({
      isShowDelayBox: true
    })
  },
  /**
   * 关闭倒计时关弹出框
   */
  closeBoxDelayFn: function () {
    this.setData({
      isShowDelayBox: false
    })
  },
  /**
   * 点击倒计时关弹框确定
   */
  clickDelaySure: function (e) {
    const val = e.detail; // 选中的时间
    let curTimestamp = Date.parse(new Date()); // 当前时间戳
    let totalTimestamp = val[0] * 3600000 + val[1] * 60000 + curTimestamp; // 将来要执行的绝对时间
    /** 如果倒计时id为0则是创建，id非0则是编辑 **/
    console.log(this.data.delayOff);
    if (this.data.delayOff.id) {
      console.log('编辑倒计时关');
      this.editDelay(totalTimestamp / 1000);
    } else {
      console.log('创建倒计时关')
      this.createDelay(totalTimestamp / 1000);
    }
  },
  // 编辑倒计时关
  editDelay: function (runtime) {
    wx.request({
      method: 'POST',
      url: app.globalData.demain + '/wap/v1/timerEdit',
      data: {
        id: this.data.delayOff.id,
        runtime: runtime,
        lifetime: 0,
        repeatDay: '',
        state: 1
      },
      header: {
        'appId': app.globalData.appId,
        'token': app.globalData.openId,
        'signature': app.getSign(1),
        'timeStamp': app.getSign(0)
      },
      success: res => {
        console.log('editDelay', res.data.errorCode);
        if (res.data.errorCode === 0) {
          this.getDevDetails();
        }
        setTimeout(() => {
          this.setData({
            isShowDelayBox: false
          })
        }, 100)
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  // 创建倒计时关
  createDelay: function (runtime) {
    wx.request({
      method: 'POST',
      url: app.globalData.demain + '/wap/v1/timerAdd',
      data: {
        deviceId: this.data.deviceId,
        type: 2,
        runtime: runtime,
        lifetime: 0,
        repeatDay: ''
      },
      header: {
        'appId': app.globalData.appId,
        'token': app.globalData.openId,
        'signature': app.getSign(1),
        'timeStamp': app.getSign(0)
      },
      success: res => {
        console.log('createDelay', res.data.errorCode);
        if (res.data.errorCode === 0) {
          this.getDevDetails();
        }
        setTimeout(() => {
          this.setData({
            isShowDelayBox: false
          })
        }, 100)
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 判断倒计时关是否能开启
   */
  judgeDelayIsOpen: function (obj) {
    if (obj.state) {
      clearInterval(this.data.delayTimer);
      let curTimestamp = Date.parse(new Date());
      let totalTimestamp = obj.runtime * 1000;
      this.setData({
        hhmmss: changeSelectTime(totalTimestamp)
      })
      this.data.delayTimer = setInterval(() => {
        console.log(345);
        let $curTimestamp = Date.parse(new Date());
        this.setData({
          hhmmss: changeSelectTime(totalTimestamp)
        })
        if ($curTimestamp >= totalTimestamp) {
          clearInterval(this.data.delayTimer);
          this.setData({
            ['delayOff.state']: 0,
            hhmmss: '',
            delayTimer: null
          })
        }
      }, 1000);
    } else {
      clearInterval(this.data.delayTimer);
      this.setData({
        hhmmss:'',
        delayTimer: null
      })
    }
  },
  /**
   * 关闭倒计时关
   */
  closeDelayOff: function () {
    wx.request({
      method: 'POST',
      url: app.globalData.demain + '/wap/v1/timerEdit',
      data: {
        id: this.data.delayOff.id,
        runtime: 0,
        lifetime: 0,
        repeatDay: '',
        state: 0
      },
      header: {
        'appId': app.globalData.appId,
        'token': app.globalData.openId,
        'signature': app.getSign(1),
        'timeStamp': app.getSign(0)
      },
      success: res => {
        console.log('closeDelayOff', res.data.errorCode);
        if (res.data.errorCode === 0) {
          this.getDevDetails();
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /***************************** 数据类 *****************************/
  /**
   * 获取设备列表
   */
  getDevList: function () {
    wx.request({
      url: app.globalData.demain + '/wap/v1/remotes', //仅为示例，并非真实的接口地址
      header: {
        'appId': app.globalData.appId,
        'token': app.globalData.openId,
        'signature': app.getSign(1),
        'timeStamp': app.getSign(0)
      },
      data: {
        macs: 'DC4F22529F13'
      },
      success: (res) => {
        console.log('getDevList_res', res.data.errorCode);
        let code = res.data.errorCode;
        if (code === 0) {
          this.setData({
            devList: res.data.data,
            deviceId: res.data.data[0].deviceId
          })
          app.globalData.deviceId = res.data.data[0].deviceId;
          this.getDevDetails()
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  /**
   * 获取设备详情
   */
  getDevDetails: function () {
    wx.request({
      url: app.globalData.demain + '/wap/v1/remoteAc',
      data: {
        deviceId: this.data.devList[0].deviceId
      },
      header: {
        'appId': app.globalData.appId,
        'token': app.globalData.openId,
        'signature': app.getSign(1),
        'timeStamp': app.getSign(0)
      },
      success: res => {
        console.log('getDevDetails_code', res.data.errorCode);
        let code = res.data.errorCode;
        let $res = res.data.data;
        if (code === 0) {
          this.setData({
            devDetails: $res.functions,
            devStatus: $res.state,
            delayOn: $res.timers.filter(item => item.type === 1)[0],
            delayOff: $res.timers.filter(item => item.type === 2)[0]
          })
          app.globalData.delayOn = $res.timers.filter(item => item.type === 1)[0];
          console.log('$res.timer', $res.timers.filter(item => item.type === 2)[0].state);
          this.judgeDelayIsOpen(this.data.delayOff);
        }
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 发送信息给设备
   */
  sendDataToDev: function (params) {
    console.log('sendBody', params);
    wx.request({
      method: 'POST',
      url: app.globalData.demain + '/wap/v1/ctrlAc',
      data: params,
      header: {
        'appId': app.globalData.appId,
        'token': app.globalData.openId,
        'signature': app.getSign(1),
        'timeStamp': app.getSign(0)
      },
      success: res => {
        console.log('sendBody_code', res.data.errorCode);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 通过md5处理获取sign
   */
  // getSign: function (val) {
  //   let $timestamp = Date.parse(new Date()) / 1000;
  //   let signStr = '94d3b83bd9f00589acac31520664993e' + $timestamp;
  //   let $B = md5(signStr);
  //   let sign = $B.slice(1, 2) + $B.slice(3, 4) + $B.slice(7, 8) + $B.slice(15, 16) + $B.slice(31, 32);
  //   if (val) {
  //     return sign;
  //   } else {
  //     return $timestamp;
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res);
      app.globalData.appId = '94d3b83bd9f00589acac31520664993e';
      app.globalData.openId = res.result.openid;
      app.globalData.signature = app.getSign(1);
      app.globalData.timeStamp = app.getSign(0);
      console.log('app', app.globalData);
      this.getDevList();
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 跳去定时开页面
   */
  goToTimer: function () {
    wx.navigateTo({
      url: '../timer/timer',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})