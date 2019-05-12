var path = require('path');//定義web中間建
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
//
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', function(socket){
	socket.on('chat', function(message, uname){
		console.log('接收訊息, 暱稱:' + uname + ', 訊息: ' + message);
		io.emit('chat',uname , message);
	});
});


var port = process.env.PORT || 4000;

var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));
// 指定模板文件的后缀名为ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log("Port: " + port);