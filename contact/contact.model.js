const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    email: String,
    password: String,
    subscription: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
        },
    token: String,
},{versionKey: false});

class Contact {
    constructor() {
        this.contact = mongoose.model('Contact', contactSchema);
    }
    listContacts = async () => {
        return await this.contact.find();
    }
    getContactWithQuery = async (query={}) => {
        return await this.contact.find(query)
    }
    getContactById = async id => {
        return await this.contact.findById(id);
    }
    removeContact = async id => {
        return await this.contact.findByIdAndDelete(id);
    }
    addContact = async data => {
        return await this.contact.create(data);
    }
    updateContact = async (id, data) => {
        return await this.contact.findByIdAndUpdate(
            id, data, {new: true}
        );
    }
}

module.exports = new Contact();