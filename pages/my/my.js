import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow: function () {
    var newOrderFlag = order.hasNewOrder();
    if (newOrderFlag) {
      this.refresh();
    }
  },

  //重新加载我的界面
  refresh: function () {
    var that = this;
    this.data.orderArr = [];
    this._getOrders(() => {
      that.data.isLoadedAll = false;
      that.data.pageIndex = 1;
      order.execSetStorageSync(false); //更新标志位
    })
  },

  _getAddressInfo: function () {
    address.getAddress((addressInfo) => {
      this._bindAddressInfo(addressInfo);
    })
  },

  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    })
  },

  _loadData: function () {
    my.getUserInfo((data) => {

      this.setData({
        userInfo: data
      });

    });

    this._getOrders();
  },

  _getOrders: function (callback) {
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.data;

      if (data.length > 0) {
        this.data.orderArr.push.apply(this.data.orderArr, data);
        this.setData({
          orderArr: data
        })
      } else {
        this.data.isLoadAll = true;
      }
      callback && callback();
    })
  },

  //下拉到底部触发时间
  onReachBottom: function () {
    if (!this.data.isLoadAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  //跳转到订单详情界面
  showOrderDetailInfo: function (event) {
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id,
    });
  },

  //再次付款，我的界面里面进行付款
  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');
    this._execpay(id, index);
  },

  _execpay: function (id, index) {
    var that = this;
    order.excepay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;
        //更新订单状态
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          })
        }
        //跳转到成功页面
        wx.navigateTo({
          url: '../pay/pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my',
        })
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    })
  },

  /**
   * 提示窗口
   * params:
   * title -{string}标题
   * content - {string} 内容
   * flag -{bool}是否跳转到我的页面
   * 
   */
  showTips: function (title, content, flag) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {
        if (flag) {
          wx.switchTab({
            url: '/pages/my/my',
          })
        }
      }
    });
  },

  //选择收货地址
  editAddress: function (event) {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res),
        }
        that._bindAddressInfo(addressInfo);
        //保存地址
        address.submitAddress(res, (flag) => {
          if (!flag) {
            that.showTips('操作提示', '地址信息更新失败');
          }
        });
      }
    })
  },

})