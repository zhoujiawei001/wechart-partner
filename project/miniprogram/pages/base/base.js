// pages/base/base.js
import { changeSelectTime } from '../../utils/index.js'
import md5 from '../../utils/md5.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1, // 0-关，1-开
    temp: 26,
    minTemp: 16,
    maxTemp: 30,
    mode: 0, // 0-自动，1-除湿，2-送风，3-制热，4-制冷
    modes: ['自动', '除湿', '送风', '制热', '制冷'],
    supportMode: ['自动', '除湿', '制热', '制冷'], // 空调所支持的模式
    speed: 0, // 0-自动，1-低风，2-中风, 3-高风
    speeds: ['自动', '低风', '中风', '高风'],
    supportSpeed: ['低风', '中风', '高风'], // 空调所支持的风速
    isShowModeBox: false, // 控制模式弹出框的变量
    isShowWindBox: false, // 控制风速弹出框变量
    lr: 0, // 0-左右扫风关, 1-左右扫风开
    ud: 0, // 0-上下扫风关，1-上下扫风开
    isShowDelayBox: false, // 控制倒计时弹出框的变量
    delay: 0, // 0-关闭倒计时，1-开启倒计时
    hhmmss: '', // 倒计时 00:00:00
    delayTimer: null, // 倒计时timer
    devList: [], // 设备列表
    devDetails: {}, // 设备详情
    devStatus: {}, // 设备状态
  },
  /**
   * 空调开关
   */
  switchFn: function () {
    this.setData({
      status: !this.data.status
    })
  },
  /**
   * 调整温度
   */
  adjustTemp: function (options) {
    console.log(options.target.dataset.id);
    let $id = options.target.dataset.id;
    if (+$id) {
      if (this.data.temp >= this.data.maxTemp) return
      let $temp = this.data.temp + 1;
      this.setData({
        temp: $temp
      })
    } else {
      if (this.data.temp <= this.data.minTemp) return
      let $temp = this.data.temp - 1;
      this.setData({
        temp: $temp
      })
    }
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
        mode: +$n[1]
      })
    } else {
      this.setData({
        speed: +$n[1]
      })
    }
  },
  /**
   *点击上下扫风
   */
  handleSwingUd: function (e) {
    console.log(232)
    this.setData({
      ud: +!this.data.ud * 1
    })
  },
  /**
   *点击左右扫风
   */
  handleSwingLr: function (e) {
    this.setData({
      lr: +!this.data.lr * 1
    })
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
   * 点击关闭倒计时按钮
   */
  clickCloseDelay: function () {
    clearInterval(this.data.delayTimer);
    this.setData({
      delay: 0,
      delayTimer: null,
      hhmmss: ''
    })
  },
  /**
   * 开启定时器
   */
  openDelayFn: function (e) {
    this.clickCloseDelay();
    const val = e.detail; // 选中的时间
    let curTimestamp = Date.parse(new Date()); // 当前时间戳
    let totalTimestamp = val[0] * 3600000 + val[1] * 60000 + curTimestamp;
    this.setData({
      hhmmss: changeSelectTime(totalTimestamp)
    })
    this.data.delayTimer = setInterval(() => {
      console.log(234);
      let $curTimestamp = Date.parse(new Date())
      this.setData({
        hhmmss: changeSelectTime(totalTimestamp)
      })
      if ($curTimestamp >= totalTimestamp) {
        this.clickCloseDelay();
      }
    }, 1000);
    setTimeout(() => {
      this.setData({
        isShowDelayBox: false,
        delay: 1
      })
    }, 100);
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
        'openId': app.globalData.openId,
        'signature': app.globalData.signature,
        'timeStamp': app.globalData.timeStamp
      },
      success: (res) => {
        console.log(res.data.data);
        this.setData({
          devList: res.data.data
        })
        this.getDevDetails()
      },
      fail(err) {
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
        'openId': app.globalData.openId,
        'signature': app.globalData.signature,
        'timeStamp': app.globalData.timeStamp
      },
      success: res => {
        console.log(res.data.data);
        this.setData({
          devDetails: res.data.data.functions,
          devStatus: res.data.data.state
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 发送信息给设备
   */
  sendDataToDev: function () {
    wx.request({
      method: 'POST',
      url: app.globalData.demain + '/wap/v1/c=ctrlAc',
      data: {
        deviceId: this.data.devList[0].deviceId,
        mode: 1,
        speed: 0,
        temp: 26,
        windUd: 1,
        windLr: 1,
        power: 1
      },
      header: {
        'content-Type': 'application/x-www-form-urlencoded',
        'appId': app.globalData.appId,
        'openId': app.globalData.openId,
        'signature': app.globalData.signature,
        'timeStamp': app.globalData.timeStamp
      },
      success: res => {
        console.log(res);
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      console.log(res);
      let signStr = '94d3b83bd9f00589acac31520664993e' + Date.parse(new Date()) / 1000;
      let $B = md5(signStr);
      let sign = $B.slice(1, 2) + $B.slice(3, 4) + $B.slice(7, 8) + $B.slice(15, 16) + $B.slice(31, 32);
      app.globalData.appId = '94d3b83bd9f00589acac31520664993e';
      app.globalData.openId = res.result.openid;
      app.globalData.signature = sign;
      app.globalData.timeStamp = Date.parse(new Date()) / 1000;
      console.log('app', app.globalData);
      this.getDevList();
      // this.getDevDetails();
    }).catch(err => {
      console.log(err);
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