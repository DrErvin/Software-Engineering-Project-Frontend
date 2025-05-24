import View from './View.js';

class signupView extends View {
  _parentElement = document.querySelector('.signup-form');
  _message = 'You have been successfully signed up!';

  _window = document.querySelector('.signup-form-window');
  _overlay = document.querySelector('.overlay--signup');
  _btnOpen = document.querySelector('#openSignUpForm');
  _btnClose = document.querySelector('.signup-btn--close-modal');

  _validationError = document.querySelector('.signup__emailError');
  _submitButton = document.querySelector('.signup__btn');
  _isEmailValid = false; // Track email validation status

  constructor() {
    super();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden-oppacity');
    this._window.classList.toggle('hidden-oppacity');

    // Refresh the _validationError reference when toggling the window
  }

  toggleValidationError(show = false) {
    this._validationError.classList.toggle('hidden', !show);
    // this._submitButton.disabled = show; // Disable submit button if there is an error
  }

  isManuallyClosed() {
    return this._window.classList.contains('hidden-oppacity');
  }

  resetValidation() {
    this._isEmailValid = false;
    this.toggleValidationError(false);
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

  addHandlerShowWindow(handler) {
    // this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    this._btnOpen.addEventListener('click', function () {
      handler(); // Call the handler provided by the controller
    });
  }

  addHandlerValidation(handler) {
    const emailInput = this._parentElement.querySelector('#signUpEmail');
    emailInput.addEventListener(
      'input',
      async function (e) {
        const email = e.target.value;
        this._isEmailValid = await handler(email);

        // Refresh the _validationError reference when opening the second time
        this._validationError = document.querySelector('.signup__emailError');
        this.toggleValidationError(!this._isEmailValid);
      }.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        if (!this._isEmailValid) {
          this.toggleValidationError(true);
          return; // Prevent submission if email is invalid
        }

        const dataArr = [...new FormData(this._parentElement)];
        const data = Object.fromEntries(dataArr);
        // console.log(data);
        handler(data);
      }.bind(this)
    );
  }

  _generateMarkup() {}
}

export default new signupView();
