/* ==========================================================================
   Move ONN Consultancy - Dedicated Hire Page Controller (js/hire.js)
   Complies with PROJECT_STANDARDS.md - Pure Modular Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Post a Job Modal & Interactive Action Handlers
  initPostJobModal();

  // 2. FAQ Accordion Interaction
  const faqButtons = document.querySelectorAll('.css-rx3jok[data-radix-collection-item]');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const targetId = button.getAttribute('aria-controls');
      const targetPanel = targetId ? document.getElementById(targetId) : null;
      const parentContainer = button.closest('.css-hw6ea4');

      if (isExpanded) {
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('data-state', 'closed');
        if (targetPanel) {
          targetPanel.setAttribute('data-state', 'closed');
          targetPanel.style.display = 'none';
        }
        if (parentContainer) parentContainer.setAttribute('data-state', 'closed');
      } else {
        // Optional: close other open panels
        faqButtons.forEach(otherBtn => {
          if (otherBtn !== button) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherBtn.setAttribute('data-state', 'closed');
            const otherTargetId = otherBtn.getAttribute('aria-controls');
            const otherPanel = otherTargetId ? document.getElementById(otherTargetId) : null;
            if (otherPanel) {
              otherPanel.setAttribute('data-state', 'closed');
              otherPanel.style.display = 'none';
            }
            const otherParent = otherBtn.closest('.css-hw6ea4');
            if (otherParent) otherParent.setAttribute('data-state', 'closed');
          }
        });

        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('data-state', 'open');
        if (targetPanel) {
          targetPanel.setAttribute('data-state', 'open');
          targetPanel.style.display = 'block';
        }
        if (parentContainer) parentContainer.setAttribute('data-state', 'open');
      }
    });
  });

  // Ensure closed FAQ panels are hidden on load
  document.querySelectorAll('div[data-state="closed"][id^="radix-"]').forEach(panel => {
    panel.style.display = 'none';
  });

  // 3. Interactive Candidates Dashboard Tabs
  const dashTabs = document.querySelectorAll('.jt-dash-feature-item[data-dash-tab]');
  const badgeEl = document.getElementById('jtDashBadge');
  const countEl = document.getElementById('jtDashCount');
  const cardsContainer = document.getElementById('jtDashCardsContainer');

  const DASH_DATA = {
    manage: {
      badge: 'Live Candidate Pipeline',
      count: '2 New Matches',
      cardsHtml: `
        <div class="jt-dash-candidate-card">
          <div class="jt-dash-avatar">RV</div>
          <div class="jt-dash-info">
            <div class="jt-dash-name">Rajesh Verma <span class="jt-dash-match">98% Match</span></div>
            <div class="jt-dash-role">Senior Full Stack Engineer • Bangalore</div>
            <div class="jt-dash-skills">
              <span>Node.js</span>
              <span>React</span>
              <span>TypeScript</span>
              <span>AWS</span>
            </div>
          </div>
          <span class="jt-dash-status-pill status-new">New Applicant</span>
        </div>
        <div class="jt-dash-candidate-card">
          <div class="jt-dash-avatar">AS</div>
          <div class="jt-dash-info">
            <div class="jt-dash-name">Anamika Singh <span class="jt-dash-match">95% Match</span></div>
            <div class="jt-dash-role">Lead Product Designer • Remote</div>
            <div class="jt-dash-skills">
              <span>Figma</span>
              <span>Design Systems</span>
              <span>User Research</span>
            </div>
          </div>
          <span class="jt-dash-status-pill status-review">Under Review</span>
        </div>
      `
    },
    choose: {
      badge: 'Shortlisted & Assessments',
      count: '2 Candidates Shortlisted',
      cardsHtml: `
        <div class="jt-dash-candidate-card">
          <div class="jt-dash-avatar">VR</div>
          <div class="jt-dash-info">
            <div class="jt-dash-name">Vikramaditya Roy <span class="jt-dash-match">99% Match</span></div>
            <div class="jt-dash-role">Principal Cloud Architect • Mumbai • Score: 98/100</div>
            <div class="jt-dash-skills">
              <span>Kubernetes</span>
              <span>Go</span>
              <span>Terraform</span>
              <span>Kafka</span>
            </div>
          </div>
          <span class="jt-dash-status-pill status-shortlisted">Shortlisted</span>
        </div>
        <div class="jt-dash-candidate-card">
          <div class="jt-dash-avatar">PN</div>
          <div class="jt-dash-info">
            <div class="jt-dash-name">Priya Nambiar <span class="jt-dash-match">96% Match</span></div>
            <div class="jt-dash-role">Staff Product Manager • Hyderabad • Score: 95/100</div>
            <div class="jt-dash-skills">
              <span>Agile</span>
              <span>Product Analytics</span>
              <span>OKRs</span>
            </div>
          </div>
          <span class="jt-dash-status-pill status-shortlisted">Shortlisted</span>
        </div>
      `
    },
    interview: {
      badge: 'Live Interview Schedule',
      count: '2 Video Calls Ready',
      cardsHtml: `
        <div class="jt-dash-candidate-card">
          <div class="jt-dash-avatar">TM</div>
          <div class="jt-dash-info">
            <div class="jt-dash-name">Tanya Malhotra <span class="jt-dash-match">97% Match</span></div>
            <div class="jt-dash-role">Senior Data Scientist • Today 3:30 PM (IST)</div>
            <div class="jt-dash-skills">
              <span>Python</span>
              <span>PyTorch</span>
              <span>LLMs</span>
              <span>SQL</span>
            </div>
          </div>
          <span class="jt-dash-status-pill status-interview">Interview Scheduled</span>
        </div>
        <div class="jt-dash-candidate-card">
          <div class="jt-dash-avatar">AS</div>
          <div class="jt-dash-info">
            <div class="jt-dash-name">Arjun Sethi <span class="jt-dash-match">94% Match</span></div>
            <div class="jt-dash-role">Frontend Architect • Tomorrow 11:00 AM (IST)</div>
            <div class="jt-dash-skills">
              <span>React</span>
              <span>Next.js</span>
              <span>Performance</span>
            </div>
          </div>
          <span class="jt-dash-status-pill status-interview">Interview Scheduled</span>
        </div>
      `
    }
  };

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabKey = tab.getAttribute('data-dash-tab');
      if (!tabKey || !DASH_DATA[tabKey]) return;

      dashTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (cardsContainer) {
        cardsContainer.style.opacity = '0';
        setTimeout(() => {
          if (badgeEl) badgeEl.textContent = DASH_DATA[tabKey].badge;
          if (countEl) countEl.textContent = DASH_DATA[tabKey].count;
          cardsContainer.innerHTML = DASH_DATA[tabKey].cardsHtml;
          cardsContainer.style.opacity = '1';
          if (typeof window.applyTranslations === 'function') {
            const currentLang = localStorage.getItem('jt_lang') || 'en';
            window.applyTranslations(currentLang);
          }
        }, 150);
      }
    });
  });

  // 4. Candidate Database Search Bar Handler
  const empSearchForm = document.getElementById('jtEmpResumeSearchForm');
  const searchResultsBox = document.getElementById('jtEmpSearchResults');
  if (empSearchForm && searchResultsBox) {
    empSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = document.getElementById('jtEmpSearchRole')?.value.trim() || 'Software Engineer';
      const loc = document.getElementById('jtEmpSearchLoc')?.value.trim() || 'India';

      searchResultsBox.style.display = 'block';
      searchResultsBox.innerHTML = `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <span style="font-size:13.5px; font-weight:700; color:#0f172a;">Found 3,420+ Verified Candidates matching "${role}" in ${loc}</span>
            <span style="font-size:12px; color:#16a34a; font-weight:700; background:#eaf8ee; padding:2px 8px; border-radius:4px;">Live Talent Pool</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:12px;">
            <div style="padding:12px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
              <div style="font-weight:700; font-size:14px; color:#0f172a;">Verified Candidate #49281</div>
              <div style="font-size:12.5px; color:#64748b;">${role} • 4 Yrs Exp • ${loc}</div>
              <div style="margin-top:8px; font-size:11.5px; color:#16a34a; font-weight:600;">97% Skills Match • Immediate Joiner</div>
            </div>
            <div style="padding:12px; background:#f8fafc; border-radius:10px; border:1px solid #e2e8f0;">
              <div style="font-weight:700; font-size:14px; color:#0f172a;">Verified Candidate #31084</div>
              <div style="font-size:12.5px; color:#64748b;">Lead ${role} • 7 Yrs Exp • ${loc}</div>
              <div style="margin-top:8px; font-size:11.5px; color:#16a34a; font-weight:600;">95% Skills Match • 15 Days Notice</div>
            </div>
          </div>
        </div>
      `;

      if (window.showToast) {
        window.showToast(`Found 3,420+ active verified candidates matching "${role}".`);
      }
    });
  }

  // 5. Interactive Hiring Calculator & ROI Estimator
  const roleSelect = document.getElementById('jtCalcRoleSelect');
  const countRange = document.getElementById('jtCalcHeadcountRange');
  const countDisplay = document.getElementById('jtCalcHeadcountDisplay');
  const timeResult = document.getElementById('jtCalcTimeResult');
  const costResult = document.getElementById('jtCalcCostResult');
  const poolResult = document.getElementById('jtCalcPoolResult');
  const presetChips = document.querySelectorAll('.jt-preset-chip');

  const ROLE_SAVINGS = {
    software: { savings: 115000, daysMin: 8, daysMax: 14, poolBase: 4350 },
    sales: { savings: 85000, daysMin: 6, daysMax: 10, poolBase: 3200 },
    data: { savings: 125000, daysMin: 9, daysMax: 15, poolBase: 2800 },
    product: { savings: 140000, daysMin: 10, daysMax: 16, poolBase: 1950 },
    operations: { savings: 65000, daysMin: 5, daysMax: 8, poolBase: 5100 }
  };

  function updateCalculator() {
    if (!countRange || !countDisplay) return;
    const count = parseInt(countRange.value, 10) || 1;
    countDisplay.textContent = count === 1 ? '1 Hire' : `${count} Hires`;

    const selectedRole = roleSelect ? roleSelect.value : 'software';
    const config = ROLE_SAVINGS[selectedRole] || ROLE_SAVINGS.software;

    const totalSavings = count * config.savings;
    if (costResult) {
      costResult.textContent = `₹${totalSavings.toLocaleString('en-IN')}`;
    }

    if (timeResult) {
      const daysMin = Math.max(5, Math.round(config.daysMin + (count * 0.4)));
      const daysMax = Math.max(9, Math.round(config.daysMax + (count * 0.5)));
      timeResult.textContent = `${daysMin} - ${daysMax} Days`;
    }

    if (poolResult) {
      const poolTotal = Math.round(config.poolBase + (count * 180));
      poolResult.textContent = `${poolTotal.toLocaleString('en-IN')}+ Active`;
    }

    // Sync active state on preset chips
    presetChips.forEach(chip => {
      const chipCount = parseInt(chip.getAttribute('data-count'), 10);
      if (chipCount === count) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // Handle Preset Chips Click
  presetChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const count = parseInt(chip.getAttribute('data-count'), 10);
      if (count && countRange) {
        countRange.value = count;
        updateCalculator();
      }
    });
  });

  if (countRange) {
    countRange.addEventListener('input', updateCalculator);
  }
  if (roleSelect) {
    roleSelect.addEventListener('change', updateCalculator);
  }

  // Initialize calculator on page load
  updateCalculator();
});

// Candidate Profile Modal Preview (Permanently neutralized per client video instructions)
window.previewCandidateProfile = function() {
  // Candidate buttons on hire.html are static informational cards and do not trigger popups/toasts
};

// 6. Employer Job Posting Modal Engine
function initPostJobModal() {
  let savedScrollY = 0;
  function lockBackgroundScroll() {
    savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    document.documentElement.classList.add('jt-modal-open');
    document.body.classList.add('jt-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockBackgroundScroll(skipRestore) {
    const modals = [
      document.getElementById('jtPostJobModalBackdrop'),
      document.getElementById('jtSmartSourcingModalBackdrop'),
      document.getElementById('jtEmployerHelpModalBackdrop'),
      document.getElementById('jtEmployerResourceModalBackdrop')
    ];
    let hasOpen = false;
    modals.forEach(m => {
      if (m && (m.style.display === 'flex' || m.style.display === 'block')) hasOpen = true;
    });
    if (!hasOpen) {
      document.documentElement.classList.remove('jt-modal-open');
      document.body.classList.remove('jt-modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (!skipRestore) {
        window.scrollTo(0, savedScrollY);
      }
    }
  }

  function setupBackdropScrollLock(backdrop) {
    if (!backdrop) return;
    backdrop.addEventListener('wheel', (e) => {
      if (e.target === backdrop) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
    backdrop.addEventListener('touchmove', (e) => {
      if (e.target === backdrop) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
  }

  function preventModalScrollChaining(modalCard) {
    if (!modalCard) return;
    modalCard.addEventListener('wheel', (e) => {
      const isAtTop = modalCard.scrollTop <= 0;
      const isAtBottom = modalCard.scrollTop + modalCard.clientHeight >= modalCard.scrollHeight - 1;
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // --- 1. Post a Job Modal ---
  const postJobBackdrop = document.getElementById('jtPostJobModalBackdrop');
  const postJobCloseBtn = document.getElementById('jtPostJobCloseBtn');
  const postJobCancelBtn = document.getElementById('jtPostJobCancelBtn');
  const postJobForm = document.getElementById('jtPostJobForm');
  const postJobSubmitBtn = document.getElementById('jtPostJobSubmitBtn');

  function openPostJobModal() {
    if (!postJobBackdrop) return;
    postJobBackdrop.style.display = 'flex';
    postJobBackdrop.setAttribute('aria-hidden', 'false');
    lockBackgroundScroll();
    const firstInput = document.getElementById('jtJobTitleInput');
    if (firstInput) setTimeout(() => firstInput.focus(), 80);
  }

  function closePostJobModal() {
    if (!postJobBackdrop) return;
    postJobBackdrop.style.display = 'none';
    postJobBackdrop.setAttribute('aria-hidden', 'true');
    unlockBackgroundScroll();
  }

  window.openPostJobModal = openPostJobModal;
  window.closePostJobModal = closePostJobModal;

  // STRICTLY Wire ONLY Post a Job buttons
  const postJobButtons = document.querySelectorAll(
    '[data-action="open-post-job-modal"], [data-tn-element="webxHireHeroPostJobButton"], [data-tn-element="webxEmployerLowerCtaPostJobButton"]'
  );
  postJobButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = 'employer-dashboard.html';
    });
  });

  if (postJobCloseBtn) postJobCloseBtn.addEventListener('click', closePostJobModal);
  if (postJobCancelBtn) postJobCancelBtn.addEventListener('click', closePostJobModal);
  if (postJobBackdrop) {
    setupBackdropScrollLock(postJobBackdrop);
    postJobBackdrop.addEventListener('click', (e) => {
      if (e.target === postJobBackdrop) closePostJobModal();
    });
  }

  if (postJobForm) {
    postJobForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('jtJobTitleInput')?.value.trim();
      const company = document.getElementById('jtJobCompanyInput')?.value.trim();
      const loc = document.getElementById('jtJobLocationInput')?.value.trim();
      const exp = document.getElementById('jtJobExpSelect')?.value;
      const salary = document.getElementById('jtJobSalaryInput')?.value.trim() || 'Competitive Pay';
      const skills = document.getElementById('jtJobSkillsInput')?.value.trim();
      const desc = document.getElementById('jtJobDescTextarea')?.value.trim();

      if (!title || !company || !loc) return;

      const origBtnHtml = postJobSubmitBtn ? postJobSubmitBtn.innerHTML : '';
      if (postJobSubmitBtn) {
        postJobSubmitBtn.innerHTML = `
          <svg class="jt-spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <span>Publishing...</span>
        `;
        postJobSubmitBtn.disabled = true;
      }

      setTimeout(() => {
        try {
          const stored = JSON.parse(localStorage.getItem('jt_employer_posted_jobs') || '[]');
          stored.unshift({
            id: Date.now(),
            title,
            company,
            location: loc,
            experience: exp,
            salary,
            skills,
            description: desc,
            postedAt: new Date().toISOString()
          });
          localStorage.setItem('jt_employer_posted_jobs', JSON.stringify(stored));
        } catch (err) {}

        if (postJobSubmitBtn) {
          postJobSubmitBtn.innerHTML = origBtnHtml;
          postJobSubmitBtn.disabled = false;
        }

        closePostJobModal();
        postJobForm.reset();

        if (window.showToast) {
          window.showToast(`Job "${title}" published successfully! Active across talent searches.`);
        }
      }, 700);
    });
  }

  // --- 2. Smart Sourcing Modal ---
  const smartBackdrop = document.getElementById('jtSmartSourcingModalBackdrop');
  const smartCloseBtn = document.getElementById('jtSmartSourcingCloseBtn');
  const smartCancelBtn = document.getElementById('jtSmartSourcingCancelBtn');
  const smartSearchBtn = document.getElementById('jtSmartSourcingSearchBtn');
  const smartOpenBtn = document.getElementById('jtSmartSourcingBtn');

  function openSmartSourcingModal() {
    if (!smartBackdrop) return;
    smartBackdrop.style.display = 'flex';
    smartBackdrop.setAttribute('aria-hidden', 'false');
    lockBackgroundScroll();
  }

  function closeSmartSourcingModal(skipRestore) {
    if (!smartBackdrop) return;
    smartBackdrop.style.display = 'none';
    smartBackdrop.setAttribute('aria-hidden', 'true');
    unlockBackgroundScroll(skipRestore);
  }

  window.openSmartSourcingModal = openSmartSourcingModal;
  window.closeSmartSourcingModal = closeSmartSourcingModal;

  if (smartOpenBtn) {
    smartOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openSmartSourcingModal();
    });
  }
  if (smartCloseBtn) smartCloseBtn.addEventListener('click', closeSmartSourcingModal);
  if (smartCancelBtn) smartCancelBtn.addEventListener('click', closeSmartSourcingModal);
  if (smartBackdrop) {
    setupBackdropScrollLock(smartBackdrop);
    smartBackdrop.addEventListener('click', (e) => {
      if (e.target === smartBackdrop) closeSmartSourcingModal();
    });
  }
  if (smartSearchBtn) {
    smartSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSmartSourcingModal(true);
      setTimeout(() => {
        const searchSec = document.getElementById('empResumeSearchSection');
        if (searchSec) {
          searchSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const input = document.getElementById('jtEmpSearchRole');
          if (input) setTimeout(() => input.focus(), 350);
        }
      }, 60);
    });
  }

  // --- 3. Employer Help Centre Modal ---
  const helpBackdrop = document.getElementById('jtEmployerHelpModalBackdrop');
  const helpCloseBtn = document.getElementById('jtEmployerHelpCloseBtn');
  const helpCancelBtn = document.getElementById('jtEmployerHelpCancelBtn');
  const helpFaqBtn = document.getElementById('jtEmployerHelpFaqBtn');
  const helpOpenBtn = document.getElementById('jtEmployerHelpCenterBtn');

  function openEmployerHelpModal() {
    if (!helpBackdrop) return;
    helpBackdrop.style.display = 'flex';
    helpBackdrop.setAttribute('aria-hidden', 'false');
    lockBackgroundScroll();
  }

  function closeEmployerHelpModal(skipRestore) {
    if (!helpBackdrop) return;
    helpBackdrop.style.display = 'none';
    helpBackdrop.setAttribute('aria-hidden', 'true');
    unlockBackgroundScroll(skipRestore);
  }

  window.openEmployerHelpModal = openEmployerHelpModal;
  window.closeEmployerHelpModal = closeEmployerHelpModal;

  if (helpOpenBtn) {
    helpOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEmployerHelpModal();
    });
  }
  if (helpCloseBtn) helpCloseBtn.addEventListener('click', closeEmployerHelpModal);
  if (helpCancelBtn) helpCancelBtn.addEventListener('click', closeEmployerHelpModal);
  if (helpBackdrop) {
    setupBackdropScrollLock(helpBackdrop);
    helpBackdrop.addEventListener('click', (e) => {
      if (e.target === helpBackdrop) closeEmployerHelpModal();
    });
  }
  if (helpFaqBtn) {
    helpFaqBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeEmployerHelpModal(true);
      setTimeout(() => {
        const faqSec = document.getElementById('empFaqSection') || document.querySelector('.css-hxyl4h') || document.querySelector('[data-radix-collection-item]');
        if (faqSec) {
          faqSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Open the first FAQ item for immediate candidate/recruiter answer
          const firstFaqBtn = document.getElementById('radix-_R_btn_1dal6ktal5fivdb_');
          if (firstFaqBtn && firstFaqBtn.getAttribute('aria-expanded') !== 'true') {
            firstFaqBtn.click();
          }
        }
      }, 60);
    });
  }

  // --- 4. Employer Resource Library Modal ---
  const resBackdrop = document.getElementById('jtEmployerResourceModalBackdrop');
  const resCloseBtn = document.getElementById('jtEmployerResourceCloseBtn');
  const resCancelBtn = document.getElementById('jtEmployerResourceCancelBtn');
  const resDownloadBtn = document.getElementById('jtDownloadResourcePackBtn');
  const resOpenBtn = document.getElementById('jtEmployerResourceLibBtn');

  function openEmployerResourceModal() {
    if (!resBackdrop) return;
    resBackdrop.style.display = 'flex';
    resBackdrop.setAttribute('aria-hidden', 'false');
    lockBackgroundScroll();
  }

  function closeEmployerResourceModal() {
    if (!resBackdrop) return;
    resBackdrop.style.display = 'none';
    resBackdrop.setAttribute('aria-hidden', 'true');
    unlockBackgroundScroll();
  }

  window.openEmployerResourceModal = openEmployerResourceModal;
  window.closeEmployerResourceModal = closeEmployerResourceModal;

  if (resOpenBtn) {
    resOpenBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openEmployerResourceModal();
    });
  }
  if (resCloseBtn) resCloseBtn.addEventListener('click', closeEmployerResourceModal);
  if (resCancelBtn) resCancelBtn.addEventListener('click', closeEmployerResourceModal);
  if (resBackdrop) {
    setupBackdropScrollLock(resBackdrop);
    resBackdrop.addEventListener('click', (e) => {
      if (e.target === resBackdrop) closeEmployerResourceModal();
    });
  }
  if (resDownloadBtn) {
    resDownloadBtn.addEventListener('click', () => {
      if (window.showToast) {
        window.showToast('Downloading "MoveONN_Recruiter_Hiring_Playbook_2026.pdf"...');
      }
      setTimeout(() => {
        closeEmployerResourceModal();
      }, 1000);
    });
  }

  // Prevent scroll chaining on each modal card
  preventModalScrollChaining(document.querySelector('#jtPostJobModalBackdrop .jt-post-job-modal'));
  preventModalScrollChaining(document.querySelector('#jtSmartSourcingModalBackdrop .jt-smart-sourcing-modal'));
  preventModalScrollChaining(document.querySelector('#jtEmployerHelpModalBackdrop .jt-employer-help-modal'));
  preventModalScrollChaining(document.querySelector('#jtEmployerResourceModalBackdrop .jt-employer-resources-modal'));

  // Universal wheel & touchmove dampening for jt-modal-open
  window.addEventListener('wheel', (e) => {
    if (document.body.classList.contains('jt-modal-open')) {
      const scrollable = e.target.closest(
        '.jt-post-job-modal, .jt-smart-sourcing-modal, .jt-employer-help-modal, .jt-employer-resources-modal'
      );
      if (!scrollable) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  window.addEventListener('touchmove', (e) => {
    if (document.body.classList.contains('jt-modal-open')) {
      if (e.target.classList && (e.target.classList.contains('jt-post-job-modal-backdrop') || e.target.classList.contains('jt-smart-sourcing-modal-backdrop') || e.target.classList.contains('jt-employer-help-modal-backdrop') || e.target.classList.contains('jt-employer-resources-modal-backdrop'))) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // Universal Escape key listener for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePostJobModal();
      closeSmartSourcingModal();
      closeEmployerHelpModal();
      closeEmployerResourceModal();
    }
  });
}


