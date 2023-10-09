const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error"

    //wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found with this id...Invalid ${err.path}`;
        err = new ErrorHandler(message, 400)
    }
    //Duplicate Key Error
    else if(err.code === 11000){
        const message = `Duplicate key ${Object.keys(err.keyValue)} entered}`;
        err = new ErrorHandler(message, 400)
    }
    //Wrong Jwt error
    else if(err.name === "JsonWebTokenError"){
        const message = "Invalid Url, please try again";
        err = new ErrorHandler(message, 401)
    }

    //Expired error
    else if(err.name === "TokenExpiredError"){
        const message = "Token expired, please login again";
        err = new ErrorHandler(message, 401)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.stack
    })
}