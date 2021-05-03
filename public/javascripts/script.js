// reference: pagination process guided by Dennis Ivy - see README

// ------- constant variables -------------------------------------------------

// magic variables - choose how many results and page buttons to show per page
let RESULTS_PER_PAGE = 6;
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

// ------- event listeners ----------------------------------------------------

$pageBtnWrapperEl.on("click", ".page-link", handleChangePage);
$recipesWrapperEl.on("click", ".vote-btn", handleVote);

// ------- functions ----------------------------------------------------------

init();

// init - get the recipes list from server and render onto page
function init() {
  $.get("/api/recipes").then(
    (data) => {
      fullResults = data;
      render();
    },
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
  let btnsHtml = "";
  // create a "First" button that is disabled if we are page 1
  btnsHtml += `
    <li class="page-item ${(currentPage == 1) ? "disabled" : ""}">
      <button value=${1} class="page-link">
        &#171; First
      </button>
    </li>
  `;
  // fill the numerical buttons around the current page
  for (let i = pageButtonWindow[0]; i <= pageButtonWindow[1]; i++) {
    btnsHtml += `
      <li class="page-item ${(currentPage == i) ? "active" : ""}">
        <button value=${i} class="page-link">
          ${i}
        </button>
      </li>
    `;
  }
  // create a "Last" button that is disabled if we are on the last page
  btnsHtml += `
    <li class="page-item ${(currentPage == numOfPages) ? "disabled" : ""}">
      <button value=${numOfPages} class="page-link">
        Last &#187;
      </button>
    </li>  
  `;
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

function generateCard(recipeObj) {
  return `
    <div class="col-md-4">
      <div class="card mb-4">
        <div class="card-header">
          <h5 class="mb-0">${recipeObj.name}</h5>
        </div>
        <div 
          class="recipe-img"
          style="background-image: url('${recipeObj.image}')"
        ></div>
        <div class="card-body container">
          <p class="card-text">Submitter: ${recipeObj.submitter}</p>
          <div class="row justify-content-evenly text-center">
            <div class="col">
              <button 
                class="btn btn-custom-main details-btn mb-1 mb-md-0"
                data-id="${recipeObj._id}"
              >
                Details
              </button>
            </div>
            <div class="col">
              <button 
                class="btn btn-custom-secondary vote-btn"
                data-id="${recipeObj._id}"
              >
                Vote: ${recipeObj.score}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function render() {
  paginate();
  $recipesWrapperEl.empty();
  let resultsHtml = pagedResults.map((recipe) => {
    return generateCard(recipe);
  });
  $recipesWrapperEl.append(resultsHtml);
  generatePageButtons();
}

function handleChangePage() {
  currentPage = Number($(this).val());
  render();
}

//
function handleVote() {
  let recipeId = this.dataset.id;
  $.post(`/api/recipes/${recipeId}/vote`).then(
    () => render(),
    err => console.log(err)
  );
}
