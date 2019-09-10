const hours = []
const min = []

for (let i = 0; i <= 23; i++) {
  hours.push(i)
}

for (let i = 0; i <= 59; i++) {
  min.push(i)
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showBox: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hours: hours,
    min: min,
    value: [9999, 1, 1],
    aniStyle: true, //动画效果，默认slideup
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {
      const val = e.detail.value
      console.log('vla', val);
      // this.setData({
      //   hours: this.data.hours[val[0]],
      //   min: this.data.min[val[1]]
      // })
    },
    doNoThing: function (e) {
      // console.log(e);
    },
    /**
     * 关闭弹出框
     */
    cancel: function () {
      this.setData({
        aniStyle: false
      })
      setTimeout(() => {
        this.triggerEvent('closeBox');
        this.setData({
          aniStyle: true
        })
      },300);
    }
  }
})
