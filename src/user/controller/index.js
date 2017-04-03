'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index/index.html
    this.assign("style","mainPage");
    return this.display();
  }

  loginAction(){

    return this.display();
  }
	registerAction(){

		return this.display();
	}
}