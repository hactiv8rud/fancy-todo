const { Token, User, Sequelize } = require("../models");
const Op = Sequelize.Op;
const { verifyToken } = require("../helper/jwt");

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.headers.accesstoken;
        const csrfToken = req.headers.csrftoken;
        // console.log(JSON.stringify(req.headers));
        const refreshToken = req.cookies['refreshToken'];
        // console.log(JSON.stringify(req.cookies), "authentication")
        console.log(accessToken, csrfToken, "authentication/ATCT")
        if (!accessToken || !refreshToken || !csrfToken) {
            throw {
                status: 401,
                message: "Unauthorised Access!"
            }
        } else {
            const decoded = verifyToken(accessToken);
            req.loggedInUser = decoded;
            const data = await Token.findOne({
                where: {
                    [Op.and]: [{ accessToken }, { refreshToken }, { csrfToken }]
                }
            });

            if (!data) {
                throw {
                    status: 401,
                    message: "Unauthorised Access!"
                }
            }

            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            })
            
            if (user) {
                next();
            } else {
                throw {
                    status: 401,
                    message: "Unauthorised Access!"
                }
            }
        }
    } catch (err) {
        next(err);
    }
}