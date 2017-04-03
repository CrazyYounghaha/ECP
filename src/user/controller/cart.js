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
	indexAction(){
		//auto render template file index/index.html
		this.assign("style","cart");
		return this.display();
	}
	payAction(){
		//auto render template file index/index.html
		this.assign("style","pay");
		return this.display();
	}
	successAction(){
		//auto render template file index/index.html
		this.assign("style","success");
		return this.display();
	}
}