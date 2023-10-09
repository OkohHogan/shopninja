const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter item Name"],
    },
    cost: {
        type: String,
        required: [true,"Please enter item cost"],
    },
    category: {
        type: String,
        required: [true,"Please enter item category"],
    },
    item_id: {
        type: String,
        required: [true,"Please enter item item_id"],
    },
    color: {
        type: String,
        required: [true,"Please enter item color"],
    },
    user_id: {
        type: String,
        required: [true,"Please enter  user_id"],
    },
    description: {
        type: String,  
    },
    image: {
        type: String,
        required: [true,"Please enter item image"],
    },


});


module.exports = mongoose.model('Cart',cartSchema);