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
	indexAction(){
		//auto render template file index/index.html
		this.assign("style","introduction");
		return this.display();
	}
}