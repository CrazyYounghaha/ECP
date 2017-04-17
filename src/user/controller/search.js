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
	indexAction(){
		//auto render template file search/index.html
		this.assign("style","search");
		return this.display();
	}
}