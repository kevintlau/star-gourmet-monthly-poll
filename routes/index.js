const router = require('express').Router();
const passport = require("passport");

router.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
  });
});

// login route
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

// callback route - requested after user logs in
router.get("/oauth2callback", passport.authenticate("google", {
  successRedirect: "/recipes",
  failureRedirect: "/"
}));

// logout route
router.get("/logout", (req, res) => {
  req.logOut(); // destroy login session from session storage
  res.redirect("/"); // send user back to homepage
});

module.exports = router;