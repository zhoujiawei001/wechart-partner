// components/fadeUp/fadeUp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    boxShow: {
      type: Boolean,
      value: false
    },
    propType: {
      type: String,
      value: 'mode'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    aniStyle: true, //动画效果，默认slideup
    boxList: ['自动', '除湿', '送风', '制热', '制冷']
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //蒙层的显示
    close: function (e) {
      this.setData({
        aniStyle: false
      })
      setTimeout(() => {
        this.triggerEvent('closebox', false);
        this.setData({
          aniStyle: true
        })
      }, 300);
    },
    /**
     * 选中选项
     */
    handleItem: function (e) {
      this.triggerEvent('selectedItem', this.data.propType + '-' + e.target.dataset.id);
      this.close();
    }
  }
})
