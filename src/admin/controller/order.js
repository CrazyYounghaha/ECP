/**
 * Created by zhangyang on 17/4/6.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	*indexAction(){
        yield this.weblogin();
		this.assign("style","order");
		let orderList = yield this.model("order").join("ecp_user on ecp_order.user_id=ecp_user.user_id").select();
		console.log(orderList);
		this.assign('orderList',orderList);
		this.assign('orderStatus',this.getOrderStatus());
        this.assign('payType',this.getPayType());
		return this.display();
	}
}