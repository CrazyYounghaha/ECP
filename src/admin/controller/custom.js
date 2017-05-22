/**
 * Created by 张扬 on 2017/5/22.
 */
import Base from './base.js';

export default class extends Base {
		/**
		 * index action
		 * @return {Promise} []
		 */
		indexAction() {
				//auto render template file index/index.html
				this.assign("style", "custom");
				return this.display();
		}
}