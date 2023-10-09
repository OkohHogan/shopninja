const User = require('../models/UserModel.js');
const ErrorHandler = require('../utils/ErrorHandler.js');
const catchAsyncErrors = require('../middleware/catchAsyncErrors.js');
const sendToken = require('../utils/jwtToken.js');
const sendMail = require('../utils/sendMail.js');
const crypto = require('crypto');

//Register User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  const {name, email, password} = req.body;

  const user = await User.create({
      name,
      email,
      password
      // avatar: {
      //   public_id:"https://testing.com",
      //   url:"https://testing.com"
      // }
    })
  sendToken(user,200,res);
  })

//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const {email, password} = req.body;
  if(!email || !password){
    return next(new ErrorHandler('Please provide email and password', 400));
  }
  const user = await User.findOne({email}).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid Credentials', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid Credentials', 401));
  }

 sendToken(user,200,res);

});

// log out User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    message:'Logged out successfully',
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req,res,next) =>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler('User not found with this email',404));
  }
  //Get Reset Password Token
  const resetToken = user.getResetToken();

  await user.save({
    validateBeforeSave:false
  });

  
  
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) have requested the 
  reset of the password for your account.\n\nPlease click on the following link, or paste this 
  into your browser to complete the process:\n\n${resetPasswordUrl}\n\nIf you did not request this, 
  please ignore this email and your password will remain unchanged.\n`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Shop_Ninja Password Reset',
      message,
    });
    res.status(200).json({
      success: true,
      message: 'An e-mail has been sent to '+ user.email +' with further instructions.',
    });
  }catch(error) {
    user.resetPasswodToken = undefined;
    user.resetPasswordTime = undefined;

    await user.save({
      validateBeforeSave:false
    });
    
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  //create Token Hash
  
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: {$gt: Date.now()}
  });

  if (!user) {
    return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
  }
  if(req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password is matched with the new', 400));
  }

  user.password = req.body.password;

  user.resetPasswodToken = undefined;
  
  user.resetPasswordTime = undefined;

  await user.save();

  sendToken(user,200,res);
});

//Get User Details
exports.userDetails = catchAsyncErrors(async(req, res, next) =>{
  
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user
  });
});

//Update user Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  
  const user = await User.findById(req.user.id ).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.password.oldPassword);
  
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler('Old Password is incorrect', 400)
      );
  };
  if(req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler('New Password and Confirm Password do not match', 400)
      );
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
});

//update Use Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const  newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // we add cloudinary later when we are giving condition for avatar
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    });

  res.status(200).json({
    success: true,
  });
});

//Get all users ----Admin
exports.getAllUsers = catchAsyncErrors(async(req,res,next) =>{
  const users = await Users.find();

  res.status(200).json({
    success: true,
    users
  });
});

//Get Single users details ----Admin
exports.getSingleUser = catchAsyncErrors(async(req,res,next) => {
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler('User not found with this id',404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//change User Role --Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const  newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      userFindAndModify: false,
    });

  res.status(200).json({
    success: true,
    user,
  });
});

//Delete user --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  
  // we remove cloudinary later when we are giving condition for avatar
  const user = await User.findById(req.params.id);

  if(!user) {
    return next(new ErrorHandler("User not found with this id", 400));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
});
