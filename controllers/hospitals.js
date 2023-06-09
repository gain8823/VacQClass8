const Hospital = require('../models/Hospital');

// const vacCenter = require('../models/VacCenter');

exports.getHospitals = async (req,res,next)=>{

    console.log('getHospitals is called');
    // res.status(200).json({ success:true , msg:'Show all hospitals'});


        // const hospitals = await Hospital.find();

        // Be able to add paramter in API
        // const hospitals = await Hospital.find(req.query); 
        // console.log(req.query);

        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields =  ['select', 'sort', 'page', 'limit'];

        // Loop over remove fields and delete them from reqQuery
        removeFields.forEach( param=>delete reqQuery[param] );
        // console.log(reqQuery)

        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        queryStr     = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

        query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

        // Select fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page,10)||1;
        const limit = parseInt(req.query.limit,10)||25;
        const startIndex = ( page - 1 ) * limit;
        const endIndex = page * limit;

    try{

        const total = await Hospital.countDocuments();
        query = query.skip(startIndex).limit(limit);

        // Execute query
        const hospitals = await query;

        // Pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page : page + 1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page : page - 1,
                limit
            }
        }

        res.status(200).json({ 
            success     : true ,
            count       : hospitals.length, 
            data        : hospitals
        });

    } catch(err){
        res.status(400).json({
           success : false,
           location : 'controller / getHospitals' 
        });
    }
};

exports.getHospital = async (req,res,next)=>{

    console.log('getHospital is called');
    // res.status(200).json({success:true ,msg:`Show hospitals: ${req.params.id}`});

    try{

        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(400).json({
                success : false,
                location : '01'
            });
        }

        res.status(200).json({
            success : true,
            data    : hospital
        });

    } catch(err){
        res.status(400).json({
            success : false,
            location : '02'
        });
    }
};

exports.createHospital = async (req,res,next)=>{

    console.log('createHospital is called');

    const hospital = await Hospital.create(req.body);

    res.status(201).json({ 
        success :   true , 
        data    :   hospital });
};

exports.updateHospital = async (req,res,next)=>{

    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new             : true,
            runValidators   : true
        });

        if(!hospital){
            return res.status(400).json({
                success : false,
                location : '03'
            });
        }

        res.status(200).json({
            success : true,
            data    : hospital
        });

    } catch(err){
        res.status(400).json({
            success : false,
            location : 'controller / getHospital' 
        });
    }
    // res.status(200).json({ success:true , msg:`Update hospitals: ${req.params.id}`});
};

exports.deleteHospital = async (req,res,next)=>{
    try{
        // const hospital = await Hospital.findByIdAndDelete(req.params.id);
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(400).json({
                success : false,
                location : '04'
            });
        }

        hospital.remove();

        res.status(200).json({
            success : true,
            data    : {}
        });

    } catch(err){
        res.status(400).json({
            success : false,
            location : 'controller / deleteHospital' 
        });
    }
    // res.status(200).json({ success:true , msg:`Delete hospitals: ${req.params.id}`});
}; 

// exports.getVacCenters = (req,res,next)=>{

//     console.log('getVacCenters is called.')

//     vacCenter.getAll((err, data)=>{

//         if(err){
//             res.status(500).send({
//                 success     : 'error',
//                 message     : err.message || "Some error occured while retrieving Vaccine Centers.",
//                 location    : 'controller / getvaccenters'
//             });
//         }else{
//             res.send(data);
//         }

//     });
// };