const express = require('express') ;
const router = express.Router();
const Product= require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer') ;
// Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
/*
const fileFilter = (req, file, cb) => {
if (file.mimetype === 'image/jpeg'|| file.mimetype=== 'image/png '){
    cb(null, true);  // Returning true means the file is accepted and passed in to the next middleware function
}
else{
    return cb(new Error("Not an image"), false);
    }
}
*/

const storage= multer.diskStorage({
    destination: function (req , file , cb ){
        cb(null , '../assets/images' );
    },
    filename: function ( req, file , cb){
        cb(null, file.originalname);
    }
}); 


const upload = multer({ 
    storage: storage,
    // fileFilter : fileFilter
});
const product = require('../models/product');


router.get('/' , (req,res,next)=> {
  product.find()
  .select('title author category _id productImage') // feetchs only the specified things , best way to control the info returned 
  .exec()
  .then(docs =>{  // we strructered the response in the way we wanted, here we put the "form" of how we wanted our response to look like.
    const response ={
        count: docs.length ,
        product: docs.map(doc => {
            return{
                title: doc.title ,
                category: doc.category,
                author: doc.author,
                _id: doc._id,
                productImage: doc.productImage,
            }
        })
    }
    res.status(200).json(response);
    console.log(req.file);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    })
  })
}); 

router.get('/:productID' , (req,res,next)=> {
    const id = req.params.productID ;
    product.findById(id)
    .select('title author category _id productImage')
    .exec()
    .then(doc =>{
        console.log(doc) ; // making a res inside the then or catch block as res runs asyncronsly, this way we ensure that the process is terminated before res runs.
        if(doc){
            res.status(200).json(doc)
        }
        else {
            res.status(404).json({
                message: "File Not Found 404"
            })
        }
    })
    .catch(err=> {
        console.log(err);
        res(500).json({error: err}); //19:00 in the vid 
    });
}); 

router.post('/' ,upload.single('productImage'), (req,res,next)=> {
const product = new Product ({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title ,
        author: req.body.author,
        category: req.body.category ,
        productImage: req.file.path
});

    product.save()
    .then(result=>{       // method by mongoose to store it in the database 
            console.log(result);  // we put the success respone inside the success callback function 
            res.status(200).json({
                message: 'Created the product successfully' ,
                createdProduct: result // we can also show the result mannually doing the same proccedure as the GET  method
            })
        })
        .catch(err => {
            console.log(err) ;
            res.status(500).json({
                error: err
            })
        })
}); 

router.delete("/:productID",(req,res,next)=>
{                                               //we requested the productID throught the parameters, then we used the product model
    const id = req.params.productID;           //to delete the specified product throught the id property that we put
    product.deleteOne({                       //then we use exec() to execute queries for the MongoDb models 
        _id: id
    })
    .exec()
    .then(result =>{ // we can format all the route and modifyt the response to equals our taste
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });

});
router.patch("/:productID", upload.single('productImage'), (req, res, next) => {
    const id = req.params.productID;
    const updateOPS = {};
    const bdy=req.body
    console.log(bdy)
    // Check if req.body is an array
    if (!Array.isArray(req.body)) {
        return res.status(400).json({
            message: 'Invalid request body format. Expecting an array.'
        });
    }

    for (const ops of req.body) {

        updateOPS[ops.propName] = ops.value;
    }
    
    product.updateOne({ _id: id }, { $set: updateOPS })
        .exec()
        .then(result => {
            res.status(202).json({
                message: 'product updated',
                request: {
                    type: 'GET',
                    url: 'localhost:3000/product/' + id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'couldnt update the item'
            })
        })
})

module.exports=router ;