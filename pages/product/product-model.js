import { Base } from '../../utils/base.js';

class Product extends Base {
  constructor() {
    super();
  }
  //获取具体商品的详细信息，商品id号
  getDetailInfo(id, callback) {
    var params = {
      url: 'product/' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(params);
  }
}

export { Product }