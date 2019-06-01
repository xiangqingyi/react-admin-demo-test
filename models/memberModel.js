'use strict';
/**
 * 模块依赖
 */

let crypto = require('crypto')
let _ = require('lodash')
let mongoose = require('mongoose')
let Schema = mongoose.Schema


/**
 * 用户模型
 */
let MemberSchema = new Schema({
    userid: {
        type: String
    },
    manager: {
        type: Boolean,
        default: false
    },
    civetid: {
        type: String        
    },

    username: {
        type: String,        
    },

    mail: {
        type: String,        
    },

    rolename:{
        type: String,        
    },

    division:{
        type: String,        
    },

    department:{
        type: String,        
    },
    
    section:{
        type: String,        
    },

    userstatus:{
        type: Number,
        default: 0
    },

    civetssostatus:{
        type: Number,
        default: 0
    },
    area: String, // 廠區
    seniority: String,  // 師資位
    city: String,    // 城市

    position:{
        type: Number,
        default: 1
    },

    isnotify:{
        type: Number,
        default: 0
    },

    leaderid: {
        type: Schema.ObjectId,
        ref: 'Member'
    },

    iscsvcreate:{
        type: Boolean,
        default: false
    },

    created: {
        type: Date,
        default: Date.now
    },

    updated: {
        type: Date,
        default: Date.now
    },    

}, { usePushEach: true });

/**
 * Virtuals
 */

/**
 * Validations
 */


/**
 * Pre-save hook
 */

/**
 * Methods
 */

module.exports = mongoose.model('Member', MemberSchema);