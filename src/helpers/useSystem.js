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
// create file system 
export const createFileSystem = (filename,filePath) => {
    try{
        const buffer = fs.readFileSync(filePath);
        fs.writeFileSync(path.resolve(__dirname,'../assets/pictures',filename),buffer);
        console.log(`file ${filename} is created`);
    }catch(error){
        console.log(`file ${filename} create failure with error : ${error.message}`);
    }
}
