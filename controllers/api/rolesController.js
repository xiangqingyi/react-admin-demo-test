let UserModel = require('../../models/usersModel');
let RoleModel = require('../../models/roleModel');
let core = require('../../libs/core');
let ajaxResult = require('../../class/AjaxResultClass');
let moment = require('moment');
let config = require('../../config/index');
let _ = require('lodash');


/**
 * ROLE GET_LIST
 *  */
exports.getListRole = async (req, res) => {
    let returnResult = new ajaxResult();
    let projection = {
        _id: 0,
        id: 1,
        name: 1,
        created: 1,
        author: 1
    }
    try {
        let count = await RoleModel.count();
        if (req.query.type === 'GET_LIST') {
            let offset = Number(JSON.parse(req.query.range)[0]);
            let limit = Number(JSON.parse(req.query.range)[1]) - Number(JSON.parse(req.query.range)[0]) + 1;
            let sortBy = {}
            let sort01 = JSON.parse(req.query.sort)[0];
            let sort02 = (JSON.parse(req.query.sort)[1] === 'ASC') ? -1 : 1;
            if (JSON.parse(req.query.filter).q) {
                // 全局搜索
                let q = JSON.parse(req.query.filter).q;
                let allData = await RoleModel.find({}, projection).populate('author').limit(Number(limit)).skip(Number(offset)).sort(sortBy).exec();
                let resData = [];
                for (let i = 0; i < allData.length; i++) {
                    let created = moment(allData[i].created).format('YYYY-MM-DD').toString();
                    let author = (allData[i].author) ? allData[i].author.username : '初始化'
                    if (allData[i].id.indexOf(q) > -1 || allData[i].name.indexOf(q) > -1 || created.indexOf(q) > -1 || author.indexOf(q) > -1) {
                        resData.push({
                            created: created,
                            name: allData[i].name,
                            author: author,
                            id: allData[i].id
                        });
                    }
                }
                res.header('X-Total-Count', resData.length);
                res.header('Content-Range', 'users ' + req.query.range +'/'+resData.length);
                return res.json(resData);
            } else {
                let filter = JSON.parse(req.query.filter);
                sortBy[(sort01 === 'id') ? 'sort' : sort01] = sort02;
                let resultData = await RoleModel.find(filter).populate('author').limit(Number(limit)).skip(Number(offset)).sort(sortBy).exec();
                let arr = [];
                for (let i = 0; i < resultData.length; i++) {
                    arr[i] = {
                        created: moment(resultData[i].created).format('YYYY-MM-DD'),
                        name: resultData[i].name,
                        id: resultData[i].id,
                        author: (resultData[i].author) ? resultData[i].author.username : '初始化'
                    }
                }
                res.header('X-Total-Count', count);
                res.header('Content-Range', 'users ' + req.query.range +'/'+count);
                return res.json(arr);
            }
        } else if (req.query.type === 'GET_MANY') {
            let ids = JSON.parse(req.query.filter).ids;
            let resultData = await RoleModel.find({id: {$in: ids}});
            res.header('X-Total-Count', resultData.length);
            res.header('Content-Range', 'users ' + req.query.range +'/'+resultData.length);
            return res.json(resultData);
        }


    } catch (error) {
        console.log(error);
        returnResult.error = 1;
        returnResult.message = '獲取role_list失敗';
        return res.json(returnResult)
    }
}

/**
 * ROLE CREATE
 */
exports.setCreateRole = async (req, res) => {
    let returnResult = new ajaxResult();

    let idNum = await RoleModel.find({}, {_id: 0, sort: 1}).sort({sort: -1}).limit(1);
    let obj = _.pick(req.body, 'name', 'actions', 'description');
    try {
        let _role = new RoleModel({
            ...obj,
            id: idNum[0].sort + 1,
            sort: idNum[0].sort + 1,
            author: req.session.User._id
        });
        let role = await _role.save();
        return res.json(role);
    } catch (error) {
        console.log(error);
        returnResult.error = 1;
        returnResult.message = '創建role失敗';
        return res.json(returnResult);
    }
}

/**
 * ROLE UPDATE
 */
exports.setUpdateRole = async (req, res) => {
    let returnResult = new ajaxResult();
    try {
        const role = await RoleModel.findOne({_id: req.body._id})
        const updateRole =  await RoleModel.findOneAndUpdate({_id:req.body._id}, {$set: {
            ...req.body,
            author: role.author
        } })
        return res.json(updateRole);
    } catch (error) {
        console.log(error);
        returnResult.error = 1;
        returnResult.message = '更新role失敗';
        return res.json(returnResult);
    }
}

/**
 * ROLE GET_ONE
 */
exports.getShowOneRole = async (req, res) => {
    let returnResult = new ajaxResult();
    try {
        let result = await RoleModel.findOne({id: req.params.id});
        return res.json(result);
    } catch (error) {
        console.log(error);
        returnResult.error = 1;
        returnResult.message = '獲取指定role失敗';
        return res.json(returnResult);
    }
}

/**
 * ROLE DELETE
 */
exports.setDeleteRole = async (req, res) => {
    let returnResult = new ajaxResult();
    try {
        // 不能刪除admin和user 只能刪除其他新建的roles
        const deleteRole =  await RoleModel.findOneAndRemove({id: req.params.id})
        return res.json(deleteRole);
    } catch (error) {
        console.log(error);
        returnResult.error  = 1;
        returnResult.message = '刪除指定role失敗';
        return res.json(returnResult);
    }
}


// DELETE_MANY
exports.delManyRole = async (req, res) => {
    console.log('delete many');
    let returnResult = new ajaxResult();
    try {
        let ids = JSON.parse(req.query.filter).ids;
        await RoleModel.deleteMany({id: {$in: ids}})
        const roles = await RoleModel.find({}).exec();
        return res.json(roles);
    } catch (error) {
        core.logger.error(error);
        returnResult.message = '刪除多個role失敗';
        returnResult.error = 1;
        return res.json(returnResult);
    }
}

exports.getAllRole = async (req, res) => {
    console.log('獲取全部的roles')
    try {
        let result = await RoleModel.find({}).exec();
        let arr = [];
        for(let i = 0; i < result.length; i++) {
            arr[i] = {
                id: result[i]._id,
                name: result[i].name
            }
        }
        return res.json(arr);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}