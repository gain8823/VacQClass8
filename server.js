const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
//Route files
const hospitals     = require('./routes/hospitals');
const auth          = require('./routes/auth');
const appointments  = require('./routes/appointments');
const vaccenters    = require('./routes/vaccenters');

const cookieParser = require('cookie-parser');

//Load env vars
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

app.use(cookieParser());

app.use(express.json());

// Mount router
app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);
app.use('/api/v1/vaccenters',vaccenters);

const PORT = process.env.PORT || 2000;

const server = app.listen(PORT, console.log('Server is running in', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{

    console.log(`Error: ${err.message}`);

    server.close(()=>process.exit(1));  

});