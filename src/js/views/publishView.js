import View from './View.js';

class publishView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Opportunity was successfully uploaded :)';

  _window = document.querySelector('.publish-opportunity-window');
  _overlay = document.querySelector('.overlay--publish');
  _btnOpen = document.querySelector('#publishOpportunities');
  _btnClose = document.querySelector('.upload-btn--close-modal');

  constructor() {
    super();
    // this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden-oppacity');
    this._window.classList.toggle('hidden-oppacity');
  }

  addHandlerShowWindow(isLoggedIn) {
    this._btnOpen.addEventListener('click', (e) => {
      e.preventDefault();

      if (!isLoggedIn('employer')) {
        alert('You must be logged in as a Company user to publish.');
        return;
      }

      this.toggleWindow();
    });
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));

    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        !this._overlay.classList.contains('hidden-oppacity') &&
        !this._window.classList.contains('hidden-oppacity')
      )
        this.toggleWindow();
    });
  }

  isManuallyClosed() {
    return this._window.classList.contains('hidden-oppacity');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(data);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new publishView();
