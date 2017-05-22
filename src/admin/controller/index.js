'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  *indexAction(){
      //auto render template file index/index.html
      this.assign("style", "index");
      yield this.weblogin();
      let return_result = {};
      //用户数量
      let user_count = yield this.model('user').count();
      user_count = think.isEmpty(user_count)?0:user_count;
      return_result.user_count = user_count;
      //商品数量
      let product_count = yield this.model('product').count();
      product_count = think.isEmpty(product_count)?0:product_count;
      return_result.product_count = product_count;
      //当天收入
      let today_income = yield this.model('order_history').where("(status = 4 OR status = 5) AND date_format(pay_time, '%Y-%m-%d') = "+ "'" + dateformat('Y-m-d',new Date().valueOf()) + "'").sum('order_pay');
      today_income = think.isEmpty(today_income)?0:today_income;
      return_result.today_income = today_income;
      //总收入
      let total_income = yield this.model('order_history').where('status = 4 OR status =5').sum('order_pay');
      total_income = think.isEmpty(total_income)?0:total_income;
      return_result.total_income = total_income;
      this.assign('ecp_data',return_result);
      return this.display();
  }
  *loginAction() {
      if (this.isPost()) {
        let data = this.post();
        console.log(data);
        data.password = encryptPassword(data.password);
        data.login_time = new Date().valueOf();
        let admin = yield this.model('admin').where({name: data.admin_name}).find();
        if (think.isEmpty(admin)) {
            return this.success(-1);//不存在此用户
        } else {
            if (data.password == admin.password) {
                console.log("Login success");
                yield this.model('admin_login_record').add({
                    admin_id: admin.admin_id,
                    login_time: dateformat('Y-m-d H:i:s', data.login_time)
                });
                // yield this.model('admin').where({name: data.admin_name}).update({is_online: 1})
                let adminInfo = {
                    'id': admin.admin_id,
                    'admin_name':data.admin_name,
                    'login_time':data.login_time
                };
                yield this.session('loginadmin', adminInfo);
                return this.success(1);
            } else {
                // console.log("password error");
                return this.success(-2);
            }
        }
    }else {
        return this.display();
      }
  }
    * logoutAction(){
        if(this.isadminlogin){
            yield this.session("loginadmin",null);
            return this.redirect('/admin/index/login');
        }
    }


}