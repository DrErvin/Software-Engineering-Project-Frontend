import View from './View.js';

class FeaturedOpportunitiesView extends View {
  _parentElement = document.querySelector('.opportunities-grid');
  _errorMessage = 'No featured opportunities found. Please try again later!';

  addHandlerFeatured = function (handler) {
    window.addEventListener('load', handler);
  };

  _generateMarkup() {
    return this._data
      .map(
        (opportunity) => `
        <div class="opportunity-item">
          <h3>${opportunity.title || 'Untitled Opportunity'}</h3>
          <p>${opportunity.type || 'Unknown Type'} - ${
          opportunity.location || 'Location not specified'
        }</p>
          <a href="#${opportunity.id}" class="view-opportunity-btn">
            View Opportunity
          </a>
        </div>
      `
      )
      .join('');
  }
}

export default new FeaturedOpportunitiesView();
