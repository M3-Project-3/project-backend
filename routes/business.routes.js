const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Business = require("../models/Business.model");

//  POST /business/id/create  -  Creates a new business
router.post("/:id/create", (req, res, next) => {
  const { name, address, resType, foodType, menuStarters, menuMain, menuDeserts, priceRange, timetable, tables, pictures  } = req.body;
  const {id} = req.params
  Business.findByIdAndUpdate(id, { name, address, resType, foodType, menuStarters, menuMain, menuDeserts, priceRange, timetable, tables, pictures ,isProfileComplete: true }, {new:true})
    .then((restaurant)=>{res
      .status(200)
      .json(
        {
          data: restaurant,
          message: "Restaurant info updated successfully",
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
});

//  GET /business/id/details -  Retrieves the details of a business
router.get("/:id/details", (req, res, next) => {
  const {id} = req.params
  
  Business.findById(id)
    .then((restaurantDetails)=>{res
      .status(200)
      .json(
        {
          data: restaurantDetails,
          message: "Restaurant info loaded successfully",
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
});


// PUT  /:id/disable  -  Disables a specific business by id
router.put("/:id/delete", (req, res, next) => {
  const { id } = req.params;
  console.log("------------",id)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Business.findByIdAndUpdate(id, {isProfileComplete: false})
    .then((response) =>
      res.json({
        message: `Business with ${id} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
