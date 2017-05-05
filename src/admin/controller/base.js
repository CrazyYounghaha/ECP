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

    async deleteFolderRecursive(url) {
        let fs = require("fs");
        let path = require("path");
        let files = [];
        //判断给定的路径是否存在
        if( fs.existsSync(url) ) {
            //返回文件和子目录的数组
            files = fs.readdirSync(url);
            files.forEach(function(file,index){
                // var curPath = url + "/" + file;
                let curPath = path.join(url,file);
                //fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                    // 是文件delete file
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            //清除文件夹
            fs.rmdirSync(url);
        }else{
            console.log("给定的路径不存在，请给出正确的路径");
        }
    }

}