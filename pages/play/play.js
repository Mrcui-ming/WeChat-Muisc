const andio = wx.createInnerAudioContext();
const {
  playRequest
} = require("./request");
const { get } = require("request");
Page({
  data: {
    songList: {},
    imgScr: "",
    nowtime: "00:00",
    mastertime: "00:00",
    broadcastState: true,
    sliderinfo: "",
    MusicState: 0 //0列表循环 1单曲循环 2随机播放
  },
  onLoad: function (options) {
    //当前歌曲在歌曲列表中的索引
    let songCount = parseInt(options.songCount);
    //设置导航标题
    wx.setNavigationBarTitle({title: '正在播放'})
    const songList = JSON.parse(options.songList);
    this.onPlay(songList,songCount);
  },
  onPlay(songList,songCount) {
    //音频图片的地址 注意一个问题图片要写到函数内 动态生成。
    let imgSrc = 'https://imgcache.qq.com/music/photo/album_300/' + songList.albumid % 100 + '/300_albumpic_' + songList.albumid + '_0.jpg';
    
     //判断从列表页进来的id是否为当前正在播放歌曲的id 如果是就不需要发送请求了 如果不一致就需要发送请求
    if (songList.songmid !== getApp().globalData.songmid) {
    wx.showLoading();
    playRequest(songList.songmid).then(data => {
      //音频播放地址是从请求中的一些信息拼接而成的
      console.log(data.sip[0] + data.midurlinfo[0].purl);
      
      andio.src = data.sip[0] + data.midurlinfo[0].purl;
      getApp().globalData.songCount = songCount;
      //监听音频准备播放时的函数
      andio.onCanplay(() => {
        andio.play();
        getApp().globalData.songmid = songList.songmid;
        wx.hideLoading();
      })
    })
  }
  this.setData({
    songList: songList,
    imgSrc: imgSrc
  })
  },
  //实现播放/暂停功能
  contorlMusic() {
    this.setData({
      broadcastState: !this.data.broadcastState
    }, () => {
      if (this.data.broadcastState) {
        andio.play();
      } else {
        andio.pause();
      }
    })
  },
  //计算出一个 00:00格式的时间
  timeChange(seconds) {
    let second = parseInt(seconds % 60);
    second = second < 10 ? "0" + second : second;
    let min = parseInt(seconds / 60);
    min = min < 10 ? "0" + min : min;
    return min + ":" + second
  },
  //slider发生变化执行的一个方法
  sliderChanged(e) {
    andio.pause();//网速快的化现时的不是很有必要
    this.setData({
      broadcastState: false
    });
    wx.showLoading({
      title: "加载中"
    });
    //拿到进度条所走的距离
    const value = e.detail.value;
    //进度条走的距离 / 紧密条的总距离 * 歌曲的总时间
    let nowTime = value / 100 * andio.duration;
    andio.seek(nowTime)
    //音频完成跳转操作的事件的回调函数
    andio.onSeeked(() => {
      //让加载框隐藏 音乐开始播放 以及控制播放按钮的改变。
      wx.hideLoading();
      andio.play();
      this.setData({
        broadcastState: true
      });
      andio.offSeeked();
    })
  },
  onLast() {
    let songCount = getApp().globalData.songCount;
    switch(this.data.MusicState){
      case 0:
        --songCount;
        //请求到下一首数据并播放后 还要将对应的歌曲索引也要发生改变
        getApp().globalData.songCount--;
        if(songCount === 0){
          songCount = getApp().globalData.songList.length - 1
        }
        break; 
      case 1:
        songCount = songCount;
        getApp().globalData.songmid = 0;
        break;
      case 2:
        songCount =  Math.floor(Math.random() * 99);
        break;
    }
    let songList = getApp().globalData.songList[songCount].data;
    this.onPlay(songList,songCount);
  },
  onNext() {
    let songCount = getApp().globalData.songCount;
    switch(this.data.MusicState){
      case 0:
        ++songCount;
        //请求到下一首数据并播放后 还要将对应的歌曲索引也要发生改变
        getApp().globalData.songCount++;
        break; 
      case 1:
        songCount = songCount;
        getApp().globalData.songmid = 0;
        break;
      case 2:
        songCount =  Math.floor(Math.random() * 100);
        break;
    }
    let songList = getApp().globalData.songList[songCount].data;
    this.onPlay(songList,songCount);
  },
  ToggleMusicState() {
    //切换歌曲播放的状态 永远只会产生0/1/2这三个数
    this.setData({
      MusicState: ++this.data.MusicState % 3
    },() => {
      getApp().globalData.MusicState = this.data.MusicState;
    })
  },
  onShow() {
    this.setData({
      nowtime: getApp().globalData.currentTime,
      mastertime: getApp().globalData.durationTime,
      sliderinfo: getApp().globalData.sliderinfo,
      broadcastState: getApp().globalData.broadcastState,
      MusicState: getApp().globalData.MusicState
    })
    //音频正在播放 没有走play()就不会走这个方法
    andio.onTimeUpdate(() => {
      this.setData({
        nowtime: this.timeChange(andio.currentTime),
        mastertime: this.timeChange(andio.duration),
        sliderinfo: andio.currentTime / andio.duration * 100
      })
    })
    //歌曲播放完成的回调函数
    andio.onEnded(() => {
      this.onNext();
    })
  },
  onUnload: function () {
    getApp().globalData.currentTime = this.data.nowtime;
    getApp().globalData.durationTime = this.data.mastertime;
    getApp().globalData.sliderinfo = this.data.sliderinfo;
    getApp().globalData.broadcastState = this.data.broadcastState;
    //取消事件的监听 (只是一个代码优化的问题)
    andio.offTimeUpdate();
  }
})