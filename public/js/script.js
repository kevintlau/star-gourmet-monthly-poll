console.log("JS file loaded");

// ------- constant variables -------------------------------------------------

const Recipe = require("../../models/recipe");


// ------- state variables ----------------------------------------------------



// ------- cached element references ------------------------------------------
$testEl = $("#test-button");

// ------- event listeners ----------------------------------------------------
$testEl.on("click", () => {
    console.log("clicked!");
    Recipe.find({}, (err, recipes) => {
        console.log(recipes);
    });
});



// ------- functions ----------------------------------------------------------


