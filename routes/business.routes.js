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

//  GET /business/id/details -  Retrieves all of the projects
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

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Business.findById(projectId)
    .populate("tasks")
    .then((project) => res.status(200).json(project))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndUpdate(projectId, req.body, { new: true })
    .then((updatedProject) => res.json(updatedProject))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(projectId)
    .then(() =>
      res.json({
        message: `Project with ${projectId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
