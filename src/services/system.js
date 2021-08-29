import fs from 'fs';
import path from 'path';

// remove file system
export const removeFileSystem = (filename) => {
    fs.unlinkSync(path.resolve(__dirname, '../assets/pictures', filename));
    console.log(`file ${filename} is deleted`);
}
// create file system 
export const createFileSystem = (filename, filePath) => {
    const buffer = fs.readFileSync(filePath);
    fs.writeFileSync(path.resolve(__dirname, '../assets/pictures', filename), buffer);
    console.log(`file ${filename} is created`);
}