const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const resetPasswordExpiration = Date.now() + (15 * 60 * 1000);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter your Name"],
        minlength:[3,"Name must be more than 3 characters"],
        maxlength:[15,"Name must be less than 16 characters"]
    },
    email: {
        type: String,
        required: [true,"Please enter your Email"],
        unique: true,
        validate: [validator.isEmail,"Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true,"Please enter your Password"],
        minlength:[6,"Password must be more than 6 characters"],
        maxlength:[16,"Password must be less than 17 characters"],
        select: false,
    },
    // avatar: {
    //     public_id: {
    //         type: String,
    //         required: true
    //     },
    //     url: {
    //         type: String,
    //         required: true
    //     },
    // },
    role: {
        type: String,
        //enum: ['user','admin'],
        default: 'user'
    },
    resetPasswodToken: String,
    resetPasswordTime: Date,
});

//Hash Password

userSchema.pre("save", async function(next){
     if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

//jwt Token 
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

//Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Forgot Password

userSchema.methods.getResetToken = function(){
    //Generating token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // hashing and adding resetPasswordToken to UserSchema
    this.resetPasswodToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordTime = resetPasswordExpiration
    return resetToken;
}

module.exports = mongoose.model('User',userSchema);