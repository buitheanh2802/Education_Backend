import fs from 'fs';
import path from 'path';

// remove file system
export const removeFileSystem = (filename) => {
    try {
        fs.unlinkSync(path.resolve(__dirname,'../assets/pictures',filename));
        console.log(`file ${filename} is deleted`);
    } catch (error) {
        console.log(`file ${filename} delete failure with error : ${error.message}`);
    }
}