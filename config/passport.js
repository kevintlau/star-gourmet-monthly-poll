const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const Account = require("../models/account");

// passport.use - mount Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    (accessToken, refreshToken, profile, cb) => {
      // a user has attempted a login
      // does this user exist in our database? let's check
      Account.findOne({ googleId: profile.id }, (err, account) => {
        // if doesn't exist, then create them
        // check for and handle errors
        // errors are passed to the next function (the cb)
        // this is called an escape hatch
        if (err) return cb(err);
        // if user exists in db, then log them in
        if (account) {
          return cb(null, account);
          // first argument is any errors that we encountered
          // in this case, it was a success, so error is "null"
        } else {
          // user doesn't exist, create them instead
          const newAccount = new Account({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          newAccount.save(err => {
            // if error, then pass error to escape hatch
            if (err) return cb(err);
            return cb(null, newAccount);
          });
        }
      });
    }
  )
);

// passport.serializeUser - creates a session
passport.serializeUser((account, done) => {
  done(null, account.id);
});

// passport.deserializeUser - decodes cookies, looks up user, and creates req.user
passport.deserializeUser((id, done) => {
  Account.findById(id, (err, account) => {
    done(err, account); // create req.user
  });
});
