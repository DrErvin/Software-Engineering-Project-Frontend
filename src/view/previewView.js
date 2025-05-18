import View from './View.js';

class previewView extends View {
    _parentElement = '';

    _generateMarkup() {
        return `
      <div class="job-card">
        <img src="img/job-logo.jpg" alt="Company logo" class="card-logo" />
        <div class="card-info">
          <h3 class="card-type">${this._data.type || 'Job Type'}</h3>
          <h2 class="card-title">${this._data.title || 'Untitled Job'}</h2>
        </div>
        <div class="card-details">
          <div class="card-detail-item">
            <div class="card-detail-label">
              <svg class="card-icon">
                <use href="img/icons.svg#icon-location-marker"></use>
              </svg>
              <span>Location</span>
            </div>
            <p>${this._data.location || 'Not specified'}</p>
          </div>
          <div class="card-detail-item">
            <div class="card-detail-label">
              <svg class="card-icon">
                <use href="img/icons.svg#icon-experience"></use>
              </svg>
              <span>Experience</span>
            </div>
            <p>${
              Array.isArray(this._data.experience)
                ? this._data.experience.join(', ')
                : this._data.experience || 'N/A'
            }</p>
          </div>
          <div class="card-detail-item last-item">
            <div class="card-detail-label">
              <svg class="card-icon">
                <use href="img/icons.svg#icon-deadline"></use>
              </svg>
              <span>Deadline</span>
            </div>
            <p>${this._data.deadline || 'No deadline'}</p>
          </div>
        </div>
        <a href="#${this._data.id}" class="card-link">
          <button class="card-btn">View Job</button>
        </a>
      </div>
    `;
    }
}

export default new previewView();