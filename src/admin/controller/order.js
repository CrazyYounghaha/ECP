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
		this.assign("style","order");

        let orderList = null;
        if (this.isPost()) {
			//获取筛选信息
            let conditionList = this.post();
            console.log(conditionList);
            //查询条件初始化
            let conditions = "1=1";

            //判断是否填入:
            if(conditionList.order_startdate != '')
                conditions += " and date_format(order_time, '%Y-%m-%d') >= " + "'" +  conditionList.order_startdate + "'";
            if(conditionList.order_enddate != '')
                conditions += " and date_format(order_time, '%Y-%m-%d') <= " + "'" + conditionList.order_enddate + "'";
            if(conditionList.pay_startdate != '')
                conditions += " and date_format(pay_time, '%Y-%m-%d') >= " + "'" +  conditionList.pay_startdate + "'";
            if(conditionList.pay_enddate != '')
                conditions += " and date_format(pay_time, '%Y-%m-%d') <= " + "'" + conditionList.pay_enddate + "'";
            if(conditionList.pay_type != -1)
                conditions += ' and pay_type = ' +  conditionList.pay_type;
            if(conditionList.order_status != -1)
                conditions += ' and status = '+ conditionList.order_status;
            if(conditionList.keyword_buyer != '')
                conditions += ' and name LIKE '+ "'%" + conditionList.keyword_buyer + "%'";
            orderList = yield this.model("order_history").join("ecp_user on ecp_order.user_id=ecp_user.user_id").where(conditions).select();
		}
		else{
            orderList = yield this.model("order_history").join("ecp_user on ecp_order_history.user_id=ecp_user.user_id").select();
		}
        console.log(orderList);
        this.assign('orderList',orderList);
        this.assign('orderStatus',this.getOrderStatus());
        this.assign('payType',this.getPayType());
		return this.display();
	}
    *deleteAction(){
        yield this.weblogin();
        this.assign("style","order");


        if (this.isAjax()) {
            let order_ids_str = this.post('product_ids');
            order_ids_str = order_ids_str.substring(0,order_ids_str.length-1);
            let order_ids = order_ids_str.split(',');
            // console.log(order_ids);

            let model = this.model('order');
            for(let i = 0;i < order_ids.length;i++){
                let cur_order_id = order_ids[i];
                try{
                    yield model.startTrans();//事务处理
                    yield this.model('orderdetail').where({order_id: ['=', cur_order_id]}).delete();
                    yield model.where({order_id: ['=', cur_order_id]}).delete();
                    yield model.commit();
                }catch(e){
                    yield model.rollback();
                    return this.success(-1);
                }
            }
            return this.success(1);
        }

        return this.display();
    }
    *showoneorderAction(){
        yield this.weblogin();
        this.assign("style","showoneorder");
        if(this.isGet('order_history_id')) {
            let order_id = this.get('order_history_id');
            let order_result = yield this.model('order_history_detail').join({
                table: "order_history",
                join: "left",
                on: ["order_history_id", "order_history_id"]
            }).join({
                table: "product",
                join: "left",
                on: ["product_id","product_id"]
            }).where({"ecp_order_history.order_history_id": order_id}).select();
            // console.log(order_result);
            let user_id = order_result[0].user_id;
            let address_result = yield this.model('address').where({user_id: user_id}).find();
            if (think.isEmpty(order_result)) {
                return this.redirect('/admin/order/index');
            }
            this.assign("orderDetail",order_result);
            this.assign('payType',this.getPayType());
            this.assign('addressInfo',address_result);
            return this.display();
        }
        return this.redirect('/admin/order/index');
    }
    *updateorderstatusAction(){
        yield this.weblogin();
        if(this.isAjax()){
            let cur_order_id = this.post('cur_order_id');//所操作的订单id
            let update_order_action_id = this.post('update_order_action_id');//修改操作类型
            if(!think.isEmpty(cur_order_id)　&&  update_order_action_id !== -1){
                console.log(update_order_action_id);
                if(update_order_action_id == 0){//取消订单
                    yield this.model('order_history').where({order_history_id: cur_order_id}).update({status:0});
                    return this.success(1);
                }
                else if(update_order_action_id == 1){//发货完成
                    yield this.model('order_history').where({order_history_id: cur_order_id}).update({status:2});
                    return this.success(1);
                }
            }
            // console.log(update_order_action_id);

            return this.success(-1);
        }
        return this.redirect('/admin/order/index');
    }
}