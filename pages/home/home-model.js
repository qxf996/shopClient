
import { Base } from '../../utils/base.js';

class Home extends Base{

  constructor(){
    super();//调用基类的构造函数
  }

  getBannerData(id, callback){
    var params = {
      url: 'banner/'+id,
      sCallback:function(res){
        callback && callback(res.items);
      }
    };

    this.request(params);
  }

  getThemeData(callback){
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback:function(data){
        callback && callback(data);
      }      
    };
    this.request(params);
  }

  getProductsData(callback) {
    var params = {
      url: 'product/recent',
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(params);
  }

}

export {Home};