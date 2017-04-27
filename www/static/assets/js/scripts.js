/**
 * Created by zhangyang on 17/4/17.
 */
/** Toastr

 TYPE:
 primary
 info
 error
 sucess
 warning

 POSITION
 top-right
 top-left
 top-center
 top-full-width
 bottom-right
 bottom-left
 bottom-center
 bottom-full-width

 USAGE:
 _toastr("My Message here","top-right","error",false);

 NOTE:
 _onclick = url to redirect (example: http://www.stepofweb.com)
 **************************************************************** **/
function _toastr(_message,_position,_notifyType,_onclick) {
	var _btn 	= $(".toastr-notify");

	if(_btn.length > 0 || _message != false) {

		loadScript(plugin_path + 'toastr/toastr.js', function() {
			// toastr.clear();

			/** BUTTON CLICK
			 ********************* **/
			_btn.on("click", function(e) {
				e.preventDefault();


				var _message 			= jQuery(this).attr('data-message'),
						_notifyType 		= jQuery(this).attr('data-notifyType')			|| "default",
						_position	 		= jQuery(this).attr('data-position')			|| "top-right",
						_progressBar 		= jQuery(this).attr('data-progressBar') 		== "true" ? true : false,
						_closeButton		= jQuery(this).attr('data-closeButton') 		== "true" ? true : false,
						_debug		 		= jQuery(this).attr('data-debug') 				== "true" ? true : false,
						_newestOnTop 		= jQuery(this).attr('data-newestOnTop') 		== "true" ? true : false,
						_preventDuplicates	= jQuery(this).attr('data-preventDuplicates') 	== "true" ? true : false,
						_showDuration 		= jQuery(this).attr('data-showDuration') 		|| "300",
						_hideDuration 		= jQuery(this).attr('data-hideDuration') 		|| "1000",
						_timeOut 			= jQuery(this).attr('data-timeOut') 			|| "5000",
						_extendedTimeOut	= jQuery(this).attr('data-extendedTimeOut')		|| "1000",
						_showEasing 		= jQuery(this).attr('data-showEasing') 			|| "swing",
						_hideEasing 		= jQuery(this).attr('data-hideEasing') 			|| "linear",
						_showMethod 		= jQuery(this).attr('data-showMethod') 			|| "fadeIn",
						_hideMethod 		= jQuery(this).attr('data-hideMethod') 			|| "fadeOut";

				toastr.options = {
					"closeButton": 			_closeButton,
					"debug": 				_debug,
					"newestOnTop": 			_newestOnTop,
					"progressBar": 			_progressBar,
					"positionClass": 		"toast-" + _position,
					"preventDuplicates": 	_preventDuplicates,
					"onclick": 				null,
					"showDuration": 		_showDuration,
					"hideDuration": 		_hideDuration,
					"timeOut": 				_timeOut,
					"extendedTimeOut": 		_extendedTimeOut,
					"showEasing": 			_showEasing,
					"hideEasing": 			_hideEasing,
					"showMethod": 			_showMethod,
					"hideMethod": 			_hideMethod
				}

				toastr[_notifyType](_message);
			});


			/** JAVSCRIPT / ON LOAD
			 ************************* **/
			if(_message != false) {

				if(_onclick != false) {
					onclick = function() {
						window.location = _onclick;
					}
				} else {
					onclick = null
				}

				toastr.options = {
					"closeButton": 			true,
					"debug": 				false,
					"newestOnTop": 			false,
					"progressBar": 			true,
					"positionClass": 		"toast-" + _position,
					"preventDuplicates": 	false,
					"onclick": 				onclick,
					"showDuration": 		"300",
					"hideDuration": 		"1000",
					"timeOut": 				"5000",
					"extendedTimeOut": 		"1000",
					"showEasing": 			"swing",
					"hideEasing": 			"linear",
					"showMethod": 			"fadeIn",
					"hideMethod": 			"fadeOut"
				}

				setTimeout(function(){
					toastr[_notifyType](_message);
				}, 0); // delay 1.5s
			}
		});

	}

}
/** Load Script

 USAGE
 var pageInit = function() {}
 loadScript(plugin_path + "script.js", function);

 Load multiple scripts and call a final function
 loadScript(plugin_path + "script1.js", function(){
		loadScript(plugin_path + "script2.js", function(){
			loadScript(plugin_path + "script3.js", function(){
				loadScript(plugin_path + "script4.js", function);
			});
		});
	});
 **************************************************************** **/
var _arr 	= {};
function loadScript(scriptName, callback) {

	if (!_arr[scriptName]) {
		_arr[scriptName] = true;

		var body 		= document.getElementsByTagName('body')[0];
		var script 		= document.createElement('script');
		script.type 	= 'text/javascript';
		script.src 		= scriptName;

		// then bind the event to the callback function
		// there are several events for cross browser compatibility
		// script.onreadystatechange = callback;
		script.onload = callback;

		// fire the loading
		body.appendChild(script);

	} else if (callback) {

		callback();

	}

};

function getQueryStringArgs() {

	//取得查询字符串并去掉？
	var qs = (location.search.length > 0 ? location.search.substring(1) : ""),

			//保存数据的对象
			args = {},

			//取得每一项
			items = qs.length ? qs.split("&") : [],
			item = null,
			name = null,
			value = null,

			len = items.length;

	//逐个将每一项添加到args对象中
	for( var i=0; i<len; i++){
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);

		if(name.length){
			args[name] = value;
		}
	}

	return args;
}

$('#addBasket').click(function(){
	var loginMessage = document.getElementById('login');
	if(loginMessage == null){
		_toastr("您还没登录老铁！","top-right","error",false);
	}else{
		var productNumber = document.getElementById('text_box').value;
		var args = getQueryStringArgs();
		// console.log(args.productId);
		$.ajax({
			url: "/user/cart/index",
			type: "post",
			data: {productId: args.productId, number: productNumber},
			success: function(msg){
				// console.log(msg);
				switch(msg.data){
					case 1:
						_toastr("添加购物车成功！","top-right","success",false);
						window.open("/cart/index", "_blank");
						break;
				}
			}
		})
	}
});