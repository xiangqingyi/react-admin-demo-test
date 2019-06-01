'use strict';
const mongoose = require('mongoose');
const moment = require('moment');
const MemberModel = require('../../models/memberModel');
const CivetModel = require('../../models/civetModel');
const core = require('../../libs/core');
const config = require('../../config');

const BACKURI = '/login';

/**
 * 香信驗證
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authenticateMember = async function (req, res, next) {
    if (process.env.NODE_ENV == 'local') {
        req.session.timeSheetCivetUserInfo = {};
        req.session.timeSheetCivetUserInfo.civetno = '22488';
    }

    let civetid = '';
    if (typeof req.session.timeSheetCivetUserInfo !== 'undefined') {
        civetid = req.session.timeSheetCivetUserInfo.civetno.toUpperCase();
    }

    let ip = core.getIp(req);
    let ua = req.get('User-Agent');

    if (!civetid) {
        core.logger.error('IP:%s，無權訪問', ip);
        return res.render('請用香信登入。');
    }

    let condition = {
        civetid: civetid,
        userstatus: 1,
        civetssostatus: 1
    };

    try {
        const memberResult = await MemberModel.findOne(condition).exec();

        if (memberResult == null) {
            core.logger.error('civetid:%s, authenticateCivetSSO CivetModel.findOneAndUpdate is null', civetid);
            return res.send('無訪問權限。');
        }

        let obj = {
            userinfo: req.session.timeSheetCivetUserInfo,
            updated: moment().toISOString()
        };

        try {
            const civetResult = await CivetModel.findOneAndUpdate({ civetid: civetid }, obj, { upsert: true }).exec();

            core.logger.info('CivetSSo登入成功');
            core.logger.info('civetid:%s, CivetModel.findOneAndUpdate is return %j', civetid, civetResult);

            next();
        } catch (civetResultError) {
            core.logger.error('civetid:%s, authenticateCivetSSO CivetModel.findOneAndUpdate errror:%j', civetid, civetResultError);
            return res.send('登入失敗，請稍後再試。');
        }

    } catch (resultError) {
        core.logger.error('civetid:%s, authenticateCivetSSO MemberModel.findOne errror:%j', civetid, resultError);
        return res.send('登入失敗，請稍後再試。');
    }
};

/**
 * 清cache轉跳頁
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.cleanCache = function (req, res, next) {
    let queryTo = req.query.to;
    let queryDate = req.query.date;
    let renderObj = {
        to: queryTo,
        date: (typeof queryDate !== 'undefined' && queryDate !== '') ? queryDate : moment().format('YYYY-MM-DD')
    };    
    if (typeof queryTo !== 'undefined' && queryTo !== '') {
        core.logger.info('cleanCache queryTo are %j', renderObj);
        res.render('cleancache', renderObj);
    } else {
        core.logger.error('cleanCache queryTo error:%s', queryTo);
        res.send('連結錯誤');
    }
};

/**
 * 取得資訊
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.indexGetInfo = function (req, res, next) {
    // let civetid = '';
    // let civetRealName = '';
    // if (typeof req.session.timeSheetCivetUserInfo !== 'undefined') {
    //     civetid = req.session.timeSheetCivetUserInfo.civetno.toUpperCase();
    //     civetRealName = req.session.timeSheetCivetUserInfo.realname;
    // }

    res.redirect(config.react.host);
};
exports.getUserIndex = async (req,res, next) => {
    const civetno = req.query.civetno;
    if (process.env.NODE_ENV == 'local') {
        req.session.timeSheetCivetUserInfo = {};
        req.session.timeSheetCivetUserInfo.civetno = civetno;
        req.session.timeSheetCivetUserInfo.manager = true;
        req.session.timeSheetCivetUserInfo.managerno = "22488";
    }
    if (typeof req.session.timeSheetCivetUserInfo !== 'undefined') { // 只有管理員才會走到這一段
        req.session.timeSheetCivetUserInfo.civetno = civetno
    }
    const envpath = config.react.host;
    return res.send({
        status: 1,
        envpath
    })
}
/**
 * 取得資訊
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.formGetInfo = function (req, res, next) {
    let dateFormat = (req.query.date) ? req.query.date : moment().format('YYYY-MM-DD');

    res.redirect(config.react.host + 'form?date=' + dateFormat);
};