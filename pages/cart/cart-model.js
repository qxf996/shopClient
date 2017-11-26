import { Base } from '../../utils/base.js';

class Cart extends Base {

  constructor() {
    super();
    this._storageKeyName = 'cart';
  }

  /**
   * 加入到购物车
   * 如果之前没有这样的商品，则直接添加一条新的记录，数量为counts
   * 如果有，则只将相应数量 + counts
   * @params:
   * item - {obj} 商品对象，
   * counts - {int} 商品数量,
   */
  add(item, counts) {
    var cartData = this.getCartDataFromLocal();
    var isHasInfo = this._isHasThatOne(item.id, cartData);
    if (isHasInfo.index == -1) {
      item.counts = counts;
      item.selectStatus = true;
      cartData.push(item);
    } else {
      cartData[isHasInfo.index].counts += counts;
    }
    wx.setStorageSync(this._storageKeyName, cartData);
  }

  //本地缓存：保存、更新
  execSetStorageSync(data) {
    wx.setStorageSync(this._storageKeyName, data);
  }
  //从缓存中读取购物车数据
  getCartDataFromLocal(flag) {
    var res = wx.getStorageSync(this._storageKeyName);
    if (!res) {
      res = [];
    }
    //在下单的时候过滤不下单的物品
    if (flag) {
      var newNews = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].selectStatus) {
          newNews.push(res[i]);
        }
      }
      res = newNews;
    }
    return res;
  }

  //获取购物车所有商品的总数量
  //flag true 考虑商品选择状态
  getCartTotalCounts(flag) {
    var data = this.getCartDataFromLocal();
    var counts = 0;
    for (let i = 0; i < data.length; i++) {
      if (flag) {
        if (data[i].selectStatus) {
          counts += data[i].counts;
        }
      } else {
        counts += data[i].counts;
      }
    }
    return counts;
  }

  //判断某个商品是否被添加到购物车中，如果有返回这个商品的数据以及所在数组中的序号 否则返回{index=-1}
  _isHasThatOne(id, arr) {
    var item, result = { index: -1 };
    for (let i = 0; i < arr.length; i++) {
      item = arr[i];
      if (item.id == id) {
        result = { index: i, data: item };
        break;
      }
    }
    return result;
  }

  //修改商品数量 params: id (int)商品id     counts (int)书目
  _changeCounts(id, counts) {
    var cartData = this.getCartDataFromLocal(),
      hasInfo = this._isHasThatOne(id, cartData);
    if (hasInfo.index != -1) {
      if (hasInfo.data.counts > 1) {
        cartData[hasInfo.index].counts += counts;
      }
    }
    wx.setStorageSync(this._storageKeyName, cartData);//更新本地缓存
  }

  //增加商品数量
  addCounts(id) {
    this._changeCounts(id, 1);
  }

  //减少商品数量
  cutCounts(id) {
    this._changeCounts(id, -1);
  }

  //删除商品
  delete(ids) {
    if (!ids instanceof Array) {
      ids = [ids];
    }
    var cartData = this.getCartDataFromLocal();
    for (let i = 0; i < ids.length; i++) {
      var hasInfo = this._isHasThatOne(ids[i], cartData);
      if (hasInfo.index != -1) {
        cartData.splice(hasInfo.index, 1);//删除数组某一项
      }
    }

    wx.setStorageSync(this._storageKeyName, cartData);
  }
}

export { Cart };