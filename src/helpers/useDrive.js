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
const REFRESH_TOKEN = '1//04xPtk5h69V9eCgYIARAAGAQSNwF-L9Irup7mDpbyIQhNjc_GM20-Njdm4jAhk7KczGI05pnmpPAanSu1gHSCFO8whhwvk2Buk8g'

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
export const createFolder = async (folderName, isParentFolder = '1dH8_S2Fd2k1Nct6ZTsxaiojVzNaw-b4P') => {
    try {
        const { data } = await drive.files.create({
            resource: {
                'name': folderName,
                'mimeType': 'application/vnd.google-apps.folder',
                parents: [isParentFolder]
            },
            fields: 'id'
        });
        // set public cho folder
        await setPermission(data.id);
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export const createFile = async (fileName, isParentFolder = '1dH8_S2Fd2k1Nct6ZTsxaiojVzNaw-b4P') => {
    try {
        const { data } = await drive.files.create({
            fields: 'id,webContentLink',
            resource: {
                name: fileName,
                parents: [isParentFolder]
            },
            media: {
                mimeType: 'image/jpeg',
                body: fs.createReadStream(path.join(__dirname, '../assets/pictures', fileName))
            }
        });
        await setPermission(data.id);
        return data;
    } catch (error) {
        console.log(error.message);
    }
}
