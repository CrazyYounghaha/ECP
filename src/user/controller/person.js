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
		let address = yield this.model('address').where({user_id: this.user.id}).select();
		this.assign("style","address");
		this.assign("address", address);
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
	* commentlistAction(){
			yield this.weblogin();
			if(this.isGet()){
					let orderId = this.get();
					let commentList = yield this.model('order_history_detail').join({
							table: "order_history",
							join: "left",
							on: ["order_history_id","order_history_id"]
					}).join({
							table: "product",
							join: "left",
							on: ["product_id","product_id"]
					}).where('ecp_order_history.order_history_id='+orderId.orderId).select();
					console.log(commentList);
					this.assign("commentList",commentList);
					this.assign("style","commentList");
					return this.display();
			}else {//post
					let commentDetail = this.post();
					for (let i = 0 ; i < commentDetail.number ; i++){
							let star, comment, order_history_id, product_id;
							for (let index in commentDetail){
									if (index.slice(0,1) == i){
											if(index.substring(1) == '[star]'){
													star = commentDetail[index];
											} else if (index.substring(1) == '[comment]'){
													comment = commentDetail[index];
											} else if (index.substring(1) == '[product_id]'){
													product_id = commentDetail[index];
											} else {
													order_history_id = commentDetail[index];
											}
											if (index.substring(1) == '[product_id]'){
													yield this.model("feedback").add({
															star_level: star,
															feedback_detail: comment,
															time: dateformat('Y-m-d H:i:s', new Date().valueOf()),
															product_id: product_id,
															order_history_id: order_history_id,
															user_id: this.user.id
													});//新增评价记录
													yield this.model('order_history').where({order_history_id: order_history_id}).update({status: 4});//评论提交，状态更改为已评论
											}
									}
							}
					}

					return this.success();
			}
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
	*	chatAction(){
				yield this.weblogin();
				this.assign("style","chat");
				return this.display();
		}
}