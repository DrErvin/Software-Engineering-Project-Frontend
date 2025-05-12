export default class View {
    _data;
    _originalHtml;



    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0))
            return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clearHtml();

        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    _clearHtml() {
        this._saveOriginalHtml();

        this._parentElement.innerHTML = '';
    }

    _saveOriginalHtml() {
        if (this._originalHtml) return;

        this._originalHtml = this._parentElement.innerHTML;
    }

    restoreOriginalHtml() {
        if (!this._originalHtml) return;

        // Wait for the transition to end before restoring HTML
        const onTransitionEnd = () => {
            this._parentElement.innerHTML = this._originalHtml;
            this._window.removeEventListener('transitionend', onTransitionEnd);
        };

        this._window.addEventListener('transitionend', onTransitionEnd);
    }

    scrollUp() {
        window.scrollTo({
            top: 0,
            // behavior: 'smooth',
        });
    }



    toggleSections() {
        //visibleSections = []
        const visibleSections = this._sectionsToShow;
        const sections = document.querySelectorAll('section');

        sections.forEach((section) => {
            const shouldBeVisible =
                section.classList.contains('newsletter') ||
                visibleSections.includes(section);

            section.classList.toggle('hidden', !shouldBeVisible);
        });
    }

    renderSpinner() {
        const markup = `
          <div class="spinner">
            <svg>
              <use href="img/icons.svg#icon-loading"></use>
            </svg>
          </div>
          `;
        this._clearHtml();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <svg>
              <use href="img/icons.svg#icon-warning"></use>
            </svg>
            <p>${message}</p>
        </div>
    `;
        this._clearHtml();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="img/icons.svg#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
    `;
        this._clearHtml();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}