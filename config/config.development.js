'use strict';

let path = require('path');
let utils = require('./../libs/utils');
let appPath = process.cwd();


let config = {
    port: process.env.Port || 8787,
    env: process.env.NODE_ENV || 'development', // development   production
    //路徑配置
    path: {
        logDir: appPath + '/logs'
    },
    //mongodb配置信息
    mongodb: {
        uri: 'mongodb://civetadmin:Foxconn99@10.134.98.13:27017/CivetNodeJSAdmin',
        options: {}
    },
    //redis服务，用来session维持，非必须
    redis: {
        host: '', // 如 127.0.0.1 配置此项表示启用redis，需保证redis服务已启动
        port: 6379, // 6379
        pass: ''
    },
    //react
    react: {
        host: 'http://10.134.98.139:5000/civetadmin/'
    },
    //香信
    CIVET: {
        "APPID": "gaTnbapKMl0LSLMRdzpouA2",
        "ACCOUNT": "F3205322",
        "PWD": 'Foxconn123~',
        "HOST": "http://civetInterface.foxconn.com/",
        "URL": {
            "GET_ACCESS_TOKEN": "open/access_token",
            "GET_USERINFO": "open/get_user_info",
            "GET_QRCODE": "Open/ScanPage?redirect_uri=http://10.142.214.89:3030/civetsso&scope=snsapi_userinfo&NonBorder=true&NonNav=true",
            "GET_SCANRESLUT": "Open/ScanResult",
            "POST_SENDMSG": "open/sendMsg",
        }
    },
    //香信API
    CIVETAPI: {
        "CELLER": {
            "ACCOUNT": "civet",
            "PWD": "amebiz",
            "URL": {
                "PROJECTCODE": "http://qacivetinterface.foxconn.com/apps/celerapi/CelerPPM/Sel"
            }
        }
    },
    //SMTP
    SMTP: {
        'SENDER': 'cm-fsc@mail.foxconn.com',
        'HOST': '10.134.99.17',
        'PORT': 25,
        'USER': '',
        'PASS': ''
    },
    //找回密码hash过期时间
    findPasswordTill: 24 * 60 * 60 * 1000,
    // session secret
    sessionSecret: 'SessionSecret',
    // jsonwebtoken config
    jwt_token: {
        secret: 'myjwttest',
        expiresIn: 900//15分钟过期
    },
    title: 'iCivet 後台管理系統',
    api: {
        dir: '/civetadmin/api' //api访问路径，如http://localhost/template/api/v1
    },
    homepage: {
        dir: '/civetadmin',       //前台访问路径，如http://localhost/template
        staticdir: '/civetadmin/static'
    },
    //后台相关配置
    admin: {
        dir: 'civetadmin/admin', //后台访问路径，如http://localhost/template/admin
        role: {//默认角色名
            admin: 'admin',
            user: 'user'
        }
    },
    upload: {
        tmpDir: appPath + '/public/uploaded/tmp',
        uploadDir: appPath + '/public/uploaded/files',
        uploadUrl: '/uploaded/files/',
        maxPostSize: 1000 * 1024 * 1024, // 1000M
        minFileSize: 1,
        maxFileSize: 500 * 1024 * 1024, // 500M
        acceptFileTypes: /.+/i,
        storage: {
            type: 'local',//保存类型，如果保存到本地可省略或local, 目前支持7牛：qiniu
            options: {
                accessKey: 'your key',
                secretKey: 'your secret',
                bucket: 'your bucket',
                domain: 'http://yourdomain.qiniudn.com', // 域名，包含http，如http://yourdomain.qiniudn.com
                timeout: 3600000, // default rpc timeout: one hour, optional
            }
        }
    },
    stopForumSpam: false,
    // 是否启动用户注册校验TODO:
    userVerify: {
        enable: false,
        type: 'admin' // mail | admin, 默认admin
    },
    // 邮箱配置，找回密码、用户注册使用
    mail: {
        // 发信人邮箱
        from: 'username@domain.com',
        // nodemailer config see https://nodemailer.com/about/
        nodemailer: {
            // https://nodemailer.com/smtp/
            service: 'gmail',
            host: '',
            port: '',
            auth: {
                user: '',
                pass: ''
            }
        }

    },
    //CORS
    CORS: {
        CREDENTIALS: true,
        METHODS: ['GET', 'PUT', 'POST', 'DELETE'],
        ALLOWEDHEADERS: ['Content-Type', 'Authorization'],
        EXPOSEDHEADERS: ['X-Total-Count', 'Content-Range']
    },
    // google analytics
    ga: ''
};

utils.createFolderIfNeeded(config.upload.tmpDir);
utils.createFolderIfNeeded(config.upload.uploadDir);

module.exports = config;