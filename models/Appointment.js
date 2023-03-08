const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({

    appDate : {
        type        : Date,
        required    : true
    },
    user : {
        type        : mongoose.Schema.ObjectId,
        ref         : 'User', // Ref to User.js
        required    : true
    },
    hospital : {
        type        : mongoose.Schema.ObjectId,
        ref         : 'Hospital', // Ref to Hospital.js
        required    : true
    },
    createdAt : {
        type        : Date,
        default     : Date.now
    }
});

module.exports = mongoose.model('Appointment',AppointmentSchema);