// components/songItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songList: {
      value: {},
      type: Object
    },
    musicCount:{
      type: Number,
      value: 0
    },
    songCount: {
      type: Number,
      value: -10
    }
  },
  data: {
    name: "Mrcui-ming"
  },
  methods: {
    songItemClick(e){
      //事件的传递参数  data-属性名="值" 可传递JSON。
      //组件用currentTarget获取  pages使用target获取
      // const data = e.currentTarget.dataset.key;
      console.log(e);
      
      const StrsongList = JSON.stringify(this.data.songList);  
      wx.navigateTo({
        url: `/pages/play/play?songList=${StrsongList}&songCount=${this.data.musicCount - 1}`,
      })
    }

  }
})
