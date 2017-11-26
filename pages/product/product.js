// pages/product/product.js
import { Product } from 'product-model.js';
import { Cart } from '../cart/cart-model.js';
var product = new Product();
var cart = new Cart();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null, //类似于类的成员变量，如果后期维护需要知道可以定义在这里
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCount: 1,
    currentTabsIndex: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },
  _loadData: function () {
    product.getDetailInfo(this.data.id, (data) => {
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product: data
      });
    });
  },
  bindPickerChange: function (event) {
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index];
    this.setData({
      productCount: selectedCount
    });
  },
  onTabsItemTap: function (event) {
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  //添加到购物车缓存并更新页面显示数量
  onAddingToCartTap: function (event) {
    this.addToCart();
    var counts = this.data.cartTotalCount + this.data.productCount;
    this.setData({
      cartTotalCounts: cart.getCartTotalCounts()
    });
  },

  //添加到购物车（缓存）操作
  addToCart: function () {
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];//缓存需要存的键
    for (var key in this.data.product) {
      if (keys.indexOf(key) >= 0) {
        tempObj[key] = this.data.product[key];
      }
    }
    cart.add(tempObj, this.data.productCount);
  },

  //跳转到购物车界面
  onCartTap:function(event){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }

})