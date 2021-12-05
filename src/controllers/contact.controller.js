import { PAGINATION_REGEX } from "constants/regexDefination";
import { response } from "constants/responseHandler";
import ContactModel from "models/contact.model";

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
export const create = (req, res) => {
    const contactDefination = {
        ...req.body,
    }
    const contact = new ContactModel(contactDefination);
    contact.save((err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        const { type, ...data } = docs.toObject();
        return response(res, 200, [], data);
    })
}
export const get = (req, res) => {
    ContactModel
        .findOne({ _id: req.params.contactId })
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
