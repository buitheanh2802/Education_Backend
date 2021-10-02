import sharp from 'sharp';
import path from 'path';

export const cropper = (sharpConfig) => {
    return sharp(sharpConfig.path)
                .resize(sharpConfig.width,sharpConfig.height)
                .png()
                .toFile(path.join(__dirname,'../../public/media/pictures',sharpConfig.filename))
}