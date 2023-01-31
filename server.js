const express = require('express');
const dotenv = require('dotenv');

//Route files
const hospitals = require('./routes/hospitals');

//Load env vars
dotenv.config({path:'./config/config.env'});

const app = express();

// Mount router
app.use('/api/v1/hospitals',hospitals);

// app.get('/api/v1/bookings', (req,res) => {

//     res.status(200).json({ success:true , msg:''});

// });

// app.get('/api/v1/auth', (req,res) => {

//     res.status(200).json(({ success:true , data:{id:1}}));

// });

// app.get('/api/v1/users', (req,res) => {

//     res.status(200).json(({ success:true , data:{id:1}}));

// });

const PORT = process.env.PORT || 2000;

app.listen(PORT, console.log('Server is running in', process.env.NODE_ENV, ' mode on port ', PORT));