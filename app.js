const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const apiRouter = require('./routes/api');
const pageRouter = require('./routes/page');

const session = require('express-session');
const redis = require('redis');
const client = redis.createClient();//这里填写redis的密码
const RedisStore = require('connect-redis')(session);


client.on("error", function (err) {
    console.log("Error " + err);//用于提示错误信息
});

let options = {
    client: client,
    port: 6379,//端口号
    host: "127.0.0.1"//主机
};


const app = express();




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

// const expressSession = require('express-session');




app.use(session({
    store: new RedisStore(options),
    secret: "123456",//以此字符串加密
    resave: true,   //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false,   //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));


//



app.use('/', express.static(path.join(__dirname, 'public')));

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
