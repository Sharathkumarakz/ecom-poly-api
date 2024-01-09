const jwt = require('jsonwebtoken');


/**
 * DB
 */
const SuperAdmin = require('../../models/superadmin');

const login = async (req, res, next) => { //mail verification
    try {
        console.log("gottt",req.body);
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                message: "login failed due to lack credentials  "
            });
        } else {
            console.log(await SuperAdmin.findOne({ email: email }));
            const suAdmin = await SuperAdmin.findOne({ email: email })
            if (!suAdmin) {
                return res.status(401).send({
                    message: "User not Found"
                });
            }
            if (password != suAdmin.password) {
                return res.status(401).send({
                    message: "Password is incorrect"
                });
            } else {
                const jwttoken = jwt.sign({ _id: suAdmin._id }, process.env.JWT_SUPER_ADMIN_SECRETKEY);
                res.status(200).json({ jwttoken });
            }
        }
    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}

module.exports = {
    login
}