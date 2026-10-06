/* ==========================================================================
   Move ONN Consultancy - Dedicated Salaries Page Controller (js/salaries.js)
   Complies with PROJECT_STANDARDS.md - Pure Modular Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Search Form Handling
  const searchForms = document.querySelectorAll('form');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = form.querySelectorAll('input[type="text"], input[type="search"]');
      let query = '';
      inputs.forEach(inp => {
        if (inp.value && inp.value.trim()) {
          query += (query ? ' ' : '') + inp.value.trim();
        }
      });
      if (query) {
        window.location.href = 'jobs.html?q=' + encodeURIComponent(query);
      } else {
        if (typeof window.showToast === 'function') {
          window.showToast('Please enter a job title or location.');
        } else {
          alert('Please enter a job title or location.');
        }
      }
    });
  });

  // 2. Clear Location Button
  const clearLocationBtn = document.getElementById('clear-location-localized');
  const locationInput = document.getElementById('input-location-autocomplete');
  if (clearLocationBtn && locationInput) {
    clearLocationBtn.addEventListener('click', () => {
      locationInput.value = '';
      locationInput.focus();
    });
  }

  // 3. Industry Combobox Dropdown Handler
  const industryCombobox = document.querySelector('[role="combobox"][aria-controls="Listbox-:R3mpnalam:"]');
  const industryPopup = document.getElementById('Popup-:R3mpnalamH1:');
  const selectedLabel = industryCombobox ? industryCombobox.querySelector('.css-ew4qyo') : null;

  if (industryCombobox && industryPopup) {
    // Toggle dropdown on click
    industryCombobox.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = industryPopup.classList.toggle('jt-dropdown-open');
      industryCombobox.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Option selection
    const options = industryPopup.querySelectorAll('li[role="option"]');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        options.forEach(opt => opt.setAttribute('aria-selected', 'false'));
        option.setAttribute('aria-selected', 'true');
        
        const textSpan = option.querySelector('.css-u74ql7');
        if (textSpan && selectedLabel) {
          selectedLabel.textContent = textSpan.textContent.trim();
        }

        industryPopup.classList.remove('jt-dropdown-open');
        industryCombobox.setAttribute('aria-expanded', 'false');

        if (typeof window.showToast === 'function') {
          window.showToast(`Industry filtered: ${selectedLabel ? selectedLabel.textContent : ''}`);
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!industryCombobox.contains(e.target) && !industryPopup.contains(e.target)) {
        industryPopup.classList.remove('jt-dropdown-open');
        industryCombobox.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on window scroll so dropdown never covers scrolled elements or header
    window.addEventListener('scroll', () => {
      if (industryPopup.classList.contains('jt-dropdown-open')) {
        industryPopup.classList.remove('jt-dropdown-open');
        industryCombobox.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }
});
