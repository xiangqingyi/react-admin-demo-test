'use strict';
/**
 * 模块依赖
 */
let _ = require('lodash')
let mongoose = require('mongoose')
let Schema = mongoose.Schema


/**
 * 用户模型
 */
let CivetSchema = new Schema({
    civetid: {
        type: String
    },

    userinfo: {
        type: Object
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
 * Methods
 */
CivetSchema.methods = {
};

module.exports = mongoose.model('Civet', CivetSchema);