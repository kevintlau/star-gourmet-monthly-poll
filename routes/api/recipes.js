const router = require('express').Router();
const recipesApiCtrl = require("../../controllers/api/recipes.js");

// recipe api for contest show
router.get("/", recipesApiCtrl.index);
router.get("/:id", recipesApiCtrl.show);

module.exports = router;