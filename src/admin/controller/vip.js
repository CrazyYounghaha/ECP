/**
 * Created by zhangyang on 17/4/12.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	* indexAction(){
		//auto render template file index/index.html
        let userInfo = yield this.model('user').select();
        this.assign('userInfo',userInfo);
        this.assign("style","vip");
        return this.display();
	}


	* addvipAction(){
		if(this.isPost()) {
            let vipInfo = this.post();
            // console.log(vipInfo);
            let check = yield this.model('user').where({name: vipInfo.vipName}).select();
             //console.log(check);
            if (think.isEmpty(check)) {  //如果不存在这个用户就新增
                vipInfo.vipPassword = encryptPassword(vipInfo.vipPassword);
                yield this.model('user').add({
                    name: vipInfo.vipName,
                    password: vipInfo.vipPassword,
                    email: vipInfo.vipEmail,
                    phone: vipInfo.vipPhone,
                    is_online: vipInfo.vipLogin,
                    is_vip: vipInfo.vipStatus
                });
                return this.success(1);
            }
            return this.success(-1);  //已存在同名会员无法添加
        }else{


		}
	}

}