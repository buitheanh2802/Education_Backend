import { response } from "constants/responseHandler";
import QuestionModel from "models/question.model";

export const gets = (req, res) => {
    QuestionModel.find({}, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, docs);
    })
}
export const create = (req, res) => {
    console.log(req)
    // const questionDefination = {
    //     ...req.body,
    //     createBy: req.userId
    // }
    // console.log(questionDefination);
    // const question = new QuestionModel(req.body);
    // question.save((err, docs) => {
    //     if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
    //     const { type, ...data } = docs.toObject();
    //     return response(res, 200, [], data);
    // })
}
