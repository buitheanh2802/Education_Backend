import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import ContactModel from "models/contact.model";
import { sendMail } from "services/mailer";

export const gets = async (req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await ContactModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    ContactModel
        .find({})
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 })
        .populate({ path: "submittedBy", select: 'fullname avatar username' })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], {
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
export const create = async (req, res) => {
    const { email } = req.body;
    const contactDefination = {
        ...req.body,
    }
    const contact = new ContactModel(contactDefination);
    contact.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        try {
            sendMail(email, 'DevStar', 'verifyContactTemplate', {
                activeContact: ``,
                layout: 'verifyContactTemplate'
            });
        } catch (error) {
            console.log(error);
        }

        return response(res, 200, [], data);
    })
}
export const get = (req, res) => {
    ContactModel
        .findOne({ _id: req.params.contactId })
        .populate({ path: "submittedBy", select: 'fullname avatar username' })
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const { type, ...data } = docs.toObject();
            return response(res, 200, [], docs);
        })
}
export const remove = (req, res) => {
    const conditions = {
        _id: req.params.contactId,
    }
    ContactModel.deleteOne(conditions, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}
export const updateFeedback = (req, res) => {
    ContactModel
        .findOne({ _id: req.params.contactId }, (err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            if (!docs) return response(res, 400, ['EMPTY_DATA']);
            const newObj = {
                submittedBy: req.userId,
                feedback: !docs.feedback,
            }
            ContactModel.updateOne({ _id: req.params.contactId }, newObj, (err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
                if (!docs) return response(res, 400, ['EMPTY_DATA']);
                return response(res, 200, []);
            })
        })
}

// filter contact 
export const managerFilter = (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return response(res, 405, ['ERROR_SYNTAX']);
    ContactModel.find({ $or : [{title: { $regex: keyword, $options: 'i' }},
        {phone: { $regex: keyword, $options: 'i' }}] })
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
            return response(res, 200, [], docs);
        })
}