// pages/cart/cart.js
import { Cart } from 'cart-model.js';
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onHide: function () {
    cart.execSetStorageSync(this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //读取缓存的购物车数据
    var cartData = cart.getCartDataFromLocal();
    //获取选中商品的总数量 这里的getCartTotalCounts可以理解为一个公共方法，供外部调用，并不是多余的。
    // var countsInfo = cart.getCartTotalCounts(true);
    //调用方法返回相关商品数量的数据
    var cal = this._calcTotalAccountAndCounts(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData
    });
  },

  //计算被选中商品的总价格，返回总计价格，商品数量总和以及种类之和
  _calcTotalAccountAndCounts: function (data) {
    var len = data.length,

      //计算被选中商品的总价合计
      account = 0,

      //购买的所有商品数量之和
      selectedCounts = 0,

      //购买的商品种类之和
      selectedTypeCounts = 0;

    let multipe = 100;
    for (let i = 0; i < len; i++) {
      //避免0.05+0.01=0.060 000 000 000 000 005的问题，乘以100*100
      if (data[i].selectStatus) {
        account += data[i].counts * multipe * Number(data[i].price) * multipe;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multipe * multipe)
    }
  },

  //复选框操作
  toggleSelect: function (event) {
    var id = cart.getDataSet(event, 'id'),
      status = cart.getDataSet(event, 'status'),
      index = this._getProductIndexById(id);
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  //重新计算被选中商品的总价格，返回总计价格，商品数量总和以及种类之和
  _resetCartData: function () {
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    //重新绑定页面数据
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData
    });
  },

  //全选按钮的操作
  toggleSelectAll: function (event) {
    var status = cart.getDataSet(event, 'status') == 'true';

    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      data[i].selectStatus = !status;
    }

    this._resetCartData();
  },

  //根据商品id获取商品在缓存数据（数组形式）中的下标
  _getProductIndexById: function (id) {
    var data = this.data.cartData,
      len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id == id) {
        return i;
      }
    }
  },
  //改变商品数量
  changeCounts: function (event) {
    var id = cart.getDataSet(event, 'id'),
      type = cart.getDataSet(event, 'type'),
      index = this._getProductIndexById(id),
      counts = 1;
    if (type == 'add') {
      cart.addCounts(id);
    } else {
      counts = -1;
      cart.cutCounts(id);
    }
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  //删除购物车的商品
  delete: function (event) {
    var id = cart.getDataSet(event, 'id'),
      index = this._getProductIndexById(id);
    this.data.cartData.splice(index, 1);//删除某一项商品
    this._resetCartData();
    cart.delete(id);
  },

  submitOrder: function (event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    });
  },
})