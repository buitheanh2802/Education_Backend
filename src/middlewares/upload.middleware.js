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
    multiple: function(req, res, next){
        const initialize = new formidable.IncomingForm({
            keepExtensions : true,
            multiples : true
        });
        return (req, res, next) => {
            initialize.parse(req, (err, fields, file) => {
                if (err) {
                    return res.status(500).json({
                        message: ['ERROR_SERVER', err.message],
                        status: false
                    })
                }
                const fileData = file[fieldName];
                console.log(fileData);
                // if(fileData){
                //     createFileSystem(fileData.name,fileData.path);
                //     req.file = fileData;
                // }
                // req.body = fields;
                // next();
            })
        }
    }
}