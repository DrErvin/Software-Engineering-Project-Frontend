import View from "./View.js"

class NavView extends View {
  _parentElement = document.querySelector(".nav")

  updateNavForUserType(userType) {
    const adminBtn = document.querySelector("#admin-btn")
    const publishBtn = document.querySelector("#publishOpportunities")

    if (userType === "candidate") {
      // Hide admin and publish buttons for candidates
      if (adminBtn) adminBtn.style.display = "none"
      if (publishBtn) publishBtn.style.display = "none"
    } else if (userType === "employer") {
      // Show admin and publish buttons for employers
      if (adminBtn) adminBtn.style.display = "block"
      if (publishBtn) publishBtn.style.display = "block"
    } else {
      // Default state - show all buttons
      if (adminBtn) adminBtn.style.display = "block"
      if (publishBtn) publishBtn.style.display = "block"
    }
  }

  resetNavigation() {
    // Reset to default state (show all buttons)
    this.updateNavForUserType("employer")
  }

  _generateMarkup() {
    // Not needed since nav is in HTML
    return ""
  }
}

export default new NavView()
