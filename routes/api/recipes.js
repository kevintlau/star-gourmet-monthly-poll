const router = require('express').Router();
const recipesApiCtrl = require("../../controllers/api/recipes.js");

// make sure user is authenticated first before anything happens
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}

// recipe api for contest show
router.get("/", recipesApiCtrl.index);
router.get("/:id", recipesApiCtrl.show);
router.post("/:id/vote", isLoggedIn, recipesApiCtrl.vote);

module.exports = router;