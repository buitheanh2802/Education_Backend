import { PAGINATION_REGEX } from 'constants/regexDefination';
import { response } from 'constants/responseHandler';
import SolutionModel from 'models/solution.model';
import mongoose from 'mongoose';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

// global data
const solutionLimited = 15;

export const gets = async (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
        // console.log(token);
    } catch (error) {
        // console.log('error', error.message);
    }
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = solutionLimited;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await SolutionModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    SolutionModel.find({},'-__v -updatedAt -demoUrl -repoUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate([
                { path : 'challengeId',select : '-_id avatar'},
                { path : 'createBy',select : '-_id username email fullname'}]
        )
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if(docs && token){
                docs = docs.map(doc => {
                    doc.isVoted = doc.votes.includes(token._id);
                    delete doc.votes;
                    return doc;
                });
            }
            return response(res, 200, [],
                {
                    models: docs,
                    metaData: {
                        pagination: {
                            perPage: limit,
                            totalPage: totalPage,
                            currentPage: currentPage,
                            countDocuments: docs.length
                        }
                    }
                });
        })
}
export const get = (req, res) => {

}
export const update = (req, res) => {

}
export const remove = (req, res) => {

}
export const create = (req, res) => {
    const request = {
        title: req.body.title,
        descriptions: req.body.descriptions,
        demoUrl: req.body.demoUrl,
        repoUrl: req.body.repoUrl,
        createBy: req.userId,
        challengeId: req.body.challengeId
    }
    const solutionData = new SolutionModel(request);
    solutionData.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        return response(res, 200, []);
    })
}

// vote
export const vote = (req, res) => {
    SolutionModel.findOne({ _id: req.params.solutionId })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            // check voted
            // console.log(typeof docs.votes[0]);
            if (docs.votes.includes(req.userId)) {
                docs.votes.splice(docs.votes.indexOf(req.userId), 1);
            } else {
                docs.votes.push(req.userId)
            }
            docs.save((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                return response(res, 200, []);
            })
        })
}