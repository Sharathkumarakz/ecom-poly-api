//bcrypt
const bcrypt = require('bcrypt');
const crypto = require('crypto')
//mail
const sendEmail = require('../../middleware/nodemailer')
//json web token
const jwt = require('jsonwebtoken');

/**
 * Database
 */
const User = require('../../models/user');

const register = async (req, res, next) => {
    try {
        const { username, password, email, phoneNo } = req.body
        if (!username || !email || !password || !phoneNo) {
            return res.status(400).send({
                message: "Missing Credentials "
            });
        } else {
            const userAlreadyExist = await User.findOne({ email: req.body.email });
            if (userAlreadyExist && userAlreadyExist.verified == true) {
                return res.status(401).send({
                    message: "Email already exist "
                });
            }
            const digits = '0123456789';
            let otp = '';
            for (let i = 0; i <= 6; i++) {
                const randomIndex = crypto.randomInt(digits.length);
                otp += digits.charAt(randomIndex);
            }
            if(otp.length !== 6){
                otp = '827782'
            }
            if (userAlreadyExist && userAlreadyExist.verified == false) {
                await User.updateOne({ email: req.body.email }, { $set: { otp: otp } })
                sendEmail(email, "Verify Email", otp)
                return res.status(201).send({ message: "An OTP has been send to your email please verify" })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                let user = new User({
                    username: username,
                    password: hashedPassword,
                    email: email,
                    phone: phoneNo,
                    otp: otp,
                    verified: false
                })
                const userSaved = await user.save();
                sendEmail(email, "Verify Email", otp)
                return res.status(201).send({ message: "An OTP has been send to your email please verify" })
            }
        }
    } catch (err) {
        return res.status(400).send({
            message: "Registration failed"
        });
    }
}

const resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).send({
                message: "Missing Credentials "
            });
        } else {
            const userAlreadyExist = await User.findOne({ email: req.body.email });
            if (userAlreadyExist && userAlreadyExist.verified == true) {
                return res.status(401).send({
                    message: "Email already registered"
                });
            }
            const digits = '0123456789';
            let otp = '';

            for (let i = 0; i < 6; i++) {
                const randomIndex = crypto.randomInt(digits.length);
                otp += digits.charAt(randomIndex);
            }
            
            if(otp.length !== 6){
                otp = '827782'
            }
            await User.updateOne({ email: req.body.email }, { $set: { otp: otp } })
            sendEmail(email, "Verify Email", otp)
            return res.status(201).send({ message: "An OTP has been send to your email please verify" })
        }
    } catch (err) {
        return res.status(400).send({
            message: "Registration failed"
        });
    }
}

const verifyOtp = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                message: "verify mail failed due to lack of credentials"
            });
        } else {
            const user = await User.findOne({ email: email })
            if (!user) return res.status(400).send({ message: 'No user found' })

            if (user && user.isBlocked === true) {
                return res.status(400).send({ message: 'You are blocked from using our services' })
            }

            if (parseInt(user.otp) !== parseInt(otp)) {
                return res.status(401).send({
                    message: "OTP verification failed"
                });
            }
            await User.updateOne({ email: email }, { $set: { verified: true , otp : ''} })

            const jwttoken = jwt.sign({ email: email }, process.env.JWT_USER_SECRETKEY);
            res.status(200).json({ jwttoken });
        }
    } catch (error) {
        return res.status(400).send({
            message: "OTP verification failed"
        });
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                message: "login failed due to lack credentials  "
            });
        } else {
            const user = await User.findOne({ email: email })
            if (!user) {
                return res.status(401).send({
                    message: "User not Found"
                });
            }
            if (!user.verified) {
                const digits = '0123456789';
                let otp = '';
    
                for (let i = 0; i < 6; i++) {
                    const randomIndex = crypto.randomInt(digits.length);
                    otp += digits.charAt(randomIndex);
                }

                if(otp.length !== 6){
                    otp = '827782'
                }

                await User.updateOne({ email: req.body.email }, { $set: { otp: otp } })
                sendEmail(email, "Verify Email", otp)
                return res.status(201).send({ message: "An OTP has been send to your email please verify",verify:true })
            } else {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).send({
                        message: "Password is incorrect"
                    });
                } else {
                    const jwttoken = jwt.sign({ _id: user._id }, process.env.JWT_USER_SECRETKEY);
                    res.status(200).json({ jwttoken });
                }
            }
        }

    } catch (error) {
        return res.status(400).send({
            message: "mail verification failed"
        });
    }
}

module.exports = {
    register,
    resendOtp,
    verifyOtp,
    login
}