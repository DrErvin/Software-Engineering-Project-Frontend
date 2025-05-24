import View from './View';

class smartResultsView extends View {
  _parentElement = document.querySelector('.admin-result-cards');
  _errorMessage = 'No applications found for your query! Please try again';
  _message = '';

  _sectionsToShow = [
    document.querySelector('.admin-search-results'),
    document.querySelector('.smart-search'),
    document.querySelector('.admin-statistics'),
    document.querySelector('.admin-header'),
  ];

  // toggleInit() {
  //   // this.#toggleSections();
  //   this.toggleSections(this.#sectionsToShow);
  // }

  _generateMarkup() {
    return this._data
      .map((data) => {
        return `
          <div class="admin-card">
            <div class="admin-card-content">
              <h3 class="admin-card-title">${
                data.opportunity_title || 'Untitled Opportunity'
              }</h3>
              <p class="admin-card-subtitle">
                Applicant: ${data.applicant_name || 'Unknown'} 
                <span class="admin-applicant-email">(${
                  data.applicant_email || 'No email provided'
                })</span>
              </p>
              <div class="admin-card-details">
                <p><strong>Application ID:</strong> ${
                  data.application_id || 'N/A'
                }</p>
                <p><strong>Opportunity Location:</strong> ${
                  data.opportunity_location || 'N/A'
                }</p>
                <p><strong>Applicant Country:</strong> ${
                  data.university_location || 'Unkown Country'
                } (${data.university_name || 'No University Info'})</p>
                <p><strong>Submitted:</strong> ${
                  data.application_date || 'Unknown'
                }</p>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }
}
export default new smartResultsView();
