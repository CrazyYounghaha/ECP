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
			let comment_number = yield this.model('feedback').where({product_id: productId.productId}).count()
			// console.log(comment_number);
			// console.log(productDetails);
			this.assign("style","introduction");
			this.assign("product_details",productDetails);
			this.assign("commentNumber",comment_number);
			this.assign("pictures", pictures);
			return this.display();
		}
	}
}