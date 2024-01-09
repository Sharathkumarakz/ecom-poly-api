/*** exports */
const express = require('express')
const cors =require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const fileUpload=require('express-fileupload');

/*** environment */
require('dotenv').config();

/*** app start */
const app = express();
app.use(cookieParser());
app.use(express.json());

/*** cross origin resource sharing */
app.use(cors({
    credentials: true,
    origin:[`${process.env.BASE_URL}`]
  }));

/*** DB-connection */
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB-Connected')
    app.listen(5000, () => {
        console.log("app listening @5000");
    })
}).catch((error) => {
    console.log('somthing wrong', error)
})

app.use(fileUpload({
    useTempFiles:true
}))

/** Routes */
const userRoute = require('./router/user');
app.use('/', userRoute)

const adminRoute = require('./router/admin');
app.use('/admin', adminRoute)

const suAdminRoute = require('./router/suadmin');
app.use('/suAdmin', suAdminRoute)