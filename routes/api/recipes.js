const router = require('express').Router();
const recipesApiCtrl = require("../../controllers/api/recipes.js");

// make sure user is authenticated first before their vote can count
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}

// index returns a JSON used to build the home page
router.get("/", recipesApiCtrl.index);
router.post("/:id/vote", isLoggedIn, recipesApiCtrl.vote);

module.exports = router;