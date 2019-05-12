var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function(socket){
	socket.on('chat', function(message, username){
		console.log('接收訊息, 暱稱:' + username + ', 訊息: ' + message);
		io.emit('chat',username , message);
	});
});

//載入public css,js
app.use(express.static(__dirname + '/public'));
//設定端口及連接成功顯示訊息
http.listen('3000', function() {
  console.log('連接伺服器');
});