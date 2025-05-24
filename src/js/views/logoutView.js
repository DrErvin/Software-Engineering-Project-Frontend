import View from './View.js';

class logoutView extends View {
  _parentElement = document.querySelector('.logout-form');
  _message = 'You have been successfully logged out!';

  _window = document.querySelector('.logout-form-window');
  _overlay = document.querySelector('.overlay--logout');
  _btnOpen = document.querySelector('#logInSignUp');
  _btnClose = document.querySelector('.logout-btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden-oppacity');
    this._window.classList.toggle('hidden-oppacity');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', (_) => {
      if (this._btnOpen.textContent.trim() === 'Log Out') {
        this.toggleWindow();
      }
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

  // getLoginData() {
  //   const email = this._parentElement.querySelector('#loginEmail').value;
  //   const password = this._parentElement.querySelector('#loginPassword').value;
  //   return { email, password };
  // }

  // updateLoginButton(isLoggedIn) {
  //   // const text = isLoggedIn ? 'Log Out' : 'Log In/Sign Up';
  //   this._btnOpen.textContent = isLoggedIn ? 'Log Out' : 'Log In/Sign Up';
  // }

  isManuallyClosed() {
    return this._window.classList.contains('hidden-oppacity');
  }

  updateUserNameSurname(user) {
    if (!user) return;

    // Update the logout message with the user's name
    const userNameElement = document.querySelector('#logoutUserName');
    if (!userNameElement) return;
    userNameElement.textContent = user.name_and_surname;
  }

  addHandlerLogout(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _generateMarkup() {}
}

export default new logoutView();
