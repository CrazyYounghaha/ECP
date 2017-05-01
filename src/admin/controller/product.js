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
	*indexAction(){
		//auto render template file index/index.html
		this.assign("style","product");
		//返回商品类型
        let product_type = yield this.model("product_type").select();
        this.assign("product_typeList",product_type);

		// let keyWord = this.post();
		// let productType = yield this.model("product_type").where({name: keyWord.searchInfo}).find();
		// let productDetails = yield this.model("product").where({type: productType.product_type_id}).select();
        let productsList;
        if (this.isPost()) {
        	//获取筛选信息
            let conditionList = this.post();
            console.log(conditionList);
            //查询条件初始化
            let conditions = "1=1";
            //判断是否填入:
            if(conditionList.startdate != '')
            	conditions += " and date_format(update_time, '%Y-%m-%d') >= " + "'" +  conditionList.startdate + "'";
            if(conditionList.enddate != '')
                conditions += " and date_format(update_time, '%Y-%m-%d') <= " + "'" + conditionList.enddate + "'";
			if(conditionList.is_onsale != -1)
                conditions += ' and is_onsale = ' +  conditionList.is_onsale;
            if(conditionList.product_type != -1)
                conditions += ' and type = '+ conditionList.product_type;
            if(conditionList.keyword != '')
                conditions += ' and name LIKE '+ "'%" + conditionList.keyword + "%'";
			productsList = yield this.model("product").where(conditions).select();
        }
        else {
            productsList = yield this.model("product").join("ecp_product_type on ecp_product.type=ecp_product_type.product_type_id").select();
        }
		console.log(productsList);
		this.assign("productsList",productsList);
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