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
	indexAction(){
		//auto render template file index/index.html
		this.assign("style","product");
		return this.display();
	}
	storeAction(){
		this.assign("style","store");
		return this.display();
	}
	addAction(){
		this.assign("style","add");
		return this.display();
	}
	commentAction(){
		this.assign("style","comment");
		return this.display();
	}
}