import { RES_PER_PAGE } from './config.js';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import featuredView from './views/featuredView.js';
import SearchView from './views/SearchView.js';
import loginView from './views/loginView.js';
import resultsView from './views/resultsView.js';
import previewView from '/views/previewView.js';
import paginationView from './views/paginationView.js';

const controlFeaturedOpportunities = async function () {
  try {
    featuredView.renderSpinner();

    // Fetch data from the server
    const data = await model.fetchFeatured();
    console.log('Fetched Featured Opportunities:', data); // Debug log

    // Render the opportunities
    featuredView.render(data);
  } catch (err) {
    featuredView.renderError();
    console.error(err);
  }
};

//console.log(RES_PER_PAGE);

const controlOpportunities = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Ignore scrolling sections
    if (id === 'featured-section' || id === 'newsletter-section') {
      document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 0) Scroll the viewport to the top and render the loading spinner
    opportunitiesView.scrollUp();
    opportunitiesView.renderSpinner();

    // 1) Toggle sections visibility
    opportunitiesView.toggleSections();

    // 0) Update results view to mark selected search result
    // resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    // bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadOpportunity(id);

    // 3) Attach isLoggedIn function to the markup method
    opportunitiesView.addHandlerPermission(model.isLoggedIn);

    // 4) Rendering opportunity
    opportunitiesView.render(model.state.opportunity);

    // 5) Attach event listeners for Apply Now buttons
    applyView.addHandlerShowWindow(model.isLoggedIn);

    opportunitiesView.addHandlerDownloadPDF(controlDownloadPDF);
  } catch (err) {
    console.error(err);
    opportunitiesView.renderError();
  }
};

// A handler function to process the search query
const controlSearchResults = async function () {
  try {
    // 0) Scroll the viewport to the top and render the loading spinner
    resultsView.scrollUp();
    resultsView.renderSpinner();

    // 1) Toggle sections visibility
    resultsView.toggleSections();

    // 2) Get search query
    const query = SearchView.getQuery();

    // Guard clause: Do nothing if all query fields are empty
    // const isEmpty = Object.values(query).every((value) => value === '');
    // if (isEmpty || !query) return;
    if (!query) return;
    console.log(query);

    // 3) Render intro-section with query data
    introView.render(query);

    // 4) Load search results
    await model.loadSearchResults(query);

    // 5) Render results
    resultsView.render(model.getSearchResultsPage());

    // 6) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};

// A handler function to control pagination
const controlPagination = function (goToPage) {
  resultsView.scrollUp();
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlPublishOpportunity = async function (newOpportunity) {
  try {
    // Show loading spinner
    publishView.renderSpinner();

    // Upload the new opportunity data
    await model.uploadOpportunity(newOpportunity);
    console.log(model.state.opportunity);

    // Render opportunity
    opportunitiesView.scrollUp();
    opportunitiesView.toggleSections();
    opportunitiesView.render(model.state.opportunity);

    // Success message
    publishView.renderMessage();

    // Restore the original form HTML after renderMesssage clears it
    publishView.restoreOriginalHtml();

    // Render bookmark view
    // bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.opportunity.id}`);
    // window.history.back() // Automatically goes back to last page

    // Update the buttons in opportunitiesView after login
    opportunitiesView.updateButtons(model.isLoggedIn);

    opportunitiesView.addHandlerDownloadPDF(controlDownloadPDF);

    // Close form window
    setTimeout(function () {
      if (!publishView.isManuallyClosed()) publishView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    publishView.renderError(err.message);
  }
};

const controlLogIn = async function () {
  try {
    // Get login data from the login form
    const data = loginView.getLoginData();

    // Verify login credentials using the model
    const account = await model.verifyLogin(data);
    if (!account) {
      alert('Invalid email or password');
      return;
    }

    // Log success and user details
    console.log('Login successful:', model.state.user);

    // Update the login button text
    loginView.updateLoginButton(model.isLoggedIn());

    // Update log out form with user name and surname
    const userData = await model.getUserDetails();
    logoutView.updateUserNameSurname(userData);

    // Show success message
    loginView.renderMessage();

    // Restore the original form HTML after renderMesssage clears it
    loginView.restoreOriginalHtml();

    // Update the buttons in opportunitiesView after login
    opportunitiesView.updateButtons(model.isLoggedIn);

    // Close the login form
    setTimeout(function () {
      if (!loginView.isManuallyClosed()) loginView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    loginView.renderError(err.message);
  }
};
