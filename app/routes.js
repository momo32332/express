module.exports = function(app, passport) {
 /* GET home page. */
 app.get('/', function(req, res){
  res.render('index.ejs');
 });
 //將message這個變數放進loginMessage裡
 app.get('/login', function(req, res){
  res.render('login.ejs', {message:req.flash('loginMessage')});
 });
 //設置當驗證成功或失敗時跳轉到'string'
 app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
 }),
 //cookie相關設定
 function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 3;
   }else{
    req.session.cookie.expires = false;
   }
   res.redirect('/');
  });
  
  app.get('/signup', function(req, res){
  res.render('signup.ejs', {message: req.flash('signupMessage')});
 });
 
 app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true
 }));
 
 app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile.ejs', {
   user:req.user
  });
 });
 
 app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
 })
};

//某個頁面需要登入後訪問，可以判斷req.isAuthenticated()返回值
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');
}