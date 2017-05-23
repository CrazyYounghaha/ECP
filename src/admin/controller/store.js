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
        yield this.weblogin();
		this.assign("style","store");
		//返回商品类型列表
        let product_type = yield this.model("product_type").select();
        this.assign("product_typeList",product_type);

        let addStoreRecordList;
        if (this.isPost()) {
        	//获取筛选信息
            let conditionList = this.post();
            console.log(conditionList);
            //查询条件初始化
            let conditions = "1=1";
            //判断是否填入:
            if(conditionList.startdate != '')
            	conditions += " and date_format(add_store_time, '%Y-%m-%d') >= " + "'" +  conditionList.startdate + "'";
            if(conditionList.enddate != '')
                conditions += " and date_format(add_store_time, '%Y-%m-%d') <= " + "'" + conditionList.enddate + "'";
            if(conditionList.product_type != -1)
                conditions += ' and type = '+ conditionList.product_type;
            if(conditionList.keyword != '')
                conditions += ' and name LIKE '+ "'%" + conditionList.keyword + "%'";
            addStoreRecordList = yield this.model("product").join({
                table: "add_store_record",
                join: "inner",
                on: ["product_id","add_product_id"]
            }).where(conditions).select();
        }
        else {
            addStoreRecordList = yield this.model("product").join({
                table: "add_store_record",
                join: "inner",
                on: ["product_id","add_product_id"]
            }).select();
        }
		// console.log(addStoreRecordList);
		this.assign("addStoreRecordList",addStoreRecordList);
		return this.display();


	}
    *totaladdstoreAction(){
        yield this.weblogin();
        this.assign("style","store");
        //返回商品类型列表
        let product_type = yield this.model("product_type").select();
        this.assign("product_typeList",product_type);
        let record_results;
        if(this.isPost()){
            //获取筛选信息
            let conditionList = this.post();
            console.log(conditionList);
            //查询条件初始化
            let conditions_where = "1=1";
            let conditions_having = "1=1";
            //判断是否填入:
            if(conditionList.add_store_start != '')
                conditions_having += " and total_add >= " + "'" +  conditionList.add_store_start + "'";
            if(conditionList.add_store_end != '')
                conditions_having += " and total_add <= " + "'" + conditionList.add_store_end + "'";
            if(conditionList.sale_start != '')
                conditions_where += " and cumulative_sales >= " + "'" +  conditionList.sale_start + "'";
            if(conditionList.sale_end != '')
                conditions_where += " and cumulative_sales <= " + "'" + conditionList.sale_end + "'";
            if(conditionList.inventory_start != '')
                conditions_where += " and inventory >= " + "'" +  conditionList.inventory_start + "'";
            if(conditionList.inventory_end != '')
                conditions_where += " and inventory <= " + "'" + conditionList.inventory_end + "'";
            if(conditionList.sale_money_start != '')
                conditions_having += " and total_sale_money >= " +  conditionList.sale_money_start ;
            if(conditionList.sale_money_end != '')
                conditions_having += " and total_sale_money <= " + conditionList.sale_money_end ;
            if(conditionList.product_type != -1)
                conditions_where += ' and type = '+ conditionList.product_type;
            if(conditionList.keyword != '')
                conditions_where += ' and name LIKE '+ "'%" + conditionList.keyword + "%'";
            record_results = yield this.model('add_store_record').join({
                table: "product",
                join: "inner",
                on: ["add_product_id","product_id"]
            }).field('ecp_product.*,add_store_record_id,sum(add_store_count) as total_add,price*cumulative_sales as total_sale_money')
                .where(conditions_where).group('add_product_id').having(conditions_having).select();
        }
        else {
            record_results = yield this.model('add_store_record').join({
                table: "product",
                join: "inner",
                on: ["add_product_id","product_id"]
            }).field('ecp_product.*,add_store_record_id,sum(add_store_count) as total_add,price*cumulative_sales as total_sale_money').group('add_product_id').select();
        }
        // console.log(record_results);
        this.assign("record_results",record_results);
        return this.display();
    }
	*addstoreAction(){
        yield this.weblogin();
		this.assign("style","add");
        //返回商品类型列表
        if (this.isPost()) {
            let product_id = this.post('product_id');
            let add_store_count = this.post('add_store_count');
            if(!think.isEmpty(add_store_count)){
                //插入库存记录
                yield this.model('add_store_record').add({
                    add_product_id:product_id,
                    add_store_count:add_store_count,
                    add_store_time:dateformat('Y-m-d H:i:s',new Date().valueOf())
                });
            }
        }
		return this.redirect('/admin/store/totaladdstore');
	}
	*deleteAction(){
        yield this.weblogin();
        if(this.isAjax()){
            let record_ids_str = this.post('record_ids');
            record_ids_str = record_ids_str.substring(0,record_ids_str.length-1);
            let record_ids = record_ids_str.split(',');
            // console.log(record_ids_str);


            for(let i = 0;i < record_ids.length;i++){
                let record_id = record_ids[i];
                console.log("delete "+record_id);
                yield this.model('add_store_record').where({add_store_record_id:record_id}).delete();
            }
            return this.success(1);
        }
        return this.success(-1);
    }

}