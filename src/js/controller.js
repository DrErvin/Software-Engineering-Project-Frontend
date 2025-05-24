import { MODAL_CLOSE_SEC } from "./config.js"
import * as model from "./model.js"
import featuredView from "./views/featuredView.js"
import SearchView from "./views/SearchView.js"
import resultsView from "./views/resultsView.js"
import paginationView from "./views/paginationView.js"
import introView from "./views/introView.js"
import opportunitiesView from "./views/OpportunitiesView.js"
import publishView from "./views/publishView.js"
import loginView from "./views/loginView.js"
import logoutView from "./views/logoutView.js"
import signupView from "./views/signupView.js"
import applyView from "./views/applyView.js"
import PDFView from "./views/PDFView.js"
import adminView from "./views/adminView.js"
import SmartSearchView from "./views/SmartSearchView.js"
import smartResultsView from "./views/smartResultsView.js"
import homepageView from "./views/HomepageView.js"
import navView from "./views/navView.js"

const controlHomepageNavigation = (link) => {
  if (link === "login-signup") {
    // Show confirmation dialog for employers
    const isExistingUser = confirm(
      'Are you already signed in?\n\nClick "OK" if you have an account and want to log in.\nClick "Cancel" if you need to create a new account.',
    )

    // For employers, don't show main content until they login/signup
    setTimeout(() => {
      if (isExistingUser) {
        // Direct to login - don't show main content yet
        loginView.toggleWindow()
      } else {
        // Direct to signup - don't show main content yet
        signupView.toggleWindow()
      }
    }, 100)
  } else if (link === "default") {
    // Hide homepage and show main content for candidates
    homepageView.toggleSections()
    // Update navigation for candidates (hide admin/publish buttons)
    navView.updateNavForUserType("candidate")
    // Load featured opportunities
    controlFeaturedOpportunities()
  }
}

const controlFeaturedOpportunities = async () => {
  try {
    featuredView.renderSpinner()

    // Fetch data from the server
    const data = await model.fetchFeatured()
    console.log("Fetched Featured Opportunities:", data) // Debug log

    // Render the opportunities
    featuredView.render(data)
  } catch (err) {
    featuredView.renderError()
    console.error(err)
  }
}

const controlOpportunities = async () => {
  try {
    const id = window.location.hash.slice(1)

    if (!id) return

    // Ignore scrolling sections
    if (id === "featured-section" || id === "newsletter-section") {
      document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" })
      return
    }

    // 0) Scroll the viewport to the top and render the loading spinner
    opportunitiesView.scrollUp()
    opportunitiesView.renderSpinner()

    // 1) Toggle sections visibility
    opportunitiesView.toggleSections()

    // 2) Loading opportunity
    await model.loadOpportunity(id)

    // 3) Attach isLoggedIn function to the markup method
    opportunitiesView.addHandlerPermission(model.isLoggedIn)

    // 4) Rendering opportunity
    opportunitiesView.render(model.state.opportunity)

    // 5) Attach event listeners for Apply Now buttons
    applyView.addHandlerShowWindow(model.isLoggedIn)

    opportunitiesView.addHandlerDownloadPDF(controlDownloadPDF)
  } catch (err) {
    console.error(err)
    opportunitiesView.renderError()
  }
}

// A handler function to process the search query
const controlSearchResults = async () => {
  try {
    // 0) Scroll the viewport to the top and render the loading spinner
    resultsView.scrollUp()
    resultsView.renderSpinner()

    // 1) Toggle sections visibility
    resultsView.toggleSections()

    // 2) Get search query
    const query = SearchView.getQuery()

    if (!query) return
    console.log(query)

    // 3) Render intro-section with query data
    introView.render(query)

    // 4) Load search results
    await model.loadSearchResults(query)

    // 5) Render results
    resultsView.render(model.getSearchResultsPage())

    // 6) Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.error(err)
    resultsView.renderError()
  }
}

const controlPagination = (goToPage) => {
  resultsView.scrollUp()
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2) Render new pagination buttons
  paginationView.render(model.state.search)
}

const controlPublishOpportunity = async (newOpportunity) => {
  try {
    // Show loading spinner
    publishView.renderSpinner()

    // Upload the new opportunity data
    await model.uploadOpportunity(newOpportunity)
    console.log(model.state.opportunity)

    // Render opportunity
    opportunitiesView.scrollUp()
    opportunitiesView.toggleSections()
    opportunitiesView.render(model.state.opportunity)

    // Success message
    publishView.renderMessage()

    // Restore the original form HTML after renderMesssage clears it
    publishView.restoreOriginalHtml()

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.opportunity.id}`)

    // Update the buttons in opportunitiesView after login
    opportunitiesView.updateButtons(model.isLoggedIn)

    opportunitiesView.addHandlerDownloadPDF(controlDownloadPDF)

    // Close form window
    setTimeout(() => {
      if (!publishView.isManuallyClosed()) publishView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error("💥", err)
    publishView.renderError(err.message)
  }
}

const controlLogIn = async () => {
  try {
    // Get login data from the login form
    const data = loginView.getLoginData()

    // Verify login credentials using the model
    const account = await model.verifyLogin(data)
    if (!account) {
      alert("Invalid email or password")
      return
    }

    // Log success and user details
    console.log("Login successful:", model.state.user)

    // Update the login button text
    loginView.updateLoginButton(model.isLoggedIn())

    // Update log out form with user name and surname
    const userData = await model.getUserDetails()
    logoutView.updateUserNameSurname(userData)

    // Show success message
    loginView.renderMessage()

    // Restore the original form HTML after renderMesssage clears it
    loginView.restoreOriginalHtml()

    // Update the buttons in opportunitiesView after login
    opportunitiesView.updateButtons(model.isLoggedIn)

    // After successful login, show main content and update nav based on user type
    homepageView.toggleSections()
    navView.updateNavForUserType(model.state.user.accountType)
    controlFeaturedOpportunities()

    // Close the login form
    setTimeout(() => {
      if (!loginView.isManuallyClosed()) loginView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error("💥", err)
    loginView.renderError(err.message)
  }
}

const controlLogInState = async () => {
  try {
    // Load user from local storage
    model.loadUserFromLocalStorage()

    // If user is logged in, update UI
    loginView.updateLoginButton(model.isLoggedIn())

    // Update navigation based on user type
    if (model.isLoggedIn()) {
      navView.updateNavForUserType(model.state.user.accountType)
    }

    // Update log out form with user name and surname
    const userData = await model.getUserDetails()
    logoutView.updateUserNameSurname(userData)

    console.log("User restored from session:", model.state.user)
  } catch (err) {
    console.error("💥", err)
    logoutView.renderError(err.message)
    loginView.renderError(err.message)
  }
}

const controlLogOut = async () => {
  try {
    // Capture account type before clearing state
    const accountType = model.state.user.accountType

    // Clear global state and local storage
    model.clearState()
    model.clearLocalStorage()

    // Update login button and reset navigation
    loginView.updateLoginButton()
    navView.resetNavigation()

    // Show logout success message and restore UI
    logoutView.renderMessage()
    logoutView.restoreOriginalHtml()

    opportunitiesView.updateButtons(model.isLoggedIn)

    // Hide all main content sections
    const mainContent = document.querySelector("#main-content")
    const detailsContent = document.querySelector("#details-content")
    const adminContent = document.querySelector("#admin-content")
    const header = document.querySelector(".main-header")
    const footer = document.querySelector(".main-footer")
    const newsletter = document.querySelector("#newsletter-section")
    const homepageSection = document.querySelector(".homepage-section")

    // Hide all content sections
    if (mainContent) mainContent.classList.add("hidden")
    if (detailsContent) detailsContent.classList.add("hidden")
    if (adminContent) adminContent.classList.add("hidden")
    if (header) header.classList.add("hidden")
    if (footer) footer.classList.add("hidden")
    if (newsletter) newsletter.classList.add("hidden")

    // Show homepage
    if (homepageSection) homepageSection.classList.remove("hidden")

    // Clear URL hash to go back to clean state
    window.history.pushState(null, "", window.location.pathname)

    // Re-initialize homepage functionality
    homepageView.addHandlerNavigation(controlHomepageNavigation)

    // Close logout modal after a delay
    setTimeout(() => {
      if (!logoutView.isManuallyClosed()) logoutView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error("💥", err)
    logoutView.renderError(err.message)
  }
}

const controlSignup = async (newAccount) => {
  try {
    // Show loading spinner
    signupView.renderSpinner()

    await model.uploadAccount(newAccount)

    // Update the login button text
    loginView.updateLoginButton(model.isLoggedIn())

    // Update log out form with user name and surname
    const userData = await model.getUserDetails()
    logoutView.updateUserNameSurname(userData)

    // After successful signup, show main content and update nav based on user type
    homepageView.toggleSections()
    navView.updateNavForUserType(model.state.user.accountType)
    controlFeaturedOpportunities()

    // Success message
    signupView.renderMessage()

    // Restore the original form HTML after renderMesssage clears it
    signupView.restoreOriginalHtml()

    setTimeout(() => {
      if (!signupView.isManuallyClosed()) signupView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error("💥", err)
    signupView.renderError(err.message)
  }
}

const controlSignupWindow = async () => {
  try {
    // Close the login form if it is open
    if (!loginView.isManuallyClosed()) loginView.toggleWindow()

    // Open the signup form
    signupView.toggleWindow()
  } catch (err) {
    console.error("💥", err)
    signupView.renderError(err.message)
  }
}

const controlValidateEmail = async (email) => {
  try {
    const isValid = await model.validateEmail(email)
    return isValid // Return validation status to be used in the view
  } catch (err) {
    console.error("💥", err)
    signupView.renderError(err.message)
  }
}

const controlApplication = async (formData) => {
  try {
    // Show loading spinner
    applyView.renderSpinner()

    // Append userId and opportunityId from the global state
    formData.append("userId", model.state.user.id)
    formData.append("opportunityId", model.state.opportunity.id)

    // Submit data to the backend
    await model.submitApplication(formData)

    // Success message
    applyView.renderMessage()

    // Restore the original form HTML after renderMesssage clears it
    applyView.restoreOriginalHtml()

    setTimeout(() => {
      if (!applyView.isManuallyClosed()) applyView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error("💥", err)
    applyView.renderError(err.message)
  }
}

const controlDownloadPDF = () => {
  console.log("controlDownloadPDF initiated")
  const opportunity = model.state.opportunity
  console.log("PDF called with:", opportunity)

  PDFView.generatePDF(opportunity)
}

const controlAdminDashboard = async () => {
  try {
    adminView.toggleSections()

    // Fetch all opportunities and applications
    const opportunities = await model.fetchAllOpportunities()
    const applications = await model.fetchAllApplications()
    const applicantsData = await model.fetchAllApplicantsData()

    adminView.renderStats(opportunities, applications)
    adminView.renderPieChart(applications)
  } catch (err) {
    console.error("💥", err)
    adminView.renderError(err.message)
  }
}

const controlSmartSearch = async () => {
  try {
    smartResultsView.renderSpinner()
    smartResultsView.toggleSections()

    // 1. Get the query from the SmartSearchView
    const query = SmartSearchView.getQuery()
    if (!query) return
    console.log(query)

    // 2. Send the query to the backend or API for processing (placeholder logic)
    const results = await model.performSmartSearch(query)
    console.log("Smart Search Results:", results)

    // 3. Render the results
    smartResultsView.render(results)
  } catch (err) {
    console.error("💥", err)
    smartResultsView.renderError(err.message)
  }
}

// Add handler for Home button navigation
const controlHomeNavigation = () => {
  // Hide all content sections
  const mainContent = document.querySelector("#main-content")
  const detailsContent = document.querySelector("#details-content")
  const adminContent = document.querySelector("#admin-content")
  const header = document.querySelector(".main-header")
  const footer = document.querySelector(".main-footer")
  const newsletter = document.querySelector("#newsletter-section")
  const homepageSection = document.querySelector(".homepage-section")

  // Hide all sections
  if (mainContent) mainContent.classList.add("hidden")
  if (detailsContent) detailsContent.classList.add("hidden")
  if (adminContent) adminContent.classList.add("hidden")
  if (header) header.classList.add("hidden")
  if (footer) footer.classList.add("hidden")
  if (newsletter) newsletter.classList.add("hidden")

  // Show homepage
  if (homepageSection) homepageSection.classList.remove("hidden")

  // Clear URL hash
  window.history.pushState(null, "", window.location.pathname)

  // Re-initialize homepage functionality
  homepageView.addHandlerNavigation(controlHomepageNavigation)
}

const initHomepage = async () => {
  // First, load user state from localStorage
  model.loadUserFromLocalStorage()

  // Check if user is already logged in
  const isUserLoggedIn = model.isLoggedIn()

  const hash = window.location.hash

  if (isUserLoggedIn) {
    // User is logged in - skip landing page and go to main content
    console.log("User is logged in, skipping landing page")

    // Clear the hash to ensure we start fresh
    if (hash) {
      window.history.replaceState(null, "", window.location.pathname)
    }

    // Show main content directly
    homepageView.toggleSections()

    // Load featured opportunities
    controlFeaturedOpportunities()

    // Update UI for logged in state
    await controlLogInState()
  } else {
    // User is not logged in - show landing page
    console.log("User not logged in, showing landing page")

    // Clear the hash to ensure we start fresh
    if (hash) {
      window.history.replaceState(null, "", window.location.pathname)
    }

    // Show homepage
    homepageView.render()
    homepageView.addHandlerNavigation(controlHomepageNavigation)
  }
}

const init = () => {
  initHomepage()
  featuredView.addHandlerFeatured(controlFeaturedOpportunities)
  SearchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  opportunitiesView.addHandlerRender(controlOpportunities)
  publishView.addHandlerUpload(controlPublishOpportunity)
  publishView.addHandlerShowWindow(model.isLoggedIn)
  loginView.addHandlerLogin(controlLogIn)
  logoutView.addHandlerLogout(controlLogOut)
  signupView.addHandlerShowWindow(controlSignupWindow)
  signupView.addHandlerUpload(controlSignup)
  applyView.addHandlerApply(controlApplication)
  adminView.addHandlerShowSection(controlAdminDashboard, model.isLoggedIn)
  SmartSearchView.addHandlerSearch(controlSmartSearch)

  // Add event listener for Home button
  const homeBtn = document.querySelector("#homeBtn")
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault()
      controlHomeNavigation()
    })
  }
}
init()
