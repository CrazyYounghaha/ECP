/**
 * Created by zhangyang on 17/4/17.
 */
'use strict';

import Base from './base.js';

export default class extends Base {
	/**
	 * index action
	 * @return {Promise} []
	 */
	* indexAction(){
		//auto render template file search/index.html
		if(this.isGet()){
			let keyWord = this.get();
			let productType = yield this.model("product_type").where({name: keyWord.searchInfo}).find();
			let productDetails = yield this.model("product").where({type: productType.product_type_id}).select();
			// console.log(productDetails);
			this.assign("style","search");
			this.assign("products",productDetails);
			return this.display();
		}
	}
}