const request = require('request');
const url = require('url');
const core = require('../libs/core');
const config = require('../config');
const MemberModel = require('../models/memberModel')


module.exports = function (req, res, next) {
    let civetCode = req.query.code;
    let errorcode = 0;
    //取accesstoke
    if (typeof civetCode !== 'undefined' && civetCode != '') {
        //驗證accesstoken
        core.logger.info('驗證accesstoken');
        let qsObj = {
            code: civetCode,
            appid: config.CIVET.APPID
        };
        core.logger.info(url.resolve(config.CIVET.HOST, config.CIVET.URL.GET_ACCESS_TOKEN + ' qs:%j', qsObj));
        request.get({
            uri: url.resolve(config.CIVET.HOST, config.CIVET.URL.GET_ACCESS_TOKEN),
            qs: qsObj,
        }, function (error, response, body) {
            try {
                core.logger.info('%j', error);
                core.logger.info('%s', response.statusCode);
                core.logger.info('%s', body);
            } catch (ex) {
                errorcode = 4.1;
                core.logger.error(ex);
                res.send('連線逾時。' + errorcode);
                return;
            }
            if (!error && response.statusCode == 200) {
                try {
                    /* { "openid":"[OpenID]", "access_token":"[访问Token]", "expires_in":3600 }  */
                    let civet_accessToken = JSON.parse(body);
                    if (civet_accessToken.openid != '' && civet_accessToken.access_token != '') {
                        //取得訂閱用戶的資料
                        core.logger.info('取得訂閱用戶的資料');
                        core.logger.info(url.resolve(config.CIVET.HOST, config.CIVET.URL.GET_USERINFO) + ' qs:%j', qsObj);
                        //用qs方法會把token裡的%解密導致不正常
                        request.get({
                            uri: url.resolve(config.CIVET.HOST, config.CIVET.URL.GET_USERINFO) + '?appid=' + config.CIVET.APPID + '&openid=' + civet_accessToken.openid + '&access_token=' + civet_accessToken.access_token
                        }, async function (error, response, body) {
                            try {
                                core.logger.info('%j', error);
                                core.logger.info('%s', response.statusCode);
                                core.logger.info('%s', body);
                            } catch (ex) {
                                errorcode = 2.1;
                                core.logger.error(ex);
                                res.send('連線逾時。' + errorcode);
                                return;
                            }
                            if (!error && response.statusCode == 200) {
                                try {
                                    /* { "openid":"[OpenID]", "access_token":"[访问Token]", "expires_in":3600, 
                                    "civetno":"F888888", "nickname":"张飞", "area":"广东深圳", "sign":"没有签名信息" }  */
                                    let civet_civetUserInfoClass = JSON.parse(body);
                                    console.log(civet_civetUserInfoClass);
                                    const user = await MemberModel.findOne({civetid: civet_civetUserInfoClass.civetno});
                                    console.log(user);
                                    if (civet_civetUserInfoClass.civetno != '' && user.userstatus === 1 && user.civetssostatus === 1) {
                                        req.session.timeSheetCivetUserInfo = civet_civetUserInfoClass;
                                        req.session.timeSheetCivetUserInfo.manager = (user.manager) ? true : false;
                                        if (user.manager) {
                                            req.session.timeSheetCivetUserInfo.managerno = user.civetid;
                                        }
                                        next();
                                        return;
                                    } else {
                                        errorcode = 1;
                                        core.logger.error('用戶資料無civetno');
                                        res.send('資料錯誤，無法取得訊息。' + errorcode);
                                        return;
                                    }
                                } catch (ex) {
                                    errorcode = 6;
                                    core.logger.error(ex);
                                    res.send('資料錯誤，無法取得訊息。' + errorcode);
                                    return;
                                }
                            } else {
                                errorcode = 2;
                                core.logger.error('取得訂閱用戶的資料錯誤');
                                res.send('資料錯誤，無法取得訊息。' + errorcode);
                                return;
                            }
                        });
                    } else {
                        errorcode = 3;
                        core.logger.error('token無openid與access_token');
                        res.send('資料錯誤，無法取得訊息。' + errorcode);
                        return;
                    }
                } catch (ex) {
                    errorcode = 7;
                    core.logger.error(ex);
                    res.send('資料錯誤，無法取得訊息。' + errorcode);
                    return;
                }
            } else {
                errorcode = 4;
                core.logger.error('驗證accesstoken失敗');
                res.send('資料錯誤，無法取得訊息。' + errorcode);
                return;
            }
        });
    } else {
        errorcode = 5;
        core.logger.error('取accesstoken失敗');
        res.send('資料錯誤，無法取得訊息。' + errorcode);
        return;
    }
};