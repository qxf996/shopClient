// pages/category/category.js
import { Category } from 'category-model.js';
var category = new Category();

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
    this._loadData();
  },

  _loadData: function () {
    category.getCategoryType((categoryData) => {
      this.setData({
        //绑定所有的分类数据
        categoryTyperArr: categoryData
      });

      //一定要在回调函数里面再进行分类详情的方法调用。因为获取所有分类的方法返回的数据的方式是异步的，无法保证获取某个分类详情时调用的方法能否传入异步返回来的参数。
      category.getProductsByCategory(categoryData[0].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name,
        }
        this.setData({
          //绑定某个分类下的所有商品的数据
          categoryProducts: dataObj
        });
      });
    });
  }



})