// pages/base/base.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 1, // 0-关，1-开
    temp: 26,
    minTemp: 16,
    maxTemp: 30,
    isShowModeBox: false, // 控制模式弹出框的变量
    isShowWindBox: false, // 控制风速弹出框变量
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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