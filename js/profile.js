/* ==========================================================================
   Move ONN Candidate Profile Dashboard Controller (js/profile.js)
   Complies with PROJECT_STANDARDS.md - Pure Modular Architecture
   Manages Photo Cropping Modal (1:1 Ratio), Edit Profile Sync,
   Hero Plan Badges, Tabbed Section Switching & Persistence
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProfileData();
  initPhotoCropModal();
  initSkillsManagement();
  initResumeManagement();
  initVisibilityToggle();
  initPlansModal();
  initEditProfileModal();
  initQuickNavTabs();
  initCandidateChatAndJobs();
});

// 1. Initialize Profile State from LocalStorage, Session & DOM
function initProfileData() {
  // Enforce authentication guard: unauthenticated users redirect to index.html
  let loggedInUser = null;
  if (typeof window.getStoredUser === 'function') {
    loggedInUser = window.getStoredUser();
  } else {
    try {
      const raw = localStorage.getItem('moveonn_user') || null;
      if (raw) loggedInUser = JSON.parse(raw);
    } catch (e) {}
  }

  if (!loggedInUser) {
    window.location.replace('index.html');
    return;
  }

  const email = (loggedInUser.email || '').toLowerCase().trim();
  const isAlex = email.includes('alex');
  const isSarah = email.includes('sarah');
  const defaultName = (loggedInUser.name && loggedInUser.name !== 'Candidate')
    ? loggedInUser.name
    : (isSarah ? 'Sarah Connor' : (isAlex ? 'Alex Mercer' : 'Candidate Profile'));
  const defaultEmail = loggedInUser.email || (isSarah ? 'sarah.connor@icloud.com' : 'alex.mercer@gmail.com');
  const defaultRole = isSarah
    ? 'Principal Cloud Security & DevOps Architect'
    : (isAlex ? 'Lead Full-Stack Cloud Engineer & Architect' : 'Senior Cloud Solutions Engineer');
  const defaultResume = isSarah
    ? 'Sarah_Connor_Principal_Cloud_Resume.pdf'
    : (isAlex ? 'Alex_Mercer_Senior_FullStack_Resume.pdf' : `${(loggedInUser.name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`);
  const defaultExp = isSarah ? '8+ Years Experience' : '6+ Years Experience';
  const defaultCtc = isSarah ? '28 LPA Current CTC' : '24 LPA Current CTC';
  const defaultPhone = isSarah ? '+91 98765 43211' : '+91 98765 43210';
  const defaultSummary = isSarah
    ? 'Accomplished Principal Cloud Security & DevOps Architect with 8+ years leading enterprise cloud infrastructure, Kubernetes security postures, zero-trust network access, and CI/CD automation pipelines. Certified AWS Security Specialist and CKA with a proven record of zero-downtime microservice migrations and 40% reduction in cloud attack surfaces.'
    : 'Results-driven Senior Full Stack Engineer with over 6 years of expertise in architecting high-scale distributed systems, enterprise cloud architectures (AWS / GCP), and modern frontend applications using React, Next.js, and TypeScript. Proven track record leading engineering squads, optimizing mission-critical database queries, and reducing cloud infrastructure costs by 35% through containerization and serverless patterns.';

  const getScoped = (key, fallback) => {
    if (typeof window.getAccountStorage === 'function') {
      return window.getAccountStorage(key, fallback, email);
    }
    if (email) {
      const v = localStorage.getItem(`${key}__${email}`);
      if (v !== null && v !== undefined) return v;
    }
    return (fallback !== undefined) ? fallback : null;
  };

  const userName = getScoped('moveonn_user_name') || defaultName;
  const userEmail = getScoped('jt_user_email', defaultEmail);
  const userRole = getScoped('jt_user_role', defaultRole);
  const userLocation = getScoped('jt_user_location', 'Bengaluru, India (Open to Remote)');
  const userExp = getScoped('jt_user_exp', defaultExp);
  const userCtc = getScoped('jt_user_ctc', defaultCtc);
  const userPhone = getScoped('jt_user_phone', defaultPhone);
  const userNotice = getScoped('jt_user_notice', '15 Days or less');
  const uploadedResume = getScoped('jt_uploaded_resume', defaultResume);
  const userSummary = getScoped('jt_user_summary', defaultSummary);
  const customAvatarImg = (function() {
    const rawImg = getScoped('jt_user_avatar_img', null);
    if (rawImg && typeof rawImg === 'string' && (rawImg.startsWith('data:image/') || rawImg.startsWith('http') || rawImg.startsWith('assets/'))) {
      return rawImg;
    }
    return null;
  })();

  const nameEl = document.getElementById('jtProfName');
  const roleEl = document.getElementById('jtProfRole');
  const locEl = document.getElementById('jtProfLocationText');
  const expEl = document.getElementById('jtProfExpText');
  const ctcEl = document.getElementById('jtProfCtcText');
  const phoneEl = document.getElementById('jtProfPhoneText');
  const emailEl = document.getElementById('jtProfEmailText');
  const noticeEl = document.getElementById('jtPrefNotice');
  const avatarEl = document.getElementById('jtProfAvatar');
  const hoverTextEl = document.getElementById('jtProfAvatarHoverText');
  const resumeEl = document.getElementById('jtCurrentResumeName');
  const summaryEl = document.getElementById('jtProfSummaryText');

  if (nameEl) nameEl.textContent = userName;
  if (roleEl) roleEl.textContent = userRole;
  if (locEl) locEl.textContent = userLocation;
  if (expEl) expEl.textContent = userExp;
  if (ctcEl) ctcEl.textContent = (userCtc || '').replace(/^[₹$\s]+/, '').trim();
  if (phoneEl) phoneEl.textContent = userPhone;
  if (emailEl) emailEl.textContent = userEmail;
  if (noticeEl) {
    noticeEl.textContent = (userNotice.includes('Notice') || userNotice.includes('Joiner'))
      ? userNotice
      : `Immediate Joiner (${userNotice})`;
  }
  if (resumeEl) {
    resumeEl.textContent = (!uploadedResume || uploadedResume === 'none') ? 'No resume uploaded' : uploadedResume;
  }
  if (summaryEl) summaryEl.textContent = userSummary;

  // Set avatar & hover tooltip
  if (avatarEl) {
    if (customAvatarImg) {
      avatarEl.innerHTML = `<img src="${customAvatarImg}" alt="Profile Photo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
    } else {
      avatarEl.innerHTML = `
        <svg class="jt-prof-silhouette" viewBox="0 0 24 24" fill="#94a3b8" width="58" height="58">
          <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
        </svg>
      `;
    }
  }

  if (hoverTextEl) {
    hoverTextEl.textContent = customAvatarImg ? 'Change photo' : 'Add photo';
  }

  updateProfileStrength();
  renderPlansState();
  if (typeof updateSidebarSkillsCount === 'function') {
    updateSidebarSkillsCount();
  }
}

// 2. Photo Upload & 1:1 Aspect Ratio Cropping Modal (Move ONN)
function initAvatarUpload() {
  initPhotoCropModal();
}

function initPhotoCropModal() {
  const modal = document.getElementById('jtPhotoModal');
  const avatarWrap = document.getElementById('jtProfAvatarWrap');
  const closeBtn = document.getElementById('jtPhotoModalClose');
  const stepSelect = document.getElementById('jtPhotoStepSelect');
  const stepAdjust = document.getElementById('jtPhotoStepAdjust');
  const existingBox = document.getElementById('jtExistingPhotoBox');
  const noPhotoBox = document.getElementById('jtNoPhotoBox');
  const existingPreview = document.getElementById('jtExistingPhotoPreview');
  const triggerUploadBtn = document.getElementById('jtTriggerUploadBtn');
  const replacePhotoBtn = document.getElementById('jtReplacePhotoBtn');
  const deletePhotoBtn = document.getElementById('jtDeletePhotoBtn');
  const cropChangePhotoBtn = document.getElementById('jtCropChangePhotoBtn');
  const fileInput = document.getElementById('jtPhotoCropFileInput');
  const sourceImg = document.getElementById('jtCropSourceImg');
  const cropBox = document.getElementById('jtCropBox');
  const previewCanvas = document.getElementById('jtCropPreviewCanvas');
  const savePhotoBtn = document.getElementById('jtSavePhotoBtn');
  const stage = document.getElementById('jtCropStageContainer');
  const avatarEl = document.getElementById('jtProfAvatar');
  const hoverTextEl = document.getElementById('jtProfAvatarHoverText');

  if (!modal || !avatarWrap) return;

  function openPhotoModal() {
    const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
    const email = user ? (user.email || '').toLowerCase().trim() : '';
    const currentImg = (typeof window.getAccountStorage === 'function')
      ? window.getAccountStorage('jt_user_avatar_img', (user ? user.avatar : null), email)
      : localStorage.getItem('jt_user_avatar_img');

    if (currentImg) {
      if (existingPreview) {
        existingPreview.innerHTML = `<img src="${currentImg}" alt="Current Photo">`;
      }
      if (existingBox) existingBox.style.display = 'flex';
      if (noPhotoBox) noPhotoBox.style.display = 'none';
    } else {
      if (existingBox) existingBox.style.display = 'none';
      if (noPhotoBox) noPhotoBox.style.display = 'block';
    }

    if (stepSelect) stepSelect.style.display = 'block';
    if (stepAdjust) stepAdjust.style.display = 'none';

    modal.classList.add('open');
    if (typeof window.lockBodyScroll === 'function') {
      window.lockBodyScroll();
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  function closePhotoModal() {
    modal.classList.remove('open');
    if (typeof window.unlockBodyScroll === 'function') {
      window.unlockBodyScroll();
    } else {
      document.body.style.overflow = '';
    }
    if (fileInput) fileInput.value = '';
  }

  avatarWrap.addEventListener('click', (e) => {
    e.preventDefault();
    openPhotoModal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closePhotoModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePhotoModal();
  });

  // Upload triggers
  if (triggerUploadBtn) {
    triggerUploadBtn.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });
  }
  if (replacePhotoBtn) {
    replacePhotoBtn.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });
  }
  if (cropChangePhotoBtn) {
    cropChangePhotoBtn.addEventListener('click', () => {
      if (fileInput) fileInput.click();
    });
  }

  // Delete existing photo
  if (deletePhotoBtn) {
    deletePhotoBtn.addEventListener('click', () => {
      const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
      const email = user ? (user.email || '').toLowerCase().trim() : '';

      if (typeof window.removeAccountStorage === 'function') {
        window.removeAccountStorage('jt_user_avatar_img', email);
      }
      localStorage.removeItem('jt_user_avatar_img');
      if (email) {
        localStorage.removeItem('jt_user_avatar_img__' + email.replace(/[^a-z0-9]/g, '_'));
        localStorage.removeItem('jt_user_avatar_img__' + email);
      }

      if (avatarEl) {
        avatarEl.innerHTML = `
          <svg class="jt-prof-silhouette" viewBox="0 0 24 24" fill="#94a3b8" width="58" height="58">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
          </svg>
        `;
      }
      if (hoverTextEl) hoverTextEl.textContent = 'Add photo';
      if (window.renderNavbarAuthState) window.renderNavbarAuthState();
      closePhotoModal();
      if (window.showToast) window.showToast('Profile photo removed.');
    });
  }

  // Cropping State Engine
  let cropState = {
    x: 0,
    y: 0,
    size: 160,
    isDragging: false,
    isResizing: false,
    activeHandle: null,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    startSize: 160,
    imgLeft: 0,
    imgTop: 0,
    imgWidth: 0,
    imgHeight: 0
  };

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        if (window.showToast) window.showToast('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        if (window.showToast) window.showToast('Image file size must be under 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        sourceImg.onload = function() {
          if (stepSelect) stepSelect.style.display = 'none';
          if (stepAdjust) stepAdjust.style.display = 'block';

          // Compute stage layout after image render
          setTimeout(initCropGeometry, 50);
        };
        sourceImg.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function initCropGeometry() {
    if (!stage || !sourceImg || !cropBox) return;

    const stageRect = stage.getBoundingClientRect();
    const imgRect = sourceImg.getBoundingClientRect();

    cropState.imgLeft = imgRect.left - stageRect.left;
    cropState.imgTop = imgRect.top - stageRect.top;
    cropState.imgWidth = imgRect.width;
    cropState.imgHeight = imgRect.height;

    // Strict 1:1 Aspect ratio square
    const minDim = Math.min(cropState.imgWidth, cropState.imgHeight);
    cropState.size = Math.min(180, Math.floor(minDim * 0.85));
    cropState.x = cropState.imgLeft + Math.floor((cropState.imgWidth - cropState.size) / 2);
    cropState.y = cropState.imgTop + Math.floor((cropState.imgHeight - cropState.size) / 2);

    updateCropBoxDOM();
    drawCropPreview();
  }

  function updateCropBoxDOM() {
    if (!cropBox) return;
    cropBox.style.width = `${cropState.size}px`;
    cropBox.style.height = `${cropState.size}px`;
    cropBox.style.left = `${cropState.x}px`;
    cropBox.style.top = `${cropState.y}px`;
  }

  function drawCropPreview() {
    if (!previewCanvas || !sourceImg) return;
    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    const natW = sourceImg.naturalWidth;
    const natH = sourceImg.naturalHeight;
    const dispW = cropState.imgWidth;
    const dispH = cropState.imgHeight;
    if (!dispW || !dispH) return;

    const scaleX = natW / dispW;
    const scaleY = natH / dispH;

    const relX = (cropState.x - cropState.imgLeft) * scaleX;
    const relY = (cropState.y - cropState.imgTop) * scaleY;
    const relSize = cropState.size * scaleX;

    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.save();
    // Circular mask preview
    ctx.beginPath();
    ctx.arc(previewCanvas.width / 2, previewCanvas.height / 2, previewCanvas.width / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      sourceImg,
      relX, relY, relSize, relSize,
      0, 0, previewCanvas.width, previewCanvas.height
    );
    ctx.restore();
  }

  // Pointer drag on Crop Box
  if (cropBox) {
    cropBox.addEventListener('pointerdown', (e) => {
      if (e.target.classList.contains('jt-crop-handle')) {
        // Resize handle event
        cropState.isResizing = true;
        cropState.activeHandle = e.target.getAttribute('data-handle');
        cropState.startX = e.clientX;
        cropState.startY = e.clientY;
        cropState.startLeft = cropState.x;
        cropState.startTop = cropState.y;
        cropState.startSize = cropState.size;
        e.stopPropagation();
      } else {
        // Box drag event
        cropState.isDragging = true;
        cropState.startX = e.clientX;
        cropState.startY = e.clientY;
        cropState.startLeft = cropState.x;
        cropState.startTop = cropState.y;
      }
      cropBox.setPointerCapture(e.pointerId);
    });

    cropBox.addEventListener('pointermove', (e) => {
      if (cropState.isDragging) {
        const dx = e.clientX - cropState.startX;
        const dy = e.clientY - cropState.startY;

        let newX = cropState.startLeft + dx;
        let newY = cropState.startTop + dy;

        // Strict boundary clamp
        const minX = cropState.imgLeft;
        const maxX = cropState.imgLeft + cropState.imgWidth - cropState.size;
        const minY = cropState.imgTop;
        const maxY = cropState.imgTop + cropState.imgHeight - cropState.size;

        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));

        cropState.x = newX;
        cropState.y = newY;
        updateCropBoxDOM();
        drawCropPreview();
      } else if (cropState.isResizing) {
        const handle = cropState.activeHandle;
        const dx = e.clientX - cropState.startX;
        const dy = e.clientY - cropState.startY;

        // Use largest delta while preserving 1:1 square ratio
        let delta = (Math.abs(dx) > Math.abs(dy)) ? dx : dy;
        let newSize = cropState.startSize;
        let newX = cropState.startLeft;
        let newY = cropState.startTop;

        if (handle === 'br') {
          newSize = Math.max(60, cropState.startSize + delta);
        } else if (handle === 'tl') {
          delta = -delta;
          newSize = Math.max(60, cropState.startSize + delta);
          newX = cropState.startLeft - (newSize - cropState.startSize);
          newY = cropState.startTop - (newSize - cropState.startSize);
        } else if (handle === 'tr') {
          newSize = Math.max(60, cropState.startSize + dx);
          newY = cropState.startTop - (newSize - cropState.startSize);
        } else if (handle === 'bl') {
          newSize = Math.max(60, cropState.startSize - dx);
          newX = cropState.startLeft - (newSize - cropState.startSize);
        }

        // Clamp to image dimensions
        const maxAllowedSize = Math.min(cropState.imgWidth, cropState.imgHeight);
        newSize = Math.min(newSize, maxAllowedSize);

        if (newX < cropState.imgLeft) newX = cropState.imgLeft;
        if (newY < cropState.imgTop) newY = cropState.imgTop;
        if (newX + newSize > cropState.imgLeft + cropState.imgWidth) {
          newSize = cropState.imgLeft + cropState.imgWidth - newX;
        }
        if (newY + newSize > cropState.imgTop + cropState.imgHeight) {
          newSize = cropState.imgTop + cropState.imgHeight - newY;
        }

        cropState.size = newSize;
        cropState.x = newX;
        cropState.y = newY;
        updateCropBoxDOM();
        drawCropPreview();
      }
    });

    cropBox.addEventListener('pointerup', (e) => {
      cropState.isDragging = false;
      cropState.isResizing = false;
      cropState.activeHandle = null;
      try { cropBox.releasePointerCapture(e.pointerId); } catch(err) {}
    });

    cropBox.addEventListener('pointercancel', (e) => {
      cropState.isDragging = false;
      cropState.isResizing = false;
      cropState.activeHandle = null;
    });
  }

  // Save photo button
  if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', () => {
      if (!sourceImg) return;

      const natW = sourceImg.naturalWidth;
      const natH = sourceImg.naturalHeight;
      const dispW = cropState.imgWidth;
      const dispH = cropState.imgHeight;
      if (!dispW || !dispH) return;

      const scaleX = natW / dispW;
      const scaleY = natH / dispH;

      const relX = (cropState.x - cropState.imgLeft) * scaleX;
      const relY = (cropState.y - cropState.imgTop) * scaleY;
      const relSize = cropState.size * scaleX;

      // High-resolution crop canvas (400x400 square)
      const outCanvas = document.createElement('canvas');
      outCanvas.width = 400;
      outCanvas.height = 400;
      const ctx = outCanvas.getContext('2d');

      ctx.drawImage(
        sourceImg,
        relX, relY, relSize, relSize,
        0, 0, 400, 400
      );

      const croppedDataUrl = outCanvas.toDataURL('image/jpeg', 0.92);
      const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
      const email = user ? (user.email || '').toLowerCase().trim() : '';

      if (typeof window.setAccountStorage === 'function') {
        window.setAccountStorage('jt_user_avatar_img', croppedDataUrl, email);
      }
      localStorage.setItem('jt_user_avatar_img', croppedDataUrl);
      if (email) {
        localStorage.setItem('jt_user_avatar_img__' + email.replace(/[^a-z0-9]/g, '_'), croppedDataUrl);
        localStorage.setItem('jt_user_avatar_img__' + email, croppedDataUrl);
      }

      // Update avatar on profile page
      if (avatarEl) {
        avatarEl.innerHTML = `<img src="${croppedDataUrl}" alt="Profile Photo" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      }
      if (hoverTextEl) hoverTextEl.textContent = 'Change photo';

      // Update navbar avatar in real-time
      if (window.renderNavbarAuthState) window.renderNavbarAuthState();

      closePhotoModal();
      if (window.showToast) window.showToast('Profile photo updated successfully!');
    });
  }
}

// 3. Tabbed / Dynamic Section Switching for Sidebar Quick Links
function initQuickNavTabs() {
  const navLinks = document.querySelectorAll('.jt-quick-nav-link');
  const navList = document.getElementById('jtQuickNavList');
  const scrollLeftBtn = document.getElementById('jtNavScrollLeft');
  const scrollRightBtn = document.getElementById('jtNavScrollRight');
  if (!navLinks.length) return;

  const sectionMap = {
    '#resumeSection': ['resumeSection', 'summarySection'],
    '#skillsSection': ['skillsSection'],
    '#employmentSection': ['employmentSection'],
    '#educationSection': ['educationSection'],
    '#preferencesSection': ['preferencesSection'],
    '#messagesSection': ['messagesSection'],
    '#myJobsSection': ['myJobsSection']
  };

  function updateScrollArrows() {
    if (!navList || !scrollLeftBtn || !scrollRightBtn) return;
    const maxScroll = navList.scrollWidth - navList.clientWidth;
    if (maxScroll <= 2) {
      scrollLeftBtn.style.opacity = '0.3';
      scrollLeftBtn.style.pointerEvents = 'none';
      scrollRightBtn.style.opacity = '0.3';
      scrollRightBtn.style.pointerEvents = 'none';
    } else {
      scrollLeftBtn.style.opacity = navList.scrollLeft > 10 ? '1' : '0.3';
      scrollLeftBtn.style.pointerEvents = navList.scrollLeft > 10 ? 'auto' : 'none';
      scrollRightBtn.style.opacity = (navList.scrollLeft < maxScroll - 10) ? '1' : '0.3';
      scrollRightBtn.style.pointerEvents = (navList.scrollLeft < maxScroll - 10) ? 'auto' : 'none';
    }
  }

  if (scrollLeftBtn && navList) {
    scrollLeftBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navList.scrollBy({ left: -140, behavior: 'smooth' });
      setTimeout(updateScrollArrows, 300);
    });
  }
  if (scrollRightBtn && navList) {
    scrollRightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navList.scrollBy({ left: 140, behavior: 'smooth' });
      setTimeout(updateScrollArrows, 300);
    });
  }

  // Mouse drag-to-scroll support for desktop testing & DevTools
  if (navList) {
    let isDown = false;
    let startX = 0;
    let scrollLeftVal = 0;
    let hasDragged = false;

    navList.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      navList.classList.add('is-dragging');
      startX = e.pageX - navList.offsetLeft;
      scrollLeftVal = navList.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        navList.classList.remove('is-dragging');
        setTimeout(() => { hasDragged = false; }, 50);
      }
    });

    navList.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - navList.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) {
        hasDragged = true;
      }
      e.preventDefault();
      navList.scrollLeft = scrollLeftVal - walk;
      updateScrollArrows();
    });

    navList.addEventListener('scroll', updateScrollArrows, { passive: true });
    window.addEventListener('resize', updateScrollArrows, { passive: true });
    setTimeout(updateScrollArrows, 200);

    // Prevent click on link if user was dragging
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
  }

  function activateTab(targetHref, isUserClick) {
    let activeLink = null;
    navLinks.forEach(link => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
        activeLink = link;
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll ONLY the navList horizontally — NEVER scroll the window or root viewport!
    if (activeLink && navList) {
      const targetScroll = activeLink.offsetLeft - (navList.clientWidth / 2) + (activeLink.clientWidth / 2);
      navList.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth'
      });
      setTimeout(updateScrollArrows, 300);
    }

    const activeIds = sectionMap[targetHref] || ['resumeSection', 'summarySection'];

    // All section cards
    const allCards = document.querySelectorAll('.jt-prof-section-card');
    allCards.forEach(card => {
      const cardId = card.getAttribute('id');
      if (activeIds.includes(cardId)) {
        card.classList.remove('is-hidden');
      } else {
        card.classList.add('is-hidden');
      }
    });

    // On mobile, smooth scroll to the active section with offset if user clicked
    if (isUserClick && window.innerWidth <= 900 && targetHref) {
      const targetElem = document.querySelector(targetHref);
      if (targetElem) {
        const headerOffset = 130;
        const elemPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elemPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          left: 0,
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }

    // Strict invariant: Ensure window.scrollX never drifts from 0
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      activateTab(href, true);
      window.history.replaceState(null, null, href);
    });
  });

  // Initialize with hash or default to Resume/CV tab
  const initialHash = window.location.hash;
  if (initialHash && sectionMap[initialHash]) {
    activateTab(initialHash, false);
  } else {
    activateTab('#resumeSection', false);
  }

  // Strict horizontal viewport safeguard: window.scrollX must ALWAYS remain 0
  window.addEventListener('scroll', () => {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  }, { passive: true });

  // Reset scrollX on window load
  window.addEventListener('load', () => {
    if (window.scrollX !== 0) {
      window.scrollTo(0, window.scrollY);
    }
  });
}

// 4. Profile Strength Dynamic Calculator (Clean, Corporate, Non-Cringe)
function updateProfileStrength() {
  const strengthBar = document.getElementById('jtStrengthBar');
  const strengthScore = document.getElementById('jtStrengthScore');
  const strengthTip = document.getElementById('jtStrengthTip');

  let score = 78;
  const skillsCount = document.querySelectorAll('.jt-skill-chip').length;
  if (skillsCount >= 8) score += 12;

  const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
  const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
  const storedResume = (typeof window.getAccountStorage === 'function')
    ? window.getAccountStorage('jt_uploaded_resume', null, userEmail)
    : (userEmail ? (localStorage.getItem(`jt_uploaded_resume__${userEmail}`) || localStorage.getItem(`jt_uploaded_resume__${userEmail.replace(/[^a-z0-9]/g, '_')}`)) : null) || localStorage.getItem('jt_uploaded_resume');
  
  if (storedResume === 'none') {
    score -= 10;
  } else {
    score += 10;
  }

  score = Math.max(30, Math.min(100, score));

  if (strengthBar) {
    strengthBar.style.transition = 'none';
    strengthBar.style.width = `${score}%`;
  }
  if (strengthScore) strengthScore.textContent = `${score}%`;
  if (strengthTip) {
    if (score >= 100) {
      strengthTip.textContent = 'Profile Completeness: 100% • Recruiter search priority is at maximum.';
    } else {
      strengthTip.textContent = `Profile Completeness: ${score}% • Add more key skills to reach maximum recruiter priority.`;
    }
  }
}

// 5. Key Skills Interactive Management
function initSkillsManagement() {
  const addSkillBtn = document.getElementById('jtAddSkillBtn');
  const skillsCloud = document.getElementById('jtSkillsCloud');
  const skillModal = document.getElementById('jtAddSkillModal');
  const skillCloseBtn = document.getElementById('jtSkillModalClose');
  const skillCancelBtn = document.getElementById('jtSkillModalCancel');
  const skillForm = document.getElementById('jtAddSkillForm');
  const skillInput = document.getElementById('jtSkillInput');

  if (!addSkillBtn || !skillsCloud) return;

  function openSkillModal() {
    if (!skillModal) return;
    if (skillForm) skillForm.reset();
    skillModal.style.display = 'flex';
    requestAnimationFrame(() => skillModal.classList.add('open'));
    if (typeof window.lockBodyScroll === 'function') {
      window.lockBodyScroll();
    } else {
      document.body.style.overflow = 'hidden';
    }
    if (skillInput) {
      setTimeout(() => {
        try {
          skillInput.focus({ preventScroll: true });
        } catch (e) {
          skillInput.focus();
        }
      }, 150);
    }
  }

  function closeSkillModal() {
    if (!skillModal) return;
    skillModal.classList.remove('open');
    setTimeout(() => {
      skillModal.style.display = 'none';
      if (typeof window.unlockBodyScroll === 'function') {
        window.unlockBodyScroll();
      } else {
        document.body.style.overflow = '';
      }
    }, 200);
  }

  addSkillBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openSkillModal();
  });

  if (skillCloseBtn) skillCloseBtn.addEventListener('click', closeSkillModal);
  if (skillCancelBtn) skillCancelBtn.addEventListener('click', closeSkillModal);
  if (skillModal) {
    skillModal.addEventListener('click', (e) => {
      if (e.target === skillModal) closeSkillModal();
    });
  }

  if (skillForm) {
    skillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = skillInput ? skillInput.value.trim() : '';
      if (!val) return;

      const levelRadio = skillForm.querySelector('input[name="skillLevel"]:checked');
      const level = levelRadio ? levelRadio.value : 'Intermediate';

      const chip = document.createElement('div');
      chip.className = 'jt-skill-chip';
      chip.innerHTML = `
        <span>${val}</span>
        <span class="jt-skill-level">${level}</span>
        <button type="button" class="jt-skill-delete" title="Remove skill">&times;</button>
      `;

      skillsCloud.appendChild(chip);
      bindSkillDelete(chip.querySelector('.jt-skill-delete'));
      updateProfileStrength();
      saveCurrentSkills();
      updateSidebarSkillsCount();
      closeSkillModal();

      if (window.showToast) {
        window.showToast(`Skill "${val}" added to your profile!`);
      }
    });
  }

  // Load saved skills per account if available
  const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
  const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
  const savedSkillsRaw = (typeof window.getAccountStorage === 'function')
    ? window.getAccountStorage('jt_skills_list', null, userEmail)
    : localStorage.getItem('jt_skills_list');

  if (savedSkillsRaw) {
    try {
      const skillsArray = JSON.parse(savedSkillsRaw);
      if (Array.isArray(skillsArray) && skillsArray.length > 0) {
        skillsCloud.innerHTML = '';
        skillsArray.forEach(sk => {
          const chip = document.createElement('div');
          chip.className = 'jt-skill-chip';
          chip.innerHTML = `
            <span>${sk.name}</span>
            <span class="jt-skill-level">${sk.level}</span>
            <button type="button" class="jt-skill-delete" title="Remove skill">&times;</button>
          `;
          skillsCloud.appendChild(chip);
          bindSkillDelete(chip.querySelector('.jt-skill-delete'));
        });
      }
    } catch (e) {}
  }

  // Bind existing delete buttons
  document.querySelectorAll('.jt-skill-delete').forEach(btn => {
    bindSkillDelete(btn);
  });

  // Initial update of sidebar skills count
  updateSidebarSkillsCount();
}

function updateSidebarSkillsCount() {
  const countBadge = document.getElementById('jtQuickNavSkillsCount');
  const headerCountBadge = document.getElementById('jtSkillsHeaderCount');
  const skillsCloud = document.getElementById('jtSkillsCloud');
  const count = skillsCloud ? skillsCloud.querySelectorAll('.jt-skill-chip').length : 0;
  if (countBadge) {
    countBadge.textContent = count === 1 ? '1 Skill' : `${count} Skills`;
  }
  if (headerCountBadge) {
    headerCountBadge.textContent = count === 1 ? '1 Skill Added' : `${count} Skills Added`;
  }
}

function saveCurrentSkills() {
  const skillsCloud = document.getElementById('jtSkillsCloud');
  if (!skillsCloud) return;
  const chips = skillsCloud.querySelectorAll('.jt-skill-chip');
  const skillsArray = [];
  chips.forEach(chip => {
    const name = chip.querySelector('span:first-child')?.textContent || '';
    const level = chip.querySelector('.jt-skill-level')?.textContent || 'Intermediate';
    if (name) skillsArray.push({ name, level });
  });

  const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
  const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
  if (typeof window.setAccountStorage === 'function') {
    window.setAccountStorage('jt_skills_list', JSON.stringify(skillsArray), userEmail);
  } else {
    localStorage.setItem('jt_skills_list', JSON.stringify(skillsArray));
  }
}

function bindSkillDelete(btn) {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const chip = btn.closest('.jt-skill-chip');
    if (chip) {
      chip.remove();
      updateProfileStrength();
      saveCurrentSkills();
      updateSidebarSkillsCount();
      if (window.showToast) {
        window.showToast('Skill removed from profile.');
      }
    }
  });
}

// 6. Resume Actions & Replace Engine
function initResumeManagement() {
  const downloadBtn = document.getElementById('jtDownloadResumeBtn');
  const replaceBtn = document.getElementById('jtReplaceResumeBtn');
  const deleteBtn = document.getElementById('jtDeleteResumeBtn');
  const fileInput = document.getElementById('jtResumeHiddenInput');
  const currentResumeName = document.getElementById('jtCurrentResumeName');
  const atsDesc = document.getElementById('jtAtsScoreDesc');
  const atsVal = document.getElementById('jtAtsScoreVal');
  const metaEl = document.querySelector('.jt-resume-filemeta');

  function renderResumeUI(fileName) {
    const hasFile = fileName && fileName !== 'none';
    if (hasFile) {
      if (currentResumeName) currentResumeName.textContent = fileName;
      if (downloadBtn) downloadBtn.style.display = 'inline-flex';
      if (deleteBtn) deleteBtn.style.display = 'inline-flex';
      if (replaceBtn) {
        replaceBtn.innerHTML = '<span>Update / Replace</span>';
      }
      if (metaEl) metaEl.textContent = 'Uploaded recently • Parsed Successfully';
      if (atsDesc) {
        atsDesc.innerHTML = '<strong>92/100 ATS Compatibility Score</strong> — Clean typography and optimized tech keywords detected.';
      }
      if (atsVal) {
        atsVal.textContent = 'High Match';
        atsVal.style.color = '#16a34a';
      }
    } else {
      if (currentResumeName) currentResumeName.textContent = 'No resume uploaded';
      if (downloadBtn) downloadBtn.style.display = 'none';
      if (deleteBtn) deleteBtn.style.display = 'none';
      if (replaceBtn) {
        replaceBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg><span>Upload Resume</span>';
      }
      if (metaEl) metaEl.textContent = 'PDF, DOCX up to 5MB';
      if (atsDesc) {
        atsDesc.innerHTML = '<strong style="color:#64748b;">0/100 ATS Compatibility Score</strong> — Upload your resume to calculate keyword relevance.';
      }
      if (atsVal) {
        atsVal.textContent = 'Pending Upload';
        atsVal.style.color = '#64748b';
      }
    }
  }

  // Initial UI state setup based on stored resume
  const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
  const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
  const initialResume = (typeof window.getAccountStorage === 'function')
    ? window.getAccountStorage('jt_uploaded_resume', null, userEmail)
    : (userEmail ? (localStorage.getItem(`jt_uploaded_resume__${userEmail}`) || localStorage.getItem(`jt_uploaded_resume__${userEmail.replace(/[^a-z0-9]/g, '_')}`)) : null) || localStorage.getItem('jt_uploaded_resume');

  const isAlex = userEmail.includes('alex');
  const isSarah = userEmail.includes('sarah');
  const defaultResume = isSarah
    ? 'Sarah_Connor_Principal_Cloud_Resume.pdf'
    : (isAlex ? 'Alex_Mercer_Senior_FullStack_Resume.pdf' : `${(user?.name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`);

  const activeResume = (initialResume !== null && initialResume !== undefined) ? initialResume : defaultResume;
  renderResumeUI(activeResume);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const resumeName = currentResumeName ? currentResumeName.textContent : 'Resume.pdf';
      if (window.showToast) {
        window.showToast(`Downloading "${resumeName}"...`);
      }
    });
  }

  if (replaceBtn && fileInput) {
    replaceBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        if (window.showToast) window.showToast('File size must be under 5MB.');
        return;
      }

      const u = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
      const em = u ? (u.email || '').toLowerCase().trim() : '';
      if (typeof window.setAccountStorage === 'function') {
        window.setAccountStorage('jt_uploaded_resume', file.name, em);
      }
      if (em) {
        localStorage.setItem(`jt_uploaded_resume__${em}`, file.name);
        localStorage.setItem(`jt_uploaded_resume__${em.replace(/[^a-z0-9]/g, '_')}`, file.name);
      }
      localStorage.setItem('jt_uploaded_resume', file.name);

      renderResumeUI(file.name);

      if (window.showToast) {
        window.showToast(`Resume uploaded: "${file.name}"! ATS parsing completed.`);
      }
      updateProfileStrength();
    });
  }

  // Delete Resume Modal & Action Handlers
  window.promptDeleteResume = function() {
    if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    const modal = document.getElementById('jtDeleteResumeModal');
    const targetName = document.getElementById('jtDeleteResumeTargetName');
    const currName = currentResumeName ? currentResumeName.textContent : 'Resume';
    if (targetName) targetName.textContent = currName;
    if (modal) modal.style.display = 'flex';
  };

  window.closeDeleteResumeModal = function() {
    const modal = document.getElementById('jtDeleteResumeModal');
    if (modal) modal.style.display = 'none';
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  };

  window.confirmDeleteResume = function() {
    window.closeDeleteResumeModal();
    const u = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
    const em = u ? (u.email || '').toLowerCase().trim() : '';
    if (typeof window.setAccountStorage === 'function') {
      window.setAccountStorage('jt_uploaded_resume', 'none', em);
    }
    if (em) {
      localStorage.setItem(`jt_uploaded_resume__${em}`, 'none');
      localStorage.setItem(`jt_uploaded_resume__${em.replace(/[^a-z0-9]/g, '_')}`, 'none');
    }
    localStorage.setItem('jt_uploaded_resume', 'none');

    renderResumeUI('none');
    updateProfileStrength();

    if (window.showToast) {
      window.showToast('Resume removed from profile.');
    }
  };
}

// 7. Recruiter Visibility Toggle
function initVisibilityToggle() {
  const toggle = document.getElementById('jtVisToggle');
  const badge = document.getElementById('jtVisBadge');
  const subText = document.getElementById('jtVisSubText');
  if (!toggle) return;

  let loggedInUser = null;
  if (typeof window.getStoredUser === 'function') {
    loggedInUser = window.getStoredUser();
  } else {
    try {
      const raw = localStorage.getItem('moveonn_user') || null;
      if (raw) loggedInUser = JSON.parse(raw);
    } catch (e) {}
  }
  const email = (loggedInUser && loggedInUser.email) ? loggedInUser.email.toLowerCase().trim() : '';

  const getScopedVis = () => {
    if (typeof window.getAccountStorage === 'function') {
      return window.getAccountStorage('jt_recruiter_vis', 'true', email);
    }
    return email ? (localStorage.getItem(`jt_recruiter_vis__${email}`) || 'true') : 'true';
  };

  const updateUI = (isActive) => {
    toggle.checked = isActive;
    if (badge) {
      badge.textContent = isActive ? 'ACTIVE' : 'OFF';
      badge.className = isActive ? 'jt-vis-badge badge-active' : 'jt-vis-badge badge-inactive';
    }
    if (subText) {
      subText.textContent = isActive
        ? 'Searchable by 12,000+ top enterprises'
        : 'Profile is private (Hidden from recruiters)';
    }
  };

  // Sync state on page load
  const isCurrentlyActive = getScopedVis() === 'true';
  updateUI(isCurrentlyActive);

  toggle.addEventListener('change', () => {
    const isNowActive = toggle.checked;
    if (typeof window.setAccountStorage === 'function') {
      window.setAccountStorage('jt_recruiter_vis', isNowActive ? 'true' : 'false', email);
    } else if (email) {
      localStorage.setItem(`jt_recruiter_vis__${email}`, isNowActive ? 'true' : 'false');
    }

    updateUI(isNowActive);

    if (window.showToast) {
      if (isNowActive) {
        window.showToast('Profile is now actively visible to 12,000+ recruiters.');
      } else {
        window.showToast('Profile is now private. Recruiters will not see your profile in search.');
      }
    }
  });
}

// 8. PRO Plans & Pricing Modal Controller with Clean Badge States
function initPlansModal() {
  const modal = document.getElementById('jtPlansModal');
  const openBtns = document.querySelectorAll('[data-action="open-plans-modal"], .btn-jt-view-plans, .btn-jt-hero-plan, .btn-jt-pro-upgrade');
  const closeBtn = document.getElementById('jtPlansModalClose');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderPlansState();
      modal.classList.add('open');
      if (typeof window.lockBodyScroll === 'function') {
        window.lockBodyScroll();
      } else {
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closePlans() {
    modal.classList.remove('open');
    if (typeof window.unlockBodyScroll === 'function') {
      window.unlockBodyScroll();
    } else {
      document.body.style.overflow = '';
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closePlans);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePlans();
  });

  // Handle plan selections
  const planBtns = modal.querySelectorAll('.btn-jt-select-plan');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.getAttribute('data-plan-id') || 'growth';
      const planName = btn.getAttribute('data-plan') || 'Growth Pro';
      
      const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
      const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
      if (typeof window.setAccountStorage === 'function') {
        window.setAccountStorage('jt_user_plan', planId, userEmail);
      }

      renderPlansState();
      if (window.renderNavbarAuthState) window.renderNavbarAuthState();
      
      closePlans();

      if (window.showToast) {
        window.showToast(`Congratulations! You selected ${planName}. Activation is instant.`);
      }
    });
  });
}

// Render dynamic state for plans across page, hero button, and modal buttons
function renderPlansState() {
  const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
  const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
  const currentPlan = (typeof window.getAccountStorage === 'function')
    ? window.getAccountStorage('jt_user_plan', 'free', userEmail)
    : 'free';

  const btnFree = document.getElementById('jtBtnPlanFree');
  const btnGrowth = document.getElementById('jtBtnPlanGrowth');
  const btnEnt = document.getElementById('jtBtnPlanEnterprise');
  const heroPlanBtn = document.getElementById('jtHeroPlanBtn');

  // Update Free button in modal
  if (btnFree) {
    if (currentPlan === 'free') {
      btnFree.classList.add('current-plan');
      btnFree.textContent = 'Current Plan';
      btnFree.disabled = true;
    } else {
      btnFree.classList.remove('current-plan');
      btnFree.textContent = 'Get Started Free';
      btnFree.disabled = false;
    }
  }

  // Update Growth button in modal
  if (btnGrowth) {
    if (currentPlan === 'growth') {
      btnGrowth.classList.add('current-plan');
      btnGrowth.textContent = 'Current Plan';
      btnGrowth.disabled = true;
    } else {
      btnGrowth.classList.remove('current-plan');
      btnGrowth.textContent = 'Select Growth Pro';
      btnGrowth.disabled = false;
    }
  }

  // Update Enterprise button in modal
  if (btnEnt) {
    if (currentPlan === 'enterprise') {
      btnEnt.classList.add('current-plan');
      btnEnt.textContent = 'Current Plan';
      btnEnt.disabled = true;
    } else {
      btnEnt.classList.remove('current-plan');
      btnEnt.textContent = 'Contact Enterprise';
      btnEnt.disabled = false;
    }
  }

  // Update Hero Plan Badge (Clean text, NO "Current Plan:" or checkmark)
  if (heroPlanBtn) {
    if (currentPlan === 'growth') {
      heroPlanBtn.className = 'btn-jt-hero-plan badge-growth';
      heroPlanBtn.innerHTML = '<span>Growth Pro</span>';
    } else if (currentPlan === 'enterprise') {
      heroPlanBtn.className = 'btn-jt-hero-plan badge-enterprise';
      heroPlanBtn.innerHTML = '<span>Enterprise Pro</span>';
    } else {
      heroPlanBtn.className = 'btn-jt-hero-plan badge-free';
      heroPlanBtn.innerHTML = '<span>Free Starter</span>';
    }
  }

  // Sync navbar PRO badge
  if (window.renderNavbarAuthState) {
    window.renderNavbarAuthState();
  }
}

// 9. Move ONN "Basic details" Edit Profile Modal Controller
function initEditProfileModal() {
  const editModal = document.getElementById('jtEditProfModal');
  const editBtn = document.getElementById('jtEditProfBtn');
  const closeBtn = document.getElementById('jtEditModalClose');
  const cancelBtn = document.getElementById('jtEditCancelBtn');
  const form = document.getElementById('jtBasicDetailsForm');

  if (!editModal || !form) return;

  function openEditModal() {
    let loggedInUser = null;
    if (typeof window.getStoredUser === 'function') {
      loggedInUser = window.getStoredUser();
    } else {
      try {
        const raw = localStorage.getItem('moveonn_user') || null;
        if (raw) loggedInUser = JSON.parse(raw);
      } catch(e) {}
    }

    const userEmail = loggedInUser ? (loggedInUser.email || '').toLowerCase().trim() : '';
    const isAlex = userEmail.includes('alex');
    const isSarah = userEmail.includes('sarah');
    const defaultRole = isSarah 
      ? 'Principal Cloud Security & DevOps Architect' 
      : (isAlex ? 'Lead Full-Stack Cloud Engineer & Architect' : 'Senior Cloud Solutions Engineer');
    const defaultExp = isSarah ? '8+ Years Experience' : '6+ Years Experience';
    const defaultCtc = isSarah ? '28 LPA Current CTC' : '24 LPA Current CTC';
    const defaultPhone = isSarah ? '+91 98765 43211' : '+91 98765 43210';
    const defaultName = (loggedInUser && loggedInUser.name && loggedInUser.name !== 'Candidate')
      ? loggedInUser.name
      : (isSarah ? 'Sarah Connor' : (isAlex ? 'Alex Mercer' : 'Candidate Profile'));
    const defaultEmail = (loggedInUser && loggedInUser.email)
      ? loggedInUser.email
      : (isSarah ? 'sarah.connor@icloud.com' : (isAlex ? 'alex.mercer@gmail.com' : ''));

    const getScoped = (key, fallback) => {
      if (typeof window.getAccountStorage === 'function') {
        return window.getAccountStorage(key, fallback, userEmail);
      }
      return localStorage.getItem(key) || fallback;
    };

    const curName = getScoped('moveonn_user_name') || defaultName;
    const curEmail = getScoped('jt_user_email', defaultEmail);
    const curRole = getScoped('jt_user_role', defaultRole);
    const curLocation = getScoped('jt_user_location', 'Bengaluru, India (Open to Remote)');
    const curExp = getScoped('jt_user_exp', defaultExp);
    const curCtc = getScoped('jt_user_ctc', defaultCtc);
    const curPhone = getScoped('jt_user_phone', defaultPhone);
    const curWorkStatus = getScoped('jt_user_work_status', 'experienced');
    const curLocType = getScoped('jt_user_loc_type', 'india');
    const curNotice = getScoped('jt_user_notice', '15 Days or less');

    const inputName = document.getElementById('jtEditName');
    const inputRole = document.getElementById('jtEditRole');
    const inputExp = document.getElementById('jtEditExp');
    const inputCtc = document.getElementById('jtEditCtc');
    const inputLocation = document.getElementById('jtEditLocation');
    const inputPhone = document.getElementById('jtEditPhone');
    const inputEmail = document.getElementById('jtEditEmail');
    const noticeHidden = document.getElementById('jtEditNoticeVal');

    if (inputName) inputName.value = curName;
    if (inputRole) inputRole.value = curRole;
    if (inputExp) inputExp.value = curExp;
    if (inputCtc) inputCtc.value = (curCtc || '').replace(/^[₹$\s]+/, '').trim();
    if (inputLocation) inputLocation.value = curLocation;
    if (inputPhone) inputPhone.value = curPhone;
    if (inputEmail) inputEmail.value = curEmail;
    if (noticeHidden) noticeHidden.value = curNotice;

    // Work status radio
    const workRadios = document.querySelectorAll('input[name="work_status"]');
    workRadios.forEach(radio => {
      radio.checked = (radio.value === curWorkStatus);
    });

    // Location type radio
    const locRadios = document.querySelectorAll('input[name="loc_type"]');
    locRadios.forEach(radio => {
      radio.checked = (radio.value === curLocType);
    });

    // Notice period pills
    const pills = document.querySelectorAll('.jt-notice-pill');
    pills.forEach(pill => {
      const val = pill.getAttribute('data-val');
      if (val === curNotice) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    editModal.classList.add('open');
    if (typeof window.lockBodyScroll === 'function') {
      window.lockBodyScroll();
    } else {
      document.body.style.overflow = 'hidden';
    }
  }

  function closeEditModal() {
    editModal.classList.remove('open');
    if (typeof window.unlockBodyScroll === 'function') {
      window.unlockBodyScroll();
    } else {
      document.body.style.overflow = '';
    }
  }

  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openEditModal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeEditModal);

  editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeEditModal();
  });

  // Notice Period Pill Toggles
  const noticePills = document.querySelectorAll('.jt-notice-pill');
  const noticeHidden = document.getElementById('jtEditNoticeVal');
  noticePills.forEach(pill => {
    pill.addEventListener('click', () => {
      noticePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (noticeHidden) {
        noticeHidden.value = pill.getAttribute('data-val') || '';
      }
    });
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newName = (document.getElementById('jtEditName')?.value || '').trim();
    const newRole = (document.getElementById('jtEditRole')?.value || '').trim();
    const newExp = (document.getElementById('jtEditExp')?.value || '').trim();
    const rawCtc = (document.getElementById('jtEditCtc')?.value || '').trim();
    const cleanCtc = rawCtc.replace(/^[₹$\s]+/, '').trim();
    const newCtc = cleanCtc;
    const newLoc = (document.getElementById('jtEditLocation')?.value || '').trim();
    const newPhone = (document.getElementById('jtEditPhone')?.value || '').trim();
    const newEmail = (document.getElementById('jtEditEmail')?.value || '').trim();
    const newNotice = (document.getElementById('jtEditNoticeVal')?.value || '15 Days or less').trim();

    const selectedWorkStatus = document.querySelector('input[name="work_status"]:checked')?.value || 'experienced';
    const selectedLocType = document.querySelector('input[name="loc_type"]:checked')?.value || 'india';

    if (!newName) {
      if (window.showToast) window.showToast('Please enter your full name.');
      return;
    }

    const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
    const userEmail = user ? (user.email || '').toLowerCase().trim() : '';
    const emailsToSync = Array.from(new Set([userEmail, newEmail.toLowerCase()].filter(Boolean)));

    const setScoped = (key, val) => {
      localStorage.setItem(key, val);
      emailsToSync.forEach(em => {
        if (typeof window.setAccountStorage === 'function') {
          window.setAccountStorage(key, val, em);
        }
        const safe = em.toLowerCase().replace(/[^a-z0-9]/g, '_');
        localStorage.setItem(key + '__' + safe, val);
        localStorage.setItem(key + '__' + em.toLowerCase(), val);
      });
    };

    // Persist per-account in LocalStorage & mirror unscoped
    setScoped('moveonn_user_name', newName);
      
    setScoped('jt_user_role', newRole);
    setScoped('jt_user_exp', newExp);
    setScoped('jt_user_ctc', newCtc);
    setScoped('jt_user_location', newLoc);
    setScoped('jt_user_phone', newPhone);
    setScoped('jt_user_email', newEmail);
    setScoped('jt_user_work_status', selectedWorkStatus);
    setScoped('jt_user_loc_type', selectedLocType);
    setScoped('jt_user_notice', newNotice);

    // If candidate updated their email address, migrate avatar & subscription plan
    if (newEmail && userEmail && newEmail.toLowerCase() !== userEmail) {
      const oldAvatar = (typeof window.getAccountStorage === 'function')
        ? window.getAccountStorage('jt_user_avatar_img', null, userEmail)
        : (localStorage.getItem('jt_user_avatar_img__' + userEmail.replace(/[^a-z0-9]/g, '_')) || localStorage.getItem('jt_user_avatar_img'));
      if (oldAvatar) {
        if (typeof window.setAccountStorage === 'function') {
          window.setAccountStorage('jt_user_avatar_img', oldAvatar, newEmail);
        }
        localStorage.setItem('jt_user_avatar_img__' + newEmail.toLowerCase().replace(/[^a-z0-9]/g, '_'), oldAvatar);
        localStorage.setItem('jt_user_avatar_img__' + newEmail.toLowerCase(), oldAvatar);
      }
      const oldPlan = localStorage.getItem('jt_user_plan__' + userEmail) || localStorage.getItem('jt_user_plan__' + userEmail.replace(/[^a-z0-9]/g, '_')) || 'free';
      localStorage.setItem('jt_user_plan__' + newEmail.toLowerCase(), oldPlan);
      localStorage.setItem('jt_user_plan__' + newEmail.toLowerCase().replace(/[^a-z0-9]/g, '_'), oldPlan);
    }

    // Sync logged-in user in localStorage if active
    try {
      const rawUser = localStorage.getItem('moveonn_user') || null;
      if (rawUser) {
        const u = JSON.parse(rawUser);
        u.name = newName;
        u.email = newEmail;
        localStorage.setItem('moveonn_user', JSON.stringify(u));
      }
    } catch (err) {}

    // Update DOM in real-time
    const nameEl = document.getElementById('jtProfName');
    const roleEl = document.getElementById('jtProfRole');
    const expEl = document.getElementById('jtProfExpText');
    const ctcEl = document.getElementById('jtProfCtcText');
    const locEl = document.getElementById('jtProfLocationText');
    const phoneEl = document.getElementById('jtProfPhoneText');
    const emailEl = document.getElementById('jtProfEmailText');
    const noticeEl = document.getElementById('jtPrefNotice');

    if (nameEl) nameEl.textContent = newName;
    if (roleEl) roleEl.textContent = newRole;
    if (expEl) expEl.textContent = newExp;
    if (ctcEl) ctcEl.textContent = (newCtc || '').replace(/^[₹$\s]+/, '').trim();
    if (locEl) locEl.textContent = newLoc;
    if (phoneEl) phoneEl.textContent = newPhone;
    if (emailEl) emailEl.textContent = newEmail;
    if (noticeEl) {
      noticeEl.textContent = (newNotice.includes('Notice') || newNotice.includes('Joiner'))
        ? newNotice
        : `Immediate Joiner (${newNotice})`;
    }

    // Sync navbar user details
    if (window.renderNavbarAuthState) {
      window.renderNavbarAuthState();
    }

    closeEditModal();

    if (window.showToast) {
      window.showToast('Profile details saved successfully!');
    }
  });
}

// 10. Candidate Messages & Recruiter Invites Hub + Move ONN My Jobs Tracking
function initCandidateChatAndJobs() {
  const DEFAULT_CANDIDATE_THREADS = {
    'thread-gcloud': {
      recruiterName: 'Anand Kulkarni (Google Cloud)',
      status: '● Active Recruiter • Verified Enterprise Partner',
      avatarBg: '#ea4335',
      avatarText: 'G',
      accepted: false,
      declined: false,
      messages: [
        { sender: 'them', text: 'Hi! We reviewed your profile and were impressed by your distributed systems & React experience. Are you open to discussing a Staff Software Engineer role at Google Cloud Bengaluru?', time: 'Today at 10:30 AM' }
      ]
    },
    'thread-razorpay': {
      recruiterName: 'Neha Taneja (Razorpay)',
      status: '● Active Recruiter • Fast Response',
      avatarBg: '#0c2340',
      avatarText: 'R',
      accepted: false,
      declined: false,
      messages: [
        { sender: 'them', text: 'Hello! Razorpay is expanding its Core Payments platform squad. Your background in Node.js, Redis, and high-concurrency microservices is a strong match. Can we schedule a brief 20-min introductory chat this week?', time: 'Yesterday at 3:45 PM' }
      ]
    },
    'thread-amazon': {
      recruiterName: 'David Miller (Amazon Web Services)',
      status: '● Verified Recruiter • AWS Talent Acquisition',
      avatarBg: '#ff9900',
      avatarText: 'A',
      accepted: false,
      declined: false,
      messages: [
        { sender: 'them', text: 'Hi! Are you open to exploring Staff Solutions Architect opportunities supporting enterprise AWS customers across APAC? Let me know your preferred contact time.', time: 'Sep 29 at 11:15 AM' }
      ]
    }
  };

  let CANDIDATE_THREADS = JSON.parse(JSON.stringify(DEFAULT_CANDIDATE_THREADS));
  try {
    const rawSaved = localStorage.getItem('jt_candidate_chat_threads');
    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (parsed && typeof parsed === 'object') {
        CANDIDATE_THREADS = parsed;
      }
    }
  } catch (e) {}

  function saveCandidateThreads() {
    try {
      localStorage.setItem('jt_candidate_chat_threads', JSON.stringify(CANDIDATE_THREADS));
    } catch (e) {}
  }

  const threadKeys = Object.keys(CANDIDATE_THREADS);
  let activeThreadId = threadKeys.length > 0 ? threadKeys[0] : null;

  const threadsList = document.getElementById('jtCandThreadsList');
  const chatWindow = document.getElementById('jtCandChatWindow');
  const emptyFolder = document.getElementById('jtCandEmptyFolder');
  const emptyFolderTitle = document.getElementById('jtCandEmptyFolderTitle');
  const emptyFolderDesc = document.getElementById('jtCandEmptyFolderDesc');
  const folderSelect = document.getElementById('jtCandFolderSelect');

  const chatMessages = document.getElementById('jtCandChatMessages');
  const chatForm = document.getElementById('jtCandChatForm');
  const chatInput = document.getElementById('jtCandChatInput');
  const activeAvatar = document.getElementById('jtCandActiveAvatar');
  const activeRecruiter = document.getElementById('jtCandActiveRecruiter');
  const activeStatus = document.getElementById('jtCandActiveStatus');
  const acceptBtn = document.getElementById('jtCandAcceptInviteBtn');
  const declineBtn = document.getElementById('jtCandDeclineInviteBtn');

  function updateInboxFolderBadge() {
    const fs = document.getElementById('jtCandFolderSelect');
    if (!fs) return;
    const count = Object.keys(CANDIDATE_THREADS).length;
    const opt = fs.querySelector('option[value="inbox"]');
    if (opt) {
      opt.textContent = `Inbox (${count})`;
      opt.text = `Inbox (${count})`;
    }
    const currVal = fs.value;
    fs.value = currVal;
  }

  let selectedCandMsgIndices = new Set();
  let isCandSelectionMode = false;

  window.toggleCandChatDropdown = function(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('jtCandChatActionsMenu');
    if (!menu) return;
    const isShown = menu.style.display === 'block';
    menu.style.display = isShown ? 'none' : 'block';
  };

  window.closeCandChatDropdown = function() {
    const menu = document.getElementById('jtCandChatActionsMenu');
    if (menu) menu.style.display = 'none';
  };

  document.addEventListener('click', () => {
    window.closeCandChatDropdown();
  });

  window.enterCandChatSelectionMode = function(initialIdx) {
    window.closeCandChatDropdown();
    isCandSelectionMode = true;
    selectedCandMsgIndices.clear();
    if (typeof initialIdx === 'number') {
      selectedCandMsgIndices.add(initialIdx);
    }
    const selBar = document.getElementById('jtCandChatSelectionBar');
    const head = document.getElementById('jtCandChatHeader');
    if (selBar) selBar.style.display = 'flex';
    if (head) head.style.display = 'none';
    if (chatMessages) chatMessages.classList.add('selection-mode');
    updateCandSelectionBar();
    updateCandMsgHighlights();
  };

  window.exitCandChatSelectionMode = function() {
    isCandSelectionMode = false;
    selectedCandMsgIndices.clear();
    const selBar = document.getElementById('jtCandChatSelectionBar');
    const head = document.getElementById('jtCandChatHeader');
    if (selBar) selBar.style.display = 'none';
    if (head) head.style.display = 'flex';
    if (chatMessages) chatMessages.classList.remove('selection-mode');
    updateCandMsgHighlights();
  };

  let candTouchTimer = null;
  let candTouchStartX = 0;
  let candTouchStartY = 0;
  let candTouchTriggered = false;

  window.handleCandMsgTouchStart = function(e, idx) {
    if (e.touches && e.touches.length === 1) {
      candTouchTriggered = false;
      candTouchStartX = e.touches[0].clientX;
      candTouchStartY = e.touches[0].clientY;
      candTouchTimer = setTimeout(() => {
        candTouchTriggered = true;
        if (navigator.vibrate) {
          try { navigator.vibrate(40); } catch(ex) {}
        }
        if (!isCandSelectionMode) {
          window.enterCandChatSelectionMode(idx);
        } else {
          window.toggleCandMsgSelection(idx);
        }
      }, 500);
    }
  };

  window.handleCandMsgTouchMove = function(e) {
    if (candTouchTimer && e.touches && e.touches.length === 1) {
      const diffX = Math.abs(e.touches[0].clientX - candTouchStartX);
      const diffY = Math.abs(e.touches[0].clientY - candTouchStartY);
      if (diffX > 10 || diffY > 10) {
        clearTimeout(candTouchTimer);
        candTouchTimer = null;
      }
    }
  };

  window.handleCandMsgTouchEnd = function(e) {
    if (candTouchTimer) {
      clearTimeout(candTouchTimer);
      candTouchTimer = null;
    }
    if (candTouchTriggered && e) {
      e.preventDefault();
    }
  };

  window.handleCandMsgContextMenu = function(e, idx) {
    e.preventDefault();
    if (!isCandSelectionMode) {
      window.enterCandChatSelectionMode(idx);
    } else {
      window.toggleCandMsgSelection(idx);
    }
  };

  window.handleCandMsgClick = function(e, idx) {
    if (isCandSelectionMode) {
      e.preventDefault();
      window.toggleCandMsgSelection(idx);
    }
  };

  window.toggleCandMsgSelection = function(idx) {
    if (selectedCandMsgIndices.has(idx)) {
      selectedCandMsgIndices.delete(idx);
    } else {
      selectedCandMsgIndices.add(idx);
    }
    if (selectedCandMsgIndices.size === 0) {
      window.exitCandChatSelectionMode();
      return;
    }
    updateCandSelectionBar();
    updateCandMsgHighlights();
  };

  function updateCandSelectionBar() {
    const el = document.getElementById('jtCandSelectionCount');
    if (el) {
      const count = selectedCandMsgIndices.size;
      el.textContent = `${count} selected`;
    }
  }

  function updateCandMsgHighlights() {
    if (!chatMessages) return;
    const rows = chatMessages.querySelectorAll('.jt-msg-row');
    rows.forEach(row => {
      const idx = parseInt(row.getAttribute('data-msg-idx'), 10);
      if (selectedCandMsgIndices.has(idx)) {
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });
  }

  window.promptDeleteCandSelectedMessages = function() {
    if (selectedCandMsgIndices.size === 0 || !activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    if (!thread) return;

    const allOutgoing = [...selectedCandMsgIndices].every(idx => {
      return thread.messages[idx] && thread.messages[idx].sender === 'me';
    });

    const delForEveryoneBtn = document.getElementById('jtCandDeleteForEveryoneBtn');
    const subtextEl = document.getElementById('jtCandDeleteMsgSubtext');
    const modal = document.getElementById('jtCandDeleteMsgModal');

    if (delForEveryoneBtn) {
      delForEveryoneBtn.style.display = allOutgoing ? 'block' : 'none';
    }
    if (subtextEl) {
      const count = selectedCandMsgIndices.size;
      subtextEl.textContent = allOutgoing
        ? `You can delete ${count === 1 ? 'this message' : 'these messages'} for everyone or only for yourself.`
        : `Delete ${count === 1 ? 'this message' : 'these messages'} for yourself.`;
    }

    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('open');
      if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    }
  };

  window.closeCandDeleteMsgModal = function() {
    const modal = document.getElementById('jtCandDeleteMsgModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('open');
    }
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  };

  window.deleteCandMessageForEveryone = function() {
    if (selectedCandMsgIndices.size === 0 || !activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    if (!thread) return;

    selectedCandMsgIndices.forEach(idx => {
      if (thread.messages[idx]) {
        thread.messages[idx].deleted = true;
        thread.messages[idx].text = 'This message was deleted';
      }
    });

    saveCandidateThreads();
    window.closeCandDeleteMsgModal();
    window.exitCandChatSelectionMode();
    renderThreadMessages(activeThreadId);
    syncThreadsListDOM();
    if (window.showToast) window.showToast(`${selectedCandMsgIndices.size === 1 ? 'Message' : 'Messages'} deleted for everyone.`);
  };

  window.deleteCandMessageForMe = function() {
    if (selectedCandMsgIndices.size === 0 || !activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    if (!thread) return;

    const sorted = [...selectedCandMsgIndices].sort((a, b) => b - a);
    sorted.forEach(idx => {
      thread.messages.splice(idx, 1);
    });

    saveCandidateThreads();
    window.closeCandDeleteMsgModal();
    window.exitCandChatSelectionMode();
    renderThreadMessages(activeThreadId);
    syncThreadsListDOM();
    if (window.showToast) window.showToast(`${sorted.length === 1 ? 'Message' : 'Messages'} deleted for you.`);
  };

  window.openCandClearChatModal = function() {
    window.closeCandChatDropdown();
    if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    const modal = document.getElementById('jtCandClearChatModal');
    if (modal) modal.style.display = 'flex';
  };

  window.closeCandClearChatModal = function() {
    const modal = document.getElementById('jtCandClearChatModal');
    if (modal) modal.style.display = 'none';
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  };

  window.confirmCandClearChat = function() {
    window.closeCandClearChatModal();
    if (!activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    if (!thread) return;
    thread.messages = [];
    saveCandidateThreads();
    renderThreadMessages(activeThreadId);
    syncThreadsListDOM();
    if (window.showToast) window.showToast('Conversation cleared.');
  };

  function renderThreadMessages(threadId) {
    if (!chatMessages) return;
    const thread = CANDIDATE_THREADS[threadId];
    if (!thread) {
      chatMessages.innerHTML = '<div style="text-align:center; padding:40px; color:#64748b; font-size:13px;">Select a conversation to start messaging.</div>';
      return;
    }

    if (activeAvatar) {
      activeAvatar.style.background = thread.avatarBg;
      activeAvatar.textContent = thread.avatarText;
    }
    if (activeRecruiter) activeRecruiter.textContent = thread.recruiterName;
    if (activeStatus) activeStatus.textContent = thread.status;

    if (isCandSelectionMode) {
      window.exitCandChatSelectionMode();
    }

    // Sync button states (if present in DOM)
    if (acceptBtn && declineBtn) {
      if (thread.accepted) {
        acceptBtn.innerHTML = 'Invite Accepted ✓';
        acceptBtn.style.background = '#16a34a';
        acceptBtn.style.pointerEvents = 'none';
        declineBtn.style.display = 'none';
      } else if (thread.declined) {
        declineBtn.innerHTML = 'Declined ✕';
        declineBtn.style.background = '#e2e8f0';
        declineBtn.style.color = '#64748b';
        declineBtn.style.pointerEvents = 'none';
        acceptBtn.style.display = 'none';
      } else {
        acceptBtn.innerHTML = '✓ Accept Invite';
        acceptBtn.style.background = '#004687';
        acceptBtn.style.pointerEvents = 'auto';
        acceptBtn.style.display = 'none';
        declineBtn.innerHTML = '✕ Decline';
        declineBtn.style.background = '#ffffff';
        declineBtn.style.color = '#64748b';
        declineBtn.style.pointerEvents = 'auto';
        declineBtn.style.display = 'none';
      }
    }

    if (!thread.messages || thread.messages.length === 0) {
      chatMessages.innerHTML = '<div style="text-align:center; padding:40px; color:#94a3b8; font-size:13px;">No messages in this conversation yet. Send a message to start chatting!</div>';
      return;
    }

    chatMessages.innerHTML = thread.messages.map((msg, idx) => {
      const isMe = (msg.sender === 'me');
      const isSelected = selectedCandMsgIndices.has(idx);
      const isDel = !!msg.deleted;
      return `
        <div class="jt-msg-row ${isMe ? 'outgoing' : 'incoming'} ${isSelected ? 'selected' : ''}" 
             data-msg-idx="${idx}" 
             oncontextmenu="window.handleCandMsgContextMenu(event, ${idx})"
             onclick="window.handleCandMsgClick(event, ${idx})"
             ontouchstart="window.handleCandMsgTouchStart(event, ${idx})"
             ontouchmove="window.handleCandMsgTouchMove(event)"
             ontouchend="window.handleCandMsgTouchEnd(event)"
             ontouchcancel="window.handleCandMsgTouchEnd(event)">
          <div class="jt-msg-checkbox" title="Select message">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="jt-cand-msg-bubble ${isMe ? 'outgoing' : 'incoming'} ${isDel ? 'deleted-msg' : ''}">
            <div style="${isDel ? 'font-style:italic; opacity:0.8; display:inline-flex; align-items:center; gap:5px;' : ''}">
              ${isDel ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>' : ''}
              ${msg.text}
            </div>
            <span class="jt-cand-msg-time">${msg.time}</span>
          </div>
        </div>
      `;
    }).join('');

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function wireThreadItems() {
    const threadEls = document.querySelectorAll('.jt-cand-thread-item');
    threadEls.forEach(t => {
      t.onclick = function() {
        threadEls.forEach(item => item.classList.remove('active'));
        t.classList.add('active');
        activeThreadId = t.getAttribute('data-thread-id');
        renderThreadMessages(activeThreadId);

        // Mobile drilldown: transition to active chat window
        const cont = document.getElementById('jtCandChatContainer');
        if (cont) {
          cont.classList.add('mobile-chat-active');
          try {
            window.history.pushState({ jt_prof_view: 'messages', jt_cand_chat: true, threadId: activeThreadId }, '', '#messages');
          } catch (e) {}
        }
      };
    });
  }

  window.exitCandMobileChat = function() {
    const cont = document.getElementById('jtCandChatContainer');
    if (cont) {
      cont.classList.remove('mobile-chat-active');
      if (window.history.state && window.history.state.jt_cand_chat) {
        window.history.back();
      }
    }
  };

  // Comprehensive Mobile Back & Modal Hardware Navigation Controller
  window.addEventListener('popstate', function(e) {
    const openModals = document.querySelectorAll('.jt-plans-modal-backdrop.open, .jt-photo-modal-backdrop.open, .jt-edit-prof-backdrop.open, .jt-skill-modal-backdrop.open, .jt-resume-modal-backdrop.open, .jt-modal-backdrop.is-open');
    if (openModals.length > 0) {
      openModals.forEach(m => {
        m.classList.remove('open', 'is-open');
      });
      return;
    }

    const cont = document.getElementById('jtCandChatContainer');
    if (cont && cont.classList.contains('mobile-chat-active')) {
      cont.classList.remove('mobile-chat-active');
      return;
    }
  });

  function syncThreadsListDOM() {
    if (!threadsList) return;
    const keys = Object.keys(CANDIDATE_THREADS);
    if (keys.length === 0) {
      threadsList.innerHTML = '<div style="padding:24px 16px; text-align:center; color:#64748b; font-size:12.5px;">No active conversations</div>';
      return;
    }
    threadsList.innerHTML = keys.map(id => {
      const t = CANDIDATE_THREADS[id];
      const lastMsg = t.messages && t.messages.length ? t.messages[t.messages.length - 1] : { text: '', time: '' };
      const isActive = (id === activeThreadId);
      return `
        <div class="jt-cand-thread-item ${isActive ? 'active' : ''}" data-thread-id="${id}">
          <div class="jt-cand-thread-avatar" style="background:${t.avatarBg}; color:${t.avatarText === 'A' ? '#111' : '#fff'};">${t.avatarText}</div>
          <div class="jt-cand-thread-info">
            <div class="jt-cand-thread-row">
              <strong class="jt-cand-thread-name">${t.recruiterName.split('(')[0].trim()}</strong>
              <span class="jt-cand-thread-time">${lastMsg.time || ''}</span>
            </div>
            <div class="jt-cand-thread-comp">${t.recruiterName.includes('(') ? t.recruiterName.split('(')[1].replace(')', '') : 'Recruiter'}</div>
            <div class="jt-cand-thread-snippet">${lastMsg.text || ''}</div>
          </div>
        </div>
      `;
    }).join('');

    wireThreadItems();
  }

  // Initialize Dynamic Threads & Badge
  syncThreadsListDOM();
  updateInboxFolderBadge();
  if (activeThreadId) {
    renderThreadMessages(activeThreadId);
  } else {
    if (chatMessages) chatMessages.innerHTML = '<div style="text-align:center; padding:48px 20px; color:#64748b; font-size:13px;">No conversations in your Inbox.</div>';
  }

  // Folder Switching
  if (folderSelect) {
    folderSelect.addEventListener('change', (e) => {
      const folder = e.target.value;
      if (folder === 'inbox') {
        if (threadsList) threadsList.style.display = 'flex';
        if (chatWindow) chatWindow.style.display = 'flex';
        if (emptyFolder) emptyFolder.style.display = 'none';
        if (activeThreadId) renderThreadMessages(activeThreadId);
      } else if (folder === 'archive') {
        if (threadsList) threadsList.style.display = 'none';
        if (chatWindow) chatWindow.style.display = 'none';
        if (emptyFolder) {
          emptyFolder.style.display = 'flex';
          emptyFolderTitle.textContent = 'No archived conversations';
          emptyFolderDesc.textContent = 'When you archive conversations, they will be preserved here.';
        }
      } else if (folder === 'spam') {
        if (threadsList) threadsList.style.display = 'none';
        if (chatWindow) chatWindow.style.display = 'none';
        if (emptyFolder) {
          emptyFolder.style.display = 'flex';
          emptyFolderTitle.textContent = 'No spam messages';
          emptyFolderDesc.textContent = 'Messages flagged as spam will appear here.';
        }
      }
    });
  }

  // Accept Invite Action
  window.acceptCandidateInvite = function() {
    if (!activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    if (!thread || thread.accepted) return;
    thread.accepted = true;
    thread.messages.push({
      sender: 'me',
      text: 'Thank you for reaching out! I would love to connect. I am available for an introductory technical screening this week.',
      time: 'Just now'
    });
    saveCandidateThreads();
    renderThreadMessages(activeThreadId);
    syncThreadsListDOM();
    if (window.showToast) window.showToast('Interview schedule availability confirmed with recruiter.');
  };

  // Decline Invite Action
  window.declineCandidateInvite = function() {
    if (!activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    if (!thread || thread.declined) return;
    thread.declined = true;
    thread.messages.push({
      sender: 'me',
      text: 'Thank you for considering my background. At this moment, I am focusing on other architectural initiatives, so I must respectfully decline.',
      time: 'Just now'
    });
    saveCandidateThreads();
    renderThreadMessages(activeThreadId);
    syncThreadsListDOM();
    if (window.showToast) window.showToast('Recruiter invitation declined.');
  };

  // Delete Conversation Modal
  window.promptDeleteConversation = function() {
    window.closeCandChatDropdown();
    if (!activeThreadId) return;
    const thread = CANDIDATE_THREADS[activeThreadId];
    const modal = document.getElementById('jtCandDeleteConvModal');
    const targetName = document.getElementById('jtCandDeleteTargetName');
    if (!modal || !thread) return;
    if (targetName) targetName.textContent = thread.recruiterName;
    if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    modal.style.display = 'flex';
  };

  window.closeCandDeleteConvModal = function() {
    const modal = document.getElementById('jtCandDeleteConvModal');
    if (modal) modal.style.display = 'none';
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  };

  window.confirmDeleteConversation = function() {
    window.closeCandDeleteConvModal();
    if (!activeThreadId) return;

    delete CANDIDATE_THREADS[activeThreadId];
    saveCandidateThreads();
    updateInboxFolderBadge();

    const remainingKeys = Object.keys(CANDIDATE_THREADS);

    if (remainingKeys.length > 0) {
      activeThreadId = remainingKeys[0];
      syncThreadsListDOM();
      renderThreadMessages(activeThreadId);
    } else {
      activeThreadId = null;
      syncThreadsListDOM();
      if (chatMessages) {
        chatMessages.innerHTML = '<div style="text-align:center; padding:48px 20px; color:#64748b; font-size:13px;">No conversations in your Inbox.</div>';
      }
      if (activeRecruiter) activeRecruiter.textContent = 'No Conversation Selected';
      if (activeStatus) activeStatus.textContent = '';
      if (acceptBtn) acceptBtn.style.display = 'none';
      if (declineBtn) declineBtn.style.display = 'none';
    }

    if (window.showToast) window.showToast('Recruiter removed from conversations.');
  };

  // Recruiter Profiles & About Modal Controller
  const RECRUITER_PROFILES = {
    'thread-gcloud': {
      name: 'Anand Kulkarni',
      initials: 'AK',
      bgColor: '#ea4335',
      company: 'Google Cloud',
      role: 'Staff Sourcing Lead & Enterprise Partner',
      location: 'Bengaluru, India',
      bio: 'Leading talent acquisition for Google Cloud Distributed Infrastructure, Kubernetes Platforms, and High-Scale Systems across India & APAC.',
      responseRate: '98% Within 24 hrs',
      activeJobs: '4 Openings',
      openings: ['Staff Cloud Infrastructure Architect', 'Senior Kubernetes Platform Engineer', 'Principal Distributed Systems Lead', 'Site Reliability Engineering Lead']
    },
    'thread-razorpay': {
      name: 'Neha Taneja',
      initials: 'NT',
      bgColor: '#0c2340',
      company: 'Razorpay',
      role: 'Lead Tech Recruiter • Core Payments Platform',
      location: 'Bengaluru, India',
      bio: 'Partnering with Razorpay leadership to scale core payments gateway, merchant settlements, and high-concurrency microservices infrastructure.',
      responseRate: '95% Within 12 hrs',
      activeJobs: '3 Openings',
      openings: ['Principal Cloud Engineer (Payments)', 'Senior Backend Architect (Go/Node)', 'Staff Security Systems Engineer']
    },
    'thread-amazon': {
      name: 'David Miller',
      initials: 'DM',
      bgColor: '#ff9900',
      company: 'Amazon Web Services',
      role: 'Senior Executive Recruiter • Solutions Architecture',
      location: 'Hyderabad / Bengaluru (Hybrid)',
      bio: 'Staffing AWS Solutions Architecture and Enterprise Cloud Transformation specialists across India, Singapore, and APAC regions.',
      responseRate: '99% Within 6 hrs',
      activeJobs: '5 Openings',
      openings: ['Staff Solutions Architect (Enterprise)', 'Principal Cloud Migration Specialist', 'Senior Partner Solutions Architect', 'Cloud Security Specialist']
    }
  };

  window.openCandRecruiterAboutModal = function() {
    window.closeCandChatDropdown();
    const modal = document.getElementById('jtCandRecruiterAboutModal');
    if (!modal) return;

    const data = (activeThreadId && RECRUITER_PROFILES[activeThreadId]) ? RECRUITER_PROFILES[activeThreadId] : RECRUITER_PROFILES['thread-gcloud'];

    const elAvatar = document.getElementById('jtRecruiterAboutAvatar');
    const elName = document.getElementById('jtRecruiterAboutName');
    const elRole = document.getElementById('jtRecruiterAboutRole');
    const elLoc = document.getElementById('jtRecruiterAboutLocation');
    const elBio = document.getElementById('jtRecruiterAboutBio');
    const elRate = document.getElementById('jtRecruiterAboutResponseRate');
    const elJobs = document.getElementById('jtRecruiterAboutActiveJobs');
    const elList = document.getElementById('jtRecruiterAboutOpeningsList');

    if (elAvatar) {
      elAvatar.textContent = data.initials;
      elAvatar.style.background = data.bgColor;
      elAvatar.style.color = (data.initials === 'DM') ? '#111' : '#fff';
    }
    if (elName) elName.textContent = data.name;
    if (elRole) elRole.innerHTML = `${data.role} &bull; <strong id="jtRecruiterAboutCompany">${data.company}</strong>`;
    if (elLoc) elLoc.innerHTML = `<i class="fa-solid fa-location-dot" style="margin-right:4px;"></i>${data.location}`;
    if (elBio) elBio.textContent = data.bio;
    if (elRate) elRate.textContent = data.responseRate;
    if (elJobs) elJobs.textContent = data.activeJobs;
    if (elList && data.openings) {
      elList.innerHTML = `
        <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#64748b; margin-bottom:8px;">Active Open Roles</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${data.openings.map(role => `<span style="display:inline-block; font-size:12px; background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:6px; font-weight:600;">${role}</span>`).join('')}
        </div>
      `;
    }

    if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    modal.style.display = 'flex';
  };

  window.closeCandRecruiterAboutModal = function() {
    const modal = document.getElementById('jtCandRecruiterAboutModal');
    if (modal) modal.style.display = 'none';
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  };

  // Close modals on backdrop click or ESC key
  document.addEventListener('click', (e) => {
    const aboutModal = document.getElementById('jtCandRecruiterAboutModal');
    if (aboutModal && e.target === aboutModal) {
      window.closeCandRecruiterAboutModal();
    }
    const deleteModal = document.getElementById('jtDeleteResumeModal');
    if (deleteModal && e.target === deleteModal) {
      window.closeDeleteResumeModal();
    }
    const clearChatModal = document.getElementById('jtCandClearChatModal');
    if (clearChatModal && e.target === clearChatModal) {
      window.closeCandClearChatModal();
    }
    const delConvModal = document.getElementById('jtCandDeleteConvModal');
    if (delConvModal && e.target === delConvModal) {
      window.closeCandDeleteConvModal();
    }
    const withdrawModal = document.getElementById('jtCandWithdrawModal');
    if (withdrawModal && e.target === withdrawModal) {
      window.closeCandWithdrawModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeCandRecruiterAboutModal();
      window.closeDeleteResumeModal();
      window.closeCandClearChatModal();
      window.closeCandDeleteConvModal();
      window.closeCandWithdrawModal();
    }
  });

  if (chatForm && chatInput) {
    // Auto-expanding multiline textarea with vertical scroll for long text (Gemini standard)
    chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.requestSubmit ? chatForm.requestSubmit() : chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text || !activeThreadId) return;

      const thread = CANDIDATE_THREADS[activeThreadId];
      if (!thread) return;

      thread.messages.push({
        sender: 'me',
        text: text,
        time: 'Just now'
      });

      saveCandidateThreads();
      chatInput.value = '';
      chatInput.style.height = 'auto';
      renderThreadMessages(activeThreadId);
      syncThreadsListDOM();

      if (window.showToast) {
        window.showToast('Your message has been sent to the recruiter.');
      }

      // Automated acknowledgment
      setTimeout(() => {
        if (CANDIDATE_THREADS[activeThreadId]) {
          thread.messages.push({
            sender: 'them',
            text: 'Thank you for your response! I have noted your notes and will coordinate with the engineering panel.',
            time: 'Just now'
          });
          saveCandidateThreads();
          renderThreadMessages(activeThreadId);
          syncThreadsListDOM();
        }
      }, 1600);
    });
  }

  // Initial render of messages
  renderThreadMessages(activeThreadId);

  // =========================================================================
  // MY JOBS: Move ONN & Applications Management
  // =========================================================================
  const myJobsTabs = document.querySelectorAll('.jt-myjobs-tab');
  const myJobsPanes = document.querySelectorAll('.jt-myjobs-pane');

  myJobsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      myJobsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab-target');
      myJobsPanes.forEach(p => {
        if (p.id === targetId) {
          p.style.display = 'block';
          p.classList.add('active');
        } else {
          p.style.display = 'none';
          p.classList.remove('active');
        }
      });
    });
  });

  // Withdraw Application Dialog
  let pendingWithdrawAppId = null;
  let pendingWithdrawJobTitle = '';

  window.promptWithdrawApp = function(appId, jobTitle) {
    pendingWithdrawAppId = appId;
    pendingWithdrawJobTitle = jobTitle;
    const modal = document.getElementById('jtCandWithdrawModal');
    const titleEl = document.getElementById('jtWithdrawJobTitle');
    if (!modal) return;
    if (titleEl) titleEl.textContent = `"${jobTitle}"`;
    if (typeof window.lockBodyScroll === 'function') window.lockBodyScroll();
    modal.style.display = 'flex';
  };

  window.closeCandWithdrawModal = function() {
    const modal = document.getElementById('jtCandWithdrawModal');
    if (modal) modal.style.display = 'none';
    pendingWithdrawAppId = null;
    if (typeof window.unlockBodyScroll === 'function') window.unlockBodyScroll();
  };

  window.confirmWithdrawApp = function() {
    if (!pendingWithdrawAppId) return;
    const card = document.querySelector(`.jt-app-item[data-app-id="${pendingWithdrawAppId}"]`);
    if (card) {
      card.remove();

      // Add to archived list
      const archivedList = document.getElementById('jtArchivedItemsList');
      const archivedEmpty = document.getElementById('jtArchivedEmpty');
      if (archivedList) {
        archivedList.style.display = 'flex';
        if (archivedEmpty) archivedEmpty.style.display = 'none';

        const item = document.createElement('div');
        item.className = 'jt-app-item';
        item.setAttribute('data-archived-id', pendingWithdrawAppId);
        item.innerHTML = `
          <div class="jt-app-item-main">
            <strong class="jt-app-role">${pendingWithdrawJobTitle}</strong>
            <div class="jt-app-company">Withdrawn Application • Archived Requisition</div>
            <div class="jt-app-date">Withdrawn today</div>
          </div>
          <div class="jt-app-item-status">
            <span class="jt-status-badge badge-viewed">Withdrawn</span>
            <button type="button" class="btn-jt-withdraw-app" onclick="window.restoreArchivedApp('${pendingWithdrawAppId}', '${pendingWithdrawJobTitle}')">Restore</button>
          </div>
        `;
        archivedList.appendChild(item);
      }

      // Update counters
      const remainingApplied = document.querySelectorAll('#jtAppliedItemsList .jt-app-item').length;
      const countApplied = document.getElementById('jtCountApplied');
      if (countApplied) countApplied.textContent = remainingApplied;

      const archivedCount = document.querySelectorAll('#jtArchivedItemsList .jt-app-item').length;
      const countArchived = document.getElementById('jtCountArchived');
      if (countArchived) countArchived.textContent = archivedCount;

      const subcardCount = document.querySelector('#tabApplied .jt-subcard-title');
      if (subcardCount) subcardCount.textContent = `Active Applications (${remainingApplied})`;
    }

    window.closeCandWithdrawModal();
    if (window.showToast) {
      window.showToast(`Application for "${pendingWithdrawJobTitle}" has been withdrawn and moved to Archived.`);
    }
  };

  // Restore Archived App
  window.restoreArchivedApp = function(appId, jobTitle) {
    const card = document.querySelector(`.jt-app-item[data-archived-id="${appId}"]`);
    if (card) card.remove();

    const archivedCount = document.querySelectorAll('#jtArchivedItemsList .jt-app-item').length;
    const countArchived = document.getElementById('jtCountArchived');
    if (countArchived) countArchived.textContent = archivedCount;
    if (archivedCount === 0) {
      const archivedEmpty = document.getElementById('jtArchivedEmpty');
      const archivedList = document.getElementById('jtArchivedItemsList');
      if (archivedEmpty) archivedEmpty.style.display = 'block';
      if (archivedList) archivedList.style.display = 'none';
    }

    const appliedList = document.getElementById('jtAppliedItemsList');
    if (appliedList) {
      const item = document.createElement('div');
      item.className = 'jt-app-item';
      item.setAttribute('data-app-id', appId);
      item.innerHTML = `
        <div class="jt-app-item-main">
          <strong class="jt-app-role">${jobTitle}</strong>
          <div class="jt-app-company">Restored Requisition</div>
          <div class="jt-app-date">Reactivated today • Fast Apply Active</div>
        </div>
        <div class="jt-app-item-status">
          <span class="jt-status-badge badge-reviewing">Under Review</span>
          <button type="button" class="btn-jt-withdraw-app" onclick="window.promptWithdrawApp('${appId}', '${jobTitle}')">Withdraw Application</button>
        </div>
      `;
      appliedList.appendChild(item);
    }

    const remainingApplied = document.querySelectorAll('#jtAppliedItemsList .jt-app-item').length;
    const countApplied = document.getElementById('jtCountApplied');
    if (countApplied) countApplied.textContent = remainingApplied;

    if (window.showToast) {
      window.showToast(`Application for "${jobTitle}" restored to Active Applications.`);
    }
  };

  // Unsave / Remove Saved Job
  window.unsaveJob = function(savedId, jobTitle) {
    const card = document.querySelector(`.jt-saved-item[data-saved-id="${savedId}"]`);
    if (card) {
      card.remove();
      const remainingSaved = document.querySelectorAll('#jtSavedJobsList .jt-saved-item').length;
      const countSaved = document.getElementById('jtCountSaved');
      if (countSaved) countSaved.textContent = remainingSaved;

      const subcardCount = document.querySelector('#tabSaved .jt-subcard-title');
      if (subcardCount) subcardCount.textContent = `Bookmarked Jobs (${remainingSaved})`;

      if (window.showToast) {
        window.showToast(`"${jobTitle}" removed from your Saved Jobs.`);
      }
    }
  };

  // Saved Jobs 1-Click Apply
  window.applySavedJob = function (savedId, jobTitle) {
    const card = document.querySelector(`.jt-saved-item[data-saved-id="${savedId}"]`);
    if (card) {
      const btn = card.querySelector('.btn-jt-apply-saved');
      if (btn) {
        btn.innerHTML = '<span>Applied ✓</span>';
        btn.style.background = '#16a34a';
        btn.style.borderColor = '#16a34a';
        btn.style.color = '#ffffff';
        btn.style.pointerEvents = 'none';
      }
    }

    // Add to Active Applications if not already there
    const appliedList = document.getElementById('jtAppliedItemsList');
    const existing = appliedList ? appliedList.querySelector(`[data-app-id="app-${savedId}"]`) : null;
    if (appliedList && !existing) {
      const item = document.createElement('div');
      item.className = 'jt-app-item';
      item.setAttribute('data-app-id', `app-${savedId}`);
      item.innerHTML = `
        <div class="jt-app-item-main">
          <strong class="jt-app-role">${jobTitle}</strong>
          <div class="jt-app-company">Applied via 1-Click Apply</div>
          <div class="jt-app-date">Applied today • Fast Apply Verified</div>
        </div>
        <div class="jt-app-item-status">
          <span class="jt-status-badge badge-reviewing">Under Review</span>
          <span class="jt-status-match-pill">Top Match</span>
          <button type="button" class="btn-jt-withdraw-app" onclick="window.promptWithdrawApp('app-${savedId}', '${jobTitle}')">Withdraw Application</button>
        </div>
      `;
      appliedList.appendChild(item);

      const totalApplied = document.querySelectorAll('#jtAppliedItemsList .jt-app-item').length;
      const countApplied = document.getElementById('jtCountApplied');
      if (countApplied) countApplied.textContent = totalApplied;
    }

    try {
      const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
      const email = user ? (user.email || '').toLowerCase().trim() : '';
      const key = email ? `jt_applied_saved_jobs__${email}` : 'jt_applied_saved_jobs';
      const applied = JSON.parse(localStorage.getItem(key) || '[]');
      if (!applied.includes(savedId)) {
        applied.push(savedId);
        localStorage.setItem(key, JSON.stringify(applied));
      }
    } catch (e) {}

    if (window.showToast) {
      window.showToast(`Application successfully submitted for "${jobTitle}"! Moved to Applied tab.`);
    }
  };

  // Pre-hydrate applied saved jobs from scoped localStorage
  try {
    const user = (typeof window.getStoredUser === 'function') ? window.getStoredUser() : null;
    const email = user ? (user.email || '').toLowerCase().trim() : '';
    const key = email ? `jt_applied_saved_jobs__${email}` : 'jt_applied_saved_jobs';
    const applied = JSON.parse(localStorage.getItem(key) || '[]');
    applied.forEach(savedId => {
      const card = document.querySelector(`.jt-saved-item[data-saved-id="${savedId}"]`);
      if (card) {
        const btn = card.querySelector('.btn-jt-apply-saved');
        if (btn) {
          btn.innerHTML = '<span>Applied ✓</span>';
          btn.style.background = '#16a34a';
          btn.style.borderColor = '#16a34a';
          btn.style.color = '#ffffff';
          btn.style.pointerEvents = 'none';
        }
      }
    });
  } catch (e) {}
}
