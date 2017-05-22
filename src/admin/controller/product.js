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
            console.log(allPics);
            // let index = 0;
            const fs = require('fs'); //引入fs处理文件
            const images = require("images");//引入images图片处理文件
            let index_pic = 1;
            // console.log(allPics['0']);
            //若未上传图片，则终止图片上传
            if(allPics.size == 0){
                return this.display();
            }
            //若只有一张图片
            if(allPics['0'] == undefined){
                let t = allPics;
                allPics = {};
                allPics['0'] = t;
                console.log(allPics);
            }
            //循环处理图片组
            for(let one_pic_index in allPics){
                let one_pic = allPics[""+one_pic_index];
                console.log(allPics[""+one_pic_index]);

                let ext = one_pic.path.split('.');
                ext = ext[ext.length - 1];
                var filename = think.md5(one_pic.originalFilename+think.md5(new Date())).substr(0, 5);//md5加密
                var dir = think.RESOURCE_PATH + '/static/shop/images/'+new Date().getFullYear() + (new Date().getMonth() + 1)+new Date().getDate();
                if(!fs.existsSync(dir)){
                    fs.mkdir(dir,'0755');
                }
                dir = dir +'/'+ product_name;
                if(!fs.existsSync(dir)){
                    fs.mkdir(dir,'0755');
                }
                // console.log(dir);
                //如果是第一张图片，则设置搜索结果、购物车图片
                if(index_pic == 1){
                    let pic_path = dir + '/' + filename + "_pic"+ index_pic + '.' + ext;
                    let cart_pic_path = dir + '/' + filename +"_cart_pic"+ index_pic+  '.' + ext;
                    //取得相对路径
                    let pic_relPath = pic_path.substring(pic_path.indexOf('/static/shop/images/'));
                    let cart_pic_relPath = cart_pic_path.substring(cart_pic_path.indexOf('/static/shop/images/'));
                    images(one_pic.path)                     //Load image from file
                        .resize(218,218)
                        .save(pic_path, {           //Save the image to a file,whih quality 50
                            operation : 100                    //保存图片到文件,设置图片质量
                        })
                        .resize(80,80)
                        .save(cart_pic_path, {           //Save the image to a file,whih quality 50
                            operation : 100                    //保存图片到文件,设置图片质量
                        });

                    let product_pic_id = yield this.model('product').where({product_id: ['=', product_id]}).update({
                        cart_picture:pic_relPath,
                        picture:cart_pic_relPath
                    });
                }
                //详情页小图、中图、大图压缩设置
                let sm_pic_path = dir + '/' + filename +"_sm_pic" + index_pic +  '.' + ext;
                let mid_pic_path = dir + '/' + filename +"_mid_pic" + index_pic +  '.' + ext;
                let big_pic_path = dir + '/' + filename +"_big_pic" + index_pic +  '.' + ext;

                images(one_pic.path)                     //Load image from file
                    .resize(60,60)
                    .save(sm_pic_path, {           //Save the image to a file,whih quality 50
                        operation : 1000                    //保存图片到文件,设置图片质量
                    });
                images(one_pic.path)                     //Load image from file
                    .resize(400,400)
                    .save(mid_pic_path, {           //Save the image to a file,whih quality 50
                        operation : 1000                    //保存图片到文件,设置图片质量
                    });
                images(one_pic.path)                     //Load image from file
                    .resize(938,938)
                    .save(big_pic_path, {           //Save the image to a file,whih quality 50
                        operation : 1000                    //保存图片到文件,设置图片质量
                    });
                //取得相对路径
                let sm_pic_relPath = sm_pic_path.substring(sm_pic_path.indexOf('/static/shop/images/'));
                let mid_pic_relPath = mid_pic_path.substring(mid_pic_path.indexOf('/static/shop/images/'));
                let big_pic_relPath = big_pic_path.substring(big_pic_path.indexOf('/static/shop/images/'));
                // var targetfile = dir + '/' + filename;
                // fs.rename(one_pic.path, targetfile);
                //取得相对路径
                // let relPath = targetfile.substring(targetfile.indexOf('/static/shop/images/'));


                // console.log(relPath);
                //picture表插入操作
                let pic_id = yield this.model('picture').add({
                    product_id: product_id,
                    type: 1,
                    small_path:sm_pic_relPath,
                    mid_path:mid_pic_relPath,
                    big_path:big_pic_relPath,
                });

                index_pic++;
            }
		}
		return this.display();
	}
    //修改商品
    *updateAction(){
        yield this.weblogin();
        this.assign("style","product");

        if(this.isPost()){
            let data = this.post();
            console.log(data);
            const fs = require('fs'); //引入fs处理文件
            const images = require("images");//引入images图片处理文件
            //删除图片
            for(let key in data){
                //找到选中的图片并删除
                if(key.indexOf('flag_') != -1){
                    let picture_id = key.replace('flag_','');
                    //删除图片think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + product_pics_dir
                    let picture = yield this.model('picture').where({picture_id: picture_id}).find();
                    let small_pic_path = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + picture.small_path;
                    let mid_pic_path = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + picture.mid_path;
                    let big_pic_path = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + picture.big_path;
                    // console.log(small_pic_path);
                    if( fs.existsSync(small_pic_path) ) {
                        fs.unlinkSync(small_pic_path);
                    }
                    if( fs.existsSync(mid_pic_path) ) {
                        fs.unlinkSync(mid_pic_path);
                    }
                    if( fs.existsSync(big_pic_path) ) {
                        fs.unlinkSync(big_pic_path);
                    }
                    //删除数据库图片记录
                    yield this.model('picture').where({picture_id: picture_id}).delete();
                }
                //更新商品表中其他字段
                yield this.model('product').where({product_id: data.product_id}).update({
                    name:data.product_name,
                    detail:data.product_detail,
                    price:parseInt(data.product_price),
                    type:parseInt(data.product_type),
                    is_onsale:parseInt(data.product_status)
                });
            }

            //获取新上传图片
            // console.log('post');
            let allPics = this.file('fileselect[]');
            console.log(allPics);
            let index_pic = 1;
            // console.log(allPics['0']);
            //若未上传图片，则终止图片上传
            if(allPics.size == 0){
                return this.redirect('/admin/product/index');
            }
            //若只有一张图片
            if(allPics['0'] == undefined){
                let t = allPics;
                allPics = {};
                allPics['0'] = t;
                console.log(allPics);
            }
            //获取图片所在文件夹
            let product_pics_path = yield this.model('product').where({product_id:data.product_id}).field('picture').find();
            let product_pic_path =  product_pics_path.picture;
            let product_pics_dir = product_pic_path.substring(0, product_pic_path.lastIndexOf('/'));
            var dir = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + product_pics_dir;
            // console.log(dir);
            // return this.display();
            //循环处理图片组
            for(let one_pic_index in allPics){
                let one_pic = allPics[""+one_pic_index];
                console.log(allPics[""+one_pic_index]);

                let ext = one_pic.path.split('.');
                ext = ext[ext.length - 1];
                var filename = think.md5(one_pic.originalFilename+think.md5(new Date())).substr(0, 5);//md5加密


                //详情页小图、中图、大图压缩设置
                let sm_pic_path = dir + '/' + filename +"_sm_pic" + index_pic +  '.' + ext;
                let mid_pic_path = dir + '/' + filename +"_mid_pic" + index_pic +  '.' + ext;
                let big_pic_path = dir + '/' + filename +"_big_pic" + index_pic +  '.' + ext;

                images(one_pic.path)                     //Load image from file
                    .resize(60,60)
                    .save(sm_pic_path, {           //Save the image to a file,whih quality 50
                        operation : 1000                    //保存图片到文件,设置图片质量
                    });
                images(one_pic.path)                     //Load image from file
                    .resize(400,400)
                    .save(mid_pic_path, {           //Save the image to a file,whih quality 50
                        operation : 1000                    //保存图片到文件,设置图片质量
                    });
                images(one_pic.path)                     //Load image from file
                    .resize(938,938)
                    .save(big_pic_path, {           //Save the image to a file,whih quality 50
                        operation : 1000                    //保存图片到文件,设置图片质量
                    });
                //取得相对路径
                let sm_pic_relPath = sm_pic_path.substring(sm_pic_path.indexOf('/static/shop/images/'));
                let mid_pic_relPath = mid_pic_path.substring(mid_pic_path.indexOf('/static/shop/images/'));
                let big_pic_relPath = big_pic_path.substring(big_pic_path.indexOf('/static/shop/images/'));

                //picture表插入操作
                let pic_id = yield this.model('picture').add({
                    product_id: data.product_id,
                    type: 1,
                    small_path:sm_pic_relPath,
                    mid_path:mid_pic_relPath,
                    big_path:big_pic_relPath,
                });

                index_pic++;
            }
            //修改购物车等图片
            let first_picture_record = yield this.model('picture').where({product_id: data.product_id}).find();
            //若未找到，则不更改购物车等图片;反之判断删除了购物车图片
            if(!think.isEmpty(first_picture_record)){
                //取得前缀，如65f1a_mid_pic1.jpg的前缀为65f1a
                let mid_pic = first_picture_record.mid_path;
                let mid_absolute_pic = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + mid_pic;
                let prefix_pic = mid_pic.substring(mid_pic.lastIndexOf('/'),mid_pic.indexOf('_mid_'));
                //判断product表中是否有picture前缀为上述的记录,若有，则不变，否则修改购物车等图片
                let product_record = yield this.model('product').where({product_id: data.product_id}).find();
                let product_pic_prefix = product_record.picture;
                if(product_pic_prefix.indexOf(prefix_pic) == -1){//未匹配到
                    // console.log('mid_absolute_pic'+mid_absolute_pic);
                    let father_dir = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + mid_pic.substring(0,mid_pic.lastIndexOf('/'));
                    let ext = mid_pic.substr(mid_pic.lastIndexOf('.')+1);
                    //则设置搜索结果、购物车图片
                    let pic_path = father_dir + prefix_pic + "_pic" + '.' + ext;
                    let cart_pic_path = father_dir + prefix_pic +"_cart_pic"+  '.' + ext;
                    // console.log('pic_path:'+pic_path);
                    //取得相对路径
                    let pic_relPath = pic_path.substring(pic_path.indexOf('/static/shop/images/'));
                    let cart_pic_relPath = cart_pic_path.substring(cart_pic_path.indexOf('/static/shop/images/'));
                    // console.log('pic_relPath:'+pic_relPath);
                    images(mid_absolute_pic)                     //Load image from file
                        .resize(218,218)
                        .save(pic_path, {           //Save the image to a file,whih quality 50
                            operation : 100                    //保存图片到文件,设置图片质量
                        })
                        .resize(80,80)
                        .save(cart_pic_path, {           //Save the image to a file,whih quality 50
                            operation : 100                    //保存图片到文件,设置图片质量
                        });

                    let product_pic_id = yield this.model('product').where({product_id: data.product_id}).update({
                        cart_picture:pic_relPath,
                        picture:cart_pic_relPath
                    });
                }
            }
        }
        return this.redirect('/admin/product/index');
    }
    //修改商品上架下架、失效状态
    *updatestatusAction(){
        this.assign("style","product");
        yield this.weblogin();
        if(this.isAjax()){
            // console.log(this.post());
            let product_id = this.post('product_id');
            let action_id = this.post('action_id');
            yield this.model('product').where({product_id: product_id}).update({
                is_onsale:parseInt(action_id)
            });
            return this.success(1);
        }
        return this.success(-1);
    }
    *deleteAction(){
        yield this.weblogin();
        if(this.isAjax()){
            const fs = require("fs");
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
                    let product_pics_paths = yield this.model('picture').where({product_id:product_id}).select();
                    for(let picture in product_pics_paths){
                        let sm_absolute_pic_path = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + picture.small_path;
                        let mid_absolute_pic_path = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + picture.mid_path;
                        let big_absolute_pic_path = think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + picture.big_path;
                        if( fs.existsSync(sm_absolute_pic_path) ){
                            fs.unlinkSync(sm_absolute_pic_path);
                        }
                        if( fs.existsSync(mid_absolute_pic_path) ){
                            fs.unlinkSync(mid_absolute_pic_path);
                        }
                        if( fs.existsSync(big_absolute_pic_path) ){
                            fs.unlinkSync(big_absolute_pic_path);
                        }
                    }
                    // if(!think.isEmpty(product_pics_paths)) {
                    //
                    //     let product_pics_path = product_pics_paths[0].small_path;
                    //     let product_pics_dir = product_pics_path.substring(0, product_pics_path.lastIndexOf('/'));
                    //     //删除图片
                    //
                    //     yield this.deleteFolderRecursive(think.RESOURCE_PATH.replace(new RegExp(/(\\)/g), '/') + product_pics_dir);
                    //     // console.log(product_pics_dir);
                    // }
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
            let picture_result = yield this.model('product').join({
                table: "picture",
                join: "inner",
                on: ["product_id","product_id"]
            }).where({'ecp_product.product_id':product_id,'ecp_picture.type':1}).select();
            // console.log(picture_result);
            if(think.isEmpty(product_result)){
                return this.redirect('/admin/product/index');
            }
            let product_type = yield this.model("product_type").select();
            this.assign("product_typeList",product_type);
            this.assign("product",product_result);
            this.assign("product_pictures",picture_result);
            // console.log(product_result);
            return this.display();
        }
        return this.redirect('/admin/product/index');
    }

	*getcommentAction(){
        yield this.weblogin();
		this.assign("style","comment");
		// console.log(result);
        //返回商品类型列表
        let product_type = yield this.model("product_type").select();
        this.assign("product_typeList",product_type);
        let commentsList;
        if (this.isPost()) {
            //获取筛选信息
            let conditionList = this.post();
            // console.log(conditionList);
            //查询条件初始化
            let conditions = "1=1";
            //判断是否填入:
            if(conditionList.startdate != '')
                conditions += " and date_format(time, '%Y-%m-%d') >= " + "'" +  conditionList.startdate + "'";
            if(conditionList.enddate != '')
                conditions += " and date_format(time, '%Y-%m-%d') <= " + "'" + conditionList.enddate + "'";
            if(conditionList.product_type != -1)
                conditions += ' and type = '+ conditionList.product_type;
            if(conditionList.feedback_star != -1)
                conditions += ' and star_level = '+ conditionList.feedback_star;
            if(conditionList.keyword != '')
                conditions += ' and ecp_product.name LIKE '+ "'%" + conditionList.keyword + "%'";
            commentsList = yield this.model("feedback").join({
                table: "user",
                join: "inner",
                on: ["user_id", "user_id"]
            }).join({
                table: "product",
                join: "inner",
                on: ["product_id", "product_id"]
            }).field('ecp_feedback.*,ecp_product.name as product_name,ecp_product.type as pro_type,ecp_user.name as user_name').where(conditions).select();
        }
        else {
            commentsList = yield this.model("feedback").join({
                table: "user",
                join: "inner",
                on: ["user_id", "user_id"]
            }).join({
                table: "product",
                join: "inner",
                on: ["product_id", "product_id"]
            }).field('ecp_feedback.*,ecp_product.name as product_name,ecp_product.type as pro_type,ecp_user.name as user_name').select();
            // console.log(commentsList);
        }
        this.assign("commentsList",commentsList);
        return this.display();
	}
	//删除评论
    *deletecommentAction(){
        yield this.weblogin();
        if(this.isAjax()){
            let feedback_ids_str = this.post('feedback_ids');
            feedback_ids_str = feedback_ids_str.substring(0,feedback_ids_str.length-1);
            let feedback_ids = feedback_ids_str.split(',');
            // return this.success(1);
            for(let i = 0;i < feedback_ids.length;i++){
                let feedback_id = feedback_ids[i];
                console.log("delete "+feedback_id);
                yield this.model('feedback').where({feedback_id: ['=', feedback_id]}).delete();
            }
            return this.success(1);
        }
        return this.success(-1);
    }

}