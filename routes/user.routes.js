const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model")

const Reservations = require('../models/Reservation.model')



//GET USER FAVOURITES
router.route("/:userId/favourites")
    .get( async (req,res)=>{
      try{
        const {userId} = req.params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: "Specified id is not valid" });
            return;
        }
        const user = await User.findById(userId)
        .populate("favourites")
        res.json(user.favourites)

      }
      catch(error){
        res.json(err)
      }
    })
  
router.route("/:userId/favourites/:resId")
    .put( async (req,res)=>{
      try{
        const { userId } = req.params
        const {resId } = req.params
        const userUpdatedFavourites = await User
        .findByIdAndUpdate(userId, { $addToSet: {favourites: resId} }, {new: true} )
        .populate("favourites")
        res
        .status(200)
        .json(
          {
            data: userUpdatedFavourites,
            error: null,
            message: "Favourite added to user"
          })
      }
      catch(error){
        res
          .status(500)
          .json({
            data: null,
            message : "Something went wrong",
            error: error
        })
      }
    })
    .delete( async (req, res)=>{
      try{
        const { userId } = req.params
        const {resId } = req.params
        const user = await User
        .findByIdAndUpdate(userId, { $pull: {favourites: resId}}, {new: true} )
        .populate("favourites")
        res
          .status(200)
          .json({
            data: user.favourites,
            error: null,
            message: "Favourite deleted from user"
          })
        }
      catch(error){
        res
          .status(500)
          .json({
            data: null,
            message : "Something went wrong",
            error: error
        })
      }
  })

//UPDATE USER 
router.put("/:userId/edit", async (req,res)=>{
  try{
    const {userId}= req.params
    const {name, surname} = req.body
    //Checks if received param is an valid ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {name, surname}, {new:true})
    res.json(updatedUser)


  }
  catch(error){
    res.json(error)
  }
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

router.get("/:userId", async (req,res)=>{
  try{
    const {userId} = req.params

    //Checks if received param is an valid ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }
    const user = await User
      .findById(userId)
      .populate("favourites")
    res.json(user)

  }
  catch(error){
    res.json(error)
  }
})


module.exports = router;