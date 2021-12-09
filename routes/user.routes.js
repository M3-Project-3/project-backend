const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../models/User.model")
const Business = require("../models/Business.model")
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
    .delete((req, res)=>{
        const { userId } = req.params
        const {favouritesId } = req.body
        User
        .findByIdAndUpdate(userId, { $pull: {favourites: favouritesId}}, {new: true} )
        .populate("favourites")
        .then(user => res
          .status(200)
          .json(
            {
              data: user,
              error: null,
              message: "Favourite deleted from user"
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
    .put((req,res)=>{
        const { userId } = req.params
        const {favouritesId } = req.body
        
        User
          .findByIdAndUpdate(userId, { $addToSet: {favourites: favouritesId} }, {new: true} )
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
router.get('/:id/reservations', (req, res)=>{
  const {id} = req.params
  console.log(id)

  Reservations.find({user: id}).populate("user")
  .then((userReservations)=>{res
    .status(200)
    .json(
      {
        data: userReservations,
        message: "Reservations info loaded successfully",
        error: null,
        pagination: null
      }
    )
  })
  .catch((error)=>{res
    .status(200)
    .json(
      {
        data: null,
        message: "Something went wrong",
        error: error,
        pagination: null
      }
    )
  });
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