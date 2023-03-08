const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

exports.getAppointments = async (req,res,next)=>{

    let query;

    if(req.user.role !== 'admin'){

        // Not admin -> Query only user appointment
        query = Appointment.find({
            user    : req.user.id
        }).populate({
            path    : 'hospital',
            select  : 'name province tel'
        });

    }else{

        // Admin -> Query all appointment
        query = Appointment.find().populate({
            path    : 'hospital',
            select  : 'name province tel'
        });
        
    }

    try{

        const appointments = await query;

        res.status(200).json({ 
            success     : true,
            count       : appointments.length, 
            data        : appointments
        });

    }catch(error){

        console.log(error);

        return res.status(500).json({
            success : false,
            message : 'Cannot find appointment'
        });

    }

};

exports.getAppointment = async (req,res,next)=>{
    try{

        const appointment = await Appointment.findById(req.params.id).populate({
            path : 'hospital',
            select : 'name address tel'
        });

        if(!appointment){
            return res.status(404).json({
                success     : false,
                message     : `No appointment with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success : true,
            data    : appointment
        });

    }catch(error){

        console.log(error);
        return res.status(500).json({
            success : false,
            message : 'Cannot find appointment'
        });

    }
};

exports.addAppointment = async (req,res,next)=>{

    try{

        // The logged in user will be recorded in req.body.user
        req.body.user = req.user.id; 

        const existedAppointments = await Appointment.find({
            user : req.user.id
        });

        if(existedAppointments.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({
                success : false,
                message : `The user with ID ${req.user.id} has already made 3 appointments.`
            });
        }

        req.body.hospital = req.params.hospitalId;

        const hospital = await Hospital.diffIndexes(req.params.hospitalId);

        if(!hospital){
            return res.status(404).json({
                success : false,
                message : `No hospital with the id of ${req.params.hospitalId}`
            });
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({
            success     : true,
            data        : appointment
        });


    }catch(error){

        console.log(error);
        return res.status(500).json({
            success : false,
            message : `Cannot create appointment`
        });

    }

};

exports.updateAppointment = async (req,res,next)=>{

    try{

        let appointment = await Appointment.findById(req.params.id);

        if(!appointment){

            return res.status(404).json({
                success : false,
                message : `No appointment with the id of ${req.params.id}`
            });
        }

        if(appointment.user.toString() !== req.user.id && 
           req.user.role               !== 'admin'){
            // Validate that the owner of appointment and login user 
            // must be the same
            // and login user must not admin
            return res.status(401).json({
                success : false,
                message : `User ${req.user.id} is not authorized to update this appointment`
            });
           }

        appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new : true,
                runValidators : true
            }
        );

        res.status(200).json({
            success     : true,
            data        : appointment
        });

    }catch(error){

        console.log(error);
        return res.status(500).json({
            success : false,
            message : `Cannot update appointment`
        });

    }

};

exports.deleteAppointment = async (req,res,next) =>{

    try{

        let appointment = await Appointment.findById(req.params.id);

        if(!appointment){

            return res.status(404).json({
                success : false,
                message : `No appointment with the id of ${req.params.id}`
            });
        }

        if(appointment.user.toString() !== req.user.id && 
           req.user.role               !== 'admin'){
         // Validate that the owner of appointment and login user 
         // must be the same
         // and login user must not admin
         return res.status(401).json({
             success : false,
             message : `User ${req.user.id} is not authorized to delete this appointment.`
         });
        }

        await appointment.remove();

        res.status(200).json({
            success     : true,
            data        : {}
        }); 

    }catch(error){

        console.log(error);
        return res.status(500).json({
            success : false,
            message : `Cannot delete appointment`
        });

    }

};