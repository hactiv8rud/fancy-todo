const { User, Token, sequelize, Sequelize } = require("../models");
const Op = Sequelize.Op;
const { compare } = require("../helper/bcrypt");
const { sign, signRefreshToken, verifyRefreshToken } = require("../helper/jwt");
const getExpiredAt = require("../helper/getExpiredAt");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const crypto = require("crypto");

class UserController {
    static register(req, res, next) {
        const userObj = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password
        }
        User.create(userObj)
            .then((data) => {
                res.status(201).json({ id: data.id, email: data.email });
            })
            .catch((err) => {
                next(err);
            })
    }

    static async login(req, res, next) {
        try {
            let data;
            let accessToken;
            let refreshToken;
            let csrfToken;
            await sequelize.transaction(async (t) => {
                data = await User.findOne({
                    where: {
                        email: req.body.email,
                    },
                    transaction: t
                });
                if (!data) {
                    throw {
                        status: 401,
                        message: 'The email or password is incorrect'
                    }
                } else if (compare(req.body.password, data.password)) {
                    accessToken = sign(data.id, data.email);
                    refreshToken = signRefreshToken(data.id, data.email, data.fullName);
                    csrfToken = crypto.randomUUID();
                    const newToken = {
                        accessToken,
                        refreshToken,
                        csrfToken,
                        refreshTokenExpiredAt: getExpiredAt(+process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
                        AdminId: data.id,
                    };
                    await Token.create(newToken, { transaction: t });
                    await Token.destroy({
                        where: {
                            refreshTokenExpiredAt: { [Op.lte]: new Date() }
                        },
                        transaction: t
                    });
                } else {
                    throw {
                        status: 401,
                        message: 'The email or password is incorrect'
                    }
                }
            });
            res.cookie('refreshToken', refreshToken, {
                expires: new Date(Date.now() + +process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                priority: 'high'
            });
            res.status(200).json({
                accessToken, csrfToken, fullName: data.fullName
            });
        } catch (err) {
            next(err);
        }
    }
    
    static async refreshToken(req, res, next) {
        try {
            let accessToken;
            let newRefreshToken;
            let newCsrfToken;
            // let id;
            // let adminClass;
            let fullName;
            await sequelize.transaction(async (t) => {
                const refreshToken = req.cookies['refreshToken'];
                // const csrfToken = req.body.csrfToken;
                if (!refreshToken) {
                    throw {
                        status: 401,
                        message: 'Unauthorized Access!'
                    }
                }
                const data = await Token.findOne({
                    where: {
                        refreshToken
                    },
                    transaction: t
                });
                if (!data) {
                    throw {
                        status: 401,
                        message: 'Unauthorized Access!'
                    }
                } else {
                    const decoded = verifyRefreshToken(data.refreshToken);
                    accessToken = sign(decoded.id, decoded.email);
                    newRefreshToken = signRefreshToken(decoded.id, decoded.email, decoded.fullName);
                    newCsrfToken = crypto.randomUUID();
                    const newToken = {
                        accessToken,
                        refreshToken: newRefreshToken,
                        csrfToken: newCsrfToken,
                        refreshTokenExpiredAt: getExpiredAt(+process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
                        UserId: decoded.id,
                    };
                    await Token.create(newToken, { transaction: t });
                    await Token.destroy({
                        where: {
                            [Op.or]: [{ id: data.id }, { refreshTokenExpiredAt: { [Op.lte]: new Date() } }]
                        },
                        transaction: t
                    });
                    // id = decoded.id;
                    // adminClass = decoded.class;
                    fullName = decoded.fullName;
                }
            });
            res.cookie('refreshToken', newRefreshToken, {
                expires: new Date(Date.now() + +process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                priority: 'high'
            });
            res.status(200).json({ accessToken, csrfToken: newCsrfToken, fullName });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res, next) {
        try {
            await sequelize.transaction(async (t) => {
                const UserId = +req.loggedInUser.id;
                const refreshToken = req.cookies['refreshToken'];
                const csrfToken = req.headers.csrftoken;
                await Token.destroy({
                    where: {
                        [Op.or]: [
                            { [Op.and]: [{ refreshToken }, { UserId }, { csrfToken }] },
                            { refreshTokenExpiredAt: { [Op.lte]: new Date() } }
                        ]
                    },
                    transaction: t
                });
            });
            res.cookie('refreshToken', '', {
                expires: new Date(0),
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                priority: 'high'
            });
            res.status(200).json({ message: 'You have been signed out' });
        } catch (err) {
            next(err);
        }
    }
    
    static async logoutAll(req, res, next) {
        try {
            await sequelize.transaction(async (t) => {
                const UserId = +req.loggedInUser.id;
                await Token.destroy({
                    where: {
                        [Op.or]: [{ UserId }, { refreshTokenExpiredAt: { [Op.lte]: new Date() } }]
                    },
                    transaction: t
                });
            });
            res.cookie('refreshToken', '', {
                expires: new Date(0),
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                priority: 'high'
            });
            res.status(200).json({ message: 'You have been signed out on all devices' });
        } catch (err) {
            next(err);
        }
    }

    static async googleLogin(req, res, next) {
        try {
            await sequelize.transaction(async (t) => {
                let payload = {};
                const ticket = await client.verifyIdToken({
                    idToken: req.body.googleToken,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                payload = ticket.getPayload();
                let data = await User.findOne({
                    where: {
                        email: payload.email
                    },
                    transaction: t
                });
                if (!data) {
                    data = await User.create(
                        {
                            first_name: payload.given_name,
                            last_name: payload.family_name,
                            email: payload.email,
                            password: process.env.GOOGLE_PASSWORD
                        },
                        { transaction: t }
                    );
                }

                const fullName = `${payload.given_name} ${payload.family_name}`;
                const accessToken = sign(data.id, data.email);
                const refreshToken = signRefreshToken(data.id, data.email);
                const csrfToken = crypto.randomUUID();
                const newToken = {
                    accessToken,
                    refreshToken,
                    csrfToken,
                    refreshTokenExpiredAt: getExpiredAt(+process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
                    UserId: data.id
                }

                await Token.create(newToken, { transaction: t });
                await Token.destroy({
                    where: {
                        refreshTokenExpiredAt: { [Op.lte]: new Date() }
                    },
                    transaction: t
                });
                res.cookie('refreshToken', refreshToken, {
                    MaxAge: +process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS,
                    httpOnly: true,
                    secure: false
                });
                res.status(200).json({
                    accessToken, csrfToken, fullName
                });
            })
        } catch (err) {
            next(err);
        }
    }
    
    // static login(req, res, next) {
    //     User.findOne({
    //         where: {
    //             email: req.body.email
    //         }
    //     })
    //         .then((data) => {
    //             if(!data) {
    //                 throw {
    //                     status: 401,
    //                     message: "Email or password is invalid."
    //                 }
    //             } else if (compare(req.body.password, data.password)) {
    //                     const accessToken = sign(data.id, data.email);
    //                     const refreshToken = signRefreshToken(data.id, data.email);
    //                     const newToken = {
    //                         accessToken,
    //                         refreshToken,
    //                         refreshTokenExpiredAt: getExpiredAt(+process.env.REFRESH_TOKEN_EXPIRY_MILLISECONDS),
    //                         UserId: data.id,
    //                       };
    //                       Token.create(newToken)
    //                       Token.destroy({
    //                         where: {
    //                             refreshTokenExpiredAt: { [Op.lte]: new Date() }
    //                         }
    //                       })
    //                     res.status(200).json({ accessToken, fullName: data.getFullName()});
    //             } else {
    //                 throw {
    //                     status: 401,
    //                     message: "Email or password is invalid."
    //                 }
    //             }
    //         })
    //         .catch((err) => {
    //             next(err);
    //         });
    // }

    // static googleLogin(req, res, next) {
    //     let payload = {};
    //     client.verifyIdToken({
    //         idToken: req.body.googleToken,
    //         audience: process.env.GOOGLE_CLIENT_ID
    //     })
    //     .then((ticket) => {
    //         payload = ticket.getPayload();
    //         return User.findOne({
    //             where: {
    //                 email: payload.email
    //             }
    //         })
    //     })
    //     .then((user) => {
    //         if(user) {
    //             return user;
    //         } else {
    //             return User.create({
    //                 first_name: payload.given_name,
    //                 last_name: payload.family_name,
    //                 email: payload.email,
    //                 password: process.env.GOOGLE_PASSWORD
    //             })
    //         }
    //     })
    //     .then((user) => {
    //         const fullName = `${payload.given_name} ${payload.family_name}`;
    //         const access_token = sign(user.id, user.email);
    //         res.status(200).json({ access_token, fullName })
    //     })
    //     .catch((err) => {
    //         next(err);
    //     })
    // }
}

module.exports = UserController;