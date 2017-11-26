import { Base } from '../../utils/base.js';

class My extends Base {
  constructor() {
    super();
  }

  //得到用户的微信信息
  getUserInfo(cb) {

    wx.login({

      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            cb && cb(res.userInfo);
          },
          fail: function (res) {
           cb && cb({
              avatarUrl: '../../imgs/icon/user@default.png',
              nickName: '零食商贩'
            })
          }
        })
      }
    })
  }

  
}

export { My }