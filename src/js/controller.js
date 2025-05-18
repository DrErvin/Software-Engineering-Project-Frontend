import { RES_PER_PAGE } from './config.js';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import featuredView from './views/featuredView.js';
import SearchView from './views/SearchView.js';
import loginView from './views/loginView.js';

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
