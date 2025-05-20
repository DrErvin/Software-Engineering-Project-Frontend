import View from './View.js';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.pagination-btn');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        curPage + 1
      }" class="pagination-btn pagination__btn--next">
            <svg class="pagination-icon">
              <use href="img/icons.svg#icon-arrow-right"></use>
            </svg>
            <span>Page ${curPage + 1}</span>
        </button>
         `;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="pagination-btn pagination__btn--prev">
            <svg class="pagination-icon">
              <use href="img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        `;
    }
    // Other page
    if (curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="pagination-btn pagination__btn--prev">
            <svg class="pagination-icon">
              <use href="img/icons.svg#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto="${
          curPage + 1
        }" class="pagination-btn pagination__btn--next">
            <svg class="pagination-icon">
              <use href="img/icons.svg#icon-arrow-right"></use>
            </svg>
            <span>Page ${curPage + 1}</span>
        </button>
        `;
    }
    // Page 1, and there are NO other pages
    return '';
  }
}

export default new paginationView();
