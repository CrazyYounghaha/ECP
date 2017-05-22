/**
 * Created by 张扬 on 2017/5/22.
 */
export default {
		on: true, //是否开启 WebSocket
		type: "socket.io",
		allow_origin: "",
		sub_protocal: "",
		adapter: undefined,
		path: "", //url path for websocket
		messages: {
				open: 'user/demo/open',
				close: 'user/demo/close',
				chat: 'user/demo/chat',
				typing: 'user/demo/typing',
				stoptyping: 'user/demo/stoptyping',
				adduser: 'user/demo/adduser'
		}
};