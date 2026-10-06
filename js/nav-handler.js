// Move ONN Production Client Controller & Universal Router
// Eliminates all external redirects, provides 100% offline reliability, and empowers all interactive flows.

(function() {
  'use strict';

  // ==========================================
  // 0. MOVE ONN BULLETPROOF LOGO ENFORCER
  // ==========================================
  function enforceMoveOnnBranding() {
    // 1. Header logo
    const headerLogos = document.querySelectorAll('#moveonn-globalnav-logo, [data-gnav-element-name="Logo"], a.gnav-Logo, .gnav-Logo-icon');
    headerLogos.forEach(el => {
      const anchor = el.closest('a') || el;
      if (anchor.tagName === 'A') {
        anchor.setAttribute('href', 'index.html');
        anchor.setAttribute('aria-label', 'Move ONN Home');
      }
      const iconContainer = el.classList.contains('gnav-Logo-icon') ? el : el.querySelector('.gnav-Logo-icon');
      if (iconContainer) {
        if (!iconContainer.querySelector('img[src*="moveonn-logo"]')) {
          iconContainer.innerHTML = '<img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:50px; width:auto; max-height:54px; display:inline-block; vertical-align:middle; object-fit:contain;">';
        }
      } else if (!el.querySelector('img[src*="moveonn-logo"]')) {
        el.innerHTML = '<div class="gnav-Logo-icon" style="display:inline-flex; align-items:center;"><img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:50px; width:auto; max-height:54px; display:inline-block; vertical-align:middle; object-fit:contain;"></div>';
      }
    });

    // 2. Employer header logo in hire.html
    const employerLogos = document.querySelectorAll('[data-testid="Move ONNLogoEmployerMegaMenu"]');
    employerLogos.forEach(svg => {
      svg.outerHTML = '<a href="index.html" aria-label="Move ONN Home" style="display:inline-flex; align-items:center; text-decoration:none;"><img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:50px; width:auto; display:inline-block; vertical-align:middle; object-fit:contain;"></a>';
    });

    // 3. Homepage Center Hero Logo
    const centerHeroes = document.querySelectorAll('[data-testid="account-focused-homepage"] .css-p4zop2, .css-p4zop2');
    centerHeroes.forEach(ch => {
      const svgs = ch.querySelectorAll('svg');
      svgs.forEach(s => s.remove());
      if (!ch.querySelector('img.moveonn-hero-brand-img')) {
        ch.innerHTML = '<img src="assets/images/moveonn-logo.png" alt="Move ONN" class="moveonn-hero-brand-img" style="width:160px; max-width:160px; height:auto; display:block; margin:0 auto 16px; object-fit:contain;">';
      }
    });

    // 4. Sign-in Branding Card Logo
    const brandingContainers = document.querySelectorAll('#branding');
    brandingContainers.forEach(b => {
      if (!b.querySelector('img[src*="moveonn-logo"]')) {
        b.innerHTML = '<a href="index.html" aria-label="Move ONN Home" style="display:inline-flex; align-items:center; text-decoration:none;"><img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:65px; width:auto; display:block; margin:0 auto; object-fit:contain;"></a>';
      }
    });

    // 5. Any leftover Move ONN SVG with aurora
    const auroraSvgs = document.querySelectorAll('[data-testid="logo-aurora"]');
    auroraSvgs.forEach(s => {
      const parent = s.parentElement;
      if (parent) {
        parent.innerHTML = '<img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:50px; width:auto; max-height:54px; display:inline-block; vertical-align:middle; object-fit:contain;">';
      }
    });

    // 6. Preloaders
    const preloaders = document.querySelectorAll('#splash, .splash-screen, svg[id="preloader"]');
    preloaders.forEach(p => {
      const prev = p.previousElementSibling;
      if (prev && prev.tagName === 'SVG' && !prev.querySelector('img')) {
        prev.outerHTML = '<img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:60px; width:auto; display:block; margin:0 auto 16px;">';
      }
    });
  }

  // Safe debounced branding enforcer
  let isEnforcingBranding = false;
  
  window.toggleTrendingAccordion = function() {
    const body = document.getElementById('moveonnTrendingBody');
    const chevron = document.getElementById('trendingChevron');
    const btn = document.getElementById('btnTrendingAccordion');
    if (!body) return;
    const isHidden = window.getComputedStyle(body).display === 'none' || body.style.display === 'none';
    if (isHidden) {
      body.style.setProperty('display', 'block', 'important');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
      body.style.setProperty('display', 'none', 'important');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  };

  function enforceMove ONNTrending() {
    const path = (window.location && window.location.pathname) ? window.location.pathname.toLowerCase() : '';
    const isHome = path.endsWith('index.html') || path === '/' || path.endsWith('/') || path.endsWith('\\index.html') || path === '' || !path.includes('.html');

    // PURGE FROM NON-HOME PAGES (salaries.html, companies.html, etc.)
    if (!isHome) {
      if (document.body) document.body.classList.remove('homepage');
      const existingSection = document.getElementById('moveonnTrendingSection');
      if (existingSection) existingSection.remove();
      const existingBtn = document.getElementById('btnTrendingAccordion');
      if (existingBtn) existingBtn.remove();
      const existingBody = document.getElementById('moveonnTrendingBody');
      if (existingBody) existingBody.remove();
      return;
    }

    if (document.body) document.body.classList.add('homepage');

    const Move ONNBody = document.getElementById('_r_1_-body');
    if (Move ONNBody) Move ONNBody.style.setProperty('display', 'none', 'important');

    // Hide Move ONN's React accordion button and React accordion containers
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
      if (btn.id === 'btnTrendingAccordion') return;
      const text = (btn.textContent || '').trim().toLowerCase();
      if (text.includes('trending on Move ONN') || btn.classList.contains('css-yaskgp')) {
        btn.style.setProperty('display', 'none', 'important');
        const parentAccordion = btn.closest('[data-testid*="accordion"], div[class*="css-"]');
        if (parentAccordion && parentAccordion.id !== 'moveonnTrendingSection') {
          parentAccordion.style.setProperty('display', 'none', 'important');
        }
      }
    });

    // Also hide Move ONN's default trending link container if React mounted it
    document.querySelectorAll('[data-testid="jobsearch-PromoContainer"] ~ div').forEach(div => {
      if (div.id !== 'moveonnTrendingSection' && div.id !== '_r_1_-body') {
        const text = div.textContent || '';
        if (text.includes('Trending Searches') || text.includes('Trending Jobs') || text.includes('sun pharma')) {
          div.style.setProperty('display', 'none', 'important');
        }
      }
    });

    // Ensure Move ONN Trending Section exists on homepage right before the footer
    let moveonnTrending = document.getElementById('moveonnTrendingSection');
    if (!moveonnTrending) {
      const footer = document.querySelector('.jobsearch-Footer') || document.querySelector('footer') || document.getElementById('gnav-footer-container');
      const main = document.getElementById('jobsearch-Main');
      moveonnTrending = document.createElement('div');
      moveonnTrending.id = 'moveonnTrendingSection';
      moveonnTrending.style.cssText = 'width: 100%; max-width: 1200px; margin: 32px auto; padding: 0 16px; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;';
      
      moveonnTrending.innerHTML = getTrendingSectionInnerHtml();

      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(moveonnTrending, footer);
      } else if (main && main.parentNode) {
        main.parentNode.insertBefore(moveonnTrending, main.nextSibling);
      } else {
        document.body.appendChild(moveonnTrending);
      }
    } else {
      // Ensure button and grid are up to date
      const btn = moveonnTrending.querySelector('#btnTrendingAccordion');
      if (btn) btn.style.borderRadius = '9999px';
      const body = moveonnTrending.querySelector('#moveonnTrendingBody');
      if (body && !body.querySelector('.moveonn-trending-grid')) {
        moveonnTrending.innerHTML = getTrendingSectionInnerHtml();
      }
    }
  }

  function getTrendingSectionInnerHtml() {
    return `
      <div style="text-align: center; margin-bottom: 14px;">
        <button type="button" id="btnTrendingAccordion" onclick="window.toggleTrendingAccordion()" aria-controls="moveonnTrendingBody" aria-expanded="false" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; background:#ffffff; border:1px solid #d4d2d0; color:#2d2d2d; font-size:15px; font-weight:600; cursor:pointer; padding:10px 24px; border-radius:9999px; box-shadow:0 1px 3px rgba(0,0,0,0.06); transition:all 0.2s ease;">
          <span>What's trending on Move ONN</span>
          <svg id="trendingChevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transition:transform 0.25s ease;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>

      <div id="moveonnTrendingBody" style="display: none; background: #ffffff; border: 1px solid #e4e2e0; border-radius: 16px; padding: 28px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); margin-top: 14px; width: 100%; box-sizing: border-box;">
        <div class="moveonn-trending-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; width: 100%; box-sizing: border-box;">
          <!-- Column 1: Popular Tech Roles (10 items) -->
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #121224; margin: 0 0 16px; border-bottom: 2px solid #1264e8; padding-bottom: 8px; display: inline-block;">Popular Tech Roles</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px;">
              <li><a href="jobs.html?q=Full+Stack+Developer" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Full Stack Developer</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">450+ Jobs</span></a></li>
              <li><a href="jobs.html?q=React+Frontend+Engineer" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>React Frontend Engineer</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">320+ Jobs</span></a></li>
              <li><a href="jobs.html?q=Python+Data+Engineer" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Python Data Engineer</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">280+ Jobs</span></a></li>
              <li><a href="jobs.html?q=Java+Backend+Architect" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Java Backend Architect</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">190+ Jobs</span></a></li>
              <li><a href="jobs.html?q=AI+Machine+Learning" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>AI & Machine Learning</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">140+ Jobs</span></a></li>
              <li><a href="jobs.html?q=DevOps+Cloud" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>DevOps & Cloud Engineer</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">210+ Jobs</span></a></li>
              <li><a href="jobs.html?q=Mobile+App+Developer" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Mobile App Developer (iOS/Android)</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">165+ Jobs</span></a></li>
              <li><a href="jobs.html?q=Data+Analyst" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Data Analyst & Power BI</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">230+ Jobs</span></a></li>
              <li><a href="jobs.html?q=Cyber+Security" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Cyber Security Specialist</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">120+ Jobs</span></a></li>
              <li><a href="jobs.html?q=QA+Automation" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>QA Automation Engineer</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">175+ Jobs</span></a></li>
            </ul>
          </div>

          <!-- Column 2: Top Companies Hiring (10 items) -->
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #121224; margin: 0 0 16px; border-bottom: 2px solid #1264e8; padding-bottom: 8px; display: inline-block;">Top Companies Hiring</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px;">
              <li><a href="jobs.html?q=Apex+Consultancy" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Apex Consultancy Solutions</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.8</span></a></li>
              <li><a href="jobs.html?q=Tata+Consultancy+Services" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Tata Consultancy Services (TCS)</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.2</span></a></li>
              <li><a href="jobs.html?q=Infosys" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Infosys Technologies</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.1</span></a></li>
              <li><a href="jobs.html?q=Wipro" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Wipro Enterprises</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.0</span></a></li>
              <li><a href="jobs.html?q=Google" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Google India</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.7</span></a></li>
              <li><a href="jobs.html?q=Microsoft" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Microsoft India</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.6</span></a></li>
              <li><a href="jobs.html?q=Amazon" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Amazon Development Centre</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.3</span></a></li>
              <li><a href="jobs.html?q=Accenture" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Accenture Solutions</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.2</span></a></li>
              <li><a href="jobs.html?q=HCL" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>HCLTech India</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 4.0</span></a></li>
              <li><a href="jobs.html?q=Tech+Mahindra" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Tech Mahindra Ltd</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">★ 3.9</span></a></li>
            </ul>
          </div>

          <!-- Column 3: Popular Cities (10 items) -->
          <div>
            <h3 style="font-size: 16px; font-weight: 700; color: #121224; margin: 0 0 16px; border-bottom: 2px solid #1264e8; padding-bottom: 8px; display: inline-block;">Popular Job Locations</h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 9px;">
              <li><a href="jobs.html?l=Patna" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Patna / Bihar</span><span style="font-size: 11px; color: #1264e8; background: #eaf1ff; padding: 2px 7px; border-radius: 12px; font-weight: 600;">Local & Remote</span></a></li>
              <li><a href="jobs.html?l=Bengaluru" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Bengaluru (Silicon Valley)</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">1,200+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Hyderabad" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Hyderabad (HITEC City)</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">850+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Pune" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Pune (Hinjewadi)</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">620+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Noida" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Delhi / NCR (Noida & Gurugram)</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">980+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Mumbai" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Mumbai & Navi Mumbai</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">750+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Chennai" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Chennai (OMR Corridor)</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">540+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Kolkata" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Kolkata (Salt Lake Sector V)</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">390+ Jobs</span></a></li>
              <li><a href="jobs.html?l=Ahmedabad" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Ahmedabad / GIFT City</span><span style="font-size: 11px; color: #717b9e; background: #f0f3f6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">310+ Jobs</span></a></li>
              <li><a href="jobs.html?q=Remote" class="trending-link" style="color: #474d6a; font-size: 13px; text-decoration: none; display: flex; align-items: center; justify-content: space-between; padding: 4px 0;"><span>Work From Home / 100% Remote</span><span style="font-size: 11px; color: #1f662c; background: #e4f7e6; padding: 2px 7px; border-radius: 12px; font-weight: 600;">Pan-India</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  function safeEnforceBranding() {

    const userLoggedIn = getLoggedInUser();
    if (userLoggedIn) {
      document.body.classList.add('user-logged-in');
      document.body.classList.remove('user-logged-out');
      const heros = document.querySelectorAll('[data-testid="account-focused-homepage"], .css-14v6npv, .css-p4zop2, button.css-1yxihf5');
      heros.forEach(h => {
        h.style.setProperty('display', 'none', 'important');
        h.style.setProperty('height', '0', 'important');
        h.style.setProperty('visibility', 'hidden', 'important');
        h.style.setProperty('overflow', 'hidden', 'important');
      });
      const injectedFeed = document.getElementById('injected-signed-in-feed-container');
      if (injectedFeed) injectedFeed.style.display = 'block';
    } else {
      document.body.classList.remove('user-logged-in');
      document.body.classList.add('user-logged-out');
      const heros = document.querySelectorAll('[data-testid="account-focused-homepage"], .css-14v6npv, .css-p4zop2, button.css-1yxihf5, .css-1gv3d3g, .css-4e46g6, .css-kousv8');
      heros.forEach(h => {
        h.style.removeProperty('display');
        h.style.removeProperty('height');
        h.style.removeProperty('visibility');
        h.style.removeProperty('overflow');
        h.style.removeProperty('min-height');
        h.style.removeProperty('max-height');
        h.style.removeProperty('opacity');
        h.style.removeProperty('pointer-events');
      });
      const p4zop2 = document.querySelector('.css-p4zop2');
      if (p4zop2) {
        p4zop2.style.setProperty('display', 'flex', 'important');
        p4zop2.style.setProperty('visibility', 'visible', 'important');
        p4zop2.style.setProperty('height', 'auto', 'important');
        let img = p4zop2.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          img.src = 'assets/images/moveonn-logo.png';
          img.alt = 'Move ONN';
          img.className = 'moveonn-hero-brand-img';
          img.style.cssText = 'width:160px; max-width:160px; height:auto; display:block; margin:0 auto 16px; object-fit:contain;';
          p4zop2.prepend(img);
        } else {
          img.style.setProperty('display', 'block', 'important');
          img.style.setProperty('visibility', 'visible', 'important');
          img.style.setProperty('width', '160px', 'important');
          img.style.setProperty('max-width', '160px', 'important');
          img.style.setProperty('margin', '0 auto 16px', 'important');
        }
      }
      const injectedFeed = document.getElementById('injected-signed-in-feed-container');
      if (injectedFeed) injectedFeed.remove();
    }

    try { enforceMove ONNTrending(); } catch(err) {}
    if (isEnforcingBranding) return;
    isEnforcingBranding = true;
    try {
      enforceMoveOnnBranding();
    } finally {
      setTimeout(() => { isEnforcingBranding = false; }, 60);
    }
  }

  // Execute on DOM ready and continuously observe async React hydration
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', safeEnforceBranding);
    } else {
      safeEnforceBranding();
    }
    window.addEventListener('load', safeEnforceBranding);

    if (typeof MutationObserver !== 'undefined') {
      const brandObserver = new MutationObserver(() => {
        safeEnforceBranding();
      });
      // Start observing once body is available
      const initObserver = () => {
        if (document.body) {
          brandObserver.observe(document.body, { childList: true, subtree: true });
        } else {
          setTimeout(initObserver, 50);
        }
      };
      initObserver();
    }
  }


  // ==========================================
  // 1. OFFLINE NETWORK SHIELD (Prevents Hangs)
  // ==========================================
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
      const urlStr = String(url || '');
      if (urlStr.includes('Move ONN.com') || urlStr.includes('gtm') || urlStr.includes('optimizely') || urlStr.includes('datadog')) {
        return Promise.resolve(new Response(JSON.stringify({ status: 'ok', mock: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      return originalFetch ? originalFetch.apply(this, arguments) : Promise.resolve(new Response('{}', { status: 200 }));
    };

    if (window.XMLHttpRequest) {
      const origOpen = XMLHttpRequest.prototype.open;
      const origSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url) {
        this._isMove ONNExt = String(url || '').includes('Move ONN.com') || String(url || '').includes('gtm');
        return origOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function() {
        if (this._isMove ONNExt) {
          Object.defineProperty(this, 'readyState', { value: 4, writable: true });
          Object.defineProperty(this, 'status', { value: 200, writable: true });
          Object.defineProperty(this, 'responseText', { value: '{"status":"ok"}', writable: true });
          if (typeof this.onreadystatechange === 'function') this.onreadystatechange();
          if (typeof this.onload === 'function') this.onload();
          return;
        }
        return origSend.apply(this, arguments);
      };
    }
  }

  
  function wireHeaderNavigationLinks() {
    // Clean any stray onclick="return false;" from all nav anchors
    document.querySelectorAll('a#FindJobs, a#NavJobs, a#CompanyReviews, a#FindSalaries, .gnav-header-gy7zil, .nav-links a').forEach(a => {
      if (a.getAttribute('onclick') === 'return false;') {
        a.removeAttribute('onclick');
      }
    });

    const homeLinks = document.querySelectorAll('a#FindJobs, [data-gnav-element-name="FindJobs"], [data-gnav-element-name="JobSearch"]');
    homeLinks.forEach(a => {
      a.onclick = function(e) {
        e.preventDefault();
        window.location.href = 'index.html';
      };
    });

    const jobsLinks = document.querySelectorAll('a#NavJobs, [data-gnav-element-name="Jobs"]');
    jobsLinks.forEach(a => {
      a.onclick = function(e) {
        e.preventDefault();
        window.location.href = 'jobs.html';
      };
    });

    const compLinks = document.querySelectorAll('a#CompanyReviews, [data-gnav-element-name="CompanyReviews"]');
    compLinks.forEach(a => {
      a.onclick = function(e) {
        e.preventDefault();
        window.location.href = 'companies.html';
      };
    });

    const salaryLinks = document.querySelectorAll('a#FindSalaries, [data-gnav-element-name="FindSalaries"]');
    salaryLinks.forEach(a => {
      a.onclick = function(e) {
        e.preventDefault();
        window.location.href = 'salaries.html';
      };
    });
  }

  function initAll() {
    initModalSystem();
    initUniversalLinkInterceptor();
    initAuthAndUserHeader();
    initGoogleOneTap();
    initSearchForms();
    initJobsPageInteractivity();
    initCompaniesInteractivity();
    initSalariesInteractivity();
    initCountriesInteractivity();
    initHireInteractivity();
    initTrendingAccordion();
    initCookieBanner();
    initGlobalButtonDelegation();
    injectResponsiveGlobalStyles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // ==========================================
  // 2. UNIVERSAL LINK & NAVIGATION INTERCEPTOR
  // ==========================================
  function initUniversalLinkInterceptor() {
    document.addEventListener('click', function(e) {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      // 1. Intercept Country & Language click -> navigate to countries.html
      if (anchor.getAttribute('data-gnav-element-name') === 'CountryLanguage' || 
          anchor.getAttribute('data-gnav-element-name') === 'ChangeCountries' ||
          anchor.classList.contains('gnav-header-4g10na') || 
          anchor.id === 'hdrCountryLangBtn' ||
          anchor.id === 'menu-item-country-lang' ||
          anchor.id === 'mobileDrawerCountryBtn' ||
          anchor.closest('[data-gnav-element-name="CountryLanguage"]') ||
          anchor.closest('#hdrCountryLangBtn') ||
          (anchor.getAttribute('aria-label') && (anchor.getAttribute('aria-label').includes('English') || anchor.getAttribute('aria-label').includes('India')) && (anchor.classList.contains('gnav-header-4g10na') || String(anchor.getAttribute('href')).includes('countr')))) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'countries.html';
        return;
      }

      // 2. Intercept Profile & Resume click
      if (anchor.getAttribute('data-gnav-element-name') === 'ProfileResume' ||
          anchor.id === 'menuProfileResumeBtn' ||
          anchor.id === 'menu-item-profile' ||
          anchor.id === 'mobileDrawerProfileBtn' ||
          anchor.textContent.trim().toLowerCase() === 'profile & resume' ||
          anchor.closest('#menu-item-profile')) {
        e.preventDefault();
        e.stopPropagation();
        openProfileModal();
        return;
      }

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Never allow navigation to real Move ONN.com or external domain
      const isExternalMove ONN = rawHref.includes('Move ONN.com') || rawHref.startsWith('http://') || rawHref.startsWith('https://');

      if (isExternalMove ONN) {
        e.preventDefault();
        e.stopPropagation();
        const route = resolveInternalRoute(rawHref, anchor.textContent.trim());
        if (route.startsWith('modal:')) {
          showInfoModal(route.replace('modal:', ''), anchor.textContent.trim());
        } else if (route && route !== '#') {
          window.location.href = route;
        }
        return;
      }

      // Check header/footer/menu links with '#'
      if (rawHref === '#' || rawHref.startsWith('#') || rawHref === '') {
        const text = anchor.textContent.trim().toLowerCase();
        if (text.includes('sign in') || anchor.closest('[data-gnav-element-name="SignIn"]')) {
          e.preventDefault();
          window.location.href = 'signin.html';
          return;
        }
        if (text === 'home' || text.includes('moveonn home')) {
          e.preventDefault();
          window.location.href = 'index.html';
          return;
        }
        if (text.includes('job') || text.includes('browse jobs') || anchor.id === 'FindJobs') {
          e.preventDefault();
          window.location.href = 'jobs.html';
          return;
        }
        if (text.includes('company') || text.includes('companies') || anchor.id === 'CompanyReviews') {
          e.preventDefault();
          window.location.href = 'companies.html';
          return;
        }
        if (text.includes('salary') || text.includes('salaries') || anchor.id === 'FindSalaries') {
          e.preventDefault();
          window.location.href = 'salaries.html';
          return;
        }
        if (text.includes('employer') || text.includes('post a job') || text.includes('post job') || anchor.id === 'EmployersPostJob') {
          e.preventDefault();
          window.location.href = 'index.html';
          return;
        }
        if (text.includes('countr') || text.includes('india') || text.includes('worldwide')) {
          e.preventDefault();
          window.location.href = 'countries.html';
          return;
        }
        if (text.includes('resume') || text.includes('cv')) {
          e.preventDefault();
          window.location.href = 'jobs.html';
          return;
        }
        if (['career advice', 'moveonn events', 'Move ONN events', 'work at moveonn', 'work at Move ONN', 'about', 'help', 'esg at moveonn', 'esg at Move ONN', 'guidelines for safe job search', 'privacy centre', 'privacy centre and ad choices', 'terms', 'accessibility at moveonn', 'accessibility at Move ONN'].includes(text)) {
          e.preventDefault();
          handleFooterLink(text);
          return;
        }
      }
    }, true);
  }

  function resolveInternalRoute(url, text) {
    const u = (url || '').toLowerCase();
    const t = (text || '').toLowerCase();

    if (u.includes('companies') || t.includes('company')) return 'companies.html';
    if (u.includes('salaries') || u.includes('/career/') || t.includes('salary') || t.includes('salaries')) return 'salaries.html';
    if (u.includes('countries') || u.includes('worldwide') || t.includes('country') || t.includes('worldwide')) return 'countries.html';
    if (u.includes('hire') || u.includes('employer') || u.includes('resumes.Move ONN') || t.includes('employer') || t.includes('post a job')) return 'index.html';
    if (u.includes('auth') || u.includes('signin') || u.includes('account') || u.includes('profile') || t.includes('sign in')) return 'signin.html';
    if (u.includes('browsejobs') || u.includes('/jobs') || u.includes('q-') || t.includes('browse jobs') || t.includes('job openings')) return 'jobs.html';
    if (u.includes('help') || t.includes('help')) return 'modal:help';
    if (u.includes('about') || t.includes('about')) return 'modal:about';
    if (u.includes('terms') || t.includes('terms')) return 'modal:terms';
    if (u.includes('privacy') || t.includes('privacy')) return 'modal:privacy';
    if (u.includes('in.Move ONN.com') || u.includes('www.Move ONN.com') || t.includes('home')) return 'index.html';

    return 'index.html';
  }

  function handleFooterLink(text) {
    if (text.includes('browse jobs') || text.includes('job')) window.location.href = 'jobs.html';
    else if (text.includes('companies') || text.includes('company')) window.location.href = 'companies.html';
    else if (text.includes('salaries') || text.includes('salary')) window.location.href = 'salaries.html';
    else if (text.includes('countries') || text.includes('country')) window.location.href = 'countries.html';
    else if (text.includes('post a job') || text.includes('employer')) window.location.href = 'index.html';
    else showInfoModal(text, text);
  }

  // ==========================================
  // 3. SEARCH FORM HANDLER & QUERY FORWARDING
  // ==========================================
  // ==========================================
  // 3. SEARCH FORM HANDLER & UNIVERSAL ROUTER
  // ==========================================
  function handleJobSearchAction(e) {
    if (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    const whatInput = document.getElementById('text-input-what') || document.querySelector('input[name="q"], input[placeholder*="Job title"]');
    const whereInput = document.getElementById('text-input-where') || document.querySelector('input[name="l"], input[placeholder*="City"]');
    const q = whatInput ? whatInput.value.trim() : '';
    const l = whereInput ? whereInput.value.trim() : '';
    let target = 'jobs.html';
    const params = [];
    if (q) params.push('q=' + encodeURIComponent(q));
    if (l) params.push('l=' + encodeURIComponent(l));
    if (params.length > 0) target += '?' + params.join('&');
    window.location.href = target;
    return false;
  }

  function initSearchForms() {
    // 1. GLOBAL CAPTURE: Search form submits (Enter key or submit buttons)
    document.addEventListener('submit', function(e) {
      const form = e.target.closest('form');
      if (!form) return;
      if (form.id === 'jobsearch' || form.classList.contains('yosegi-InlineWhatWhere-form') || (form.getAttribute('action') && form.getAttribute('action').includes('jobs'))) {
        handleJobSearchAction(e);
      } else if (form.id === 'companySearchForm' || (form.getAttribute('action') && form.getAttribute('action').includes('companies'))) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const input = form.querySelector('input[type="text"], input[type="search"]');
        const term = input ? input.value.trim() : '';
        filterCompanyCards(term);
      }
    }, true);

    // 2. GLOBAL CAPTURE: "Find jobs" buttons
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('button.yosegi-InlineWhatWhere-primaryButton, button[type="submit"], button#find-jobs-btn');
      if (btn && btn.closest('#jobsearch, .jobsearch-InlineWhatWhere, .yosegi-InlineWhatWhere-form, form')) {
        handleJobSearchAction(e);
      }
    }, true);

    // 3. GLOBAL CAPTURE: "Get Started" buttons (NEVER goes to external Move ONN!)
    document.addEventListener('click', function(e) {
      const target = e.target.closest('button, a');
      if (!target) return;
      const txt = (target.textContent || '').trim().toLowerCase();
      if (
        txt === 'get started' || 
        target.classList.contains('css-1yxihf5') || 
        target.closest('.css-1yxihf5') ||
        (target.closest('[data-testid="account-focused-homepage"]') && target.tagName === 'BUTTON')
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const user = getLoggedInUser();
        window.location.href = user ? 'jobs.html' : 'signin.html';
        return false;
      }
    }, true);

    // 4. GLOBAL CAPTURE: Universal Move ONN Shield (0% escape to external Move ONN)
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (!link) return;
      const href = (link.getAttribute('href') || '').trim();
      if (
        href.includes('Move ONN.com') ||
        href.includes('secure.Move ONN.com') ||
        href.includes('employers.Move ONN.com') ||
        href.includes('profile.Move ONN.com') ||
        href.includes('messages.Move ONN.com') ||
        href.includes('myjobs.Move ONN.com')
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
        
        if (href.includes('companies')) window.location.href = 'companies.html';
        else if (href.includes('salaries') || href.includes('career/salaries')) window.location.href = 'salaries.html';
        else if (href.includes('countries') || href.includes('worldwide')) window.location.href = 'countries.html';
        else if (href.includes('auth') || href.includes('signin') || href.includes('login') || href.includes('account')) window.location.href = 'signin.html';
        else if (href.includes('hire') || href.includes('post-job') || href.includes('employers')) window.location.href = 'hire.html';
        else if (href.includes('job') || href.includes('viewjob') || href.includes('q=') || href.includes('l=') || href.includes('browsejobs')) window.location.href = 'jobs.html';
        else window.location.href = 'index.html';
        return false;
      }
    }, true);
  }

  // ==========================================
  // 4. USER AUTHENTICATION & HEADER STATE
  // ==========================================
  
  function getLoggedInUser() {
    try {
      const stored = localStorage.getItem('moveonn_user') || localStorage.getItem('Move ONN_user') || null || localStorage.getItem('apex_user') || localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u) {
          if (u.name === 'Himanshu Sharma' || (u.name && u.name.includes('Himanshu'))) {
            u.name = 'Yuvi';
            u.email = 'yuvi@gmail.com';
            ['moveonn_user', 'Move ONN_user', 'moveonn_user', 'apex_user', 'user'].forEach(k => {
              try { localStorage.setItem(k, JSON.stringify(u)); } catch(err) {}
            });
          }
          return u;
        }
      }
    } catch(e) {}
    return null;
  }

  function getUserInitials(name) {
    if (!name) return 'Y';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  function performLocalLogin(name, email) {
    const user = {
      name: 'Yuvi',
      email: email || 'yuvi@gmail.com',
      avatar: 'assets/images/user-avatar.png'
    };
    ['Move ONN_user', 'moveonn_user', 'apex_user', 'user'].forEach(k => {
      try { localStorage.setItem(k, JSON.stringify(user)); } catch(e) {}
    });
    showToast('Signed in as Yuvi');
    initAuthAndUserHeader();
    if (typeof renderHeaderAuth === 'function') renderHeaderAuth();
  }

  function restoreLoggedOutHeroElements() {
    document.body.classList.remove('user-logged-in');
    document.body.classList.add('user-logged-out');

    // 1. Remove all suppression properties from hero elements
    const heros = document.querySelectorAll('[data-testid="account-focused-homepage"], .css-14v6npv, .css-p4zop2, button.css-1yxihf5, .css-1gv3d3g, .css-4e46g6, .css-kousv8');
    heros.forEach(h => {
      h.style.removeProperty('display');
      h.style.removeProperty('height');
      h.style.removeProperty('visibility');
      h.style.removeProperty('overflow');
      h.style.removeProperty('min-height');
      h.style.removeProperty('max-height');
      h.style.removeProperty('opacity');
      h.style.removeProperty('pointer-events');
      h.style.removeProperty('margin');
      h.style.removeProperty('padding');
    });

    const accountHero = document.querySelector('[data-testid="account-focused-homepage"]');
    if (accountHero) {
      accountHero.style.setProperty('display', 'block', 'important');
      accountHero.style.setProperty('visibility', 'visible', 'important');
      accountHero.style.setProperty('height', 'auto', 'important');
      accountHero.style.setProperty('opacity', '1', 'important');
      accountHero.style.setProperty('pointer-events', 'auto', 'important');
    }

    // 2. Ensure .css-p4zop2 and logo image are fully visible
    const p4zop2 = document.querySelector('.css-p4zop2');
    if (p4zop2) {
      p4zop2.style.setProperty('display', 'flex', 'important');
      p4zop2.style.setProperty('visibility', 'visible', 'important');
      p4zop2.style.setProperty('height', 'auto', 'important');
      let img = p4zop2.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.src = 'assets/images/moveonn-logo.png';
        img.alt = 'Move ONN';
        img.className = 'moveonn-hero-brand-img';
        img.style.cssText = 'width:160px; max-width:160px; height:auto; display:block; margin:0 auto 16px; object-fit:contain;';
        p4zop2.prepend(img);
      } else {
        img.style.setProperty('display', 'block', 'important');
        img.style.setProperty('visibility', 'visible', 'important');
        img.style.setProperty('width', '160px', 'important');
        img.style.setProperty('max-width', '160px', 'important');
        img.style.setProperty('margin', '0 auto 16px', 'important');
      }
    }

    // 3. Ensure Get Started button is visible
    const getStartedBtn = document.querySelector('button.css-1yxihf5');
    if (getStartedBtn) {
      getStartedBtn.style.setProperty('display', 'inline-flex', 'important');
      getStartedBtn.style.setProperty('visibility', 'visible', 'important');
    }

    // 4. Ensure sign in header link is cleanly visible and person svg is hidden
    const signInContainer = document.querySelector('[data-gnav-element-name="SignIn"]');
    if (signInContainer) {
      signInContainer.style.setProperty('display', 'flex', 'important');
      const svgIcon = signInContainer.querySelector('.css-114vi1p, .gnav-header-114vi1p, a.gnav-header-1xl6wxa');
      if (svgIcon) svgIcon.style.setProperty('display', 'none', 'important');
      const txtDiv = signInContainer.querySelector('.css-6p95ih');
      if (txtDiv) txtDiv.style.setProperty('display', 'flex', 'important');
    }
  }

  function performLocalSignOut() {
    ['Move ONN_user', 'moveonn_user', 'apex_user', 'user'].forEach(k => {
      try { localStorage.removeItem(k); } catch(e) {}
    });

    if (window.history && window.history.replaceState) {
      try {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch(e) {}
    }

    const menu = document.getElementById('moveonnUserDropdownMenu');
    if (menu) menu.remove();
    closeMobileMenu();
    showToast('Signed out successfully');

    document.body.classList.remove('user-logged-in');
    document.body.classList.add('user-logged-out');

    const feed = document.getElementById('injected-signed-in-feed-container');
    if (feed) feed.remove();

    const authIcons = document.getElementById('injected-auth-icons');
    if (authIcons) authIcons.remove();

    restoreLoggedOutHeroElements();
    initAuthAndUserHeader();
    safeEnforceBranding();

    const path = window.location.pathname.toLowerCase();
    const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('\\index.html') || path.endsWith('/apex%201%20by%20yuvi/') || !path.includes('.html');
    if (isHome) {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 350);
    }
  }

  function authenticateUser(name, email) {
    performLocalLogin(name, email);
  }

  function initAuthAndUserHeader() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'true') {
      const defaultUser = { name: 'Yuvi', email: 'yuvi@gmail.com', avatar: 'assets/images/user-avatar.png' };
      try {
        localStorage.setItem('moveonn_user', JSON.stringify(defaultUser));
            );
        localStorage.setItem('Move ONN_user', JSON.stringify(defaultUser));
        localStorage.setItem('apex_user', JSON.stringify(defaultUser));
      } catch(e) {}
    } else if (urlParams.get('auth') === 'false') {
      try {
        localStorage.removeItem('moveonn_user');
            localStorage.removeItem('moveonn_user');
        localStorage.removeItem('Move ONN_user');
        localStorage.removeItem('apex_user');
      } catch(e) {}
    }

    const user = getLoggedInUser();

    // Locate the sign-in container in GNAV header
    const signInDiv = document.querySelector('div[data-gnav-element-name="SignIn"]') || document.querySelector('a.css-ubxxrl[href*="signin"]')?.closest('div');
    const existingIcons = document.getElementById('injected-auth-icons');

    if (user) {
      // User IS logged in
      document.body.classList.add('user-logged-in');
      document.body.classList.remove('user-logged-out');

      if (signInDiv) {
        signInDiv.style.display = 'none';
      }

      // Also hide mobile sign in icon if present
      const mobileSignIn = document.querySelector('a.gnav-header-1xl6wxa, a[aria-label="Sign in"]');
      if (mobileSignIn) {
        const mobParent = mobileSignIn.closest('li');
        if (mobParent) mobParent.style.display = 'none';
      }

      const initials = 'Y';

      // Find target parent UL
      const parentUl = signInDiv ? signInDiv.closest('ul') : document.querySelector('ul.gnav-header-omjzcc, nav.gnav ul');

      if (parentUl) {
        let authIconsLi = existingIcons;
        if (!authIconsLi) {
          authIconsLi = document.createElement('li');
          authIconsLi.id = 'injected-auth-icons';
          authIconsLi.className = 'css-u74ql7 eu4oa1w0';
          authIconsLi.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; margin-right: 8px; list-style: none;';
          
          if (signInDiv && signInDiv.closest('li')) {
            parentUl.insertBefore(authIconsLi, signInDiv.closest('li'));
          } else {
            parentUl.appendChild(authIconsLi);
          }
        }

        authIconsLi.style.display = 'inline-flex';
        authIconsLi.innerHTML = `
          <!-- 1. Saved Jobs -->
          <a href="jobs.html?tab=saved" id="nav-btn-saved" title="Saved Jobs" aria-label="Saved Jobs" style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:8px; color:#2d2d2d; text-decoration:none; transition:background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='transparent'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          </a>

          <!-- 2. Messages -->
          <a href="#" id="nav-btn-messages" title="Messages" aria-label="Messages" style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:8px; color:#2d2d2d; text-decoration:none; transition:background 0.2s; position:relative;" onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='transparent'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
            <span style="position:absolute; top:7px; right:7px; width:7px; height:7px; background:#1264e8; border-radius:50%;"></span>
          </a>

          <!-- 3. Notifications -->
          <a href="#" id="nav-btn-notifications" title="Notifications" aria-label="Notifications" style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border-radius:8px; color:#2d2d2d; text-decoration:none; transition:background 0.2s; position:relative;" onmouseover="this.style.background='rgba(0,0,0,0.06)'" onmouseout="this.style.background='transparent'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/></svg>
            <span style="position:absolute; top:6px; right:6px; width:8px; height:8px; background:#d93a40; border-radius:50%;"></span>
          </a>

          <!-- Divider -->
          <div style="border-left: 1px solid #d4d2d0; height: 22px; margin: 0 4px;"></div>

          <!-- 4. User Profile Avatar Button -->
          <button id="nav-btn-profile" type="button" title="${user.name}" aria-label="Account Menu" style="background:transparent; border:none; padding:0; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; outline:none;">
            <div style="width:34px; height:34px; border-radius:50%; background:#1264e8; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; letter-spacing:0.5px; box-shadow:0 1px 3px rgba(0,0,0,0.2); transition:transform 0.15s ease;">
              ${initials}
            </div>
          </button>
        `;

        // Wire up click handlers
        const profileBtn = authIconsLi.querySelector('#nav-btn-profile');
        if (profileBtn) {
          profileBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleUserDropdown(profileBtn);
          };
        }

        const msgBtn = authIconsLi.querySelector('#nav-btn-messages');
        if (msgBtn) {
          msgBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMessagesModal();
          };
        }

        const notifBtn = authIconsLi.querySelector('#nav-btn-notifications');
        if (notifBtn) {
          notifBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            openNotificationsModal();
          };
        }
      }

      // HOMEPAGE LOGGED-IN EXPERIENCE
      const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
      if (isHome) {
        // 1. COMPLETELY HIDE the logged-out "Your next job starts here" card
        const accountHeros = document.querySelectorAll('[data-testid="account-focused-homepage"], .css-14v6npv');
        accountHeros.forEach(h => {
          h.style.setProperty('display', 'none', 'important');
        });

        // 2. Ensure Recommended Jobs For You feed is displayed directly below search bar
        let feedContainer = document.getElementById('injected-signed-in-feed-container');
        if (!feedContainer) {
          feedContainer = document.createElement('div');
          feedContainer.id = 'injected-signed-in-feed-container';
          feedContainer.style.display = 'block';

          feedContainer.innerHTML = `
            <div id="injected-signed-in-feed" style="max-width: 1200px; margin: 36px auto; padding: 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px; border-bottom: 1px solid #e4e2e0; padding-bottom: 16px;">
                <div>
                  <h2 style="font-size: 22px; font-weight: 700; color: #121224; margin: 0;">Jobs for you</h2>
                </div>
                <a href="jobs.html" style="font-size: 14px; font-weight: 700; color: #1b76ff; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                  <span>View all jobs</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
                <!-- Card 1 -->
                <div style="background: #fff; border: 1px solid #e4e2e0; border-radius: 12px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: border-color 0.2s, box-shadow 0.2s;" onmouseover="this.style.borderColor='#1b76ff'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'" onmouseout="this.style.borderColor='#e4e2e0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 700; color: #1b76ff; background: #eaf1ff; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Top Match</span>
                    <span style="font-size: 11px; font-weight: 700; color: #1f662c; background: #e4f7e6; padding: 3px 8px; border-radius: 4px;">Actively Hiring</span>
                  </div>
                  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;"><a href="jobs.html?q=Senior+Full+Stack+Developer" style="color:#121224; text-decoration:none;">Senior Full Stack Developer</a></h3>
                  <div style="color: #474d6a; font-size: 14px; margin-bottom: 10px; font-weight: 500;">Apex Consultancy Solutions • Bengaluru, Karnataka</div>
                  <div style="font-weight: 700; color: #121224; font-size: 15px; margin-bottom: 14px;">₹14,00,000 - ₹22,00,000 a year</div>
                  <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; border-top: 1px solid #f0f3f6; padding-top: 14px;">
                    <button type="button" class="moveonn-apply-btn" onclick="window.openApplyModal('Senior Full Stack Developer')">Apply now</button>
                    <span style="font-size: 12px; color: #717b9e;">Remote options available</span>
                  </div>
                </div>

                <!-- Card 2 -->
                <div style="background: #fff; border: 1px solid #e4e2e0; border-radius: 12px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: border-color 0.2s, box-shadow 0.2s;" onmouseover="this.style.borderColor='#1b76ff'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'" onmouseout="this.style.borderColor='#e4e2e0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 700; color: #1b76ff; background: #eaf1ff; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Recommended</span>
                    <span style="font-size: 11px; font-weight: 700; color: #1f662c; background: #e4f7e6; padding: 3px 8px; border-radius: 4px;">Easily Apply</span>
                  </div>
                  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;"><a href="jobs.html?q=React+Frontend+Engineer" style="color:#121224; text-decoration:none;">React Frontend Engineer</a></h3>
                  <div style="color: #474d6a; font-size: 14px; margin-bottom: 10px; font-weight: 500;">Tata Consultancy Services • Hyderabad, Telangana</div>
                  <div style="font-weight: 700; color: #121224; font-size: 15px; margin-bottom: 14px;">₹8,50,000 - ₹15,00,000 a year</div>
                  <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; border-top: 1px solid #f0f3f6; padding-top: 14px;">
                    <button type="button" class="moveonn-apply-btn" onclick="window.openApplyModal('React Frontend Engineer')">Apply now</button>
                    <span style="font-size: 12px; color: #717b9e;">Fast response</span>
                  </div>
                </div>

                <!-- Card 3 -->
                <div style="background: #fff; border: 1px solid #e4e2e0; border-radius: 12px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: border-color 0.2s, box-shadow 0.2s;" onmouseover="this.style.borderColor='#1b76ff'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'" onmouseout="this.style.borderColor='#e4e2e0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 700; color: #1b76ff; background: #eaf1ff; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">High Pay</span>
                    <span style="font-size: 11px; font-weight: 700; color: #1f662c; background: #e4f7e6; padding: 3px 8px; border-radius: 4px;">Early Applicant</span>
                  </div>
                  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;"><a href="jobs.html?q=Python+Data+Engineer" style="color:#121224; text-decoration:none;">Python Data Engineer</a></h3>
                  <div style="color: #474d6a; font-size: 14px; margin-bottom: 10px; font-weight: 500;">Infosys Ltd • Pune, Maharashtra</div>
                  <div style="font-weight: 700; color: #121224; font-size: 15px; margin-bottom: 14px;">₹11,00,000 - ₹18,00,000 a year</div>
                  <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; border-top: 1px solid #f0f3f6; padding-top: 14px;">
                    <button type="button" class="moveonn-apply-btn" onclick="window.openApplyModal('Python Data Engineer')">Apply now</button>
                    <span style="font-size: 12px; color: #717b9e;">Hybrid work model</span>
                  </div>
                </div>

                <!-- Card 4 -->
                <div style="background: #fff; border: 1px solid #e4e2e0; border-radius: 12px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: border-color 0.2s, box-shadow 0.2s;" onmouseover="this.style.borderColor='#1b76ff'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'" onmouseout="this.style.borderColor='#e4e2e0'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <span style="font-size: 11px; font-weight: 700; color: #1b76ff; background: #eaf1ff; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Patna / Remote</span>
                    <span style="font-size: 11px; font-weight: 700; color: #1f662c; background: #e4f7e6; padding: 3px 8px; border-radius: 4px;">Actively Hiring</span>
                  </div>
                  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;"><a href="jobs.html?q=Java+Backend+Architect" style="color:#121224; text-decoration:none;">Java Backend Architect</a></h3>
                  <div style="color: #474d6a; font-size: 14px; margin-bottom: 10px; font-weight: 500;">Wipro Technologies • Patna / Remote</div>
                  <div style="font-weight: 700; color: #121224; font-size: 15px; margin-bottom: 14px;">₹16,00,000 - ₹26,00,000 a year</div>
                  <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; border-top: 1px solid #f0f3f6; padding-top: 14px;">
                    <button type="button" class="moveonn-apply-btn" onclick="window.openApplyModal('Java Backend Architect')">Apply now</button>
                    <span style="font-size: 12px; color: #717b9e;">100% Remote Available</span>
                  </div>
                </div>
              </div>
            </div>
          `;

          const searchContainer = document.querySelector('form.yosegi-InlineWhatWhere-form')?.closest('div[class*="css-"]') || document.querySelector('form')?.closest('div');
          if (searchContainer && searchContainer.parentNode) {
            searchContainer.parentNode.insertBefore(feedContainer, searchContainer.nextSibling);
          } else {
            const main = document.getElementById('jobsearch-Main') || document.body;
            main.insertBefore(feedContainer, main.firstChild);
          }
        } else {
          feedContainer.style.display = 'block';
        }
      }
    } else {
      // User is LOGGED OUT
      document.body.classList.add('user-logged-out');
      document.body.classList.remove('user-logged-in');

      if (existingIcons) {
        existingIcons.remove();
      }
      if (signInDiv) {
        signInDiv.style.setProperty('display', 'flex', 'important');
        const signInAnchor = signInDiv.querySelector('a.css-ubxxrl') || signInDiv.querySelector('a');
        if (signInAnchor) {
          signInAnchor.setAttribute('href', 'signin.html');
          signInAnchor.onclick = function(e) {
            e.preventDefault();
            window.location.href = 'signin.html';
            return true;
          };
        }
        // Completely hide person svg icon inside signInDiv so it NEVER overlaps
        const svgIcon = signInDiv.querySelector('.css-114vi1p, .gnav-header-114vi1p, a.gnav-header-1xl6wxa');
        if (svgIcon) svgIcon.style.setProperty('display', 'none', 'important');
        const txtDiv = signInDiv.querySelector('.css-6p95ih');
        if (txtDiv) txtDiv.style.setProperty('display', 'flex', 'important');
      }

      // Hide and remove recommended jobs feed & restore logged-out hero
      const injectedFeed = document.getElementById('injected-signed-in-feed-container');
      if (injectedFeed) injectedFeed.remove();

      restoreLoggedOutHeroElements();
    }

    // Always ensure infallible header link wiring
    wireHeaderNavigationLinks();
  }

  function toggleUserDropdown(buttonEl) {
    let menu = document.getElementById('moveonnUserDropdownMenu');
    if (menu) {
      menu.remove();
      return;
    }

    const user = getLoggedInUser() || { name: 'Yuvi', email: 'yuvi@gmail.com' };
    const initials = 'Y';
    const savedPref = JSON.parse(localStorage.getItem('preferred_country_lang') || '{"flag":"","langCode":"En"}');

    menu = document.createElement('div');
    menu.id = 'moveonnUserDropdownMenu';
    menu.style.cssText = `
      position: fixed;
      top: 56px;
      right: 20px;
      width: 290px;
      background: #ffffff;
      border: 1px solid #d4d2d0;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.18);
      z-index: 100000;
      overflow: hidden;
      font-family: 'Move ONN Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    menu.innerHTML = `
      <div style="padding: 16px; background: #f9f9f9; border-bottom: 1px solid #e4e2e0;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: #1b76ff; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0;">
            ${initials}
          </div>
          <div style="overflow: hidden; flex: 1;">
            <div style="font-weight: 700; color: #2d2d2d; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.name}</div>
            <div style="font-size: 12px; color: #767676; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${user.email}</div>
          </div>
        </div>
        <div style="margin-top: 12px; background: #e8f3fc; border-radius: 6px; padding: 6px 10px; font-size: 12px; color: #003a9b; display: flex; justify-content: space-between; align-items: center;">
          <span>Profile Strength</span>
          <span style="font-weight: 700;">85%</span>
        </div>
      </div>

      <div style="padding: 6px 0;">
        <a href="jobs.html?tab=saved" id="menu-item-myjobs" style="display: flex; align-items: center; gap: 12px; padding: 10px 18px; color: #2d2d2d; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          <span>My jobs</span>
        </a>
        <a href="#" id="menu-item-profile" style="display: flex; align-items: center; gap: 12px; padding: 10px 18px; color: #2d2d2d; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span>Profile & Resume</span>
        </a>
        <a href="companies.html" style="display: flex; align-items: center; gap: 12px; padding: 10px 18px; color: #2d2d2d; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="18" x2="9" y2="18.01"></line><line x1="15" y1="18" x2="15" y2="18.01"></line></svg>
          <span>Company reviews</span>
        </a>
        <a href="salaries.html" style="display: flex; align-items: center; gap: 12px; padding: 10px 18px; color: #2d2d2d; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>Salary guide</span>
        </a>
        <a href="#" id="menu-item-country-lang" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 18px; color: #2d2d2d; text-decoration: none; font-size: 14px; font-weight: 500; transition: background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span>Country & language</span>
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #1b76ff; background: #eaf1ff; padding: 2px 6px; border-radius: 4px;">${savedPref.flag} ${savedPref.langCode}</span>
        </a>
      </div>

      <div style="border-top: 1px solid #e4e2e0; padding: 6px 0; background: #fff;">
        <button id="btnSignOutLocal" type="button" style="width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 18px; color: #d93a40; background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; text-align: left; transition: background 0.15s;" onmouseover="this.style.background='#feeeef'" onmouseout="this.style.background='transparent'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>Sign out</span>
        </button>
      </div>
    `;

    document.body.appendChild(menu);

    // Profile item click
    const profileItem = menu.querySelector('#menu-item-profile');
    if (profileItem) {
      profileItem.onclick = function(e) {
        e.preventDefault();
        menu.remove();
        openProfileModal();
      };
    }

    // Country & language click
    const countryItem = menu.querySelector('#menu-item-country-lang');
    if (countryItem) {
      countryItem.onclick = function(e) {
        e.preventDefault();
        menu.remove();
        window.location.href = 'countries.html';
      };
    }

    // Sign out button click
    const signOutBtn = menu.querySelector('#btnSignOutLocal');
    if (signOutBtn) {
      signOutBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        performLocalSignOut();
      };
    }

    // Close on click outside
    setTimeout(() => {
      function closeDropdown(e) {
        if (menu && !menu.contains(e.target) && e.target !== buttonEl && !buttonEl.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeDropdown);
        }
      }
      document.addEventListener('click', closeDropdown);
    }, 50);
  }

  function initGoogleOneTap() {
    // Completely neutralized
  }

  function openMessagesModal() {
    initModalSystem();
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');
    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e4e2e0;padding-bottom:16px;margin-bottom:16px;">
        <h3 style="margin:0;font-size:20px;font-weight:700;color:#2d2d2d;">Messages</h3>
        <button id="closeModalBtn" style="border:none;background:transparent;font-size:22px;cursor:pointer;color:#595959;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:#f7f9ff;border:1px solid #bfd3ff;border-radius:8px;padding:14px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <strong style="color:#003a9b;font-size:14px;">Apex Consultancy Solutions</strong>
            <span style="font-size:12px;color:#767676;">10:30 AM</span>
          </div>
          <p style="margin:0;font-size:13px;color:#2d2d2d;">Hello Yuvi, we reviewed your profile for Senior Full Stack Developer. We would like to invite you for a virtual interview this week!</p>
        </div>
        <div style="background:#fff;border:1px solid #e4e2e0;border-radius:8px;padding:14px;cursor:pointer;">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <strong style="color:#2d2d2d;font-size:14px;">Tata Consultancy Services HR</strong>
            <span style="font-size:12px;color:#767676;">Yesterday</span>
          </div>
          <p style="margin:0;font-size:13px;color:#595959;">Thank you for applying. Your profile matches our current opening for React Developer.</p>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';
  }

  function openNotificationsModal() {
    initModalSystem();
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');
    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e4e2e0;padding-bottom:16px;margin-bottom:16px;">
        <h3 style="margin:0;font-size:20px;font-weight:700;color:#2d2d2d;">Notifications</h3>
        <button id="closeModalBtn" style="border:none;background:transparent;font-size:22px;cursor:pointer;color:#595959;">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:8px;background:#eef5fc;">
          <div style="width:10px;height:10px;border-radius:50%;background:#1264e8;margin-top:6px;flex-shrink:0;"></div>
          <div>
            <div style="font-weight:700;font-size:14px;color:#2d2d2d;">Application Viewed</div>
            <div style="font-size:13px;color:#595959;margin-top:2px;">Apex Consultancy Solutions viewed your application for Senior Full Stack Developer.</div>
            <div style="font-size:11px;color:#767676;margin-top:4px;">2 hours ago</div>
          </div>
        </div>
        <div style="display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:8px;background:#fff;border:1px solid #e4e2e0;">
          <div style="width:10px;height:10px;border-radius:50%;background:#767676;margin-top:6px;flex-shrink:0;"></div>
          <div>
            <div style="font-weight:700;font-size:14px;color:#2d2d2d;">New Job Alert</div>
            <div style="font-size:13px;color:#595959;margin-top:2px;">12 new job matches for "Full Stack Developer" in Bengaluru.</div>
            <div style="font-size:11px;color:#767676;margin-top:4px;">1 day ago</div>
          </div>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';
  }

    function openProfileModal(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    const user = getLoggedInUser() || { name: 'Yuvi', email: 'yuvi@gmail.com', avatar: 'assets/images/user-avatar.png' };
    
    // Prevent background scrolling / page sliding on mobile & desktop
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    let overlay = document.getElementById('candidateProfileModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'candidateProfileModalOverlay';
      document.body.appendChild(overlay);
    }
    
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:10000000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(3px);font-family:"Move ONN Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-sizing:border-box;';

    overlay.innerHTML = `
      <div id="candidateProfileModalCard" style="background:#ffffff; border-radius:16px; width:94%; max-width:620px; max-height:90vh; overflow-y:auto; overflow-x:hidden; padding:28px; box-shadow:0 16px 40px rgba(0,0,0,0.25); position:relative; box-sizing:border-box;">
        <!-- Close Button -->
        <button type="button" id="btnCloseProfileModalX" aria-label="Close" style="position:absolute; top:18px; right:18px; background:#f0f3f6; border:none; width:36px; height:36px; border-radius:50%; font-size:22px; cursor:pointer; color:#474d6a; display:flex; align-items:center; justify-content:center; line-height:1; transition:background 0.2s;">&times;</button>
        
        <!-- Modal Header / Avatar Header -->
        <div style="display:flex; align-items:center; gap:16px; border-bottom:1px solid #e4e2e0; padding-bottom:18px; margin-bottom:18px; padding-right:40px;">
          <div style="width:54px; height:54px; border-radius:50%; background:#1264e8; color:#fff; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:700; flex-shrink:0; box-shadow:0 4px 12px rgba(37,87,167,0.3);">
            Y
          </div>
          <div style="flex:1; min-width:0;">
            <h2 style="margin:0 0 3px; font-size:20px; font-weight:700; color:#121224; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.name}</h2>
            <div style="color:#474d6a; font-size:13px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Senior Full Stack Developer • Patna, Bihar</div>
            <div style="color:#717b9e; font-size:12px; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${user.email} • +91 98765 43210</div>
          </div>
        </div>

        <!-- Profile Strength Card -->
        <div style="background:#f0f7ff; border:1px solid #cce3ff; border-radius:10px; padding:12px 16px; margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="font-weight:700; font-size:13px; color:#0e5ad6;">Profile Strength: Excellent</span>
            <span style="font-weight:700; font-size:13px; color:#0e5ad6;">85%</span>
          </div>
          <div style="width:100%; height:7px; background:#d4e6fc; border-radius:4px; overflow:hidden;">
            <div style="width:85%; height:100%; background:linear-gradient(90deg, #1264e8, #00c2ff); border-radius:4px;"></div>
          </div>
        </div>

        <!-- Resume Section (Cleanly stacked on mobile) -->
        <div style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h3 style="font-size:15px; font-weight:700; color:#121224; margin:0;">Uploaded Resume</h3>
            <span style="font-size:11px; color:#1f662c; background:#e4f7e6; padding:2px 8px; border-radius:4px; font-weight:600;">Active & Searchable</span>
          </div>
          <div id="resumeFileCardContainer" style="border:1px solid #d4d2d0; border-radius:10px; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; background:#fafafa; gap:12px; box-sizing:border-box;">
            <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1264e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              <div style="min-width:0; flex:1;">
                <div id="displayResumeFileName" style="font-weight:700; font-size:13px; color:#121224; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Yuvi_FullStack_Developer_Resume.pdf</div>
                <div style="font-size:11px; color:#717b9e; margin-top:2px;">PDF Document • 1.4 MB • Updated Today</div>
              </div>
            </div>
            <div id="resumeFileCardActions" style="display:flex; gap:8px; flex-shrink:0;">
              <button type="button" id="btnDownloadResume" style="background:#fff; border:1px solid #1264e8; color:#1264e8; padding:7px 14px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap;">Download</button>
              <input type="file" id="resumeHiddenUpload" style="display:none;" accept=".pdf,.doc,.docx">
              <button type="button" id="btnTriggerResumeUpload" style="background:#1264e8; border:none; color:#fff; padding:7px 14px; border-radius:20px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap;">Update</button>
            </div>
          </div>
        </div>

        <!-- Skills Section -->
        <div style="margin-bottom:20px;">
          <h3 style="font-size:15px; font-weight:700; color:#121224; margin:0 0 8px;">Key Technical Skills</h3>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">React.js</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">Node.js</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">TypeScript</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">Next.js</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">PostgreSQL</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">AWS</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">Python</span>
            <span style="background:#eef2f6; color:#2d2d2d; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:500;">Docker</span>
          </div>
        </div>

        <!-- Editable Details Form -->
        <form id="formEditProfileDetails" style="border-top:1px solid #e4e2e0; padding-top:16px; display:flex; flex-direction:column; gap:12px;">
          <h3 style="font-size:15px; font-weight:700; color:#121224; margin:0 0 2px;">Edit Profile Information</h3>
          <div id="profFormGrid1" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#474d6a; margin-bottom:4px;">Full Name</label>
              <input type="text" id="profInputName" value="${user.name}" style="width:100%; padding:8px 10px; border:1px solid #d4d2d0; border-radius:6px; font-size:13px; box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#474d6a; margin-bottom:4px;">Professional Title</label>
              <input type="text" id="profInputTitle" value="Senior Full Stack Developer" style="width:100%; padding:8px 10px; border:1px solid #d4d2d0; border-radius:6px; font-size:13px; box-sizing:border-box;">
            </div>
          </div>
          <div id="profFormGrid2" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#474d6a; margin-bottom:4px;">Email Address</label>
              <input type="email" id="profInputEmail" value="${user.email}" style="width:100%; padding:8px 10px; border:1px solid #d4d2d0; border-radius:6px; font-size:13px; box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#474d6a; margin-bottom:4px;">Location</label>
              <input type="text" id="profInputLoc" value="Patna, Bihar, India" style="width:100%; padding:8px 10px; border:1px solid #d4d2d0; border-radius:6px; font-size:13px; box-sizing:border-box;">
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:6px;">
            <button type="button" id="btnCancelProfileModal" style="padding:9px 16px; border:1px solid #d4d2d0; background:#fff; color:#2d2d2d; border-radius:20px; font-size:13px; font-weight:600; cursor:pointer;">Close</button>
            <button type="submit" style="padding:9px 20px; border:none; background:#1264e8; color:#fff; border-radius:20px; font-size:13px; font-weight:700; cursor:pointer;">Save Changes</button>
          </div>
        </form>
      </div>
    `;

    overlay.style.display = 'flex';

    overlay.onclick = function(ev) {
      if (ev.target === overlay) closeProfileModal();
    };
    overlay.querySelector('#btnCloseProfileModalX').onclick = closeProfileModal;
    overlay.querySelector('#btnCancelProfileModal').onclick = closeProfileModal;

    overlay.querySelector('#btnDownloadResume').onclick = function() {
      const resumeText = 'Yuvi - Senior Full Stack Developer\nEmail: yuvi@gmail.com | Location: Patna, Bihar\n\nSkills: React, Node.js, TypeScript, Next.js, PostgreSQL, AWS\nExperience: Apex Consultancy Solutions (2022-Present)';
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Yuvi_FullStack_Resume.txt';
      a.click();
      showToast('Downloading Yuvi_FullStack_Resume...');
    };

    const uploadInput = overlay.querySelector('#resumeHiddenUpload');
    overlay.querySelector('#btnTriggerResumeUpload').onclick = function() {
      uploadInput.click();
    };
    uploadInput.onchange = function() {
      if (uploadInput.files && uploadInput.files[0]) {
        const fileName = uploadInput.files[0].name;
        overlay.querySelector('#displayResumeFileName').textContent = fileName;
        showToast('Resume updated: ' + fileName);
      }
    };

    overlay.querySelector('#formEditProfileDetails').onsubmit = function(ev) {
      ev.preventDefault();
      const updated = {
        name: document.getElementById('profInputName').value.trim() || 'Yuvi',
        email: document.getElementById('profInputEmail').value.trim() || 'yuvi@gmail.com',
        avatar: 'assets/images/user-avatar.png'
      };
      ['Move ONN_user', 'moveonn_user', 'apex_user', 'user'].forEach(k => {
        try { localStorage.setItem(k, JSON.stringify(updated)); } catch(err) {}
      });

      closeProfileModal();
      showToast('Profile updated successfully!');
      initAuthAndUserHeader();
      if (typeof renderHeaderAuth === 'function') renderHeaderAuth();
    };
  }

  function closeProfileModal() {
    const overlay = document.getElementById('candidateProfileModalOverlay');
    if (overlay) overlay.style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  function initJobsPageInteractivity() {
    const path = (window.location && window.location.pathname) || '';
    const title = (document && document.title) || '';
    if (!path.includes('jobs') && !title.includes('Job Search')) return;
    // Managed directly in jobs.html script
  }

  // ==========================================
  // 7. COMPANIES PAGE INTERACTIVITY
  // ==========================================
  function initCompaniesInteractivity() {
    const path = (window.location && window.location.pathname) || '';
    const title = (document && document.title) || '';
    if (!path.includes('companies') && !title.includes('Companies')) return;

    const searchInput = document.querySelector('#company-search, input[type="text"], input[placeholder*="Company"]');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        filterCompanyCards(e.target.value.trim());
      });
    }

    const stars = document.querySelectorAll('svg[class*="chevronIcon"], svg:has(path[d*="12L8"])');
    stars.forEach((star, idx) => {
      star.style.cursor = 'pointer';
      star.addEventListener('click', function() {
        showToast(`Thank you! Your ${idx + 1}-star employer review has been submitted.`);
      });
    });
  }

  function filterCompanyCards(query) {
    const term = (query || '').toLowerCase();
    const cards = document.querySelectorAll('li[data-testid="CompanyRow"], li:has([class*="reviews"]), [data-testid*="popular-companies"] li, li:has(img[src*="company-"])');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!term || text.includes(term)) ? '' : 'none';
    });
  }

  // ==========================================
  // 8. SALARIES PAGE INTERACTIVITY
  // ==========================================
  function initSalariesInteractivity() {
    const path = (window.location && window.location.pathname) || '';
    const title = (document && document.title) || '';
    if (!path.includes('salaries') && !title.includes('Salaries')) return;

    // Search input filtering
    const whatInput = document.querySelector('#input-title-autocomplete, input[id*="what"], input[placeholder*="Job title"]');
    if (whatInput) {
      whatInput.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('li.css-pm9z5s, [role="listitem"]');
        cards.forEach(c => {
          const text = c.textContent.toLowerCase();
          c.style.display = (!term || text.includes(term)) ? '' : 'none';
        });
      });
    }

    // Clean industry select dropdown
    const indSelect = document.getElementById('salaryIndustrySelect') || document.querySelector('select');
    if (indSelect) {
      indSelect.addEventListener('change', function(e) {
        const val = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('li.css-pm9z5s, [role="listitem"]');
        cards.forEach(c => {
          if (val === 'all' || !val) {
            c.style.display = '';
          } else {
            c.style.display = c.textContent.toLowerCase().includes(val) ? '' : 'none';
          }
        });
      });
    }

    // Salary search form submit
    const salForm = document.querySelector('form.css-hl0n2x') || document.querySelector('form');
    if (salForm) {
      salForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const term = whatInput ? whatInput.value.toLowerCase().trim() : '';
        const cards = document.querySelectorAll('li.css-pm9z5s, [role="listitem"]');
        let count = 0;
        cards.forEach(c => {
          const text = c.textContent.toLowerCase();
          const match = !term || text.includes(term);
          c.style.display = match ? '' : 'none';
          if (match) count++;
        });
        showToast(term ? `Found ${count} salary records matching "${term}"` : 'Showing all salary records');
      });
    }
  }

  // ==========================================
  // 9. COUNTRIES PAGE INTERACTIVITY
  // ==========================================
  function initCountriesInteractivity() {
    const path = (window.location && window.location.pathname) || '';
    const title = (document && document.title) || '';
    if (!path.includes('countries') && !title.includes('Worldwide')) return;

    const input = document.querySelector('#worldwide-search, input[type="search"], input[placeholder*="Search"]');
    const items = document.querySelectorAll('li[role="option"], li.eyrz3l11, li:has(a), [role="listitem"]');

    if (input) {
      input.addEventListener('input', function(e) {
        const term = e.target.value.toLowerCase().trim();
        items.forEach(it => {
          if (it.closest('nav') || it.closest('header') || it.closest('footer')) return;
          const text = it.textContent.toLowerCase();
          it.style.display = (!term || text.includes(term)) ? 'flex' : 'none';
        });
      });
    }

    items.forEach(it => {
      if (it.closest('nav') || it.closest('header') || it.closest('footer')) return;
      it.style.cursor = 'pointer';
      it.addEventListener('click', function(e) {
        e.preventDefault();
        const flagEl = it.querySelector('.css-bctmig, [class*="flag"]');
        const flag = flagEl ? flagEl.textContent.trim() : '';
        const textEl = it.querySelector('.css-1n097na') || it.querySelector('.css-14d01z5') || it;
        const rawText = textEl.textContent.trim();
        
        let country = 'India';
        let lang = 'English';
        let code = 'IN';
        let langCode = 'En';

        if (rawText.includes('हिन्दी') || rawText.includes('Hindi')) {
          country = 'India';
          lang = 'हिन्दी';
          code = 'IN';
          langCode = 'Hi';
        } else if (rawText.includes('United States')) {
          country = 'United States';
          code = 'US';
          lang = 'English';
          langCode = 'En';
        } else if (rawText.includes('United Kingdom')) {
          country = 'United Kingdom';
          code = 'GB';
          lang = 'English';
          langCode = 'En';
        } else if (rawText.includes('Canada')) {
          country = 'Canada';
          code = 'CA';
          lang = 'English';
          langCode = 'En';
        } else if (rawText.includes('Australia')) {
          country = 'Australia';
          code = 'AU';
          lang = 'English';
          langCode = 'En';
        } else {
          country = rawText.split('(')[0].trim();
          code = country.substring(0, 2).toUpperCase();
        }

        const pref = { country, code, flag, lang, langCode };
        try {
          localStorage.setItem('preferred_country_lang', JSON.stringify(pref));
          localStorage.setItem('user_country', code);
          localStorage.setItem('user_lang', langCode);
          localStorage.setItem('Move ONN_country', JSON.stringify(pref));
        } catch(err) {}

        showToast('Selected: ' + flag + ' ' + country + ' (' + lang + '). Redirecting...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 350);
      });
    });
  }

  // ==========================================
  // 10. HIRE / EMPLOYERS INTERACTIVITY
  // ==========================================
  function initHireInteractivity() {
    const postJobBtns = document.querySelectorAll('a[href*="hire"], button:has(span), .post-job-btn');
    postJobBtns.forEach(btn => {
      if (btn.textContent.trim().toLowerCase().includes('post a job')) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          openPostJobModal();
        });
      }
    });
  }

  // ==========================================
  // 11. TRENDING ACCORDION
  // ==========================================
  function initTrendingAccordion() {
    const trendingBtn = document.getElementById('btnTrendingAccordion') || 
                        document.querySelector('button[aria-controls="moveonnTrendingBody"]') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes("trending on Move ONN"));
    const trendingBody = document.getElementById('moveonnTrendingBody');

    if (trendingBtn && trendingBody) {
      trendingBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const isExpanded = trendingBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          trendingBtn.setAttribute('aria-expanded', 'false');
          trendingBody.style.display = 'none';
          const chevron = document.getElementById('trendingChevron') || trendingBtn.querySelector('svg');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        } else {
          trendingBtn.setAttribute('aria-expanded', 'true');
          trendingBody.style.display = 'block';
          const chevron = document.getElementById('trendingChevron') || trendingBtn.querySelector('svg');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
      };

      // Ensure every trending link is functional
      trendingBody.querySelectorAll('a').forEach(a => {
        a.onclick = function(e) {
          const href = a.getAttribute('href');
          if (href && href !== '#') {
            window.location.href = href;
          }
        };
      });
    }
  }

  // ==========================================
  // 12. COOKIE BANNER & PREFERENCE CENTER
  // ==========================================
  function hideAllCookieBanners() {
    const banners = document.querySelectorAll('#onetrust-consent-sdk, #onetrust-consent-sdk-legacy, [id*="onetrust"], .onetrust-pc-dark-filter');
    banners.forEach(b => {
      b.style.setProperty('display', 'none', 'important');
    });
  }

  function initCookieBanner() {
    const consent = localStorage.getItem('cookies_rejected');
    const user = localStorage.getItem('Move ONN_user');

    // If user already decided or is signed in, never show cookie banner
    if (consent || user) {
      hideAllCookieBanners();
      return;
    }

    // Direct event listeners on buttons
    const acceptBtn = document.getElementById('onetrust-accept-btn-handler');
    const rejectBtn = document.getElementById('onetrust-reject-all-handler');
    const settingsBtn = document.getElementById('onetrust-pc-btn-handler');

    if (acceptBtn) {
      acceptBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('cookies_rejected', 'true');
        hideAllCookieBanners();
        showToast('All cookies accepted.');
      };
    }

    if (rejectBtn) {
      rejectBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('cookies_rejected', 'true');
        hideAllCookieBanners();
        showToast('All non-essential cookies rejected.');
      };
    }

    if (settingsBtn) {
      settingsBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        openCookiePreferencesModal();
      };
    }
  }

  function openCookiePreferencesModal() {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e4e2e0; padding-bottom:16px; margin-bottom:16px;">
        <h3 style="margin:0; font-size:20px; font-weight:700; color:#2d2d2d;">Cookie Preference Centre</h3>
        <button id="closeCookieModalBtn" type="button" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#595959;">✕</button>
      </div>
      <p style="font-size:14px; color:#595959; line-height:1.5; margin:0 0 20px;">
        When you visit our website, it may store or retrieve information on your browser, mostly in the form of cookies. You can choose not to allow some types of cookies.
      </p>

      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
        <!-- 1. Strictly Necessary -->
        <div style="border:1px solid #d4d2d0; border-radius:8px; padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#2d2d2d; font-size:15px;">Strictly Necessary Cookies</strong>
            <span style="font-size:12px; font-weight:700; color:#1f662c; background:#e4f7e6; padding:4px 10px; border-radius:999px;">Always Active</span>
          </div>
          <p style="font-size:13px; color:#767676; margin:6px 0 0;">Necessary for the website to function properly and cannot be switched off.</p>
        </div>

        <!-- 2. Performance -->
        <div style="border:1px solid #d4d2d0; border-radius:8px; padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#2d2d2d; font-size:15px;">Performance Cookies</strong>
            <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
              <input type="checkbox" id="cookieTogglePerf" checked style="opacity:0; width:0; height:0;">
              <span style="position:absolute; inset:0; background:#1264e8; border-radius:24px; transition:0.2s;"></span>
            </label>
          </div>
          <p style="font-size:13px; color:#767676; margin:6px 0 0;">Allows us to count visits and traffic sources to measure and improve site performance.</p>
        </div>

        <!-- 3. Functional -->
        <div style="border:1px solid #d4d2d0; border-radius:8px; padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#2d2d2d; font-size:15px;">Functional Cookies</strong>
            <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
              <input type="checkbox" id="cookieToggleFunc" checked style="opacity:0; width:0; height:0;">
              <span style="position:absolute; inset:0; background:#1264e8; border-radius:24px; transition:0.2s;"></span>
            </label>
          </div>
          <p style="font-size:13px; color:#767676; margin:6px 0 0;">Enables enhanced functionality and personalization, such as job alerts and saved filters.</p>
        </div>

        <!-- 4. Targeting -->
        <div style="border:1px solid #d4d2d0; border-radius:8px; padding:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#2d2d2d; font-size:15px;">Targeting Cookies</strong>
            <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
              <input type="checkbox" id="cookieToggleTarget" checked style="opacity:0; width:0; height:0;">
              <span style="position:absolute; inset:0; background:#1264e8; border-radius:24px; transition:0.2s;"></span>
            </label>
          </div>
          <p style="font-size:13px; color:#767676; margin:6px 0 0;">Used by advertising partners to build a profile of your interests and show relevant ads.</p>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px;">
        <button id="cookieModalRejectAll" type="button" style="background:#ffffff; color:#1264e8; border:1px solid #1264e8; border-radius:8px; padding:10px 20px; font-weight:700; font-size:14px; cursor:pointer;">Reject All</button>
        <button id="cookieModalConfirm" type="button" style="background:#1264e8; color:#ffffff; border:none; border-radius:8px; padding:10px 24px; font-weight:700; font-size:14px; cursor:pointer;">Confirm My Choices</button>
      </div>
    `;

    overlay.style.display = 'flex';

    document.getElementById('closeCookieModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('cookieModalRejectAll').onclick = function() {
      localStorage.setItem('cookies_rejected', 'true');
      hideAllCookieBanners();
      overlay.style.display = 'none';
      showToast('All non-essential cookies rejected.');
    };

    document.getElementById('cookieModalConfirm').onclick = function() {
      localStorage.setItem('cookies_rejected', 'custom');
      hideAllCookieBanners();
      overlay.style.display = 'none';
      showToast('Cookie preferences saved.');
    };
  }

  // ==========================================
  // 13. MODAL DIALOGS SYSTEM
  // ==========================================
  function initModalSystem() {
    if (!document.getElementById('moveonnModalOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'moveonnModalOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999999;display:none;align-items:center;justify-content:center;padding:16px;font-family:"Move ONN Sans",sans-serif;backdrop-filter:blur(2px);';
      overlay.innerHTML = '<div id="moveonnModalContent" style="background:#fff;border-radius:12px;max-width:540px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;position:relative;box-shadow:0 12px 32px rgba(0,0,0,0.25);"></div>';
      document.body.appendChild(overlay);

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    }
  }

  function openApplyModal(jobTitle) {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');
    const user = JSON.parse(localStorage.getItem('Move ONN_user') || '{"name":"","email":""}');

    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e4e2e0;padding-bottom:16px;margin-bottom:20px;">
        <h3 style="margin:0;font-size:20px;font-weight:700;color:#2d2d2d;">Apply to ${jobTitle}</h3>
        <button id="closeModalBtn" style="border:none;background:transparent;font-size:22px;cursor:pointer;color:#595959;">✕</button>
      </div>
      <form id="quickApplyForm" style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Full Name *</label>
          <input type="text" id="applyName" required value="${user.name || ''}" placeholder="Full name" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Email Address *</label>
          <input type="email" id="applyEmail" required value="${user.email || ''}" placeholder="Email address" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Contact Phone *</label>
          <input type="tel" id="applyPhone" required placeholder="Phone number" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Resume / CV</label>
          <input type="file" style="width:100%;padding:8px;border:1px dashed #767676;border-radius:8px;font-size:14px;box-sizing:border-box;">
        </div>
        <button type="submit" style="margin-top:8px;background:#1264e8;color:#fff;border:none;padding:14px;border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;transition:background 0.2s;">Submit Application</button>
      </form>
    `;

    overlay.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('quickApplyForm').onsubmit = function(e) {
      e.preventDefault();
      content.innerHTML = `
        <div style="text-align:center;padding:32px 16px;">
          <div style="width:64px;height:64px;background:#e4f7e6;color:#1f662c;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px;">✓</div>
          <h3 style="margin:0 0 8px;font-size:22px;color:#2d2d2d;">Application Submitted!</h3>
          <p style="color:#595959;font-size:15px;margin:0 0 24px;">Your application for <strong>${jobTitle}</strong> was successfully received by the hiring team.</p>
          <button id="finishApplyBtn" style="background:#1264e8;color:#fff;border:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:15px;cursor:pointer;">Done</button>
        </div>
      `;
      document.getElementById('finishApplyBtn').onclick = () => overlay.style.display = 'none';
    };
  }

  function openResumeUploadModal() {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');

    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e4e2e0;padding-bottom:16px;margin-bottom:20px;">
        <h3 style="margin:0;font-size:20px;font-weight:700;color:#2d2d2d;">Upload Your Resume</h3>
        <button id="closeModalBtn" style="border:none;background:transparent;font-size:22px;cursor:pointer;color:#595959;">✕</button>
      </div>
      <div style="border:2px dashed #004fcb; border-radius:12px; padding:36px 20px; text-align:center; background:#f7f9ff; margin-bottom:20px;">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="#004fcb" style="margin-bottom:12px;"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
        <div style="font-weight:700; font-size:16px; color:#2d2d2d; margin-bottom:6px;">Upload a PDF, Word document, or image</div>
        <div style="font-size:13px; color:#767676; margin-bottom:16px;">Files supported: .pdf, .doc, .docx, .rtf, .txt (up to 10 MB)</div>
        <input type="file" id="resumeFileInput" style="display:none;">
        <button type="button" onclick="document.getElementById('resumeFileInput').click()" style="background:#1264e8; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:700; font-size:14px; cursor:pointer;">Select file</button>
      </div>
    `;

    overlay.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('resumeFileInput').onchange = function() {
      showToast('Resume uploaded and attached to your Move ONN profile!');
      overlay.style.display = 'none';
    };
  }

  function openPostJobModal() {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');

    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e4e2e0;padding-bottom:16px;margin-bottom:20px;">
        <h3 style="margin:0;font-size:20px;font-weight:700;color:#2d2d2d;">Post a Job on Move ONN</h3>
        <button id="closeModalBtn" style="border:none;background:transparent;font-size:22px;cursor:pointer;color:#595959;">✕</button>
      </div>
      <form id="postJobForm" style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Job Title *</label>
          <input type="text" id="postJobTitle" required placeholder="Job title" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Company Name *</label>
          <input type="text" id="postJobCompany" required placeholder="Company name" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Job Location *</label>
          <input type="text" id="postJobLocation" required placeholder="City or location" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block;font-size:13px;font-weight:700;color:#2d2d2d;margin-bottom:6px;">Salary Range (₹ per year)</label>
          <input type="text" id="postJobSalary" placeholder="Annual salary range" style="width:100%;padding:10px 14px;border:1px solid #767676;border-radius:8px;font-size:15px;box-sizing:border-box;">
        </div>
        <button type="submit" style="margin-top:8px;background:#1264e8;color:#fff;border:none;padding:14px;border-radius:8px;font-weight:700;font-size:16px;cursor:pointer;">Publish Job</button>
      </form>
    `;

    overlay.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('postJobForm').onsubmit = function(e) {
      e.preventDefault();
      const title = document.getElementById('postJobTitle').value;
      showToast(`Job "${title}" published successfully!`);
      overlay.style.display = 'none';
      setTimeout(() => window.location.href = 'jobs.html', 600);
    };
  }

  function showInfoModal(type, title) {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');

    const descriptions = {
      'help': 'Need assistance with your job search or employer account? Our comprehensive Help Centre provides step-by-step guidance on creating resumes, tracking applications, verifying company reviews, and optimizing search alerts.',
      'about': 'Move ONN is a premier tech recruitment and staffing consultancy empowering candidates and leading organizations with high-velocity hiring.',
      'terms': 'By accessing or using the Move ONN platform, you agree to our Terms of Service and Professional Policies designed to protect candidates and employers.',
      'privacy': 'Move ONN Consultancy is strictly committed to protecting candidate confidentiality and personal data under international privacy standards.',
      'career advice': 'Explore expert career advice, resume formatting guidelines, interview preparation strategies, and career path progression guides crafted by industry professionals.'
    };

    const desc = descriptions[type.toLowerCase()] || `Detailed information regarding ${title}. All consultancy services and features are fully operational within the Move ONN portal.`;

    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e4e2e0;padding-bottom:16px;margin-bottom:16px;">
        <h3 style="margin:0;font-size:20px;font-weight:700;color:#2d2d2d;">${title}</h3>
        <button id="closeModalBtn" style="border:none;background:transparent;font-size:22px;cursor:pointer;color:#595959;">✕</button>
      </div>
      <p style="color:#424242;font-size:15px;line-height:1.6;margin:0 0 24px;">${desc}</p>
      <div style="text-align:right;">
        <button id="closeInfoBtn" style="background:#1264e8;color:#fff;border:none;padding:10px 22px;border-radius:8px;font-weight:700;font-size:14px;cursor:pointer;">Close</button>
      </div>
    `;

    overlay.style.display = 'flex';
    document.getElementById('closeModalBtn').onclick = () => overlay.style.display = 'none';
    document.getElementById('closeInfoBtn').onclick = () => overlay.style.display = 'none';
  }

  // Toast Helper
  function showToast(msg) {
    let toast = document.getElementById('moveonn-local-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'moveonn-local-toast';
      toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#2d2d2d;color:#fff;padding:12px 24px;border-radius:9999px;font-weight:600;font-size:14px;z-index:99999999;box-shadow:0 8px 24px rgba(0,0,0,0.25);display:none;font-family:"Move ONN Sans",sans-serif;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
      toast.style.display = 'none';
    }, 2800);
  }


  // ==========================================
  // GLOBAL DOCUMENT-LEVEL CLICK DELEGATION
  // Ensures 100% of buttons across the entire website respond
  // ==========================================
  function initGlobalButtonDelegation() {
    document.addEventListener('click', function(e) {
      // 0a. Mobile burger clicks
      const burgerBtn = e.target.closest('[data-gnav-element-name="BurgerMenu"], #mobileBurgerBtn, .gnav-header-1m0jm2k, button[aria-controls="gnav-burger-menu-nav"], .mobile-menu-btn, .gnav-header-114vi1p button');
      if (burgerBtn) {
        e.preventDefault();
        e.stopPropagation();
        openMobileMenu();
        return;
      }

      // 0b. Country & language clicks
      const countryBtn = e.target.closest(
        '[data-gnav-element-name="CountryLanguage"], ' +
        '[data-gnav-element-name="ChangeCountries"], ' +
        '.gnav-header-4g10na, ' +
        '#hdrCountryLangBtn, ' +
        '#menu-item-country-lang, ' +
        '#menuCountryLangBtn, ' +
        '#mobileDrawerCountryBtn, ' +
        '.country-badge, ' +
        '.css-1axs7x6, ' +
        '.css-e7gw3r'
      );
      if (countryBtn) {
        e.preventDefault();
        e.stopPropagation();
        const openMenu = document.getElementById('moveonnUserDropdownMenu') || document.getElementById('userMenuDropdown');
        if (openMenu) openMenu.remove();
        closeMobileMenu();
        window.location.href = 'countries.html';
        return;
      }

      // 0c. Profile & Resume clicks
      const profileBtn = e.target.closest(
        '#menu-item-profile, ' +
        '#mobileDrawerProfileBtn, ' +
        '#menuProfileResumeBtn, ' +
        '[data-gnav-element-name="ProfileResume"]'
      );
      let isProfileResume = !!profileBtn;
      if (!isProfileResume) {
        const textCandidate = e.target.closest('a, button, div');
        if (textCandidate && textCandidate.textContent && textCandidate.textContent.trim().toLowerCase().includes('profile & resume')) {
          isProfileResume = true;
        }
      }
      if (isProfileResume) {
        e.preventDefault();
        e.stopPropagation();
        const openMenu = document.getElementById('moveonnUserDropdownMenu') || document.getElementById('userMenuDropdown');
        if (openMenu) openMenu.remove();
        closeMobileMenu();
        openProfileModal();
        return;
      }

      // 0d. Sign Out clicks
      const signOutBtn = e.target.closest('#btnSignOutLocal, #btnMobileDrawerSignOut, #btnMoveonnSignOut');
      let isSignOut = !!signOutBtn;
      if (!isSignOut) {
        const textCandidate = e.target.closest('button, a');
        if (textCandidate && textCandidate.textContent && textCandidate.textContent.trim().toLowerCase() === 'sign out') {
          isSignOut = true;
        }
      }
      if (isSignOut) {
        e.preventDefault();
        e.stopPropagation();
        performLocalSignOut();
        return;
      }
      // 1. Cookie Buttons delegation
      if (e.target.closest('#onetrust-accept-btn-handler') || (e.target.tagName === 'BUTTON' && e.target.textContent.trim().toLowerCase() === 'accept all cookies')) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('cookies_rejected', 'true');
        hideAllCookieBanners();
        showToast('All cookies accepted.');
        return;
      }

      if (e.target.closest('#onetrust-reject-all-handler') || (e.target.tagName === 'BUTTON' && e.target.textContent.trim().toLowerCase() === 'reject all')) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('cookies_rejected', 'true');
        hideAllCookieBanners();
        showToast('All non-essential cookies rejected.');
        return;
      }

      if (e.target.closest('#onetrust-pc-btn-handler') || (e.target.tagName === 'BUTTON' && e.target.textContent.trim().toLowerCase() === 'cookies settings')) {
        e.preventDefault();
        e.stopPropagation();
        openCookiePreferencesModal();
        return;
      }

      // 2. Add Pay button
      const addPayBtn = e.target.closest('#btnAddPay, button:has(span:contains("Add pay"))');
      if (addPayBtn && addPayBtn.id === 'btnAddPay') {
        e.preventDefault();
        openAddPayModal();
        return;
      }

      // 3. Upload Resume button
      const uploadResumeBtn = e.target.closest('a[href*="resume"], button:has(span)');
      if (uploadResumeBtn && uploadResumeBtn.textContent.trim().toLowerCase().includes('upload a resume')) {
        e.preventDefault();
        openResumeUploadModal();
        return;
      }

      // 4. Build Resume button
      if (uploadResumeBtn && uploadResumeBtn.textContent.trim().toLowerCase().includes('build a resume')) {
        e.preventDefault();
        openResumeBuilderModal();
        return;
      }

      
      // 6. Navigation Routers
      const targetText = e.target.textContent.trim().toLowerCase();
      if (e.target.tagName === 'A' || e.target.closest('a')) {
         const anchor = e.target.closest('a') || e.target;
         const text = anchor.textContent.trim().toLowerCase();
         const aria = (anchor.getAttribute('aria-label') || '').toLowerCase();
         
         if (text === 'sign in' || aria === 'sign in') {
             e.preventDefault();
             e.stopPropagation();
             window.location.href = 'signin.html';
             return;
         }
         
         if (text.includes('employers / post job')) {
             e.preventDefault();
             e.stopPropagation();
             window.location.href = 'index.html';
             return;
         }
         
         if (text === 'company reviews' || aria.includes('company reviews')) {
             e.preventDefault();
             e.stopPropagation();
             window.location.href = 'companies.html';
             return;
         }
         
         if (text === 'salary guide' || aria.includes('salary guide')) {
             e.preventDefault();
             e.stopPropagation();
             window.location.href = 'salaries.html';
             return;
         }
         
         if (text === 'home' || text === 'find jobs' || anchor.id === 'FindJobs' || anchor.getAttribute('data-gnav-element-name') === 'FindJobs') {
             e.preventDefault();
             e.stopPropagation();
             window.location.href = 'index.html';
             return;
         }
         if (anchor.id === 'moveonn-globalnav-logo' || anchor.getAttribute('data-gnav-element-name') === 'Logo') {
             e.preventDefault();
             e.stopPropagation();
             window.location.href = 'index.html';
             return;
         }
      }

      // 5. Salaries Clear (X) button
      const clearWhere = e.target.closest('#clear-location-localized, button[aria-label*="clear search input"]');
      if (clearWhere) {
        e.preventDefault();
        const input = document.getElementById('input-location-autocomplete') || document.querySelector('input[placeholder="Location"]');
        if (input) {
          input.value = '';
          input.focus();
        }
        return;
      }

      // 6. Salaries Industry Combobox
      const combobox = e.target.closest('[role="combobox"], #\:R9nalam\:, .css-xn1avf');
      if (combobox && window.location.href.toLowerCase().includes('salaries')) {
        e.preventDefault();
        toggleIndustryDropdown(combobox);
        return;
      }

      // 7. Salaries Search Button
      const salarySearchBtn = e.target.closest('#title-location-search-btn');
      if (salarySearchBtn) {
        e.preventDefault();
        const what = document.getElementById('input-title-autocomplete')?.value || '';
        const where = document.getElementById('input-location-autocomplete')?.value || '';
        window.location.href = 'jobs.html?q=' + encodeURIComponent(what) + '&l=' + encodeURIComponent(where);
        return;
      }

      // 8. 5-star employer review stars
      const star = e.target.closest('.star-rating-star, [data-testid*="star"], span[class*="star"]');
      if (star) {
        showToast('Thank you! Your employer rating has been recorded.');
        return;
      }
    }, true);
  }

  // Add Pay Modal
  function openAddPayModal() {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e4e2e0; padding-bottom:16px; margin-bottom:20px;">
        <h3 style="margin:0; font-size:20px; font-weight:700; color:#2d2d2d;">Add target pay</h3>
        <button id="closePayModalBtn" type="button" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#595959;">✕</button>
      </div>
      <p style="font-size:14px; color:#595959; margin:0 0 16px;">Set your desired minimum pay to see jobs that match your salary expectations.</p>
      <form id="addPayForm" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Minimum pay amount (₹) *</label>
          <input type="number" id="payAmountInput" required placeholder="Minimum pay amount" value="" style="width:100%; padding:10px 14px; border:1px solid #767676; border-radius:8px; font-size:15px; box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Pay period</label>
          <select id="payPeriodSelect" style="width:100%; padding:10px 14px; border:1px solid #767676; border-radius:8px; font-size:15px; box-sizing:border-box; background:#fff;">
            <option value="per month" selected>per month</option>
            <option value="per year">per year</option>
            <option value="per hour">per hour</option>
          </select>
        </div>
        <button type="submit" style="background:#1264e8; color:#fff; border:none; padding:12px; border-radius:8px; font-weight:700; font-size:15px; cursor:pointer; margin-top:8px;">Save pay</button>
      </form>
    `;

    overlay.style.display = 'flex';
    document.getElementById('closePayModalBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('addPayForm').onsubmit = function(e) {
      e.preventDefault();
      const amount = document.getElementById('payAmountInput').value;
      const period = document.getElementById('payPeriodSelect').value;
      const chip = document.getElementById('btnAddPay');
      if (chip) {
        chip.innerHTML = `<span style="color:#004fcb; font-weight:700;">₹ ${parseInt(amount).toLocaleString()} ${period}</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-left:4px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
      }
      overlay.style.display = 'none';
      showToast(`Target pay set to ₹ ${parseInt(amount).toLocaleString()} ${period}`);
    };
  }

  // Resume Builder Modal
  function openResumeBuilderModal() {
    const overlay = document.getElementById('moveonnModalOverlay');
    const content = document.getElementById('moveonnModalContent');
    if (!overlay || !content) return;

    content.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e4e2e0; padding-bottom:16px; margin-bottom:20px;">
        <h3 style="margin:0; font-size:20px; font-weight:700; color:#2d2d2d;">Move ONN Resume Builder</h3>
        <button id="closeBuilderBtn" type="button" style="border:none; background:transparent; font-size:22px; cursor:pointer; color:#595959;">✕</button>
      </div>
      <form id="resumeBuilderForm" style="display:flex; flex-direction:column; gap:14px;">
        <div>
          <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Target Job Title *</label>
          <input type="text" id="builderTitle" required placeholder="Target job title" value="" style="width:100%; padding:10px 14px; border:1px solid #767676; border-radius:8px; font-size:15px; box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Core Skills *</label>
          <input type="text" id="builderSkills" required placeholder="Core skills" value="" style="width:100%; padding:10px 14px; border:1px solid #767676; border-radius:8px; font-size:15px; box-sizing:border-box;">
        </div>
        <div>
          <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Experience (years)</label>
          <input type="number" id="builderExp" placeholder="Experience" value="" min="0" max="40" style="width:100%; padding:10px 14px; border:1px solid #767676; border-radius:8px; font-size:15px; box-sizing:border-box;">
        </div>
        <button type="submit" style="background:#1264e8; color:#fff; border:none; padding:12px; border-radius:8px; font-weight:700; font-size:15px; cursor:pointer; margin-top:8px;">Generate & Save Move ONN Resume</button>
      </form>
    `;

    overlay.style.display = 'flex';
    document.getElementById('closeBuilderBtn').onclick = () => overlay.style.display = 'none';

    document.getElementById('resumeBuilderForm').onsubmit = function(e) {
      e.preventDefault();
      overlay.style.display = 'none';
      showToast('Move ONN Resume generated and added to your profile!');
    };
  }

  // Industry Dropdown Toggler for Salaries
  function toggleIndustryDropdown(combobox) {
    let menu = document.getElementById('moveonnIndustryMenu');
    if (menu) {
      menu.remove();
      return;
    }

    menu = document.createElement('div');
    menu.id = 'moveonnIndustryMenu';
    menu.style.cssText = 'position:absolute; top:100%; left:0; right:0; background:#fff; border:1px solid #d4d2d0; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.15); z-index:9999; max-height:260px; overflow-y:auto; margin-top:4px; font-family:"Move ONN Sans",sans-serif;';

    const industries = [
      'All Industries',
      'Technology',
      'Healthcare',
      'Finance & Accounting',
      'Sales & Marketing',
      'Human Resources',
      'Management & Operations',
      'Retail & Customer Service'
    ];

    industries.forEach(ind => {
      const item = document.createElement('div');
      item.textContent = ind;
      item.style.cssText = 'padding:10px 16px; font-size:14px; color:#2d2d2d; cursor:pointer; transition:background 0.15s;';
      item.onmouseover = () => item.style.background = '#f3f2f1';
      item.onmouseout = () => item.style.background = '#fff';
      item.onclick = function() {
        const label = combobox.querySelector('.css-ew4qyo, span');
        if (label) label.textContent = ind;
        menu.remove();

        // Filter cards on page
        const val = ind.toLowerCase();
        const cards = document.querySelectorAll('li.css-pm9z5s, li:has([class*="salary"]), [role="listitem"]');
        cards.forEach(c => {
          if (val === 'all industries') {
            c.style.display = '';
          } else {
            const matches = c.textContent.toLowerCase().includes(val.split(' ')[0]);
            c.style.display = matches ? '' : 'none';
          }
        });
      };
      menu.appendChild(item);
    });

    combobox.parentElement.style.position = 'relative';
    combobox.parentElement.appendChild(menu);
  }

    
  // ==========================================
  // COUNTRY & LANGUAGE SELECTOR MODAL
  // ==========================================
  function openCountryLangModal(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    let overlay = document.getElementById('countryLangModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'countryLangModalOverlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000000;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(3px);font-family:"Move ONN Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
      
      let saved = {};
      try { saved = JSON.parse(localStorage.getItem('preferred_country_lang') || '{}'); } catch(err) {}
      const curCountry = saved.code || localStorage.getItem('user_country') || 'IN';
      const curLang = saved.langCode || localStorage.getItem('user_lang') || 'En';

      overlay.innerHTML = `
        <div style="background:#ffffff; border-radius:16px; width:92%; max-width:440px; padding:28px; box-shadow:0 16px 40px rgba(0,0,0,0.25); position:relative;">
          <button type="button" id="btnCloseCountryLangModalX" style="position:absolute; top:16px; right:16px; background:transparent; border:none; font-size:24px; cursor:pointer; color:#767676; line-height:1;">&times;</button>
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1b76ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <div>
              <h3 style="font-size:18px; font-weight:700; color:#121224; margin:0;">Country & Language</h3>
              <p style="font-size:13px; color:#717b9e; margin:2px 0 0;">Select your country and preferred language</p>
            </div>
          </div>
          <div style="margin-bottom:18px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Country / Region</label>
            <select id="countrySelectDropdown" style="width:100%; padding:10px 14px; border:1px solid #d4d2d0; border-radius:8px; font-size:14px; color:#121224; background:#fff; outline:none; cursor:pointer;">
              <option value="IN" ${curCountry === 'IN' ? 'selected' : ''}>India (INR ₹)</option>
              <option value="US" ${curCountry === 'US' ? 'selected' : ''}>United States (USD $)</option>
              <option value="GB" ${curCountry === 'GB' ? 'selected' : ''}>United Kingdom (GBP £)</option>
              <option value="CA" ${curCountry === 'CA' ? 'selected' : ''}>Canada (CAD $)</option>
              <option value="AE" ${curCountry === 'AE' ? 'selected' : ''}>United Arab Emirates (AED)</option>
              <option value="SG" ${curCountry === 'SG' ? 'selected' : ''}>Singapore (SGD $)</option>
              <option value="AU" ${curCountry === 'AU' ? 'selected' : ''}>Australia (AUD $)</option>
              <option value="DE" ${curCountry === 'DE' ? 'selected' : ''}>Germany (EUR €)</option>
            </select>
          </div>
          <div style="margin-bottom:24px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#2d2d2d; margin-bottom:6px;">Language</label>
            <select id="langSelectDropdown" style="width:100%; padding:10px 14px; border:1px solid #d4d2d0; border-radius:8px; font-size:14px; color:#121224; background:#fff; outline:none; cursor:pointer;">
              <option value="En" ${curLang === 'En' ? 'selected' : ''}>English</option>
              <option value="Hi" ${curLang === 'Hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
            </select>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="btnCancelCountryLangModal" style="padding:10px 18px; border:1px solid #d4d2d0; background:#fff; color:#2d2d2d; border-radius:8px; font-size:14px; font-weight:600; cursor:pointer;">Cancel</button>
            <button type="button" id="btnSaveCountryLangModal" style="padding:10px 24px; border:none; background:#1b76ff; color:#fff; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; transition:background 0.15s;">Apply Preferences</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      overlay.onclick = function(ev) {
        if (ev.target === overlay) closeCountryLangModal();
      };
      overlay.querySelector('#btnCloseCountryLangModalX').onclick = closeCountryLangModal;
      overlay.querySelector('#btnCancelCountryLangModal').onclick = closeCountryLangModal;
      overlay.querySelector('#btnSaveCountryLangModal').onclick = saveCountryLangPreferences;
    }
    overlay.style.display = 'flex';
  }

  function closeCountryLangModal() {
    const overlay = document.getElementById('countryLangModalOverlay');
    if (overlay) overlay.style.display = 'none';
    const legacyModal = document.getElementById('countryLangModal');
    if (legacyModal) legacyModal.style.display = 'none';
  }

  function saveCountryLangPreferences() {
    const countryEl = document.getElementById('countrySelectDropdown') || document.getElementById('countrySelectInput');
    const langEl = document.getElementById('langSelectDropdown') || document.getElementById('langSelectInput');
    const code = countryEl ? countryEl.value : 'IN';
    const langCode = langEl ? langEl.value : 'En';
    const flagMap = { IN: '', US: '', GB: '', CA: '', AE: '', SG: '', AU: '', DE: '' };
    const countryNames = { IN: 'India', US: 'United States', GB: 'United Kingdom', CA: 'Canada', AE: 'UAE', SG: 'Singapore', AU: 'Australia', DE: 'Germany' };
    const flag = flagMap[code] || '';
    const countryName = countryNames[code] || 'India';
    const lang = langCode === 'Hi' ? 'हिन्दी' : 'English';

    try {
      localStorage.setItem('user_country', code);
      localStorage.setItem('user_lang', langCode);
      localStorage.setItem('preferred_country_lang', JSON.stringify({ country: countryName, code, flag, lang, langCode }));
    } catch(e) {}

    // Update all CountryLanguage elements in DOM
    document.querySelectorAll('[data-gnav-element-name="CountryLanguage"], .gnav-header-4g10na, #headerCountryBadge, .country-badge').forEach(el => {
      el.innerHTML = '<span aria-hidden="true" style="margin-right:4px; font-weight:700;">' + code + '</span>' + langCode;
    });

    closeCountryLangModal();
    showToast('Preferences updated: ' + countryName + ' (' + lang + ')');
  }

  // ==========================================
  // FULL-SCREEN MOBILE NAVIGATION DRAWER
  // ==========================================
  function openMobileMenu() {
    let drawer = document.getElementById('moveonnMobileMenuOverlay');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'moveonnMobileMenuOverlay';
      drawer.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;background:#ffffff;z-index:99999999;display:none;flex-direction:column;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;';
      document.body.appendChild(drawer);
    }

    const user = getLoggedInUser();
    const savedPref = JSON.parse(localStorage.getItem('preferred_country_lang') || '{"country":"India","code":"IN","flag":"","lang":"English","langCode":"En"}');

    let profileSectionHtml = '';
    if (user) {
      profileSectionHtml = `
        <div style="background:#f8f9fa; border-radius:12px; padding:18px; margin-bottom:20px; border:1px solid #e4e2e0;">
          <div style="display:flex; align-items:center; gap:14px; margin-bottom:14px;">
            <div style="width:46px; height:46px; border-radius:50%; background:#1264e8; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:17px; flex-shrink:0;">
              ${getUserInitials(user.name)}
            </div>
            <div style="overflow:hidden; flex:1;">
              <div style="font-weight:700; font-size:16px; color:#2d2d2d;">${user.name}</div>
              <div style="font-size:13px; color:#767676; margin-top:2px;">${user.email}</div>
            </div>
          </div>
          <div style="background:#ecf2ff; border-radius:6px; padding:6px 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; font-size:12px; color:#003a9b; font-weight:600;">
            <span>Profile Strength</span>
            <span>85%</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <button type="button" id="mobileDrawerProfileBtn" style="height:38px; background:#fff; border:1px solid #1264e8; color:#1264e8; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center;">Profile & Resume</button>
            <a href="jobs.html?tab=saved" style="height:38px; background:#1264e8; border:none; color:#fff; border-radius:8px; font-size:13px; font-weight:600; text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center;">My jobs</a>
          </div>
        </div>
      `;
    } else {
      profileSectionHtml = `
        <div style="margin-bottom:20px;">
          <a href="signin.html" style="display:flex; align-items:center; justify-content:center; width:100%; height:44px; background:#1264e8; color:#fff; border-radius:8px; font-size:15px; font-weight:700; text-decoration:none; box-shadow:0 2px 6px rgba(37,87,167,0.25);">Sign in</a>
        </div>
      `;
    }

    drawer.innerHTML = `
      <!-- Mobile Drawer Top Bar -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid #e4e2e0;">
        <a href="index.html" style="display:inline-flex; align-items:center; text-decoration:none;">
          <img src="assets/images/moveonn-logo.png" alt="Move ONN" style="height:38px; width:auto; max-height:42px; object-fit:contain; display:block;">
        </a>
        <button type="button" id="btnCloseMobileDrawer" aria-label="Close menu" style="background:transparent; border:none; font-size:26px; color:#2d2d2d; cursor:pointer; width:40px; height:40px; display:flex; align-items:center; justify-content:center; line-height:1;">&times;</button>
      </div>

      <!-- Drawer Content Body -->
      <div style="padding:20px; flex:1;">
        ${profileSectionHtml}

        <!-- Main Navigation Links with Professional Monochrome SVG Icons (NO EMOJIS) -->
        <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:24px;">
          <!-- 1. Home -->
          <a href="index.html" class="mobile-nav-link" style="display:flex; align-items:center; gap:14px; padding:12px 14px; border-radius:8px; color:#2d2d2d; font-size:15px; font-weight:600; text-decoration:none; transition:background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
          </a>

          <!-- 2. Jobs -->
          <a href="jobs.html" class="mobile-nav-link" style="display:flex; align-items:center; gap:14px; padding:12px 14px; border-radius:8px; color:#2d2d2d; font-size:15px; font-weight:600; text-decoration:none; transition:background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span>Jobs</span>
          </a>

          <!-- 3. Company reviews -->
          <a href="companies.html" class="mobile-nav-link" style="display:flex; align-items:center; gap:14px; padding:12px 14px; border-radius:8px; color:#2d2d2d; font-size:15px; font-weight:600; text-decoration:none; transition:background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line><line x1="9" y1="6" x2="9" y2="6.01"></line><line x1="15" y1="6" x2="15" y2="6.01"></line><line x1="9" y1="10" x2="9" y2="10.01"></line><line x1="15" y1="10" x2="15" y2="10.01"></line><line x1="9" y1="14" x2="9" y2="14.01"></line><line x1="15" y1="14" x2="15" y2="14.01"></line><line x1="9" y1="18" x2="9" y2="18.01"></line><line x1="15" y1="18" x2="15" y2="18.01"></line></svg>
            <span>Company reviews</span>
          </a>

          <!-- 4. Salary guide -->
          <a href="salaries.html" class="mobile-nav-link" style="display:flex; align-items:center; gap:14px; padding:12px 14px; border-radius:8px; color:#2d2d2d; font-size:15px; font-weight:600; text-decoration:none; transition:background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>Salary guide</span>
          </a>

          <!-- 5. Country & language -> navigates to countries.html -->
          <a href="countries.html" id="mobileDrawerCountryBtn" style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-radius:8px; color:#2d2d2d; font-size:15px; font-weight:600; text-decoration:none; transition:background 0.15s;" onmouseover="this.style.background='#f3f2f1'" onmouseout="this.style.background='transparent'">
            <div style="display:flex; align-items:center; gap:14px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span>Country & language</span>
            </div>
            <span style="font-size:12px; font-weight:600; color:#1264e8; background:#ecf2ff; padding:4px 8px; border-radius:6px;">${savedPref.code || 'IN'} (${savedPref.langCode || 'En'})</span>
          </a>
        </div>

        <!-- Sleek, Professional Sign Out Action (if logged in) -->
        ${user ? `
          <div style="border-top:1px solid #e4e2e0; padding-top:20px; margin-top:10px;">
            <button type="button" id="btnMobileDrawerSignOut" style="width:100%; display:flex; align-items:center; justify-content:center; gap:10px; padding:11px 16px; border-radius:8px; border:1px solid #d4d2d0; background:#ffffff; color:#2d2d2d; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.15s;" onmouseover="this.style.background='#f7f6f5'; this.style.borderColor='#b4b2b1'" onmouseout="this.style.background='#ffffff'; this.style.borderColor='#d4d2d0'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#595959" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign out</span>
            </button>
          </div>
        ` : ''}
      </div>
    `;

    drawer.style.display = 'flex';
    
    // Prevent background scrolling while menu is open
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    drawer.querySelector('#btnCloseMobileDrawer').onclick = closeMobileMenu;

    const profBtn = drawer.querySelector('#mobileDrawerProfileBtn');
    if (profBtn) {
      profBtn.onclick = function() {
        closeMobileMenu();
        openProfileModal();
      };
    }

    const signOutBtn = drawer.querySelector('#btnMobileDrawerSignOut');
    if (signOutBtn) {
      signOutBtn.onclick = function() {
        closeMobileMenu();
        performLocalSignOut();
      };
    }
  }

  function closeMobileMenu() {
    const drawer = document.getElementById('moveonnMobileMenuOverlay');
    if (drawer) drawer.style.display = 'none';

    // RESTORE BACKGROUND SCROLL
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  // Ensure responsive global styles are injected
    function injectResponsiveGlobalStyles() {
    if (document.getElementById('moveonnResponsiveGlobalStyles')) return;
    const style = document.createElement('style');
    style.id = 'moveonnResponsiveGlobalStyles';
    style.textContent = `
      /* Header & Logo Container Matching jobs.html Perfectly */
      #gnav-main-container,
      #gnav-main-container.gnav {
        width: 100% !important;
        background-color: #ffffff !important;
        border-bottom: 1px solid #e4e2e0 !important;
        min-height: 72px !important;
        height: auto !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 1000 !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
      }
      #gnav-main-container.gnav .gnav-header-1p8mn4q {
        max-width: 1280px !important;
        margin: 0 auto !important;
        padding: 0 20px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        height: 72px !important;
        min-height: 72px !important;
      }
      .css-10oncn7 {
        display: flex !important;
        align-items: center !important;
        gap: 28px !important;
        height: 100% !important;
        min-height: 72px !important;
      }
      #moveonn-globalnav-logo,
      .gnav-Logo {
        display: inline-flex !important;
        align-items: center !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 50px !important;
      }
      #moveonn-globalnav-logo img,
      .gnav-Logo img,
      .brand-logo img {
        height: 48px !important;
        width: auto !important;
        display: block !important;
        object-fit: contain !important;
        margin: 0 !important;
      }
      .css-ucxzt5 {
        display: flex !important;
        align-items: center !important;
        gap: 20px !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .css-ucxzt5 li a {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        color: #2d2d2d !important;
        text-decoration: none !important;
        padding: 8px 0 !important;
        position: relative !important;
        transition: color 0.15s ease !important;
      }
      .css-ucxzt5 li a:hover,
      .css-ucxzt5 li a[aria-current="page"] {
        color: #1264e8 !important;
      }

      /* Center Hero Logo on Homepage */
      .css-p4zop2 {
        transform: none !important;
        -webkit-transform: none !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        margin: 0 auto 16px !important;
        padding: 0 !important;
      }
      .css-p4zop2 svg,
      [data-testid="account-focused-homepage"] svg,
      svg.css-d1rsnd,
      svg[aria-label="Move ONN"] {
        display: none !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      [data-testid="account-focused-homepage"] img,
      .css-p4zop2 img,
      .moveonn-hero-brand-img,
      img[src*="moveonn-hero-logo"] {
        width: 160px !important;
        max-width: 160px !important;
        height: auto !important;
        display: block !important;
        margin: 0 auto !important;
        object-fit: contain !important;
        transform: none !important;
      }

      /* Hide logged-out hero section when user is signed in */
      body.user-logged-in [data-testid="account-focused-homepage"],
      body.user-logged-in .css-14v6npv,
      body.user-logged-in .css-p4zop2,
      body.user-logged-in div[data-testid="account-focused-homepage"] {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        opacity: 0 !important;
        pointer-events: none !important;
        overflow: hidden !important;
      }

      /* UNIFORM, 100% IDENTICAL APPLY NOW BUTTONS ACROSS THE ENTIRE WEBSITE */
      .moveonn-apply-btn,
      .btn-quick-apply,
      .btn-apply-unified,
      button[onclick*="openApplyModal"],
      button[onclick*="quickApply"] {
        height: 38px !important;
        min-height: 38px !important;
        max-height: 38px !important;
        padding: 0 20px !important;
        border-radius: 9999px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        line-height: 38px !important;
        background: #1264e8 !important;
        color: #ffffff !important;
        border: none !important;
        cursor: pointer !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        white-space: nowrap !important;
        flex-shrink: 0 !important;
        text-decoration: none !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        transition: background-color 0.2s ease, transform 0.15s ease !important;
      }
      .moveonn-apply-btn:hover,
      .btn-quick-apply:hover,
      .btn-apply-unified:hover,
      button[onclick*="openApplyModal"]:hover {
        background: #1b498f !important;
        color: #ffffff !important;
      }
      .btn-quick-apply.applied {
        background: #e4f7e6 !important;
        color: #1f662c !important;
        border: 1px solid #addfb3 !important;
        cursor: default !important;
      }

      /* SEARCH & FIND JOBS BUTTONS CURVED CORNERS */
      .yosegi-InlineWhatWhere-primaryButton,
      #title-location-search-btn,
      .css-1mvjvw5,
      .css-mvjvw5,
      .css-ss49jm,
      .search-submit-btn,
      #btn-search,
      #btnMoveonnSearch,
      .btn-moveonn-search,
      #btnTrendingAccordion {
        border-radius: 9999px !important;
      }

      /* LOGGED-OUT SIGN IN LINK: clean, pill-styled, never overlaps with raw person SVG */
      [data-gnav-element-name="SignIn"] .css-114vi1p,
      [data-gnav-element-name="SignIn"] .gnav-header-114vi1p,
      [data-gnav-element-name="SignIn"] a.gnav-header-1xl6wxa {
        display: none !important;
        visibility: hidden !important;
        width: 0 !important;
        height: 0 !important;
      }

      [data-gnav-element-name="SignIn"] {
        display: flex !important;
        align-items: center !important;
      }

      [data-gnav-element-name="SignIn"] .css-6p95ih {
        display: flex !important;
        align-items: center !important;
      }

      [data-gnav-element-name="SignIn"] a.css-ubxxrl {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 6px 18px !important;
        color: #1264e8 !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        text-decoration: none !important;
        border-radius: 9999px !important;
        border: 1px solid #d4d2d0 !important;
        background: #ffffff !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
        line-height: 1.3 !important;
        transition: all 0.2s ease !important;
      }

      [data-gnav-element-name="SignIn"] a.css-ubxxrl:hover {
        background: #f0f5ff !important;
        border-color: #1264e8 !important;
      }

      /* LOGGED-IN AUTH ICONS & PROFILE AVATAR: robust, never distorted or squished */
      #injected-auth-icons {
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        list-style: none !important;
        margin: 0 8px 0 0 !important;
        padding: 0 !important;
        flex-shrink: 0 !important;
      }

      #injected-auth-icons a,
      #injected-auth-icons button {
        flex-shrink: 0 !important;
      }

      #nav-btn-profile {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        cursor: pointer !important;
        width: 36px !important;
        height: 36px !important;
        flex-shrink: 0 !important;
      }

      #nav-btn-profile > div {
        width: 36px !important;
        height: 36px !important;
        border-radius: 50% !important;
        background: #1264e8 !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 2px 6px rgba(37, 87, 167, 0.35) !important;
        flex-shrink: 0 !important;
        border: 2px solid #ffffff !important;
      }

      /* STATE MANAGEMENT FOR LOGGED OUT HERO & LOGO */
      body.user-logged-out [data-testid="account-focused-homepage"],
      body.user-logged-out .css-14v6npv,
      body:not(.user-logged-in) [data-testid="account-focused-homepage"],
      body:not(.user-logged-in) .css-14v6npv {
        display: block !important;
        visibility: visible !important;
        height: auto !important;
        min-height: auto !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        overflow: visible !important;
      }

      body.user-logged-out .css-p4zop2,
      body:not(.user-logged-in) .css-p4zop2 {
        display: flex !important;
        visibility: visible !important;
        height: auto !important;
        justify-content: center !important;
        align-items: center !important;
        padding-bottom: 0.5rem !important;
      }

      body.user-logged-out .css-p4zop2 img,
      body:not(.user-logged-in) .css-p4zop2 img,
      body.user-logged-out .moveonn-hero-brand-img,
      body:not(.user-logged-in) .moveonn-hero-brand-img {
        display: block !important;
        visibility: visible !important;
        width: 160px !important;
        max-width: 160px !important;
        height: auto !important;
        margin: 0 auto 16px !important;
        opacity: 1 !important;
        object-fit: contain !important;
      }

      body.user-logged-out button.css-1yxihf5,
      body:not(.user-logged-in) button.css-1yxihf5 {
        display: inline-flex !important;
        visibility: visible !important;
        height: auto !important;
        border-radius: 9999px !important;
      }

      body.user-logged-out #injected-signed-in-feed-container,
      body.user-logged-out #injected-auth-icons,
      body:not(.user-logged-in) #injected-signed-in-feed-container,
      body:not(.user-logged-in) #injected-auth-icons {
        display: none !important;
        height: 0 !important;
        visibility: hidden !important;
      }

      body.user-logged-in [data-gnav-element-name="SignIn"],
      body.user-logged-in a.gnav-header-1xl6wxa {
        display: none !important;
        visibility: hidden !important;
      }

      /* Non-home pages must never have trending accordion or bottom divider artifacts */
      body.page-salaries #moveonnTrendingSection,
      body.page-salaries #btnTrendingAccordion,
      body.page-companies #moveonnTrendingSection,
      body.page-companies #btnTrendingAccordion,
      body.page-jobs #moveonnTrendingSection,
      body.page-jobs #btnTrendingAccordion,
      body:not(.homepage) #moveonnTrendingSection,
      body:not(.homepage) #btnTrendingAccordion {
        display: none !important;
        height: 0 !important;
        visibility: hidden !important;
      }

      body.homepage #moveonnTrendingSection {
        display: block !important;
        visibility: visible !important;
        height: auto !important;
      }

      /* DESKTOP HORIZONTAL TRENDING LAYOUT (>= 800px) */
      @media (min-width: 800px) {
        #moveonnTrendingSection {
          width: 100% !important;
          max-width: 1200px !important;
          margin: 36px auto !important;
          padding: 0 20px !important;
          box-sizing: border-box !important;
        }
        #moveonnTrendingBody {
          width: 100% !important;
          box-sizing: border-box !important;
        }
        #moveonnTrendingBody > div,
        .moveonn-trending-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 32px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
      }

      /* MOBILE TRENDING LAYOUT (< 800px) */
      @media (max-width: 799px) {
        #moveonnTrendingSection {
          width: 100% !important;
          max-width: 100% !important;
          margin: 20px auto !important;
          padding: 0 16px !important;
          box-sizing: border-box !important;
        }
        #moveonnTrendingBody {
          width: 100% !important;
          padding: 16px !important;
          box-sizing: border-box !important;
        }
        #moveonnTrendingBody > div,
        .moveonn-trending-grid {
          display: flex !important;
          flex-direction: column !important;
          gap: 20px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
      }

      #mosaic-provider-passport-intercept,
      [id*="passport-intercept"],
      [class*="passport-intercept"],
      #credential_picker_container,
      #credential_picker_iframe,
      iframe[src*="accounts.google.com/gsi"],
      [data-google-fedcm] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        height: 0 !important;
        width: 0 !important;
        overflow: hidden !important;
      }

      /* Mobile viewports (<= 768px) */
      @media (max-width: 768px) {
        body, html {
          max-width: 100vw !important;
          overflow-x: hidden !important;
          touch-action: pan-y;
        }

        #gnav-main-container.gnav .gnav-header-1p8mn4q {
          padding: 0 16px !important;
          min-height: 64px !important;
          height: 64px !important;
        }

        /* Hide desktop nav from top bar on mobile */
        #injected-auth-icons,
        #headerAuthContainer,
        .css-1dwt2wv,
        ul.gnav-header-omjzcc,
        [data-gnav-element-name="CountryLanguage"],
        .gnav-header-1xl6wxa,
        a[aria-label="Sign in"],
        .css-6p95ih,
        .css-ucxzt5,
        .nav-links,
        .gnav-header-2nfttf {
          display: none !important;
        }

        /* Show Burger button cleanly on right */
        .gnav-header-zil1nf,
        .gnav-header-zil1nf .gnav-header-114vi1p,
        .gnav-header-zil1nf .css-114vi1p,
        #mobileBurgerBtn {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .gnav-burger-menu-state--init,
        .gnav-header-1m75d7v,
        .gnav-header-1ecmuhh {
          display: none !important;
        }

        /* MOBILE SEARCH BOX: Centered, never stuck to edge */
        .jobsearch-Layout,
        #jobsearch-Main,
        #jobsearch-HomePage,
        [role="main"],
        .css-po7lh8,
        .css-1nxtp2u,
        .jobsearch-MosaicProviderRichSearch {
          width: 100% !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
          box-sizing: border-box !important;
        }

        .yosegi-InlineWhatWhere {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        .yosegi-InlineWhatWhere-form {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 14px !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }

        .css-1m3evsr {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          height: auto !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 auto !important;
          gap: 12px !important;
          box-sizing: border-box !important;
        }

        .css-3yrzkf {
          width: 100% !important;
          height: auto !important;
          background: #ffffff !important;
          border: 1px solid #767676 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
          box-sizing: border-box !important;
        }

        .css-1ibi2l8 {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          height: auto !important;
          box-sizing: border-box !important;
        }

        .css-1hs2rnc {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
          height: 48px !important;
          min-height: 48px !important;
          padding: 0 12px !important;
          box-sizing: border-box !important;
        }

        .css-46bpn7, .css-1a9szdz, .css-7c6zsr {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          box-sizing: border-box !important;
        }

        .css-1rhyhw1, .css-ltyz76 {
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
          margin: 0 !important;
          box-sizing: border-box !important;
        }

        .css-swg9g2 {
          display: block !important;
          width: 100% !important;
          height: 1px !important;
          min-height: 1px !important;
          background-color: #e4e2e0 !important;
          border: none !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        #text-input-what, #text-input-where {
          width: 100% !important;
          height: 100% !important;
          font-size: 15px !important;
          color: #2d2d2d !important;
          border: none !important;
          outline: none !important;
          background: transparent !important;
          padding-left: 8px !important;
          box-sizing: border-box !important;
        }

        .css-tuamcx {
          width: 100% !important;
          margin: 10px 0 0 0 !important;
          box-sizing: border-box !important;
        }

        .yosegi-InlineWhatWhere-primaryButton,
        .css-17qy6hn {
          width: 100% !important;
          height: 44px !important;
          background: #1264e8 !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 9999px !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          box-sizing: border-box !important;
          margin: 0 !important;
        }

        /* Feed container & cards on mobile */
        #injected-signed-in-feed-container {
          width: 100% !important;
          max-width: 100% !important;
          margin: 16px 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }

        #injected-signed-in-feed {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 14px !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }

        #injected-signed-in-feed > div:last-child {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        #injected-signed-in-feed > div:last-child > div {
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 16px !important;
        }

        /* Trending section stacks on mobile */
        #moveonnTrendingSection {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0 14px !important;
          margin: 20px auto !important;
          box-sizing: border-box !important;
        }

        #moveonnTrendingBody {
          width: 100% !important;
          padding: 16px !important;
          box-sizing: border-box !important;
        }

        #moveonnTrendingBody > div,
        .moveonn-trending-grid,
        #_r_1_-body > div {
          grid-template-columns: 1fr !important;
          gap: 20px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        /* Hero container & Center Logo on mobile */
        [data-testid="account-focused-homepage"] {
          width: 100% !important;
          max-width: 100% !important;
          padding: 16px 14px !important;
          box-sizing: border-box !important;
          text-align: center !important;
        }

        .moveonn-hero-brand-img {
          width: 125px !important;
          max-width: 125px !important;
          height: auto !important;
          margin: 0 auto 12px !important;
          display: block !important;
        }

        /* Mobile Profile / Resume Modal */
        #candidateProfileModalOverlay {
          padding: 0 !important;
          align-items: stretch !important;
        }
        #candidateProfileModalCard {
          width: 100vw !important;
          max-width: 100vw !important;
          height: 100vh !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          padding: 18px 14px 40px !important;
          box-sizing: border-box !important;
        }
        #resumeFileCardContainer {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 12px !important;
        }
        #resumeFileCardActions {
          width: 100% !important;
          display: flex !important;
          gap: 8px !important;
        }
        #resumeFileCardActions button {
          flex: 1 !important;
        }
        #profFormGrid1, #profFormGrid2 {
          grid-template-columns: 1fr !important;
          gap: 10px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  window.openCountryLangModal = openCountryLangModal;
  window.closeCountryLangModal = closeCountryLangModal;
  window.saveCountryLangPreferences = saveCountryLangPreferences;
  window.openProfileModal = openProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.openMobileMenu = openMobileMenu;
  window.closeMobileMenu = closeMobileMenu;
  window.performLocalSignOut = performLocalSignOut;
  window.injectResponsiveGlobalStyles = injectResponsiveGlobalStyles;
window.showToast = showToast;
  window.openApplyModal = openApplyModal;
  window.openPostJobModal = openPostJobModal;
  window.openResumeUploadModal = openResumeUploadModal;
  window.openMessagesModal = openMessagesModal;
  window.openNotificationsModal = openNotificationsModal;
  window.openProfileModal = openProfileModal;
  window.toggleUserDropdown = toggleUserDropdown;
  window.initAuthAndUserHeader = initAuthAndUserHeader;
  window.performLocalLogin = performLocalLogin;
  window.authenticateUser = authenticateUser;
})();
