import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import QuestionModel from "models/question.model";
import moment from "moment";

export const getsQuestion = async (req, res) => {
    var type = req.body.type;
    if (type == 'all') {
        QuestionModel
            .find({})
            .sort({ _id: -1 })
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                var d = new Date();
                console.log(moment().subtract(30, 'days'));
                var result = docs.map(x => {
                    return String((x.createdAt).getDate()).slice(0, 10)
                })
                var result1 = result.reduce(function (acc, curr) {
                    if (typeof acc[curr] == 'undefined') {
                        acc[curr] = 1;
                    } else {
                        acc[curr] += 1;
                    }
                    return acc;
                }, {})
                var newDocs = Object.keys(result1).map(function (key) {
                    return { date: key, count: result1[key] };
                });

                return response(res, 200, [], newDocs);
            })
    } else if (type == 30) {
        var d = new Date();
        var today = moment().subtract(0, 'days');
        var ago30day = moment().subtract(30, 'days');
        QuestionModel
            .find({ createdAt: { $gte: (ago30day), $lt: (today) } })
            .sort({ _id: -1 })
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                var result = docs.map(x => {
                    return String((x.createdAt).getDate()).slice(0, 10)
                })
                var result1 = result.reduce(function (acc, curr) {
                    if (typeof acc[curr] == 'undefined') {
                        acc[curr] = 1;
                    } else {
                        acc[curr] += 1;
                    }
                    return acc;
                }, {})
                var newDocs = Object.keys(result1).map(function (key) {
                    return { date: key, count: result1[key] };
                });
                var data = [];
                for (let i = 0; i < type; i++) {
                    data.push({
                        date: String(i + 1),
                        count: 0
                    })
                }
                console.log(data);
                return response(res, 200, [], newDocs);
            })
    } else if (type == 7) {
        var d = new Date();
        var today = moment().subtract(0, 'days');
        var ago30day = moment().subtract(7, 'days');
        QuestionModel
            .find({ createdAt: { $gte: (ago30day), $lt: (today) } })
            .sort({ _id: -1 })
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                var result = docs.map(x => {
                    return String((x.createdAt).getDate()).slice(0, 10)
                })
                var result1 = result.reduce(function (acc, curr) {
                    if (typeof acc[curr] == 'undefined') {
                        acc[curr] = 1;
                    } else {
                        acc[curr] += 1;
                    }
                    return acc;
                }, {})
                var newDocs = Object.keys(result1).map(function (key) {
                    return { date: key, count: result1[key] };
                });
                return response(res, 200, [], newDocs);
            })
    } else if (type == 365) {
        var d = new Date();
        var today = moment().subtract(0, 'days');
        var ago30day = moment().subtract(365, 'days');
        QuestionModel
            .find({ createdAt: { $gte: (ago30day), $lt: (today) } })
            .sort({ _id: -1 })
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                var result = docs.map(x => {
                    return String((x.createdAt).getDate()).slice(0, 10)
                })
                var result1 = result.reduce(function (acc, curr) {
                    if (typeof acc[curr] == 'undefined') {
                        acc[curr] = 1;
                    } else {
                        acc[curr] += 1;
                    }
                    return acc;
                }, {})
                var newDocs = Object.keys(result1).map(function (key) {
                    return { date: key, count: result1[key] };
                });
                return response(res, 200, [], newDocs);
            })
    } else {
        return response(res, 400, []);

    }

}