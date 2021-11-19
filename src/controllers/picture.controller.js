import { response } from "constants/responseHandler";
import formidable from "formidable";
import { cropper } from "helpers/imageCropper";
import PictureModel from "models/picture.model";
import { async } from "regenerator-runtime";
import { createFile, deleteFile } from "services/drive";
import { createFileSystem, removeFileSystem } from 'services/system.js'

export const create = (req, res) => {
    console.log('running !');
    const initialize = new formidable.IncomingForm({
        maxFileSize: 1024 * 1024,
        keepExtensions: true
    });
    initialize.parse(req, async (err, fields, file) => {
        const { image } = file;
        if (err) return response(res, 400, ['INVALID_SIZE', err.message])
        if (image) {
            await cropper({
                width: 200,
                height: 200,
                path: image.path,
                filename: image.name
            });
            var driveFileResponse = await createFile(image.name, req.driveId);
        }
        const createNewImage = new PictureModel({
            photo: {
                id: driveFileResponse.id,
                photoUrl: driveFileResponse.webContentLink
            },
            createBy: req.userId
        })
        createNewImage.save((err, docs) => {
            if (err) return response(res, 500, ['ERROR_SERVER']);
            return response(res, 200, [], docs)
        })
        removeFileSystem(image.name);

    })
}
// gets
export const gets = (req, res) => {
    PictureModel.find({ createBy: req.userId }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER']);
        return response(res, 200, [], docs);
    })
}
export const remove = (req, res) => {
    //xoa trong google drive
    PictureModel.find({ _id: req.params.pictureId }, async (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        console.log(docs);
        const fileId = docs[0].photo.id;
        await deleteFile(fileId)
        if (docs.length == 0) {
            return response(res, 400, ['Can not find id!']);
        }
    })
    //xoa trong db
    PictureModel.deleteOne({ _id: req.params.pictureId }, (err, docs) => {
        if (err) return response(res, 500, ['ERROR_SERVER', err.message]);
        if (!docs) return response(res, 400, ['EMPTY_DATA']);
        return response(res, 200, []);
    })
}