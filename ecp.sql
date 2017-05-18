/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Version : 50715
 Source Host           : localhost
 Source Database       : ecp

 Target Server Version : 50715
 File Encoding         : utf-8

 Date: 05/15/2017 09:42:28 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `ecp_address`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_address`;
CREATE TABLE `ecp_address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `receiver_name` varchar(16) DEFAULT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `province` varchar(16) DEFAULT NULL,
  `city` varchar(16) DEFAULT NULL,
  `town` varchar(16) DEFAULT NULL,
  `full_address` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`address_id`),
  KEY `f_address_user` (`user_id`),
  CONSTRAINT `f_address_user` FOREIGN KEY (`user_id`) REFERENCES `ecp_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_address`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_address` VALUES ('1', 'Green', '13378660121', '山东', '青岛', '崂山', null, '3'), ('2', 'Green', '13378660121', '浙江', '宁波', '北仑', null, '3'), ('3', 'Crazy', '17680092376', '山东', '青岛', '市南', null, '2'), ('7', '无情老智', '15866848705', '山东省', '青岛市', '市南区', '宁夏路308号汇一', '4'), ('8', '常山赵肥蛇', '13666666666', '山东省', '淄博市', '张店区', '肥蛇路308号', '4'), ('9', '石的四次方', '15866848705', '山东省', '济南市', '章丘市', '石家庄路100号', '4');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_admin`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_admin`;
CREATE TABLE `ecp_admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `email` varchar(32) DEFAULT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `permission` int(11) DEFAULT '0' COMMENT '权限：0-普通管理员；1-超级管理员',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_admin`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_admin` VALUES ('1', 'admin_0', 'e10adc3949ba59abbe56e057f20f883e', 'admin_0@163.com', '13877772332', '1'), ('2', 'admin_1', 'c33367701511b4f6020ec61ded352059', 'admin_1@163.com', '13823287610', '0');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_admin_login_record`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_admin_login_record`;
CREATE TABLE `ecp_admin_login_record` (
  `ecp_admin_login_record_id` int(11) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  PRIMARY KEY (`ecp_admin_login_record_id`),
  KEY `f_login_admin` (`admin_id`),
  CONSTRAINT `f_login_admin` FOREIGN KEY (`admin_id`) REFERENCES `ecp_admin` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_admin_login_record`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_admin_login_record` VALUES ('1', '1', '2017-03-23 09:58:41'), ('2', '1', '2017-03-24 12:38:56'), ('3', '2', '2017-03-22 16:15:18');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_cartdetail`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_cartdetail`;
CREATE TABLE `ecp_cartdetail` (
  `cartdetail_id` int(11) NOT NULL AUTO_INCREMENT,
  `price` decimal(10,0) DEFAULT NULL,
  `product_count` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `shoppingcart_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`cartdetail_id`),
  KEY `f_cartdetail_pro` (`product_id`),
  KEY `f_cartdetail_shopcart` (`shoppingcart_id`),
  CONSTRAINT `f_cartdetail_pro` FOREIGN KEY (`product_id`) REFERENCES `ecp_product` (`product_id`),
  CONSTRAINT `f_cartdetail_shopcart` FOREIGN KEY (`shoppingcart_id`) REFERENCES `ecp_shoppingcart` (`shoppingcart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_cartdetail`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_cartdetail` VALUES ('1', '5999', '6', '2', '1'), ('2', '5999', '6', '2', '2'), ('3', '78', '1', '1', '2');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_feedback`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_feedback`;
CREATE TABLE `ecp_feedback` (
  `feedback_id` int(11) NOT NULL AUTO_INCREMENT,
  `star_level` tinyint(6) DEFAULT '5',
  `detail` varchar(1024) DEFAULT '此用户未填写详细评价',
  `time` datetime DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`feedback_id`),
  KEY `f_fb_product` (`product_id`),
  KEY `f_fb_order` (`order_id`),
  KEY `f_fb_user` (`user_id`),
  CONSTRAINT `f_fb_order` FOREIGN KEY (`order_id`) REFERENCES `ecp_order` (`order_id`),
  CONSTRAINT `f_fb_product` FOREIGN KEY (`product_id`) REFERENCES `ecp_product` (`product_id`),
  CONSTRAINT `f_fb_user` FOREIGN KEY (`user_id`) REFERENCES `ecp_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ecp_order`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_order`;
CREATE TABLE `ecp_order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `total_count` int(11) DEFAULT NULL,
  `total_pay` decimal(10,0) DEFAULT NULL,
  `order_time` datetime DEFAULT NULL,
  `pay_time` datetime DEFAULT NULL,
  `status` tinyint(6) DEFAULT '0' COMMENT '-1-已取消，0-待付款，1-已付款，2-已完成',
  `shoppingcart_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `f_order_shopcart` (`shoppingcart_id`),
  KEY `f_order_user` (`user_id`),
  KEY `f_order_address` (`address_id`),
  CONSTRAINT `f_order_address` FOREIGN KEY (`address_id`) REFERENCES `ecp_address` (`address_id`),
  CONSTRAINT `f_order_shopcart` FOREIGN KEY (`shoppingcart_id`) REFERENCES `ecp_shoppingcart` (`shoppingcart_id`),
  CONSTRAINT `f_order_user` FOREIGN KEY (`user_id`) REFERENCES `ecp_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_order`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_order` VALUES ('1', '2', '6077', '2017-03-21 15:51:44', '2017-03-21 15:58:33', '0', '2', '2', '3');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_order_history`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_order_history`;
CREATE TABLE `ecp_order_history` (
  `order_history_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_count` int(11) DEFAULT NULL,
  `order_pay` int(11) DEFAULT NULL COMMENT '支付总额',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `pay_type` tinyint(6) DEFAULT '1' COMMENT '0-货到付款，1-支付宝',
  `status` tinyint(6) DEFAULT NULL COMMENT '-1-已取消，0-待付款，1-已付款(待发货)，2-待收货，3-待评价',
  `user_id` int(11) NOT NULL,
  `address_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`order_history_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `ecp_order_history`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_order_history` VALUES ('7', '1', '5999', '2017-05-12 11:14:31', '1', '1', '4', '7'), ('8', '2', '11998', '2017-05-12 11:22:13', '1', '1', '4', '7'), ('10', '3', '17997', '2017-05-12 11:38:25', '1', '1', '4', '7'), ('11', '2', '12998', '2017-05-12 14:40:40', '1', '1', '4', '7');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_order_history_detail`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_order_history_detail`;
CREATE TABLE `ecp_order_history_detail` (
  `order_history_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `count` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_history_id` int(11) NOT NULL,
  PRIMARY KEY (`order_history_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `ecp_order_history_detail`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_order_history_detail` VALUES ('1', '1', '2', '7'), ('2', '2', '2', '8'), ('3', '3', '2', '10'), ('4', '1', '2', '11'), ('5', '1', '3', '11');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_orderdetail`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_orderdetail`;
CREATE TABLE `ecp_orderdetail` (
  `orderdetail_id` int(11) NOT NULL AUTO_INCREMENT,
  `price` decimal(10,0) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`orderdetail_id`),
  KEY `f_od_pro` (`product_id`),
  KEY `f_od_order` (`order_id`),
  CONSTRAINT `f_od_order` FOREIGN KEY (`order_id`) REFERENCES `ecp_order` (`order_id`),
  CONSTRAINT `f_od_pro` FOREIGN KEY (`product_id`) REFERENCES `ecp_product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_orderdetail`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_orderdetail` VALUES ('1', '5999', '1', '2', '1'), ('2', '78', '1', '1', '1');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_picture`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_picture`;
CREATE TABLE `ecp_picture` (
  `picture_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` tinyint(6) DEFAULT '1' COMMENT '0-icon标题图片，1-商品详情图片, 2-购物车图片',
  `product_id` int(11) DEFAULT NULL,
  `small_path` varchar(64) DEFAULT NULL,
  `mid_path` varchar(64) DEFAULT NULL,
  `big_path` varchar(64) DEFAULT NULL,
  `cart_picture` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`picture_id`),
  KEY `f_pic_product` (`product_id`),
  CONSTRAINT `f_pic_product` FOREIGN KEY (`product_id`) REFERENCES `ecp_product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_picture`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_picture` VALUES ('1', '0', '1', 'localhost://img/pic_001.jpg', null, null, null), ('2', '1', '1', 'localhost://img/pic_002.jpg', null, null, null), ('3', '1', '1', 'localhost://img/pic_003.jpg', null, null, null), ('5', '1', '2', '/static/shop/images/iphone7_small_01.jpg', '/static/shop/images/iphone7_mid_01.jpg', '/static/shop/images/iphone7_big_01.jpg', null), ('6', '1', '2', '/static/shop/images/iphone7_small_02.jpg', '/static/shop/images/iphone7_mid_02.jpg', '/static/shop/images/iphone7_big_02.jpg', null), ('7', '1', '2', '/static/shop/images/iphone7_small_03.jpg', '/static/shop/images/iphone7_mid_03.jpg', '/static/shop/images/iphone7_big_03.jpg', null), ('8', '2', '2', null, null, null, '/static/shop/images/iphone7_cart.jpg'), ('10', '1', '3', '/static/shop/images/y480_small_01.jpg', '/static/shop/images/y480_mid_01.jpg', '/static/shop/images/y480_big_01.jpg', null), ('11', '1', '3', '/static/shop/images/y480_small_02.jpg', '/static/shop/images/y480_mid_02.jpg', '/static/shop/images/y480_big_02.jpg', null), ('12', '1', '3', '/static/shop/images/y480_small_03.jpg', '/static/shop/images/y480_mid_03.jpg', '/static/shop/images/y480_big_03.jpg', null), ('13', '1', '3', '/static/shop/images/y480_small_04.jpg', '/static/shop/images/y480_mid_04.jpg', '/static/shop/images/y480_big_04.jpg', null), ('14', '2', '3', null, null, null, '/static/shop/images/y480_cart.jpg');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_product`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_product`;
CREATE TABLE `ecp_product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `detail` text,
  `price` decimal(10,0) DEFAULT NULL,
  `inventory` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `picture` varchar(100) DEFAULT NULL,
  `cart_picture` varchar(100) DEFAULT NULL,
  `cumulative_sales` int(11) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `f_product_type` (`type`),
  CONSTRAINT `f_product_type` FOREIGN KEY (`type`) REFERENCES `ecp_product_type` (`product_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_product`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_product` VALUES ('1', 'Android从入门到放弃', 'Android系列教材第二版震撼出版，详细讲解安卓各大组件及原理，由浅入深，通俗易懂！', '78', '500', '8', '/static/shop/images/', null, '11'), ('2', 'Apple iPhone 7 Plus(A1661) 128G 亮黑', '5.5英寸显示屏，1920*1080分辨率，3D touch,1200万像素摄像头', '5999', '988', '6', '/static/shop/images/iphone7.jpg', '/static/shop/images/iphone7_cart.jpg', '79'), ('3', '联想Y480 1T硬盘 8G内存 GTX650m独立显卡', '14英寸显示屏', '6999', '493', '6', '/static/shop/images/y480.jpg', '/static/shop/images/y480_cart.jpg', '12');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_product_type`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_product_type`;
CREATE TABLE `ecp_product_type` (
  `product_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `tname` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`product_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_product_type`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_product_type` VALUES ('1', '潮流女装'), ('2', '品牌男装'), ('3', '美妆个护'), ('4', '家用电器'), ('5', '电脑办公'), ('6', '手机数码'), ('7', '母婴童装'), ('8', '图书音像'), ('9', '家居家纺'), ('10', '厨房用品'), ('11', '家具建材'), ('12', '食品生鲜'), ('13', '酒水饮料'), ('14', '运动户外'), ('15', '鞋靴箱包'), ('16', '奢品礼品'), ('17', '钟表珠宝'), ('18', '玩具乐器'), ('19', '内衣配饰'), ('20', '汽车用品'), ('21', '医药保健'), ('22', '计生情趣'), ('23', '全球购'), ('24', '生活旅行'), ('25', '宠物农资');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_shoppingcart`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_shoppingcart`;
CREATE TABLE `ecp_shoppingcart` (
  `shoppingcart_id` int(11) NOT NULL AUTO_INCREMENT,
  `add_time` datetime DEFAULT NULL,
  `total` int(10) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1' COMMENT '0-此购物车无效，1-购物车有效',
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`shoppingcart_id`),
  KEY `f_cart_user` (`user_id`),
  CONSTRAINT `f_cart_user` FOREIGN KEY (`user_id`) REFERENCES `ecp_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_shoppingcart`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_shoppingcart` VALUES ('1', '2017-03-21 14:42:04', '5', '1', '1'), ('2', '2017-03-20 20:44:38', '6', '1', '2');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_user`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_user`;
CREATE TABLE `ecp_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  `email` varchar(32) DEFAULT NULL,
  `phone` varchar(16) DEFAULT NULL,
  `add_time` datetime DEFAULT NULL,
  `is_online` tinyint(4) DEFAULT '0' COMMENT '登录状态：0-离线，1-在线；默认离线',
  `is_vip` tinyint(4) DEFAULT '0' COMMENT '0：非vip，1-vip',
  `head` varchar(64) DEFAULT '/static/shop/images/hwbn40x40.jpg' COMMENT '用户头像',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_user`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_user` VALUES ('1', 'Duke', '96e79218965eb72c92a549dd5a330112', 'duke@126.com', '15388267369', '2017-03-10 17:00:38', '0', '0', '/static/shop/images/hwbn40x40.jpg'), ('2', 'Crazy', 'e3ceb5881a0a1fdaad01296d7554868d', 'crazy@126.com', '18377159066', '2017-03-15 21:53:43', '0', '0', '/static/shop/images/hwbn40x40.jpg'), ('3', 'Green', '1a100d2c0dab19c4430e7d73762b3423', 'green@126.com', '15026776981', '2017-03-17 12:06:55', '0', '0', '/static/shop/images/hwbn40x40.jpg'), ('4', 'newp', '4b2e0cd127b101639e47213e70d402a5', null, null, '2017-04-13 14:03:47', '1', '0', '/static/shop/images/hwbn40x40.jpg');
COMMIT;

-- ----------------------------
--  Table structure for `ecp_user_login_record`
-- ----------------------------
DROP TABLE IF EXISTS `ecp_user_login_record`;
CREATE TABLE `ecp_user_login_record` (
  `ecp_user_login_record_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `login_time` datetime DEFAULT NULL,
  PRIMARY KEY (`ecp_user_login_record_id`),
  KEY `f_login_user` (`user_id`),
  CONSTRAINT `f_login_user` FOREIGN KEY (`user_id`) REFERENCES `ecp_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ecp_user_login_record`
-- ----------------------------
BEGIN;
INSERT INTO `ecp_user_login_record` VALUES ('1', '4', '2017-04-13 14:04:50'), ('2', '4', '2017-04-13 14:14:12'), ('3', '4', '2017-04-17 10:11:10'), ('4', '4', '2017-04-17 16:36:08'), ('5', '4', '2017-04-17 16:53:46'), ('6', '4', '2017-04-17 17:18:47'), ('7', '4', '2017-04-19 10:38:28'), ('8', '4', '2017-04-19 15:57:07'), ('9', '4', '2017-04-20 09:02:51'), ('10', '4', '2017-04-20 09:04:53'), ('11', '4', '2017-04-20 09:06:22'), ('12', '4', '2017-04-22 18:24:10'), ('13', '4', '2017-04-22 18:37:44'), ('14', '4', '2017-04-22 18:38:16'), ('15', '4', '2017-04-22 18:39:25'), ('16', '4', '2017-04-26 09:23:19'), ('17', '4', '2017-04-26 09:25:36'), ('18', '4', '2017-04-27 13:19:20'), ('19', '4', '2017-04-27 17:01:56'), ('20', '4', '2017-04-29 18:02:54'), ('21', '4', '2017-04-30 16:54:38'), ('22', '4', '2017-05-05 14:38:56'), ('23', '4', '2017-05-08 12:56:22'), ('24', '4', '2017-05-12 09:06:05'), ('25', '4', '2017-05-15 09:33:39'), ('26', '4', '2017-05-15 09:33:45'), ('27', '4', '2017-05-15 09:40:22');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
