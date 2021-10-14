import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// set CLIENT ID google developer
// theanhbui345@gmail.com
const CLIENT_ID = '545853333657-g48gpju18ievovfl6tj6m5tcvr31g97t.apps.googleusercontent.com';
// set SECRET google developer
const CLIENT_SECRET = 'htp2LdjdPUnfVfKtW6XWAG4j';
// Chuyển hướng đến google server để thực hiện các yêu cầu
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// refresh token trên server mỗi khi token hết hạn
const REFRESH_TOKEN = '1//04FBzzSUqzgrYCgYIARAAGAQSNwF-L9IrB9T0_8Z_1-G8t4JREC83DXP-268uC-r5z2SSYejfpSTEPFg1l26itD7ZWk2HKbG26tU';

// initial google auth
const Oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

const initializeDrive = () => {
    // set credential for refresh token
    Oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
    // initial google drive
    const drive = google.drive({
        // version current
        version: 'v3',
        // authentication
        auth: Oauth2Client
    });
    return drive;
}

// set permission for file and folder 
const setPermission = async (fileOrFolderID) => {
    const drive = initializeDrive();
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
    const drive = initializeDrive();
    const { data } = await drive.files.create({
        resource: {
            'name': folderName,
            'mimeType': 'application/vnd.google-apps.folder',
            parents: [parentFolder]
        },
        fields: 'id'
    });
    // set public cho folder
    // await setPermission(data.id);
    return data;
}

// create file for drive
export const createFile = async (fileName, parentFolder = '1dH8_S2Fd2k1Nct6ZTsxaiojVzNaw-b4P') => {
    const drive = initializeDrive();
    const { data } = await drive.files.create({
        fields: 'id,webContentLink',
        resource: {
            name: fileName,
            parents: [parentFolder]
        },
        media: {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(path.join(__dirname, '../../public/media/pictures', fileName))
        }
    });
    await setPermission(data.id);
    return data;
}

export const deleteFile = async (fileId) => {
    const drive = initializeDrive();
    const { data } = await drive.files.delete({
        fileId,
        fields: 'file'
    })
    console.log(`folder is deleted !`);
}

export const deleteFolder = async (fileId) => {
    const drive = initializeDrive();
    const { data } = await drive.files.delete({
        fileId,
        fields: 'application/vnd.google-apps.folder'
    })
    console.log(`folder is deleted !`);
}