import { google } from 'googleapis';
import path from 'path';

// set CLIENT ID google developer
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
Oauth2Client.setCredentials({ refresh_token : REFRESH_TOKEN})

// initial google drive
const drive = google.drive({
    // version current
    version: 'v3',
    // authentication
    auth: Oauth2Client
})

// create folder for drive
export const createFolder = async (folderName,isParentFolder = '1dH8_S2Fd2k1Nct6ZTsxaiojVzNaw-b4P') => {
    try {
        const folder = await drive.files.create({
            resource: {
                'name': folderName,
                'mimeType': 'application/vnd.google-apps.folder',
                parents : [isParentFolder]
            },
            fields: 'id'
        });
        console.log(folder);
    } catch (error) {
        console.log(error.message);
    }
}
