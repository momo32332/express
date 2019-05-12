var socket;
var uname = window.prompt('輸入使用者名稱:', '');

/*************function**************/
function setup(){
	socket = io(); //加載客戶端
	socket.on('chat', function(author, message){
		var format = 'i';
		if(author == uname) format = 'b';
		document.getElementById('chatContent').innerHTML += '<p><' + format + '>' + author + '</' + format + '> : ' + message + '</p>';
		$("#chatContent").scrollTop($("#chatContent")[0].scrollHeight);//滾輪軸在最底
	});
}

function send(){//發送訊息
	socket.emit('chat', document.getElementById('messageInput').value, uname);
	document.getElementById('messageInput').value = '';
	

}
/*************按鈕動作**************/
//Enter鍵
function keyin(event) { // 當按下 enter 鍵時，會呼叫此函數進行回答
      var keyCode = event.which; // 取出按下的鍵
      if (keyCode == 13) send();
 }

