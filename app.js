var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var apiRouter = require('./routes/api');
var pageRouter = require('./routes/page');

var app = express();
const expressSession = require('express-session');

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason)
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({
    resave: true,   //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false,   //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    secret: '123456',
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


app.use('/', express.static(path.join(__dirname, 'public')));



// app.use('/*', function (req, res, next) {
//     //redisKey作为redis的key,最终取到redis里面的value为token值
//     var redisKey = req.cookies._i1_us || '';
//     if(redisKey) {
//         redisKey = utils.decrypt(config.webConfig.cookiePwd, redisKey);
//     }
//     // console.log('redisKey:' + redisKey);
//     if (redisKey) {
//         //已经登录
//         client.get(redisKey, function (err, reply) {
//             // reply is null when the key is missing
//             if (reply) {
//                 let r;
//                 try {
//                     r = JSON.parse(reply);
//                 }catch (e) {
//                     res.redirect('/login');
//                     return;
//                 }
//                 req.session.token = r.token;
//                 // console.log(r)
//                 var admin = r.admin;  //布尔值,是否管理员
//                 if (!admin) {
//                     res.redirect('/user/');
//                 } else {
//                     next();
//                 }
//             } else {
//                 res.redirect('/login');
//             }
//         });
//     } else {
//         //尚未登录,
//         req.session.token = null;
//         if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') {
//             //ajax请求
//             next();
//         } else {
//             //普通请求
//             // req.session.historyUrl = req.originalUrl;  //记录访问的url地址信息,以便登录后直接返回
//             var domain = req.cookies.domain || '';
//             var hostname = req.headers.host;
//             var url;
//             if (hostname && hostname != config.webConfig.domain.replace(/(http:\/\/|https:\/\/)/g,'')) {
//                 url = '/login';
//             } else {
//                 url = domain ? '/login?domain=' + domain : '/login';
//             }
//             res.redirect(url);
//         }
//     }

// });
app.use('/api', apiRouter);
app.use('/', pageRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
