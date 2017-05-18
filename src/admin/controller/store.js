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
        console.log(record_results);
        this.assign("record_results",record_results);
        return this.display();
    }
	*addAction(){
        yield this.weblogin();
        var _this = this;
		this.assign("style","add");
        //返回商品类型列表
        let product_type = yield this.model("product_type").select();
        this.assign("product_typeList",product_type);

        if (this.isPost()) {
            let productInfo = this.post();
            console.log(productInfo);
            let product_name = productInfo.product_name;
            let product_type = productInfo.product_type;
            //product表插入操作
            let product_id = yield this.model('product').add({
                name:productInfo.product_name,
                detail:productInfo.product_detail,
                price:productInfo.product_price,
                inventory:productInfo.product_inventory,
                type:productInfo.product_type,
                is_onsale:1,
                cumulative_sales:0,
                update_time: dateformat('Y-m-d H:i:s',new Date().valueOf())
            });
            //获取图片
            // console.log('post');
            let allPics = this.file('fileselect[]');
            // console.log(allPics);
            let index = 0;
            const fs = require('fs'); //引入fs处理文件
            for(let one_pic_index in allPics){
                let one_pic = allPics[""+one_pic_index];
                console.log(allPics[""+one_pic_index]);
                if(one_pic == "fileselect[]")
                    break;
                let ext = one_pic.path.split('.');
                ext = ext[ext.length - 1];
                var filename = think.md5(one_pic.originalFilename+think.md5(new Date())).substr(0, 5) +  '.' + ext;//md5加密
                var dir = think.RESOURCE_PATH + '/static/shop/images/'+new Date().getFullYear() + (new Date().getMonth() + 1)+new Date().getDate();
                if(!fs.existsSync(dir)){
                    fs.mkdir(dir,'0755');
                }
                dir = dir +'/'+ product_name;
                if(!fs.existsSync(dir)){
                    fs.mkdir(dir,'0755');
                }

                var targetfile = dir + '/' + filename;
                fs.rename(one_pic.path, targetfile);
                //取得相对路径
                let relPath = targetfile.substring(targetfile.indexOf('/static/shop/images/'));
                console.log(relPath);
                //picture表插入操作
                let pic_id = yield this.model('picture').add({
                    product_id: product_id,
                    type: product_type,
                    small_path:relPath,
                    mid_path:relPath,
                    big_path:relPath,
                });
            }
		}
		return this.display();
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