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
		this.assign("style","order");
		return this.display();
	}
}