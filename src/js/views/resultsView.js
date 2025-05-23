import View from './View.js';
import previewView from './previewView.js';

class resultsView extends View {
  _parentElement = document.querySelector('.container-opp-list');
  _errorMessage = 'No opportunities found for your query! Please try again';
  _message = '';

  _sectionsToShow = [
    document.querySelector('.opportunities-list'),
    document.querySelector('.intro-section'),
  ];

  // toggleInit() {
  //   // this.#toggleSections();
  //   this.toggleSections(this.#sectionsToShow);
  // }

  _generateMarkup() {
    return this._data
      .map((opportunity) => previewView.render(opportunity, false))
      .join('');
  }
}

export default new resultsView();
