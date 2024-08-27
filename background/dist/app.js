"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const createError = require('http-errors')
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = __importDefault(require("./routes/index"));
const child_1 = __importDefault(require("./routes/child"));
const uploadImage_1 = __importDefault(require("./routes/uploadImage"));
const types_1 = __importDefault(require("./routes/types"));
const javascriptManger_1 = __importDefault(require("./routes/javascriptManger"));
const app = (0, express_1.default)();
// 解决跨域问题
app.all('*', function (req, res, next) {
    // 设置允许跨域的域名,*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*');
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type');
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');
    if (req.method.toLowerCase() === 'options') {
        res.send(200);
    } // 让options 尝试请求快速结束
    else {
        next();
    }
});
// view engine setup
// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', index_1.default);
app.use('/', child_1.default);
app.use('/', uploadImage_1.default);
app.use('/', types_1.default);
app.use('/', javascriptManger_1.default);
// app.use('/users', usersRouter)
// 使用包
// 使用bp包之前需要先进行配置，因为bp默认采用的是qs包进行url编码转换
// 如果希望使用核心模块进行处理，必须进行以下设置：
// 下面这句话的含义为：使用核心模块querystring进行处理操作
app.use(body_parser_1.default.urlencoded({ extended: false }));
// catch 404 and forward to error handler
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
