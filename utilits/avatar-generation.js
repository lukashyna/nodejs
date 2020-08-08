const Avatar = require('avatar-builder');
const fs = require('fs')
const catAvatar = Avatar.catBuilder(256);
const nameAvatar = Date.now()

const getAvatar = () =>{
    catAvatar.create(`${nameAvatar}`).then(buffer => fs.writeFileSync(`tmp/${nameAvatar}.png`, buffer));
    
}
module.exports = {
    getAvatar
}
