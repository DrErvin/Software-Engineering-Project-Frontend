class SmartSearchView {
  #parentEl = document.querySelector('.admin-search-form');
  #input = this.#parentEl.querySelector('input[type="text"]');

  getQuery() {
    const query = this.#input.value.trim(); // Get and trim the input value
    this.#clearInput(); // Clear the input after getting the value
    return query;
  }

  #clearInput() {
    this.#input.value = ''; // Clear the input value
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SmartSearchView();
