const Order = require('../models/OrderModel');
const ErrorHandler = require('../utils/ErrorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');

//create a new Order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shppingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shppingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id
  });

  res.status(201).json({
    success:true,
    order
  });
});

//Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new ErrorHandler('No order items found with this id', 404));
  }

  res.status(200).json({
    success:true, 
    order
  });
});

//Get All Orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({user: req.user._id})
  res.status(200).json({
    success:true, 
    orders
  });
});

//Get all orders --Admin
exports.getAllOrdersAdmin = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  
  orders.forEach(order => {
    totalAmount += order.totalPrice;
  });
  
  res.status(200).json({
    success:true,
    totalAmount,
    orders
  });
});

//Update Order Status ---Admin
exports.updateAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return next(new ErrorHandler('No order items found with this id', 404));
  }
  
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler('this Order has already been delivered', 400));
  }

  if (req.body.orderStatus === "shipped") {
    order.orderItems.forEach(async(o) => {
      await updateStock(o.product, o.quantity); 
      });
    }
    order.orderStatus = req.body.status;

    if (req.body.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success:true,
      order
    });

    async function updateStock(id, quantity) {

      const product = await Product.findById(id);
      
      product.stock -= quantity;

      await Product.save({validateBeforeSave: false})
    }
});

//Delete Order Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
 
  const orders = await Order.findById(req.params.id);
  
  if (!orders) {
    return next(new ErrorHandler('No order items found with this id', 404));
  }

  await orders.remove();
  res.status(200).json({
    success:true,
    message: 'Order has been deleted'
  });
  
});