const Contest = require("../models/contest");

const index = (req, res) => {
  // find the current contest based on current date/time
  let now = new Date();
  let nowISO = now.toISOString();
  Contest.findOne(
    // search criteria: contest starts before now and ends after now
    {
      // startDate: { $lt: nowISO },
      // endDate: { $gte: nowISO },
    },
    // render the home page with the current contest populated
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
