/**
 * Move ONN - Common Application Engine (common.js)
 * Manages: Single Unified Navbar, Mobile Drawer, Auth Popup Modal, 
 * User State Persistence, Toast Notifications & Event Safety.
 */

(function() {
  'use strict';

  // --- Account-Scoped Profile Data Architecture ---
  function getAccountScopedKey(key, email) {
    if (!email) return key;
    const safe = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `${key}__${safe}`;
  }

  function getAccountStorage(key, fallback, userEmail) {
    try {
      const user = getStoredUser();
      const email = userEmail || (user && user.email) || null;
      if (email) {
        const val = localStorage.getItem(getAccountScopedKey(key, email));
        if (val !== null && val !== undefined) return val;
      }
      return (fallback !== undefined) ? fallback : null;
    } catch (e) {
      return (fallback !== undefined) ? fallback : null;
    }
  }

  function setAccountStorage(key, value, userEmail) {
    try {
      const user = getStoredUser();
      const email = userEmail || (user && user.email) || null;
      if (email) {
        localStorage.setItem(getAccountScopedKey(key, email), value);
      }
    } catch (e) {}
  }

  function removeAccountStorage(key, userEmail) {
    try {
      const user = getStoredUser();
      const email = userEmail || (user && user.email) || null;
      if (email) {
        localStorage.removeItem(getAccountScopedKey(key, email));
      }
    } catch (e) {}
  }

  // --- Strict Universal Background Scroll Lock ---
  // --- Strict Universal Background Scroll Lock ---
  let savedBodyScrollY = 0;
  function lockBodyScroll() {
    savedBodyScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    document.documentElement.classList.add('modal-open', 'jt-modal-open', 'jt-modal-locked');
    document.body.classList.add('modal-open', 'jt-modal-open', 'jt-modal-locked');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedBodyScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  function unlockBodyScroll() {
    const anyModalOpen = document.querySelectorAll(
      '.jt-modal-backdrop.is-open, .jt-photo-modal-backdrop.open, .jt-plans-modal-backdrop.open, .jt-edit-prof-backdrop.open, .jt-skill-modal-backdrop.open, .jt-mobile-drawer.is-open, .jt-post-job-modal-backdrop[style*="flex"], .jt-smart-sourcing-modal-backdrop[style*="flex"], .jt-emp-modal-backdrop.open, .jt-emp-modal-backdrop[style*="display: flex"], .jt-emp-modal-backdrop[style*="display:flex"]'
    );
    if (!anyModalOpen || anyModalOpen.length === 0) {
      document.documentElement.classList.remove('modal-open', 'jt-modal-open', 'jt-modal-locked');
      document.body.classList.remove('modal-open', 'jt-modal-open', 'jt-modal-locked');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (typeof savedBodyScrollY === 'number' && savedBodyScrollY > 0) {
        window.scrollTo({ top: savedBodyScrollY, behavior: 'instant' });
      }
    }
  }

  // Prevent background wheel and touch gestures when any modal is open
  window.addEventListener('wheel', function(e) {
    if (document.body.classList.contains('modal-open') || document.body.classList.contains('jt-modal-open') || document.body.classList.contains('jt-modal-locked')) {
      const scrollable = e.target.closest(
        '.jt-modal-dialog-wrap, .jt-plans-modal-dialog, .jt-photo-modal-dialog, .jt-edit-prof-dialog, .jt-skill-modal-dialog, .jt-drawer-panel, .wrapper, .jt-post-job-modal, .jt-smart-sourcing-modal, .jt-employer-help-modal, .jt-employer-resources-modal, .jt-emp-modal-card, .jt-emp-modal-body, .jt-resume-modal-card, .jt-emp-modal-form, .jt-emp-mob-drawer-panel, .jt-emp-main-area, .jt-chat-stream, .jt-chat-sidebar-threads, .jt-cand-chat-messages, .jt-cand-chat-threads'
      );
      if (!scrollable) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  window.addEventListener('touchmove', function(e) {
    if (document.body.classList.contains('modal-open') || document.body.classList.contains('jt-modal-open') || document.body.classList.contains('jt-modal-locked')) {
      if (e.target.classList && (
        e.target.classList.contains('jt-drawer-backdrop') ||
        e.target.classList.contains('jt-modal-backdrop') ||
        e.target.classList.contains('jt-emp-modal-backdrop') ||
        e.target.classList.contains('jt-photo-modal-backdrop') ||
        e.target.classList.contains('jt-plans-modal-backdrop') ||
        e.target.classList.contains('jt-edit-prof-backdrop') ||
        e.target.classList.contains('jt-skill-modal-backdrop') ||
        e.target.classList.contains('jt-post-job-modal-backdrop') ||
        e.target.classList.contains('jt-smart-sourcing-modal-backdrop') ||
        e.target.classList.contains('jt-employer-help-modal-backdrop') ||
        e.target.classList.contains('jt-employer-resources-modal-backdrop')
      )) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // --- Auth State Management ---
  function getStoredUser() {
    try {
      const u = localStorage.getItem('moveonn_user') || null;
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredUser(user) {
    try {
      localStorage.setItem('moveonn_user', JSON.stringify(user));
      );
      document.documentElement.classList.add('jt-user-logged-in');
    } catch (e) {}
  }

  function clearStoredUser() {
    try {
      localStorage.removeItem('moveonn_user');
    localStorage.removeItem('moveonn_user');
      localStorage.removeItem('Move ONN_user');
      localStorage.removeItem('apex_user');
      document.documentElement.classList.remove('jt-user-logged-in');
    } catch (e) {}
  }

  function performSignOut() {
    clearStoredUser();

    // Close any active user dropdowns or drawers
    const dropdown = document.getElementById('jtUserDropdown');
    if (dropdown) dropdown.classList.remove('is-open');
    closeMobileDrawer();

    renderNavbarAuthState();
    showToast('Signed out successfully.');

    // Switch homepage hero dashboard back to guest promo
    const guestPromo = document.getElementById('jtGuestHeroPromo');
    const userDash = document.getElementById('jtUserDashboard');
    const authHomeSections = document.getElementById('jtAuthHomeSections');
    if (guestPromo) guestPromo.style.display = 'block';
    if (userDash) userDash.style.display = 'none';
    if (authHomeSections) authHomeSections.style.display = 'none';

    // If on profile page or other authenticated dashboard, redirect immediately to index.html
    const path = window.location.pathname.toLowerCase();
    if (path.includes('profile.html') || path.endsWith('/profile') || document.querySelector('.jt-prof-page-container')) {
      window.location.href = 'index.html';
      return;
    }
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  // --- Toast Notifications ---
  function showToast(msg) {
    let toast = document.getElementById('jtToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'jtToast';
      toast.className = 'jt-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // --- Mobile Off-Canvas Drawer ---
  function openMobileDrawer() {
    const drawer = document.getElementById('jtMobileDrawer');
    if (drawer) {
      drawer.classList.add('is-open');
      lockBodyScroll();
      const btn = document.getElementById('jtBurgerBtn');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      try {
        window.history.pushState({ jt_mobile_drawer: true }, '');
      } catch (e) {}
    }
  }

  function closeMobileDrawer() {
    const drawer = document.getElementById('jtMobileDrawer');
    if (drawer) {
      drawer.classList.remove('is-open');
      unlockBodyScroll();
      const btn = document.getElementById('jtBurgerBtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }

  window.addEventListener('popstate', function(e) {
    const drawer = document.getElementById('jtMobileDrawer');
    if (drawer && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      unlockBodyScroll();
      const btn = document.getElementById('jtBurgerBtn');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
    const authModal = document.getElementById('jtAuthModal');
    if (authModal && authModal.classList.contains('is-open')) {
      closeAuthModal();
    }
  });

  // --- User Account Avatar & Dropdown Controller ---
  function toggleUserDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const dropdown = document.getElementById('jtUserDropdown');
    const btn = document.getElementById('jtUserAvatarBtn');
    if (dropdown) {
      const isOpen = dropdown.classList.toggle('is-open');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  function handleAvatarClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Mobile viewport opens mobile drawer, desktop toggles dropdown
    if (window.innerWidth <= 768) {
      openMobileDrawer();
    } else {
      toggleUserDropdown(e);
    }
  }

  // --- Sliding Auth Popup Modal Controller & Constants ---
  const GOOGLE_BTN_HTML = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg><span>Google</span>';

  const APPLE_BTN_HTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.1.65-2.76 1.42-.58.68-1.09 1.76-1.03 2.81 1.07.08 2.16-.58 2.78-1.36z"/></svg><span>Apple</span>';

  let isAuthConnecting = false;

  function resetAuthButtonsState() {
    isAuthConnecting = false;
    document.querySelectorAll('.jt-btn-google').forEach(btn => {
      btn.disabled = false;
      btn.innerHTML = GOOGLE_BTN_HTML;
    });
    document.querySelectorAll('.jt-btn-apple').forEach(btn => {
      btn.disabled = false;
      btn.innerHTML = APPLE_BTN_HTML;
    });
    const loginSubmit = document.getElementById('jtLoginSubmitBtn');
    if (loginSubmit) {
      loginSubmit.disabled = false;
      loginSubmit.innerHTML = 'Sign In';
    }
    const regSubmit = document.getElementById('jtRegSubmitBtn');
    if (regSubmit) {
      regSubmit.disabled = false;
      regSubmit.innerHTML = 'Create Account';
    }
  }

  function openAuthModal(tab) {
    closeMobileDrawer();
    const modal = document.getElementById('jtAuthModal');
    if (!modal) return;

    resetAuthButtonsState();

    // Reset forms and clear input values to prevent browser autofill retention
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => {
      try { form.reset(); } catch(e) {}
    });
    modal.querySelectorAll('input').forEach(inp => {
      inp.value = '';
    });

    modal.classList.add('is-open');
    lockBodyScroll();

    switchAuthTab(tab || 'signin');

    const activeInput = (tab === 'signup')
      ? modal.querySelector('#reg-name')
      : modal.querySelector('#login-username');
    if (activeInput) setTimeout(() => activeInput.focus(), 180);
  }

  function closeAuthModal() {
    const modal = document.getElementById('jtAuthModal');
    if (modal) {
      modal.classList.remove('is-open');
      unlockBodyScroll();
    }
    resetAuthButtonsState();
  }

  function switchAuthTab(mode) {
    const wrapper = document.getElementById('jtAuthWrapper');
    if (!wrapper) return;

    resetAuthButtonsState();

    if (mode === 'signup') {
      wrapper.classList.add('active');
    } else {
      wrapper.classList.remove('active');
    }

    // Reapply translations to modal elements
    if (typeof applyTranslations === 'function') {
      const currentLang = localStorage.getItem('jt_lang') || 'en';
      applyTranslations(currentLang);
    }
  }

  function handleLoginFormSubmit(e) {
    if (e) {
      try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
    }
    if (isAuthConnecting) return;
    isAuthConnecting = true;

    const emailInput = document.getElementById('login-username');
    const submitBtn = document.getElementById('jtLoginSubmitBtn');
    const email = emailInput ? emailInput.value.trim() : 'user@moveonn.com';
    const name = email.split('@')[0] || 'User';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="jt-auth-spinner"></span> Signing in...';
    }

    setTimeout(() => {
      const userObj = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        loggedInAt: Date.now()
      };

      setStoredUser(userObj);
      resetAuthButtonsState();
      closeAuthModal();
      renderNavbarAuthState();
      showToast(`Welcome back, ${userObj.name}! Signed in successfully.`);
    }, 600);
  }

  function handleRegFormSubmit(e) {
    if (e) {
      try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
    }
    if (isAuthConnecting) return;
    isAuthConnecting = true;

    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const submitBtn = document.getElementById('jtRegSubmitBtn');

    const name = nameInput ? nameInput.value.trim() : 'User';
    const email = emailInput ? emailInput.value.trim() : 'user@moveonn.com';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="jt-auth-spinner"></span> Creating account...';
    }

    setTimeout(() => {
      const userObj = {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        loggedInAt: Date.now()
      };

      setStoredUser(userObj);
      resetAuthButtonsState();
      closeAuthModal();
      renderNavbarAuthState();
      showToast(`Account created! Welcome to Move ONN, ${userObj.name}.`);
    }, 600);
  }

  function handleGoogleLogin(e) {
    if (e) {
      try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
    }
    if (isAuthConnecting) return;
    isAuthConnecting = true;

    // Show spinner on all Google buttons in both Welcome Back and Create Account tabs
    document.querySelectorAll('.jt-btn-google').forEach(btn => {
      btn.disabled = true;
      btn.innerHTML = '<span class="jt-auth-spinner jt-auth-spinner-blue"></span> Connecting...';
    });
    // Disable Apple buttons during request to prevent conflicting triggers
    document.querySelectorAll('.jt-btn-apple').forEach(btn => {
      btn.disabled = true;
    });

    setTimeout(() => {
      const mockGoogleUser = {
        name: 'Alex Mercer',
        email: 'alex.mercer@gmail.com',
        avatar: null,
        loggedInAt: Date.now()
      };

      setStoredUser(mockGoogleUser);
      resetAuthButtonsState();
      closeAuthModal();
      renderNavbarAuthState();
      showToast(`Signed in with Google as ${mockGoogleUser.name}!`);
    }, 700);
  }

  function handleAppleLogin(e) {
    if (e) {
      try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
    }
    if (isAuthConnecting) return;
    isAuthConnecting = true;

    // Show spinner on all Apple buttons in both Welcome Back and Create Account tabs
    document.querySelectorAll('.jt-btn-apple').forEach(btn => {
      btn.disabled = true;
      btn.innerHTML = '<span class="jt-auth-spinner"></span> Connecting...';
    });
    // Disable Google buttons during request to prevent conflicting triggers
    document.querySelectorAll('.jt-btn-google').forEach(btn => {
      btn.disabled = true;
    });

    setTimeout(() => {
      const mockAppleUser = {
        name: 'Sarah Connor',
        email: 'sarah.connor@icloud.com',
        avatar: null,
        loggedInAt: Date.now()
      };

      setStoredUser(mockAppleUser);
      resetAuthButtonsState();
      closeAuthModal();
      renderNavbarAuthState();
      showToast(`Signed in with Apple as ${mockAppleUser.name}!`);
    }, 700);
  }

  function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(toggleBtn => {
      function handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetId = toggleBtn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        // Toggle SVG eye appearance
        toggleBtn.innerHTML = isPassword
          ? '<svg class="eye-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
          : '<svg class="eye-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        toggleBtn.style.color = isPassword ? '#0f5acf' : '#94a3b8';
      }

      toggleBtn.addEventListener('click', handleToggle);
    });
  }

  // --- Render Navigation Authentication State ---
  function renderNavbarAuthState() {
    const user = getStoredUser();
    const desktopAuthContainer = document.getElementById('jtAuthButtonContainer');
    const mobileAuthContainer = document.getElementById('jtDrawerAuthSection');
    const burgerBtn = document.getElementById('jtBurgerBtn');

    // Desktop/Mobile Header Auth Container
    if (desktopAuthContainer) {
      if (user) {
        // Hide hamburger on mobile when user is logged in
        if (burgerBtn) {
          burgerBtn.style.setProperty('display', 'none', 'important');
        }
        const avatarInnerHtml = (function() {
          const rawImg = getAccountStorage('jt_user_avatar_img', null, user.email);
          const customImg = (rawImg && typeof rawImg === 'string' && (rawImg.startsWith('data:image/') || rawImg.startsWith('http') || rawImg.startsWith('assets/'))) ? rawImg : null;
          if (customImg) {
            return `<img src="${customImg}" alt="${user.name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
          }
          return `<svg viewBox="0 0 24 24" width="22" height="22" fill="#64748b" style="display:block;"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" /></svg>`;
        })();

        const currentPlan = getAccountStorage('jt_user_plan', 'free', user.email);
        let planBadgeHtml = '';
        if (currentPlan === 'growth') {
          planBadgeHtml = '<span style="margin-left:auto; font-size:10px; padding:2px 6px; background:#004687; color:#fff; border-radius:4px; font-weight:700;">PRO</span>';
        } else if (currentPlan === 'enterprise') {
          planBadgeHtml = '<span style="margin-left:auto; font-size:10px; padding:2px 6px; background:#004687; color:#fff; border-radius:4px; font-weight:700;">ENTERPRISE</span>';
        }

        // Sync with customized profile details if updated
        const customName = getAccountStorage('moveonn_user_name', null, user.email) || getAccountStorage('moveonn_user_name', null, user.email);
        const customEmail = getAccountStorage('jt_user_email', null, user.email);
        if (customName) user.name = customName;
        if (customEmail) user.email = customEmail;

        // Attach event safely
        desktopAuthContainer.innerHTML = `
          <div class="position-relative">
            <button type="button" class="jt-user-avatar-btn" id="jtUserAvatarBtn" aria-label="User account menu" aria-expanded="false" onclick="window.handleAvatarClick(event)">
              ${avatarInnerHtml}
            </button>
            <div class="jt-user-dropdown" id="jtUserDropdown">
              <a href="profile.html" class="jt-user-dropdown-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Profile Dashboard</span>
                ${planBadgeHtml}
              </a>
              <a href="jobs.html?tab=saved" class="jt-user-dropdown-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                <span>My Saved Jobs</span>
              </a>
              <a href="employer-dashboard.html" class="jt-user-dropdown-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span>Employer Portal</span>
              </a>
              <div class="jt-user-dropdown-divider"></div>
              <button type="button" class="jt-user-dropdown-signout" onclick="window.performSignOut()">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Show hamburger on mobile when user is logged out
        if (burgerBtn) {
          burgerBtn.style.display = '';
        }
        desktopAuthContainer.innerHTML = `
          <button type="button" class="jt-btn-signin-nav" onclick="window.openAuthModal('signin')">
            Sign in
          </button>
        `;
      }
    }

    // Mobile Drawer
    if (mobileAuthContainer) {
      if (user) {
        const mobileAvatarHtml = (function() {
          const rawImg = getAccountStorage('jt_user_avatar_img', null, user.email);
          const customImg = (rawImg && typeof rawImg === 'string' && (rawImg.startsWith('data:image/') || rawImg.startsWith('http') || rawImg.startsWith('assets/'))) ? rawImg : null;
          if (customImg) {
            return `<img src="${customImg}" alt="${user.name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
          }
          return `<svg viewBox="0 0 24 24" width="24" height="24" fill="#64748b" style="display:block;"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" /></svg>`;
        })();

        mobileAuthContainer.innerHTML = `
          <div style="background:#f3f4f6; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid var(--jt-border);">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
              <div style="width:42px; height:42px; border-radius:50%; background:#e2e8f0; color:#64748b; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; border:2px solid #ffffff;">
                ${mobileAvatarHtml}
              </div>
              <div style="overflow:hidden; flex:1;">
                <div style="font-weight:700; font-size:15px; color:var(--jt-text-dark);">${user.name}</div>
                <div style="font-size:12px; color:var(--jt-text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${user.email}</div>
              </div>
            </div>
            <a href="profile.html" class="btn-jt-primary w-100" style="min-height:38px; font-size:13px; margin-bottom:8px; display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none;" onclick="window.closeMobileDrawer()">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Profile Dashboard</span>
            </a>
            <a href="employer-dashboard.html" class="btn-jt-employer-drawer w-100" style="min-height:38px; font-size:13px; margin-bottom:8px; display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; background:#ffffff; color:#004687; border:1.5px solid #004687; border-radius:8px; font-weight:600; box-shadow:0 1px 2px rgba(0,0,0,0.05);" onclick="window.closeMobileDrawer()">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <span>Employer Portal</span>
            </a>
            <button type="button" class="btn-jt-outline w-100" style="min-height:38px; font-size:13px;" onclick="window.performSignOut()">
              Sign out
            </button>
          </div>
        `;
      } else {
        mobileAuthContainer.innerHTML = `
          <div style="margin-bottom:16px; display:flex; flex-direction:column; gap:8px;">
            <button type="button" class="btn-jt-primary w-100" onclick="window.closeMobileDrawer(); window.openAuthModal('signin');">
              Sign in
            </button>
            <a href="hire.html" class="btn-jt-employer-drawer w-100" style="min-height:38px; font-size:13px; display:inline-flex; align-items:center; justify-content:center; gap:6px; text-decoration:none; background:#f0f5ff; color:#004687; border:1.5px solid #bfdbfe; border-radius:8px; font-weight:600;" onclick="window.closeMobileDrawer()">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <span>Employer Portal</span>
            </a>
          </div>
        `;
      }
    }

    // Sync Homepage Guest Promo vs User Dashboard ("Jobs for you") and Auth Candidate Sections
    const guestPromo = document.getElementById('jtGuestHeroPromo');
    const userDash = document.getElementById('jtUserDashboard');
    const authHomeSections = document.getElementById('jtAuthHomeSections');
    if (guestPromo && userDash) {
      if (user) {
        guestPromo.style.display = 'none';
        userDash.style.display = 'block';
        const welcomeTitle = document.getElementById('jtHomeWelcomeTitle');
        if (welcomeTitle && user.name) {
          const firstName = user.name.trim().split(/\s+/)[0];
          welcomeTitle.textContent = `Welcome back, ${firstName}! Here are your tailored opportunities`;
        }
        if (authHomeSections) authHomeSections.style.display = 'block';
        if (typeof window.syncDashboardAppliedState === 'function') {
          window.syncDashboardAppliedState();
        }
      } else {
        guestPromo.style.display = 'block';
        userDash.style.display = 'none';
        if (authHomeSections) authHomeSections.style.display = 'none';
      }
    } else if (authHomeSections) {
      authHomeSections.style.display = user ? 'block' : 'none';
    }
  }

  function toggleUserDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('jtUserDropdown');
    const btn = document.getElementById('jtUserAvatarBtn');
    if (dropdown) {
      const isOpen = dropdown.classList.toggle('is-open');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  // --- Keyboard & Document Click Listeners ---
  function initGlobalListeners() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('jtUserDropdown');
      const avatarBtn = document.getElementById('jtUserAvatarBtn');
      if (dropdown && !dropdown.contains(e.target) && (!avatarBtn || !avatarBtn.contains(e.target))) {
        dropdown.classList.remove('is-open');
        if (avatarBtn) avatarBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close Modals & Drawers on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAuthModal();
        closeMobileDrawer();
        const dropdown = document.getElementById('jtUserDropdown');
        if (dropdown) dropdown.classList.remove('is-open');
      }
    });

    // Wire Hamburger button
    const burgerBtn = document.getElementById('jtBurgerBtn');
    if (burgerBtn) {
      burgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileDrawer();
      });
    }

    // Wire Mobile Drawer close & backdrop
    const drawerClose = document.getElementById('jtDrawerCloseBtn');
    if (drawerClose) {
      drawerClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileDrawer();
      });
    }

    const drawerBackdrop = document.getElementById('jtDrawerBackdrop');
    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeMobileDrawer);
    }

    // Wire Auth Modal close & backdrop
    const modalClose = document.getElementById('jtAuthCloseBtn');
    if (modalClose) {
      modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        closeAuthModal();
      });
    }

    const modalBackdrop = document.getElementById('jtAuthModal');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeAuthModal();
      });
    }

    // Wire Auth form submission
    const authForm = document.getElementById('jtAuthForm');
    if (authForm) {
      authForm.addEventListener('submit', handleAuthFormSubmit);
    }

    // Password visibility toggle
    const togglePw = document.getElementById('jtTogglePw');
    if (togglePw) {
      togglePw.addEventListener('click', () => {
        const pwInput = document.getElementById('jtAuthPassword');
        if (pwInput) {
          const isText = pwInput.type === 'text';
          pwInput.type = isText ? 'password' : 'text';
          togglePw.innerHTML = isText
            ? '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
            : '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
        }
      });
    }
  }

  // --- Country & Internationalization (i18n) Engine ---
  const I18N_DICTIONARY = {
    "hi": {
        "Home": "होम",
        "Jobs": "नौकरियां",
        "Company reviews": "कंपनी समीक्षा",
        "Salary guide": "वेतन गाइड",
        "Sign in": "साइन इन",
        "Sign out": "साइन आउट",
        "Sign Out": "साइन आउट",
        "Register": "रजिस्टर करें",
        "Employers / Post Job": "नियोक्ता / नौकरी पोस्ट करें",
        "Post a job": "नौकरी पोस्ट करें",
        "Post a Job": "नौकरी पोस्ट करें",
        "Job Seekers": "नौकरी चाहने वाले",
        "Employers": "नियोक्ता",
        "Change country:": "देश बदलें:",
        "Change country: India": "تغيير البلد: الهند",
        "Your next job starts here.": "आपकी अगली नौकरी यहाँ से शुरू होती है।",
        "Your next job starts here": "आपकी अगली नौकरी यहाँ से शुरू होती है",
        "Create an account or sign in to see your personalised job recommendations.": "أنشئ حساباً أو سجّل الدخول للاطلاع على توصيات الوظائف المخصصة لك.",
        "Get Started": "ابدأ الآن",
        "What": "क्या पद",
        "Where": "स्थान",
        "Find jobs": "नौकरियां खोजें",
        "Search jobs": "नौकरियां खोजें",
        "Search": "खोजें",
        "Job title, keywords, or company": "पद, कीवर्ड, या कंपनी",
        "City, state, zip code, or remote": "शहर, राज्य या रिमोट",
        "City, state, or 'remote'": "शहर, राज्य या रिमोट",
        "Patna, Bihar": "पटना, बिहार",
        "Popular searches:": "लोकप्रिय खोजें:",
        "Popular searches": "लोकप्रिय खोजें",
        "Recent searches": "हाल की खोजें",
        "Clear": "साफ़ करें",
        "Jobs for you": "आपके लिए नौकरियां",
        "Top job picks for you": "आपके लिए शीर्ष नौकरी चयन",
        "View all jobs": "सभी नौकरियां देखें",
        "View all jobs >": "सभी नौकरियां देखें >",
        "Job feed based on your profile and search history": "आपकी प्रोफ़ाइल और खोज इतिहास पर आधारित जॉब फ़ीड",
        "TOP MATCH": "शीर्ष मिलान",
        "RECOMMENDED": "अनुशंसित",
        "HIGH PAY": "उच्च वेतन",
        "PATNA / REMOTE": "पटना / रिमोट",
        "Actively Hiring": "सक्रिय भर्ती",
        "Easily Apply": "सरल आवेदन",
        "Early Applicant": "शुरुआती आवेदक",
        "Apply now": "अभी आवेदन करें",
        "Applied": "आवेदन किया",
        "Saved": "सहेजा गया",
        "Save job": "नौकरी सहेजें",
        "Easy apply": "सरल आवेदन",
        "Urgent hiring": "तत्काल भर्ती",
        "Remote": "रिमोट",
        "Full-time": "पूर्णकालिक",
        "Part-time": "अंशकालिक",
        "Fresher": "फ्रेशर",
        "Top matches": "शीर्ष मिलान",
        "Saved jobs": "सहेजी गई नौकरियां",
        "Applied jobs": "आवेदन की गई नौकरियां",
        "No jobs saved yet": "अभी तक कोई नौकरी सहेजी नहीं गई",
        "No applied jobs yet": "अभी तक कोई आवेदन नहीं किया गया",
        "New Applicant": "नया आवेदक",
        "Under Review": "समीक्षाधीन",
        "Shortlisted": "शॉर्टलिस्टेड",
        "Interview Scheduled": "साक्षात्कार निर्धारित",
        "Live Candidate Pipeline": "लाइव उम्मीदवार पाइपलाइन",
        "Shortlisted & Assessments": "शॉर्टलिस्ट और मूल्यांकन",
        "Live Interview Schedule": "लाइव साक्षात्कार अनुसूची",
        "2 New Matches": "2 नए मिलान",
        "2 Candidates Shortlisted": "2 उम्मीदवार शॉर्टलिस्ट किए गए",
        "2 Video Calls Ready": "2 वीडियो कॉल तैयार",
        "Remote options available": "रिमोट विकल्प उपलब्ध हैं",
        "Fast response": "तेज़ प्रतिक्रिया",
        "Work from office": "कार्यालय से कार्य",
        "Hybrid": "हाइब्रिड",
        "a year": "प्रति वर्ष",
        "per year": "प्रति वर्ष",
        "Average salary": "औसत वेतन",
        "Senior Full Stack Developer": "वरिष्ठ फुल स्टैक डेवलपर",
        "React Frontend Engineer": "रिएक्ट फ्रंटएंड इंजीनियर",
        "Python Data Engineer": "पायथन डेटा इंजीनियर",
        "Java Backend Architect": "जावा बैकएंड आर्किटेक्ट",
        "Apex Consultancy Solutions - Bengaluru, Karnataka": "أبيكس لحلول الاستشارات - بنغالورو، كارناتاكا",
        "Tata Consultancy Services - Hyderabad, Telangana": "تاتا للخدمات الاستشارية - حيدر أباد، تلنغانة",
        "Infosys Ltd - Pune, Maharashtra": "إنفوسيس المحدودة - بونا، ماهاراشترا",
        "Wipro Technologies - Patna / Remote": "ويبرو تكنولوجيز - باتنا / عن بعد",
        "What's trending on Move ONN": "Move ONN पर क्या ट्रेंड कर रहा है",
        "Popular Tech Roles": "लोकप्रिय तकनीकी भूमिकाएं",
        "Top Hiring Cities": "शीर्ष भर्ती शहर",
        "Executive & Management": "कार्यकारी एवं प्रबंधन",
        "Full Stack Developer": "फुल स्टैक डेवलपर",
        "AI & Machine Learning": "एआई और मशीन लर्निंग",
        "DevOps & Cloud Engineer": "डेवऑप्स और क्लाउड इंजीनियर",
        "Mobile App Developer": "मोबाइल ऐप डेवलपर",
        "Data Analyst & Power BI": "डेटा एनालिस्ट और Power BI",
        "Cyber Security Specialist": "साइबर सुरक्षा विशेषज्ञ",
        "QA Automation Engineer": "क्यूए ऑटोमेशन इंजीनियर",
        "Top Companies Hiring": "शीर्ष कंपनियां जो भर्ती कर रही हैं",
        "Engineering Director": "इंजीनियरिंग निदेशक",
        "VP of Product Management": "वीपी प्रोडक्ट मैनेजमेंट",
        "Chief Technology Officer (CTO)": "मुख्य प्रौद्योगिकी अधिकारी (CTO)",
        "Principal Solution Architect": "प्रमुख समाधान वास्तुकार",
        "Head of Data Science": "डेटा साइंस प्रमुख",
        "Senior Engineering Manager": "वरिष्ठ इंजीनियरिंग प्रबंधक",
        "Scrum Master & Agile Coach": "स्क्रम मास्टर और एजाइल कोच",
        "Chief Information Security Officer": "मुख्य सूचना सुरक्षा अधिकारी",
        "Bangalore / Bengaluru": "बैंगलोर / बेंगलुरु",
        "Hyderabad": "حيدر أباد",
        "Pune": "بونا",
        "Delhi NCR (Gurgaon / Noida)": "दिल्ली एनसीआर (गुड़गांव / नोएडा)",
        "Mumbai": "मुंबई",
        "Chennai": "चेन्नई",
        "Patna": "पटना",
        "Kolkata": "कोलकाता",
        "Ahmedabad (GIFT City)": "अहमदाबाद (गिफ्ट सिटी)",
        "Move ONN for Employers": "नियोक्ताओं के लिए Move ONN",
        "Let’s hire your next great candidate. Fast.": "आइए अपने अगले सर्वश्रेष्ठ उम्मीदवार को चुनें। तेज़ी से।",
        "Let's hire your next great candidate. Fast.": "आइए अपने अगले सर्वश्रेष्ठ उम्मीदवार को चुनें। तेज़ी से।",
        "No matter the skills, industry, or experience level you're looking for, we can help you find your next great hire.": "चाहे आप किसी भी कौशल, उद्योग या अनुभव स्तर की तलाश में हों, हम आपकी अगली बेहतरीन भर्ती खोजने में मदद कर सकते हैं।",
        "No matter the skills, industry, or experience level you’re looking for, we can help you find your next great hire.": "चाहे आप किसी भी कौशल, उद्योग या अनुभव स्तर की तलाश में हों, हम आपकी अगली बेहतरीन भर्ती खोजने में मदद कर सकते हैं।",
        "No matter the skills, experience or qualifications you’re looking for, you’ll find the right people here.": "चाहे आप किसी भी कौशल, अनुभव या योग्यता की तलाश में हों, आपको यहाँ सही लोग मिलेंगे।",
        "No matter the skills, experience or qualifications you're looking for, you'll find the right people here.": "चाहे आप किसी भी कौशल, अनुभव या योग्यता की तलाश में हों, आपको यहाँ सही लोग मिलेंगे।",
        "Manage your hiring from start to finish": "शुरुआत से अंत तक अपनी भर्ती प्रक्रिया प्रबंधित करें",
        "Get started with a job post. Move ONN has 20.1M unique monthly users.": "नौकरी पोस्ट के साथ शुरुआत करें। Move ONN के 20.1M अद्वितीय मासिक उपयोगकर्ता हैं।",
        "Find quality applicants": "गुणवत्तापूर्ण आवेदक खोजें",
        "Customise your post with screening tools to help narrow down to potential candidates.": "संभावित उम्मीदवारों को शॉर्टलिस्ट करने के लिए स्क्रीनिंग टूल्स के साथ अपनी पोस्ट कस्टमाइज़ करें।",
        "Make connections": "सीधे संपर्क बनाएं",
        "Track, message, invite and interview directly on Move ONN with no extra apps to download.": "बिना किसी अतिरिक्त ऐप को डाउनलोड किए सीधे Move ONN पर ट्रैक, मैसेज, इनवाइट और इंटरव्यू करें।",
        "Hire confidently": "आत्मविश्वास से भर्ती करें",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "अपनी भर्ती यात्रा में आप अकेले नहीं हैं। भर्ती प्रक्रिया के हर चरण के लिए हमारे पास सहायक संसाधन हैं।",
        "You're not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "अपनी भर्ती यात्रा में आप अकेले नहीं हैं। भर्ती प्रक्रिया के हर चरण के लिए हमारे पास सहायक संसाधन हैं।",
        "Your dashboard features": "आपके डैशबोर्ड की मुख्य विशेषताएं",
        "Save time and effort in your hiring journey.": "अपनी भर्ती यात्रा में समय और प्रयास बचाएं।",
        "Manage your jobs": "अपनी नौकरियां प्रबंधित करें",
        "View applicants, edit descriptions, adjust budgets, and monitor candidate status in real time.": "आवेदक देखें, विवरण संपादित करें, बजट समायोजित करें और वास्तविक समय में स्थिति की निगरानी करें।",
        "Choose who moves forward": "चुनें कि कौन आगे बढ़ता है",
        "Filter by match score, assessment results, and recruiter notes to shortlist candidates fast.": "उम्मीदवारों को तेज़ी से शॉर्टलिस्ट करने के लिए मैच स्कोर, मूल्यांकन परिणामों और नोट्स द्वारा फ़िल्टर करें।",
        "Interview anywhere": "कहीं से भी साक्षात्कार लें",
        "Conduct 1-click video calls with built-in screener rubrics right inside your browser.": "अपने ब्राउज़र के भीतर ही अंतर्निहित स्क्रीनिंग मानकों के साथ 1-क्लिक वीडियो कॉल करें।",
        "Unlock matched candidates with Move ONN Smart Sourcing": "Move ONN स्मार्ट सोर्सिंग के साथ मेल खाने वाले उम्मीदवारों को अनलॉक करें",
        "When you have a job posted and add a Move ONN Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Move ONN fit your job description. When someone stands out, invite them to apply directly.": "जब आप कोई नौकरी पोस्ट करते हैं और Move ONN स्मार्ट सोर्सिंग जोड़ते हैं, तो आप तुरंत उन उम्मीदवारों को देखना शुरू करते हैं जिनके सीवी आपके विवरण से मेल खाते हैं। किसी के खड़े होने पर उन्हें सीधे आवेदन करने के लिए आमंत्रित करें।",
        "Explore Smart Sourcing": "स्मार्ट सोर्सिंग देखें",
        "Employer Help Centre": "नियोक्ता सहायता केंद्र",
        "Employer Resources Library": "नियोक्ता संसाधन पुस्तकालय",
        "Ready to find your next great hire?": "क्या आप अपनी अगली बेहतरीन भर्ती के लिए तैयार हैं?",
        "Build your team with India's #1 hiring network": "भारत के #1 हायरिंग नेटवर्क के साथ अपनी टीम बनाएं",
        "Build your team with India’s #1 hiring network": "भारत के #1 हायरिंग नेटवर्क के साथ अपनी टीम बनाएं",
        "Post a job in minutes": "मिनटों में नौकरी पोस्ट करें",
        "Frequently asked questions": "अक्सर पूछे जाने वाले प्रश्न",
        "Why is my job here if I did not post it?": "अगर मैंने पोस्ट नहीं किया तो मेरी नौकरी यहाँ क्यों है?",
        "How do I manage/cancel my post?": "मैं अपनी नौकरी पोस्ट का प्रबंधन/रद्द कैसे करूं?",
        "Does Move ONN remove job postings?": "क्या Move ONN नौकरी पोस्टिंग को हटाता है?",
        "How is Move ONN different from other places where I can post jobs?": "Move ONN उन अन्य जगहों से कैसे अलग है जहाँ मैं नौकरी पोस्ट कर सकता हूँ?",
        "Most posts go live within 24 to 48 hours after a standard review.": "अधिकांश पोस्ट मानक समीक्षा के 24 से 48 घंटों के भीतर लाइव हो जाती हैं।",
        "Move ONN pulls postings from career sites and boards to help jobseekers find all available roles in one place.": "Move ONN करियर साइटों और जॉब बोर्डों से लिस्टिंग एकत्रित करता है ताकि नौकरी चाहने वालों को सभी उपलब्ध पद एक ही स्थान पर मिल सकें।",
        "In your Dashboard, click 'Edit Job' and change the status to 'Paused' or 'Closed.'": "अपने डैशबोर्ड में, 'Edit Job' पर क्लिक करें और स्थिति को 'Paused' या 'Closed' में बदलें।",
        "Yes. Move ONN reserves the right to remove any job that violates our quality standards.": "हाँ। Move ONN के पास गुणवत्ता मानकों का उल्लंघन करने वाली किसी भी नौकरी को हटाने का अधिकार है।",
        "Move ONN is both a job search engine and an all-in-one hiring platform.": "Move ONN एक जॉब सर्च इंजन और ऑल-इन-वन हायरिंग प्लेटफॉर्म दोनों है।",
        "Find great places to work": "काम करने के लिए बेहतरीन स्थान खोजें",
        "Get access to millions of company reviews": "लाखों कंपनी समीक्षाओं तक पहुंच प्राप्त करें",
        "Company name or job title": "कंपनी का नाम या नौकरी का शीर्षक",
        "Find Companies": "कंपनियां खोजें",
        "Do you want to search for salaries?": "क्या आप वेतन खोजना चाहते हैं?",
        "Analyze job market salaries": "नौकरी बाजार के वेतन का विश्लेषण करें",
        "Top companies in India": "भारत की शीर्ष कंपनियां",
        "Popular companies": "लोकप्रिय कंपनियां",
        "Discover your earning potential": "अपनी कमाई की क्षमता जानें",
        "Explore high-paying careers, salaries and job openings by industry and location.": "उद्योग और स्थान के अनुसार उच्च वेतन वाले करियर, वेतन और रिक्तियों का अन्वेषण करें।",
        "Browse top-paying jobs by industry": "उद्योग के अनुसार उच्चतम भुगतान वाली नौकरियां देखें",
        "Choose an industry": "एक उद्योग चुनें",
        "All Industries": "सभी उद्योग",
        "Job openings": "नौकरी के अवसर",
        "Search salaries by job title...": "पद के अनुसार वेतन खोजें...",
        "Search salaries": "वेतन खोजें",
        "Welcome Back": "वापसी पर स्वागत है",
        "Welcome to Move ONN": "Move ONN में आपका स्वागत है",
        "Sign in to your Move ONN account": "अपने Move ONN खाते में साइन इन करें",
        "Connect with visionary employers and discover top engineering & executive opportunities.": "दूरदर्शी नियोक्ताओं से जुड़ें और शीर्ष इंजीनियरिंग व कार्यकारी अवसरों की खोज करें।",
        "Empowering your high-performance career opportunities and enterprise recruitment workflows.": "تمكين مسارك المهني وحلول التوظيف المؤسسية المتقدمة.",
        "Empowering your high-performance web applications and enterprise workflows with secure technology.": "تمكين تطبيقاتك وحلول التوظيف المؤسسية الآمنة.",
        "Build, scale and innovate with our next-generation digital cloud architecture and tools.": "ابنِ وطوّر مستقبلك مع منصتنا الرقمية المبتكرة للتوظيف.",
        "Continue with Google": "Google के साथ जारी रखें",
        "Continue with Apple": "Apple के साथ जारी रखें",
        "Username or Email": "उपयोगकर्ता नाम या ईमेल",
        "Full name": "पूरा नाम",
        "Enter your full name": "अपना पूरा नाम दर्ज करें",
        "Email Address": "ईमेल पता",
        "Email address": "ईमेल पता",
        "Password": "पासवर्ड",
        "Sign In": "साइन इन",
        "Create Account": "खाता बनाएं",
        "Don't have an account?": "ليس لديك حساب؟",
        "Already have an account?": "هل لديك حساب بالفعل؟",
        "Sign Up": "إنشاء حساب جديد",
        "Join the Move ONN community": "Move ONN समुदाय में शामिल हों",
        "or with email": "या ईमेल द्वारा",
        "Browse Jobs": "नौकरियां देखें",
        "Salary Calculator": "वेतन कैलकुलेटर",
        "Company Reviews": "कंपनी समीक्षाएं",
        "Create Candidate Profile": "उम्मीदवार प्रोफाइल बनाएं",
        "Recruitment Solutions": "भर्ती समाधान",
        "Hiring Plans": "हायरिंग योजनाएं",
        "Global Hiring": "वैश्विक भर्ती",
        "About Us": "हमारे बारे में",
        "International Portals": "अंतर्राष्ट्रीय पोर्टल",
        "Trust & Safety": "विश्वास और सुरक्षा",
        "Help Center": "सहायता केंद्र",
        "Privacy Center": "गोपनीयता केंद्र",
        "Cookies": "कुकीज़",
        "Privacy": "गोपनीयता",
        "Terms": "शर्तें",
        "All rights reserved.": "सर्वाधिकार सुरक्षित।",
        "© 2026 Move ONN Consultancy Solutions. All rights reserved.": "© 2026 Move ONN कंसल्टेंसी सॉल्यूशंस। सर्वाधिकार सुरक्षित।",
        "Keep me signed in on this device": "मुझे इस डिवाइस पर साइन इन रखें",
        "Forgot password?": "पासवर्ड भूल गए?",
        "By continuing, you agree to Move ONN's": "जारी रखकर, आप Move ONN की",
        "Terms of Service": "सेवा की शर्तें",
        "Privacy Policy": "गोपनीयता नीति",
        "and": "और",
        "20.1M+ Verified Candidate CVs": "20.1M+ सत्यापित उम्मीदवार सीवी",
        "Direct Employer Communication": "नियोक्ता से सीधा संपर्क",
        "GDPR & ISO-27001 Certified": "GDPR और ISO-27001 प्रमाणित",
        "Move ONN | Premier Tech & Executive Recruitment Consultancy": "Move ONN | प्रमुख तकनीकी और कार्यकारी भर्ती परामर्श",
        "Recommended Jobs - Move ONN Consultancy": "अनुशंसित नौकरियां - Move ONN परामर्श",
        "Company Reviews & Top Employers - Move ONN Consultancy": "कंपनी समीक्षाएं और शीर्ष नियोक्ता - Move ONN परामर्श",
        "Salary Guide & Pay Calculator - Move ONN Consultancy": "वेतन गाइड और वेतन कैलकुलेटर - Move ONN परामर्श",
        "Hire Top Talent & Post Jobs - Move ONN Consultancy": "सर्वश्रेष्ठ प्रतिभाओं को नियुक्त करें और नौकरी पोस्ट करें - Move ONN परामर्श",
        "Worldwide International Job Portals - Move ONN Consultancy": "विश्वव्यापी अंतर्राष्ट्रीय नौकरी पोर्टल - Move ONN परामर्श",
        "Popular Job Locations": "लोकप्रिय नौकरी स्थान",
        "Bengaluru (Silicon Valley)": "बेंगलुरु (सिलिकॉन वैली)",
        "Hyderabad (HITEC City)": "हैदराबाद (हाई-टेक सिटी)",
        "Pune (Hinjewadi)": "पुणे (हिंजवड़ी)",
        "Delhi / NCR (Noida & Gurugram)": "दिल्ली / एनसीआर (नोएडा और गुरुग्राम)",
        "Mumbai & Navi Mumbai": "मुंबई और नवी मुंबई",
        "Chennai (OMR Corridor)": "चेन्नई (ओएमआर कॉरिडोर)",
        "Kolkata (Salt Lake)": "कोलकाता (साल्ट लेक)",
        "Chandigarh IT Park": "चंडीगढ़ आईटी पार्क",
        "Patna (Bihar)": "पटना (बिहार)",
        "Patna / Bihar": "पटना / बिहार",
        "Delhi / NCR": "दिल्ली / एनसीआर",
        "Innovate. Build. Empower. Connecting top engineering and executive talent with visionary enterprises across India and globally.": "नवाचार करें। निर्माण करें। सशक्त बनाएं। भारत और विश्व स्तर पर दूरदर्शी उद्यमों के साथ शीर्ष इंजीनियरिंग और कार्यकारी प्रतिभाओं को जोड़ना।",
        "India's leading career acceleration and corporate recruitment portal. Empowering candidates and hiring managers with verified opportunities.": "भारत का अग्रणी करियर त्वरण और कॉर्पोरेट भर्ती पोर्टल। सत्यापित अवसरों के साथ उम्मीदवारों और भर्ती प्रबंधकों को सशक्त बनाना।",
        "Privacy Centre": "गोपनीयता केंद्र",
        "Change Country": "देश बदलें",
        "Change country (India)": "देश बदलें (भारत)",
        "Help Centre": "सहायता केंद्र",
        "Welcome": "स्वागत है",
        "Back!": "पुनः!",
        "Join": "जुड़ें",
        "Us Today!": "आज ही हमारे साथ!",
        "name@company.com": "name@company.com",
        "••••••••": "••••••••",
        "Experience (Any)": "अनुभव (कोई भी)",
        "Fresher (0 Yrs)": "नवागंतुक (0 वर्ष)",
        "2+ Yrs": "2+ वर्ष",
        "3+ Yrs": "3+ वर्ष",
        "5+ Yrs": "5+ वर्ष",
        "8+ Yrs": "8+ वर्ष",
        "0 - 1 Yrs (Freshers)": "0 - 1 वर्ष (नवागंतुक)",
        "1 - 3 Yrs": "1 - 3 वर्ष",
        "3 - 5 Yrs": "3 - 5 वर्ष",
        "All Filters": "सभी फ़िल्टर",
        "Clear All": "सभी साफ़ करें",
        "Work Mode": "कार्य का तरीका",
        "Department": "विभाग",
        "Engineering - Software": "इंजीनियरिंग - सॉफ्टवेयर",
        "Data Science & Analytics": "डेटा साइंस और एनालिटिक्स",
        "Consulting & Strategy": "परामर्श और रणनीति",
        "Human Resources": "मानव संसाधन",
        "Showing": "दिखाया जा रहा है",
        "recommended jobs based on your profile": "आपकी प्रोफ़ाइल पर आधारित अनुशंसित नौकरियां",
        "Sort by: Relevance": "क्रमबद्ध करें: प्रासंगिकता",
        "Sort by: Date (Newest)": "क्रमबद्ध करें: दिनांक (नवीनतम)",
        "Sort by: Salary (High to Low)": "क्रमबद्ध करें: वेतन (उच्च से निम्न)",
        "Apply to Senior Full Stack Developer": "सीनियर फुल स्टैक डेवलपर के लिए आवेदन करें",
        "Apex Consultancy Solutions • Bengaluru": "एपेक्स कंसल्टेंसी सॉल्यूशंस • बेंगलुरु",
        "Applicant Profile": "आवेदक प्रोफ़ाइल",
        "Resume / CV": "बायोडाटा / सीवी",
        "Attached": "संलग्न",
        "Total Years of Experience": "कुल अनुभव के वर्ष",
        "Notice Period": "नोटिस अवधि",
        "Immediate Joiner (0 Days)": "तत्काल जॉइनर (0 दिन)",
        "15 Days": "15 दिन",
        "30 Days": "30 दिन",
        "60 Days": "60 दिन",
        "Submit Application": "आवेदन जमा करें",
        "Job Overview": "नौकरी का विवरण",
        "Search by skills": "कौशल द्वारा खोजें",
        "Enter location": "स्थान दर्ज करें",
        "Search by skills, designation, companies...": "कौशल, पदनाम, कंपनियों द्वारा खोजें...",
        "Enter location (e.g. Bengaluru)": "स्थान दर्ज करें (उदा. बेंगलुरु)",
        "Job title": "नौकरी का शीर्षक",
        "IndusInd Bank": "इंडसइंड बैंक",
        "Salaries": "वेतन",
        "Questions": "प्रश्न",
        "Open jobs": "उपलब्ध नौकरियां",
        "Reliance Industries Ltd": "रिलायंस इंडस्ट्रीज लिमिटेड",
        "Urban Company": "अर्बन कंपनी",
        "Adani Group": "अडाणी समूह",
        "L&T Technology Services Ltd.": "एलएंडटी टेक्नोलॉजी सर्विसेज लिमिटेड",
        "Agriculture, Fishing & Forestry": "कृषि, मत्स्य पालन और वानिकी",
        "Architecture & Engineering": "वास्तुकला और इंजीनियरिंग",
        "Business Management, Administrative & Customer Support": "व्यवसाय प्रबंधन, प्रशासनिक और ग्राहक सहायता",
        "Cleaning & Grounds Maintenance": "सफाई और मैदान रखरखाव",
        "Community & Social Services": "सामुदायिक और सामाजिक सेवाएं",
        "Construction & Extraction": "निर्माण और निष्कर्षण",
        "Education & Instruction": "शिक्षा और शिक्षण",
        "Finance & Accounting": "वित्त और लेखा",
        "Food & Beverage": "खाद्य और पेय पदार्थ",
        "Healthcare": "स्वास्थ्य सेवा",
        "Legal": "कानूनी",
        "Manufacturing & Utilities": "विनिर्माण और उपयोगिताएं",
        "Marketing, Advertising & Public Relations": "विपणन, विज्ञापन और जनसंपर्क",
        "Media, Arts & Design": "मीडिया, कला और डिजाइन",
        "Personal Service": "व्यक्तिगत सेवा",
        "Repair, Maintenance & Installation": "मरम्मत, रखरखाव और स्थापना",
        "Safety, Security & Defence Service": "सुरक्षा, संरक्षण और रक्षा सेवा",
        "Sales & Retail": "बिक्री और खुदरा",
        "Science & Research": "विज्ञान और अनुसंधान",
        "Supply Chain & Logistics": "आपूर्ति श्रृंखला और रसद",
        "Technology": "प्रौद्योगिकी",
        "Transportation": "परिवहन",
        "Travel, Attractions & Events": "यात्रा, आकर्षण और कार्यक्रम",
        "Software Engineer": "सॉफ्टवेयर इंजीनियर",
        "Registered Nurse": "पंजीकृत नर्स",
        "Accountant": "मुनीम / एकाउंटेंट",
        "Business Analyst": "बिजनेस एनालिस्ट",
        "Nursing Assistant": "नर्सिंग सहायक",
        "Sales Executive": "बिक्री कार्यकारी",
        "Human Resources Specialist": "मानव संसाधन विशेषज्ञ",
        "Customer Service Representative": "ग्राहक सेवा प्रतिनिधि",
        "Assistant Store Manager": "सहायक स्टोर प्रबंधक",
        "Elementary School Teacher": "प्राथमिक विद्यालय शिक्षक",
        "Customer Care Specialist": "ग्राहक देखभाल विशेषज्ञ",
        "Office Assistant": "कार्यालय सहायक",
        "Back Office Executive": "बैक ऑफिस एक्जीक्यूटिव",
        "Data Entry Clerk": "डेटा प्रविष्टि क्लर्क",
        "Graphic Designer": "ग्राफिक डिजाइनर",
        "Front Desk Manager": "फ्रंट डेस्क प्रबंधक",
        "Let’s hire your next great candidate.": "आइए आपके अगले बेहतरीन उम्मीदवार को नियुक्त करें।",
        "Fast": "तेजी से",
        "Get started with a job post. Move ONN has 20.1M unique monthly users to deliver verified applicants.": "नौकरी पोस्ट के साथ शुरुआत करें। सत्यापित आवेदकों को वितरित करने के लिए Move ONN के पास 20.1 मिलियन अद्वितीय मासिक उपयोगकर्ता हैं।",
        "Customise your post with screening tools to help narrow down to potential top-tier candidates.": "संभावित शीर्ष स्तरीय उम्मीदवारों तक पहुँचने के लिए स्क्रीनिंग टूल के साथ अपनी पोस्ट को कस्टमाइज़ करें।",
        "98% Match": "98% मिलान",
        "Senior Full Stack Engineer • Bangalore": "सीनियर फुल स्टैक इंजीनियर • बैंगलोर",
        "95% Match": "95% मिलान",
        "Lead Product Designer • Remote": "लीड प्रोडक्ट डिज़ाइनर • रिमोट",
        "Hiring resources for every step of the process": "प्रक्रिया के हर चरण के लिए भर्ती संसाधन",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process, including interview guides, competitive market salary reports, and compliance playbooks.": "आप अपनी भर्ती यात्रा में अकेले नहीं हैं। हमारे पास साक्षात्कार गाइड, प्रतिस्पर्धी बाजार वेतन रिपोर्ट और अनुपालन प्लेबुक सहित भर्ती प्रक्रिया के हर चरण के लिए उपयोगी संसाधन हैं।",
        "Employer Resource Library": "नियोक्ता संसाधन पुस्तकालय",
        "Ready to find your next hired candidate?": "क्या आप अपने अगले उम्मीदवार को नियुक्त करने के लिए तैयार हैं?",
        "Create a job post in minutes and tap into India's largest verified talent network of top engineers, executives, and specialists.": "मिनटों में नौकरी पोस्ट बनाएं और शीर्ष इंजीनियरों, अधिकारियों और विशेषज्ञों के भारत के सबसे बड़े सत्यापित प्रतिभा नेटवर्क का लाभ उठाएं।",
        "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
        "How do I create an Move ONN for Employers account for free?": "मैं मुफ्त में नियोक्ताओं के लिए Move ONN खाता कैसे बना सकता हूँ?",
        "You can register for an employer account in minutes by clicking 'Post a job' or 'Sign in' and choosing Register. Simply enter your company work email, full name, and password to immediately access candidate screening, job management, and messaging.": "आप 'नौकरी पोस्ट करें' या 'साइन इन' पर क्लिक करके और रजिस्टर चुनकर मिनटों में नियोक्ता खाते के लिए पंजीकरण कर सकते हैं। उम्मीदवार स्क्रीनिंग, नौकरी प्रबंधन और संदेश सेवा तक तुरंत पहुँचने के लिए बस अपनी कंपनी का कार्य ईमेल, पूरा नाम और पासवर्ड दर्ज करें।",
        "Does Move ONN integrate with my ATS?": "क्या Move ONN मेरे एटीएस (ATS) के साथ एकीकृत होता है?",
        "Yes. Move ONN integrates seamlessly with all leading Applicant Tracking Systems (ATS) including Greenhouse, Lever, Workday, BambooHR, and custom webhook solutions to synchronize job postings, applicant statuses, and candidate notes.": "हाँ। Move ONN ग्रीनहाउस, लीवर, वर्कडे, बैम्बूएचआर और कस्टम वेबहुक समाधानों सहित सभी प्रमुख आवेदक ट्रैकिंग सिस्टम (एटीएस) के साथ सुचारू रूप से एकीकृत होता है ताकि नौकरी पोस्टिंग, आवेदक स्थितियों और उम्मीदवार नोट्स को सिंक्रनाइज़ किया जा सके।",
        "How can I contact candidates who have not applied to my job?": "मैं उन उम्मीदवारों से कैसे संपर्क कर सकता हूँ जिन्होंने मेरी नौकरी के लिए आवेदन नहीं किया है?",
        "Use Move ONN Smart Sourcing to search our CV database of over 20 million verified candidates. Filter candidates by exact skills, years of experience, and location, and invite them directly to apply for your vacancies.": "20 मिलियन से अधिक सत्यापित उम्मीदवारों के हमारे सीवी डेटाबेस को खोजने के लिए Move ONN स्मार्ट सोर्सिंग का उपयोग करें। सटीक कौशल, अनुभव के वर्षों और स्थान के आधार पर उम्मीदवारों को फ़िल्टर करें, और उन्हें अपनी रिक्तियों के लिए आवेदन करने हेतु सीधे आमंत्रित करें।",
        "How does Move ONN help me screen candidates?": "Move ONN उम्मीदवारों की स्क्रीनिंग में मेरी मदद कैसे करता है?",
        "You can add customized screener questions, required qualifications, and pre-employment assessment tests to your job post to automatically highlight top applicants and filter out non-matching submissions.": "आप शीर्ष आवेदकों को स्वचालित रूप से हाइलाइट करने और गैर-मिलान सबमिशन को फ़िल्टर करने के लिए अपने जॉब पोस्ट में अनुकूलित स्क्रिनर प्रश्न, आवश्यक योग्यताएं और रोजगार पूर्व मूल्यांकन परीक्षण जोड़ सकते हैं।",
        "Can Move ONN help with high-volume hiring?": "क्या Move ONN उच्च-मात्रा में भर्ती करने में मदद कर सकता है?",
        "Absolutely. Our enterprise recruitment suite provides bulk candidate imports, automated interview scheduling, collaborative hiring team permissions, and prioritized job syndication across our entire partner network.": "बिल्कुल। हमारा उद्यम भर्ती सुइट बल्क उम्मीदवार आयात, स्वचालित साक्षात्कार शेड्यूलिंग, सहयोगी भर्ती टीम अनुमतियां, और हमारे संपूर्ण भागीदार नेटवर्क में प्राथमिकता प्राप्त जॉब सिंडिकेशन प्रदान करता है।",
        "What are the benefits of a Sponsored Job?": "प्रायोजित नौकरी (Sponsored Job) के क्या लाभ हैं?",
        "Sponsored Jobs receive prime placement in search results and targeted candidate recommendations, delivering up to 4.5x more applications and significantly reducing time-to-hire compared to organic listings.": "प्रायोजित नौकरियों को खोज परिणामों और लक्षित उम्मीदवार सिफारिशों में प्रमुख स्थान मिलता है, जिससे जैविक सूचियों की तुलना में 4.5 गुना अधिक आवेदन प्राप्त होते हैं और भर्ती का समय काफी कम हो जाता है।",
        "Can sponsoring improve time-to-hire?": "क्या प्रायोजन से भर्ती में लगने वाले समय में सुधार हो सकता है?",
        "Yes. Sponsored Jobs achieve higher daily impressions and applicant velocity, allowing hiring managers to make quality hires in an average of under 14 business days.": "हाँ। प्रायोजित नौकरियां उच्च दैनिक प्रभाव और आवेदक वेग प्राप्त करती हैं, जिससे भर्ती प्रबंधकों को औसतन 14 कार्य दिवसों के भीतर गुणवत्तापूर्ण नियुक्तियां करने की अनुमति मिलती है।",
        "How can I improve visibility?": "मैं दृश्यता में सुधार कैसे कर सकता हूँ?",
        "Craft a clear, descriptive job title, provide transparent salary expectations, specify detailed requirements, and sponsor your post to ensure it remains prominently displayed to matching jobseekers.": "एक स्पष्ट, वर्णनात्मक नौकरी शीर्षक तैयार करें, पारदर्शी वेतन अपेक्षाएं प्रदान करें, विस्तृत आवश्यकताओं को निर्दिष्ट करें, और यह सुनिश्चित करने के लिए अपनी पोस्ट को प्रायोजित करें कि यह मिलान करने वाले नौकरी चाहने वालों को प्रमुखता से प्रदर्शित होती रहे।",
        "How do I attract top talent?": "मैं शीर्ष प्रतिभाओं को कैसे आकर्षित करूँ?",
        "Highlight your company culture, competitive perks, flexible remote policies, and verified company reviews on your Move ONN Company Profile to stand out to passive senior talent.": "सक्रिय और निष्क्रिय वरिष्ठ प्रतिभाओं के बीच खड़े होने के लिए अपनी कंपनी संस्कृति, प्रतिस्पर्धी अनुलाभ, लचीली रिमोट नीतियों और अपने Move ONN कंपनी प्रोफाइल पर सत्यापित कंपनी समीक्षाओं को हाइलाइट करें।",
        "How can Move ONN help with Employer Branding?": "Move ONN नियोक्ता ब्रांडिंग में कैसे मदद कर सकता है?",
        "A verified Move ONN Company Page allows you to showcase office photos, CEO ratings, employee testimonials, company updates, and your open roles to over 20 million career-focused professionals.": "एक सत्यापित Move ONN कंपनी पेज आपको कार्यालय की तस्वीरें, सीईओ रेटिंग, कर्मचारी प्रशंसापत्र, कंपनी अपडेट और अपनी खुली भूमिकाओं को 20 मिलियन से अधिक करियर-केंद्रित पेशेवरों के सामने प्रदर्शित करने की अनुमति देता है।",
        "How much does it cost to sponsor?": "प्रायोजित करने में कितना खर्च आता है?",
        "Move ONN offers flexible performance-based hiring budgets. You set a daily or monthly budget that fits your hiring needs, and you only pay when interested candidates engage with your job post.": "Move ONN लचीले प्रदर्शन-आधारित भर्ती बजट प्रदान करता है। आप एक दैनिक या मासिक बजट निर्धारित करते हैं जो आपकी भर्ती आवश्यकताओं के अनुकूल हो, और आप केवल तभी भुगतान करते हैं जब इच्छुक उम्मीदवार आपके जॉब पोस्ट से जुड़ते हैं।",
        "Can I post without listing the salary?": "क्या मैं वेतन सूचीबद्ध किए बिना पोस्ट कर सकता हूँ?",
        "Yes, listing salary is optional. However, postings with transparent salary ranges receive on average 35% more verified candidate applications and faster candidate responses.": "हाँ, वेतन सूचीबद्ध करना वैकल्पिक है। हालाँकि, पारदर्शी वेतन सीमा वाली पोस्टिंग को औसतन 35% अधिक सत्यापित उम्मीदवार आवेदन और तेज़ उम्मीदवार प्रतिक्रियाएँ प्राप्त होती हैं।",
        "How long until my job is visible?": "मेरी नौकरी दिखने में कितना समय लगेगा?",
        "Most posts go live within 24 to 48 hours after a standard quality and compliance review.": "अधिकांश पोस्ट एक मानक गुणवत्ता और अनुपालन समीक्षा के बाद 24 से 48 घंटों के भीतर लाइव हो जाती हैं।",
        "Move ONN is both a job search engine and an all-in-one hiring platform. Beyond jobs posted directly by employers, Move ONN also aggregates job listings from thousands of sources across the internet. Employers gain access to features like virtual interviews and 'Hiring Insights'.": "Move ONN एक जॉब सर्च इंजन और ऑल-इन-वन हायरिंग प्लेटफॉर्म दोनों है। नियोक्ताओं द्वारा सीधे पोस्ट की गई नौकरियों के अलावा, Move ONN इंटरनेट पर हजारों स्रोतों से नौकरी लिस्टिंग को भी एकत्रित करता है। नियोक्ताओं को वर्चुअल साक्षात्कार और 'हायरिंग इनसाइट्स' जैसी सुविधाओं तक पहुँच प्राप्त होती है।",
        "Country and language": "देश और भाषा",
        "Search countries and languages": "देशों और भाषाओं को खोजें",
        "Search countries or languages": "देश या भाषा खोजें",
        "United Arab Emirates (Arabic)": "संयुक्त अरब अमीरात (अरबी)",
        "United Arab Emirates (English)": "संयुक्त अरब अमीरात (अंग्रेज़ी)",
        "Argentina (español)": "अर्जेंटीना (español)",
        "Argentina (Spanish)": "अर्जेंटीना (स्पैनिश)",
        "Austria (German)": "ऑस्ट्रिया (जर्मन)",
        "Australia (English)": "ऑस्ट्रेलिया (अंग्रेज़ी)",
        "Belgium (German)": "बेल्जियम (जर्मन)",
        "Belgium (English)": "बेल्जियम (अंग्रेज़ी)",
        "Belgium (French)": "बेल्जियम (फ़्रेंच)",
        "Belgium (Dutch)": "बेल्जियम (डच)",
        "Bahrain (Arabic)": "बहरीन (अरबी)",
        "Bahrain (English)": "बहरीन (अंग्रेज़ी)",
        "Brazil (Portuguese)": "ब्राजील (पुर्तगाली)",
        "Canada (English)": "कनाडा (अंग्रेज़ी)",
        "Canada (français)": "कनाडा (français)",
        "Canada (French)": "कनाडा (फ़्रेंच)",
        "Switzerland (German)": "स्विट्जरलैंड (जर्मन)",
        "Switzerland (English)": "स्विट्जरलैंड (अंग्रेज़ी)",
        "Switzerland (French)": "स्विट्जरलैंड (फ़्रेंच)",
        "Switzerland (Italian)": "स्विट्जरलैंड (इतालवी)",
        "Chile (español)": "चिली (español)",
        "Chile (Spanish)": "चिली (स्पैनिश)",
        "China (Chinese)": "चीन (चीनी)",
        "Colombia (español)": "कोलंबिया (español)",
        "Colombia (Spanish)": "कोलंबिया (स्पैनिश)",
        "Costa Rica (español)": "कोस्टा रिका (español)",
        "Costa Rica (Spanish)": "कोस्टा रिका (स्पैनिश)",
        "Czechia (Czech)": "चेकिया (चेक)",
        "Germany (German)": "जर्मनी (जर्मन)",
        "Germany (Ukrainian)": "जर्मनी (यूक्रेनी)",
        "Denmark (Danish)": "डेनमार्क (डेनिश)",
        "Ecuador (español)": "इक्वाडोर (español)",
        "Ecuador (Spanish)": "इक्वाडोर (स्पैनिश)",
        "Egypt (Arabic)": "मिस्र (अरबी)",
        "Egypt (English)": "मिस्र (अंग्रेज़ी)",
        "Spain (Spanish)": "स्पेन (स्पैनिश)",
        "Finland (Finnish)": "फिनलैंड (फ़िनिश)",
        "Finland (svenska)": "फिनलैंड (svenska)",
        "Finland (Swedish)": "फिनलैंड (स्वीडिश)",
        "France (français)": "फ्रांस (français)",
        "France (French)": "फ्रांस (फ़्रेंच)",
        "United Kingdom (English)": "यूनाइटेड किंगडम (अंग्रेज़ी)",
        "Greece (Greek)": "ग्रीस (ग्रीक)",
        "Hong Kong SAR China (English)": "हांगकांग विशेष प्रशासनिक क्षेत्र चीन (अंग्रेज़ी)",
        "Hong Kong SAR China (Chinese)": "हांगकांग विशेष प्रशासनिक क्षेत्र चीन (चीनी)",
        "Hungary (Hungarian)": "हंगरी (हंगेरियन)",
        "Indonesia (English)": "इंडोनेशिया (अंग्रेज़ी)",
        "Indonesia (Indonesia)": "इंडोनेशिया (Indonesia)",
        "Indonesia (Indonesian)": "इंडोनेशिया (इंडोनेशियाई)",
        "Ireland (English)": "आयरलैंड (अंग्रेज़ी)",
        "Israel (Hebrew)": "इज़राइल (हिब्रू)",
        "India (English)": "भारत (अंग्रेज़ी)",
        "India (Hindi)": "भारत (हिन्दी)",
        "Italy (Italian)": "इटली (इतालवी)",
        "Japan (Japanese)": "जापान (जापानी)",
        "South Korea (Korean)": "दक्षिण कोरिया (कोरियाई)",
        "Kuwait (Arabic)": "कुवैत (अरबी)",
        "Kuwait (English)": "कुवैत (अंग्रेज़ी)",
        "Luxembourg (German)": "लक्ज़मबर्ग (जर्मन)",
        "Luxembourg (English)": "लक्ज़मबर्ग (अंग्रेज़ी)",
        "Luxembourg (français)": "लक्ज़मबर्ग (français)",
        "Luxembourg (French)": "लक्ज़मबर्ग (फ़्रेंच)",
        "Morocco (Arabic)": "मोरक्को (अरबी)",
        "Morocco (French)": "मोरक्को (फ़्रेंच)",
        "Mexico (Spanish)": "मेक्सिको (स्पैनिश)",
        "Malaysia (English)": "मलेशिया (अंग्रेज़ी)",
        "Nigeria (English)": "नाइजीरिया (अंग्रेज़ी)",
        "Netherlands (Dutch)": "नीदरलैंड (डच)",
        "Norway (Norwegian)": "नॉर्वे (नॉर्वेजियन)",
        "New Zealand (English)": "न्यूजीलैंड (अंग्रेज़ी)",
        "Oman (Arabic)": "ओमान (अरबी)",
        "Oman (English)": "ओमान (अंग्रेज़ी)",
        "Panama (Spanish)": "पनामा (स्पैनिश)",
        "Peru (Spanish)": "पेरू (स्पैनिश)",
        "Philippines (English)": "फिलीपींस (अंग्रेज़ी)",
        "Pakistan (English)": "पाकिस्तान (अंग्रेज़ी)",
        "Poland (Polish)": "पोलैंड (पोलिश)",
        "Poland (Ukrainian)": "पोलैंड (यूक्रेनी)",
        "Portugal (português)": "पुर्तगाल (português)",
        "Portugal (Portuguese)": "पुर्तगाल (पुर्तगाली)",
        "Qatar (Arabic)": "कतर (अरबी)",
        "Qatar (English)": "कतर (अंग्रेज़ी)",
        "Romania (Romanian)": "रोमानिया (रोमानियाई)",
        "Russia (Russian)": "रूस (रूसी)",
        "Saudi Arabia (Arabic)": "सऊदी अरब (अरबी)",
        "Saudi Arabia (English)": "सऊदी अरब (अंग्रेज़ी)",
        "Sweden (Swedish)": "स्वीडन (स्वीडिश)",
        "Singapore (English)": "सिंगापुर (अंग्रेज़ी)",
        "Singapore (Chinese)": "सिंगापुर (चीनी)",
        "Thailand (English)": "थाईलैंड (अंग्रेज़ी)",
        "Thailand (Thai)": "थाईलैंड (थाई)",
        "Türkiye (Türkçe)": "तुर्किये (Türkçe)",
        "Türkiye (Turkish)": "तुर्किये (तुर्की)",
        "Taiwan (Chinese)": "ताइवान (चीनी)",
        "Ukraine (Russian)": "यूक्रेन (रूसी)",
        "Ukraine (Ukrainian)": "यूक्रेन (यूक्रेनी)",
        "United States (English)": "संयुक्त राज्य अमेरिका (अंग्रेज़ी)",
        "United States (Spanish)": "संयुक्त राज्य अमेरिका (स्पैनिश)",
        "Uruguay (español)": "उरुग्वे (español)",
        "Uruguay (Spanish)": "उरुग्वे (स्पैनिश)",
        "Venezuela (español)": "वेनेजुएला (español)",
        "Venezuela (Spanish)": "वेनेजुएला (स्पैनिश)",
        "Vietnam (English)": "वियतनाम (अंग्रेज़ी)",
        "Vietnam (Vietnamese)": "वियतनाम (वियतनामी)",
        "South Africa (English)": "दक्षिण अफ्रीका (अंग्रेज़ी)",
        "Top Matches": "शीर्ष मिलान",
        "Experience": "अनुभव",
        "Location": "स्थान",
        "Bengaluru": "बेंगलुरु",
        "Design Systems": "डिज़ाइन सिस्टम",
        "User Research": "उपयोगकर्ता अनुसंधान",
        "Apex Consultancy Solutions": "एपेक्स कंसल्टेंसी सॉल्यूशंस",
        "Tata Consultancy Services (TCS)": "टाटा कंसल्टेंसी सर्विसेज (टीसीएस)",
        "Infosys Technologies": "इन्फोसिस टेक्नोलॉजीज",
        "Wipro Enterprises": "विप्रो एंटरप्राइजेज",
        "Google India": "गूगल इंडिया",
        "Microsoft India": "माइक्रोसॉफ्ट इंडिया",
        "Amazon Development Centre": "अमेज़न डेवलपमेंट सेंटर",
        "Cognizant Technology": "कॉग्निजेंट टेक्नोलॉजी",
        "HCL Technologies": "एचसीएल टेक्नोलॉजीज",
        "Tech Mahindra": "टेक महिंद्रा",
        "Company Email": "कंपनी ईमेल",
        "Full Name": "पूरा नाम"
    },
    "ar": {
        "Home": "الرئيسية",
        "Jobs": "الوظائف",
        "Company reviews": "تقييم الشركات",
        "Salary guide": "دليل الرواتب",
        "Sign in": "تسجيل الدخول",
        "Sign out": "تسجيل الخروج",
        "Sign Out": "تسجيل الخروج",
        "Register": "إنشاء حساب",
        "Employers / Post Job": "أصحاب العمل / انشر وظيفة",
        "Post a job": "انشر وظيفة",
        "Post a Job": "انشر وظيفة",
        "Job Seekers": "الباحثون عن عمل",
        "Employers": "أصحاب العمل",
        "Change country:": "تغيير البلد:",
        "Change country: India": "تغيير البلد: الهند",
        "Your next job starts here.": "وظيفتك القادمة تبدأ هنا.",
        "Your next job starts here": "وظيفتك القادمة تبدأ هنا",
        "Create an account or sign in to see your personalised job recommendations.": "أنشئ حساباً أو سجّل الدخول للاطلاع على توصيات الوظائف المخصصة لك.",
        "Get Started": "ابدأ الآن",
        "What": "ماذا",
        "Where": "أين",
        "Find jobs": "ابحث عن وظائف",
        "Search jobs": "ابحث عن وظائف",
        "Search": "بحث",
        "Job title, keywords, or company": "المسمى الوظيفي أو الكلمات الدلالية أو الشركة",
        "City, state, zip code, or remote": "المدينة أو المحافظة أو عن بعد",
        "City, state, or 'remote'": "المدينة أو المحافظة أو عن بعد",
        "Patna, Bihar": "باتنا، بيهار",
        "Popular searches:": "عمليات البحث الشائعة:",
        "Popular searches": "عمليات البحث الشائعة",
        "Recent searches": "عمليات البحث الأخيرة",
        "Clear": "مسح",
        "Jobs for you": "وظائف تناسبك",
        "Top job picks for you": "أفضل الوظائف المختارة لك",
        "View all jobs": "عرض جميع الوظائف",
        "View all jobs >": "عرض جميع الوظائف >",
        "Job feed based on your profile and search history": "اقتراحات الوظائف استناداً إلى ملفك وسجل بحثك",
        "TOP MATCH": "أفضل تطابق",
        "RECOMMENDED": "موصى به",
        "HIGH PAY": "راتب مرتفع",
        "PATNA / REMOTE": "باتنا / عن بعد",
        "Actively Hiring": "توظيف نشط",
        "Easily Apply": "تقديم سهل",
        "Early Applicant": "متقدم مبكر",
        "Apply now": "قدّم الآن",
        "Applied": "تم التقديم",
        "Saved": "محفوظ",
        "Save job": "حفظ الوظيفة",
        "Easy apply": "تقديم سهل",
        "Urgent hiring": "توظيف عاجل",
        "Remote": "عن بعد",
        "Full-time": "دوام كامل",
        "Part-time": "دوام جزئي",
        "Fresher": "حديث التخرج",
        "Top matches": "أفضل التطابقات",
        "Saved jobs": "الوظائف المحفوظة",
        "Applied jobs": "الوظائف المقدم عليها",
        "No jobs saved yet": "لا توجد وظائف محفوظة حتى الآن",
        "No applied jobs yet": "لم تقدم على أي وظيفة بعد",
        "New Applicant": "مرشح جديد",
        "Under Review": "قيد المراجعة",
        "Shortlisted": "تمت التصفية",
        "Interview Scheduled": "مقابلة مجدولة",
        "Live Candidate Pipeline": "مسار المرشحين المباشر",
        "Shortlisted & Assessments": "التصفيات والتقييمات",
        "Live Interview Schedule": "جدول المقابلات المباشرة",
        "2 New Matches": "2 مرشحان متطابقان",
        "2 Candidates Shortlisted": "2 مرشحان في القائمة المختصرة",
        "2 Video Calls Ready": "2 مكالمات فيديو جاهزة",
        "Remote options available": "خيارات العمل عن بعد متاحة",
        "Fast response": "استجابة سريعة",
        "Work from office": "العمل من المكتب",
        "Hybrid": "هجين",
        "a year": "سنوياً",
        "per year": "سنوياً",
        "Average salary": "متوسط الراتب",
        "Senior Full Stack Developer": "مطور برمجيات شامل أول",
        "React Frontend Engineer": "مهندس واجهات أمامية React",
        "Python Data Engineer": "مهندس بيانات بايثون",
        "Java Backend Architect": "مهندس برمجيات جافا خبير",
        "Apex Consultancy Solutions - Bengaluru, Karnataka": "أبيكس لحلول الاستشارات - بنغالورو، كارناتاكا",
        "Tata Consultancy Services - Hyderabad, Telangana": "تاتا للخدمات الاستشارية - حيدر أباد، تلنغانة",
        "Infosys Ltd - Pune, Maharashtra": "إنفوسيس المحدودة - بونا، ماهاراشترا",
        "Wipro Technologies - Patna / Remote": "ويبرو تكنولوجيز - باتنا / عن بعد",
        "What's trending on Move ONN": "الأكثر رواجاً على Move ONN",
        "Popular Tech Roles": "أبرز الوظائف التقنية",
        "Top Hiring Cities": "أفضل مدن التوظيف",
        "Executive & Management": "الوظائف التنفيذية والإدارية",
        "Full Stack Developer": "مطور برمجيات شامل",
        "AI & Machine Learning": "الذكاء الاصطناعي وتعلم الآلة",
        "DevOps & Cloud Engineer": "مهندس DevOps وسحابي",
        "Mobile App Developer": "مطور تطبيقات الجوال",
        "Data Analyst & Power BI": "محلل بيانات و Power BI",
        "Cyber Security Specialist": "أخصائي أمن سيبراني",
        "QA Automation Engineer": "مهندس أتمتة الجودة",
        "Top Companies Hiring": "أفضل الشركات التي توظف حالياً",
        "Engineering Director": "مدير هندسي",
        "VP of Product Management": "نائب رئيس إدارة المنتجات",
        "Chief Technology Officer (CTO)": "الرئيس التنفيذي للتكنولوجيا (CTO)",
        "Principal Solution Architect": "كبير مهندسي الحلول",
        "Head of Data Science": "رئيس علوم البيانات",
        "Senior Engineering Manager": "مدير هندسي أول",
        "Scrum Master & Agile Coach": "سكرم ماستر ومدرب أجايل",
        "Chief Information Security Officer": "رئيس أمن المعلومات",
        "Bangalore / Bengaluru": "بنغالور / بنغالورو",
        "Hyderabad": "حيدر أباد",
        "Pune": "بونا",
        "Delhi NCR (Gurgaon / Noida)": "دلهي الكبرى (غورغاون / نويدا)",
        "Mumbai": "مومباي",
        "Chennai": "تشيناي",
        "Patna": "باتنا",
        "Kolkata": "كولكاتا",
        "Ahmedabad (GIFT City)": "أحمد أباد (مدينة جيفت)",
        "Move ONN for Employers": "Move ONN لأصحاب العمل",
        "Let’s hire your next great candidate. Fast.": "دعنا نوظف مرشحك المميز التالي. بسرعة.",
        "Let's hire your next great candidate. Fast.": "دعنا نوظف مرشحك المميز التالي. بسرعة.",
        "No matter the skills, industry, or experience level you're looking for, we can help you find your next great hire.": "مهما كانت المهارات أو المجال أو مستوى الخبرة الذي تبحث عنه، يمكننا مساعدتك في العثور على أفضل الكفاءات.",
        "No matter the skills, industry, or experience level you’re looking for, we can help you find your next great hire.": "مهما كانت المهارات أو المجال أو مستوى الخبرة الذي تبحث عنه، يمكننا مساعدتك في العثور على أفضل الكفاءات.",
        "No matter the skills, experience or qualifications you’re looking for, you’ll find the right people here.": "مهما كانت المهارات أو الخبرة أو المؤهلات التي تبحث عنها، ستجد الأشخاص المناسبين هنا.",
        "No matter the skills, experience or qualifications you're looking for, you'll find the right people here.": "مهما كانت المهارات أو الخبرة أو المؤهلات التي تبحث عنها، ستجد الأشخاص المناسبين هنا.",
        "Manage your hiring from start to finish": "أدر عملية التوظيف من البداية إلى النهاية",
        "Get started with a job post. Move ONN has 20.1M unique monthly users.": "ابدأ بنشر وظيفة. يستقبل Move ONN أكثر من 20.1 مليون مستخدم نشط شهرياً.",
        "Find quality applicants": "اعثر على متقدمين مؤهلين",
        "Customise your post with screening tools to help narrow down to potential candidates.": "خصّص إعلانك بأدوات التصفية لتحديد المرشحين الأكثر ملاءمة بسرعة.",
        "Make connections": "تواصل مباشرة",
        "Track, message, invite and interview directly on Move ONN with no extra apps to download.": "تتبّع وتواصل وادعُ وأجرِ المقابلات مباشرة على Move ONN دون الحاجة لتحميل تطبيقات إضافية.",
        "Hire confidently": "وظّف بكل ثقة",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "لست وحدك في رحلة التوظيف. نوفر لك مصادر مفيدة لكل مرحلة.",
        "You're not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "لست وحدك في رحلة التوظيف. نوفر لك مصادر مفيدة لكل مرحلة.",
        "Your dashboard features": "ميزات لوحة التحكم الخاصة بك",
        "Save time and effort in your hiring journey.": "وفّر الوقت والجهد في رحلة التوظيف الخاصة بك.",
        "Manage your jobs": "إدارة وظائفك",
        "View applicants, edit descriptions, adjust budgets, and monitor candidate status in real time.": "اطّلع على المتقدمين وعدّل الأوصاف وحدد الميزانيات وتابع حالة المرشحين فوراً.",
        "Choose who moves forward": "اختر من ينتقل للمرحلة التالية",
        "Filter by match score, assessment results, and recruiter notes to shortlist candidates fast.": "صفّ المرشحين حسب نسبة التطابق ونتائج الاختبارات وملاحظات مسؤولي التوظيف.",
        "Interview anywhere": "أجرِ المقابلات من أي مكان",
        "Conduct 1-click video calls with built-in screener rubrics right inside your browser.": "أجرِ مكالمات فيديو بنقرة واحدة مع معايير تقييم مدمجة مباشرة من متصفحك.",
        "Unlock matched candidates with Move ONN Smart Sourcing": "اكتشف مرشحين متطابقين مع Move ONN Smart Sourcing",
        "When you have a job posted and add a Move ONN Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Move ONN fit your job description. When someone stands out, invite them to apply directly.": "عند نشر وظيفة والاشتراك في Move ONN Smart Sourcing، تبدأ فوراً برؤية المرشحين الذين تتطابق سيرهم الذاتية مع متطلباتك. ادعُ أفضلهم للتقديم مباشرة.",
        "Explore Smart Sourcing": "استكشف Smart Sourcing",
        "Employer Help Centre": "مركز مساعدة أصحاب العمل",
        "Employer Resources Library": "مكتبة موارد أصحاب العمل",
        "Ready to find your next great hire?": "هل أنت جاهز لتوظيف كفاءتك القادمة؟",
        "Build your team with India's #1 hiring network": "ابنِ فريقك مع شبكة التوظيف الرائدة في الهند",
        "Build your team with India’s #1 hiring network": "ابنِ فريقك مع شبكة التوظيف الرائدة في الهند",
        "Post a job in minutes": "انشر وظيفة خلال دقائق",
        "Frequently asked questions": "الأسئلة الشائعة",
        "Why is my job here if I did not post it?": "لماذا تظهر وظيفتي هنا رغم أنني لم أنشرها؟",
        "How do I manage/cancel my post?": "كيف أدير أو ألغي وظيفتي المنشورة؟",
        "Does Move ONN remove job postings?": "هل يحذف Move ONN إعلانات الوظائف؟",
        "How is Move ONN different from other places where I can post jobs?": "ما الذي يميز Move ONN عن منصات التوظيف الأخرى؟",
        "Most posts go live within 24 to 48 hours after a standard review.": "تُنشر معظم الوظائف خلال 24 إلى 48 ساعة بعد المراجعة المعتادة.",
        "Move ONN pulls postings from career sites and boards to help jobseekers find all available roles in one place.": "يجمع Move ONN الوظائف من مواقع التوظيف المختلفة لمساعدة الباحثين عن عمل على العثور على جميع الفرص في مكان واحد.",
        "In your Dashboard, click 'Edit Job' and change the status to 'Paused' or 'Closed.'": "في لوحة التحكم الخاصة بك، انقر على 'تعديل الوظيفة' وغيّر الحالة إلى 'إيقاف مؤقت' أو 'مغلقة'.",
        "Yes. Move ONN reserves the right to remove any job that violates our quality standards.": "نعم. يحتفظ Move ONN بحق إزالة أي وظيفة تخالف معايير الجودة لدينا.",
        "Move ONN is both a job search engine and an all-in-one hiring platform.": "Move ONN محرك بحث للوظائف ومنصة توظيف شاملة ومتكاملة.",
        "Find great places to work": "اعثر على أفضل بيئات العمل",
        "Get access to millions of company reviews": "اطّلع على ملايين تقييمات الشركات الموثوقة",
        "Company name or job title": "اسم الشركة أو المسمى الوظيفي",
        "Find Companies": "ابحث عن الشركات",
        "Do you want to search for salaries?": "هل ترغب في البحث عن الرواتب؟",
        "Analyze job market salaries": "تحليل رواتب سوق العمل",
        "Top companies in India": "أفضل الشركات في الهند",
        "Popular companies": "شركات شائعة",
        "Discover your earning potential": "اكتشف إمكانات دخلك المالي",
        "Explore high-paying careers, salaries and job openings by industry and location.": "استكشف المهن ذات الدخل المرتفع والرواتب والوظائف المتاحة حسب المجال والموقع.",
        "Browse top-paying jobs by industry": "تصفح أعلى الوظائف أجراً حسب المجال",
        "Choose an industry": "اختر مجالاً",
        "All Industries": "جميع المجالات",
        "Job openings": "فرص العمل الشاغرة",
        "Search salaries by job title...": "ابحث عن الرواتب بالمسمى الوظيفي...",
        "Search salaries": "ابحث عن الرواتب",
        "Welcome Back": "مرحباً بعودتك",
        "Welcome to Move ONN": "مرحباً بك في Move ONN",
        "Sign in to your Move ONN account": "سجّل الدخول إلى حساب Move ONN الخاص بك",
        "Connect with visionary employers and discover top engineering & executive opportunities.": "تواصل مع كبار أصحاب العمل واكتشف أفضل الفرص الهندسية والقيادية.",
        "Empowering your high-performance career opportunities and enterprise recruitment workflows.": "تمكين مسارك المهني وحلول التوظيف المؤسسية المتقدمة.",
        "Empowering your high-performance web applications and enterprise workflows with secure technology.": "تمكين تطبيقاتك وحلول التوظيف المؤسسية الآمنة.",
        "Build, scale and innovate with our next-generation digital cloud architecture and tools.": "ابنِ وطوّر مستقبلك مع منصتنا الرقمية المبتكرة للتوظيف.",
        "Continue with Google": "المتابعة عبر Google",
        "Continue with Apple": "المتابعة عبر Apple",
        "Username or Email": "اسم المستخدم أو البريد الإلكتروني",
        "Full name": "الاسم الكامل",
        "Enter your full name": "أدخل اسمك الكامل",
        "Email Address": "البريد الإلكتروني",
        "Email address": "البريد الإلكتروني",
        "Password": "كلمة المرور",
        "Sign In": "تسجيل الدخول",
        "Create Account": "إنشاء حساب",
        "Don't have an account?": "ليس لديك حساب؟",
        "Already have an account?": "هل لديك حساب بالفعل؟",
        "Sign Up": "إنشاء حساب جديد",
        "Join the Move ONN community": "انضم إلى مجتمع Move ONN",
        "or with email": "أو بالبريد الإلكتروني",
        "Browse Jobs": "تصفح الوظائف",
        "Salary Calculator": "حاسبة الرواتب",
        "Company Reviews": "تقييمات الشركات",
        "Create Candidate Profile": "إنشاء ملف المرشح",
        "Recruitment Solutions": "حلول التوظيف",
        "Hiring Plans": "خطط التوظيف",
        "Global Hiring": "التوظيف الدولي",
        "About Us": "من نحن",
        "International Portals": "البوابات الدولية",
        "Trust & Safety": "الأمان والموثوقية",
        "Help Center": "مركز المساعدة",
        "Privacy Center": "مركز الخصوصية",
        "Cookies": "ملفات تعريف الارتباط",
        "Privacy": "الخصوصية",
        "Terms": "الشروط والأحكام",
        "All rights reserved.": "جميع الحقوق محفوظة.",
        "© 2026 Move ONN Consultancy Solutions. All rights reserved.": "© 2026 حلول Move ONN الاستشارية. جميع الحقوق محفوظة.",
        "Move ONN | Premier Tech & Executive Recruitment Consultancy": "Move ONN | الاستشارات الرائدة في التوظيف التقني والتنفيذي",
        "Recommended Jobs - Move ONN Consultancy": "الوظائف الموصى بها - استشارات Move ONN",
        "Company Reviews & Top Employers - Move ONN Consultancy": "تقييمات الشركات وأبرز أصحاب العمل - استشارات Move ONN",
        "Salary Guide & Pay Calculator - Move ONN Consultancy": "دليل الرواتب وحاسبة الأجور - استشارات Move ONN",
        "Hire Top Talent & Post Jobs - Move ONN Consultancy": "توظيف أفضل المواهب ونشر الوظائف - استشارات Move ONN",
        "Worldwide International Job Portals - Move ONN Consultancy": "بوابات التوظيف الدولية حول العالم - استشارات Move ONN",
        "Popular Job Locations": "مواقع العمل الشائعة",
        "Bengaluru (Silicon Valley)": "بنغالورو (وادي السيليكون)",
        "Hyderabad (HITEC City)": "حيدر أباد (مدينة هايتك)",
        "Pune (Hinjewadi)": "بونه (هينجوادي)",
        "Delhi / NCR (Noida & Gurugram)": "دلهي / إن سي آر (نويدا وجوروجرام)",
        "Mumbai & Navi Mumbai": "مومباي ونافي مومباي",
        "Chennai (OMR Corridor)": "تشيناي (ممر أو إم آر)",
        "Kolkata (Salt Lake)": "كولكاتا (سولت ليك)",
        "Chandigarh IT Park": "مجمع تشان ديغار لتكنولوجيا المعلومات",
        "Patna (Bihar)": "باتنا (بيهار)",
        "Patna / Bihar": "باتنا / بيهار",
        "Delhi / NCR": "دلهي / إن سي آر",
        "Innovate. Build. Empower. Connecting top engineering and executive talent with visionary enterprises across India and globally.": "ابتكر. ابنِ. مكن. ربط أفضل الكفاءات الهندسية والتنفيذية بالشركات الرائدة عبر الهند وحول العالم.",
        "India's leading career acceleration and corporate recruitment portal. Empowering candidates and hiring managers with verified opportunities.": "بوابة تسريع المسار المهني والتوظيف المؤسسي الرائدة في الهند. تمكين المرشحين ومسؤولي التوظيف بفرص موثوقة.",
        "Privacy Centre": "مركز الخصوصية",
        "Terms of Service": "شروط الخدمة",
        "Change Country": "تغيير الدولة",
        "Change country (India)": "تغيير الدولة (الهند)",
        "Help Centre": "مركز المساعدة",
        "Welcome": "مرحباً",
        "Back!": "بعودتك!",
        "Join": "انضم",
        "Us Today!": "إلينا اليوم!",
        "name@company.com": "name@company.com",
        "••••••••": "••••••••",
        "Experience (Any)": "الخبرة (الكل)",
        "Fresher (0 Yrs)": "حديث التخرج (0 سنوات)",
        "2+ Yrs": "سنتان فأكثر",
        "3+ Yrs": "3 سنوات فأكثر",
        "5+ Yrs": "5 سنوات فأكثر",
        "8+ Yrs": "8 سنوات فأكثر",
        "0 - 1 Yrs (Freshers)": "0 - سنة واحدة (حديثو التخرج)",
        "1 - 3 Yrs": "1 - 3 سنوات",
        "3 - 5 Yrs": "3 - 5 سنوات",
        "All Filters": "كافة الفلاتر",
        "Clear All": "مسح الكل",
        "Work Mode": "طريقة العمل",
        "Department": "القسم",
        "Engineering - Software": "الهندسة - البرمجيات",
        "Data Science & Analytics": "علم البيانات والتحليلات",
        "Consulting & Strategy": "الاستشارات والاستراتيجية",
        "Human Resources": "الموارد البشرية",
        "Showing": "عرض",
        "recommended jobs based on your profile": "وظائف موصى بها بناءً على ملفك الشخصي",
        "Sort by: Relevance": "ترتيب حسب: الأهمية",
        "Sort by: Date (Newest)": "ترتيب حسب: التاريخ (الأحدث)",
        "Sort by: Salary (High to Low)": "ترتيب حسب: الراتب (من الأعلى إلى الأدنى)",
        "Apply to Senior Full Stack Developer": "التقدم لوظيفة مهندس تطوير شامل أول",
        "Apex Consultancy Solutions • Bengaluru": "أبيكس لحلول الاستشارات • بنغالورو",
        "Applicant Profile": "ملف المتقدم",
        "Resume / CV": "السيرة الذاتية",
        "Attached": "مرفق",
        "Total Years of Experience": "إجمالي سنوات الخبرة",
        "Notice Period": "فترة الإشعار",
        "Immediate Joiner (0 Days)": "جاهز فوراً (0 يوم)",
        "15 Days": "15 يوماً",
        "30 Days": "30 يوماً",
        "60 Days": "60 يوماً",
        "Submit Application": "إرسال طلب التقديم",
        "Job Overview": "نظرة عامة على الوظيفة",
        "Search by skills": "ابحث بالمهارات",
        "Enter location": "أدخل الموقع",
        "Search by skills, designation, companies...": "ابحث بالمهارات أو المسمى الوظيفي أو الشركات...",
        "Enter location (e.g. Bengaluru)": "أدخل الموقع (مثلاً: بنغالورو)",
        "Job title": "المسمى الوظيفي",
        "IndusInd Bank": "بنك إندوس إند",
        "Salaries": "الرواتب",
        "Questions": "الأسئلة",
        "Open jobs": "الوظائف الشاغرة",
        "Reliance Industries Ltd": "شركة ريلاينس للصناعات المحدودة",
        "Urban Company": "أوربان كومباني",
        "Adani Group": "مجموعة أداني",
        "L&T Technology Services Ltd.": "إل آند تي لخدمات التكنولوجيا المحدودة",
        "Agriculture, Fishing & Forestry": "الزراعة وصيد الأسماك والغابات",
        "Architecture & Engineering": "الهندسة المعمارية والهندسة",
        "Business Management, Administrative & Customer Support": "إدارة الأعمال والدعم الإداري وخدمة العملاء",
        "Cleaning & Grounds Maintenance": "النظافة وصيانة المرافق",
        "Community & Social Services": "الخدمات المجتمعية والاجتماعية",
        "Construction & Extraction": "البناء والتشييد والتعدين",
        "Education & Instruction": "التعليم والتدريس",
        "Finance & Accounting": "المالية والمحاسبة",
        "Food & Beverage": "الأغذية والمشروبات",
        "Healthcare": "الرعاية الصحية",
        "Legal": "القانون والشؤون القانونية",
        "Manufacturing & Utilities": "التصنيع والمرافق العامة",
        "Marketing, Advertising & Public Relations": "التسويق والإعلان والعلاقات العامة",
        "Media, Arts & Design": "الإعلام والفنون والتصميم",
        "Personal Service": "الخدمات الشخصية",
        "Repair, Maintenance & Installation": "الإصلاح والصيانة والتركيب",
        "Safety, Security & Defence Service": "الأمن والسلامة وخدمات الدفاع",
        "Sales & Retail": "المبيعات والتجزئة",
        "Science & Research": "العلوم والأبحاث",
        "Supply Chain & Logistics": "سلسلة التوريد والخدمات اللوجستية",
        "Technology": "التكنولوجيا والتقنية",
        "Transportation": "النقل والمواصلات",
        "Travel, Attractions & Events": "السياحة والسفر والفعاليات",
        "Software Engineer": "مهندس برمجيات",
        "Registered Nurse": "ممرض معتمد",
        "Accountant": "محاسب",
        "Business Analyst": "محلل أعمال",
        "Nursing Assistant": "مساعد تمريض",
        "Sales Executive": "مسؤول مبيعات",
        "Human Resources Specialist": "أخصائي موارد بشرية",
        "Customer Service Representative": "ممثل خدمة العملاء",
        "Assistant Store Manager": "مساعد مدير المتجر",
        "Elementary School Teacher": "معلم مرحلة ابتدائية",
        "Customer Care Specialist": "أخصائي رعاية العملاء",
        "Office Assistant": "مساعد مكتب",
        "Back Office Executive": "مسؤول المكتب الخلفي",
        "Data Entry Clerk": "مدخل بيانات",
        "Graphic Designer": "مصمم جرافيك",
        "Front Desk Manager": "مدير مكتب الاستقبال",
        "Let’s hire your next great candidate.": "لنبدأ في توظيف مرشحك المميز القادم.",
        "Fast": "بسرعة فائقة",
        "Get started with a job post. Move ONN has 20.1M unique monthly users to deliver verified applicants.": "ابدأ بنشر وظيفة. يستقبل Move ONN 20.1 مليون زائر شهري فريد لتوفير متقدمين موثوقين.",
        "Customise your post with screening tools to help narrow down to potential top-tier candidates.": "خصص منشورك بأدوات الفرز والتقييم للمساعدة في حصر أفضل الكفاءات المرشحة.",
        "98% Match": "تطابق 98%",
        "Senior Full Stack Engineer • Bangalore": "مهندس تطوير شامل أول • بنغالور",
        "95% Match": "تطابق 95%",
        "Lead Product Designer • Remote": "مصمم منتجات رئيسي • عن بُعد",
        "Hiring resources for every step of the process": "موارد التوظيف لكل خطوة في العملية",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process, including interview guides, competitive market salary reports, and compliance playbooks.": "لست وحدك في رحلة التوظيف. نوفر لك موارد قيمة لكل خطوة، تشمل أدلة المقابلات، وتقارير الرواتب التنافسية، ودلائل الامتثال القانوني.",
        "Employer Resource Library": "مكتبة موارد أصحاب العمل",
        "Ready to find your next hired candidate?": "هل أنت مستعد للعثور على موظفك القادم؟",
        "Create a job post in minutes and tap into India's largest verified talent network of top engineers, executives, and specialists.": "أنشئ إعلان وظيفة في دقائق واستفد من أكبر شبكة كفاءات موثقة في الهند تضم نخبة المهندسين والمديرين والمتخصصين.",
        "Frequently Asked Questions": "الأسئلة الشائعة",
        "How do I create an Move ONN for Employers account for free?": "كيف أنشئ حساباً مجانياً لأصحاب العمل على Move ONN؟",
        "You can register for an employer account in minutes by clicking 'Post a job' or 'Sign in' and choosing Register. Simply enter your company work email, full name, and password to immediately access candidate screening, job management, and messaging.": "يمكنك التسجيل للحصول على حساب صاحب عمل في غضون دقائق بالنقر على 'نشر وظيفة' أو 'تسجيل الدخول' واختيار تسجيل. أدخل بريد العمل الخاص بك، والاسم الكامل، وكلمة المرور للوصول فوراً إلى فرز المرشحين وإدارة الوظائف والمراسلة.",
        "Does Move ONN integrate with my ATS?": "هل يتكامل Move ONN مع نظام تتبع المتقدمين (ATS) الخاص بي؟",
        "Yes. Move ONN integrates seamlessly with all leading Applicant Tracking Systems (ATS) including Greenhouse, Lever, Workday, BambooHR, and custom webhook solutions to synchronize job postings, applicant statuses, and candidate notes.": "نعم. يتكامل Move ONN بسلاسة مع جميع أنظمة تتبع المتقدمين الرائدة (ATS) مثل Greenhouse و Lever و Workday و BambooHR لتزامن الوظائف وحالات المتقدمين وملاحظات المقابلات.",
        "How can I contact candidates who have not applied to my job?": "كيف يمكنني التواصل مع مرشحين لم يتقدموا لوظيفتي بعد؟",
        "Use Move ONN Smart Sourcing to search our CV database of over 20 million verified candidates. Filter candidates by exact skills, years of experience, and location, and invite them directly to apply for your vacancies.": "استخدم ميزة Move ONN سمارت سورسينغ للبحث في قاعدة بيانات السير الذاتية لأكثر من 20 مليون مرشح موثق. قم بفرز المرشحين حسب المهارات والخبرة والموقع وادعهم مباشرة للتقديم.",
        "How does Move ONN help me screen candidates?": "كيف يساعدني Move ONN في فرز وتصفية المرشحين؟",
        "You can add customized screener questions, required qualifications, and pre-employment assessment tests to your job post to automatically highlight top applicants and filter out non-matching submissions.": "يمكنك إضافة أسئلة فرز مخصصة ومؤهلات إلزامية واختبارات تقييم مسبقة إلى إعلان وظيفتك لتمييز أفضل المتقدمين تلقائياً واستبعاد غير المؤهلين.",
        "Can Move ONN help with high-volume hiring?": "هل يمكن لMove ONN المساعدة في التوظيف الجماعي بأعداد كبيرة؟",
        "Absolutely. Our enterprise recruitment suite provides bulk candidate imports, automated interview scheduling, collaborative hiring team permissions, and prioritized job syndication across our entire partner network.": "بالتأكيد. توفر مجموعتنا للمؤسسات استيراد المرشحين بكميات كبيرة، وجدولة المقابلات آلياً، وأذونات فرق العمل التشاركية، وتوزيع الوظائف بأولوية على شبكة شركائنا.",
        "What are the benefits of a Sponsored Job?": "ما هي مزايا الوظائف المميزة برعاية (Sponsored Jobs)؟",
        "Sponsored Jobs receive prime placement in search results and targeted candidate recommendations, delivering up to 4.5x more applications and significantly reducing time-to-hire compared to organic listings.": "تحظى الوظائف المميزة بأولوية الظهور في نتائج البحث وتوصيات المرشحين، مما يوفر ما يصل إلى 4.5 أضعاف عدد الطلبات ويقلل وقت التوظيف بشكل ملحوظ.",
        "Can sponsoring improve time-to-hire?": "هل يمكن للرعاية تحسين سرعة ووقت التوظيف؟",
        "Yes. Sponsored Jobs achieve higher daily impressions and applicant velocity, allowing hiring managers to make quality hires in an average of under 14 business days.": "نعم. تحقق الوظائف المميزة تفاعلاً يومياً أعلى وسرعة تدفق للمتقدمين، مما يمكن مسؤولي التوظيف من إتمام تعيينات مميزة في أقل من 14 يوم عمل في المتوسط.",
        "How can I improve visibility?": "كيف يمكنني تحسين مدى ظهور إعلان الوظيفة؟",
        "Craft a clear, descriptive job title, provide transparent salary expectations, specify detailed requirements, and sponsor your post to ensure it remains prominently displayed to matching jobseekers.": "اكتب مسمى وظيفي دقيق وواضح، وقدم نطاق راتب شفاف، وحدد المتطلبات بالتفصيل، وقم برعاية المنشور لضمان بقائه في مقدمة نتائج الباحثين عن عمل.",
        "How do I attract top talent?": "كيف أجذب أفضل الكفاءات والمواهب المتميزة؟",
        "Highlight your company culture, competitive perks, flexible remote policies, and verified company reviews on your Move ONN Company Profile to stand out to passive senior talent.": "أبرز ثقافة شركتك والمزايا التنافسية وسياسات العمل المرن عن بُعد، والتقييمات الموثقة على صفحة شركتك في Move ONN لجذب الكفاءات الخبيرة.",
        "How can Move ONN help with Employer Branding?": "كيف يساعد Move ONN في تعزيز العلامة التجارية لجهة العمل؟",
        "A verified Move ONN Company Page allows you to showcase office photos, CEO ratings, employee testimonials, company updates, and your open roles to over 20 million career-focused professionals.": "تتيح لك صفحة الشركة الموثقة على Move ONN عرض صور المقر، وتقييمات الإدارة التنفيذية، وشهادات الموظفين، وأحدث أخبار الشركة لجمهور يتجاوز 20 مليون مهني متخصص.",
        "How much does it cost to sponsor?": "كم تبلغ تكلفة رعاية إعلان وظيفة؟",
        "Move ONN offers flexible performance-based hiring budgets. You set a daily or monthly budget that fits your hiring needs, and you only pay when interested candidates engage with your job post.": "يقدم Move ONN ميزانيات توظيف مرنة قائمة على الأداء الفعلي. يمكنك تحديد ميزانية يومية أو شهرية تناسب متطلباتك، ولن تدفع إلا عندما يتفاعل المرشحون المهتمون مع إعلانك.",
        "Can I post without listing the salary?": "هل يمكنني نشر وظيفة دون تحديد قيمة الراتب؟",
        "Yes, listing salary is optional. However, postings with transparent salary ranges receive on average 35% more verified candidate applications and faster candidate responses.": "نعم، ذكر الراتب اختياري. ولكن المنشورات التي تتضمن نطاق راتب واضح تتلقى في المتوسط 35% أكثر من طلبات المرشحين المؤهلين واستجابات أسرع بكثير.",
        "How long until my job is visible?": "كم من الوقت يستغرق ظهور إعلاني الوظيفي؟",
        "Most posts go live within 24 to 48 hours after a standard quality and compliance review.": "يتم نشر معظم الوظائف خلال 24 إلى 48 ساعة بعد إجراء مراجعة قياسية للجودة والامتثال.",
        "Move ONN is both a job search engine and an all-in-one hiring platform. Beyond jobs posted directly by employers, Move ONN also aggregates job listings from thousands of sources across the internet. Employers gain access to features like virtual interviews and 'Hiring Insights'.": "Move ONN محرك بحث عن الوظائف ومنصة توظيف شاملة ومتكاملة. بالإضافة إلى الوظائف المنشورة مباشرة، يجمع Move ONN فرص العمل من آلاف المصادر الموثوقة عبر الإنترنت ويوفر مزايا كالمقابلات الافتراضية والتحليلات المتطورة.",
        "Country and language": "الدولة واللغة",
        "Search countries and languages": "البحث في الدول واللغات",
        "Search countries or languages": "ابحث عن الدول أو اللغات",
        "United Arab Emirates (Arabic)": "الإمارات العربية المتحدة (العربية)",
        "United Arab Emirates (English)": "الإمارات العربية المتحدة (الإنجليزية)",
        "Argentina (español)": "الأرجنتين (español)",
        "Argentina (Spanish)": "الأرجنتين (الإسبانية)",
        "Austria (German)": "النمسا (الألمانية)",
        "Australia (English)": "أستراليا (الإنجليزية)",
        "Belgium (German)": "بلجيكا (الألمانية)",
        "Belgium (English)": "بلجيكا (الإنجليزية)",
        "Belgium (French)": "بلجيكا (الفرنسية)",
        "Belgium (Dutch)": "بلجيكا (الهولندية)",
        "Bahrain (Arabic)": "البحرين (العربية)",
        "Bahrain (English)": "البحرين (الإنجليزية)",
        "Brazil (Portuguese)": "البرازيل (البرتغالية)",
        "Canada (English)": "كندا (الإنجليزية)",
        "Canada (français)": "كندا (français)",
        "Canada (French)": "كندا (الفرنسية)",
        "Switzerland (German)": "سويسرا (الألمانية)",
        "Switzerland (English)": "سويسرا (الإنجليزية)",
        "Switzerland (French)": "سويسرا (الفرنسية)",
        "Switzerland (Italian)": "سويسرا (الإيطالية)",
        "Chile (español)": "تشيلي (español)",
        "Chile (Spanish)": "تشيلي (الإسبانية)",
        "China (Chinese)": "الصين (الصينية)",
        "Colombia (español)": "كولومبيا (español)",
        "Colombia (Spanish)": "كولومبيا (الإسبانية)",
        "Costa Rica (español)": "كوستاريكا (español)",
        "Costa Rica (Spanish)": "كوستاريكا (الإسبانية)",
        "Czechia (Czech)": "التشيك (التشيكية)",
        "Germany (German)": "ألمانيا (الألمانية)",
        "Germany (Ukrainian)": "ألمانيا (الأوكرانية)",
        "Denmark (Danish)": "الدنمارك (الدنماركية)",
        "Ecuador (español)": "الإكوادور (español)",
        "Ecuador (Spanish)": "الإكوادور (الإسبانية)",
        "Egypt (Arabic)": "مصر (العربية)",
        "Egypt (English)": "مصر (الإنجليزية)",
        "Spain (Spanish)": "إسبانيا (الإسبانية)",
        "Finland (Finnish)": "فنلندا (الفنلندية)",
        "Finland (svenska)": "فنلندا (svenska)",
        "Finland (Swedish)": "فنلندا (السويدية)",
        "France (français)": "فرنسا (français)",
        "France (French)": "فرنسا (الفرنسية)",
        "United Kingdom (English)": "المملكة المتحدة (الإنجليزية)",
        "Greece (Greek)": "اليونان (اليونانية)",
        "Hong Kong SAR China (English)": "هونغ كونغ (الإنجليزية)",
        "Hong Kong SAR China (Chinese)": "هونغ كونغ (الصينية)",
        "Hungary (Hungarian)": "المجر (المجرية)",
        "Indonesia (English)": "إندونيسيا (الإنجليزية)",
        "Indonesia (Indonesia)": "إندونيسيا (Indonesia)",
        "Indonesia (Indonesian)": "إندونيسيا (الإندونيسية)",
        "Ireland (English)": "أيرلندا (الإنجليزية)",
        "Israel (Hebrew)": "إسرائيل (العبرية)",
        "India (English)": "الهند (الإنجليزية)",
        "India (Hindi)": "الهند (الهندية)",
        "Italy (Italian)": "إيطاليا (الإيطالية)",
        "Japan (Japanese)": "اليابان (اليابانية)",
        "South Korea (Korean)": "كوريا الجنوبية (الكورية)",
        "Kuwait (Arabic)": "الكويت (العربية)",
        "Kuwait (English)": "الكويت (الإنجليزية)",
        "Luxembourg (German)": "لوكسمبورغ (الألمانية)",
        "Luxembourg (English)": "لوكسمبورغ (الإنجليزية)",
        "Luxembourg (français)": "لوكسمبورغ (français)",
        "Luxembourg (French)": "لوكسمبورغ (الفرنسية)",
        "Morocco (Arabic)": "المغرب (العربية)",
        "Morocco (French)": "المغرب (الفرنسية)",
        "Mexico (Spanish)": "المكسيك (الإسبانية)",
        "Malaysia (English)": "ماليزيا (الإنجليزية)",
        "Nigeria (English)": "نيجيريا (الإنجليزية)",
        "Netherlands (Dutch)": "هولندا (الهولندية)",
        "Norway (Norwegian)": "النرويج (النرويجية)",
        "New Zealand (English)": "نيوزيلندا (الإنجليزية)",
        "Oman (Arabic)": "عُمان (العربية)",
        "Oman (English)": "عُمان (الإنجليزية)",
        "Panama (Spanish)": "Panamá (الإسبانية)",
        "Peru (Spanish)": "بيرو (الإسبانية)",
        "Philippines (English)": "الفلبين (الإنجليزية)",
        "Pakistan (English)": "باكستان (الإنجليزية)",
        "Poland (Polish)": "بولندا (البولندية)",
        "Poland (Ukrainian)": "بولندا (الأوكرانية)",
        "Portugal (português)": "البرتغال (português)",
        "Portugal (Portuguese)": "البرتغال (البرتغالية)",
        "Qatar (Arabic)": "قطر (العربية)",
        "Qatar (English)": "قطر (الإنجليزية)",
        "Romania (Romanian)": "رومانيا (الرومانية)",
        "Russia (Russian)": "روسيا (الروسية)",
        "Saudi Arabia (Arabic)": "المملكة العربية السعودية (العربية)",
        "Saudi Arabia (English)": "المملكة العربية السعودية (الإنجليزية)",
        "Sweden (Swedish)": "السويد (السويدية)",
        "Singapore (English)": "سنغافورة (الإنجليزية)",
        "Singapore (Chinese)": "سنغافورة (الصينية)",
        "Thailand (English)": "تايلاند (الإنجليزية)",
        "Thailand (Thai)": "تايلاند (التايلاندية)",
        "Türkiye (Türkçe)": "تركيا (Türkçe)",
        "Türkiye (Turkish)": "تركيا (التركية)",
        "Taiwan (Chinese)": "تايوان (الصينية)",
        "Ukraine (Russian)": "أوكرانيا (الروسية)",
        "Ukraine (Ukrainian)": "أوكرانيا (الأوكرانية)",
        "United States (English)": "الولايات المتحدة (الإنجليزية)",
        "United States (Spanish)": "الولايات المتحدة (الإسبانية)",
        "Uruguay (español)": "أوروغواي (español)",
        "Uruguay (Spanish)": "أوروغواي (الإسبانية)",
        "Venezuela (español)": "فنزويلا (español)",
        "Venezuela (Spanish)": "فنزويلا (الإسبانية)",
        "Vietnam (English)": "فيتنام (الإنجليزية)",
        "Vietnam (Vietnamese)": "فيتنام (الفيتنامية)",
        "South Africa (English)": "جنوب أفريقيا (الإنجليزية)",
        "Top Matches": "أفضل التطابقات",
        "Experience": "الخبرة",
        "Location": "الموقع",
        "Bengaluru": "بنغالورو",
        "Design Systems": "أنظمة التصميم",
        "User Research": "أبحاث المستخدمين",
        "Apex Consultancy Solutions": "أبيكس لحلول الاستشارات",
        "Tata Consultancy Services (TCS)": "تاتا للخدمات الاستشارية (TCS)",
        "Infosys Technologies": "إنفوسيس للتكنولوجيا",
        "Wipro Enterprises": "ويبرو إنتربرايزس",
        "Google India": "جوجل الهند",
        "Microsoft India": "مايكروسوفت الهند",
        "Amazon Development Centre": "مركز تطوير أمازون",
        "Cognizant Technology": "كوجنيزانت للتكنولوجيا",
        "HCL Technologies": "إتش سي إل للتكنولوجيا",
        "Tech Mahindra": "تيك ماهيندرا",
        "Company Email": "البريد الإلكتروني للشركة",
        "Full Name": "الاسم الكامل"
    },
    "es": {
        "Home": "Inicio",
        "Jobs": "Empleos",
        "Company reviews": "Opiniones de empresas",
        "Salary guide": "Guía de sueldos",
        "Sign in": "Iniciar sesión",
        "Sign out": "Cerrar sesión",
        "Sign Out": "Cerrar sesión",
        "Register": "Registrarse",
        "Employers / Post Job": "Empresas / Publicar empleo",
        "Post a job": "Publicar un empleo",
        "Post a Job": "Publicar un empleo",
        "Job Seekers": "Candidatos",
        "Employers": "Empresas",
        "Change country:": "Cambiar país:",
        "Change country: India": "تغيير البلد: الهند",
        "Your next job starts here.": "Tu próximo trabajo empieza aquí.",
        "Your next job starts here": "Tu próximo trabajo empieza aquí",
        "Create an account or sign in to see your personalised job recommendations.": "أنشئ حساباً أو سجّل الدخول للاطلاع على توصيات الوظائف المخصصة لك.",
        "Get Started": "ابدأ الآن",
        "What": "Qué",
        "Where": "Dónde",
        "Find jobs": "Buscar empleos",
        "Search jobs": "Buscar empleos",
        "Search": "Buscar",
        "Job title, keywords, or company": "Puesto, palabras clave o empresa",
        "City, state, zip code, or remote": "Ciudad, provincia o teletrabajo",
        "City, state, or 'remote'": "المدينة أو المحافظة أو عن بعد",
        "Patna, Bihar": "باتنا، بيهار",
        "Popular searches:": "Búsquedas populares:",
        "Popular searches": "Búsquedas populares",
        "Recent searches": "Búsquedas recientes",
        "Clear": "Borrar",
        "Jobs for you": "Empleos para ti",
        "Top job picks for you": "Mejores selecciones para ti",
        "View all jobs": "Ver todos los empleos",
        "View all jobs >": "Ver todos los empleos >",
        "Job feed based on your profile and search history": "Feed según tu perfil e historial de búsqueda",
        "TOP MATCH": "أفضل تطابق",
        "RECOMMENDED": "موصى به",
        "HIGH PAY": "راتب مرتفع",
        "PATNA / REMOTE": "باتنا / عن بعد",
        "Actively Hiring": "توظيف نشط",
        "Easily Apply": "تقديم سهل",
        "Early Applicant": "متقدم مبكر",
        "Apply now": "Postularse",
        "Applied": "Postulado",
        "Saved": "Guardado",
        "Save job": "Guardar empleo",
        "Easy apply": "Solicitud sencilla",
        "Urgent hiring": "Contratación urgente",
        "Remote": "Remoto",
        "Full-time": "Tiempo completo",
        "Part-time": "Tiempo parcial",
        "Fresher": "Sin experiencia",
        "Top matches": "Mejores coincidencias",
        "Saved jobs": "Empleos guardados",
        "Applied jobs": "Empleos postulados",
        "No jobs saved yet": "No hay empleos guardados aún",
        "No applied jobs yet": "No te has postulado a empleos aún",
        "New Applicant": "Nuevo candidato",
        "Under Review": "En revisión",
        "Shortlisted": "Preseleccionado",
        "Interview Scheduled": "Entrevista agendada",
        "Live Candidate Pipeline": "Flujo de candidatos en vivo",
        "Shortlisted & Assessments": "Preselección y evaluaciones",
        "Live Interview Schedule": "Calendario de entrevistas en vivo",
        "2 New Matches": "2 nuevas coincidencias",
        "2 Candidates Shortlisted": "2 candidatos preseleccionados",
        "2 Video Calls Ready": "2 videollamadas listas",
        "Remote options available": "خيارات العمل عن بعد متاحة",
        "Fast response": "استجابة سريعة",
        "Work from office": "العمل من المكتب",
        "Hybrid": "هجين",
        "a year": "سنوياً",
        "per year": "al año",
        "Average salary": "Sueldo promedio",
        "Senior Full Stack Developer": "مطور برمجيات شامل أول",
        "React Frontend Engineer": "مهندس واجهات أمامية React",
        "Python Data Engineer": "مهندس بيانات بايثون",
        "Java Backend Architect": "مهندس برمجيات جافا خبير",
        "Apex Consultancy Solutions - Bengaluru, Karnataka": "أبيكس لحلول الاستشارات - بنغالورو، كارناتاكا",
        "Tata Consultancy Services - Hyderabad, Telangana": "تاتا للخدمات الاستشارية - حيدر أباد، تلنغانة",
        "Infosys Ltd - Pune, Maharashtra": "إنفوسيس المحدودة - بونا، ماهاراشترا",
        "Wipro Technologies - Patna / Remote": "ويبرو تكنولوجيز - باتنا / عن بعد",
        "What's trending on Move ONN": "الأكثر رواجاً على Move ONN",
        "Popular Tech Roles": "أبرز الوظائف التقنية",
        "Top Hiring Cities": "أفضل مدن التوظيف",
        "Executive & Management": "الوظائف التنفيذية والإدارية",
        "Full Stack Developer": "مطور برمجيات شامل",
        "AI & Machine Learning": "الذكاء الاصطناعي وتعلم الآلة",
        "DevOps & Cloud Engineer": "مهندس DevOps وسحابي",
        "Mobile App Developer": "مطور تطبيقات الجوال",
        "Data Analyst & Power BI": "محلل بيانات و Power BI",
        "Cyber Security Specialist": "أخصائي أمن سيبراني",
        "QA Automation Engineer": "مهندس أتمتة الجودة",
        "Top Companies Hiring": "أفضل الشركات التي توظف حالياً",
        "Engineering Director": "مدير هندسي",
        "VP of Product Management": "نائب رئيس إدارة المنتجات",
        "Chief Technology Officer (CTO)": "الرئيس التنفيذي للتكنولوجيا (CTO)",
        "Principal Solution Architect": "كبير مهندسي الحلول",
        "Head of Data Science": "رئيس علوم البيانات",
        "Senior Engineering Manager": "مدير هندسي أول",
        "Scrum Master & Agile Coach": "سكرم ماستر ومدرب أجايل",
        "Chief Information Security Officer": "رئيس أمن المعلومات",
        "Bangalore / Bengaluru": "بنغالور / بنغالورو",
        "Hyderabad": "حيدر أباد",
        "Pune": "بونا",
        "Delhi NCR (Gurgaon / Noida)": "دلهي الكبرى (غورغاون / نويدا)",
        "Mumbai": "مومباي",
        "Chennai": "تشيناي",
        "Patna": "باتنا",
        "Kolkata": "كولكاتا",
        "Ahmedabad (GIFT City)": "أحمد أباد (مدينة جيفت)",
        "Move ONN for Employers": "Move ONN para empresas",
        "Let’s hire your next great candidate. Fast.": "Contrata a tu próximo gran candidato. Rápido.",
        "Let's hire your next great candidate. Fast.": "Contrata a tu próximo gran candidato. Rápido.",
        "No matter the skills, industry, or experience level you're looking for, we can help you find your next great hire.": "Sin importar las habilidades o experiencia que busques, te ayudamos a encontrar al candidato ideal.",
        "No matter the skills, industry, or experience level you’re looking for, we can help you find your next great hire.": "Sin importar las habilidades o experiencia que busques, te ayudamos a encontrar al candidato ideal.",
        "No matter the skills, experience or qualifications you’re looking for, you’ll find the right people here.": "Sean cuales sean las competencias que buscas, aquí encontrarás a las personas indicadas.",
        "No matter the skills, experience or qualifications you're looking for, you'll find the right people here.": "Sean cuales sean las competencias que buscas, aquí encontrarás a las personas indicadas.",
        "Manage your hiring from start to finish": "Gestiona tu contratación de principio a fin",
        "Get started with a job post. Move ONN has 20.1M unique monthly users.": "Empieza publicando una oferta. Move ONN cuenta con 20.1M de usuarios únicos al mes.",
        "Find quality applicants": "Encuentra candidatos de calidad",
        "Customise your post with screening tools to help narrow down to potential candidates.": "Personaliza tu oferta con herramientas de selección para filtrar a los mejores.",
        "Make connections": "Establece conexiones",
        "Track, message, invite and interview directly on Move ONN with no extra apps to download.": "Haz seguimiento, envía mensajes, invita y entrevista directamente en Move ONN sin apps extra.",
        "Hire confidently": "Contrata con confianza",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "No estás solo en tu proceso de contratación. Contamos con recursos para cada paso.",
        "You're not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "No estás solo en tu proceso de contratación. Contamos con recursos para cada paso.",
        "Your dashboard features": "Funciones de tu panel de control",
        "Save time and effort in your hiring journey.": "Ahorra tiempo y esfuerzo en tus contrataciones.",
        "Manage your jobs": "Gestiona tus empleos",
        "View applicants, edit descriptions, adjust budgets, and monitor candidate status in real time.": "Revisa candidatos, edita descripciones, ajusta presupuestos y sigue el estado en tiempo real.",
        "Choose who moves forward": "Decide quién avanza",
        "Filter by match score, assessment results, and recruiter notes to shortlist candidates fast.": "Filtra por afinidad, evaluaciones y notas para preseleccionar rápido.",
        "Interview anywhere": "Entrevista desde cualquier lugar",
        "Conduct 1-click video calls with built-in screener rubrics right inside your browser.": "Haz videollamadas con 1 clic y rúbricas de evaluación integradas en tu navegador.",
        "Unlock matched candidates with Move ONN Smart Sourcing": "Descubre candidatos ideales con Move ONN Smart Sourcing",
        "When you have a job posted and add a Move ONN Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Move ONN fit your job description. When someone stands out, invite them to apply directly.": "Al publicar un empleo y activar Move ONN Smart Sourcing, verás de inmediato CVs compatibles. Invita a los mejores a postularse directamente.",
        "Explore Smart Sourcing": "Explorar Smart Sourcing",
        "Employer Help Centre": "Centro de ayuda para empresas",
        "Employer Resources Library": "Biblioteca de recursos para empresas",
        "Ready to find your next great hire?": "¿Listo para encontrar a tu próximo gran talento?",
        "Build your team with India's #1 hiring network": "Construye tu equipo con la red de contratación líder",
        "Build your team with India’s #1 hiring network": "Construye tu equipo con la red de contratación líder",
        "Post a job in minutes": "Publica un empleo en minutos",
        "Frequently asked questions": "Preguntas frecuentes",
        "Why is my job here if I did not post it?": "¿Por qué aparece mi oferta si no la he publicado?",
        "How do I manage/cancel my post?": "¿Cómo gestiono o cancelo mi publicación?",
        "Does Move ONN remove job postings?": "¿Move ONN elimina ofertas de empleo?",
        "How is Move ONN different from other places where I can post jobs?": "¿En qué se diferencia Move ONN de otras plataformas de empleo?",
        "Most posts go live within 24 to 48 hours after a standard review.": "La mayoría de las ofertas se publican en 24 a 48 horas tras una revisión.",
        "Move ONN pulls postings from career sites and boards to help jobseekers find all available roles in one place.": "Move ONN reúne ofertas de diversos portales para ayudar a los candidatos a ver todas las opciones en un solo lugar.",
        "In your Dashboard, click 'Edit Job' and change the status to 'Paused' or 'Closed.'": "En tu panel, haz clic en 'Editar empleo' y cambia el estado a 'Pausado' o 'Cerrado'.",
        "Yes. Move ONN reserves the right to remove any job that violates our quality standards.": "Sí. Move ONN se reserva el derecho de retirar ofertas que infrinjan nuestros estándares.",
        "Move ONN is both a job search engine and an all-in-one hiring platform.": "Move ONN es un motor de búsqueda y una plataforma de contratación integral.",
        "Find great places to work": "Encuentra excelentes empresas para trabajar",
        "Get access to millions of company reviews": "Accede a millones de opiniones sobre empresas",
        "Company name or job title": "Nombre de empresa o puesto",
        "Find Companies": "Buscar empresas",
        "Do you want to search for salaries?": "¿Quieres buscar salarios?",
        "Analyze job market salaries": "Analizar sueldos del mercado laboral",
        "Top companies in India": "Mejores empresas destacadas",
        "Popular companies": "Empresas populares",
        "Discover your earning potential": "Descubre tu potencial de ingresos",
        "Explore high-paying careers, salaries and job openings by industry and location.": "Explora carreras bien remuneradas, salarios y ofertas por sector y ciudad.",
        "Browse top-paying jobs by industry": "Explora los empleos mejor pagados por sector",
        "Choose an industry": "Elige un sector",
        "All Industries": "Todos los sectores",
        "Job openings": "Ofertas de empleo",
        "Search salaries by job title...": "Buscar salarios por puesto...",
        "Search salaries": "Buscar salarios",
        "Welcome Back": "مرحباً بعودتك",
        "Welcome to Move ONN": "Bienvenido a Move ONN",
        "Sign in to your Move ONN account": "سجّل الدخول إلى حساب Move ONN الخاص بك",
        "Connect with visionary employers and discover top engineering & executive opportunities.": "Conéctate con empresas líderes y encuentra excelentes oportunidades laborales.",
        "Empowering your high-performance career opportunities and enterprise recruitment workflows.": "تمكين مسارك المهني وحلول التوظيف المؤسسية المتقدمة.",
        "Empowering your high-performance web applications and enterprise workflows with secure technology.": "تمكين تطبيقاتك وحلول التوظيف المؤسسية الآمنة.",
        "Build, scale and innovate with our next-generation digital cloud architecture and tools.": "ابنِ وطوّر مستقبلك مع منصتنا الرقمية المبتكرة للتوظيف.",
        "Continue with Google": "Continuar con Google",
        "Continue with Apple": "Continuar con Apple",
        "Username or Email": "اسم المستخدم أو البريد الإلكتروني",
        "Full name": "Nombre completo",
        "Enter your full name": "Introduce tu nombre completo",
        "Email Address": "البريد الإلكتروني",
        "Email address": "Correo electrónico",
        "Password": "Contraseña",
        "Sign In": "Iniciar sesión",
        "Create Account": "Crear cuenta",
        "Don't have an account?": "ليس لديك حساب؟",
        "Already have an account?": "هل لديك حساب بالفعل؟",
        "Sign Up": "إنشاء حساب جديد",
        "Join the Move ONN community": "انضم إلى مجتمع Move ONN",
        "or with email": "أو بالبريد الإلكتروني",
        "Browse Jobs": "Buscar empleos",
        "Salary Calculator": "Calculadora de sueldo",
        "Company Reviews": "Opiniones de empresas",
        "Create Candidate Profile": "Crear perfil de candidato",
        "Recruitment Solutions": "Soluciones de selección",
        "Hiring Plans": "Planes de contratación",
        "Global Hiring": "Contratación global",
        "About Us": "Sobre nosotros",
        "International Portals": "Portales internacionales",
        "Trust & Safety": "Seguridad y confianza",
        "Help Center": "Centro de ayuda",
        "Privacy Center": "Centro de privacidad",
        "Cookies": "Cookies",
        "Privacy": "Privacidad",
        "Terms": "Condiciones",
        "All rights reserved.": "Todos los derechos reservados.",
        "© 2026 Move ONN Consultancy Solutions. All rights reserved.": "© 2026 Move ONN Consultancy Solutions. Todos los derechos reservados.",
        "Keep me signed in on this device": "Recordarme en este dispositivo",
        "Forgot password?": "¿Olvidaste tu contraseña?",
        "By continuing, you agree to Move ONN's": "Al continuar, aceptas las",
        "Terms of Service": "Términos del Servicio",
        "Privacy Policy": "Política de privacidad",
        "and": "y",
        "20.1M+ Verified Candidate CVs": "Más de 20.1M de CVs verificados",
        "Direct Employer Communication": "Comunicación directa con empleadores",
        "GDPR & ISO-27001 Certified": "Certificación GDPR e ISO-27001",
        "Move ONN | Premier Tech & Executive Recruitment Consultancy": "Move ONN | Consultoría Líder en Selección Tecnológica y Ejecutiva",
        "Recommended Jobs - Move ONN Consultancy": "Empleos Recomendados - Consultoría Move ONN",
        "Company Reviews & Top Employers - Move ONN Consultancy": "Reseñas de Empresas y Mejores Empleadores - Consultoría Move ONN",
        "Salary Guide & Pay Calculator - Move ONN Consultancy": "Guía Salarial y Calculadora de Sueldos - Consultoría Move ONN",
        "Hire Top Talent & Post Jobs - Move ONN Consultancy": "Contrata al Mejor Talento y Publica Empleos - Consultoría Move ONN",
        "Worldwide International Job Portals - Move ONN Consultancy": "Portales Internacionales de Empleo - Consultoría Move ONN",
        "Popular Job Locations": "Ubicaciones Populares de Empleo",
        "Bengaluru (Silicon Valley)": "Bengaluru (Silicon Valley)",
        "Hyderabad (HITEC City)": "Hyderabad (HITEC City)",
        "Pune (Hinjewadi)": "Pune (Hinjewadi)",
        "Delhi / NCR (Noida & Gurugram)": "Delhi / NCR (Noida y Gurugram)",
        "Mumbai & Navi Mumbai": "Mumbai y Navi Mumbai",
        "Chennai (OMR Corridor)": "Chennai (Corredor OMR)",
        "Kolkata (Salt Lake)": "Calcuta (Salt Lake)",
        "Chandigarh IT Park": "Parque Tecnológico de Chandigarh",
        "Patna (Bihar)": "Patna (Bihar)",
        "Patna / Bihar": "Patna / Bihar",
        "Delhi / NCR": "Delhi / NCR",
        "Innovate. Build. Empower. Connecting top engineering and executive talent with visionary enterprises across India and globally.": "Innova. Construye. Empodera. Conectando al mejor talento de ingeniería y ejecutivo con empresas visionarias en toda la India y el mundo.",
        "India's leading career acceleration and corporate recruitment portal. Empowering candidates and hiring managers with verified opportunities.": "El portal líder en aceleración profesional y contratación corporativa en la India. Empoderando a candidatos y reclutadores con oportunidades verificadas.",
        "Privacy Centre": "Centro de Privacidad",
        "Change Country": "Cambiar de País",
        "Change country (India)": "Cambiar de país (India)",
        "Help Centre": "Centro de Ayuda",
        "Welcome": "Bienvenido",
        "Back!": "de nuevo!",
        "Join": "Únete",
        "Us Today!": "a Nosotros Hoy!",
        "name@company.com": "nombre@empresa.com",
        "••••••••": "••••••••",
        "Experience (Any)": "Experiencia (Cualquiera)",
        "Fresher (0 Yrs)": "Recién Graduado (0 Años)",
        "2+ Yrs": "2+ Años",
        "3+ Yrs": "3+ Años",
        "5+ Yrs": "5+ Años",
        "8+ Yrs": "8+ Años",
        "0 - 1 Yrs (Freshers)": "0 - 1 Años (Recién Graduados)",
        "1 - 3 Yrs": "1 - 3 Años",
        "3 - 5 Yrs": "3 - 5 Años",
        "All Filters": "Todos los Filtros",
        "Clear All": "Borrar Todo",
        "Work Mode": "Modalidad de Trabajo",
        "Department": "Departamento",
        "Engineering - Software": "Ingeniería - Software",
        "Data Science & Analytics": "Ciencia de Datos y Analítica",
        "Consulting & Strategy": "Consultoría y Estrategia",
        "Human Resources": "Recursos Humanos",
        "Showing": "Mostrando",
        "recommended jobs based on your profile": "empleos recomendados según tu perfil",
        "Sort by: Relevance": "Ordenar por: Relevancia",
        "Sort by: Date (Newest)": "Ordenar por: Fecha (Más reciente)",
        "Sort by: Salary (High to Low)": "Ordenar por: Salario (Mayor a Menor)",
        "Apply to Senior Full Stack Developer": "Postular a Desarrollador Full Stack Senior",
        "Apex Consultancy Solutions • Bengaluru": "Apex Consultancy Solutions • Bengaluru",
        "Applicant Profile": "Perfil del Candidato",
        "Resume / CV": "Currículum / CV",
        "Attached": "Adjunto",
        "Total Years of Experience": "Años Totales de Experiencia",
        "Notice Period": "Período de Preaviso",
        "Immediate Joiner (0 Days)": "Disponibilidad Inmediata (0 Días)",
        "15 Days": "15 Días",
        "30 Days": "30 Días",
        "60 Days": "60 Días",
        "Submit Application": "Enviar Solicitud",
        "Job Overview": "Descripción del Empleo",
        "Search by skills": "Buscar por habilidades",
        "Enter location": "Introduce una ubicación",
        "Search by skills, designation, companies...": "Buscar por habilidades, cargo, empresas...",
        "Enter location (e.g. Bengaluru)": "Introduce una ubicación (ej. Bengaluru)",
        "Job title": "Título del empleo",
        "IndusInd Bank": "IndusInd Bank",
        "Salaries": "Salarios",
        "Questions": "Preguntas",
        "Open jobs": "Empleos abiertos",
        "Reliance Industries Ltd": "Reliance Industries Ltd",
        "Urban Company": "Urban Company",
        "Adani Group": "Grupo Adani",
        "L&T Technology Services Ltd.": "L&T Technology Services Ltd.",
        "Agriculture, Fishing & Forestry": "Agricultura, Pesca y Silvicultura",
        "Architecture & Engineering": "Arquitectura e Ingeniería",
        "Business Management, Administrative & Customer Support": "Gestión Empresarial, Administrativo y Atención al Cliente",
        "Cleaning & Grounds Maintenance": "Limpieza y Mantenimiento de Instalaciones",
        "Community & Social Services": "Servicios Sociales y Comunitarios",
        "Construction & Extraction": "Construcción y Extracción",
        "Education & Instruction": "Educación e Instrucción",
        "Finance & Accounting": "Finanzas y Contabilidad",
        "Food & Beverage": "Alimentos y Bebidas",
        "Healthcare": "Salud y Medicina",
        "Legal": "Legal y Jurídico",
        "Manufacturing & Utilities": "Manufactura y Servicios Públicos",
        "Marketing, Advertising & Public Relations": "Marketing, Publicidad y Relaciones Públicas",
        "Media, Arts & Design": "Medios, Artes y Diseño",
        "Personal Service": "Servicios Personales",
        "Repair, Maintenance & Installation": "Reparación, Mantenimiento e Instalación",
        "Safety, Security & Defence Service": "Seguridad y Servicios de Defensa",
        "Sales & Retail": "Ventas y Comercio Minorista",
        "Science & Research": "Ciencia e Investigación",
        "Supply Chain & Logistics": "Cadena de Suministro y Logística",
        "Technology": "Tecnología",
        "Transportation": "Transporte",
        "Travel, Attractions & Events": "Viajes, Atracciones y Eventos",
        "Software Engineer": "Ingeniero de Software",
        "Registered Nurse": "Enfermero/a Registrado/a",
        "Accountant": "Contador/a",
        "Business Analyst": "Analista de Negocio",
        "Nursing Assistant": "Auxiliar de Enfermería",
        "Sales Executive": "Ejecutivo de Ventas",
        "Human Resources Specialist": "Especialista en RRHH",
        "Customer Service Representative": "Representante de Servicio al Cliente",
        "Assistant Store Manager": "Subdirector/a de Tienda",
        "Elementary School Teacher": "Maestro/a de Primaria",
        "Customer Care Specialist": "Especialista en Atención al Cliente",
        "Office Assistant": "Asistente de Oficina",
        "Back Office Executive": "Ejecutivo de Back Office",
        "Data Entry Clerk": "Auxiliar de Entrada de Datos",
        "Graphic Designer": "Diseñador/a Gráfico/a",
        "Front Desk Manager": "Gerente de Recepción",
        "Let’s hire your next great candidate.": "Contratemos a tu próximo gran candidato.",
        "Fast": "Rápido",
        "Get started with a job post. Move ONN has 20.1M unique monthly users to deliver verified applicants.": "Empieza publicando una oferta. Move ONN cuenta con 20,1 millones de usuarios únicos mensuales para brindarte candidatos verificados.",
        "Customise your post with screening tools to help narrow down to potential top-tier candidates.": "Personaliza tu oferta con herramientas de evaluación para seleccionar a los mejores candidatos.",
        "98% Match": "98% Coincidencia",
        "Senior Full Stack Engineer • Bangalore": "Ingeniero Full Stack Senior • Bangalore",
        "95% Match": "95% Coincidencia",
        "Lead Product Designer • Remote": "Diseñador Principal de Producto • Remoto",
        "Hiring resources for every step of the process": "Recursos de contratación para cada etapa del proceso",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process, including interview guides, competitive market salary reports, and compliance playbooks.": "No estás solo en tu camino de contratación. Contamos con recursos prácticos para cada fase, incluidas guías de entrevistas, informes salariales y normativas.",
        "Employer Resource Library": "Biblioteca de Recursos para Empleadores",
        "Ready to find your next hired candidate?": "¿Listo para encontrar a tu próximo contratado?",
        "Create a job post in minutes and tap into India's largest verified talent network of top engineers, executives, and specialists.": "Publica una oferta en minutos y accede a la mayor red de talento verificado de la India con ingenieros, ejecutivos y especialistas.",
        "Frequently Asked Questions": "Preguntas Frecuentes",
        "How do I create an Move ONN for Employers account for free?": "¿Cómo creo una cuenta de Move ONN para Empleadores gratis?",
        "You can register for an employer account in minutes by clicking 'Post a job' or 'Sign in' and choosing Register. Simply enter your company work email, full name, and password to immediately access candidate screening, job management, and messaging.": "Puedes registrarte en minutos haciendo clic en 'Publicar empleo' o 'Iniciar sesión' y eligiendo Registrarse. Simplemente ingresa tu correo de trabajo, nombre completo y contraseña para acceder a la selección de candidatos y mensajería.",
        "Does Move ONN integrate with my ATS?": "¿Move ONN se integra con mi sistema ATS?",
        "Yes. Move ONN integrates seamlessly with all leading Applicant Tracking Systems (ATS) including Greenhouse, Lever, Workday, BambooHR, and custom webhook solutions to synchronize job postings, applicant statuses, and candidate notes.": "Sí. Move ONN se integra a la perfección con los principales ATS (Greenhouse, Lever, Workday, BambooHR) y soluciones webhook para sincronizar ofertas, estados y notas.",
        "How can I contact candidates who have not applied to my job?": "¿Cómo puedo contactar a candidatos que aún no han postulado a mi empleo?",
        "Use Move ONN Smart Sourcing to search our CV database of over 20 million verified candidates. Filter candidates by exact skills, years of experience, and location, and invite them directly to apply for your vacancies.": "Utiliza Move ONN Smart Sourcing para buscar en nuestra base de datos de más de 20 millones de candidatos verificados. Filtra por habilidades, experiencia y ubicación e invítalos directamente.",
        "How does Move ONN help me screen candidates?": "¿Cómo me ayuda Move ONN a filtrar candidatos?",
        "You can add customized screener questions, required qualifications, and pre-employment assessment tests to your job post to automatically highlight top applicants and filter out non-matching submissions.": "Puedes agregar preguntas de filtrado, requisitos obligatorios y pruebas de evaluación a tu oferta para resaltar a los mejores candidatos y descartar perfiles no coincidentes.",
        "Can Move ONN help with high-volume hiring?": "¿Puede Move ONN ayudarme con contrataciones masivas?",
        "Absolutely. Our enterprise recruitment suite provides bulk candidate imports, automated interview scheduling, collaborative hiring team permissions, and prioritized job syndication across our entire partner network.": "Por supuesto. Nuestra solución corporativa incluye importación masiva de candidatos, programación automática de entrevistas, permisos para equipos y distribución prioritaria.",
        "What are the benefits of a Sponsored Job?": "¿Cuáles son las ventajas de un Empleo Patrocinado?",
        "Sponsored Jobs receive prime placement in search results and targeted candidate recommendations, delivering up to 4.5x more applications and significantly reducing time-to-hire compared to organic listings.": "Los Empleos Patrocinados obtienen posiciones preferentes en búsquedas y recomendaciones, generando hasta 4,5 veces más candidaturas y reduciendo el tiempo de contratación.",
        "Can sponsoring improve time-to-hire?": "¿El patrocinio puede reducir el tiempo de contratación?",
        "Yes. Sponsored Jobs achieve higher daily impressions and applicant velocity, allowing hiring managers to make quality hires in an average of under 14 business days.": "Sí. Los empleos patrocinados logran más visibilidad diaria y agilidad de candidatos, permitiendo cerrar contrataciones de calidad en menos de 14 días laborables.",
        "How can I improve visibility?": "¿Cómo puedo mejorar la visibilidad de mi oferta?",
        "Craft a clear, descriptive job title, provide transparent salary expectations, specify detailed requirements, and sponsor your post to ensure it remains prominently displayed to matching jobseekers.": "Redacta un título claro, indica rangos salariales transparentes, detalla los requisitos y patrocina tu oferta para que permanezca visible ante candidatos idóneos.",
        "How do I attract top talent?": "¿Cómo atraigo a los mejores talentos?",
        "Highlight your company culture, competitive perks, flexible remote policies, and verified company reviews on your Move ONN Company Profile to stand out to passive senior talent.": "Destaca la cultura empresarial, beneficios competitivos, políticas de teletrabajo y opiniones verificadas en tu Perfil de Empresa en Move ONN para atraer talento senior.",
        "How can Move ONN help with Employer Branding?": "¿Cómo puede ayudar Move ONN con la Marca Empleadora?",
        "A verified Move ONN Company Page allows you to showcase office photos, CEO ratings, employee testimonials, company updates, and your open roles to over 20 million career-focused professionals.": "Una Página de Empresa verificada te permite mostrar fotos de oficinas, valoraciones de directivos, testimonios y vacantes ante más de 20 millones de profesionales cualificados.",
        "How much does it cost to sponsor?": "¿Cuánto cuesta patrocinar una oferta de empleo?",
        "Move ONN offers flexible performance-based hiring budgets. You set a daily or monthly budget that fits your hiring needs, and you only pay when interested candidates engage with your job post.": "Move ONN ofrece presupuestos flexibles basados en resultados. Fijas un presupuesto diario o mensual a tu medida y solo pagas cuando candidatos cualificados interactúan con tu oferta.",
        "Can I post without listing the salary?": "¿Puedo publicar sin indicar el sueldo?",
        "Yes, listing salary is optional. However, postings with transparent salary ranges receive on average 35% more verified candidate applications and faster candidate responses.": "Sí, es opcional. Sin embargo, las ofertas con sueldos transparentes reciben un promedio del 35% más de candidaturas verificadas y respuestas mucho más rápidas.",
        "How long until my job is visible?": "¿Cuánto tarda en publicarse mi oferta?",
        "Most posts go live within 24 to 48 hours after a standard quality and compliance review.": "La mayoría de las ofertas se activan entre 24 y 48 horas tras una revisión estándar de calidad y cumplimiento.",
        "Move ONN is both a job search engine and an all-in-one hiring platform. Beyond jobs posted directly by employers, Move ONN also aggregates job listings from thousands of sources across the internet. Employers gain access to features like virtual interviews and 'Hiring Insights'.": "Move ONN es a la vez un buscador de empleo y una plataforma integral de contratación. Además de vacantes directas, reúne ofertas de miles de fuentes en internet con entrevistas virtuales e informes.",
        "Country and language": "País e idioma",
        "Search countries and languages": "Buscar países e idiomas",
        "Search countries or languages": "Buscar países o idiomas",
        "United Arab Emirates (Arabic)": "Emiratos Árabes Unidos (árabe)",
        "United Arab Emirates (English)": "Emiratos Árabes Unidos (inglés)",
        "Argentina (español)": "Argentina (español)",
        "Argentina (Spanish)": "Argentina (español)",
        "Austria (German)": "Austria (alemán)",
        "Australia (English)": "Australia (inglés)",
        "Belgium (German)": "Bélgica (alemán)",
        "Belgium (English)": "Bélgica (inglés)",
        "Belgium (French)": "Bélgica (francés)",
        "Belgium (Dutch)": "Bélgica (holandés)",
        "Bahrain (Arabic)": "Baréin (árabe)",
        "Bahrain (English)": "Baréin (inglés)",
        "Brazil (Portuguese)": "Brasil (portugués)",
        "Canada (English)": "Canadá (inglés)",
        "Canada (français)": "Canadá (français)",
        "Canada (French)": "Canadá (francés)",
        "Switzerland (German)": "Suiza (alemán)",
        "Switzerland (English)": "Suiza (inglés)",
        "Switzerland (French)": "Suiza (francés)",
        "Switzerland (Italian)": "Suiza (italiano)",
        "Chile (español)": "Chile (español)",
        "Chile (Spanish)": "Chile (español)",
        "China (Chinese)": "China (chino)",
        "Colombia (español)": "Colombia (español)",
        "Colombia (Spanish)": "Colombia (español)",
        "Costa Rica (español)": "Costa Rica (español)",
        "Costa Rica (Spanish)": "Costa Rica (español)",
        "Czechia (Czech)": "Chequia (checo)",
        "Germany (German)": "Alemania (alemán)",
        "Germany (Ukrainian)": "Alemania (ucraniano)",
        "Denmark (Danish)": "Dinamarca (danés)",
        "Ecuador (español)": "Ecuador (español)",
        "Ecuador (Spanish)": "Ecuador (español)",
        "Egypt (Arabic)": "Egipto (árabe)",
        "Egypt (English)": "Egipto (inglés)",
        "Spain (Spanish)": "España (español)",
        "Finland (Finnish)": "Finlandia (finlandés)",
        "Finland (svenska)": "Finlandia (svenska)",
        "Finland (Swedish)": "Finlandia (sueco)",
        "France (français)": "Francia (français)",
        "France (French)": "Francia (francés)",
        "United Kingdom (English)": "Reino Unido (inglés)",
        "Greece (Greek)": "Grecia (griego)",
        "Hong Kong SAR China (English)": "Hong Kong (inglés)",
        "Hong Kong SAR China (Chinese)": "Hong Kong (chino)",
        "Hungary (Hungarian)": "Hungría (húngaro)",
        "Indonesia (English)": "Indonesia (inglés)",
        "Indonesia (Indonesia)": "Indonesia (Indonesia)",
        "Indonesia (Indonesian)": "Indonesia (indonesio)",
        "Ireland (English)": "Irlanda (inglés)",
        "Israel (Hebrew)": "Israel (hebreo)",
        "India (English)": "India (inglés)",
        "India (Hindi)": "India (hindi)",
        "Italy (Italian)": "Italia (italiano)",
        "Japan (Japanese)": "Japón (japonés)",
        "South Korea (Korean)": "Corea del Sur (coreano)",
        "Kuwait (Arabic)": "Kuwait (árabe)",
        "Kuwait (English)": "Kuwait (inglés)",
        "Luxembourg (German)": "Luxemburgo (alemán)",
        "Luxembourg (English)": "Luxemburgo (inglés)",
        "Luxembourg (français)": "Luxemburgo (français)",
        "Luxembourg (French)": "Luxemburgo (francés)",
        "Morocco (Arabic)": "Marruecos (árabe)",
        "Morocco (French)": "Marruecos (francés)",
        "Mexico (Spanish)": "México (español)",
        "Malaysia (English)": "Malasia (inglés)",
        "Nigeria (English)": "Nigeria (inglés)",
        "Netherlands (Dutch)": "Países Bajos (holandés)",
        "Norway (Norwegian)": "Noruega (noruego)",
        "New Zealand (English)": "Nueva Zelanda (inglés)",
        "Oman (Arabic)": "Omán (árabe)",
        "Oman (English)": "Omán (inglés)",
        "Panama (Spanish)": "Panamá (español)",
        "Peru (Spanish)": "Perú (español)",
        "Philippines (English)": "Filipinas (inglés)",
        "Pakistan (English)": "Pakistán (inglés)",
        "Poland (Polish)": "Polonia (polaco)",
        "Poland (Ukrainian)": "Polonia (ucraniano)",
        "Portugal (português)": "Portugal (português)",
        "Portugal (Portuguese)": "Portugal (portugués)",
        "Qatar (Arabic)": "Catar (árabe)",
        "Qatar (English)": "Catar (inglés)",
        "Romania (Romanian)": "Rumania (rumano)",
        "Russia (Russian)": "Rusia (ruso)",
        "Saudi Arabia (Arabic)": "Arabia Saudita (árabe)",
        "Saudi Arabia (English)": "Arabia Saudita (inglés)",
        "Sweden (Swedish)": "Suecia (sueco)",
        "Singapore (English)": "Singapur (inglés)",
        "Singapore (Chinese)": "Singapur (chino)",
        "Thailand (English)": "Tailandia (inglés)",
        "Thailand (Thai)": "Tailandia (tailandés)",
        "Türkiye (Türkçe)": "Turquía (Türkçe)",
        "Türkiye (Turkish)": "Turquía (turco)",
        "Taiwan (Chinese)": "Taiwán (chino)",
        "Ukraine (Russian)": "Ucrania (ruso)",
        "Ukraine (Ukrainian)": "Ucrania (ucraniano)",
        "United States (English)": "Estados Unidos (inglés)",
        "United States (Spanish)": "Estados Unidos (español)",
        "Uruguay (español)": "Uruguay (español)",
        "Uruguay (Spanish)": "Uruguay (español)",
        "Venezuela (español)": "Venezuela (español)",
        "Venezuela (Spanish)": "Venezuela (español)",
        "Vietnam (English)": "Vietnam (inglés)",
        "Vietnam (Vietnamese)": "Vietnam (vietnamita)",
        "South Africa (English)": "Sudáfrica (inglés)",
        "Top Matches": "Mejores Coincidencias",
        "Experience": "Experiencia",
        "Location": "Ubicación",
        "Bengaluru": "Bengaluru",
        "Design Systems": "Sistemas de Diseño",
        "User Research": "Investigación de Usuarios",
        "Apex Consultancy Solutions": "Apex Consultancy Solutions",
        "Tata Consultancy Services (TCS)": "Tata Consultancy Services (TCS)",
        "Infosys Technologies": "Infosys Technologies",
        "Wipro Enterprises": "Wipro Enterprises",
        "Google India": "Google India",
        "Microsoft India": "Microsoft India",
        "Amazon Development Centre": "Centro de Desarrollo de Amazon",
        "Cognizant Technology": "Cognizant Technology",
        "HCL Technologies": "HCL Technologies",
        "Tech Mahindra": "Tech Mahindra",
        "Company Email": "Correo de Empresa",
        "Full Name": "Nombre Completo"
    },
    "fr": {
        "Home": "Accueil",
        "Jobs": "Emplois",
        "Company reviews": "Avis entreprises",
        "Salary guide": "Guide des salaires",
        "Sign in": "Se connecter",
        "Sign out": "Se déconnecter",
        "Sign Out": "Se déconnecter",
        "Register": "S'inscrire",
        "Employers / Post Job": "Employeurs / Publier une offre",
        "Post a job": "Publier une offre",
        "Post a Job": "Publier une offre",
        "Job Seekers": "Candidats",
        "Employers": "Employeurs",
        "Change country:": "Changer de pays :",
        "Change country: India": "تغيير البلد: الهند",
        "Your next job starts here.": "Votre prochain emploi commence ici.",
        "Your next job starts here": "Votre prochain emploi commence ici",
        "Create an account or sign in to see your personalised job recommendations.": "أنشئ حساباً أو سجّل الدخول للاطلاع على توصيات الوظائف المخصصة لك.",
        "Get Started": "ابدأ الآن",
        "What": "Quoi",
        "Where": "Où",
        "Find jobs": "Trouver des emplois",
        "Search jobs": "Rechercher des emplois",
        "Search": "Rechercher",
        "Job title, keywords, or company": "Intitulé de poste, mots-clés ou entreprise",
        "City, state, zip code, or remote": "Ville, département ou télétravail",
        "City, state, or 'remote'": "المدينة أو المحافظة أو عن بعد",
        "Patna, Bihar": "باتنا، بيهار",
        "Popular searches:": "Recherches populaires :",
        "Popular searches": "Recherches populaires",
        "Recent searches": "Recherches récentes",
        "Clear": "Effacer",
        "Jobs for you": "Emplois pour vous",
        "Top job picks for you": "Meilleures sélections pour vous",
        "View all jobs": "Voir toutes les offres",
        "View all jobs >": "Voir toutes les offres >",
        "Job feed based on your profile and search history": "Offres selon votre profil et vos recherches",
        "TOP MATCH": "أفضل تطابق",
        "RECOMMENDED": "موصى به",
        "HIGH PAY": "راتب مرتفع",
        "PATNA / REMOTE": "باتنا / عن بعد",
        "Actively Hiring": "توظيف نشط",
        "Easily Apply": "تقديم سهل",
        "Early Applicant": "متقدم مبكر",
        "Apply now": "Postuler maintenant",
        "Applied": "Candidature envoyée",
        "Saved": "Enregistré",
        "Save job": "Enregistrer l'offre",
        "Easy apply": "Candidature facile",
        "Urgent hiring": "Recrutement urgent",
        "Remote": "Télétravail",
        "Full-time": "Temps plein",
        "Part-time": "Temps partiel",
        "Fresher": "Débutant",
        "Top matches": "Meilleures correspondances",
        "Saved jobs": "Offres enregistrées",
        "Applied jobs": "Candidatures envoyées",
        "No jobs saved yet": "Aucune offre enregistrée pour le moment",
        "No applied jobs yet": "Aucune candidature pour le moment",
        "New Applicant": "Nouveau candidat",
        "Under Review": "En cours d'examen",
        "Shortlisted": "Présélectionné",
        "Interview Scheduled": "Entretien planifié",
        "Live Candidate Pipeline": "Vivier de candidats en direct",
        "Shortlisted & Assessments": "Présélection et évaluations",
        "Live Interview Schedule": "Planning d'entretiens en direct",
        "2 New Matches": "2 nouveaux profils correspondants",
        "2 Candidates Shortlisted": "2 candidats présélectionnés",
        "2 Video Calls Ready": "2 visioconférences prêtes",
        "Remote options available": "خيارات العمل عن بعد متاحة",
        "Fast response": "استجابة سريعة",
        "Work from office": "العمل من المكتب",
        "Hybrid": "هجين",
        "a year": "سنوياً",
        "per year": "par an",
        "Average salary": "Salaire moyen",
        "Senior Full Stack Developer": "مطور برمجيات شامل أول",
        "React Frontend Engineer": "مهندس واجهات أمامية React",
        "Python Data Engineer": "مهندس بيانات بايثون",
        "Java Backend Architect": "مهندس برمجيات جافا خبير",
        "Apex Consultancy Solutions - Bengaluru, Karnataka": "أبيكس لحلول الاستشارات - بنغالورو، كارناتاكا",
        "Tata Consultancy Services - Hyderabad, Telangana": "تاتا للخدمات الاستشارية - حيدر أباد، تلنغانة",
        "Infosys Ltd - Pune, Maharashtra": "إنفوسيس المحدودة - بونا، ماهاراشترا",
        "Wipro Technologies - Patna / Remote": "ويبرو تكنولوجيز - باتنا / عن بعد",
        "What's trending on Move ONN": "الأكثر رواجاً على Move ONN",
        "Popular Tech Roles": "أبرز الوظائف التقنية",
        "Top Hiring Cities": "أفضل مدن التوظيف",
        "Executive & Management": "الوظائف التنفيذية والإدارية",
        "Full Stack Developer": "مطور برمجيات شامل",
        "AI & Machine Learning": "الذكاء الاصطناعي وتعلم الآلة",
        "DevOps & Cloud Engineer": "مهندس DevOps وسحابي",
        "Mobile App Developer": "مطور تطبيقات الجوال",
        "Data Analyst & Power BI": "محلل بيانات و Power BI",
        "Cyber Security Specialist": "أخصائي أمن سيبراني",
        "QA Automation Engineer": "مهندس أتمتة الجودة",
        "Top Companies Hiring": "أفضل الشركات التي توظف حالياً",
        "Engineering Director": "مدير هندسي",
        "VP of Product Management": "نائب رئيس إدارة المنتجات",
        "Chief Technology Officer (CTO)": "الرئيس التنفيذي للتكنولوجيا (CTO)",
        "Principal Solution Architect": "كبير مهندسي الحلول",
        "Head of Data Science": "رئيس علوم البيانات",
        "Senior Engineering Manager": "مدير هندسي أول",
        "Scrum Master & Agile Coach": "سكرم ماستر ومدرب أجايل",
        "Chief Information Security Officer": "رئيس أمن المعلومات",
        "Bangalore / Bengaluru": "بنغالور / بنغالورو",
        "Hyderabad": "حيدر أباد",
        "Pune": "بونا",
        "Delhi NCR (Gurgaon / Noida)": "دلهي الكبرى (غورغاون / نويدا)",
        "Mumbai": "مومباي",
        "Chennai": "تشيناي",
        "Patna": "باتنا",
        "Kolkata": "كولكاتا",
        "Ahmedabad (GIFT City)": "أحمد أباد (مدينة جيفت)",
        "Move ONN for Employers": "Move ONN pour employeurs",
        "Let’s hire your next great candidate. Fast.": "Recrutez votre prochain talent exceptionnel. Rapidement.",
        "Let's hire your next great candidate. Fast.": "Recrutez votre prochain talent exceptionnel. Rapidement.",
        "No matter the skills, industry, or experience level you're looking for, we can help you find your next great hire.": "Quels que soient les compétences ou le secteur recherchés, nous vous aidons à trouver la perle rare.",
        "No matter the skills, industry, or experience level you’re looking for, we can help you find your next great hire.": "Quels que soient les compétences ou le secteur recherchés, nous vous aidons à trouver la perle rare.",
        "No matter the skills, experience or qualifications you’re looking for, you’ll find the right people here.": "Quelles que soient les qualifications requises, vous trouverez les bonnes personnes ici.",
        "No matter the skills, experience or qualifications you're looking for, you'll find the right people here.": "Quelles que soient les qualifications requises, vous trouverez les bonnes personnes ici.",
        "Manage your hiring from start to finish": "Gérez vos recrutements du début à la fin",
        "Get started with a job post. Move ONN has 20.1M unique monthly users.": "Commencez par une annonce. Move ONN compte 20,1M de visiteurs uniques par mois.",
        "Find quality applicants": "Trouvez des candidats qualifiés",
        "Customise your post with screening tools to help narrow down to potential candidates.": "Personnalisez votre annonce avec des outils de filtrage pour cibler les meilleurs profils.",
        "Make connections": "Nouez des contacts directs",
        "Track, message, invite and interview directly on Move ONN with no extra apps to download.": "Suivez, échangez, invitez et faites passer des entretiens directement sur Move ONN sans installer d'application.",
        "Hire confidently": "Recrutez en toute confiance",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "Vous n'êtes pas seul dans vos recrutements. Nous mettons à disposition des ressources pour chaque étape.",
        "You're not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "Vous n'êtes pas seul dans vos recrutements. Nous mettons à disposition des ressources pour chaque étape.",
        "Your dashboard features": "Fonctionnalités de votre tableau de bord",
        "Save time and effort in your hiring journey.": "Gagnez du temps et de l'énergie dans vos recrutements.",
        "Manage your jobs": "Gérez vos offres",
        "View applicants, edit descriptions, adjust budgets, and monitor candidate status in real time.": "Consultez les candidats, modifiez les descriptifs, ajustez les budgets et suivez l'avancement en temps réel.",
        "Choose who moves forward": "Sélectionnez les profils retenus",
        "Filter by match score, assessment results, and recruiter notes to shortlist candidates fast.": "Filtrez par score de correspondance, tests et notes de recruteurs pour aller vite.",
        "Interview anywhere": "Passez des entretiens où que vous soyez",
        "Conduct 1-click video calls with built-in screener rubrics right inside your browser.": "Organisez des visioconférences en 1 clic avec grilles d'évaluation dans votre navigateur.",
        "Unlock matched candidates with Move ONN Smart Sourcing": "Accédez aux candidats correspondants avec Move ONN Smart Sourcing",
        "When you have a job posted and add a Move ONN Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Move ONN fit your job description. When someone stands out, invite them to apply directly.": "En publiant une offre avec Move ONN Smart Sourcing, découvrez instantanément des CV adaptés. Invitez directement les meilleurs talents.",
        "Explore Smart Sourcing": "Découvrir Smart Sourcing",
        "Employer Help Centre": "Centre d'aide employeurs",
        "Employer Resources Library": "Bibliothèque de ressources employeurs",
        "Ready to find your next great hire?": "Prêt à trouver votre prochain collaborateur clé ?",
        "Build your team with India's #1 hiring network": "Bâtissez votre équipe avec le réseau leader",
        "Build your team with India’s #1 hiring network": "Bâtissez votre équipe avec le réseau leader",
        "Post a job in minutes": "Publiez une offre en quelques minutes",
        "Frequently asked questions": "Foire aux questions",
        "Why is my job here if I did not post it?": "Pourquoi mon offre est-elle ici si je ne l'ai pas publiée ?",
        "How do I manage/cancel my post?": "Comment gérer ou annuler mon annonce ?",
        "Does Move ONN remove job postings?": "Est-ce que Move ONN supprime des offres d'emploi ?",
        "How is Move ONN different from other places where I can post jobs?": "En quoi Move ONN est-il différent des autres sites d'emploi ?",
        "Most posts go live within 24 to 48 hours after a standard review.": "La plupart des annonces sont en ligne sous 24 à 48 heures après validation.",
        "Move ONN pulls postings from career sites and boards to help jobseekers find all available roles in one place.": "Move ONN regroupe des annonces de plusieurs sites pour permettre aux candidats de tout trouver en un seul endroit.",
        "In your Dashboard, click 'Edit Job' and change the status to 'Paused' or 'Closed.'": "Dans votre tableau de bord, cliquez sur 'Modifier l'offre' et passez le statut à 'En pause' ou 'Clôturée'.",
        "Yes. Move ONN reserves the right to remove any job that violates our quality standards.": "Oui. Move ONN se réserve le droit de supprimer toute offre enfreignant nos règles de qualité.",
        "Move ONN is both a job search engine and an all-in-one hiring platform.": "Move ONN est à la fois un moteur de recherche d'emploi et une plateforme de recrutement tout-en-un.",
        "Find great places to work": "Trouvez d'excellentes entreprises où travailler",
        "Get access to millions of company reviews": "Accédez à des millions d'avis sur les entreprises",
        "Company name or job title": "Nom d'entreprise ou intitulé de poste",
        "Find Companies": "Trouver des entreprises",
        "Do you want to search for salaries?": "Voulez-vous rechercher des salaires ?",
        "Analyze job market salaries": "Analyser les salaires du marché",
        "Top companies in India": "Meilleures entreprises",
        "Popular companies": "Entreprises populaires",
        "Discover your earning potential": "Découvrez votre potentiel de rémunération",
        "Explore high-paying careers, salaries and job openings by industry and location.": "Explorez les métiers les mieux rémunérés, salaires et offres par secteur et ville.",
        "Browse top-paying jobs by industry": "Consultez les métiers les mieux rémunérés par secteur",
        "Choose an industry": "Choisir un secteur",
        "All Industries": "Tous les secteurs",
        "Job openings": "Offres d'emploi",
        "Search salaries by job title...": "Rechercher des salaires par intitulé...",
        "Search salaries": "Rechercher des salaires",
        "Welcome Back": "مرحباً بعودتك",
        "Welcome to Move ONN": "Bienvenue sur Move ONN",
        "Sign in to your Move ONN account": "سجّل الدخول إلى حساب Move ONN الخاص بك",
        "Connect with visionary employers and discover top engineering & executive opportunities.": "Rejoignez des recruteurs visionnaires et découvrez les meilleures opportunités.",
        "Empowering your high-performance career opportunities and enterprise recruitment workflows.": "تمكين مسارك المهني وحلول التوظيف المؤسسية المتقدمة.",
        "Empowering your high-performance web applications and enterprise workflows with secure technology.": "تمكين تطبيقاتك وحلول التوظيف المؤسسية الآمنة.",
        "Build, scale and innovate with our next-generation digital cloud architecture and tools.": "ابنِ وطوّر مستقبلك مع منصتنا الرقمية المبتكرة للتوظيف.",
        "Continue with Google": "Continuer avec Google",
        "Continue with Apple": "Continuer avec Apple",
        "Username or Email": "اسم المستخدم أو البريد الإلكتروني",
        "Full name": "Nom complet",
        "Enter your full name": "Entrez votre nom complet",
        "Email Address": "البريد الإلكتروني",
        "Email address": "Adresse e-mail",
        "Password": "Mot de passe",
        "Sign In": "Se connecter",
        "Create Account": "Créer un compte",
        "Don't have an account?": "ليس لديك حساب؟",
        "Already have an account?": "هل لديك حساب بالفعل؟",
        "Sign Up": "إنشاء حساب جديد",
        "Join the Move ONN community": "انضم إلى مجتمع Move ONN",
        "or with email": "أو بالبريد الإلكتروني",
        "Browse Jobs": "Parcourir les emplois",
        "Salary Calculator": "Calculateur de salaire",
        "Company Reviews": "Avis d'entreprises",
        "Create Candidate Profile": "Créer un profil candidat",
        "Recruitment Solutions": "Solutions de recrutement",
        "Hiring Plans": "Offres d'embauche",
        "Global Hiring": "Recrutement international",
        "About Us": "À propos",
        "International Portals": "Portails internationaux",
        "Trust & Safety": "Sécurité et confiance",
        "Help Center": "Centre d'aide",
        "Privacy Center": "Centre de confidentialité",
        "Cookies": "Cookies",
        "Privacy": "Confidentialité",
        "Terms": "Conditions",
        "All rights reserved.": "Tous droits réservés.",
        "© 2026 Move ONN Consultancy Solutions. All rights reserved.": "© 2026 Move ONN Consultancy Solutions. Tous droits réservés.",
        "Keep me signed in on this device": "Rester connecté sur cet appareil",
        "Forgot password?": "Mot de passe oublié ?",
        "By continuing, you agree to Move ONN's": "En continuant, vous acceptez les",
        "Terms of Service": "Conditions d'Utilisation",
        "Privacy Policy": "Politique de confidentialité",
        "and": "et",
        "20.1M+ Verified Candidate CVs": "Plus de 20,1M de CVs certifiés",
        "Direct Employer Communication": "Échanges directs avec les employeurs",
        "GDPR & ISO-27001 Certified": "Certifié RGPD et ISO-27001",
        "Move ONN | Premier Tech & Executive Recruitment Consultancy": "Move ONN | Conseil Premier en Recrutement Technologique et Cadres",
        "Recommended Jobs - Move ONN Consultancy": "Emplois Recommandés - Conseil Move ONN",
        "Company Reviews & Top Employers - Move ONN Consultancy": "Avis d'Entreprises et Meilleurs Employeurs - Conseil Move ONN",
        "Salary Guide & Pay Calculator - Move ONN Consultancy": "Guide des Salaires et Calculateur de Rémunération - Conseil Move ONN",
        "Hire Top Talent & Post Jobs - Move ONN Consultancy": "Recrutez les Meilleurs Talents et Publiez des Offres - Conseil Move ONN",
        "Worldwide International Job Portals - Move ONN Consultancy": "Portails d'Emploi Internationaux - Conseil Move ONN",
        "Popular Job Locations": "Lieux d'Emploi Populaires",
        "Bengaluru (Silicon Valley)": "Bengaluru (Silicon Valley)",
        "Hyderabad (HITEC City)": "Hyderabad (HITEC City)",
        "Pune (Hinjewadi)": "Pune (Hinjewadi)",
        "Delhi / NCR (Noida & Gurugram)": "Delhi / RCN (Noida et Gurugram)",
        "Mumbai & Navi Mumbai": "Mumbai et Navi Mumbai",
        "Chennai (OMR Corridor)": "Chennai (Corridor OMR)",
        "Kolkata (Salt Lake)": "Kolkata (Salt Lake)",
        "Chandigarh IT Park": "Parc Technologique de Chandigarh",
        "Patna (Bihar)": "Patna (Bihar)",
        "Patna / Bihar": "Patna / Bihar",
        "Delhi / NCR": "Delhi / RCN",
        "Innovate. Build. Empower. Connecting top engineering and executive talent with visionary enterprises across India and globally.": "Innovez. Construisez. Valorisez. Relier les meilleurs talents de l'ingénierie et de la direction à des entreprises visionnaires en Inde et dans le monde.",
        "India's leading career acceleration and corporate recruitment portal. Empowering candidates and hiring managers with verified opportunities.": "Le portail leader d'accélération de carrière et de recrutement en Inde. Donner des opportunités vérifiées aux candidats et recruteurs.",
        "Privacy Centre": "Centre de Confidentialité",
        "Change Country": "Changer de Pays",
        "Change country (India)": "Changer de pays (Inde)",
        "Help Centre": "Centre d'Aide",
        "Welcome": "Bienvenue",
        "Back!": "de retour !",
        "Join": "Rejoignez",
        "Us Today!": "nous Aujourd'hui !",
        "name@company.com": "nom@entreprise.com",
        "••••••••": "••••••••",
        "Experience (Any)": "Expérience (Toutes)",
        "Fresher (0 Yrs)": "Débutant (0 an)",
        "2+ Yrs": "2+ ans",
        "3+ Yrs": "3+ ans",
        "5+ Yrs": "5+ ans",
        "8+ Yrs": "8+ ans",
        "0 - 1 Yrs (Freshers)": "0 - 1 an (Débutants)",
        "1 - 3 Yrs": "1 - 3 ans",
        "3 - 5 Yrs": "3 - 5 ans",
        "All Filters": "Tous les Filtres",
        "Clear All": "Tout Effacer",
        "Work Mode": "Mode de Travail",
        "Department": "Département",
        "Engineering - Software": "Ingénierie - Logiciel",
        "Data Science & Analytics": "Science des Données et Analyse",
        "Consulting & Strategy": "Conseil et Stratégie",
        "Human Resources": "Ressources Humaines",
        "Showing": "Affichage de",
        "recommended jobs based on your profile": "emplois recommandés selon votre profil",
        "Sort by: Relevance": "Trier par : Pertinence",
        "Sort by: Date (Newest)": "Trier par : Date (Plus récente)",
        "Sort by: Salary (High to Low)": "Trier par : Salaire (Décroissant)",
        "Apply to Senior Full Stack Developer": "Postuler à Développeur Full Stack Senior",
        "Apex Consultancy Solutions • Bengaluru": "Apex Consultancy Solutions • Bengaluru",
        "Applicant Profile": "Profil du Candidat",
        "Resume / CV": "CV / Curriculum Vitae",
        "Attached": "Joint",
        "Total Years of Experience": "Années Totales d'Expérience",
        "Notice Period": "Période de Préavis",
        "Immediate Joiner (0 Days)": "Disponibilité Immédiate (0 jour)",
        "15 Days": "15 jours",
        "30 Days": "30 jours",
        "60 Days": "60 jours",
        "Submit Application": "Soumettre la Candidature",
        "Job Overview": "Aperçu du Poste",
        "Search by skills": "Rechercher par compétences",
        "Enter location": "Entrez un lieu",
        "Search by skills, designation, companies...": "Rechercher par compétences, poste, entreprises...",
        "Enter location (e.g. Bengaluru)": "Entrez un lieu (ex. Bengaluru)",
        "Job title": "Intitulé du poste",
        "IndusInd Bank": "IndusInd Bank",
        "Salaries": "Salaires",
        "Questions": "Questions",
        "Open jobs": "Offres ouvertes",
        "Reliance Industries Ltd": "Reliance Industries Ltd",
        "Urban Company": "Urban Company",
        "Adani Group": "Groupe Adani",
        "L&T Technology Services Ltd.": "L&T Technology Services Ltd.",
        "Agriculture, Fishing & Forestry": "Agriculture, Pêche et Foresterie",
        "Architecture & Engineering": "Architecture et Ingénierie",
        "Business Management, Administrative & Customer Support": "Gestion d'Entreprise, Administratif et Support Client",
        "Cleaning & Grounds Maintenance": "Nettoyage et Entretien des Lieux",
        "Community & Social Services": "Services Communautaires et Sociaux",
        "Construction & Extraction": "Construction et Extraction",
        "Education & Instruction": "Éducation et Enseignement",
        "Finance & Accounting": "Finance et Comptabilité",
        "Food & Beverage": "Alimentation et Boissons",
        "Healthcare": "Santé et Médical",
        "Legal": "Juridique et Droit",
        "Manufacturing & Utilities": "Industrie et Services Publics",
        "Marketing, Advertising & Public Relations": "Marketing, Publicité et Relations Publiques",
        "Media, Arts & Design": "Médias, Arts et Design",
        "Personal Service": "Services à la Personne",
        "Repair, Maintenance & Installation": "Réparation, Entretien et Installation",
        "Safety, Security & Defence Service": "Sécurité et Services de Défense",
        "Sales & Retail": "Vente et Commerce de Détail",
        "Science & Research": "Sciences et Recherche",
        "Supply Chain & Logistics": "Chaîne d'Approvisionnement et Logistique",
        "Technology": "Technologie",
        "Transportation": "Transport",
        "Travel, Attractions & Events": "Voyages, Attractions et Événements",
        "Software Engineer": "Ingénieur Logiciel",
        "Registered Nurse": "Infirmier(ère) Diplômé(e)",
        "Accountant": "Comptable",
        "Business Analyst": "Analyste d'Affaires",
        "Nursing Assistant": "Aide-Soignant(e)",
        "Sales Executive": "Chargé de Clientèle",
        "Human Resources Specialist": "Spécialiste RH",
        "Customer Service Representative": "Conseiller Service Client",
        "Assistant Store Manager": "Adjoint(e) Responsable de Magasin",
        "Elementary School Teacher": "Professeur des Écoles",
        "Customer Care Specialist": "Spécialiste de la Relation Client",
        "Office Assistant": "Assistant(e) de Bureau",
        "Back Office Executive": "Gestionnaire Back Office",
        "Data Entry Clerk": "Opérateur de Saisie de Données",
        "Graphic Designer": "Graphiste",
        "Front Desk Manager": "Responsable Réception",
        "Let’s hire your next great candidate.": "Recrutons votre prochain candidat d'exception.",
        "Fast": "Rapidement",
        "Get started with a job post. Move ONN has 20.1M unique monthly users to deliver verified applicants.": "Commencez par une offre d'emploi. Move ONN compte 20,1 M d'utilisateurs uniques par mois pour vous fournir des candidats vérifiés.",
        "Customise your post with screening tools to help narrow down to potential top-tier candidates.": "Personnalisez votre offre avec des outils de filtrage pour identifier les candidats les plus qualifiés.",
        "98% Match": "98% de Correspondance",
        "Senior Full Stack Engineer • Bangalore": "Ingénieur Full Stack Senior • Bangalore",
        "95% Match": "95% de Correspondance",
        "Lead Product Designer • Remote": "Designer Produit Principal • À distance",
        "Hiring resources for every step of the process": "Ressources de recrutement pour chaque étape du processus",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process, including interview guides, competitive market salary reports, and compliance playbooks.": "Vous n'êtes pas seul dans votre processus de recrutement. Nous mettons à disposition des guides d'entretien, des grilles de salaires et des manuels de conformité.",
        "Employer Resource Library": "Bibliothèque de Ressources Employeur",
        "Ready to find your next hired candidate?": "Prêt à trouver votre prochaine recrue ?",
        "Create a job post in minutes and tap into India's largest verified talent network of top engineers, executives, and specialists.": "Créez une offre en quelques minutes et accédez au plus grand réseau de talents vérifiés en Inde composé d'ingénieurs et de cadres.",
        "Frequently Asked Questions": "Foire Aux Questions",
        "How do I create an Move ONN for Employers account for free?": "Comment créer un compte Move ONN pour les Employeurs gratuitement ?",
        "You can register for an employer account in minutes by clicking 'Post a job' or 'Sign in' and choosing Register. Simply enter your company work email, full name, and password to immediately access candidate screening, job management, and messaging.": "Inscrivez-vous en quelques minutes en cliquant sur 'Publier une offre' ou 'Connexion' et choisissez Inscription. Entrez votre email professionnel, votre nom complet et un mot de passe pour accéder au filtrage et à la messagerie.",
        "Does Move ONN integrate with my ATS?": "Move ONN s'intègre-t-il à mon système ATS ?",
        "Yes. Move ONN integrates seamlessly with all leading Applicant Tracking Systems (ATS) including Greenhouse, Lever, Workday, BambooHR, and custom webhook solutions to synchronize job postings, applicant statuses, and candidate notes.": "Oui. Move ONN s'intègre avec tous les grands systèmes ATS (Greenhouse, Lever, Workday, BambooHR) et webhooks pour synchroniser offres, statuts et notes de candidats.",
        "How can I contact candidates who have not applied to my job?": "Comment contacter des candidats qui n'ont pas encore postulé à mon offre ?",
        "Use Move ONN Smart Sourcing to search our CV database of over 20 million verified candidates. Filter candidates by exact skills, years of experience, and location, and invite them directly to apply for your vacancies.": "Utilisez Move ONN Smart Sourcing pour explorer notre base de plus de 20 millions de CV vérifiés. Filtrez par compétences, expérience et lieu, et invitez-les à postuler.",
        "How does Move ONN help me screen candidates?": "Comment Move ONN m'aide-t-il à présélectionner les candidats ?",
        "You can add customized screener questions, required qualifications, and pre-employment assessment tests to your job post to automatically highlight top applicants and filter out non-matching submissions.": "Ajoutez des questions de présélection personnalisées, des compétences requises et des tests d'évaluation pour identifier automatiquement les meilleurs profils.",
        "Can Move ONN help with high-volume hiring?": "Move ONN peut-il m'aider pour des recrutements volumiques ?",
        "Absolutely. Our enterprise recruitment suite provides bulk candidate imports, automated interview scheduling, collaborative hiring team permissions, and prioritized job syndication across our entire partner network.": "Absolument. Notre suite entreprise offre l'importation groupée de candidats, la planification automatisée des entretiens, et la multidiffusion prioritaire de vos offres.",
        "What are the benefits of a Sponsored Job?": "Quels sont les avantages d'une Offre Sponsorisée ?",
        "Sponsored Jobs receive prime placement in search results and targeted candidate recommendations, delivering up to 4.5x more applications and significantly reducing time-to-hire compared to organic listings.": "Les offres sponsorisées bénéficient d'un placement prioritaire dans les résultats et génèrent jusqu'à 4,5 fois plus de candidatures tout en réduisant le délai d'embauche.",
        "Can sponsoring improve time-to-hire?": "Le sponsoring permet-il de réduire le délai de recrutement ?",
        "Yes. Sponsored Jobs achieve higher daily impressions and applicant velocity, allowing hiring managers to make quality hires in an average of under 14 business days.": "Oui. Les offres sponsorisées obtiennent une visibilité accrue et permettent aux recruteurs de réaliser des embauches de qualité en moins de 14 jours ouvrés en moyenne.",
        "How can I improve visibility?": "Comment puis-je améliorer la visibilité de mon offre ?",
        "Craft a clear, descriptive job title, provide transparent salary expectations, specify detailed requirements, and sponsor your post to ensure it remains prominently displayed to matching jobseekers.": "Rédigez un titre précis, indiquez un salaire transparent, détaillez les compétences recherchées et sponsorisez votre annonce pour une visibilité maximale.",
        "How do I attract top talent?": "Comment attirer les meilleurs profils ?",
        "Highlight your company culture, competitive perks, flexible remote policies, and verified company reviews on your Move ONN Company Profile to stand out to passive senior talent.": "Mettez en avant votre culture d'entreprise, vos avantages, votre politique de télétravail et vos avis vérifiés sur votre page employeur Move ONN pour séduire les profils seniors.",
        "How can Move ONN help with Employer Branding?": "Comment Move ONN contribue-t-il à la marque employeur ?",
        "A verified Move ONN Company Page allows you to showcase office photos, CEO ratings, employee testimonials, company updates, and your open roles to over 20 million career-focused professionals.": "Une Page Entreprise vérifiée vous permet de publier des photos, la note du PDG, des avis de collaborateurs et vos offres auprès de plus de 20 millions d'actifs.",
        "How much does it cost to sponsor?": "Combien coûte le sponsoring d'une offre ?",
        "Move ONN offers flexible performance-based hiring budgets. You set a daily or monthly budget that fits your hiring needs, and you only pay when interested candidates engage with your job post.": "Move ONN propose des budgets flexibles à la performance. Fixez un montant quotidien ou mensuel selon vos besoins et ne payez que lorsque des candidats interagissent avec votre offre.",
        "Can I post without listing the salary?": "Puis-je publier une offre sans afficher le salaire ?",
        "Yes, listing salary is optional. However, postings with transparent salary ranges receive on average 35% more verified candidate applications and faster candidate responses.": "Oui, c'est facultatif. Néanmoins, les offres indiquant une rémunération claire reçoivent en moyenne 35% de candidatures qualifiées en plus et des retours plus rapides.",
        "How long until my job is visible?": "Combien de temps avant que mon offre soit en ligne ?",
        "Most posts go live within 24 to 48 hours after a standard quality and compliance review.": "La plupart des offres sont publiées sous 24 à 48 heures après validation de conformité et de qualité.",
        "Move ONN is both a job search engine and an all-in-one hiring platform. Beyond jobs posted directly by employers, Move ONN also aggregates job listings from thousands of sources across the internet. Employers gain access to features like virtual interviews and 'Hiring Insights'.": "Move ONN est à la fois un moteur de recherche d'emploi et une plateforme de recrutement complète regroupant des milliers d'offres du web, avec entretiens vidéo et indicateurs clés.",
        "Country and language": "Pays et langue",
        "Search countries and languages": "Rechercher des pays et des langues",
        "Search countries or languages": "Rechercher des pays ou des langues",
        "United Arab Emirates (Arabic)": "Émirats Arabes Unis (arabe)",
        "United Arab Emirates (English)": "Émirats Arabes Unis (anglais)",
        "Argentina (español)": "Argentine (español)",
        "Argentina (Spanish)": "Argentine (espagnol)",
        "Austria (German)": "Autriche (allemand)",
        "Australia (English)": "Australie (anglais)",
        "Belgium (German)": "Belgique (allemand)",
        "Belgium (English)": "Belgique (anglais)",
        "Belgium (French)": "Belgique (français)",
        "Belgium (Dutch)": "Belgique (néerlandais)",
        "Bahrain (Arabic)": "Bahreïn (arabe)",
        "Bahrain (English)": "Bahreïn (anglais)",
        "Brazil (Portuguese)": "Brésil (portugais)",
        "Canada (English)": "Canada (anglais)",
        "Canada (français)": "Canada (français)",
        "Canada (French)": "Canada (français)",
        "Switzerland (German)": "Suisse (allemand)",
        "Switzerland (English)": "Suisse (anglais)",
        "Switzerland (French)": "Suisse (français)",
        "Switzerland (Italian)": "Suisse (italien)",
        "Chile (español)": "Chili (español)",
        "Chile (Spanish)": "Chili (espagnol)",
        "China (Chinese)": "Chine (chinois)",
        "Colombia (español)": "Colombie (español)",
        "Colombia (Spanish)": "Colombie (espagnol)",
        "Costa Rica (español)": "Costa Rica (español)",
        "Costa Rica (Spanish)": "Costa Rica (espagnol)",
        "Czechia (Czech)": "Tchéquie (tchèque)",
        "Germany (German)": "Allemagne (allemand)",
        "Germany (Ukrainian)": "Allemagne (ukrainien)",
        "Denmark (Danish)": "Danemark (danois)",
        "Ecuador (español)": "Équateur (español)",
        "Ecuador (Spanish)": "Équateur (espagnol)",
        "Egypt (Arabic)": "Égypte (arabe)",
        "Egypt (English)": "Égypte (anglais)",
        "Spain (Spanish)": "Espagne (espagnol)",
        "Finland (Finnish)": "Finlande (finnois)",
        "Finland (svenska)": "Finlande (svenska)",
        "Finland (Swedish)": "Finlande (suédois)",
        "France (français)": "France (français)",
        "France (French)": "France (français)",
        "United Kingdom (English)": "Royaume-Uni (anglais)",
        "Greece (Greek)": "Grèce (grec)",
        "Hong Kong SAR China (English)": "Hong Kong (anglais)",
        "Hong Kong SAR China (Chinese)": "Hong Kong (chinois)",
        "Hungary (Hungarian)": "Hongrie (hongrois)",
        "Indonesia (English)": "Indonésie (anglais)",
        "Indonesia (Indonesia)": "Indonésie (Indonesia)",
        "Indonesia (Indonesian)": "Indonésie (indonésien)",
        "Ireland (English)": "Irlande (anglais)",
        "Israel (Hebrew)": "Israël (hébreu)",
        "India (English)": "Inde (anglais)",
        "India (Hindi)": "Inde (hindi)",
        "Italy (Italian)": "Italie (italien)",
        "Japan (Japanese)": "Japon (japonais)",
        "South Korea (Korean)": "Corée du Sud (coréen)",
        "Kuwait (Arabic)": "Koweït (arabe)",
        "Kuwait (English)": "Koweït (anglais)",
        "Luxembourg (German)": "Luxembourg (allemand)",
        "Luxembourg (English)": "Luxembourg (anglais)",
        "Luxembourg (français)": "Luxembourg (français)",
        "Luxembourg (French)": "Luxembourg (français)",
        "Morocco (Arabic)": "Maroc (arabe)",
        "Morocco (French)": "Maroc (français)",
        "Mexico (Spanish)": "Mexique (espagnol)",
        "Malaysia (English)": "Malaisie (anglais)",
        "Nigeria (English)": "Nigéria (anglais)",
        "Netherlands (Dutch)": "Pays-Bas (néerlandais)",
        "Norway (Norwegian)": "Norvège (norvégien)",
        "New Zealand (English)": "Nouvelle-Zélande (anglais)",
        "Oman (Arabic)": "Oman (arabe)",
        "Oman (English)": "Oman (anglais)",
        "Panama (Spanish)": "Panama (espagnol)",
        "Peru (Spanish)": "Pérou (espagnol)",
        "Philippines (English)": "Philippines (anglais)",
        "Pakistan (English)": "Pakistan (anglais)",
        "Poland (Polish)": "Pologne (polonais)",
        "Poland (Ukrainian)": "Pologne (ukrainien)",
        "Portugal (português)": "Portugal (português)",
        "Portugal (Portuguese)": "Portugal (portugais)",
        "Qatar (Arabic)": "Qatar (arabe)",
        "Qatar (English)": "Qatar (anglais)",
        "Romania (Romanian)": "Roumanie (roumain)",
        "Russia (Russian)": "Russie (russe)",
        "Saudi Arabia (Arabic)": "Arabie Saoudite (arabe)",
        "Saudi Arabia (English)": "Arabie Saoudite (anglais)",
        "Sweden (Swedish)": "Suède (suédois)",
        "Singapore (English)": "Singapour (anglais)",
        "Singapore (Chinese)": "Singapour (chinois)",
        "Thailand (English)": "Thaïlande (anglais)",
        "Thailand (Thai)": "Thaïlande (thaï)",
        "Türkiye (Türkçe)": "Turquie (Türkçe)",
        "Türkiye (Turkish)": "Turquie (turc)",
        "Taiwan (Chinese)": "Taïwan (chinois)",
        "Ukraine (Russian)": "Ukraine (russe)",
        "Ukraine (Ukrainian)": "Ukraine (ukrainien)",
        "United States (English)": "États-Unis (anglais)",
        "United States (Spanish)": "États-Unis (espagnol)",
        "Uruguay (español)": "Uruguay (español)",
        "Uruguay (Spanish)": "Uruguay (espagnol)",
        "Venezuela (español)": "Venezuela (español)",
        "Venezuela (Spanish)": "Venezuela (espagnol)",
        "Vietnam (English)": "Vietnam (anglais)",
        "Vietnam (Vietnamese)": "Vietnam (vietnamien)",
        "South Africa (English)": "Afrique du Sud (anglais)",
        "Top Matches": "Meilleures Correspondances",
        "Experience": "Expérience",
        "Location": "Lieu",
        "Bengaluru": "Bengaluru",
        "Design Systems": "Systèmes de Design",
        "User Research": "Recherche Utilisateur",
        "Apex Consultancy Solutions": "Apex Consultancy Solutions",
        "Tata Consultancy Services (TCS)": "Tata Consultancy Services (TCS)",
        "Infosys Technologies": "Infosys Technologies",
        "Wipro Enterprises": "Wipro Enterprises",
        "Google India": "Google Inde",
        "Microsoft India": "Microsoft Inde",
        "Amazon Development Centre": "Centre de Développement Amazon",
        "Cognizant Technology": "Cognizant Technology",
        "HCL Technologies": "HCL Technologies",
        "Tech Mahindra": "Tech Mahindra",
        "Company Email": "E-mail Professionnel",
        "Full Name": "Nom Complet"
    },
    "de": {
        "Home": "Startseite",
        "Jobs": "Jobs",
        "Company reviews": "Unternehmensbewertungen",
        "Salary guide": "Gehaltsvergleich",
        "Sign in": "Anmelden",
        "Sign out": "Abmelden",
        "Sign Out": "Abmelden",
        "Register": "Registrieren",
        "Employers / Post Job": "Arbeitgeber / Job schalten",
        "Post a job": "Job schalten",
        "Post a Job": "Job schalten",
        "Job Seekers": "Arbeitssuchende",
        "Employers": "Arbeitgeber",
        "Change country:": "Land ändern:",
        "Change country: India": "تغيير البلد: الهند",
        "Your next job starts here.": "Ihr nächster Job beginnt hier.",
        "Your next job starts here": "Ihr nächster Job beginnt hier",
        "Create an account or sign in to see your personalised job recommendations.": "أنشئ حساباً أو سجّل الدخول للاطلاع على توصيات الوظائف المخصصة لك.",
        "Get Started": "ابدأ الآن",
        "What": "Was",
        "Where": "Wo",
        "Find jobs": "Jobs finden",
        "Search jobs": "Jobs suchen",
        "Search": "Suchen",
        "Job title, keywords, or company": "Jobtitel, Stichwörter oder Unternehmen",
        "City, state, zip code, or remote": "Stadt, Bundesland oder Remote",
        "City, state, or 'remote'": "المدينة أو المحافظة أو عن بعد",
        "Patna, Bihar": "باتنا، بيهار",
        "Popular searches:": "Beliebte Suchen:",
        "Popular searches": "Beliebte Suchen",
        "Recent searches": "Letzte Suchen",
        "Clear": "Löschen",
        "Jobs for you": "Jobs für Sie",
        "Top job picks for you": "Beste Job-Auswahl für Sie",
        "View all jobs": "Alle Jobs anzeigen",
        "View all jobs >": "Alle Jobs anzeigen >",
        "Job feed based on your profile and search history": "Job-Feed basierend auf Ihrem Profil und Suchverlauf",
        "TOP MATCH": "أفضل تطابق",
        "RECOMMENDED": "موصى به",
        "HIGH PAY": "راتب مرتفع",
        "PATNA / REMOTE": "باتنا / عن بعد",
        "Actively Hiring": "توظيف نشط",
        "Easily Apply": "تقديم سهل",
        "Early Applicant": "متقدم مبكر",
        "Apply now": "Jetzt bewerben",
        "Applied": "Beworben",
        "Saved": "Gespeichert",
        "Save job": "Job speichern",
        "Easy apply": "Einfach bewerben",
        "Urgent hiring": "Dringende Einstellung",
        "Remote": "Remote",
        "Full-time": "Vollzeit",
        "Part-time": "Teilzeit",
        "Fresher": "Berufseinsteiger",
        "Top matches": "Beste Treffer",
        "Saved jobs": "Gespeicherte Jobs",
        "Applied jobs": "Bewerbungen",
        "No jobs saved yet": "Noch keine Jobs gespeichert",
        "No applied jobs yet": "Noch keine Bewerbungen vorhanden",
        "New Applicant": "Neuer Bewerber",
        "Under Review": "In Prüfung",
        "Shortlisted": "In der engeren Auswahl",
        "Interview Scheduled": "Interview geplant",
        "Live Candidate Pipeline": "Live-Kandidaten-Pipeline",
        "Shortlisted & Assessments": "Auswahl & Bewertungen",
        "Live Interview Schedule": "Live-Interview-Zeitplan",
        "2 New Matches": "2 neue passende Treffer",
        "2 Candidates Shortlisted": "2 Kandidaten vorausgewählt",
        "2 Video Calls Ready": "2 Video-Interviews bereit",
        "Remote options available": "خيارات العمل عن بعد متاحة",
        "Fast response": "استجابة سريعة",
        "Work from office": "العمل من المكتب",
        "Hybrid": "هجين",
        "a year": "سنوياً",
        "per year": "pro Jahr",
        "Average salary": "Durchschnittsgehalt",
        "Senior Full Stack Developer": "مطور برمجيات شامل أول",
        "React Frontend Engineer": "مهندس واجهات أمامية React",
        "Python Data Engineer": "مهندس بيانات بايثون",
        "Java Backend Architect": "مهندس برمجيات جافا خبير",
        "Apex Consultancy Solutions - Bengaluru, Karnataka": "أبيكس لحلول الاستشارات - بنغالورو، كارناتاكا",
        "Tata Consultancy Services - Hyderabad, Telangana": "تاتا للخدمات الاستشارية - حيدر أباد، تلنغانة",
        "Infosys Ltd - Pune, Maharashtra": "إنفوسيس المحدودة - بونا، ماهاراشترا",
        "Wipro Technologies - Patna / Remote": "ويبرو تكنولوجيز - باتنا / عن بعد",
        "What's trending on Move ONN": "الأكثر رواجاً على Move ONN",
        "Popular Tech Roles": "أبرز الوظائف التقنية",
        "Top Hiring Cities": "أفضل مدن التوظيف",
        "Executive & Management": "الوظائف التنفيذية والإدارية",
        "Full Stack Developer": "مطور برمجيات شامل",
        "AI & Machine Learning": "الذكاء الاصطناعي وتعلم الآلة",
        "DevOps & Cloud Engineer": "مهندس DevOps وسحابي",
        "Mobile App Developer": "مطور تطبيقات الجوال",
        "Data Analyst & Power BI": "محلل بيانات و Power BI",
        "Cyber Security Specialist": "أخصائي أمن سيبراني",
        "QA Automation Engineer": "مهندس أتمتة الجودة",
        "Top Companies Hiring": "أفضل الشركات التي توظف حالياً",
        "Engineering Director": "مدير هندسي",
        "VP of Product Management": "نائب رئيس إدارة المنتجات",
        "Chief Technology Officer (CTO)": "الرئيس التنفيذي للتكنولوجيا (CTO)",
        "Principal Solution Architect": "كبير مهندسي الحلول",
        "Head of Data Science": "رئيس علوم البيانات",
        "Senior Engineering Manager": "مدير هندسي أول",
        "Scrum Master & Agile Coach": "سكرم ماستر ومدرب أجايل",
        "Chief Information Security Officer": "رئيس أمن المعلومات",
        "Bangalore / Bengaluru": "بنغالور / بنغالورو",
        "Hyderabad": "حيدر أباد",
        "Pune": "بونا",
        "Delhi NCR (Gurgaon / Noida)": "دلهي الكبرى (غورغاون / نويدا)",
        "Mumbai": "مومباي",
        "Chennai": "تشيناي",
        "Patna": "باتنا",
        "Kolkata": "كولكاتا",
        "Ahmedabad (GIFT City)": "أحمد أباد (مدينة جيفت)",
        "Move ONN for Employers": "Move ONN für Arbeitgeber",
        "Let’s hire your next great candidate. Fast.": "Finden Sie Ihren nächsten Top-Kandidaten. Schnell.",
        "Let's hire your next great candidate. Fast.": "Finden Sie Ihren nächsten Top-Kandidaten. Schnell.",
        "No matter the skills, industry, or experience level you're looking for, we can help you find your next great hire.": "Egal welche Fähigkeiten oder Erfahrung Sie suchen, wir helfen Ihnen, den idealen Mitarbeiter zu finden.",
        "No matter the skills, industry, or experience level you’re looking for, we can help you find your next great hire.": "Egal welche Fähigkeiten oder Erfahrung Sie suchen, wir helfen Ihnen, den idealen Mitarbeiter zu finden.",
        "No matter the skills, experience or qualifications you’re looking for, you’ll find the right people here.": "Ganz gleich, welche Qualifikationen Sie suchen: Hier finden Sie die passenden Talente.",
        "No matter the skills, experience or qualifications you're looking for, you'll find the right people here.": "Ganz gleich, welche Qualifikationen Sie suchen: Hier finden Sie die passenden Talente.",
        "Manage your hiring from start to finish": "Steuern Sie Ihr Recruiting von Anfang bis Ende",
        "Get started with a job post. Move ONN has 20.1M unique monthly users.": "Starten Sie mit einer Stellenanzeige. Move ONN hat monatlich 20,1 Mio. individuelle Nutzer.",
        "Find quality applicants": "Finden Sie qualifizierte Bewerber",
        "Customise your post with screening tools to help narrow down to potential candidates.": "Nutzen Sie Screening-Tools, um Stellenanzeigen zu verfeinern und Top-Kandidaten auszuwählen.",
        "Make connections": "Direkten Kontakt knüpfen",
        "Track, message, invite and interview directly on Move ONN with no extra apps to download.": "Bewerber verfolgen, anschreiben, einladen und interviewen – direkt auf Move ONN ohne Zusatz-Apps.",
        "Hire confidently": "Mit Zuversicht einstellen",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "Sie sind nicht allein beim Recruiting. Wir bieten hilfreiche Ressourcen für jeden Schritt.",
        "You're not alone on your hiring journey. We have helpful resources for every step of the hiring process.": "Sie sind nicht allein beim Recruiting. Wir bieten hilfreiche Ressourcen für jeden Schritt.",
        "Your dashboard features": "Funktionen Ihres Dashboards",
        "Save time and effort in your hiring journey.": "Sparen Sie Zeit und Aufwand beim Recruiting.",
        "Manage your jobs": "Stellen verwalten",
        "View applicants, edit descriptions, adjust budgets, and monitor candidate status in real time.": "Bewerber ansehen, Texte bearbeiten, Budgets anpassen und Status in Echtzeit verfolgen.",
        "Choose who moves forward": "Auswählen, wer weiterkommt",
        "Filter by match score, assessment results, and recruiter notes to shortlist candidates fast.": "Filtern Sie nach Match-Score, Testergebnissen und Notizen für eine schnelle Vorauswahl.",
        "Interview anywhere": "Überall Interviews führen",
        "Conduct 1-click video calls with built-in screener rubrics right inside your browser.": "1-Klick-Videointerviews mit integrierten Bewertungsbögen direkt im Browser starten.",
        "Unlock matched candidates with Move ONN Smart Sourcing": "Finden Sie passende Talente mit Move ONN Smart Sourcing",
        "When you have a job posted and add a Move ONN Smart Sourcing subscription, you immediately start seeing candidates whose CVs on Move ONN fit your job description. When someone stands out, invite them to apply directly.": "Mit einer Stellenanzeige und Move ONN Smart Sourcing sehen Sie sofort passende Lebensläufe. Laden Sie herausragende Kandidaten direkt ein.",
        "Explore Smart Sourcing": "Smart Sourcing entdecken",
        "Employer Help Centre": "Arbeitgeber-Hilfebereich",
        "Employer Resources Library": "Arbeitgeber-Ressourcenbibliothek",
        "Ready to find your next great hire?": "Bereit, Ihren nächsten Spitzenkandidaten einzustellen?",
        "Build your team with India's #1 hiring network": "Bauen Sie Ihr Team mit dem führenden Recruiting-Netzwerk auf",
        "Build your team with India’s #1 hiring network": "Bauen Sie Ihr Team mit dem führenden Recruiting-Netzwerk auf",
        "Post a job in minutes": "Stellenanzeige in Minuten schalten",
        "Frequently asked questions": "Häufig gestellte Fragen",
        "Why is my job here if I did not post it?": "Warum ist meine Stelle hier, obwohl ich sie nicht geschaltet habe?",
        "How do I manage/cancel my post?": "Wie verwalte oder beende ich meine Stellenanzeige?",
        "Does Move ONN remove job postings?": "Entfernt Move ONN Stellenanzeigen?",
        "How is Move ONN different from other places where I can post jobs?": "Wie unterscheidet sich Move ONN von anderen Jobbörsen?",
        "Most posts go live within 24 to 48 hours after a standard review.": "Die meisten Anzeigen gehen nach standardmäßiger Prüfung innerhalb von 24 bis 48 Stunden online.",
        "Move ONN pulls postings from career sites and boards to help jobseekers find all available roles in one place.": "Move ONN bündelt Stellenangebote mehrerer Quellen, damit Bewerber alle Optionen an einem Ort finden.",
        "In your Dashboard, click 'Edit Job' and change the status to 'Paused' or 'Closed.'": "Klicken Sie im Dashboard auf 'Job bearbeiten' und ändern Sie den Status auf 'Pausiert' oder 'Geschlossen'.",
        "Yes. Move ONN reserves the right to remove any job that violates our quality standards.": "Ja. Move ONN behält sich das Recht vor, Angebote zu entfernen, die gegen Qualitätsstandards verstoßen.",
        "Move ONN is both a job search engine and an all-in-one hiring platform.": "Move ONN ist sowohl eine Jobsuchmaschine als auch eine ganzheitliche Recruiting-Plattform.",
        "Find great places to work": "Finden Sie großartige Arbeitgeber",
        "Get access to millions of company reviews": "Erhalten Sie Zugriff auf Millionen Unternehmensbewertungen",
        "Company name or job title": "Unternehmensname oder Jobtitel",
        "Find Companies": "Unternehmen finden",
        "Do you want to search for salaries?": "Möchten Sie nach Gehältern suchen?",
        "Analyze job market salaries": "Gehälter im Arbeitsmarkt analysieren",
        "Top companies in India": "Führende Top-Unternehmen",
        "Popular companies": "Beliebte Unternehmen",
        "Discover your earning potential": "Entdecken Sie Ihr Verdienstpotenzial",
        "Explore high-paying careers, salaries and job openings by industry and location.": "Erkunden Sie gut bezahlte Berufe, Gehälter und offene Stellen nach Branche und Standort.",
        "Browse top-paying jobs by industry": "Bestbezahlte Berufe nach Branche durchsuchen",
        "Choose an industry": "Branche wählen",
        "All Industries": "Alle Branchen",
        "Job openings": "Stellenangebote",
        "Search salaries by job title...": "Gehälter nach Jobtitel suchen...",
        "Search salaries": "Gehälter suchen",
        "Welcome Back": "مرحباً بعودتك",
        "Welcome to Move ONN": "Willkommen bei Move ONN",
        "Sign in to your Move ONN account": "سجّل الدخول إلى حساب Move ONN الخاص بك",
        "Connect with visionary employers and discover top engineering & executive opportunities.": "Vernetzen Sie sich mit führenden Arbeitgebern und entdecken Sie Top-Karrierechancen.",
        "Empowering your high-performance career opportunities and enterprise recruitment workflows.": "تمكين مسارك المهني وحلول التوظيف المؤسسية المتقدمة.",
        "Empowering your high-performance web applications and enterprise workflows with secure technology.": "تمكين تطبيقاتك وحلول التوظيف المؤسسية الآمنة.",
        "Build, scale and innovate with our next-generation digital cloud architecture and tools.": "ابنِ وطوّر مستقبلك مع منصتنا الرقمية المبتكرة للتوظيف.",
        "Continue with Google": "Mit Google fortfahren",
        "Continue with Apple": "Mit Apple fortfahren",
        "Username or Email": "اسم المستخدم أو البريد الإلكتروني",
        "Full name": "Vollständiger Name",
        "Enter your full name": "Vollständigen Namen eingeben",
        "Email Address": "البريد الإلكتروني",
        "Email address": "E-Mail-Adresse",
        "Password": "Passwort",
        "Sign In": "Anmelden",
        "Create Account": "Konto erstellen",
        "Don't have an account?": "ليس لديك حساب؟",
        "Already have an account?": "هل لديك حساب بالفعل؟",
        "Sign Up": "إنشاء حساب جديد",
        "Join the Move ONN community": "انضم إلى مجتمع Move ONN",
        "or with email": "أو بالبريد الإلكتروني",
        "Browse Jobs": "Jobs durchsuchen",
        "Salary Calculator": "Gehaltsrechner",
        "Company Reviews": "Unternehmensbewertungen",
        "Create Candidate Profile": "Kandidatenprofil erstellen",
        "Recruitment Solutions": "Recruiting-Lösungen",
        "Hiring Plans": "Einstellungspläne",
        "Global Hiring": "Globales Recruiting",
        "About Us": "Über uns",
        "International Portals": "Internationale Portale",
        "Trust & Safety": "Sicherheit & Vertrauen",
        "Help Center": "Hilfebereich",
        "Privacy Center": "Datenschutzzentrum",
        "Cookies": "Cookies",
        "Privacy": "Datenschutz",
        "Terms": "Nutzungsbedingungen",
        "All rights reserved.": "Alle Rechte vorbehalten.",
        "© 2026 Move ONN Consultancy Solutions. All rights reserved.": "© 2026 Move ONN Consultancy Solutions. Alle Rechte vorbehalten.",
        "Keep me signed in on this device": "Angemeldet bleiben",
        "Forgot password?": "Passwort vergessen?",
        "By continuing, you agree to Move ONN's": "Mit dem Fortfahren akzeptieren Sie die",
        "Terms of Service": "Nutzungsbedingungen",
        "Privacy Policy": "Datenschutzerklärung",
        "and": "und",
        "20.1M+ Verified Candidate CVs": "Über 20,1 Mio. geprüfte Lebensläufe",
        "Direct Employer Communication": "Direkter Kontakt zu Arbeitgebern",
        "GDPR & ISO-27001 Certified": "DSGVO- & ISO-27001-zertifiziert",
        "Move ONN | Premier Tech & Executive Recruitment Consultancy": "Move ONN | Führende Personalberatung für Technologie- und Führungskräfte",
        "Recommended Jobs - Move ONN Consultancy": "Empfohlene Stellenangebote - Move ONN Personalberatung",
        "Company Reviews & Top Employers - Move ONN Consultancy": "Unternehmensbewertungen & Top-Arbeitgeber - Move ONN Beratung",
        "Salary Guide & Pay Calculator - Move ONN Consultancy": "Gehaltsratgeber & Vergütungsrechner - Move ONN Beratung",
        "Hire Top Talent & Post Jobs - Move ONN Consultancy": "Spitzenkräfte einstellen & Stellen ausschreiben - Move ONN Beratung",
        "Worldwide International Job Portals - Move ONN Consultancy": "Weltweite Internationale Jobportale - Move ONN Beratung",
        "Popular Job Locations": "Beliebte Beschäftigungsorte",
        "Bengaluru (Silicon Valley)": "Bengaluru (Silicon Valley)",
        "Hyderabad (HITEC City)": "Hyderabad (HITEC City)",
        "Pune (Hinjewadi)": "Pune (Hinjewadi)",
        "Delhi / NCR (Noida & Gurugram)": "Delhi / NCR (Noida & Gurugram)",
        "Mumbai & Navi Mumbai": "Mumbai & Navi Mumbai",
        "Chennai (OMR Corridor)": "Chennai (OMR-Korridor)",
        "Kolkata (Salt Lake)": "Kalkutta (Salt Lake)",
        "Chandigarh IT Park": "Chandigarh IT-Park",
        "Patna (Bihar)": "Patna (Bihar)",
        "Patna / Bihar": "Patna / Bihar",
        "Delhi / NCR": "Delhi / NCR",
        "Innovate. Build. Empower. Connecting top engineering and executive talent with visionary enterprises across India and globally.": "Innovieren. Gestalten. Befähigen. Verbindung von Spitzen-Ingenieuren und Führungskräften mit zukunftsorientierten Unternehmen in Indien und weltweit.",
        "India's leading career acceleration and corporate recruitment portal. Empowering candidates and hiring managers with verified opportunities.": "Indiens führendes Karrierebeschleunigungs- und Personalbeschaffungsportal. Stärkung von Bewerbern und Personalverantwortlichen mit geprüften Chancen.",
        "Privacy Centre": "Datenschutzzentrum",
        "Change Country": "Land ändern",
        "Change country (India)": "Land ändern (Indien)",
        "Help Centre": "Hilfecenter",
        "Welcome": "Willkommen",
        "Back!": "zurück!",
        "Join": "Treten Sie",
        "Us Today!": "uns noch heute bei!",
        "name@company.com": "name@unternehmen.de",
        "••••••••": "••••••••",
        "Experience (Any)": "Berufserfahrung (Alle)",
        "Fresher (0 Yrs)": "Berufseinsteiger (0 Jahre)",
        "2+ Yrs": "2+ Jahre",
        "3+ Yrs": "3+ Jahre",
        "5+ Yrs": "5+ Jahre",
        "8+ Yrs": "8+ Jahre",
        "0 - 1 Yrs (Freshers)": "0 - 1 Jahre (Einsteiger)",
        "1 - 3 Yrs": "1 - 3 Jahre",
        "3 - 5 Yrs": "3 - 5 Jahre",
        "All Filters": "Alle Filter",
        "Clear All": "Alles Zurücksetzen",
        "Work Mode": "Arbeitsmodell",
        "Department": "Abteilung",
        "Engineering - Software": "Entwicklung - Software",
        "Data Science & Analytics": "Datenwissenschaft & Analytik",
        "Consulting & Strategy": "Beratung & Strategie",
        "Human Resources": "Personalwesen",
        "Showing": "Anzeige von",
        "recommended jobs based on your profile": "empfohlene Stellen basierend auf Ihrem Profil",
        "Sort by: Relevance": "Sortieren nach: Relevanz",
        "Sort by: Date (Newest)": "Sortieren nach: Datum (Neueste)",
        "Sort by: Salary (High to Low)": "Sortieren nach: Gehalt (Absteigend)",
        "Apply to Senior Full Stack Developer": "Bewerben als Senior Full Stack Entwickler",
        "Apex Consultancy Solutions • Bengaluru": "Apex Consultancy Solutions • Bengaluru",
        "Applicant Profile": "Bewerberprofil",
        "Resume / CV": "Lebenslauf / CV",
        "Attached": "Angehängt",
        "Total Years of Experience": "Gesamte Berufserfahrung in Jahren",
        "Notice Period": "Kündigungsfrist",
        "Immediate Joiner (0 Days)": "Sofort verfügbar (0 Tage)",
        "15 Days": "15 Tage",
        "30 Days": "30 Tage",
        "60 Days": "60 Tage",
        "Submit Application": "Bewerbung Absenden",
        "Job Overview": "Stellenübersicht",
        "Search by skills": "Suche nach Fähigkeiten",
        "Enter location": "Ort eingeben",
        "Search by skills, designation, companies...": "Suche nach Fähigkeiten, Bezeichnung, Unternehmen...",
        "Enter location (e.g. Bengaluru)": "Ort eingeben (z. B. Bengaluru)",
        "Job title": "Berufsbezeichnung",
        "IndusInd Bank": "IndusInd Bank",
        "Salaries": "Gehälter",
        "Questions": "Fragen",
        "Open jobs": "Offene Stellen",
        "Reliance Industries Ltd": "Reliance Industries Ltd",
        "Urban Company": "Urban Company",
        "Adani Group": "Adani-Gruppe",
        "L&T Technology Services Ltd.": "L&T Technology Services Ltd.",
        "Agriculture, Fishing & Forestry": "Landwirtschaft, Fischerei & Forstwirtschaft",
        "Architecture & Engineering": "Architektur & Ingenieurwesen",
        "Business Management, Administrative & Customer Support": "Unternehmensführung, Verwaltung & Kundensupport",
        "Cleaning & Grounds Maintenance": "Reinigung & Außenanlagenpflege",
        "Community & Social Services": "Gemeinde- & Sozialdienste",
        "Construction & Extraction": "Bauwesen & Rohstoffgewinnung",
        "Education & Instruction": "Bildung & Unterricht",
        "Finance & Accounting": "Finanzen & Rechnungswesen",
        "Food & Beverage": "Gastronomie & Lebensmittel",
        "Healthcare": "Gesundheitswesen",
        "Legal": "Recht & Justiz",
        "Manufacturing & Utilities": "Fertigung & Versorgungsbetriebe",
        "Marketing, Advertising & Public Relations": "Marketing, Werbung & Öffentlichkeitsarbeit",
        "Media, Arts & Design": "Medien, Kunst & Design",
        "Personal Service": "Persönliche Dienstleistungen",
        "Repair, Maintenance & Installation": "Reparatur, Wartung & Montage",
        "Safety, Security & Defence Service": "Sicherheit & Verteidigungsdienste",
        "Sales & Retail": "Vertrieb & Einzelhandel",
        "Science & Research": "Wissenschaft & Forschung",
        "Supply Chain & Logistics": "Lieferkette & Logistik",
        "Technology": "Technologie",
        "Transportation": "Transport & Verkehr",
        "Travel, Attractions & Events": "Reisen, Attraktionen & Events",
        "Software Engineer": "Software-Ingenieur",
        "Registered Nurse": "Examinierte Pflegefachkraft",
        "Accountant": "Buchhalter/in",
        "Business Analyst": "Business Analyst",
        "Nursing Assistant": "Pflegeassistent/in",
        "Sales Executive": "Vertriebsbeauftragte/r",
        "Human Resources Specialist": "HR-Spezialist/in",
        "Customer Service Representative": "Kundendienstmitarbeiter/in",
        "Assistant Store Manager": "Stellvertretende/r Filialleiter/in",
        "Elementary School Teacher": "Grundschullehrer/in",
        "Customer Care Specialist": "Kundenbetreuungsspezialist/in",
        "Office Assistant": "Büroassistent/in",
        "Back Office Executive": "Backoffice-Mitarbeiter/in",
        "Data Entry Clerk": "Datenerfasser/in",
        "Graphic Designer": "Grafikdesigner/in",
        "Front Desk Manager": "Empfangsleiter/in",
        "Let’s hire your next great candidate.": "Lassen Sie uns Ihren nächsten Spitzenkandidaten einstellen.",
        "Fast": "Schnell",
        "Get started with a job post. Move ONN has 20.1M unique monthly users to deliver verified applicants.": "Starten Sie mit einer Stellenanzeige. Move ONN verzeichnet monatlich 20,1 Mio. Besucher und liefert geprüfte Bewerber.",
        "Customise your post with screening tools to help narrow down to potential top-tier candidates.": "Passen Sie Ihre Anzeige mit Screening-Tools an, um zielgerichtet die besten Kandidaten herauszufiltern.",
        "98% Match": "98% Übereinstimmung",
        "Senior Full Stack Engineer • Bangalore": "Senior Full Stack Entwickler • Bangalore",
        "95% Match": "95% Übereinstimmung",
        "Lead Product Designer • Remote": "Lead Product Designer • Remote",
        "Hiring resources for every step of the process": "Einstellungsressourcen für jeden Schritt des Prozesses",
        "You’re not alone on your hiring journey. We have helpful resources for every step of the hiring process, including interview guides, competitive market salary reports, and compliance playbooks.": "Sie sind auf Ihrem Einstellungsweg nicht allein. Wir bieten Ihnen Ressourcen für jeden Schritt, einschließlich Leitfäden für Vorstellungsgespräche, Gehaltsreports und Compliance-Leitfäden.",
        "Employer Resource Library": "Arbeitgeber-Ressourcenbibliothek",
        "Ready to find your next hired candidate?": "Bereit, Ihren nächsten Mitarbeiter zu finden?",
        "Create a job post in minutes and tap into India's largest verified talent network of top engineers, executives, and specialists.": "Veröffentlichen Sie ein Stellenangebot in wenigen Minuten und greifen Sie auf Indiens größtes verifiziertes Talentnetzwerk zu.",
        "Frequently Asked Questions": "Häufig gestellte Fragen",
        "How do I create an Move ONN for Employers account for free?": "Wie erstelle ich kostenlos ein Move ONN-Arbeitgeberkonto?",
        "You can register for an employer account in minutes by clicking 'Post a job' or 'Sign in' and choosing Register. Simply enter your company work email, full name, and password to immediately access candidate screening, job management, and messaging.": "Registrieren Sie sich in wenigen Minuten über 'Stelle ausschreiben' oder 'Anmelden' und wählen Sie Registrieren. Geben Sie geschäftliche E-Mail, vollständigen Namen und Passwort ein, um Zugang zu Bewerberscreening und Jobverwaltung zu erhalten.",
        "Does Move ONN integrate with my ATS?": "Lässt sich Move ONN in mein ATS integrieren?",
        "Yes. Move ONN integrates seamlessly with all leading Applicant Tracking Systems (ATS) including Greenhouse, Lever, Workday, BambooHR, and custom webhook solutions to synchronize job postings, applicant statuses, and candidate notes.": "Ja. Move ONN lässt sich nahtlos in alle führenden Bewerber-Tracking-Systeme (ATS) wie Greenhouse, Lever, Workday, BambooHR und Webhooks integrieren.",
        "How can I contact candidates who have not applied to my job?": "Wie kann ich Kandidaten kontaktieren, die sich noch nicht beworben haben?",
        "Use Move ONN Smart Sourcing to search our CV database of over 20 million verified candidates. Filter candidates by exact skills, years of experience, and location, and invite them directly to apply for your vacancies.": "Nutzen Sie Move ONN Smart Sourcing, um unsere Datenbank mit über 20 Millionen geprüften Lebensläufen zu durchsuchen. Filtern Sie nach Qualifikationen, Erfahrung und Ort und laden Sie Bewerber direkt ein.",
        "How does Move ONN help me screen candidates?": "Wie unterstützt mich Move ONN bei der Vorauswahl von Bewerbern?",
        "You can add customized screener questions, required qualifications, and pre-employment assessment tests to your job post to automatically highlight top applicants and filter out non-matching submissions.": "Fügen Sie individuelle Screening-Fragen, Muss-Kriterien und Einstufungstests hinzu, um qualifizierte Kandidaten automatisch hervorzuheben.",
        "Can Move ONN help with high-volume hiring?": "Kann Move ONN bei der Massenrekrutierung unterstützen?",
        "Absolutely. Our enterprise recruitment suite provides bulk candidate imports, automated interview scheduling, collaborative hiring team permissions, and prioritized job syndication across our entire partner network.": "Absolut. Unsere Enterprise-Suite bietet Massenimporte von Kandidaten, automatisierte Terminplanung für Vorstellungsgespräche und priorisierte Verbreitung in unserem Partnernetzwerk.",
        "What are the benefits of a Sponsored Job?": "Welche Vorteile bietet eine gesponserte Stellenanzeige?",
        "Sponsored Jobs receive prime placement in search results and targeted candidate recommendations, delivering up to 4.5x more applications and significantly reducing time-to-hire compared to organic listings.": "Gesponserte Anzeigen erhalten eine Spitzenplatzierung in Suchergebnissen, erzielen bis zu 4,5-mal mehr Bewerbungen und verkürzen die Einstellungszeit spürbar.",
        "Can sponsoring improve time-to-hire?": "Kann Sponsoring die Einstellungszeit verkürzen?",
        "Yes. Sponsored Jobs achieve higher daily impressions and applicant velocity, allowing hiring managers to make quality hires in an average of under 14 business days.": "Ja. Gesponserte Jobs erzielen höhere tägliche Aufrufe und Bewerbungsraten, sodass Personalverantwortliche in durchschnittlich unter 14 Werktagen einstellen.",
        "How can I improve visibility?": "Wie kann ich die Sichtbarkeit meiner Anzeige verbessern?",
        "Craft a clear, descriptive job title, provide transparent salary expectations, specify detailed requirements, and sponsor your post to ensure it remains prominently displayed to matching jobseekers.": "Wählen Sie eine klare Berufsbezeichnung, nennen Sie transparente Gehaltsspannen, beschreiben Sie Anforderungen präzise und sponsern Sie die Anzeige für maximale Reichweite.",
        "How do I attract top talent?": "Wie ziehe ich Spitzenkräfte an?",
        "Highlight your company culture, competitive perks, flexible remote policies, and verified company reviews on your Move ONN Company Profile to stand out to passive senior talent.": "Heben Sie Unternehmenskultur, attraktive Benefits, flexible Homeoffice-Regelungen und geprüfte Bewertungen auf Ihrem Move ONN-Profil hervor, um Fachkräfte zu gewinnen.",
        "How can Move ONN help with Employer Branding?": "Wie unterstützt Move ONN das Employer Branding?",
        "A verified Move ONN Company Page allows you to showcase office photos, CEO ratings, employee testimonials, company updates, and your open roles to over 20 million career-focused professionals.": "Mit einem verifizierten Unternehmensprofil präsentieren Sie Büro-Impressionen, CEO-Bewertungen, Mitarbeiter-Feedbacks und Vakanzen vor über 20 Millionen Fachkräften.",
        "How much does it cost to sponsor?": "Was kostet das Sponsoring einer Stellenanzeige?",
        "Move ONN offers flexible performance-based hiring budgets. You set a daily or monthly budget that fits your hiring needs, and you only pay when interested candidates engage with your job post.": "Move ONN bietet flexible, leistungsorientierte Budgets. Sie legen ein Tages- oder Monatsbudget nach Bedarf fest und zahlen nur bei tatsächlichen Interaktionen interessierter Bewerber.",
        "Can I post without listing the salary?": "Kann ich eine Anzeige ohne Gehaltsangabe schalten?",
        "Yes, listing salary is optional. However, postings with transparent salary ranges receive on average 35% more verified candidate applications and faster candidate responses.": "Ja, Gehaltsangaben sind optional. Anzeigen mit transparentem Gehaltsrahmen verzeichnen jedoch durchschnittlich 35% mehr Bewerbungen und schnellere Rückmeldungen.",
        "How long until my job is visible?": "Wie lange dauert es, bis meine Anzeige online ist?",
        "Most posts go live within 24 to 48 hours after a standard quality and compliance review.": "Die meisten Anzeigen werden nach einer standardmäßigen Qualitäts- und Compliance-Prüfung innerhalb von 24 bis 48 Stunden live geschaltet.",
        "Move ONN is both a job search engine and an all-in-one hiring platform. Beyond jobs posted directly by employers, Move ONN also aggregates job listings from thousands of sources across the internet. Employers gain access to features like virtual interviews and 'Hiring Insights'.": "Move ONN ist Suchmaschine und ganzheitliche Einstellungsplattform zugleich. Neben Direktausschreibungen aggregiert Move ONN tausende Online-Quellen mit Video-Interviews und Analysen.",
        "Country and language": "Land und Sprache",
        "Search countries and languages": "Länder und Sprachen suchen",
        "Search countries or languages": "Länder oder Sprachen suchen",
        "United Arab Emirates (Arabic)": "Vereinigte Arabische Emirate (Arabisch)",
        "United Arab Emirates (English)": "Vereinigte Arabische Emirate (Englisch)",
        "Argentina (español)": "Argentinien (español)",
        "Argentina (Spanish)": "Argentinien (Spanisch)",
        "Austria (German)": "Österreich (Deutsch)",
        "Australia (English)": "Australien (Englisch)",
        "Belgium (German)": "Belgien (Deutsch)",
        "Belgium (English)": "Belgien (Englisch)",
        "Belgium (French)": "Belgien (Französisch)",
        "Belgium (Dutch)": "Belgien (Niederländisch)",
        "Bahrain (Arabic)": "Bahrain (Arabisch)",
        "Bahrain (English)": "Bahrain (Englisch)",
        "Brazil (Portuguese)": "Brasilien (Portugiesisch)",
        "Canada (English)": "Kanada (Englisch)",
        "Canada (français)": "Kanada (français)",
        "Canada (French)": "Kanada (Französisch)",
        "Switzerland (German)": "Schweiz (Deutsch)",
        "Switzerland (English)": "Schweiz (Englisch)",
        "Switzerland (French)": "Schweiz (Französisch)",
        "Switzerland (Italian)": "Schweiz (Italienisch)",
        "Chile (español)": "Chile (español)",
        "Chile (Spanish)": "Chile (Spanisch)",
        "China (Chinese)": "China (Chinesisch)",
        "Colombia (español)": "Kolumbien (español)",
        "Colombia (Spanish)": "Kolumbien (Spanisch)",
        "Costa Rica (español)": "Costa Rica (español)",
        "Costa Rica (Spanish)": "Costa Rica (Spanisch)",
        "Czechia (Czech)": "Tschechien (Tschechisch)",
        "Germany (German)": "Deutschland (Deutsch)",
        "Germany (Ukrainian)": "Deutschland (Ukrainisch)",
        "Denmark (Danish)": "Dänemark (Dänisch)",
        "Ecuador (español)": "Ecuador (español)",
        "Ecuador (Spanish)": "Ecuador (Spanisch)",
        "Egypt (Arabic)": "Ägypten (Arabisch)",
        "Egypt (English)": "Ägypten (Englisch)",
        "Spain (Spanish)": "Spanien (Spanisch)",
        "Finland (Finnish)": "Finnland (Finnisch)",
        "Finland (svenska)": "Finnland (svenska)",
        "Finland (Swedish)": "Finnland (Schwedisch)",
        "France (français)": "Frankreich (français)",
        "France (French)": "Frankreich (Französisch)",
        "United Kingdom (English)": "Vereinigtes Königreich (Englisch)",
        "Greece (Greek)": "Griechenland (Griechisch)",
        "Hong Kong SAR China (English)": "Hongkong (Englisch)",
        "Hong Kong SAR China (Chinese)": "Hongkong (Chinesisch)",
        "Hungary (Hungarian)": "Ungarn (Ungarisch)",
        "Indonesia (English)": "Indonesien (Englisch)",
        "Indonesia (Indonesia)": "Indonesien (Indonesia)",
        "Indonesia (Indonesian)": "Indonesien (Indonesisch)",
        "Ireland (English)": "Irland (Englisch)",
        "Israel (Hebrew)": "Israel (Hebräisch)",
        "India (English)": "Indien (Englisch)",
        "India (Hindi)": "Indien (Hindi)",
        "Italy (Italian)": "Italien (Italienisch)",
        "Japan (Japanese)": "Japan (Japanisch)",
        "South Korea (Korean)": "Südkorea (Koreanisch)",
        "Kuwait (Arabic)": "Kuwait (Arabisch)",
        "Kuwait (English)": "Kuwait (Englisch)",
        "Luxembourg (German)": "Luxemburg (Deutsch)",
        "Luxembourg (English)": "Luxemburg (Englisch)",
        "Luxembourg (français)": "Luxemburg (français)",
        "Luxembourg (French)": "Luxemburg (Französisch)",
        "Morocco (Arabic)": "Marokko (Arabisch)",
        "Morocco (French)": "Marokko (Französisch)",
        "Mexico (Spanish)": "Mexiko (Spanisch)",
        "Malaysia (English)": "Malaysia (Englisch)",
        "Nigeria (English)": "Nigeria (Englisch)",
        "Netherlands (Dutch)": "Niederlande (Niederländisch)",
        "Norway (Norwegian)": "Norwegen (Norwegisch)",
        "New Zealand (English)": "Neuseeland (Englisch)",
        "Oman (Arabic)": "Oman (Arabisch)",
        "Oman (English)": "Oman (Englisch)",
        "Panama (Spanish)": "Panama (Spanisch)",
        "Peru (Spanish)": "Peru (Spanisch)",
        "Philippines (English)": "Philippinen (Englisch)",
        "Pakistan (English)": "Pakistan (Englisch)",
        "Poland (Polish)": "Polen (Polnisch)",
        "Poland (Ukrainian)": "Polen (Ukrainisch)",
        "Portugal (português)": "Portugal (português)",
        "Portugal (Portuguese)": "Portugal (Portugiesisch)",
        "Qatar (Arabic)": "Katar (Arabisch)",
        "Qatar (English)": "Katar (Englisch)",
        "Romania (Romanian)": "Rumänien (Rumänisch)",
        "Russia (Russian)": "Russland (Russisch)",
        "Saudi Arabia (Arabic)": "Saudi-Arabien (Arabisch)",
        "Saudi Arabia (English)": "Saudi-Arabien (Englisch)",
        "Sweden (Swedish)": "Schweden (Schwedisch)",
        "Singapore (English)": "Singapur (Englisch)",
        "Singapore (Chinese)": "Singapur (Chinesisch)",
        "Thailand (English)": "Thailand (Englisch)",
        "Thailand (Thai)": "Thailand (Thailändisch)",
        "Türkiye (Türkçe)": "Türkei (Türkçe)",
        "Türkiye (Turkish)": "Türkei (Türkisch)",
        "Taiwan (Chinese)": "Taiwan (Chinesisch)",
        "Ukraine (Russian)": "Ukraine (Russisch)",
        "Ukraine (Ukrainian)": "Ukraine (Ukrainisch)",
        "United States (English)": "Vereinigte Staaten (Englisch)",
        "United States (Spanish)": "Vereinigte Staaten (Spanisch)",
        "Uruguay (español)": "Uruguay (español)",
        "Uruguay (Spanish)": "Uruguay (Spanisch)",
        "Venezuela (español)": "Venezuela (español)",
        "Venezuela (Spanish)": "Venezuela (Spanisch)",
        "Vietnam (English)": "Vietnam (Englisch)",
        "Vietnam (Vietnamese)": "Vietnam (Vietnamesisch)",
        "South Africa (English)": "Südafrika (Englisch)",
        "Top Matches": "Top-Treffer",
        "Experience": "Berufserfahrung",
        "Location": "Standort",
        "Bengaluru": "Bengaluru",
        "Design Systems": "Designsysteme",
        "User Research": "Nutzerforschung",
        "Apex Consultancy Solutions": "Apex Consultancy Solutions",
        "Tata Consultancy Services (TCS)": "Tata Consultancy Services (TCS)",
        "Infosys Technologies": "Infosys Technologies",
        "Wipro Enterprises": "Wipro Enterprises",
        "Google India": "Google Indien",
        "Microsoft India": "Microsoft Indien",
        "Amazon Development Centre": "Amazon Entwicklungszentrum",
        "Cognizant Technology": "Cognizant Technology",
        "HCL Technologies": "HCL Technologies",
        "Tech Mahindra": "Tech Mahindra",
        "Company Email": "Geschäftliche E-Mail",
        "Full Name": "Vollständiger Name"
    }
};

  function getStoredCountry() {
    return {
      code: localStorage.getItem('jt_country') || 'IN',
      lang: localStorage.getItem('jt_lang') || 'en',
      flag: localStorage.getItem('jt_flag') || 'assets/flags/in.svg',
      name: localStorage.getItem('jt_country_name') || 'India (English)'
    };
  }

  function renderCountrySelector() {
    const pref = getStoredCountry();

    // 1. Update Navbar Country action
    const countryLinks = document.querySelectorAll('.jt-action-country');
    countryLinks.forEach(link => {
      const flagSpan = link.querySelector('.jt-flag');
      const langSpan = link.querySelector('.jt-lang');
      if (flagSpan) {
        flagSpan.innerHTML = `<img src="${pref.flag}" alt="${pref.code}" class="jt-nav-flag-img">`;
      }
      if (langSpan) {
        langSpan.textContent = pref.lang.toUpperCase();
      }
    });

    // 2. Update Drawer Country link
    const drawerLinks = document.querySelectorAll('.jt-drawer-link');
    drawerLinks.forEach(link => {
      if (link.getAttribute('href') === 'countries.html') {
        const span = link.querySelector('span');
        if (span) {
          span.innerHTML = `Change country: ${pref.name} <img src="${pref.flag}" alt="${pref.code}" class="jt-nav-flag-img" style="margin-left:6px;">`;
        }
      }
    });

    // 3. Apply translations across entire document
    applyTranslations(pref.lang);
  }

  function applyTranslations(lang) {
    if (!lang) return;
    const isEn = (lang === 'en');
    const dict = isEn ? null : (I18N_DICTIONARY[lang] || null);

    // 1. Set document language (Maintain clean LTR layout so page structure never inverts)
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', 'ltr');
    document.body.classList.remove('jt-rtl');

    // 2. Universal Text Nodes Walker across document.body
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'SVG' || tag === 'PATH' || tag === 'CODE') {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('.notranslate') || parent.closest('.jt-brand') || parent.closest('.jt-nav-flag-img')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest('a[href="countries.html"]') && parent.classList.contains('jt-lang')) {
            return NodeFilter.FILTER_REJECT;
          }
          if (node.nodeValue.trim().length === 0) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      const raw = node.nodeValue;
      const trimmed = raw.trim();
      if (!trimmed) return;

      if (!node._origText) {
        node._origText = trimmed;
        node._origRaw = raw;
      }
      const orig = node._origText;

      if (isEn) {
        if (node._origRaw) {
          node.nodeValue = node._origRaw;
        }
      } else if (dict) {
        // Direct exact match
        if (dict[orig]) {
          node.nodeValue = raw.replace(orig, dict[orig]);
          return;
        }

        // Substring pattern: e.g. "₹14,00,000 - ₹22,00,000 a year"
        if (orig.includes('a year') && dict['a year']) {
          node.nodeValue = raw.replace('a year', dict['a year']);
          return;
        }
        if (orig.includes('per year') && dict['per year']) {
          node.nodeValue = raw.replace('per year', dict['per year']);
          return;
        }
        if (orig.includes('Jobs') && dict['Jobs']) {
          node.nodeValue = raw.replace('Jobs', dict['Jobs']);
          return;
        }
        if (orig.includes('reviews') && dict['reviews']) {
          node.nodeValue = raw.replace('reviews', dict['reviews']);
          return;
        }

        // Case-insensitive lookup
        const lowerKey = orig.toLowerCase();
        for (const k in dict) {
          if (k.toLowerCase() === lowerKey) {
            node.nodeValue = raw.replace(orig, dict[k]);
            return;
          }
        }
      }
    });

    // 3. Elements with single text child or textContent
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th');
    textElements.forEach(el => {
      if (el.closest('.notranslate') || el.closest('.jt-brand') || el.closest('.jt-nav-flag-img')) return;
      if (el.closest('a[href="countries.html"]') && el.classList.contains('jt-lang')) return;
      if (el.childElementCount > 0) return;

      const text = el.textContent.trim();
      if (!text) return;

      if (!el.dataset.i18nOrig) {
        el.dataset.i18nOrig = text;
      }
      const orig = el.dataset.i18nOrig;

      if (isEn) {
        if (el.dataset.i18nOrig) el.textContent = el.dataset.i18nOrig;
      } else if (dict) {
        if (dict[orig]) {
          el.textContent = dict[orig];
        } else if (orig.includes('a year') && dict['a year']) {
          el.textContent = orig.replace('a year', dict['a year']);
        }
      }
    });

    // 4. Input and Textarea Placeholders
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(inp => {
      const ph = inp.getAttribute('placeholder');
      if (!ph) return;
      const trimmed = ph.trim();
      if (!trimmed) return;
      if (!inp._origPh) inp._origPh = trimmed;
      const orig = inp._origPh;

      if (isEn) {
        inp.setAttribute('placeholder', orig);
      } else if (dict) {
        if (dict[orig]) {
          inp.setAttribute('placeholder', dict[orig]);
        } else {
          // Check stripped quotes e.g. City, state, or 'remote'
          const stripped = orig.replace(/['"]/g, '');
          for (const k in dict) {
            if (k.replace(/['"]/g, '') === stripped) {
              inp.setAttribute('placeholder', dict[k]);
              break;
            }
          }
        }
      }
    });

    // 5. Input values (e.g. "Patna, Bihar")
    document.querySelectorAll('input[type="text"]').forEach(inp => {
      if (!inp.value) return;
      const val = inp.value.trim();
      if (!inp._origVal) inp._origVal = val;
      const orig = inp._origVal;

      if (isEn) {
        inp.value = orig;
      } else if (dict && dict[orig]) {
        inp.value = dict[orig];
      }
    });

    // 6. Input button / submit values
    document.querySelectorAll('input[type="button"], input[type="submit"]').forEach(btn => {
      const val = btn.value.trim();
      if (!btn._origVal) btn._origVal = val;
      const orig = btn._origVal;

      if (isEn) {
        btn.value = orig;
      } else if (dict && dict[orig]) {
        btn.value = dict[orig];
      }
    });
  }

  // Debounced DOM Observer for auto-translating dynamically rendered content
  let i18nObserverTimeout;
  function initDynamicI18nObserver() {
    const observer = new MutationObserver(() => {
      clearTimeout(i18nObserverTimeout);
      i18nObserverTimeout = setTimeout(() => {
        const currentLang = localStorage.getItem('jt_lang') || 'en';
        if (currentLang !== 'en') {
          applyTranslations(currentLang);
        }
      }, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- Initialization on DOM Ready or Immediate ---
  function initCommonApp() {
    initGlobalListeners();
    initPasswordToggles();
    initDynamicI18nObserver();
    renderNavbarAuthState();
    renderCountrySelector();

    // Sticky Header Scroll Shadow
    function handleHeaderScroll() {
      const header = document.querySelector('.jt-header');
      if (header) {
        if (window.scrollY > 8) {
          header.classList.add('jt-header-scrolled');
        } else {
          header.classList.remove('jt-header-scrolled');
        }
      }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // Auto-open auth modal if URL param exists (?auth=signin or ?auth=signup)
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth')) {
      openAuthModal(params.get('auth'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommonApp);
  } else {
    initCommonApp();
  }

  // Global Exports for inline trigger safety
  window.openMobileDrawer = openMobileDrawer;
  window.closeMobileDrawer = closeMobileDrawer;
  window.handleLoginFormSubmit = handleLoginFormSubmit;
  window.handleRegFormSubmit = handleRegFormSubmit;
  window.handleGoogleLogin = handleGoogleLogin;
  window.handleAppleLogin = handleAppleLogin;
  window.openAuthModal = openAuthModal;
  window.closeAuthModal = closeAuthModal;
  window.switchAuthTab = switchAuthTab;
  window.handleAvatarClick = handleAvatarClick;
  window.performSignOut = performSignOut;
  window.signOutUser = performSignOut;
  window.toggleUserDropdown = toggleUserDropdown;
  window.showToast = showToast;
  window.renderCountrySelector = renderCountrySelector;
  window.applyTranslations = applyTranslations;
  window.getStoredUser = getStoredUser;
  window.renderNavbarAuthState = renderNavbarAuthState;
  window.getAccountStorage = getAccountStorage;
  window.setAccountStorage = setAccountStorage;
  window.removeAccountStorage = removeAccountStorage;
  window.lockBodyScroll = lockBodyScroll;
  window.unlockBodyScroll = unlockBodyScroll;
})();
