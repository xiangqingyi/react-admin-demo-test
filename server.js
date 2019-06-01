const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors')
const config = require('./config/');
const core = require('./libs/core');
const apiRoute = require('./routes/api');
const appRoute = require('./routes/app');
let RedisStore = require('connect-redis')(session);


const app = express();

//跨域請求
let corsOptions = {
    credentials: config.CORS.CREDENTIALS,
    origin: config.CORS.ORIGIN,
    methods: config.CORS.METHODS,
    allowedHeaders: config.CORS.ALLOWEDHEADERS,
    exposedHeaders: config.CORS.EXPOSEDHEADERS
}

// app.use(cors(corsOptions))

// 定義全局變數
app.locals = {
    homepageStaticidr: config.homepage.staticdir,
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser('CivetNodeJSAdmin'));
app.use(session({
    secret: 'CivetNodeJSAdmin',
    name: 'civetapps.com',
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 120 * 60 * 1000 * 6    // 12小时
    },
    store: (config.redis.host ?  new RedisStore(config.redis) : null)
}));
app.use(compression());
app.use(helmet.noCache());
let appPath = process.cwd();

//連接mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.uri, {
    useMongoClient: true,
    /* other options */
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 1000     // Reconnect every 1000ms
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    core.logger.info('mongodb连接成功');
});

// react path
app.use(config.homepage.dir, express.static(path.join(__dirname, 'client/build')));

//api
app.use(config.api.dir, cors(corsOptions), apiRoute);

//app
app.use(config.homepage.dir, appRoute);

let server = app.listen(process.env.PORT || config.port || 5000, function () {
    core.logger.info('網站服務啟動，端口： ' + server.address().port);
    core.logger.info('環境變數： ' + config.env);
    core.logger.info('mongodb url： ' + config.mongodb.uri);
    core.logger.info('redis url： ' + config.redis.host + ':' + config.redis.port);
});

module.exports = app;