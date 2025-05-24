import View from './View.js';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

class adminView extends View {
  _parentElement = document.querySelector('#admin-content');
  _errorMessage =
    'We could not load the admin dashboard. Please try another time!';
  _message = '';
  _btnShow = document.querySelector('#admin-btn');
  _sectionsToShow = [
    document.querySelector('.smart-search'),
    document.querySelector('.admin-statistics'),
    document.querySelector('.admin-header'),
  ];

  constructor() {
    super();
    // this._addHandlerShowSection();
    // this._addHandlerHideWindow();
  }

  // _showSection() {
  //   // this.#toggleSections();
  //   this.toggleSections(this.#sectionsToShow);
  // }

  renderStats(opportunities, applications) {
    // Calculate active opportunities
    const activeOpportunities = opportunities.filter((opp) => {
      const currentDate = new Date();
      const endingDate = new Date(opp.endingDate);
      return endingDate >= currentDate;
    }).length;

    // Total applications count
    const totalApplications = applications.length;
    document.querySelector('#opportunities-count').textContent =
      activeOpportunities;
    document.querySelector('#applications-count').textContent =
      totalApplications;
  }

  addHandlerShowSection(handler, isLoggedIn) {
    this._btnShow.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isLoggedIn('admin')) {
        alert('You must be logged in as admin to access Admin Dashboard.');
        return;
      }

      handler();
    });
  }

  renderPieChart(applicantsData) {
    // Aggregate the data by country with unique accounts
    const applicantsByCountry = applicantsData.reduce((acc, applicant) => {
      const country = applicant.location || 'Unknown';
      if (!acc[country]) acc[country] = new Set(); // Use a Set to ensure unique accounts
      acc[country].add(applicant.id); // Add the unique account ID
      return acc;
    }, {});

    // Prepare labels and values for the chart
    const labels = Object.keys(applicantsByCountry).map(
      (country) => `${country} (${applicantsByCountry[country].size})` // Add counts to labels
    );
    const values = Object.values(applicantsByCountry).map((set) => set.size); // Get unique counts

    // Render the chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Applicants by Country',
            data: values,
            backgroundColor: [
              '#e20074', //#e20074-#FF6384
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}
export default new adminView();
