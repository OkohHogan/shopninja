const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Kindly enter Product name"],
        maxlength:[25, 'Product name cannot exceed 25 characters'],
        trim: true
        },
    description:{
        type: String,
        required: [true, "Kindly enter Product description"],
        maxlength:[4000, 'Description cannot exceed 4000 characters']
    },
    price:{
        type: Number,
        required: [true, "please add a price for the product"],
        maxlength:[8, "Price cannot exceed 8 characters"]
    },
    discountprice:{
        type: String,
        maxlength:[4, "Discount price cannot exceed 4 characters"]
    },
    color:{
        type: String,
    },
    size:{
        type: String,
    },
    image:{
        type: String,
    },
    ratings:{
        type: Number,
        default: 0,
    },
    // images:[
    //     {
    //         public_id:{
    //             type: String,
    //             required: true,
    //         },
    //         public_url:{
    //             type: String,
    //             required: true,
    //         },
    //     }
    // ],
    category:{
        type: String,
        required: [true, "Kindly enter Product category"],
    },
    stock:{
        type: Number,
        required: [true, "Kindly enter the number of Product available"],
        maxlength:[3, "product stock cannot exceed 3 (999) characters"]
    },
  numOfReviews:{
    type: Number,
    default: 0,
 },
 reviews:[
    {
        user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
        },
        time: {
            type: Date,
            default: Date.now(),
        },
    },
 ],
 user:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
 },
 createAt:{
    type: Date,
    default: Date.now(),
 }
})

module.exports = mongoose.model('Product',productSchema);