/* ==========================================================================
   Move ONN Consultancy - Dedicated Countries & Languages Controller
   File: js/countries.js
   Complies with PROJECT_STANDARDS.md - Pure Modular Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const searchInput = document.getElementById('worldwide-search');
  const liveResults = document.querySelector('[data-testid="search-results-live"]');
  const items = document.querySelectorAll('.jt-country-item');

  // 1. Initial State: Highlight saved country/language
  const currentCountry = localStorage.getItem('jt_country') || 'IN';
  const currentLang = localStorage.getItem('jt_lang') || 'en';

  let foundActive = false;
  items.forEach(item => {
    const itemCountry = item.getAttribute('data-country');
    const itemLang = item.getAttribute('data-lang');
    const isCurrent = itemCountry === currentCountry && itemLang === currentLang;

    item.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    item.classList.toggle('css-3ednij', isCurrent);
    item.classList.toggle('css-1hxo85y', !isCurrent);

    const svg = item.querySelector('.css-1syq5dt svg');
    if (svg) {
      svg.classList.toggle('css-192wn8d', isCurrent);
      svg.classList.toggle('css-fqr35q', !isCurrent);
    }

    if (isCurrent) foundActive = true;
  });

  // If no match found, default to India English
  if (!foundActive && items.length > 0) {
    const firstIn = document.querySelector('.jt-country-item[data-country="IN"][data-lang="en"]') || items[0];
    if (firstIn) {
      firstIn.setAttribute('aria-selected', 'true');
      firstIn.classList.add('css-3ednij');
      firstIn.classList.remove('css-1hxo85y');
      const svg = firstIn.querySelector('.css-1syq5dt svg');
      if (svg) {
        svg.classList.add('css-192wn8d');
        svg.classList.remove('css-fqr35q');
      }
    }
  }

  // 2. Selection Handler function
  function selectCountryItem(item) {
    const country = item.getAttribute('data-country');
    const lang = item.getAttribute('data-lang');
    const name = item.getAttribute('data-name');
    const flag = item.getAttribute('data-flag') || `assets/flags/${country.toLowerCase()}.svg`;

    // Update visual active state
    items.forEach(el => {
      el.setAttribute('aria-selected', 'false');
      el.classList.remove('css-3ednij');
      el.classList.add('css-1hxo85y');
      const svg = el.querySelector('.css-1syq5dt svg');
      if (svg) {
        svg.classList.remove('css-192wn8d');
        svg.classList.add('css-fqr35q');
      }
    });

    item.setAttribute('aria-selected', 'true');
    item.classList.add('css-3ednij');
    item.classList.remove('css-1hxo85y');
    const svg = item.querySelector('.css-1syq5dt svg');
    if (svg) {
      svg.classList.add('css-192wn8d');
      svg.classList.remove('css-fqr35q');
    }

    // Save preferences to localStorage
    try {
      localStorage.setItem('jt_country', country);
      localStorage.setItem('jt_lang', lang);
      localStorage.setItem('jt_flag', flag);
      localStorage.setItem('jt_country_name', name);
    } catch (e) {}

    // Update Navbar & Drawer immediately
    if (typeof window.renderCountrySelector === 'function') {
      window.renderCountrySelector();
    }

    // Toast notification
    const msg = lang === 'hi' 
      ? `क्षेत्र और भाषा सेट की गई: ${name}। सेटिंग्स लागू की जा रही हैं...`
      : `Region and language set to ${name}. Applying settings...`;

    if (typeof window.showToast === 'function') {
      window.showToast(msg);
    }

    // Redirect to home after brief visual feedback
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  }

  // 3. Attach click and keyboard events to each country card
  items.forEach(item => {
    item.addEventListener('click', () => {
      selectCountryItem(item);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCountryItem(item);
      }
    });
  });

  // 4. Real-time Search Filtering
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      let matchCount = 0;

      items.forEach(item => {
        const country = (item.getAttribute('data-country') || '').toLowerCase();
        const lang = (item.getAttribute('data-lang') || '').toLowerCase();
        const name = (item.getAttribute('data-name') || '').toLowerCase();
        const secondary = (item.getAttribute('data-secondary') || '').toLowerCase();

        const matches = !q || country.includes(q) || lang.includes(q) || name.includes(q) || secondary.includes(q);

        item.style.display = matches ? 'flex' : 'none';
        if (matches) matchCount++;
      });

      if (liveResults) {
        liveResults.textContent = q ? `${matchCount} results found` : '';
      }
    });
  }
});
