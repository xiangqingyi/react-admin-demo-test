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
let UserSchema = new Schema({
    id: {
        type: String
    },
    sort: {
        type: Number
    },
    hashed_password: String,

    name: {
        type: String,        
    },
    username: {
        type: String,
    },

    email: {
        type: String,        
    },
    role: {
        type: Schema.ObjectId,
        ref: 'Role'
    },
    status: {
        type: Number,
        default: 0
    },
    website: {
        type: String
    },
    company: {
        type: Object
    },

    phone: {
        type: Number
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
UserSchema.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password
})


/**
 * Methods
 */
UserSchema.methods = {
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    hashPassword: function (password) {
        if (!password) return '';
        let encrypred;
        try {
            encrypred = crypto.createHash('md5').update(password).digest('hex');
            // encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypred;
        } catch (err) {
            return '';
        }
    },
    authenticate: function (plainText) {
        return this.hashPassword(plainText) === this.hashed_password;
    }
}



module.exports = mongoose.model('User', UserSchema);