import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';
// remove file system
export const removeFileSystem = (filename) => {
    fs.unlinkSync(path.resolve(__dirname,'../../public/media/pictures', filename));
    console.log(`file ${filename} is deleted`);
}
// create file system 
export const createFileSystem = (filename, filePath) => {
    const buffer = fs.readFileSync(filePath);
    fs.writeFileSync(path.resolve(__dirname,'../../public/media/pictures', filename), buffer);
    console.log(`file ${filename} is created`);
}

export function jsonEncode(data) {
    return Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
}

export function jsonDecode(data) {
    return JSON.parse(Buffer.from(data, 'base64').toString());
}