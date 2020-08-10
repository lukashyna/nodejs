const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    avatarURL: String,
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
        },
    token: String,
    verificationToken: String
},{versionKey: false});

class User {
    constructor() {
        this.user = mongoose.model('User', userSchema);
    }
    getUser = async () => {
        return await this.user.find();
    }
    getUserWithQuery = async (query={}) => {
        return await this.user.find(query)
    }
    getUserById = async id => {
        return await this.user.findById(id);
    }
    // removeUser = async id => {
    //     return await this.user.findByIdAndDelete(id);
    // }
    addUser = async data => {
        return await this.user.create(data);
    }
    updateUser = async (id, data) => {
        return await this.user.findByIdAndUpdate(
            id, data, {new: true}
        );
    }
}

module.exports = new User();