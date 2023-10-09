const Cart = require('../models/CartModel.js');
const ErrorHandler = require('../utils/ErrorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const Features = require('../utils/Features.js');

//Add Item to Cart
exports.addToCart = catchAsyncErrors(async (req,res,next) => {
    const item = await Cart.create(req.body);

    res.status(201).json({
        success: true,
        item
    })
});

//Get User Items 
exports.fetchItems = catchAsyncErrors(async(req, res, next) =>{
  
    const item = await Cart.findById(req.item.id);
    res.status(200).json({
      success: true,
      item
    });
  });

//delete product from cart 
exports.deleteItem = catchAsyncErrors(async (req,res, next) => {
    const item = await Cart.findById(req.params.id);
    if(!item){
        return next(new ErrorHandler("product was not found, check product id again",404));
    }
    
    await item.deleteOne();

    res.status(200).json({
        success: true,
        message: "Item deleted successfully!!!"
    })
})

