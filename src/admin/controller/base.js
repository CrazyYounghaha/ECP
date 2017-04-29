'use strict';

export default class extends think.controller.base {
    /**
     * some base method in here
     */
    init(http) {
        super.init(http);
    }

    //所有操作之前
    async __before() {
        this.isadminlogin = await this.is_adminlogin();//返回用户是否登录true or false
        this.admin = await this.session('loginadmin');//获取缓存文件
    }

    async is_adminlogin() {
        let admin = await this.session('loginadmin');
        let res = think.isEmpty(admin) ? false : admin;
        //console.log(res);
        return res;
    }

    async weblogin() {
        let isadminlogin = await this.is_adminlogin();
        if (!isadminlogin) {//未登录
            //pc端跳转到错误页面
            return think.statusAction(404, this.http);
        }
    }
}