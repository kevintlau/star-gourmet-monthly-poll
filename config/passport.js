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
      // check if user exists
      Account.findOne({ googleId: profile.id }, (err, account) => {
        if (err) return cb(err);
        // if user exists in db, then log them in
        if (account) {
          // if user found, then send the account with no error (null)
          return cb(null, account);
        } else {
          // if user not found, create new account instead
          const newAccount = new Account({
            // scope: get name, email address, and Google ID
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
