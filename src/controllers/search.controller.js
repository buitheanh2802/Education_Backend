import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import QuestionModel from "models/question.model";
import PostModel from "models/post.model";
import TagModel from "models/tag.model";
import UserModel from "models/user.model";

const limited = 10;
const trendingViews = 100;

// search multiple
export const searchMultiple = async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return response(res, 405, ['ERROR_SYNTAX']);
    let dataQuery = await Promise.all([
        QuestionModel.find({ title: { $regex: keyword, $options: 'i' },spam : false })
            .populate({ path: 'createBy', select: '-_id username fullname avatar' })
            .select('title createdAt createBy').lean(),
        PostModel.find({ title: { $regex: keyword, $options: 'i' },isDaft : false,isAccept : true })
            .populate({ path: 'createBy', select: '-_id username fullname avatar' })
            .select('-_id title shortId createdAt createBy').lean(),
        TagModel.find({ name: { $regex: keyword, $options: 'i' } })
            .select('-_id name slug avatar').lean(),
        UserModel.find({
            $or: [{ fullname: { $regex: keyword, $options: 'i' } },
            { username: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } }
            ]
        }).populate(['followerCounts','postCounts','questionCounts']).select('-_id username fullname avatar').lean()
    ]);
    dataQuery = dataQuery.map((content, index) => {
        if (index == 0) return { title: 'Câu hỏi', searchResults : content }
        if (index == 1) return { title: 'Bài viết', searchResults : content }
        if (index == 2) return { title: 'Thẻ', searchResults : content }
        if (index == 3) return { title: 'Tác giả', searchResults : content }
    })
    return response(res, 200, [], dataQuery);
}
// search question
export const searchQuestion = async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return response(res, 405, ['ERROR_SYNTAX']);
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const skip = (currentPage - 1) * limited;
    const countDocuments = await QuestionModel.countDocuments({ title: { $regex: keyword, $options: 'i' },spam : false });
    const totalPage = Math.ceil(countDocuments / limited);

    QuestionModel.find({ title: { $regex: keyword, $options: 'i' }, spam: false })
        .skip(skip)
        .limit(limited)
        .select('_id views shortId title slug tags createBy createdAt bookmarks')
        .sort({ createdAt: -1 })
        .populate({ path: 'comments' })
        .populate({ path: 'createBy', select: '-_id username email avatar fullname' })
        .populate({ path: 'tags', select: '-_id name slug' })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [],
                {
                    models: docs.map(doc => ({
                        ...doc,
                        bookmarks: doc.bookmarks?.length || 0,
                        // likes: doc.likes?.length || 0,
                        // dislike: doc.dislike?.length || 0,
                        isTrending: doc.views > trendingViews ? true : false
                    })),
                    metaData: {
                        pagination: {
                            perPage: limited,
                            totalPage: totalPage,
                            currentPage: currentPage,
                            countDocuments: docs.length
                        }
                    }
                });
        })
}
// search tag
export const searchTag = async (req, res) => {

}
// search author
export const searchAuthor = async (req, res) => {

}
// search post
export const searchPost = async (req, res) => {

}