// create token and saving that in cookies
const sendToken = (user,statusCode,res) =>{
    
    const token = user.getJwtToken();
    const expiresInMilliseconds = parseInt(process.env.JWT_EXPIRES) * 24 * 60 * 60 * 1000;

    //options for cookies
    const options = {
        expires: new Date(
            Date.now() + expiresInMilliseconds 
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
    })
}

module.exports = sendToken;