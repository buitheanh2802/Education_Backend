import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import PostModel from "models/post.model";
import QuestionModel from "models/question.model";
import moment from "moment";

export const getsQuestion = async (req, res) => {
    var type = req.body.type;
    var arrType = [];
    QuestionModel
        .find({})
        .sort({ _id: -1 })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            var d = new Date();
            for (let i = 0; i < type; i++) {
                // console.log(moment().subtract(i, 'days').format('YYYY-MM-DD'));
                arrType.push(moment().subtract(i, 'days').format('YYYY-MM-DD'))
            }

            var result = docs.map(x => {
                return moment(x.createdAt).format('YYYY-MM-DD')
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
            // console.log(newDocs);

            var arrQuestion = [];
            for (let i = 0; i < arrType.length; i++) {
                for (let j = 0; j < newDocs.length; j++) {
                    if (arrType[i] == newDocs[j].date) {
                        arrQuestion.push(newDocs[j])
                    }
                }
            }
            var check = false;
            for (let i = 0; i < arrType.length; i++) {
                for (let j = 0; j < newDocs.length; j++) {
                    if (arrType[i] == newDocs[j].date) {
                        check = true;
                    }
                }
                if (check == false) {
                    arrQuestion.push({
                        date: arrType[i],
                        count: 0
                    })
                }
                check = false;
            }
            var newArrQuestion = arrQuestion.map(x => {
                return {
                    date: new Date(x.date),
                    count: x.count
                }
            })
            const sortedActivities = newArrQuestion.sort((a, b) => b.date - a.date)
            var newSortData = sortedActivities.map(x => {
                return {
                    date: moment(x.date).format("YYYY-MM-DD"),
                    count: x.count
                }
            })
            return response(res, 200, [], newSortData);
        })

}
export const getsPost = async (req, res) => {
    var type = req.body.type;
    var arrType = [];
    PostModel
        .find({})
        .sort({ _id: -1 })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            var d = new Date();
            for (let i = 0; i < type; i++) {
                // console.log(moment().subtract(i, 'days').format('YYYY-MM-DD'));
                arrType.push(moment().subtract(i, 'days').format('YYYY-MM-DD'))
            }

            var result = docs.map(x => {
                return moment(x.createdAt).format('YYYY-MM-DD')
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
            // console.log(newDocs);

            var arrQuestion = [];
            for (let i = 0; i < arrType.length; i++) {
                for (let j = 0; j < newDocs.length; j++) {
                    if (arrType[i] == newDocs[j].date) {
                        arrQuestion.push(newDocs[j])
                    }
                }
            }
            var check = false;
            for (let i = 0; i < arrType.length; i++) {
                for (let j = 0; j < newDocs.length; j++) {
                    if (arrType[i] == newDocs[j].date) {
                        check = true;
                    }
                }
                if (check == false) {
                    arrQuestion.push({
                        date: arrType[i],
                        count: 0
                    })
                }
                check = false;
            }
            var newArrQuestion = arrQuestion.map(x => {
                return {
                    date: new Date(x.date),
                    count: x.count
                }
            })
            const sortedActivities = newArrQuestion.sort((a, b) => b.date - a.date)
            var newSortData = sortedActivities.map(x => {
                return {
                    date: moment(x.date).format("YYYY-MM-DD"),
                    count: x.count
                }
            })
            return response(res, 200, [], newSortData);
        })

}