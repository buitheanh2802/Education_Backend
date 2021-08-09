import formidable from 'formidable';
import { createFileSystem,removeFileSystem } from './../helpers/useSystem';
import _ from 'lodash';

export const upload = {
    // upload single file
    single: function(fieldName){
        const initialize = new formidable.IncomingForm({
            keepExtensions : true
        })
        return (req, res, next) => {
            initialize.parse(req, (err, fields, file) => {
                if (err) {
                    return res.status(500).json({
                        message: ['ERROR_SERVER', err.message],
                        status: false
                    })
                }
                const fileData = file[fieldName];
                if(fileData){
                    createFileSystem(fileData.name,fileData.path);
                    req.file = fileData;
                }
                req.body = fields;
                next();
            })
        }
    },
    //upload mutiple file
    multiple: function(fieldName){
        const initialize = new formidable.IncomingForm({
            keepExtensions : true,
            multiples : true
        });
        return (req, res, next) => {
            initialize.parse(req, (err, fields, files) => {
                if (err) {
                    return res.status(500).json({
                        message: ['ERROR_SERVER', err.message],
                        status: false
                    })
                }
                const fileData = files[fieldName];
                if(fileData && _.isArray(fileData)){
                    fileData.forEach(file => {
                        createFileSystem(file.name,file.path);
                    })
                    req.files = fileData;
                }
                req.body = fields;
                next();
            })
        }
    }
}