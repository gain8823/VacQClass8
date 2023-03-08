const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name : {
        type        : String,
        required    : [true,'Please add a name'],
        unique      : true,
        trim        : true,
        maxlength   : [50,'Name cannot be more than 50 characters']
    },
    address : {
        type        : String,
        required    : [true,'Please add a address'],
    },
    district : {
        type        : String,
        required    : [true,'Please add a district'],        
    },
    province : {
        type        : String,
        required    : [true,'Please add a province'],        
    },
    postalcode : {
        type        : String,
        required    : [true,'Please add a postalcode'],
        maxlength   : [5,'Postal Code cannot be more than 5 digits']
    },
    tel : {
        type        : String,
    },
    region : {
        type        : String,
        required    : [true,'Please add a region'],
    }
}, {
    toJSON : {
        virtuals    : true
    },
    toObject : {
        virtuals    : true
    }
});

// When delete hospital in system, the appointment of hospital 
// should be deleted too [Cascade delete]

HospitalSchema.pre('remove', async function(next){
    console.log(`Appointments being removed from hospital ${this._id}`);
    await this.model('Appointment').deleteMany({
        hospital : this._id
    });
    next();
});

// Reverse populate with virtuals
HospitalSchema.virtual('appointments',{
    ref             : 'Appointment', // Ref to Appointment.js
    localField      : '_id',
    foreignField    : 'hospital',
    justOne         : false
});

module.exports = mongoose.model('Hospital',HospitalSchema);