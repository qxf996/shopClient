
import { Base } from './base.js';
import { Config } from './config.js';

class Address extends Base {
  constructor() {
    super();
  }
  //设置地址信息，这里的res可能是微信返回的res信息，也可能是API访问数据库的
  setAddressInfo(res) {
    var province = res.provinceName || res.province,
      city = res.cityName || res.city,
      county = res.countyName || res.country,
      detail = res.detailInfo || res.detail;
    var totalDetail = city + county + detail;

    if (!this.isCenterCity(province)) {
      totalDetail = province + city + county + detail;
    }

    return totalDetail;
  }

  //获取我自己的收货地址
  getAddress(callback) {
    var that = this;
    var param = {
      url: 'address',
      sCallback: function (res) {
        if (res) {
          res.totalDetail = that.setAddressInfo(res);
          callback && callback(res);
        }
      }
    }
    this.request(param);
  }

  //是否为直辖市
  isCenterCity(name) {
    var centerCitys = ['北京市', '天津市', '上海市', '重庆市'];
    var flag = centerCitys.indexOf(name) >= 0;
    return flag;
  }

  /**
   * (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败');
          }
        }
   * 
   */
  //更新保存地址
  submitAddress(data, callback) {
    data = this._setAddress(data);
    var param = {
      url: 'address',
      type: 'post',
      data: data,
      sCallback: function (res) {
        callback && callback(true, res);//这里的res本来是服务器返回的res.data的结果，但是我们直接转换成bool类型的true了，然后再作为箭头函数的参数使用了。
      }, eCallback(res) {
        callback & callback(false, res);
      }
    };
    this.request(param);
  }
  //保存地址
  _setAddress(res) {
    var formData = {
      name: res.userName,
      province: res.provinceName,
      city: res.cityName,
      country: res.countyName,
      mobile: res.telNumber,
      detail: res.detailInfo
    };
    return formData;
  }
}

export { Address };