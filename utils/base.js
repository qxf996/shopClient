import { Config } from '../utils/config.js';
import { Token } from 'token.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }
  //对微信提供的wx.request接口进行封装,当noRefetch为true时，不做未授权重试机制
  request(params, noRefetch) {
    var that = this;
    var url = this.baseRequestUrl + params.url;
    if (!params.type) {
      params.type = 'GET';
    }
    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token'),
      },
      success: function (res) {

        //获取错误状态码
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);

        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          if (code == '401') {
            //token.getTokenFromServer
            //base.request
            if (!noRefetch) {
              that._refetch(params);
            }
          }
          if (noRefetch) {
            params.eCallback && params.eCallback(res.date);
          }
        }
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }

  //重新请求（如果token过期了才会重新请求）
  _refetch(params) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(params, true);
    });
  }

  //获得元素绑定的值
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }
}
export { Base };