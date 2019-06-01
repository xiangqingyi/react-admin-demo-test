const requestUtil = require('../libs/RequestUtil');
const core = require('../libs/core');

class civetUtil {
    /**
     * Create a civetUtil.
     * @param {string} FromUserName - civet account.
     * @param {string} Password - civet accont password.     
     */
    constructor(FromUserName, Password) {
        this.FromUserName = FromUserName;
        this.Password = Password;
        this.failList = [];
    }

    /**
     * 
     * @param {string} url 
     * @param {string} TaskName 
     * @param {Object} CivetNo {civetNo,username}
     * @param {string} Content 
     * @returns {promise} Promise
     */
    SendMsgToChannelPromise(url, TaskName, CivetObj, Content) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.SendMsgToChannel(url, CivetObj.civetNo, Content)
                .then((response) => {
                    if (response.status === 200 && response.data === true) {
                        core.logger.info('%s %s %s提醒成功。%s', CivetObj.civetNo, CivetObj.username, TaskName, new Date());
                    } else {
                        self.failList.push(CivetObj);
                        core.logger.info('%s %s %s提醒失敗。status：%s。result：%s %s', CivetObj.civetNo, CivetObj.username, TaskName, response.status, response.data, new Date());
                    }
                    resolve(CivetObj);
                })
                .catch((error) => {
                    self.failList.push(CivetObj);
                    core.logger.info('%s %s %s提醒失敗。error：%s %s', CivetObj.civetNo, CivetObj.username, TaskName, error, new Date());
                    resolve(CivetObj);
                });
        });
    }

    /**
     * 傳送頻道訊息給成員
     * @param {string} url 
     * @param {string} ToCivetNo 
     * @param {string} Content 
     * @returns {promise} axios promise
     */
    SendMsgToChannel(url, ToCivetNo, Content) {
        const msgXml = this.getSendMsgTemplate(ToCivetNo, Content);

        return requestUtil.POSTUseXML(url, msgXml);
    }

    getSendMsgTemplate(ToCivetNo, Content) {
        return (
            '<xml>' +
            '<MsgType>text</MsgType>' +
            '<FromUserName>' + this.FromUserName + '</FromUserName>' +
            '<Password>' + this.Password + '</Password>' +
            '<ToCivetNo>' + ToCivetNo + '</ToCivetNo>' +
            '<Content><![CDATA[' + Content + ']]></Content>' +
            '</xml>'
        );
    }
}

module.exports = civetUtil;