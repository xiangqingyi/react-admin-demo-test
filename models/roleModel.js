'use strict';

/**
 * 模块依赖
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema

/**
 * 角色模型
 */
let RoleSchema = new Schema({
    id: String, // response必須要id字段
    sort: Number,
    name: {
        type: String,
        required: true,
        unique: true
    },
    actions: Array, // 暂时定为array
    description: String,
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    status: {
        type: Number,
        default: 0,  // 管理员 201 一般用户202  
    }
});

module.exports = mongoose.model('Role', RoleSchema);