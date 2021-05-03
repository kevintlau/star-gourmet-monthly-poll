const Recipe = require("../models/recipe");
const Account = require("../models/account");
const Contest = require("../models/contest");

const index = (req, res) => {
  let now = new Date();
  let nowISO = now.toISOString();
  Contest.findOne(
    // search criteria: contest starts before now and ends after now
    {
      startDate: { $lt: nowISO },
      endDate: { $gte: nowISO },
    },
    // callback: render the new page with the theme populated
    (err, currContest) => {
      res.render("index", {
        title: "Welcome",
        contest: currContest,
        header: `Current Contest: ${currContest.name}`,
        user: req.user,
      });
    }
  );
};

module.exports = { index };
