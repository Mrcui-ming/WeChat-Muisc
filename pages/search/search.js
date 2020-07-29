// pages/search/search.js
Page({
  data: {
    hotmusic: [],
    isShow: false,
    songList: [],
    songCount: -2
  },
  onInputChange(e) {
    let value = e.detail.value;
    if(value.length !== 0){
      this.setData({isShow: true})
    }else{
      this.setData({
        isShow: false,
        songList: []
      })
    }
  },
  onInputSuccess(e) {
      let value = e.detail.value;
      this.getSongList(value);
  },
  getSongList(value) {
    wx.showLoading({title: '加载中'});
    wx.request({
      url: getApp().globalData.musicURL.SCRURL,
      data: {w: value},
      success: res => {
        wx.hideLoading();
        let songList = res.data.data.song.list 
        this.setData({songList: songList,isShow: true})  
      }
    })
  },
  onClear() {
    this.setData({
      isShow: false,
      songList: [],
      value: ""   
    })
  },
  searchHot(e) {
    let value = e.target.dataset.key;
    this.getSongList(value);
  },
  onLoad: function (options) {
    wx.showLoading({ title: '加载中'});
    wx.request({
      url: getApp().globalData.musicURL.HOTURL,
      success: res => {
        wx.hideLoading();
        let hotmusic = res.data.data.hotkey
        this.setData({
          hotmusic: hotmusic,
          songCount: getApp().globalData.songCount
        }) 
      }
    })
  },
  onShow: function () {
    this.setData({
      songCount: getApp().globalData.songCount
    })
  },
  onUnload: function () {

  }
})