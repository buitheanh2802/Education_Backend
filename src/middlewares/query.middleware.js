import { PAGINATION_REGEX } from 'constants/regexDefination';
import { response } from 'constants/responseHandler';

export const pagination = (modelName, limit,fieldSelect, conditions = {}) => {
    const parseConditions = {}
    return async (req, res, next) => {
        for(let condition in conditions){
            parseConditions[condition] = eval(conditions[condition])
        }
        let { page } = req.query;
        if (!page) return next();
        if (!PAGINATION_REGEX.test(page)) page = 1;
        const skip = (page - 1) * limit;
        const countDocuments = await modelName.countDocuments(parseConditions);
        const totalPage = Math.ceil(countDocuments / limit);
        modelName.find(parseConditions)
            .skip(skip)
            .limit(limit)
            .select(fieldSelect)
            .exec((err, docs) => {
                if (err) return response(res, 500, ['ERROR_SERVER',err.message]);
                return response(res, 200, [],
                    {
                        models: docs,
                        metaData: {
                            pagination: {
                                perPage: limit,
                                totalPage: totalPage,
                                currentPage: page,
                                countDocuments: docs.length
                            }
                        }
                    });
            })
    }
}