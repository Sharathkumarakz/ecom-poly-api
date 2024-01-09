const jwt = require('jsonwebtoken');

/** user DB */
const User=require('../models/user');


module.exports = {

    /** user authentication */
     userAuthentication(req, res, next) {
        const cookie = req.headers.authorization
        if (!cookie) {      
            return res.status(401).send({
                message: "UnAuthenticated"
            })
        }
        jwt.verify(cookie, process.env.JWT_USER_SECRETKEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
            if (decode){
                req.headers.userId = decode._id
        User.findOne({ _id: decode._id })
        .then(userdata => {
            if (userdata.isBlocked === true) {
                return res.status(403).send({
                    message: "Access Denied - User is not allowed"
                });
            } else {
                next(); // Proceed to the next middleware
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Internal Server Error"
            });
        });
            } else {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
        });
    },

    /** admin authentication */
    adminAuthentication(req, res, next) {
        const cookie = req.headers.authorization
        if (!cookie) {      
            return res.status(401).send({
                message: "UnAuthenticated"
            })
        }
        jwt.verify(cookie, process.env.JWT_ADMIN_SECRETKEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
            if (decode) {
                req.headers.adminId = decode._id
                next()
            } else {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
        });
    },

   /** super admin authentication */
    superAdminAuthentication(req, res, next) {
        const cookie = req.headers.authorization
        if (!cookie) {      
            return res.status(401).send({
                message: "UnAuthenticated"
            })
        }
        jwt.verify(cookie, process.env.JWT_SUPER_ADMIN_SECRETKEY, (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
            if (decode) {
                req.headers.superAdminId = decode._id
                next()
            } else {
                return res.status(401).send({
                    message: "UnAuthenticated"
                })
            }
        });
    } 
}