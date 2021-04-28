// reference: pagination process guided by Dennis Ivy - see README

// ------- constant variables -------------------------------------------------

// magic variables - choose how many results and page buttons to show per page
let RESULTS_PER_PAGE = 12;
let NUM_OF_PAGE_BTNS = 5;

// ------- state variables ----------------------------------------------------

// bulk results from API call
let fullResults;
// results on a current page after pagination
let pagedResults;
let currentPage = 1;
// total number of pages after pagination
let numOfPages;

// ------- cached element references ------------------------------------------

$recipesWrapperEl = $("#recipes-wrapper");
$pageBtnWrapperEl = $("#page-btn-wrapper");
$pageBtnEl = $("button.page-btn");
$voteBtnEl = $("button.vote");

// ------- event listeners ----------------------------------------------------

$pageBtnWrapperEl.on("click", ".page-btn", handleChangePage);
$voteBtnEl.on("click", handleVote);

// ------- functions ----------------------------------------------------------

// init - get the recipes list from server and render onto page
function init() {
  loadRecipes();
  paginate();
  render();
}

// get results
function loadRecipes() {
  $.get("/api/recipes").then(
    (data) => (fullResults = data),
    (err) => console.log(err)
  );
}

// store the results on the page and the number of pages in state variables
function paginate() {
  // determine which results to show on the current page
  let pageStart = (currentPage - 1) * RESULTS_PER_PAGE;
  let pageEnd = pageStart + RESULTS_PER_PAGE;
  pagedResults = fullResults.slice(pageStart, pageEnd);
  // calcalate the total number of pages
  numOfPages = Math.ceil(fullResults.length / RESULTS_PER_PAGE);
}

// generate navigation page buttons where current page is centered
function generatePageButtons() {
  $pageBtnWrapperEl.empty();
  let pageButtonWindow = calculateButtonWindow();
  let btnsHtml;
  // create a "First" button as the first button if the current page is not 1
  if (currentPage != 1) {
    btnsHtml.concat(`
      <button value="1" class="page btn btn-sm btn-info">
        &#171; First
      </button>
    `);
  };
  // fill the numerical buttons around the current page
  for (let i = pageButtonWindow[0]; i <= pageButtonWindow[1]; i++) {
    btnsHtml.concat(`
      <button value=${i} class="page-btn btn btn-sm btn-info">
        ${i}
      </button>
    `);
  };
  // create a "Last" button as the last button if the current page is not last
  if (currentPage != numOfPages) {
    btnsHtml.concat(`
      <button value="${numOfPages}" class="page btn btn-sm btn-info">
        Last &#187;
      </button>
    `);
  };
  $pageBtnWrapperEl.append(btnsHtml);
}

// determine which page numbers to show
function calculateButtonWindow() {
  let maxLeft = currentPage - Math.floor(NUM_OF_PAGE_BTNS / 2);
  let maxRight = currentPage + Math.floor(NUM_OF_PAGE_BTNS / 2);
  // don't show negative numbers in page buttons
  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = NUM_OF_PAGE_BTNS;
  }
  // don't go over total number of pages
  if (maxRight > numOfPages) {
    maxRight = numOfPages;
    maxLeft = numOfPages - NUM_OF_PAGE_BTNS + 1;
    // special case: if window is too big, then hardcode 1 as maxLeft
    if (maxLeft < 1) maxLeft = 1;
  }
  return [maxLeft, maxRight];
}

function render() {
    let resultsHtml = pagedResults.map((result) => {
        return `<article class="recipe">
        <h3>${recipe.name}</h3>
        </article>`;
    });
    $recipesWrapperEl.append(resultsHtml);
    generatePageButtons();
}

function handleChangePage() {
  $recipesWrapperEl.empty();
  currentPage = Number($(this).val());
  render();
}

//
function handleVote() {
  $.post("/api/recipes/:id/vote");
}
