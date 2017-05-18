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
		//auto render template file index/index.html
		this.assign("style","product");
		//返回商品类型列表
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
		// console.log(productsList);
		this.assign("productsList",productsList);
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
            //插入库存记录
            yield this.model('add_store_record').add({
                add_product_id:product_id,
                add_store_count:productInfo.product_inventory,
                add_store_time:dateformat('Y-m-d H:i:s',new Date().valueOf())
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
            let product_ids_str = this.post('product_ids');
            product_ids_str = product_ids_str.substring(0,product_ids_str.length-1);
            let product_ids = product_ids_str.split(',');
            // return this.success(1);

            for(let i = 0;i < product_ids.length;i++){
                let product_id = product_ids[i];
                console.log("delete "+product_id);
                let model = this.model('product');
                try{
                    yield model.startTrans();//事务处理
                    let product_pics_paths = yield this.model('picture').limit(1).where({product_id:product_id}).field('small_path').select();
                    if(!think.isEmpty(product_pics_paths)) {

                        let product_pics_path = product_pics_paths[0].small_path;
                        let product_pics_dir = product_pics_path.substring(0, product_pics_path.lastIndexOf('/'));
                        //删除图片

                        yield this.deleteFolderRecursive(think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + product_pics_dir);
                        // console.log(product_pics_dir);
                    }
                    // console.log("delete 1st");
                    yield this.model('picture').where({product_id: ['=', product_id]}).delete();
                    yield model.where({product_id: ['=', product_id]}).update({is_onsale:2});
                    // yield model.where({product_id: ['=', product_id]}).delete();
                    yield model.commit();
                }catch(e){
                    yield model.rollback();
                    return this.success(-1);
                }
            }
            return this.success(1);
        }
        return this.success(-1);
    }
    //显示商品详情
    *showoneproductAction(){
        yield this.weblogin();
        this.assign("style","showoneproduct");

        if(this.isGet('productid')){
            let product_id = this.get('productid');
            let product_result = yield this.model('product').limit(1).where({product_id:product_id}).find();
            console.log(product_result);
            if(think.isEmpty(product_result)){
                return this.redirect('/admin/product/index');
            }
            let product_type = yield this.model("product_type").select();
            this.assign("product_typeList",product_type);
            this.assign("product",product_result);
            console.log(product_result);
            return this.display();
        }
        return this.redirect('/admin/product/index');
    }

	*commentAction(){
        yield this.weblogin();
		this.assign("style","comment");
		return this.display();
	}

}