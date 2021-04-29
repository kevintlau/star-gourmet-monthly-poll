const router = require('express').Router();
const recipesCtrl = require("../controllers/recipes");

// make sure user is authenticated first before anything happens
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/google");
}

// user-centric CRUD - don't need to reference the user in routes
router.get("/recipes", isLoggedIn, recipesCtrl.index);
router.get("/recipes/new", isLoggedIn, recipesCtrl.new);
// show recipes page needs to be after "new" because of the URI template
router.get("/recipes/:id", isLoggedIn, recipesCtrl.show);
router.post("/recipes", isLoggedIn, recipesCtrl.create);
router.put("/recipes/:id", isLoggedIn, recipesCtrl.update);
router.delete("/recipes/:id", isLoggedIn, recipesCtrl.delete);

module.exports = router;