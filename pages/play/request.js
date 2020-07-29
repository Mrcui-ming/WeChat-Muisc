function playRequest(songmid) {
  return new Promise((resolve,reject) => {
    wx.request({
      url: 'https://u.y.qq.com/cgi-bin/musicu.fcg?format=json&data={"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"358840384","songmid":["'+songmid+'"],"songtype":[0],"uin":"1443481947","loginflag":1,"platform":"20"}},"comm":{"uin":"18585073516","format":"json","ct":24,"cv":0}}',
      success: res => resolve(res.data.req_0.data)
    })
  })
}

module.exports = {
  playRequest
}