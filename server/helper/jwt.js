const jwt = require("jsonwebtoken");

function sign(id, email) {
    return jwt.sign(
        { id, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

function verifyToken(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }
  
function signRefreshToken(id, email) {
    return jwt.sign(
        { id, email },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

function verifyRefreshToken(token) {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
} 

module.exports = {
    sign,
    verifyToken,
    signRefreshToken,
    verifyRefreshToken
}