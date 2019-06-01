const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const expect = chai.expect;
const sinon = require('sinon');
const moment = require('moment');
const app = require('../server');
const DailyModel = require('../models/dailyModel');


describe('## API daily route Testing', () => {
    describe('# GET timesheet/api/daily/getworkingtype', () => {
        it('status should return OK', (done) => {
            request(app)
                .get('/timesheet/api/daily/getworkingtype')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    done();
                })
                .catch(done);
        });

        it('should return data', (done) => {
            let expectReturn = [
                {
                    "_id": "5b963b20c18b114877a46c7f",
                    "index": 1,
                    "value": "軟件開發",
                    "subworking": [
                        {
                            "_id": "5b963b20c18b114877a46c30",
                            "index": 0,
                            "isNeedProjectCode": true,
                            "value": "--- 請選擇 ---"
                        },
                        {
                            "_id": "5b963b20c18b114877a46c31",
                            "index": 1,
                            "isNeedProjectCode": true,
                            "value": "Android平台開發"
                        }
                    ]
                }]

            var mockFindOne = {
                exec: function () {
                    return Promise.resolve(expectReturn);
                }
            };

            let fackDailyModel = sinon.stub(DailyModel, "find");
            fackDailyModel.returns(mockFindOne);

            request(app)
                .get('/timesheet/api/daily/getworkingtype')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(res.body);
                    expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
                    expect(res.body.error).to.equal(0);
                    expect(res.body.message).to.be.empty;
                    expect(res.body.data).to.be.an('array');
                    
                    DailyModel.find.restore();
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET timesheet/api/daily/getdata', () => {
        it('status should return OK', (done) => {
            request(app)
                .get('/timesheet/api/daily/getdata')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    done();
                })
                .catch(done);
        });

        it('should return null result - dont have id', (done) => {
            request(app)
                .get('/timesheet/api/daily/getdata')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(res.body);
                    expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
                    expect(res.body.error).to.equal(0);
                    expect(res.body.data).to.equal(null);
                    done();
                })
                .catch(done);
        });

        it('should return error 1 - date is incorrect', (done) => {
            request(app)
                .get('/timesheet/api/daily/getdata?date=abcdef')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
                    expect(res.body.error).to.equal(1);
                    expect(res.body.message).to.not.be.empty;
                    expect(res.body.data).to.be.empty;
                    done();
                })
                .catch(done);
        });

        it('should return data', (done) => {
            let fackArgs = {
                userid: '22488',
                selecteddate: {
                    $gte: moment('2018-09-03', "YYYY-MM-DD").format(),
                    $lt: moment('2018-09-03', "YYYY-MM-DD").add(1, 'days').subtract(1, 'seconds').format()
                }
            }

            let expectReturn = {
                "userid": "22488",
                "username": "eric",
                "selecteddatestr": "2018-09-03",
                "__v": 0,
                "created": "2018-09-05T02:32:51.985Z",
                "workingitems": [
                    {
                        "id": "1",
                        "mainWorkingSelected": 1,
                        "mainWorkingSelectedText": "軟件開發",
                        "subWorkingSelected": -1,
                        "subWorkingSelectedText": "未立案",
                        "projectcode": "",
                        "workingHours": 10.5,
                        "_id": "5b8f40538009473fdce05bfe"
                    }
                ]
            };

            var mockFindOne = {
                exec: function () {
                    return Promise.resolve(expectReturn);
                }
            };

            let fackDailyModel = sinon.stub(DailyModel, "findOne");
            fackDailyModel.withArgs(fackArgs).returns(mockFindOne);
            DailyModel.findOne.restore();

            request(app)
                .get('/timesheet/api/daily/getdata?id=22488&date=2018-09-03')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(res.body);
                    expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
                    expect(res.body.error).to.equal(0);
                    expect(res.body.message).to.be.empty;
                    expect(res.body.data).to.be.an('object').that.has.any.keys('userid', 'username', 'selecteddatestr', 'workingitems');
                    done();
                })
                .catch(done);
        });
    });

    describe('# GET timesheet/api/daily/getcompleteddate Testing', () => {
        beforeEach(() => {
            let expectReturn = [
                {
                    "_id": "5b8f40458009473fdce05bfb",
                    "selecteddate": "2018-09-01T00:00:00.000Z"
                },
                {
                    "_id": "5b8f40538009473fdce05bfd",
                    "selecteddate": "2018-09-03T00:00:00.000Z"
                },
                {
                    "_id": "5b8f9480bfdb6113946837cc",
                    "selecteddate": "2018-09-05T00:00:00.000Z"
                }
            ];


            let mockFindOne = (returnObj) => {
                let tempClass = {
                    exec: function () {
                        return Promise.resolve(returnObj);
                    }
                }
                return tempClass;
            };

            let fackDailyModel = sinon.stub(DailyModel, "find");
            fackDailyModel.withArgs({ userid: '22488' }).returns(mockFindOne(expectReturn));
            fackDailyModel.withArgs({ userid: '' }).returns(mockFindOne([]));
            fackDailyModel.returns(mockFindOne([]));
            // fackDailyModel.returns([]);
            // fackArgs.userid='';
        });

        afterEach(() => {
            DailyModel.find.restore();
        });

        it('status should return OK', (done) => {
            request(app)
                .get('/timesheet/api/daily/getcompleteddate')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    done();
                })
                .catch(done);
        });

        it('should return data', (done) => {
            request(app)
                .get('/timesheet/api/daily/getcompleteddate?id=22488')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(res.body);
                    expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
                    expect(res.body.error).to.equal(0);
                    expect(res.body.message).to.be.empty;
                    expect(res.body.data).to.be.an('object').that.has.any.keys('completeddates');
                    expect(res.body.data.completeddates).to.not.be.empty;
                    done();
                })
                .catch(done);
        });

        it('should return empty result - dont have id', (done) => {
            request(app)
                .get('/timesheet/api/daily/getcompleteddate?id=')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    // console.log(res.body);
                    expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
                    expect(res.body.error).to.equal(0);
                    expect(res.body.data.completeddates).to.be.empty;
                    done();
                })
                .catch(done);
        });
    });

    describe('# POST timesheet/api/daily/savedate Testing', () => {
        // beforeEach(() => {
        //     let expectReturn = [
        //         {
        //             "_id": "5b8f40458009473fdce05bfb",
        //             "selecteddate": "2018-09-01T00:00:00.000Z"
        //         },
        //         {
        //             "_id": "5b8f40538009473fdce05bfd",
        //             "selecteddate": "2018-09-03T00:00:00.000Z"
        //         },
        //         {
        //             "_id": "5b8f9480bfdb6113946837cc",
        //             "selecteddate": "2018-09-05T00:00:00.000Z"
        //         }
        //     ];


        //     let mockFindOne = (returnObj) => {
        //         let tempClass = {
        //             findOne: {
        //                 exec: function () {
        //                     // return Promise.resolve(returnObj);
        //                     return null;
        //                 }
        //             },
        //             save:function(){
        //                 return 'ok';
        //             }
        //         };
        //         return tempClass;
        //     };

        //     let fackDailyModel = sinon.stub(DailyModel);

        //     fackDailyModel.returns(mockFindOne(expectReturn))

        //     // let fackDailyModel = sinon.stub(DailyModel, "findOne");
        //     // fackDailyModel.withArgs({ userid: '22488' }).returns(mockFindOne(expectReturn));
        //     // fackDailyModel.withArgs({ userid: '' }).returns(mockFindOne([]));
        //     // fackDailyModel.returns(mockFindOne(null));
        //     // fackDailyModel.returns([]);
        //     // fackArgs.userid='';

        //     // let fackDailyModel_save = sinon.stub(DailyModel, "save");
        //     // fackDailyModel_save.returns({ save: 'ok' });

        // });

        // afterEach(() => {
        //     DailyModel.restore();
        //     // DailyModel.save.restore();
        // });

        it('status should return OK', (done) => {
            request(app)
                .post('/timesheet/api/daily/savedate')
                .set('Accept', 'application/json')
                .expect(httpStatus.OK)
                .then((res) => {
                    done();
                })
                .catch(done);
        });

        // it('should return save sucess', (done) => {
        //     request(app)
        //         .post('/timesheet/api/daily/savedate')
        //         .set('Accept', 'application/json')
        //         .expect(httpStatus.OK)
        //         .then((res) => {
        //             console.log(res.body);
        //             expect(res.body.error).to.equal(0);

        //             // expect(res.body).to.be.an('object').that.has.all.keys('error', 'message', 'data');
        //             // expect(res.body.error).to.equal(0);
        //             // expect(res.body.message).to.be.empty;
        //             // expect(res.body.data).to.be.an('object').that.has.any.keys('completeddates');
        //             // expect(res.body.data.completeddates).to.not.be.empty;
        //             done();
        //         })
        //         .catch(done);
        // });

    });
});