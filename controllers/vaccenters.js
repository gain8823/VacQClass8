const vacCenter = require('../models/VacCenter');

exports.getVacCenters = (req,res,next)=>{

    vacCenter.getAll((err, data)=>{

        if(err){
            res.status(500).send({
                success     : 'error',
                message     : err.message || "Some error occured while retrieving Vaccine Centers.",
                location    : 'controller / getvaccenters'
            });
        }else{
            res.send(data);
        }

    });
};