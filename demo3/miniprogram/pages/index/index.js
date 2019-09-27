//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    isLoading: false,
    inputVal: ''
  },
  // 获取macs地址
  getMac: function (e) {
    app.globalData.macs = e.detail.value;
  },
  // 进入Test程序
  goToTest: function () {
    if (app.globalData.macs) {
      this.setData({
        isLoading: true
      })
      wx.cloud.callFunction({
        name: 'login'
      }).then(res => {
        app.globalData.token = res.result.openid;
        this.addWhiteList();
      }).catch(err => {
        this.setData({
          isLoading: false
        })
        console.log('err', err);
      })
    } else {
      wx.showToast({
        title: '请输入mac地址',
        image: '../../images/warn.png'
      })
    }
  },
  // macs加入白名单
  addWhiteList: function () {
    wx.request({
      url: 'https://mpapi.yaokantv.com/wap/v1/auth',
      header: {
        appId: app.globalData.appId,
        token: app.globalData.token,
        signature: app.getSign(1),
        timestamp: app.getSign(0)
      },
      data: {
        macs: app.globalData.macs
      },
      success: res => {
        this.setData({
          isLoading: false
        })
        console.log('res', res);
        console.log('appid', app.globalData.appId, app.globalData.token, app.globalData.macs);
        wx.setStorage({
          key: 'k_mac',
          data: app.globalData.macs,
          success: res => {
            console.log('setStorage_suc', res);
          },
          fail: err => {
            console.log('setStorage_fail', err);
          }
        })
        let code = res.data.errorCode;
        let msg = res.data.message;
        if (code === 0) {
          wx.navigateToMiniProgram({
            appId: 'wx0a40806ad805a09c',
            path: 'pages/base/base',
            extraData: {
              appId: app.globalData.appId,
              token: app.globalData.token,
              macs: app.globalData.macs
            },
            envVersion: 'trial',
            success(res) {
              // 打开成功
              console.log('跳转成功过', res);
            },
            fail(err) {
              console.log('跳转失败', err);
            }
          })
        } else {
          // app.globalData.token = 'oaudd5Xk70stFxWAXglGEgLrUaHI';
          wx.showToast({
            title: msg,
            image: '../../images/warn.png'
          })
          // console.log('appid',app.globalData.appId, app.globalData.token, app.globalData.macs);
          // wx.navigateToMiniProgram({
          //   appId: 'wx0a40806ad805a09c',
          //   path: 'pages/base/base',
          //   extraData: {
          //     appId: app.globalData.appId,
          //     token: app.globalData.token,
          //     macs: app.globalData.macs
          //   },
          //   envVersion: 'trial',
          //   success(res) {
          //     // 打开成功
          //     console.log('跳转成功过', res);
          //   }
          // })
        }
      },
      fail: err => {
        this.setData({
          isLoading: false
        })
        console.log('err', err);
      }
    })
  },
  onLoad: function () {
    wx.getStorage({
      key: 'k_mac',
      success: res => {
        console.log(res.data)
        if (res.data) {
          this.setData({
            inputVal: res.data
          })
          app.globalData.macs = res.data;
        }
      },
    })
  }
})
