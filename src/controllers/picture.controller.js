import { response } from "constants/responseHandler";
import formidable from "formidable";
import { cropper } from "helpers/imageCropper";
import PictureModel from "models/picture.model";
import { createFile } from "services/drive";

export const create = (req, res) => {

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
            console.log(driveFileResponse);
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

    })
}