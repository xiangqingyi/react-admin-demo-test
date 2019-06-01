'use strict';
const nodemailer = require('nodemailer');
const core = require('../libs/core');

class mailUtil {
    /**
     * Create a mailUtil.
     * @param {string} host - mail host.
     * @param {string} port - mail port.
     * @param {string} authUser - mail user account.
     * @param {string} authPassword - mail user password.     
     */
    constructor(host, port, authUser, authPassword) {
        let _transporter = {
            host: host,
            port: port
        };
        if (authUser !== '' && authPassword !== '') {
            _transporter.auth.user = authUser;
            _transporter.auth.pass = authPassword;
        }

        this.transporter = nodemailer.createTransport(_transporter);
    }

    /**
     * send mail 
     * @param {string} TaskName 
     * @param {string} mailFrom 
     * @param {string} mailTo - 可用逗號區分
     * @param {string} mailSubject 
     * @param {string} mailHtml 
     */
    SendMailPromise(TaskName, mailFrom, mailTo, mailSubject, mailHtml) {
        const self = this;
        return new Promise((resolve, reject) => {
            let mailOptions = {
                from: mailFrom, // sender address
                to: mailTo, // list of receivers    
                subject: mailSubject, // Subject line
                //text: 'Hello world', // plain text body
                html: mailHtml // html body
            };

            self.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    core.logger.error('%s %s 寄件失敗，error:%j。%s', mailTo, TaskName, error, new Date());
                    resolve(mailTo);
                } else {
                    core.logger.info('%s 寄件info：%j。%s', TaskName, info, new Date());
                    core.logger.info('%s %s 寄件成功，res:%s。%s', TaskName, mailTo, info.response, new Date());
                    resolve(mailTo);
                }
            });
        });
    }
}

module.exports = mailUtil;