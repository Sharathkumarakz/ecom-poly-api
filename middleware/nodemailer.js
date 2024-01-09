const nodemailer=require('nodemailer')
//SENDING EMAILS
module.exports = async (email, subject, text) => {
    try {
        const transport = nodemailer.createTransport({
            host: `sandbox.smtp.mailtrap.io`,
            service: `Gmail`,
            port: `587`,
            secure: true,
            auth: {
                user: `sk8277sk@gmail.com`,
                pass: `jzfaufaexijueoov`
            },
            mail: {
                // This property is new.
                smtp: {
                    ssl: {
                        version: "TLSv1.2"
                    }
                }
            }
        })
        await transport.sendMail({
            from: process.env.USER,
            to: email,
            subject: "V-Weddings verification link",
            text:text
        })
        console.log('email send successfully')
    } catch (error) {
        console.log('email not send');
        console.log(error);
    }
}