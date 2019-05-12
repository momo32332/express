var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
passport.deserializeUser(function(id, done){
	connection.query("SELECT * FROM users where id = ?",[id],
	function(err, rows){
		done(err, rows[0]);
	});
});
//認證帳號密碼(註冊)
passport.use(
'local-signup',
new LocalStrategy({
	usernameField :'username',
	passwordField :'password',
	passReqToCallback: true
},
function(req, username, password, done){
connection.query("SELECT * FROM users WHERE username = ?",
[username], function(err, rows){
	if(err)
		return done(err);
	if(rows.length){
		return done(null, false, req.flash('signupMessage', '已被註冊'));//網頁提示字
	}else{
	  var newUserMysql = {
      username: username,
      password: bcrypt.hashSync(password, null, null)
     };
		var insertQuery = "INSERT INTO users (username, password) values (?, ?)";
		connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
		function(err, rows){
			newUserMysql.id = rows.insertId;
			
			return done(null, newUserMysql);
		});
	}
});
})
);
//登入
passport.use(
'local-login',
new LocalStrategy({
	usernameField : 'username',
	passwordField : 'password',
	passReqToCallback: true
},
function(req, username, password, done){
	connection.query("SELECT * FROM users WHERE username = ?", [username],
	function(err, rows){
		if(err)
			return done(err);
		if(!rows.length){
			return done(null, false, req.flash('loginMessage','無此用戶'));
		}
		if(!bcrypt.compareSync(password, rows[0].password))
			return done(null, false, req.flash('loginMessage','密碼錯誤'));
		
		return done(null, rows[0]);
	});
})
);
};