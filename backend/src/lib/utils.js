import jwt from 'jsonwebtoken';
// here we are implementing the generateToken function that will generate a token and store it in a cookie
export const generateToken = (userId,res) => {
    const token = jwt.sign({userId} , process.env.JWT_SECRET, {expiresIn: '7d'});
    // store the token in a cookie
    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
        // the cookie will be available in all the routes
        // secure: false,

    });
    return token;
};