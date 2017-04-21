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
			console.log("113213123");
			let get = this.post();
			let product = yield this.model('product').where({product_id: get.productId}).find();
			let pictureUrl = yield this.model('picture').where({product_id: get.productId,type: 2}).find();
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
					shoppingcart_id: addNewCart,
					cart_picture: pictureUrl.cart_picture
				});
				this.user.cart_total = parseInt(this.user.cart_total) + 1;//第一次添加购物车，更新缓存信息，购物车总数加一
			} else {//该用户已有购物车信息,直接添加购物车详情
				let cartDetail = yield this.model('cartdetail').where({
					product_id: get.productId,
					shoppingcart_id: shoppingCart.shoppingcart_id
				}).find();
				if (!think.isEmpty(cartDetail)) {//该购物车已有相同的产品,则添加相同商品的数量；
					cartDetail.product_count = parseInt(cartDetail.product_count )+ parseInt( get.number);
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
						shoppingcart_id: shoppingCart.shoppingcart_id,
						cart_picture: pictureUrl.cart_picture
					});
					this.user.cart_total = parseInt(this.user.cart_total) + 1;//添加不同商品时，更新缓存信息，购物车总数加一
				}
			}
			return this.success(1);
		}else {
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
		this.assign("style", "pay");
		return this.display();
	}

	* successAction() {
		yield this.weblogin();
		this.assign("style", "success");
		return this.display();
	}
}