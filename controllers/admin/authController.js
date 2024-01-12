//bcrypt
const bcrypt = require('bcrypt');
const crypto = require('crypto')
//mail
const sendEmail = require('../../middleware/nodemailer')
//json web token
const jwt = require('jsonwebtoken');

/**
 * Cloudinary
 */
const { uploadToCloudinary, removeFromCloudinary } = require('../../middleware/cloudinary');


/**
 * DB
 */
const Admin = require('../../models/admin');


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(401).send({
                message: "login failed due to lack credentials  "
            });
        } else {
            const admin = await Admin.findOne({ email: email })
            if (!admin) {
                return res.status(401).send({
                    message: "User not Found"
                });
            }
            if (!admin.verified) {
                return res.status(401).send({
                    message: "You are not verified by the super-Admin"
                });
            }

            if(admin.isBlocked){
                return res.status(401).send({
                    message: "You are blocked by the super-Admin"
                });
            }

             else {
                const passwordMatch = await bcrypt.compare(password, admin.password);
                if (!passwordMatch) {
                    return res.status(401).send({
                        message: "Password is incorrect"
                    });
                } else {
                    const jwttoken = jwt.sign({ _id: admin._id }, process.env.JWT_ADMIN_SECRETKEY);
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


const register = async (req, res, next) => {
    try {
        const {username,email,password,phoneNo,place,state} = JSON.parse(req.body.textFieldName);
        const photo = req.files.photo;
        const document = req.files.document; 

        const image = await uploadToCloudinary(photo.tempFilePath, "admin-registration-photo");
        const doc = await uploadToCloudinary(document.tempFilePath, "admin-registration-document");
     
        const request = await Admin.findOne({ email:email })
        console.log('hh');
        if(request){
        return res.status(401).send({ message: "Request with this emailId already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let adminRegister = new Admin({
            name: username,
            image: image.url,
            email: email,
            phone: phoneNo,
            document: doc.url,
            state: state,
            place: place,
            password: hashedPassword,
            photoPublicId: image.public_id,
            docPublicId: doc.public_id,
            verified: false
        });
        console.log('dshh');

        await adminRegister.save()
        return res.status(201).send({ message: "You will receive an email after Admin accept your request" })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "admin registration failed"
        });
    }
}

module.exports = {
    login,
    register
}