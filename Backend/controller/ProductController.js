const Product = require('../models/ProductModel.js');
const ErrorHandler = require('../utils/ErrorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const Features = require('../utils/Features.js');

//create product ...admin
exports.createProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

//get all products
exports.getAllProducts = catchAsyncErrors(async (req,res) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();
  const features = new Features(Product.find(), req.query)
  .search()
  .filter()
  .pagination(resultPerPage);
 const products = await features.query;
 res.status(200).json({
    success: true,
    products,
    resultPerPage,
 })
})

//update product --Admin only
exports.updateProduct = catchAsyncErrors(async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product was not found, check product id again",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useUnified: false
    });
    res.status(200).json({
        success: true,
        product
    })
})

//delete product --Admin only
exports.deleteProduct = catchAsyncErrors(async (req,res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product was not found, check product id again",404));
    }
    
    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully!!!"
    })
})

//single product details
exports.getsingleProduct = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.params.id);
   // const productCount = await Product.countDocuments();
    if(!product){
        return next(new ErrorHandler("product was not found, check product id again",404));
    }
    res.status(200).json({
        success: true,
        product,
       // productCount,
    })
})

//Create Review and update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) =>{
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
            (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({validateBeforeSave: false});

    res.status(201).json({
        success: true,
        message: "Review added successfully!!!",
    })

})

//Get All reviews of a single product
exports.getSingleProductReviews = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.id);
    
    if(!product){
        return next(new ErrorHandler("product was not found, check product id again",404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
        numOfReviews: product.numOfReviews,
    })
})

//Delete Review --Admin
exports.deleteProductReview = catchAsyncErrors(async (req,res,next) => {
    const product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler("product was not found, check product id again",404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );
    res.status(200).json({
        success: true,
        message: "Review deleted successfully!!!",
    });

});