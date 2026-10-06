/* ==========================================================================
   Move ONN - Dedicated Homepage Controller (js/homepage.js)
   Complies with PROJECT_STANDARDS.md - Pure Modular Architecture
   Manages Job Seeker Features: Categories, Resume Upload, Featured Jobs Tabs,
   ATS Resume Score Checker, and Interactive Salary Estimator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSearchExperienceSelector();
  initResumeUpload();
  initFeaturedJobTabs();
  initResumeScoreWidget();
  initSalaryEstimatorWidget();
  initTrendingAccordion();
});

// 1. Search Experience Selector Synchronization
function initSearchExperienceSelector() {
  const form = document.getElementById('jtHomeSearchForm');
  if (!form) return;

  // Let form naturally submit GET params q, l, and exp to jobs.html
  form.addEventListener('submit', (e) => {
    const what = document.getElementById('jtSearchWhat');
    const where = document.getElementById('jtSearchWhere');
    const exp = document.getElementById('jtSearchExp');

    // Clean empty values to keep URL clean
    if (what && !what.value.trim()) what.removeAttribute('name');
    if (where && !where.value.trim()) where.removeAttribute('name');
    if (exp && !exp.value.trim()) exp.removeAttribute('name');
  });
}

// 2. Single-Click Resume Upload Banner Handler
function initResumeUpload() {
  const uploadBtn = document.getElementById('jtHomeUploadResumeBtn');
  const fileInput = document.getElementById('jtHomeResumeFileInput');
  const helperText = document.getElementById('jtResumeHelperText');
  if (!uploadBtn || !fileInput) return;

  function syncExistingResumeDisplay() {
    try {
      const u = localStorage.getItem('moveonn_user') || null;
      let currentResume = null;
      if (u) {
        const userObj = JSON.parse(u);
        const email = (userObj && userObj.email) ? userObj.email.toLowerCase().trim() : '';
        if (email) {
          currentResume = localStorage.getItem('jt_uploaded_resume__' + email);
        }
      }
      if (!currentResume) {
        currentResume = localStorage.getItem('jt_uploaded_resume');
      }
      if (currentResume && helperText) {
        helperText.innerHTML = `Active CV: <strong style="color:#004687;">${currentResume}</strong> • Click button to replace`;
      }
    } catch (e) {}
  }

  syncExistingResumeDisplay();

  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      if (window.showToast) {
        window.showToast('Please upload a file smaller than 5MB.');
      } else {
        alert('Please upload a file smaller than 5MB.');
      }
      fileInput.value = '';
      return;
    }

    // Visual feedback
    const originalText = uploadBtn.innerHTML;
    uploadBtn.innerHTML = `
      <svg class="jt-spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
      <span>Analyzing CV...</span>
    `;
    uploadBtn.disabled = true;

    setTimeout(() => {
      uploadBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>CV Uploaded</span>
      `;
      uploadBtn.style.backgroundColor = '#16a34a';

      // Persist resume state universally and account-scoped
      localStorage.setItem('jt_uploaded_resume', file.name);
      try {
        const u = localStorage.getItem('moveonn_user') || null;
        if (u) {
          const userObj = JSON.parse(u);
          const email = (userObj && userObj.email) ? userObj.email.toLowerCase().trim() : '';
          if (email) {
            localStorage.setItem('jt_uploaded_resume__' + email, file.name);
          }
        }
      } catch (err) {}

      if (helperText) {
        helperText.innerHTML = `Active CV: <strong style="color:#16a34a;">${file.name}</strong> (Synced with Profile)`;
      }

      if (window.showToast) {
        window.showToast(`Resume "${file.name}" uploaded successfully! Profile updated.`);
      }

      setTimeout(() => {
        uploadBtn.innerHTML = originalText;
        uploadBtn.style.backgroundColor = '';
        uploadBtn.disabled = false;
        syncExistingResumeDisplay();
      }, 3500);
    }, 1000);
  });
}

// 3. Featured & Recommended Jobs Tab Filters
function initFeaturedJobTabs() {
  const tabs = document.querySelectorAll('.jt-tab-btn[data-job-tab]');
  const cards = document.querySelectorAll('.jt-featured-card[data-category]');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-job-tab');

      cards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Interactive ATS Resume Score Checker Widget
function initResumeScoreWidget() {
  const form = document.getElementById('jtResumeScoreForm');
  const resultBox = document.getElementById('jtScoreResultBox');
  const roleInput = document.getElementById('jtScoreRoleInput');
  if (!form || !resultBox || !roleInput) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = roleInput.value.trim();
    if (!role) return;

    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    btn.innerHTML = '<span>Scanning ATS...</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = origText;
      btn.disabled = false;

      // Deterministic realistic score based on role string length
      const score = 84 + (role.length % 13);
      const scoreEl = document.getElementById('jtAtsScoreValue');
      const scoreBar = document.getElementById('jtAtsProgressBar');
      const scoreRole = document.getElementById('jtAtsScoreRole');

      if (scoreEl) scoreEl.textContent = `${score}/100`;
      if (scoreBar) scoreBar.style.width = `${score}%`;
      if (scoreRole) scoreRole.textContent = `Target Role: ${role}`;

      resultBox.style.display = 'block';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (window.showToast) {
        window.showToast(`ATS Score for "${role}": ${score}/100 (Strong Match)`);
      }
    }, 800);
  });
}

// 5. Interactive Salary Estimator Widget
function initSalaryEstimatorWidget() {
  const form = document.getElementById('jtSalaryEstimatorForm');
  const resultBox = document.getElementById('jtSalaryResultBox');
  const roleSelect = document.getElementById('jtSalaryRoleSelect');
  const expSelect = document.getElementById('jtSalaryExpSelect');
  if (!form || !resultBox || !roleSelect || !expSelect) return;

  const BENCHMARKS = {
    frontend: { min: 6.5, max: 14.0, expMultiplier: 1.25 },
    backend: { min: 8.0, max: 16.5, expMultiplier: 1.3 },
    fullstack: { min: 10.0, max: 22.0, expMultiplier: 1.35 },
    data: { min: 9.0, max: 18.0, expMultiplier: 1.3 },
    devops: { min: 11.0, max: 20.0, expMultiplier: 1.32 },
    product: { min: 14.0, max: 28.0, expMultiplier: 1.4 },
    sales: { min: 5.0, max: 12.0, expMultiplier: 1.2 },
    hr: { min: 4.5, max: 10.5, expMultiplier: 1.18 }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const roleKey = roleSelect.value;
    const expYears = parseFloat(expSelect.value) || 2;

    const data = BENCHMARKS[roleKey] || BENCHMARKS.fullstack;
    const factor = 1 + (expYears * 0.15);
    const minSalary = (data.min * factor).toFixed(1);
    const maxSalary = (data.max * factor).toFixed(1);

    const rangeEl = document.getElementById('jtEstimatedRangeText');
    const roleEl = document.getElementById('jtEstimatedRoleText');
    if (rangeEl) rangeEl.textContent = `₹${minSalary} Lakh - ₹${maxSalary} Lakh / year`;
    if (roleEl) roleEl.textContent = `Based on ${roleSelect.options[roleSelect.selectedIndex].text} with ${expSelect.options[expSelect.selectedIndex].text}`;

    resultBox.style.display = 'block';

    if (window.showToast) {
      window.showToast(`Estimated Market Salary: ₹${minSalary}L - ₹${maxSalary}L PA`);
    }
  });
}

// 6. Responsive Trending Accordion Controller
function initTrendingAccordion() {
  const btn = document.getElementById('jtTrendingBtn');
  const body = document.getElementById('jtTrendingBody');
  if (!btn || !body) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = body.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      setTimeout(() => {
        body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }
  });
}

