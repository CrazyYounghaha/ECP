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
		this.assign("style","order");
		return this.display();
	}
	* commentAction(){
		yield this.weblogin();
		this.assign("style","comment");
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