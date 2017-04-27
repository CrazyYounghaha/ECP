'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    addadminAction(){
        //auto render template file index/index.html
        this.assign("style", "privilege");
        return this.display();
    }

    listadminAction(){
        this.assign("style", "privilege");
        return this.display();
    }
}/**
 * Created by Administrator on 2017/4/18.
 */

