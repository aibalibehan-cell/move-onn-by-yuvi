/* ==========================================================================
   Move ONN Consultancy - Companies Page Controller (js/companies.js)
   Complies with PROJECT_STANDARDS.md - Pure Modular Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('companySearchForm');
  const searchInput = document.getElementById('company-search');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = searchInput ? searchInput.value.trim() : '';
      if (val) {
        window.location.href = 'jobs.html?q=' + encodeURIComponent(val);
      } else {
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter a company name or job title.');
        } else {
          alert('Please enter a company name or job title.');
        }
      }
    });
  }

  // Filter popular companies on typing
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const cards = document.querySelectorAll('[data-testid="CompanyRow"]');
      cards.forEach(card => {
        const nameEl = card.querySelector('.css-1h1y3iw, .css-w5iap');
        if (!nameEl) return;
        const name = nameEl.textContent.toLowerCase();
        if (!q || name.includes(q)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});
