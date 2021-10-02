import TagModel from "models/tag.model";
import formidable from "formidable";
import { response } from "constants/responseHandler";
import { TAGNAME,PAGINATION_REGEX } from 'constants/regexDefination';
import { cropper } from 'helpers/imageCropper';
import { createFile,createFolder } from 'services/drive';
import { assignIn } from 'lodash';

export const gets = async(req, res) => {
    const { page } = req.query;
    let currentPage = 1;
    if (PAGINATION_REGEX.test(page)) currentPage = Number(page);
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const countDocuments = await TagModel.countDocuments();
    const totalPage = Math.ceil(countDocuments / limit);
    TagModel
        .find({}, '-__v -updatedAt -driveId')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
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

export const create = (req,res) => {
    // request cần có : name , token ,role : admin hoặc collaborators,photos
    const initialize = new formidable.IncomingForm({
        maxFileSize : 1024 * 1024,
        keepExtensions : true
    });
    initialize.parse(req,async(err,fields,file) => {
        const { name } = fields;
        const { photo } = file;
        if(err) return response(res,400,['INVALID_SIZE',err.message]);
        if(!fields.name || !TAGNAME.test(fields.name)) return response(res,400,['INVALID_DATA']);
        if(photo){
            await cropper({
                width : 200,
                height : 200,
                path : photo.path,
                filename : photo.name
            });
            var driveFolderResponse = await createFolder(fields.name,'1Ux1_gYhjz4vQGnInOlGdkDtQ69H4AVs1');
            var driveFileResponse = await createFile(photo.name,driveFolderResponse.id);
        }
        const createNewTag = new TagModel({
            name : name,
            pathName : name.toLowerCase(),
            avatar : {
                _id : driveFileResponse?.id,
                avatarUrl : driveFileResponse?.webContentLink
            },
            driveId : driveFolderResponse.id
        });
        createNewTag.save((err,docs) => {
            if(err) return response(res,500,['ERROR_SERVER']);
            return response(res,200,[])
        })
    })
}

export const update = (req,res) => {
    // request cần có : name , token ,role : admin hoặc collaborators,photos
    const initialize = new formidable.IncomingForm({
        maxFileSize : 1024 * 1024,
        keepExtensions : true
    });
    initialize.parse(req,async(err,fields,file) => {
        const { photo } = file;
        fields.pathName = fields.name.toLowerCase();
        if(err) return response(res,400,['INVALID_SIZE',err.message]);
        if(!fields.name || !TAGNAME.test(fields.name)) return response(res,400,['INVALID_DATA']);
        TagModel.findOne({ pathName : req.params.tagname.toLowerCase( )},async(err,docs) => {
            if(err) return response(res,500,['ERROR_SERVER']);
            if(!docs) return response(res,400,['TAG_NOTEXIST']);
            if(photo){
                await cropper({
                    width : 200,
                    height : 200,
                    path : photo.path,
                    filename : photo.name
                });
                var driveFileResponse = await createFile(photo.name,docs.driveId);
                fields.avatar = {
                    _id : driveFileResponse.id,
                    avatarUrl : driveFileResponse.webContentLink
                }
            }
            const currentData = assignIn(docs,fields);
            currentData.save((err,docs) => {
                if(err) return response(res,500,['ERROR_SERVER']);
                return response(res,200,[])
            });
        })
    })
}