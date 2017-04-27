/**
 * Created by zhangyang on 17/4/2.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	* indexAction() {
		yield this.weblogin();
		if (this.isPost()) {
			let get = this.post();
			let product = yield this.model('product').where({product_id: get.productId}).find();
			let shoppingCart = yield this.model('shoppingcart').where({user_id: this.user.id}).find();
			if (think.isEmpty(shoppingCart)) {//第一次添加购物车信息
				let addNewCart = yield this.model('shoppingcart').add({
					add_time: dateformat('Y-m-d H:i:s', new Date().valueOf()),
					total: 1,
					status: 1,
					user_id: this.user.id
				});
				yield this.model('cartdetail').add({
					price: product.price,
					product_count: get.number,
					product_id: get.productId,
					shoppingcart_id: addNewCart
				});
				this.user.cart_total = parseInt(this.user.cart_total) + 1;//第一次添加购物车，更新缓存信息，购物车总数加一
			} else {//该用户已有购物车信息,直接添加购物车详情
				let cartDetail = yield this.model('cartdetail').where({
					product_id: get.productId,
					shoppingcart_id: shoppingCart.shoppingcart_id
				}).find();
				if (!think.isEmpty(cartDetail)) {//该购物车已有相同的产品,则添加相同商品的数量；
					cartDetail.product_count = parseInt(cartDetail.product_count) + parseInt(get.number);
					yield this.model('cartdetail').where({
						product_id: get.productId,
						shoppingcart_id: shoppingCart.shoppingcart_id
					}).update({product_count: cartDetail.product_count});
				} else {
					yield this.model('shoppingcart').where({user_id: this.user.id}).update({total: shoppingCart.total++});
					yield this.model('cartdetail').add({
						price: product.price,
						product_count: get.number,
						product_id: product.product_id,
						shoppingcart_id: shoppingCart.shoppingcart_id
					});
					this.user.cart_total = parseInt(this.user.cart_total) + 1;//添加不同商品时，更新缓存信息，购物车总数加一
				}
			}
			return this.success(1);
		} else {
			let cart = yield this.model('cartdetail').join({
				table: "shoppingcart",
				join: "left",
				on: ["shoppingcart_id", "shoppingcart_id"]
			}).join({
				table: "product",
				join: "left",
				on: ["product_id", "product_id"]
			}).where({user_id: this.user.id}).select();
			console.log(cart);
			this.assign("cart", cart);
			this.assign("style", "cart");
			return this.display();
		}
	}

	* payAction() {
		yield this.weblogin();
		if (this.isPost()) {
			let data = this.post();
			// let time = Object.getOwnPropertyNames(data).length;
			let total_count = 0;
			for (let index  in data) {
				if (index != "total")
					total_count += parseInt(data[index]);//计算总数
			}
			// console.log(total_count);
			let getOrderID = yield this.model('order').where({user_id: this.user.id}).find();
			if (think.isEmpty(getOrderID)) {//还没生成过订单
				//新增一条个人订单消息
				let getS_Id = yield this.model('shoppingcart').where({user_id: this.user.id}).find();
				yield this.model('order').add({
					total_count: total_count,
					total_pay: data.total,
					order_time: dateformat('Y-m-d H:i:s', new Date().valueOf()),
					pay_type: 1,
					status: 0,
					shoppingcart_id: getS_Id.shoppingcart_id,
					user_id: this.user.id
				});
				getOrderID = yield this.model('order').where({user_id: this.user.id}).find();
			} else {//订单已经有了的，更新原数据
				yield this.model('order').where({user_id: this.user.id}).update({
					total_count: total_count,
					total_pay: data.total,
					order_time: dateformat('Y-m-d H:i:s', new Date().valueOf())
				});
			}
			//删除所有已存在的orderdetail数据
			yield this.model('orderdetail').where({order_id: getOrderID.order_id}).delete();
			for (let index1 in data) {
				if (index1 != "total") {
					let getPrice = yield this.model('product').where({product_id: index1}).find();
					//创建货物的订单详情
					yield this.model('orderdetail').add({
						price: getPrice.price,
						count: data[index1],
						product_id: index1,
						order_id: getOrderID.order_id
					});
				}
			}
			return this.success(1);
		} else {
			//获取地址，获取
			let orderDetail = yield this.model('orderdetail').join({
				table: "order",
				join: "left",
				on: ["order_id", "order_id"]
			}).join({
				table: "product",
				join: "left",
				on: ["product_id","product_id"]
			}).where({user_id: this.user.id}).select();
			console.log(orderDetail);
			let address = yield this.model('address').where({user_id: this.user.id}).select();
			console.log(address);
			this.assign("address",address);
			this.assign("orderDetail",orderDetail);
			this.assign("style", "pay");
			return this.display();
		}
	}

	* successAction() {
		yield this.weblogin();
		this.assign("style", "success");
		return this.display();
	}
}