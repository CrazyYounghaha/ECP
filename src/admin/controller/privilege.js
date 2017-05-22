'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    * addadminAction() {
        //auto render template file index/index.html
        if (this.isPost()) {
            let addInfo = this.post();
            //console.log(addInfo);
            let check = yield this.model('admin').where({name: addInfo.adminName}).select();
            //console.log(check);
            if (think.isEmpty(check)) { //如果不存在这个管理员就新增
                addInfo.adminpwd = encryptPassword(addInfo.adminpwd);
                yield this.model('admin').add({
                    name: addInfo.adminName,
                    password: addInfo.adminpwd,
                    email: addInfo.adminemail,
                    phone: addInfo.adminphone
                });

                return this.success(1);

            }
            return this.success(-1); //已存在同名管理员无法添加
        } else {
            let adminInfo = yield this.model('admin').select();
            this.assign('adminInfo', adminInfo);
            this.assign("style", "privilege");
            return this.display();
        }

    }

    * changeadminAction() {
        if (this.isPost()) {
            let changeInfo = this.post();
            //console.log(changeInfo);
            let check = yield this.model('admin').where({admin_id:changeInfo.admin_id}).select();
            //console.log(check);
            if(!think.isEmpty(check)) {  //如果存在该管理员就修改
                yield this.model('admin').where({admin_id:changeInfo.admin_id}).update({  //管理员更新对应信息
                    name: changeInfo.changeName,
                    password: changeInfo.changePwd,
                    email: changeInfo.changeEmail,
                    phone: changeInfo.changePhone
                });

                return this.success(1);

            }
            return this.success(-1);   //不存在该管理员无法修改
        }else {
            let  adminInfo = yield this.model('admin').select();
            this.assign('adminInfo',adminInfo);
            this.assign('style',"privilege");
            return this.display();
        }

    }

        * deleteadminAction() {
        if(this.isPost()) {
            let delete_admin_id = this.post('admin_id');
            // console.log(delete_admin_id);
            yield this.model('admin').where({admin_id:delete_admin_id}).delete();

        }
            return this.success(1);

        }

    * deleteAction(){
        yield this.weblogin();
        this.assign("style","privilege");


        if (this.isAjax()) {
            let admin_ids_str = this.post('admin_id');
            admin_ids_str = admin_ids_str.substring(0,admin_ids_str.length-1);
            let admin_ids = admin_ids_str.split(',');
            // console.log(admin_ids);

            let model = this.model('admin');
            for(let i = 0;i < admin_ids.length;i++){
                let cur_admin_id = admin_ids[i];
                try{
                    yield model.startTrans();//事务处理
                    yield this.model('admin').where({admin_id: ['=', cur_admin_id]}).delete();
                    yield model.where({admin_id: ['=', cur_admin_id]}).delete();
                    yield model.commit();
                }catch(e){
                    yield model.rollback();
                    return this.success(-1);
                }
            }
            return this.success(1);
        }

        return this.display();
    }

    }


/**
 * Created by Administrator on 2017/4/18.
 */

