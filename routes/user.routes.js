const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model")

const Reservations = require('../models/Reservation.model')



//GET USER FAVOURITES
router.route("/:userId/favourites")
    .get((req,res)=>{
        const {userId} = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Specified id is not valid" });
            return;
        }

    User.findById(userId)
        .populate("favourites")
        .then((user) => res.json(user.favourites))
        .catch((err) => res.json(err));


    })
  
router.route("/:userId/favourites/:resId")
    .put((req,res)=>{
            const { userId } = req.params
            const {resId } = req.params
            console.log(resId)
            
            User
              .findByIdAndUpdate(userId, { $addToSet: {favourites: resId} }, {new: true} )
              .populate("favourites")
              .then(userUpdatedFavourites => res
                .status(200)
                .json(
                  {
                    data: userUpdatedFavourites,
                    error: null,
                    message: "Favourite added to user"
                  })
                )
              .catch(error=> res
                .status(500)
                .json({
                  data: null,
                  message : "Something went wrong",
                  error: error
              }))
    })
  .delete((req, res)=>{
    const { userId } = req.params
    const {resId } = req.params
    User
    .findByIdAndUpdate(userId, { $pull: {favourites: resId}}, {new: true} )
    .populate("favourites")
    .then(user =>{
      console.log(user.favourites)
      res
      
      .status(200)
      .json(
        {
          data: user.favourites,
          error: null,
          message: "Favourite deleted from user"
        })
    })
    .catch(error=> res
      .status(500)
      .json({
        data: null,
        message : "Something went wrong",
        error: error
      }))

  })

//UPDATE USER 
router.put("/:userId/edit", (req,res)=>{
    const {userId}= req.params
    const {name, surname} = req.body

    //Checks if received param is an valid ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    User.findByIdAndUpdate(userId, {name, surname}, {new:true})
    .then((updatedUser)=> {
        res.json(updatedUser)
        
    })
    .catch((error)=>res.json(error))
})

// Get all reservations from a user
router.get('/:id/reservations', async (req, res)=>{
  try{

    const {id} = req.params
    const reservations = await Reservations.find({userId: id}).populate("userId").populate('businessId')
    res
    .status(200)
    .json(
      {
        data: reservations,
        message: "Reservations info loaded successfully",
        error: null,
        pagination: null
      }
      )
    }
  catch(error){
    res
    .status(500)
    .json(
      {
        data: null,
        message: "Something went wrong",
        error: error,
        pagination: null
      })
    }
})

//GET USER BY ID

router.get("/:userId", (req,res)=>{
    const {userId} = req.params

    //Checks if received param is an valid ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
   User
    .findById(userId)
    .populate("favourites")
    .then((user) => {
        res.json(user)})
    .catch((error) => res.json(error));

})


module.exports = router;