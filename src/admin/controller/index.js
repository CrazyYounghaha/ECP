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
    let islogin = yield this.is_adminlogin();
    if(!islogin)
        return this.redirect("/admin/index/login");
    else
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

}