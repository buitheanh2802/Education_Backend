import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import QuestionModel from "models/question.model";
import PostModel from "models/post.model";


export const search = async (req, res) => {
    var arrQuestion = [];
    var paginationQuestion = {};

    var arrPost = [];
    var paginationPost = {};

    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const skip = (currentPage - 1) * 10;
    var questionData = await QuestionModel
        .find({ title: { $regex: req.body.title } })
        .sort({ _id: -1 })
        .populate({ path: "createBy", select: 'fullname username avatar' })
        .populate({ path: "tags", select: "name slug" })
        .skip(skip)
        .limit(10)
    let result1 = questionData.map(x => {
        return {
            _id: x._id,
            countLikes: x.likes.length,
            countDislike: x.dislike.length,
            countBookmarks: x.bookmarks.length,
            bookmarks: x.bookmarks,
            likes: x.likes,
            dislike: x.dislike,
            comfirmAnswers: x.comfirmAnswers,
            tags: x.tags,
            title: x.title,
            content: x.content,
            views: x.views,
            slug: x.slug,
            spam: x.spam,
            createBy: x.createBy,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt
        }
    })
    arrQuestion = result1;
    paginationQuestion = {
        perPage: 10,
        totalPage: Math.ceil((result1.length) / 10),
        currentPage: currentPage,
        countDocuments: result1.length
    }

    var postData = await PostModel
        .find({ title: { $regex: req.body.title } })
        .sort({ _id: -1 })
        .populate({ path: "createBy", select: 'fullname username avatar' })
        .populate({ path: "tags", select: "name slug" })
        .skip(skip)
        .limit(10)
    let result2 = postData.map(x => {
        return {
            publishedBy: x.publishedBy,
            views: x.views,
            slug: x.slug,
            isAccept: x.isAccept,
            isDraft: x.isDraft,
            tags: x.tags,
            shortId: x.shortId,
            bookmarks: x.bookmarks,
            countBookmarks: x.bookmarks.length,
            likes: x.likes,
            dislikes: x.dislikes,
            countLikes: x.likes.length,
            countDislikes: x.dislikes.length,
            _id: x._id,
            title: x.title,
            content: x.content,
            createBy: x.createBy,
            createdAt: x.createdAt,
            updatedAt: x.updatedAt,
        }
    })
    arrPost = result2;
    paginationPost = {
        perPage: 10,
        totalPage: Math.ceil((result2.length) / 10),
        currentPage: currentPage,
        countDocuments: result2.length
    }

    return response(res, 200, [], {
        modelsQuestion: arrQuestion,
        metaDataQuestion: {
            pagination: paginationQuestion
        },
        modelsPost: arrPost,
        metaDataPost: {
            pagination: paginationPost
        },
    });
}