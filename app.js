App({
  onLaunch: function () {

  },
  globalData: {
    userinfoL: null,
    musicURL: {
      // 排行榜
      TOPURL: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8%C2%ACice=0&platform=h5&needNewCode=1&tpl=3&page=detail&type=top&topid=27&_=1519963122923',
      // 搜索
      SCRURL: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=1&n=30&format=json',
      // 热搜
      HOTURL: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=5381&uin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&_=1513317614040'
    },
    //正在播放的歌曲id
    songmid: null,
    //播放时间
    currentTime: "00:00",
    //播放总时间
    durationTime: "00:00",
    //播放进度
    sliderinfo: 0,
    //播放的状态
    broadcastState: true,
    //总歌曲的数组列表
    songList: [],
    //正在播放歌曲在歌曲列表中的索引值
    songCount: -2,
    //当前歌曲的播放状态
    MusicState: 0
  }
})