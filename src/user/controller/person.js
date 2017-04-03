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
	indexAction(){
		//auto render template file index/index.html
		this.assign("style","index");
		return this.display();
	}
	addressAction(){
		this.assign("style","address");
		return this.display();
	}
	informationAction(){
		this.assign("style","information");
		return this.display();
	}
	orderAction(){
		this.assign("style","order");
		return this.display();
	}
	commentAction(){
		this.assign("style","comment");
		return this.display();
	}
	consultationAction(){
		this.assign("style","");
		return this.display();
	}
	suggestAction(){
		this.assign("style","");
		return this.display();
	}
}