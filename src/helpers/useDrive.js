import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// set CLIENT ID google developer
// theanhbui345@gmail.com
const CLIENT_ID = '1086121129219-iuee1ggc3j1nukm2efcrstkk50rkgpvr.apps.googleusercontent.com';
// set SECRET google developer
const CLIENT_SECRET = 'C7AK7fuqm3SbwD3LPhakctR8';
// Chuyển hướng đến google server để thực hiện các yêu cầu
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// refresh token trên server mỗi khi token hết hạn
const REFRESH_TOKEN = '1//04xUfByx5c_A2CgYIARAAGAQSNwF-L9IrCY1Jderm0AIYx5i9wlFaJ9gFzKF10T_fiUrNwqb33gIuXxUJ1YPrldPoUfZ5pm_28r4'

// initial google auth
const Oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)
// set credential for refresh token
Oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

// initial google drive
const drive = google.drive({
    // version current
    version: 'v3',
    // authentication
    auth: Oauth2Client
})

// set permission for file and folder 
const setPermission = async (fileOrFolderID) => {
    try {
        await drive.permissions.create({
            fileId: fileOrFolderID,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });
        console.log('permission is created for ID : ', fileOrFolderID);
    } catch (error) {
        console.log(error.message);
    }
}

// create folder for drive
export const createFolder = async (folderName, parentFolder = '1dH8_S2Fd2k1Nct6ZTsxaiojVzNaw-b4P') => {
    const { data } = await drive.files.create({
        resource: {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
            parents: [parentFolder]
        },
        fields: 'id'
    });
    // set public cho folder
    await setPermission(data.id);
    return data;
}

// create file for drive
export const createFile = async (fileName, parentFolder = '1dH8_S2Fd2k1Nct6ZTsxaiojVzNaw-b4P') => {
    const { data } = await drive.files.create({
        fields: 'id,webContentLink',
        resource: {
            name: fileName,
            parents: [parentFolder]
        },
        media: {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(path.join(__dirname, '../assets/pictures', fileName))
        }
    });
    await setPermission(data.id);
    return data;
}

export const deleteFile = async (fileId) => {
    const { data } = await drive.files.delete({
        fileId,
        fields: 'file'
    })
    console.log(`folder is deleted !`);
}

export const deleteFolder = async (fileId) => {
    const { data } = await drive.files.delete({
        fileId,
        fields: 'application/vnd.google-apps.folder'
    })
    console.log(`folder is deleted !`);
}