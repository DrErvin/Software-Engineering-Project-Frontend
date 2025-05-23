class SearchView {
  #parentEl = document.querySelector('.search-form');

  #featuredSection = document.querySelector('.featured-opportunity');
  #listSection = document.querySelector('.opportunities-list');

  /**
   * Get search query values from the form
   * @returns {Object} The search query object
   */

  getQuery() {
    const inputs = this.#parentEl.querySelectorAll('input[type="text"]');
    const dropdowns = this.#parentEl.querySelectorAll('select');

    const query = {
      location: inputs[0].value.trim(),
      titleOrKeyword: inputs[1].value.trim(),
      fieldOfWork: dropdowns[0].value.trim(),
      // type: dropdowns[1].value.trim(),
    };

    this.#clearInput();
    // this.#toggleSections();
    return query;
  }

  #clearInput() {
    // Clear text inputs
    const inputs = this.#parentEl.querySelectorAll('input[type="text"]');
    inputs.forEach((input) => (input.value = ''));

    // Clear dropdown inputs
    const selects = this.#parentEl.querySelectorAll('select');
    selects.forEach((select) => (select.value = ''));
  }

  // #toggleSections() {
  //   if (!this.#featuredSection.classList.contains('hidden')) {
  //     this.#featuredSection.classList.add('hidden');
  //   }
  //   this.#listSection.classList.remove('hidden');
  // }
  // toggleInit() {
  //   // this.#toggleSections();
  //   this.toggleSections([
  //     document.querySelector('.opportunities-list'),
  //     document.querySelector('.intro-section'),
  //   ]);
  // }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
