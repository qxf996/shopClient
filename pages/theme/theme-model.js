import { Base } from '../../utils/base.js';

class Theme extends Base {
  constructor() {
    super();//调用基类的构造函数
  }

  //获取主题下的商品列表
  //对应主题的id号
  getProductsData(id, callback) {
    var params = {
      url: 'theme/' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(params);
  }
}
export { Theme }