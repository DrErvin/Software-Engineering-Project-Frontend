import View from "./View.js"

class HomepageView extends View {
  _parentElement = document.querySelector(".homepage-section")
  _errorMessage = "Could not load homepage data."
  _message = ""

  render() {
    // The HTML is already in the index.html, so we just need to handle navigation
    this.addHandlerNavigation(this._navigationHandler)
  }

  addHandlerNavigation(handler) {
    this._navigationHandler = handler
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn")
      if (!btn) return
      const link = btn.dataset.link
      handler(link)
    })
  }

  toggleSections() {
    // Hide homepage
    this._parentElement.classList.add("hidden")

    // Show main content sections
    const mainContent = document.querySelector("#main-content")
    const header = document.querySelector(".main-header")
    const footer = document.querySelector(".main-footer")
    const newsletter = document.querySelector("#newsletter-section")

    if (mainContent) mainContent.classList.remove("hidden")
    if (header) header.classList.remove("hidden")
    if (footer) footer.classList.remove("hidden")
    if (newsletter) newsletter.classList.remove("hidden")
  }

  _generateMarkup() {
    // Not needed since HTML is in index.html
    return ""
  }
}

export default new HomepageView()
