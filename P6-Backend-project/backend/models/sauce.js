const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String },
    description: { type: String },
    heat: { type: Number },
    mainPepper: {type: String},
    imageUrl: {type: String},
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: [ {type: String} ],
    usersDisliked: [ {type: String} ]
});

sauceSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Sauce', sauceSchema);