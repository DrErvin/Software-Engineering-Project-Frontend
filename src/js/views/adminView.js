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

      if (!isLoggedIn('employer')) {
        alert(
          'You must be logged in as a Company user to access Admin Dashboard.'
        );
        return;
      }

      handler();
    });
  }

  renderPieChart(applications) {
    // 1) Aggregate by date
    const countsByDate = applications.reduce((acc, app) => {
      const date = app.application_date || 'Unknown';
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // 2) Prepare labels (“YYYY-MM-DD (n)”) and data arrays
    const labels = Object.keys(countsByDate).map(
      (date) => `${date} (${countsByDate[date]})`
    );
    const data = Object.values(countsByDate);

    // 3) (Optional) generate one distinct HSL color per slice
    const backgroundColor = labels.map(
      (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 70%)`
    );

    // 4) Render the pie chart
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Applications by Date',
            data,
            backgroundColor,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });
  }
}
export default new adminView();
