const multer = require('multer');
const path = require('path');

const avatarUploader = () => {
    const storage = multer.diskStorage({
        destination: (req, filename, cb) => {
            cb(null, `public/images`)
        },
        filename: (req, filename, cb) => {
            const { ext } = path.parse(filename.originalname);
            cb(null, `${Date.now()}${ext}`);
        }
    })
    return multer({storage}).single('avatar');
}
module.exports = { 
    avatarUploader: avatarUploader(),
}
