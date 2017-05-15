/**
 * Created by zhangyang on 17/3/28.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	* indexAction(){
		yield this.weblogin();
		//auto render template file index/index.html
		this.assign("style","index");
		return this.display();
	}
	* addressAction(){
		yield this.weblogin();
		this.assign("style","address");
		return this.display();
	}
	* informationAction(){
		yield this.weblogin();
		this.assign("style","information");
		return this.display();
	}
	* orderAction(){
		yield this.weblogin();
		let orderHistoryDetail = yield this.model('order_history_detail').join({
			table: "order_history",
			join: "left",
			on: ["order_history_id","order_history_id"]
		}).join({
			table: "product",
			join: "left",
			on: ["product_id","product_id"]
		}).where('ecp_order_history.user_id='+this.user.id).order({pay_time:"DESC"}).select();
		console.log(orderHistoryDetail);
		this.assign("order_history",orderHistoryDetail);
		this.assign("style","order");
		return this.display();
	}
	* commentAction(){
		yield this.weblogin();
		this.assign("style","comment");
		return this.display();
	}
	* orderinfoAction(){
		yield this.weblogin();
		this.assign("style","order");
		return this.display();
	}
	* expressAction(){
		yield this.weblogin();
		this.assign("style","express");
		return this.display();
	}
	* consultationAction(){
		yield this.weblogin();
		this.assign("style","");
		return this.display();
	}
	* suggestAction(){
		yield this.weblogin();
		this.assign("style","");
		return this.display();
	}
}