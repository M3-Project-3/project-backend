const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Business = require("../models/Business.model");
const Reservations = require("../models/Reservation.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const fileUploader = require("../config/cloudinary.config");


//  PUT /business/id/edit  -  Update a business
router.put("/:id/edit", async (req, res, next) => {
  try{
  
  const {
    name,
    address,
    pictures,
    description
  } = req.body.formState;

  const timetable = req.body.hourRanges
  console.log(",lolololololololololol",timetable)
  const resType = req.body.resType
  const foodType = req.body.foodType
  const { id } = req.params;
  const menuStarters = req.body.menuStarters
  const menuMain = req.body.menuMain
  const menuDeserts = req.body.menuDeserts
  let isProfileComplete= false
  let priceRange = "unavailable"
  const average = (list) =>{
 
    if(list.length > 0){
      let counter = 0
      for(let el of list){
        counter += (Number(el.price))
      }
      return Math.round(counter/list.length)
    }
  }
  if(average(menuStarters) !== undefined && average(menuMain) !== undefined && average(menuDeserts) !== undefined ){
    costAverageMenu = (average(menuStarters)+average(menuMain)+average(menuDeserts))
    if(costAverageMenu<=15) priceRange = "$"
    if(costAverageMenu>15 && costAverageMenu<=30) priceRange = "$$"
    if(costAverageMenu>30 && costAverageMenu<=50) priceRange = "$$$"
    if(costAverageMenu>50) priceRange = "$$$$"
    
  }

  if(name && address && resType && foodType && menuStarters && menuMain && menuDeserts && priceRange && pictures && timetable && description) isProfileComplete = true
  const updateBusiness = await Business.findByIdAndUpdate(
    id,
    {
      name,
      address,
      resType,
      foodType,
      menuStarters,
      menuMain,
      menuDeserts,
      priceRange,
      pictures,
      isProfileComplete,
      timetable,
      description
    },
    { new: true }
  )
  res.status(200).json({
    data: updateBusiness,
    message: "Restaurant info updated successfully",
    error: null,
    pagination: null,
  });
  }
  catch(error){
    res.status(200).json({
      data: null,
      message: "Something went wrong",
      error: error,
      pagination: null,
    });
  }
});

//  GET /business/id/details -  Retrieves the details of a business
router.get("/:id/details", async (req, res, next) => {
  try{
    const { id } = req.params;
    findBusiness = await Business.findById(id)
    res.status(200).json({
      data: findBusiness,
      message: "Restaurant info loaded successfully",
      error: null,
      pagination: null,
    })
  }
  catch(error){
    res.status(200).json({
      data: null,
      message: "Something went wrong",
      error: error,
      pagination: null,
    });
  } 
});

// PUT  /:id/disable  -  Disables a specific business by id
router.put("/:id/delete", async (req, res, next) => {
  try{
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
    }
    updateBusiness = await Business.findByIdAndUpdate(id, { isProfileComplete: false })
    res.json({
      message: `Business with ${id} is removed successfully.`,
    })
  }
  catch(error){
    res.json(error)
  }
});

// Get all reservations from a business
router.get("/:id/reservations", async (req, res) => {
  try{
    const {id} = req.params;
    getAllReservations = await Reservations.find({businessId: id})
      .populate("userId")
      .populate("businessId")
      res.status(200).json({
        data: getAllReservations,
        message: "Reservations info loaded successfully",
        error: null,
        pagination: null,
      });
  }
   catch(error){
     res.status(200).json({
       data: null,
       message: "Something went wrong",
       error: error,
       pagination: null,
     });
   } 
});

router.post('/:resId/review', async (req, res)=>{
  try{
    const {resId} = req.params
    const {review, owner, date} = req.body
    const reviews = {review: review.reviewText, rating: review.rating, date: date, owner: owner}
    setReview = await Business.findByIdAndUpdate(resId, {
      $push: { reviews: reviews }
    })
    res.status(200).json({
      data: setReview,
      message: "Review added successfully",
      error: null,
      pagination: null,
    });
  }
  catch(error){
    res.status(200).json({
      data: null,
      message: "Something went wrong",
      error: error,
      pagination: null,
    });
  }
})

//Search by name query
router.get("/search", async (req, res) => {
  try {
    const {name, resType, foodType} = req.query
    const regex = new RegExp(req.query.name, "i");

    const newB = await Business.find({$or: [  { name: regex  }, { resType: { $in: regex } }, { foodType: { $in: regex } }]})

    res.status(200).json(newB);
} catch (err) {
    console.log(err);
}

});

//  GET /business/  -  Get all businesses
router.get("/", async (req, res, next) => {
  try{
    allBusiness = await Business.find()
    res.status(200).json({
      data: allBusiness,
      message: "All businesses info retrieved successfully",
      error: null,
      pagination: null,
    });
  }
  catch(error){
    res.status(200).json({
      data: null,
      message: "Something went wrong",
      error: error,
      pagination: null,
    });
  }
});

router.post("/upload", fileUploader.single("pictures"), (req, res, next) => {

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
    res.json({ secure_url: req.file.path });
});

router.post('/businesses', (req, res, next) => {
  pictures.create(req.body)
    .then(createdPictures => {
      console.log('Created new picture: ', createdPictures);
      res.status(200).json(createdPictures);
    })
    .catch(err => next(err));
});





module.exports = router;
