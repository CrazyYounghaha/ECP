/**
 * Created by zhangyang on 17/4/3.
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
		if(this.isGet()){
			let productId = this.get();
			// console.log(productId.productId);
			let pictures = yield this.model('picture').where({product_id: productId.productId,type: 1}).select();
			// console.log(pictures);
			let productDetails = yield this.model('product').where({product_id: productId.productId}).find();
			let comment_number = yield this.model('feedback').where({product_id: productId.productId}).count();
			let comment_detail = yield this.model('feedback').join({
					table: "product",
					join: "left",
					on: ["product_id","product_id"]
			}).join({
					table: "user",
					join: "left",
					on: ["user_id","user_id"]
			}).where('ecp_feedback.product_id='+productId.productId).field('ecp_feedback.*,ecp_product.name as product_name,ecp_product.detail as product_detail,ecp_user.name as user_name').select();
			console.log(comment_detail);
			// console.log(productDetails);
			this.assign("style","introduction");
			this.assign("product_details",productDetails);
			this.assign("commentNumber",comment_number);
			this.assign("pictures", pictures);
			this.assign("comment", comment_detail);
			return this.display();
		}
	}
}