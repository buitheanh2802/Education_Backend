import UserModel from 'models/user.model';
import FollowModel from 'models/follow.model';
import PostModel from 'models/post.model';
import { response } from "constants/responseHandler";
import jwt from 'jsonwebtoken';


export const get = (req, res) => {
    try {
        var token = jwt.verify(req.headers?.authorization?.split(" ")[1], process.env.SECRET_KEY);
    } catch (error) {
        // console.log('error', error.message);
    }
    UserModel.findOne({ username: req.params.username })
        .populate({ path: 'postCounts' })
        .populate({ path: 'questionCounts' })
        .populate({ path: 'followers' })
        .select('username fullname email points avatar')
        .lean()
        .exec(async (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 200, ['EMPTY_DATA']);
            const followingCounts = await FollowModel.countDocuments({ userId : String(docs._id) });
            docs.isFollowing = false;
            if(token){
                docs.followers.forEach(doc => {
                    if(doc.userId === token?._id){
                        docs.isFollowing = true;
                    }
                })
            }
            delete docs._id;
            docs.followers = docs.followers.length;
            return response(res, 200, [], {...docs,followingCounts});
        })
}

export const myPostBookmark = (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 5;
    const skip = (currentPage - 1) * limit;
    // const countDocuments = await PostModel.countDocuments({ bookmarks : });
    const totalPage = Math.ceil(countDocuments / limit);
    // .exec((err, docs) => {
    //     if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
    //     return response(res, 200, [],
    //         {
    //             models: docs,
    //             metaData: {
    //                 pagination: {
    //                     perPage: limit,
    //                     totalPage: totalPage,
    //                     currentPage: currentPage,
    //                     countDocuments: docs.length
    //                 }
    //             }
    //         });
    // })
}

export const myQuestion = (req, res) => {

}

export const myPost = (req, res) => {

}

export const myTag = (req, res) => {

}

export const followers = (req, res) => {
    
}

export const following = (req, res) => {

}