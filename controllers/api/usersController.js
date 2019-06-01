const mongoose = require('mongoose');
const _ = require('lodash');
const moment = require('moment');
const UserModel = require('../../models/usersModel');
const RoleModel = require('../../models/roleModel');
const core = require('../../libs/core');
const ajaxResult = require('../../class/AjaxResultClass');
const jwt = require("jsonwebtoken");//引入jwt
const config = require('../../config/index');

/**
 * USER_LOGIN
 */
exports.userLogin = async (req,res) => {
    if (req.method === 'POST') {
        let returnResult = new ajaxResult();
        console.log('userlogin')
        try {
            let user = await UserModel.findOne({username: req.body.username}).exec();
            if (user) {
                if (user.authenticate(req.body.password)) {
                    returnResult.message = '密碼驗證成功';
                    returnResult.error = 0;
                    returnResult.data = user;
                    req.session.User = user;
                    return res.json(returnResult);
                } else {
                    returnResult.message = '密碼驗證失敗';
                    returnResult.error = 1;
                    return res.json(returnResult);
                }
            } else {
                returnResult.message = '該用戶不存在';
                returnResult.error = 1;
                return res.json(returnResult)
            }
        } catch (error) {
            console.log(error);
            returnResult.message = '登錄出錯';
            returnResult.error = 1;
            return res.json(returnResult);
        }
    }
}



/**
 * GET_LIST
 */
exports.getList = async (req, res) => {
    let projection = {
        _id: 0,
        id: 1,
        name: 1,
        email: 1,
        role: 1
    }
    try {
        console.log(req.query);
        let count = await UserModel.count();
        if (req.query.type === 'GET_LIST') {
            let offset = Number(JSON.parse(req.query.range)[0]);
            let limit = Number(JSON.parse(req.query.range)[1]) - Number(JSON.parse(req.query.range)[0]) + 1;
            let sortBy = {}
            let sort01 = JSON.parse(req.query.sort)[0];
            let sort02 = (JSON.parse(req.query.sort)[1] === 'ASC') ? -1 : 1;
            sortBy[(sort01 === 'id') ? 'sort' : sort01] = sort02;
            if (JSON.parse(req.query.filter).q) {
                // 全局搜索
                let q = JSON.parse(req.query.filter).q;
                let allData = await UserModel.find({}, projection).populate('role').limit(Number(limit)).skip(Number(offset)).sort(sortBy);
                let resData = [];
                for (let i = 0; i < allData.length; i++) {
                    if (allData[i].name.indexOf(q) > -1 || allData[i].id.indexOf(q) > -1 || allData[i].email.indexOf(q) > -1 || allData[i].role.name.indexOf(q) > -1 ) {
                        resData.push(allData[i])
                    }
                }
                res.header('X-Total-Count', resData.length);
                res.header('Content-Range', 'users ' + req.query.range +'/'+resData.length);
                return res.json(resData)
            } else {
                let filter = JSON.parse(req.query.filter);
                let resultData = await UserModel.find(filter, projection).populate('role').limit(Number(limit)).skip(Number(offset)).sort(sortBy);
                res.header('X-Total-Count', count);
                res.header('Content-Range', 'users ' + req.query.range +'/'+count);
                return res.json(resultData);
            }
        } else if (req.query.type === 'GET_MANY') {
            let ids = JSON.parse(req.query.filter).ids;
            let resultData = await UserModel.find({id: {$in: ids}});
            res.header('X-Total-Count', resultData.length);
            res.header('Content-Range', 'users ' + req.query.range +'/'+resultData.length);
            return res.json(resultData)
        }
    } catch (error) {
        console.log('獲取用戶列表失敗');
        core.logger.error(error);
    }


}

/**
 * CREATE
 */
exports.setCreate = async (req, res) => {
    console.log('users CREATE');
    let returnResult = new ajaxResult();
    const obj = _.pick(req.body, 'name', 'username', 'email', 'password','role');
    try {
        // const test =  await
        const idNum = await UserModel.find({}, {_id: 0, sort: 1}).sort({sort: -1}).limit(1);
        console.log(idNum);
        const _user = new UserModel({
            ...obj,
            id: idNum[0].sort + 1,
            sort: idNum[0].sort + 1,
            hashed_password: obj.password,
            role: obj.role._id
        });
        const user = await _user.save(); 
        return res.json(user);
    } catch (error) {
        console.log('創建用戶失敗');
        returnResult.message = '創建用戶失敗';
        console.log(error);
        core.logger.error(error);
        return res.json(returnResult)
    }
}

/**
 * UPDATE
 */
exports.setUpdate = async (req, res) => {
    console.log('users UPDATE');
    let returnResult = new ajaxResult();
    try {
        const role = await RoleModel.findById(req.body.role._id);
        const user = await UserModel.findOne({_id: req.body._id}, {_id: 0, hashed_password: 1});
        await UserModel.update({_id: req.body._id}, {$set:{
            ...req.body,
            role: role._id,
            hashed_password: (req.body.password) ? new UserModel().hashPassword(req.body.password) : user.hashed_password
        }});
        const updateUser = await UserModel.findById(req.body._id);
        return res.json(updateUser);
    } catch (error) {
        returnResult.error = 1;
        returnResult.message = '更新user信息失敗';
        console.log('更新用戶信息失敗');
        core.logger.error(error);
        return res.json(returnResult);
    }
}

/**
 * GET_ONE
 */
exports.getShowOne = async (req, res) => {
    console.log('users GET_ONE');
    // let returnResult = new ajaxResult();

    console.log(req.params);
    
    try {
   
        let result = await UserModel.findOne({id: req.params.id}).populate('role');

        return res.json(result);
    } catch (error) {
        console.log('查找用戶失敗');
        core.logger.error(error);
    }

}

/**
 * DELETE
 */
exports.setDelete = async (req, res) => {
    console.log('users DELETE');

    let returnResult = new ajaxResult();

    try {
        const deleteUser =  await UserModel.findOneAndRemove({id: req.params.id});
        return res.json(deleteUser);
    } catch (error) {
        returnResult.error = 1;
        returnResult.message = '刪除用戶失敗';
        console.log('刪除用戶失敗');
        core.logger.error(error);
        return res.json(returnResult);
    }

}

// DELETE_MANY
exports.delManyUser = async (req, res) => {
    console.log('delete many');
    console.log(req.query);
    let returnResult = new ajaxResult();
    try {
        let ids = JSON.parse(req.query.filter).ids;
        await UserModel.deleteMany({id: {$in: ids }})
        return res.json(ids);
    } catch (error) {
        returnResult.error = 1;
        returnResult.message = '刪除多個user失敗';
        core.logger.error(error);
        return res.json(returnResult);
    }
}

// CHECK_USER
exports.checkuser = async (req, res, next) => {
    let returnResult = new ajaxResult();

    try {
        if (req.session.User) {
            returnResult.error = 0;
            returnResult.message = 'checkuser成功';
            return res.json(returnResult);
        } else {
            returnResult.error = 1;
            returnResult.message = 'checkuser失敗，沒有獲取到session';
            return res.json(returnResult);
        }
    } catch (error) { 
        console.log(error);
        returnResult.error = 1;
        returnResult.message = 'checkuser失敗'
        return res.json(returnResult);
    }
} 

// USER_LOGOUT
exports.logout = async (req, res) => {
    let returnResult = new ajaxResult();
    try {
        delete req.session.User;
        returnResult.error = 0;
        returnResult.message = '登出成功';
        return res.json(returnResult);
    } catch (error) {
        console.log(error)
        returnResult.error = 1;
        returnResult.message = '登出失敗';
        return res.json(returnResult)
    }
}

/**
 * 验证jwt token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.authToken = async (req, res, next) => {
    // 没有拿到token 返回错误
    let returnResult = new ajaxResult();
    // 拿取token 数据 按照自己传递方式写
    //console.log(req.headers['authorization']);
    var jwt_token = req.headers['authorization'] || '';
    // var jwt_token = req.query.token || '';
    if (jwt_token) {
        // 解码 token (验证 secret 和检查有效期（exp）)
        jwt.verify(jwt_token, config.jwt_token.secret, function (err, decoded) {
            if (err) {
                returnResult.error = 2;
                returnResult.message = '无效的token';
                return res.json(returnResult);
            } else {
                // 如果验证通过，在req中写入解密结果
                req.decoded = decoded;
                //console.log(decoded)  ;  //jwt信息
                next(); //继续下一步路由
            }
        });
    } else {
        returnResult.error = 1;
        returnResult.message = '没有找到token';
        return res.json(returnResult);
    }
}

/**
 * 获取token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getToken = async (req, res, next) => {
    let returnResult = new ajaxResult();
    try {
        var token = jwt.sign({ username: req.session.User.username }, config.jwt_token.secret, {
            expiresIn: config.jwt_token.expiresIn// 授权时效60s
        });
        returnResult.error = 0;
        returnResult.token = token;
        return res.json(returnResult);
    } catch (error) {
        returnResult.error = 1;
        returnResult.message = '获取session失败，请重新登录';
        return res.json(returnResult);
    }


}

// 獲取當前用戶的權限
exports.getUserActions = async (req, res) => {
    let returnResult = new ajaxResult();
    try {
        let user = req.session.User; // 如果用本地存儲就從前端傳一個user值過來
        if (user) {
            let _user = await UserModel.findById(user._id).populate('role');
            returnResult.message = '獲取當前user信息成功';
            returnResult.data = _user;
            returnResult.error = 0;
            return res.json(returnResult);  
        } else {
            returnResult.message = '沒有session值';
            returnResult.error = 1;
            return res.json(returnResult);
        }

    } catch (error) {
        returnResult.error = 1;
        returnResult.data = error;
        returnResult.message = '獲取當前user的信息失敗';
        return res.json(returnResult);
    }
}