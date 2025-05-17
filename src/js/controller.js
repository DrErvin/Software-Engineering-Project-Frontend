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
