/**
 * Move ONN Employer Workspace & ATS Controller (Move ONN Recruiter Standard)
 * Modular Architecture: js/employer-dashboard.js
 */

(function () {
  'use strict';

  // --- Universal Background Scroll Locking for Modals ---
  function lockBackgroundScroll() {
    if (window.lockBodyScroll) {
      window.lockBodyScroll();
    } else {
      document.documentElement.classList.add('jt-modal-locked', 'modal-open');
      document.body.classList.add('jt-modal-locked', 'modal-open');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }

  function unlockBackgroundScroll() {
    const openModals = document.querySelectorAll('.jt-emp-modal-backdrop.open, .jt-emp-modal-backdrop[style*="display: flex"], .jt-emp-modal-backdrop[style*="display:flex"]');
    if (openModals.length === 0) {
      if (window.unlockBodyScroll) {
        window.unlockBodyScroll();
      } else {
        document.documentElement.classList.remove('jt-modal-locked', 'modal-open');
        document.body.classList.remove('jt-modal-locked', 'modal-open');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    }
  }
  window.lockBackgroundScroll = lockBackgroundScroll;
  window.unlockBackgroundScroll = unlockBackgroundScroll;

  // --- Initial Data Sets ---
  const DEFAULT_JOBS = [
    {
      id: 'job-101',
      title: 'Senior React & Node.js Engineer',
      department: 'Engineering & Technology',
      location: 'Bengaluru, India (Hybrid)',
      type: 'Hybrid',
      exp: '5-8 Years',
      salary: '₹24L - ₹32L PA',
      status: 'active',
      sponsored: true,
      postedDate: 'Oct 1, 2026',
      pipeline: { awaiting: 0, reviewing: 3, interviewing: 2, hired: 1 }
    },
    {
      id: 'job-102',
      title: 'Principal Cloud & DevOps Architect',
      department: 'Cloud Architecture & DevOps',
      location: 'Remote, India',
      type: 'Fully Remote',
      exp: '8-12 Years',
      salary: '₹35L - ₹48L PA',
      status: 'active',
      sponsored: true,
      postedDate: 'Sep 28, 2026',
      pipeline: { awaiting: 1, reviewing: 2, interviewing: 1, hired: 0 }
    },
    {
      id: 'job-103',
      title: 'Senior Technical Product Manager',
      department: 'Product & Design',
      location: 'Bengaluru, India (On-site)',
      type: 'On-site',
      exp: '6-10 Years',
      salary: '₹28L - ₹40L PA',
      status: 'active',
      sponsored: false,
      postedDate: 'Sep 25, 2026',
      pipeline: { awaiting: 1, reviewing: 1, interviewing: 0, hired: 1 }
    },
    {
      id: 'job-104',
      title: 'Associate QA Automation Engineer',
      department: 'Engineering & Technology',
      location: 'Hyderabad, India (Hybrid)',
      type: 'Hybrid',
      exp: '2-4 Years',
      salary: '₹10L - ₹15L PA',
      status: 'paused',
      sponsored: false,
      postedDate: 'Sep 15, 2026',
      pipeline: { awaiting: 0, reviewing: 2, interviewing: 0, hired: 0 }
    },
    {
      id: 'job-105',
      title: 'Lead Data Analyst',
      department: 'Finance & Operations',
      location: 'Mumbai, India (Hybrid)',
      type: 'Hybrid',
      exp: '4-7 Years',
      salary: '₹18L - ₹24L PA',
      status: 'closed',
      sponsored: false,
      postedDate: 'Aug 20, 2026',
      pipeline: { awaiting: 0, reviewing: 0, interviewing: 0, hired: 1 }
    }
  ];

  const CANDIDATES = [
    {
      id: 'cand-1',
      name: 'Alex Mercer',
      title: 'Lead Full-Stack Cloud Engineer',
      location: 'Bengaluru, India (Open to Remote)',
      exp: '6+ Years',
      ctc: '₹24 LPA',
      matchScore: 96,
      stage: 'reviewing', // awaiting, reviewing, interviewing, hired, rejected
      jobId: 'job-101',
      skills: ['React 18', 'Node.js', 'TypeScript', 'AWS Cloud', 'Docker'],
      summary: 'Specialized in microservices architecture, React performance optimization, and distributed systems.'
    },
    {
      id: 'cand-2',
      name: 'Sarah Connor',
      title: 'Principal Cloud Security & DevOps Architect',
      location: 'Bengaluru, India',
      exp: '8+ Years',
      ctc: '₹28 LPA',
      matchScore: 94,
      stage: 'interviewing',
      jobId: 'job-102',
      skills: ['AWS / GCP', 'Kubernetes', 'Terraform', 'CI/CD Pipelines', 'Zero Trust'],
      summary: 'Expert in multi-cloud infrastructure hardening, GitOps automation, and high availability systems.'
    },
    {
      id: 'cand-3',
      name: 'Rahul Verma',
      title: 'Senior Frontend Developer',
      location: 'Pune, India',
      exp: '5+ Years',
      ctc: '₹19 LPA',
      matchScore: 91,
      stage: 'awaiting',
      jobId: 'job-101',
      skills: ['React', 'Redux Toolkit', 'Next.js', 'Tailwind CSS', 'GraphQL'],
      summary: 'Passionate about design systems, accessibility, and high performance web apps.'
    },
    {
      id: 'cand-4',
      name: 'Priya Patel',
      title: 'Technical Product Manager',
      location: 'Bengaluru, India',
      exp: '7+ Years',
      ctc: '₹26 LPA',
      matchScore: 89,
      stage: 'interviewing',
      jobId: 'job-103',
      skills: ['Product Discovery', 'Roadmapping', 'Agile / Scrum', 'SQL', 'B2B SaaS'],
      summary: 'Data-driven PM with proven track record scaling fintech and enterprise workflow SaaS products.'
    },
    {
      id: 'cand-5',
      name: 'Vikram Seth',
      title: 'Staff Cloud Solutions Architect',
      location: 'Hyderabad, India',
      exp: '10+ Years',
      ctc: '₹34 LPA',
      matchScore: 95,
      stage: 'hired',
      jobId: 'job-102',
      skills: ['Enterprise AWS', 'Distributed Systems', 'Kafka', 'System Design'],
      summary: 'Architected platforms handling 100k requests/second with 99.99% uptime.'
    },
    {
      id: 'cand-6',
      name: 'Ananya Iyer',
      title: 'Full-Stack Developer (MERN)',
      location: 'Chennai, India (Hybrid)',
      exp: '4+ Years',
      ctc: '₹16 LPA',
      matchScore: 88,
      stage: 'awaiting',
      jobId: 'job-101',
      skills: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Express'],
      summary: 'Quick learner with rich experience building responsive end-to-end web applications.'
    },
    {
      id: 'cand-7',
      name: 'Rohan Gupta',
      title: 'Backend Node.js & Go Engineer',
      location: 'Delhi NCR, India (Remote)',
      exp: '5+ Years',
      ctc: '₹22 LPA',
      matchScore: 86,
      stage: 'reviewing',
      jobId: 'job-101',
      skills: ['Node.js', 'Go / Golang', 'gRPC', 'Redis', 'Docker'],
      summary: 'Backend specialist focused on high concurrency messaging and database indexing.'
    }
  ];

  const SOURCING_TALENT = [
    {
      name: 'Aditya Rao',
      role: 'Principal React / Next.js Specialist',
      location: 'Bengaluru, India',
      exp: '7 Years Experience',
      skills: ['React', 'Next.js', 'TypeScript', 'Web Performance'],
      status: 'Active job seeker • Verified profile'
    },
    {
      name: 'Kavita Menon',
      role: 'Staff DevOps & Site Reliability Engineer',
      location: 'Hyderabad, India',
      exp: '9 Years Experience',
      skills: ['DevOps', 'Kubernetes', 'Terraform', 'AWS', 'Prometheus'],
      status: 'Open to high-growth startups'
    },
    {
      name: 'Deepak Sharma',
      role: 'Lead Cloud Infrastructure Architect',
      location: 'Pune, India',
      exp: '8 Years Experience',
      skills: ['AWS', 'Cloud Architecture', 'Python', 'Microservices'],
      status: 'Serving notice period (Immediate joiner)'
    },
    {
      name: 'Neha Kapoor',
      role: 'Senior Product Manager - Enterprise SaaS',
      location: 'Bengaluru, India',
      exp: '6 Years Experience',
      skills: ['Product', 'Growth', 'User Research', 'Analytics'],
      status: 'Exploring Senior PM opportunities'
    },
    {
      name: 'Suresh Nambiar',
      role: 'Backend Go & Distributed Systems Lead',
      location: 'Bengaluru, India',
      exp: '8 Years Experience',
      skills: ['Go', 'Node.js', 'Kafka', 'System Design', 'PostgreSQL'],
      status: 'Active on Move ONN today'
    },
    {
      name: 'Meera Deshmukh',
      role: 'AI / Python Cloud Solutions Engineer',
      location: 'Mumbai, India',
      exp: '5 Years Experience',
      skills: ['Python', 'FastAPI', 'PyTorch', 'AWS SageMaker', 'GenAI'],
      status: 'Verified AI engineer'
    }
  ];

  const CHAT_CONVERSATIONS = {
    'cand-1': {
      candidateName: 'Alex Mercer',
      candidateRole: 'Applicant for Lead Full-Stack Cloud Engineer',
      avatar: 'AM',
      messages: [
        { sender: 'them', text: 'Hello, thank you for reviewing my profile for the Lead Full-Stack Engineer role.', time: 'Yesterday at 4:30 PM' },
        { sender: 'me', text: 'Hi Alex! Your background in React and distributed AWS microservices is impressive. We would love to discuss next steps.', time: 'Yesterday at 5:15 PM' },
        { sender: 'them', text: 'That sounds great! I am available this week between 2 PM and 6 PM IST for a technical briefing.', time: 'Today at 10:14 AM' }
      ]
    },
    'cand-2': {
      candidateName: 'Sarah Connor',
      candidateRole: 'Candidate for DevOps & Security Architect',
      avatar: 'SC',
      messages: [
        { sender: 'me', text: 'Hello Sarah, we scheduled your panel round for DevOps Architecture tomorrow at 11 AM.', time: 'Yesterday at 2:00 PM' },
        { sender: 'them', text: 'Confirmed! I have received the Google Meet invite. Looking forward to speaking with the team.', time: 'Yesterday at 3:12 PM' }
      ]
    },
    'cand-3': {
      candidateName: 'Rahul Verma',
      candidateRole: 'Applicant for Senior Frontend Developer',
      avatar: 'RV',
      messages: [
        { sender: 'them', text: 'Hi Recruiter, I submitted my updated resume with Redux Toolkit and Next.js project links.', time: '2 hours ago' },
        { sender: 'me', text: 'Thank you Rahul! Our technical hiring manager is currently reviewing your code samples.', time: '1 hour ago' }
      ]
    }
  };

  let activeChatCandidateId = 'cand-1';
  let deletingJobId = null;

  // --- Dynamic Account Identity Pre-Hydration ---
  function initAccountIdentity() {
    let user = null;
    try {
      const raw = localStorage.getItem('moveonn_user') || null;
      if (raw) user = JSON.parse(raw);
    } catch (e) {}

    const em = (user && user.email) ? user.email.toLowerCase().trim() : '';
    const sf = em ? em.replace(/[^a-z0-9]/g, '_') : '';

    const name = (sf ? (localStorage.getItem('moveonn_user_name__' + sf) || localStorage.getItem('moveonn_user_name__' + sf)) : null) ||
                 (em ? (localStorage.getItem('moveonn_user_name__' + em) || localStorage.getItem('moveonn_user_name__' + em)) : null) ||
                 localStorage.getItem('moveonn_user_name') ||
                 localStorage.getItem('moveonn_user_name') ||
                 localStorage.getItem('jt_recruiter_name') ||
                 (user && user.name ? user.name : 'Sarah Connor');

    const email = (sf ? localStorage.getItem('jt_user_email__' + sf) : null) ||
                  (em ? localStorage.getItem('jt_user_email__' + em) : null) ||
                  localStorage.getItem('jt_user_email') ||
                  localStorage.getItem('jt_recruiter_email') ||
                  (user && user.email ? user.email : 'sarah.connor@icloud.com');

    const customAvatar = (sf ? localStorage.getItem('jt_user_avatar_img__' + sf) : null) ||
                         (em ? localStorage.getItem('jt_user_avatar_img__' + em) : null) ||
                         localStorage.getItem('jt_user_avatar_img') ||
                         (user && user.avatar ? user.avatar : null);

    const nameEl = document.getElementById('jtEmpUserName');
    const initialEl = document.getElementById('jtEmpAvatarInitial');
    const menuEmailEl = document.getElementById('jtEmpMenuEmail');
    const mobNameEl = document.getElementById('jtEmpMobUserName');
    const mobEmailEl = document.getElementById('jtEmpMobUserEmail');
    const mobAvatarEl = document.getElementById('jtEmpMobAvatar');

    if (nameEl) nameEl.textContent = name;
    if (menuEmailEl) menuEmailEl.textContent = email;
    if (mobNameEl) mobNameEl.textContent = name;
    if (mobEmailEl) mobEmailEl.textContent = email;

    const silhouetteSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#64748b" style="display:block;"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" /></svg>';
    const mobSilhouetteSvg = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#64748b" style="display:block;"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" /></svg>';

    if (initialEl) {
      if (customAvatar && typeof customAvatar === 'string' && (customAvatar.startsWith('data:image/') || customAvatar.startsWith('http') || customAvatar.startsWith('assets/'))) {
        initialEl.innerHTML = `<img src="${customAvatar}" alt="${name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      } else {
        initialEl.innerHTML = silhouetteSvg;
      }
    }

    if (mobAvatarEl) {
      if (customAvatar && typeof customAvatar === 'string' && (customAvatar.startsWith('data:image/') || customAvatar.startsWith('http') || customAvatar.startsWith('assets/'))) {
        mobAvatarEl.innerHTML = `<img src="${customAvatar}" alt="${name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      } else {
        mobAvatarEl.innerHTML = mobSilhouetteSvg;
      }
    }
  }

  // --- Left Rail Collapsible Controller ---
  function initRailCollapse() {
    const toggleBtn = document.getElementById('jtRailCollapseToggle');
    const workspace = document.getElementById('jtEmpWorkspace');
    if (!toggleBtn || !workspace) return;

    const isCollapsed = localStorage.getItem('jt_emp_rail_collapsed') === 'true';
    if (isCollapsed) {
      workspace.classList.add('rail-collapsed');
      const label = toggleBtn.querySelector('.jt-collapse-text');
      if (label) label.textContent = 'Expand';
    }

    toggleBtn.addEventListener('click', () => {
      const nowCollapsed = workspace.classList.toggle('rail-collapsed');
      localStorage.setItem('jt_emp_rail_collapsed', nowCollapsed ? 'true' : 'false');
      const label = toggleBtn.querySelector('.jt-collapse-text');
      if (label) label.textContent = nowCollapsed ? 'Expand' : 'Collapse';
    });
  }

  // --- State Initialization & Storage Synchronization ---
  function getStoredJobs() {
    try {
      const stored = localStorage.getItem('jt_employer_posted_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const defaultIds = new Set(DEFAULT_JOBS.map(j => j.id));
          const normalized = parsed.map(j => ({
            id: j.id ? String(j.id) : ('job-' + Date.now()),
            title: j.title || 'Untitled Requisition',
            department: j.department || j.company || 'Enterprise Engineering',
            location: j.location || 'India',
            type: j.type || 'Full-time',
            exp: j.exp || j.experience || '3-5 Years',
            salary: j.salary || 'Competitive',
            status: j.status || 'active',
            sponsored: (j.sponsored !== undefined) ? j.sponsored : true,
            postedDate: j.postedDate || (j.postedAt ? new Date(j.postedAt).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : 'Today'),
            pipeline: j.pipeline || { awaiting: 0, reviewing: 0, interviewing: 0, hired: 0 }
          }));
          const uniqueUserJobs = normalized.filter(j => !defaultIds.has(j.id));
          return [...uniqueUserJobs, ...DEFAULT_JOBS];
        }
      }
    } catch (e) {
      console.error('Error loading stored jobs:', e);
    }
    return DEFAULT_JOBS;
  }

  function saveJobs(jobs) {
    try {
      localStorage.setItem('jt_employer_posted_jobs', JSON.stringify(jobs));
    } catch (e) {}
  }

  let allJobs = getStoredJobs();

  // --- Toast Helper ---
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
    clearTimeout(toast.__timer);
    toast.__timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  window.showToast = showToast;

  // --- Workspace View Navigation ---
  function initNavigation() {
    const railLinks = document.querySelectorAll('.jt-rail-link');
    const mobileTabBtns = document.querySelectorAll('.jt-mobile-tab-btn');
    const views = document.querySelectorAll('.jt-emp-view');
    const validViews = ['viewJobs', 'viewCandidates', 'viewSourcing', 'viewMessages', 'viewAnalytics'];

    function switchView(targetViewId, skipState) {
      if (!validViews.includes(targetViewId)) targetViewId = 'viewJobs';

      // Clean up synchronous pre-hydration style if present
      const preHide = document.getElementById('jtPreViewHide');
      if (preHide) preHide.remove();

      views.forEach(v => {
        if (v.id === targetViewId) {
          v.classList.add('active');
        } else {
          v.classList.remove('active');
        }
      });

      const mainArea = document.querySelector('.jt-emp-main-area');
      if (mainArea) {
        if (targetViewId === 'viewMessages') {
          mainArea.classList.add('messages-active');
        } else {
          mainArea.classList.remove('messages-active');
        }
      }

      railLinks.forEach(link => {
        if (link.getAttribute('data-target') === targetViewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileTabBtns.forEach(btn => {
        if (btn.getAttribute('data-target') === targetViewId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update dedicated mobile header indicator badge
      const viewNames = {
        viewJobs: 'Jobs',
        viewCandidates: 'Candidates',
        viewSourcing: 'Smart Sourcing',
        viewMessages: 'Messages',
        viewAnalytics: 'Analytics'
      };
      const mobBadge = document.getElementById('jtEmpMobActiveViewBadge');
      if (mobBadge && viewNames[targetViewId]) {
        mobBadge.textContent = viewNames[targetViewId];
      }

      // Update active link in mobile drawer
      document.querySelectorAll('.jt-emp-mob-drawer-link[data-target]').forEach(link => {
        if (link.getAttribute('data-target') === targetViewId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Persist active view in localStorage and URL hash
      try {
        localStorage.setItem('jt_emp_active_view', targetViewId);
        if (!skipState) {
          if (window.history && window.history.pushState) {
            window.history.pushState({ jt_emp_view: targetViewId }, '', '#' + targetViewId);
          } else if (window.history && window.history.replaceState) {
            window.history.replaceState(null, null, '#' + targetViewId);
          } else {
            window.location.hash = targetViewId;
          }
        }
      } catch (e) {}

      window.scrollTo({ top: 0 });
    }

    railLinks.forEach(link => {
      link.addEventListener('click', () => {
        const target = link.getAttribute('data-target');
        if (target) switchView(target);
      });
    });

    mobileTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) switchView(target);
      });
    });

    // Mobile Drawer Navigation Controllers
    window.toggleEmpMobileMenu = function () {
      const drawer = document.getElementById('jtEmpMobDrawerBackdrop');
      if (!drawer) return;
      const isOpen = drawer.classList.contains('active') || drawer.style.display === 'flex';
      if (isOpen) {
        window.closeEmpMobileMenu();
      } else {
        drawer.style.display = 'flex';
        drawer.classList.add('active');
        lockBackgroundScroll();
        try {
          window.history.pushState({ jt_emp_drawer: true }, '');
        } catch (e) {}
      }
    };

    window.closeEmpMobileMenu = function () {
      const drawer = document.getElementById('jtEmpMobDrawerBackdrop');
      if (drawer) {
        drawer.style.display = 'none';
        drawer.classList.remove('active');
      }
      unlockBackgroundScroll();
    };

    window.selectEmpMobView = function (viewId) {
      if (window.switchEmployerTab) {
        window.switchEmployerTab(viewId);
      }
      window.closeEmpMobileMenu();
    };

    window.openPostModalFromDrawer = function () {
      window.closeEmpMobileMenu();
      const postModal = document.getElementById('jtEmpPostJobModal');
      if (postModal) {
        postModal.classList.add('open');
        lockBackgroundScroll();
        try {
          window.history.pushState({ jt_emp_modal: true }, '');
        } catch (e) {}
      }
    };

    window.switchEmployerTab = switchView;

    // Restore active view on load from URL hash or localStorage
    const hash = window.location.hash ? window.location.hash.replace('#', '') : null;
    const saved = (hash && validViews.includes(hash)) ? hash : localStorage.getItem('jt_emp_active_view');
    if (saved && validViews.includes(saved)) {
      switchView(saved, true);
    }

    // Comprehensive Mobile Browser / Android Hardware Back Button Controller
    window.addEventListener('popstate', function (e) {
      // 1. If any modal is open -> close modal
      const openModals = document.querySelectorAll('.jt-emp-modal-backdrop.open, .jt-emp-modal-backdrop[style*="flex"], .jt-emp-modal-backdrop[style*="block"]');
      if (openModals.length > 0) {
        openModals.forEach(m => {
          m.classList.remove('open');
          m.style.display = 'none';
        });
        if (typeof unlockBackgroundScroll === 'function') unlockBackgroundScroll();
        return;
      }

      // 2. If mobile drawer is open -> close drawer
      const drawer = document.getElementById('jtEmpMobDrawerBackdrop');
      if (drawer && (drawer.classList.contains('active') || drawer.style.display === 'flex' || drawer.style.display === 'block')) {
        drawer.style.display = 'none';
        drawer.classList.remove('active');
        if (typeof unlockBackgroundScroll === 'function') unlockBackgroundScroll();
        return;
      }

      // 3. If in mobile chat drilldown -> exit mobile chat back to conversation list
      const chatContainer = document.getElementById('jtEmpChatContainer');
      if (chatContainer && chatContainer.classList.contains('mobile-chat-active')) {
        chatContainer.classList.remove('mobile-chat-active');
        return;
      }

      // 4. Switch to view specified in state or hash
      const curHash = window.location.hash ? window.location.hash.replace('#', '') : null;
      const target = (e.state && e.state.jt_emp_view) || (curHash && validViews.includes(curHash) ? curHash : 'viewJobs');
      switchView(target, true);
    });
  }

  // --- View 1: Jobs Management Table Controller ---
  function initJobsView() {
    const tableBody = document.getElementById('jtJobsTableBody');
    const statusTabs = document.querySelectorAll('.jt-status-tab');
    const searchInput = document.getElementById('jtJobsTableSearch');
    let currentStatus = 'active';

    function closeAllActionMenus() {
      document.querySelectorAll('.jt-job-action-menu').forEach(m => m.classList.remove('show'));
    }

    function renderJobs() {
      if (!tableBody) return;
      const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

      const filtered = allJobs.filter(job => {
        const matchStatus = (job.status === currentStatus);
        const matchQuery = !query || 
          job.title.toLowerCase().includes(query) || 
          job.location.toLowerCase().includes(query) || 
          job.department.toLowerCase().includes(query);
        return matchStatus && matchQuery;
      });

      // Update tab counts
      const countActive = allJobs.filter(j => j.status === 'active').length;
      const countPaused = allJobs.filter(j => j.status === 'paused').length;
      const countClosed = allJobs.filter(j => j.status === 'closed').length;

      const elAct = document.getElementById('jtCountActive');
      const elPau = document.getElementById('jtCountPaused');
      const elClo = document.getElementById('jtCountClosed');
      const elRail = document.getElementById('jtRailJobsCount');
      const elMob = document.getElementById('jtMobileJobsCount');

      if (elAct) elAct.textContent = countActive;
      if (elPau) elPau.textContent = countPaused;
      if (elClo) elClo.textContent = countClosed;
      if (elRail) elRail.textContent = countActive;
      if (elMob) elMob.textContent = countActive;

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; padding:36px; color:#64748b;">
              No ${currentStatus} jobs found matching your search.
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = filtered.map(job => {
        const p = job.pipeline || { awaiting: 0, reviewing: 0, interviewing: 0, hired: 0 };
        const sponsorBadge = job.sponsored 
          ? `<span class="jt-badge-sponsored">Sponsored</span>`
          : `<span class="jt-badge-organic">Organic</span>`;

        return `
          <tr data-job-id="${job.id}">
            <td>
              <span class="jt-job-cell-title">${job.title}</span>
              <span class="jt-job-cell-meta">${job.location} • ${job.exp} • ${job.salary}</span>
            </td>
            <td>
              <div class="jt-pipeline-cluster">
                <button type="button" class="jt-pipeline-stage-btn ${p.awaiting > 0 ? 'jt-stage-highlight' : ''}" onclick="window.viewStageFromJob('${job.id}', 'awaiting')">
                  <strong>${p.awaiting}</strong> Awaiting
                </button>
                <button type="button" class="jt-pipeline-stage-btn" onclick="window.viewStageFromJob('${job.id}', 'reviewing')">
                  <strong>${p.reviewing}</strong> Reviewing
                </button>
                <button type="button" class="jt-pipeline-stage-btn" onclick="window.viewStageFromJob('${job.id}', 'interviewing')">
                  <strong>${p.interviewing}</strong> Interview
                </button>
                <button type="button" class="jt-pipeline-stage-btn" onclick="window.viewStageFromJob('${job.id}', 'hired')">
                  <strong>${p.hired}</strong> Hired
                </button>
              </div>
            </td>
            <td>${sponsorBadge}</td>
            <td style="color:#64748b; font-size:12px;">${job.postedDate || 'Recent'}</td>
            <td class="jt-action-cell">
              <div style="display:inline-flex; gap:6px; align-items:center;">
                <button type="button" class="jt-btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="window.toggleJobStatus('${job.id}')">
                  ${job.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button type="button" class="jt-action-dots-btn" title="Actions" onclick="window.toggleActionMenu(event, '${job.id}')">⋮</button>
              </div>
              <div class="jt-job-action-menu" id="menu-${job.id}">
                <button type="button" class="jt-job-action-opt" onclick="window.openEditJobModal('${job.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  <span>Edit Requisition</span>
                </button>
                <button type="button" class="jt-job-action-opt" onclick="window.viewStageFromJob('${job.id}', 'awaiting')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  <span>View Applicants (${p.awaiting + p.reviewing})</span>
                </button>
                <button type="button" class="jt-job-action-opt" onclick="window.toggleJobStatus('${job.id}')">
                  ${job.status === 'active' 
                    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg><span>Pause Requisition</span>` 
                    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Reactivate Requisition</span>`}
                </button>
                <button type="button" class="jt-job-action-opt" onclick="window.toggleJobSponsorship('${job.id}')">
                  ${job.sponsored 
                    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg><span>Make Organic</span>` 
                    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><span>Sponsor Requisition</span>`}
                </button>
                <div style="height:1px; background:#f1f5f9; margin:4px 0;"></div>
                <button type="button" class="jt-job-action-opt danger" onclick="window.openDeleteJobModal('${job.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  <span>Delete Requisition</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }

    statusTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        statusTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentStatus = tab.getAttribute('data-status') || 'active';
        renderJobs();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', renderJobs);
    }

    // Toggle Action Menu Popup
    window.toggleActionMenu = function (e, jobId) {
      e.stopPropagation();
      const menu = document.getElementById(`menu-${jobId}`);
      if (!menu) return;
      const isShown = menu.classList.contains('show');
      closeAllActionMenus();
      if (!isShown) menu.classList.add('show');
    };

    document.addEventListener('click', closeAllActionMenus);

    // Export function
    window.exportJobsCsv = function () {
      const csv = ['Job Title,Location,Department,Experience,Salary,Status,Sponsored,Date Posted'];
      allJobs.forEach(j => {
        csv.push(`"${j.title}","${j.location}","${j.department}","${j.exp}","${j.salary}","${j.status}","${j.sponsored ? 'Yes' : 'No'}","${j.postedDate}"`);
      });
      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MoveONN_Jobs_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      showToast('Exported jobs requisition report.');
    };

    // Toggle job status
    window.toggleJobStatus = function (jobId) {
      closeAllActionMenus();
      const job = allJobs.find(j => j.id === jobId);
      if (!job) return;
      if (job.status === 'active') {
        job.status = 'paused';
        showToast(`Requisition "${job.title}" paused.`);
      } else {
        job.status = 'active';
        showToast(`Requisition "${job.title}" reactivated.`);
      }
      saveJobs(allJobs);
      renderJobs();
    };

    // Toggle job sponsorship
    window.toggleJobSponsorship = function (jobId) {
      closeAllActionMenus();
      const job = allJobs.find(j => j.id === jobId);
      if (!job) return;
      job.sponsored = !job.sponsored;
      saveJobs(allJobs);
      renderJobs();
      showToast(job.sponsored ? `Requisition "${job.title}" is now Sponsored (3x visibility).` : `Requisition "${job.title}" is now Organic.`);
    };

    window.viewStageFromJob = function (jobId, stage) {
      closeAllActionMenus();
      window.switchEmployerTab('viewCandidates');
      const stageChips = document.querySelectorAll('.jt-stage-chip');
      stageChips.forEach(chip => {
        if (chip.getAttribute('data-stage') === stage) chip.click();
      });
    };

    // Edit Job Modal Open
    const editModal = document.getElementById('jtEmpEditJobModal');
    const editForm = document.getElementById('jtEmpEditJobForm');
    const editCloseBtn = document.getElementById('jtEmpEditJobClose');
    const editCancelBtn = document.getElementById('jtEmpEditJobCancel');

    window.openEditJobModal = function (jobId) {
      closeAllActionMenus();
      const job = allJobs.find(j => j.id === jobId);
      if (!job || !editModal) return;

      document.getElementById('jtEditJobId').value = job.id;
      document.getElementById('jtEditJobTitle').value = job.title;
      document.getElementById('jtEditJobDept').value = job.department;
      document.getElementById('jtEditJobLoc').value = job.location;
      document.getElementById('jtEditJobSalary').value = job.salary;

      editModal.classList.add('open');
      lockBackgroundScroll();
    };

    function closeEditModal() {
      if (editModal) editModal.classList.remove('open');
      unlockBackgroundScroll();
    }
    if (editCloseBtn) editCloseBtn.addEventListener('click', closeEditModal);
    if (editCancelBtn) editCancelBtn.addEventListener('click', closeEditModal);
    if (editModal) {
      editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
      });
    }

    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('jtEditJobId').value;
        const job = allJobs.find(j => j.id === id);
        if (job) {
          job.title = document.getElementById('jtEditJobTitle').value.trim();
          job.department = document.getElementById('jtEditJobDept').value.trim();
          job.location = document.getElementById('jtEditJobLoc').value.trim();
          job.salary = document.getElementById('jtEditJobSalary').value.trim();
          saveJobs(allJobs);
          renderJobs();
          closeEditModal();
          showToast(`Requisition "${job.title}" updated successfully.`);
        }
      });
    }

    // Delete Requisition Confirmation Modal
    const deleteModal = document.getElementById('jtEmpDeleteJobModal');
    const deleteTitleEl = document.getElementById('jtDeleteJobTitle');
    const deleteCloseBtn = document.getElementById('jtEmpDeleteJobClose');
    const deleteCancelBtn = document.getElementById('jtEmpDeleteJobCancel');
    const deleteConfirmBtn = document.getElementById('jtEmpDeleteJobConfirmBtn');

    window.openDeleteJobModal = function (jobId) {
      closeAllActionMenus();
      const job = allJobs.find(j => j.id === jobId);
      if (!job || !deleteModal) return;
      deletingJobId = jobId;
      if (deleteTitleEl) deleteTitleEl.textContent = `"${job.title}"`;
      deleteModal.classList.add('open');
      lockBackgroundScroll();
    };

    function closeDeleteModal() {
      if (deleteModal) deleteModal.classList.remove('open');
      deletingJobId = null;
      unlockBackgroundScroll();
    }
    if (deleteCloseBtn) deleteCloseBtn.addEventListener('click', closeDeleteModal);
    if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteModal);
    if (deleteModal) {
      deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
      });
    }

    if (deleteConfirmBtn) {
      deleteConfirmBtn.addEventListener('click', () => {
        if (!deletingJobId) return;
        const idx = allJobs.findIndex(j => j.id === deletingJobId);
        if (idx !== -1) {
          const removed = allJobs.splice(idx, 1)[0];
          saveJobs(allJobs);
          renderJobs();
          closeDeleteModal();
          showToast(`Requisition "${removed.title}" deleted.`);
        }
      });
    }

    renderJobs();
    window.refreshJobsTable = renderJobs;
  }

  // --- View 2: Candidate ATS Pipeline Controller ---
  function initCandidatesView() {
    const grid = document.getElementById('jtCandCardsGrid');
    const stageChips = document.querySelectorAll('.jt-stage-chip');
    const jobFilter = document.getElementById('jtCandJobFilter');
    let currentStage = 'all';

    function renderCandidates() {
      if (!grid) return;
      const selectedJob = jobFilter ? jobFilter.value : 'all';

      const filtered = CANDIDATES.filter(cand => {
        const matchStage = (currentStage === 'all' || cand.stage === currentStage);
        const matchJob = (selectedJob === 'all' || cand.jobId === selectedJob);
        return matchStage && matchJob;
      });

      // Update chip counts
      const counts = { all: CANDIDATES.length, awaiting: 0, reviewing: 0, interviewing: 0, hired: 0, rejected: 0 };
      CANDIDATES.forEach(c => {
        if (counts[c.stage] !== undefined) counts[c.stage]++;
      });

      stageChips.forEach(chip => {
        const s = chip.getAttribute('data-stage');
        const count = counts[s] || 0;
        const label = s.charAt(0).toUpperCase() + s.slice(1);
        chip.textContent = `${s === 'all' ? 'All Stages' : (s === 'awaiting' ? 'Awaiting Review' : label)} (${count})`;
      });

      const elRail = document.getElementById('jtRailCandCount');
      const elMob = document.getElementById('jtMobileCandCount');
      if (elRail) elRail.textContent = CANDIDATES.length;
      if (elMob) elMob.textContent = CANDIDATES.length;

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding:48px; background:#fff; border-radius:8px; border:1px solid #e2e8f0; color:#64748b;">
            No candidates in stage "${currentStage}".
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(cand => {
        return `
          <div class="jt-cand-card" data-cand-id="${cand.id}">
            <div class="jt-cand-card-head">
              <div>
                <h3 class="jt-cand-name">${cand.name}</h3>
                <div class="jt-cand-title">${cand.title}</div>
              </div>
              <span class="jt-match-score-badge">${cand.matchScore}% Match</span>
            </div>

            <div class="jt-cand-meta-row">
              <span style="display:inline-flex; align-items:center; gap:4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                ${cand.exp}
              </span>
              <span style="display:inline-flex; align-items:center; gap:4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a4.5 4.5 0 0 0 0-9H6"></path></svg>
                ${cand.ctc}
              </span>
              <span style="display:inline-flex; align-items:center; gap:4px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${cand.location.split('(')[0].trim()}
              </span>
            </div>

            <div class="jt-cand-quals-list">
              ${cand.skills.map(sk => `<span class="jt-qual-chip">${sk}</span>`).join('')}
            </div>

            <div class="jt-cand-card-actions">
              <select class="jt-cand-stage-select" onchange="window.updateCandidateStage('${cand.id}', this.value)" aria-label="Change candidate hiring stage">
                <option value="awaiting" ${cand.stage === 'awaiting' ? 'selected' : ''}>Awaiting Review</option>
                <option value="reviewing" ${cand.stage === 'reviewing' ? 'selected' : ''}>Reviewing</option>
                <option value="interviewing" ${cand.stage === 'interviewing' ? 'selected' : ''}>Interview Scheduled</option>
                <option value="hired" ${cand.stage === 'hired' ? 'selected' : ''}>Hired</option>
                <option value="rejected" ${cand.stage === 'rejected' ? 'selected' : ''}>Archived / Rejected</option>
              </select>

              <div class="jt-cand-action-group">
                <button type="button" class="jt-btn-ghost-sm" onclick="window.openResumeModal('${cand.name}', '${cand.title}', '${cand.exp}', '${cand.ctc}', '${cand.location}', '${cand.id}')">Resume</button>
                <button type="button" class="jt-btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="window.startChatWithCandidate('${cand.id}')">Message</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    stageChips.forEach(chip => {
      chip.addEventListener('click', () => {
        stageChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentStage = chip.getAttribute('data-stage') || 'all';
        renderCandidates();
      });
    });

    if (jobFilter) {
      jobFilter.addEventListener('change', renderCandidates);
    }

    window.updateCandidateStage = function (candId, newStage) {
      const cand = CANDIDATES.find(c => c.id === candId);
      if (cand) {
        cand.stage = newStage;
        showToast(`${cand.name} moved to stage "${newStage}".`);
        renderCandidates();
      }
    };

    window.startChatWithCandidate = function (candId) {
      if (!CHAT_CONVERSATIONS[candId]) {
        const cand = CANDIDATES.find(c => c.id === candId);
        if (cand) {
          const initials = cand.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          CHAT_CONVERSATIONS[candId] = {
            candidateName: cand.name,
            candidateRole: `Applicant for ${cand.title}`,
            avatar: initials,
            messages: [
              { sender: 'them', text: `Hello, thank you for reviewing my profile for the ${cand.title} role.`, time: 'Yesterday at 4:30 PM' },
              { sender: 'me', text: `Hi ${cand.name.split(' ')[0]}! Your background in ${cand.skills.slice(0, 3).join(', ')} is impressive. We would love to discuss next steps.`, time: 'Yesterday at 5:15 PM' },
              { sender: 'them', text: `That sounds great! I am available this week for a technical briefing.`, time: 'Today at 10:14 AM' }
            ]
          };
        }
      }
      activeChatCandidateId = candId;
      window.switchEmployerTab('viewMessages');
      if (window.loadActiveChat) window.loadActiveChat(candId);
    };

    renderCandidates();
  }

  // --- View 3: Smart Sourcing & Resume Search Controller ---
  function initSourcingView() {
    const resultsWrap = document.getElementById('jtSourcingResults');
    const keywordInput = document.getElementById('jtSourcingKeywordInput');
    const filterBtn = document.getElementById('jtSourcingFilterBtn');
    const tagChips = document.querySelectorAll('.jt-tag-chip');

    function renderSourcing(query) {
      if (!resultsWrap) return;
      const q = (query || '').toLowerCase().trim();

      const filtered = SOURCING_TALENT.filter(t => {
        if (!q) return true;
        return t.name.toLowerCase().includes(q) ||
          t.role.toLowerCase().includes(q) ||
          t.skills.some(s => s.toLowerCase().includes(q));
      });

      if (filtered.length === 0) {
        resultsWrap.innerHTML = `
          <div style="text-align:center; padding:40px; background:#fff; border-radius:8px; border:1px solid #e2e8f0; color:#64748b;">
            No verified profiles found matching "${q}". Try keywords like "React", "AWS", "Python", or "DevOps".
          </div>
        `;
        return;
      }

      resultsWrap.innerHTML = filtered.map(item => {
        const initials = item.name.split(' ').map(n => n[0]).join('');
        return `
          <div class="jt-sourcing-card">
            <div class="jt-sourcing-info-left">
              <div class="jt-sourcing-avatar">${initials}</div>
              <div>
                <strong style="font-size:15px; color:#1e293b; display:block;">${item.name}</strong>
                <span style="font-size:12px; color:#004687; font-weight:600;">${item.role}</span>
                <div style="font-size:11px; color:#64748b; margin-top:3px;">
                  ${item.location} • ${item.exp} • <span style="color:#16a34a; font-weight:700;">${item.status}</span>
                </div>
                <div style="display:flex; gap:4px; margin-top:8px; flex-wrap:wrap;">
                  ${item.skills.map(s => `<span class="jt-pill">${s}</span>`).join('')}
                </div>
              </div>
            </div>
            <div>
              <button type="button" class="jt-btn-primary" onclick="window.inviteCandidate('${item.name}')">
                Invite to Apply
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (keywordInput) {
      keywordInput.addEventListener('input', () => renderSourcing(keywordInput.value));
    }
    if (filterBtn) {
      filterBtn.addEventListener('click', () => renderSourcing(keywordInput ? keywordInput.value : ''));
    }

    tagChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.getAttribute('data-query');
        if (keywordInput) keywordInput.value = q;
        renderSourcing(q);
      });
    });

    window.inviteCandidate = function (name) {
      showToast(`Interview invitation & job link dispatched to ${name}.`);
    };

    renderSourcing('');
  }

  // --- View 4: Messages Hub (Split-Panel Recruiter Chat) ---
  function initMessagesView() {
    const threadsWrap = document.getElementById('jtEmpChatThreads');
    const chatStream = document.getElementById('jtEmpChatStream');
    const chatForm = document.getElementById('jtEmpChatForm');
    const chatInput = document.getElementById('jtEmpChatInput');
    const headName = document.getElementById('jtChatHeadName');
    const headRole = document.getElementById('jtChatHeadRole');
    const headAvatar = document.getElementById('jtChatHeadAvatar');

    function renderThreads() {
      if (!threadsWrap) return;
      const countEl = document.getElementById('jtActiveThreadsCount');
      if (countEl) {
        countEl.textContent = `${Object.keys(CHAT_CONVERSATIONS).length} Active`;
      }
      threadsWrap.innerHTML = Object.keys(CHAT_CONVERSATIONS).map(id => {
        const c = CHAT_CONVERSATIONS[id];
        const lastMsg = c.messages[c.messages.length - 1];
        const isActive = (id === activeChatCandidateId);

        return `
          <div class="jt-thread-item ${isActive ? 'active' : ''}" onclick="window.selectChatThread('${id}')">
            <div class="jt-thread-avatar-circle">${c.avatar}</div>
            <div class="jt-thread-details">
              <div class="jt-thread-top">
                <span class="jt-thread-name">${c.candidateName}</span>
                <span class="jt-thread-time">${lastMsg ? lastMsg.time.split('at')[0] : ''}</span>
              </div>
              <div class="jt-thread-preview">${lastMsg ? (lastMsg.sender === 'me' ? 'You: ' : '') + lastMsg.text : 'No messages yet'}</div>
            </div>
          </div>
        `;
      }).join('');
    }

    let selectedMessageIndices = new Set();
    let isSelectionMode = false;

    function loadActiveChat(candId) {
      if (!candId) {
        const keys = Object.keys(CHAT_CONVERSATIONS);
        if (keys.length > 0) candId = keys[0];
      }
      if (!candId) {
        if (headName) headName.textContent = 'No conversation selected';
        if (headRole) headRole.textContent = '';
        if (headAvatar) headAvatar.textContent = '--';
        if (chatStream) chatStream.innerHTML = '<div style="text-align:center; padding:40px; color:#64748b;">No conversations remaining.</div>';
        renderThreads();
        return;
      }

      if (!CHAT_CONVERSATIONS[candId]) {
        const cand = CANDIDATES.find(c => c.id === candId);
        if (cand) {
          const initials = cand.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          CHAT_CONVERSATIONS[candId] = {
            candidateName: cand.name,
            candidateRole: `Applicant for ${cand.title}`,
            avatar: initials,
            messages: [
              { sender: 'them', text: `Hello, thank you for reviewing my profile for the ${cand.title} role.`, time: 'Yesterday at 4:30 PM' },
              { sender: 'me', text: `Hi ${cand.name.split(' ')[0]}! Your background in ${cand.skills.slice(0, 3).join(', ')} is impressive. We would love to discuss next steps.`, time: 'Yesterday at 5:15 PM' },
              { sender: 'them', text: `That sounds great! I am available this week for a technical briefing.`, time: 'Today at 10:14 AM' }
            ]
          };
        }
      }

      activeChatCandidateId = candId;
      const conv = CHAT_CONVERSATIONS[candId];
      if (!conv || !chatStream) return;

      if (headName) headName.textContent = conv.candidateName;
      if (headRole) headRole.textContent = conv.candidateRole;
      if (headAvatar) headAvatar.textContent = conv.avatar;

      // Always reset selection mode when loading/switching chats
      if (isSelectionMode) {
        exitChatSelectionMode();
      }

      chatStream.innerHTML = conv.messages.map((m, idx) => {
        const isMe = (m.sender === 'me');
        const isDel = !!m.deleted;
        const isSelected = selectedMessageIndices.has(idx);
        return `
          <div class="jt-msg-row ${isMe ? 'outgoing' : 'incoming'} ${isSelected ? 'selected' : ''}" 
               data-msg-idx="${idx}" 
               oncontextmenu="window.handleMessageContextMenu(event, ${idx})"
               onclick="window.handleMessageRowClick(event, ${idx})"
               ontouchstart="window.handleEmpMsgTouchStart(event, ${idx})"
               ontouchmove="window.handleEmpMsgTouchMove(event)"
               ontouchend="window.handleEmpMsgTouchEnd(event)"
               ontouchcancel="window.handleEmpMsgTouchEnd(event)">
            <div class="jt-msg-checkbox" title="Select message">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="jt-msg-bubble ${isMe ? 'outgoing' : 'incoming'} ${isDel ? 'deleted' : ''}">
              <div>${m.text}</div>
              <span class="jt-msg-time">${m.time}</span>
            </div>
          </div>
        `;
      }).join('');

      chatStream.scrollTop = chatStream.scrollHeight;
      renderThreads();
    }

    // Mobile touch long-press (500ms) to trigger selection mode like WhatsApp
    let empTouchTimer = null;
    let empTouchStartX = 0;
    let empTouchStartY = 0;
    let empTouchTriggered = false;

    window.handleEmpMsgTouchStart = function (e, idx) {
      if (e.touches && e.touches.length === 1) {
        empTouchTriggered = false;
        empTouchStartX = e.touches[0].clientX;
        empTouchStartY = e.touches[0].clientY;
        empTouchTimer = setTimeout(() => {
          empTouchTriggered = true;
          if (navigator.vibrate) {
            try { navigator.vibrate(40); } catch(ex) {}
          }
          if (!isSelectionMode) {
            enterChatSelectionMode(idx);
          } else {
            toggleSelectMessage(idx);
          }
        }, 500);
      }
    };

    window.handleEmpMsgTouchMove = function (e) {
      if (empTouchTimer && e.touches && e.touches.length === 1) {
        const diffX = Math.abs(e.touches[0].clientX - empTouchStartX);
        const diffY = Math.abs(e.touches[0].clientY - empTouchStartY);
        if (diffX > 10 || diffY > 10) {
          clearTimeout(empTouchTimer);
          empTouchTimer = null;
        }
      }
    };

    window.handleEmpMsgTouchEnd = function (e) {
      if (empTouchTimer) {
        clearTimeout(empTouchTimer);
        empTouchTimer = null;
      }
      if (empTouchTriggered && e) {
        e.preventDefault();
      }
    };

    // Context menu (right click) on message to enter selection mode
    window.handleMessageContextMenu = function (e, idx) {
      e.preventDefault();
      if (!isSelectionMode) {
        enterChatSelectionMode(idx);
      } else {
        toggleSelectMessage(idx);
      }
    };

    window.handleMessageRowClick = function (e, idx) {
      if (isSelectionMode) {
        e.preventDefault();
        toggleSelectMessage(idx);
      }
    };

    function enterChatSelectionMode(initialIdx) {
      isSelectionMode = true;
      selectedMessageIndices.clear();
      if (initialIdx !== undefined) {
        selectedMessageIndices.add(initialIdx);
      }
      const selectionBar = document.getElementById('jtChatSelectionBar');
      const panelHead = document.getElementById('jtEmpChatHead');
      if (selectionBar) selectionBar.style.display = 'flex';
      if (panelHead) panelHead.style.display = 'none';
      if (chatStream) chatStream.classList.add('selection-mode');
      updateSelectionBar();
      updateMessageRowHighlights();
    }
    window.enterChatSelectionMode = enterChatSelectionMode;

    function exitChatSelectionMode() {
      isSelectionMode = false;
      selectedMessageIndices.clear();
      const selectionBar = document.getElementById('jtChatSelectionBar');
      const panelHead = document.getElementById('jtEmpChatHead');
      if (selectionBar) selectionBar.style.display = 'none';
      if (panelHead) panelHead.style.display = 'flex';
      if (chatStream) chatStream.classList.remove('selection-mode');
      updateMessageRowHighlights();
    }
    window.exitChatSelectionMode = exitChatSelectionMode;

    function toggleSelectMessage(idx) {
      if (selectedMessageIndices.has(idx)) {
        selectedMessageIndices.delete(idx);
      } else {
        selectedMessageIndices.add(idx);
      }
      if (selectedMessageIndices.size === 0) {
        exitChatSelectionMode();
        return;
      }
      updateSelectionBar();
      updateMessageRowHighlights();
    }

    function updateSelectionBar() {
      const countEl = document.getElementById('jtSelectionCount');
      if (countEl) {
        countEl.textContent = `${selectedMessageIndices.size} selected`;
      }
    }

    function updateMessageRowHighlights() {
      if (!chatStream) return;
      const rows = chatStream.querySelectorAll('.jt-msg-row');
      rows.forEach(r => {
        const idx = parseInt(r.getAttribute('data-msg-idx'), 10);
        if (selectedMessageIndices.has(idx)) {
          r.classList.add('selected');
        } else {
          r.classList.remove('selected');
        }
      });
    }

    window.promptDeleteSelectedMessages = function () {
      if (selectedMessageIndices.size === 0) return;
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (!conv) return;

      const allOutgoing = [...selectedMessageIndices].every(idx => {
        return conv.messages[idx] && conv.messages[idx].sender === 'me';
      });

      if (delForEveryoneBtn) {
        delForEveryoneBtn.style.display = allOutgoing ? 'block' : 'none';
      }
      if (delMsgModal) {
        delMsgModal.style.display = 'flex';
        delMsgModal.classList.add('open');
        lockBackgroundScroll();
      }
    };

    if (chatForm && chatInput) {
      // Auto-expanding multiline textarea (up to 120px)
      const adjustInputHeight = () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
      };

      chatInput.addEventListener('input', adjustInputHeight);

      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          chatForm.requestSubmit();
        }
      });

      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
        if (!conv) return;

        conv.messages.push({
          sender: 'me',
          text: text,
          time: 'Just now'
        });

        chatInput.value = '';
        chatInput.style.height = 'auto';
        loadActiveChat(activeChatCandidateId);
        showToast('Message sent to candidate.');

        // Simulated candidate response after 1.5 seconds
        setTimeout(() => {
          conv.messages.push({
            sender: 'them',
            text: 'Thank you for the update! I have noted this down.',
            time: 'Just now'
          });
          loadActiveChat(activeChatCandidateId);
        }, 1500);
      });
    }

    // --- WhatsApp-Style Message Deletion Modal Logic ---
    let pendingDeleteMsg = null;
    const delMsgModal = document.getElementById('jtEmpDeleteMsgModal');
    const delForEveryoneBtn = document.getElementById('jtDeleteForEveryoneBtn');
    const delForMeBtn = document.getElementById('jtDeleteForMeBtn');
    const delMsgCancelBtn = document.getElementById('jtDeleteMsgCancelBtn');

    window.promptDeleteMessage = function (candId, idx) {
      pendingDeleteMsg = { candId, idx };
      const conv = CHAT_CONVERSATIONS[candId];
      if (!conv || !conv.messages[idx]) return;
      const isMe = (conv.messages[idx].sender === 'me');
      if (delForEveryoneBtn) {
        delForEveryoneBtn.style.display = isMe ? 'block' : 'none';
      }
      if (delMsgModal) {
        delMsgModal.style.display = 'flex';
        delMsgModal.classList.add('open');
        lockBackgroundScroll();
      }
    };

    function closeDeleteMsgModal() {
      if (delMsgModal) {
        delMsgModal.style.display = 'none';
        delMsgModal.classList.remove('open');
      }
      pendingDeleteMsg = null;
      unlockBackgroundScroll();
    }
    window.closeDeleteMsgModal = closeDeleteMsgModal;

    if (delMsgCancelBtn) delMsgCancelBtn.addEventListener('click', closeDeleteMsgModal);
    if (delMsgModal) {
      delMsgModal.addEventListener('click', (e) => {
        if (e.target === delMsgModal) closeDeleteMsgModal();
      });
    }

    function deleteMessageForEveryone() {
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (!conv) return;

      if (isSelectionMode && selectedMessageIndices.size > 0) {
        selectedMessageIndices.forEach(idx => {
          if (conv.messages[idx]) {
            conv.messages[idx].deleted = true;
            conv.messages[idx].text = 'This message was deleted';
          }
        });
        showToast(`${selectedMessageIndices.size} message(s) deleted for everyone.`);
        exitChatSelectionMode();
        loadActiveChat(activeChatCandidateId);
      } else if (pendingDeleteMsg) {
        const { candId, idx } = pendingDeleteMsg;
        if (conv.messages[idx]) {
          conv.messages[idx].deleted = true;
          conv.messages[idx].text = 'This message was deleted';
          loadActiveChat(candId);
          showToast('Message deleted for everyone.');
        }
      }
      closeDeleteMsgModal();
    }
    window.deleteMessageForEveryone = deleteMessageForEveryone;

    function deleteMessageForMe() {
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (!conv) return;

      if (isSelectionMode && selectedMessageIndices.size > 0) {
        const sorted = [...selectedMessageIndices].sort((a, b) => b - a);
        sorted.forEach(idx => {
          conv.messages.splice(idx, 1);
        });
        showToast(`${sorted.length} message(s) deleted for you.`);
        exitChatSelectionMode();
        loadActiveChat(activeChatCandidateId);
      } else if (pendingDeleteMsg) {
        const { candId, idx } = pendingDeleteMsg;
        if (conv.messages[idx]) {
          conv.messages.splice(idx, 1);
          loadActiveChat(candId);
          showToast('Message deleted for you.');
        }
      }
      closeDeleteMsgModal();
    }
    window.deleteMessageForMe = deleteMessageForMe;

    if (delForEveryoneBtn) {
      delForEveryoneBtn.addEventListener('click', deleteMessageForEveryone);
    }

    if (delForMeBtn) {
      delForMeBtn.addEventListener('click', deleteMessageForMe);
    }

    // --- Chat 3-Dots Action Dropdown & Helpers ---
    window.toggleChatDropdown = function (e) {
      e.stopPropagation();
      const menu = document.getElementById('jtChatActionsMenu');
      if (!menu) return;
      const isShown = menu.classList.contains('show');
      document.querySelectorAll('.jt-job-action-menu').forEach(m => m.classList.remove('show'));
      if (!isShown) menu.classList.add('show');
    };

    // --- Clear Chat Confirmation Modal Logic ---
    const clearChatModal = document.getElementById('jtEmpClearChatModal');
    const clearChatCandNameEl = document.getElementById('jtClearChatCandidateName');

    window.openClearChatModal = function () {
      document.querySelectorAll('.jt-job-action-menu').forEach(m => m.classList.remove('show'));
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (!conv || !clearChatModal) return;
      if (clearChatCandNameEl) {
        clearChatCandNameEl.textContent = conv.candidateName;
      }
      clearChatModal.style.display = 'flex';
      clearChatModal.classList.add('open');
      lockBackgroundScroll();
    };

    window.closeClearChatModal = function () {
      if (clearChatModal) {
        clearChatModal.style.display = 'none';
        clearChatModal.classList.remove('open');
      }
      unlockBackgroundScroll();
    };

    window.confirmClearActiveChat = function () {
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (conv) {
        conv.messages = [];
        loadActiveChat(activeChatCandidateId);
        showToast('Chat history cleared.');
      }
      window.closeClearChatModal();
    };

    if (clearChatModal) {
      clearChatModal.addEventListener('click', (e) => {
        if (e.target === clearChatModal) window.closeClearChatModal();
      });
    }

    // --- Remove Candidate Confirmation Modal Logic ---
    const removeCandModal = document.getElementById('jtEmpRemoveCandModal');
    const removeCandNameEl = document.getElementById('jtRemoveCandName');

    window.openRemoveCandModal = function () {
      document.querySelectorAll('.jt-job-action-menu').forEach(m => m.classList.remove('show'));
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (!conv || !removeCandModal) return;
      if (removeCandNameEl) {
        removeCandNameEl.textContent = conv.candidateName;
      }
      removeCandModal.style.display = 'flex';
      removeCandModal.classList.add('open');
      lockBackgroundScroll();
    };

    window.closeRemoveCandModal = function () {
      if (removeCandModal) {
        removeCandModal.style.display = 'none';
        removeCandModal.classList.remove('open');
      }
      unlockBackgroundScroll();
    };

    window.confirmRemoveCandidateConversation = function () {
      const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
      if (!conv) {
        window.closeRemoveCandModal();
        return;
      }
      const name = conv.candidateName;
      delete CHAT_CONVERSATIONS[activeChatCandidateId];
      const remainingIds = Object.keys(CHAT_CONVERSATIONS);
      if (remainingIds.length > 0) {
        activeChatCandidateId = remainingIds[0];
        loadActiveChat(activeChatCandidateId);
      } else {
        activeChatCandidateId = null;
        if (headName) headName.textContent = 'No active conversation';
        if (headRole) headRole.textContent = '';
        if (headAvatar) headAvatar.textContent = '--';
        if (chatStream) chatStream.innerHTML = '<div style="text-align:center; padding:40px; color:#64748b;">No conversations remaining.</div>';
      }
      renderThreads();
      showToast(`Candidate ${name} removed from conversations.`);
      window.closeRemoveCandModal();
    };

    if (removeCandModal) {
      removeCandModal.addEventListener('click', (e) => {
        if (e.target === removeCandModal) window.closeRemoveCandModal();
      });
    }

    // Backwards-compatibility aliases
    window.clearActiveChat = window.openClearChatModal;
    window.removeActiveCandidateConversation = window.openRemoveCandModal;
    window.closeDeleteChatModal = window.closeRemoveCandModal;
    window.confirmDeleteChatConversation = window.confirmRemoveCandidateConversation;

    window.viewActiveCandidateProfile = function () {
      document.querySelectorAll('.jt-job-action-menu').forEach(m => m.classList.remove('show'));
      const cand = CANDIDATES.find(c => c.id === activeChatCandidateId);
      if (cand && window.openResumeModal) {
        window.openResumeModal(cand.name, cand.title, cand.exp, cand.ctc, cand.location, cand.id);
      } else {
        const conv = CHAT_CONVERSATIONS[activeChatCandidateId];
        if (conv && window.openResumeModal) {
          window.openResumeModal(conv.candidateName, conv.candidateRole, '5+ Years', 'Competitive CTC', 'India', activeChatCandidateId);
        }
      }
    };

    window.selectChatThread = function (id) {
      loadActiveChat(id);
      const container = document.getElementById('jtEmpChatContainer');
      if (container) {
        container.classList.add('mobile-chat-active');
        try {
          window.history.pushState({ jt_emp_view: 'viewMessages', jt_emp_chat: true, threadId: id }, '', '#viewMessages');
        } catch (e) {}
      }
    };

    window.exitEmpMobileChat = function () {
      const container = document.getElementById('jtEmpChatContainer');
      if (container) {
        container.classList.remove('mobile-chat-active');
        if (window.history.state && window.history.state.jt_emp_chat) {
          window.history.back();
        }
      }
    };

    window.loadActiveChat = loadActiveChat;
    renderThreads();
    loadActiveChat(activeChatCandidateId);
  }

  // --- Modals (Post a Job & Resume Preview) ---
  function initModals() {
    const postModal = document.getElementById('jtEmpPostJobModal');
    const postForm = document.getElementById('jtEmpPostJobForm');
    const postOpenBtns = [
      document.getElementById('jtRailPostJobBtn'),
      document.getElementById('jtEmpMobPostJobBtn'),
      document.getElementById('jtDrawerPostJobBtn')
    ];
    const postCloseBtn = document.getElementById('jtEmpPostJobClose');
    const postCancelBtn = document.getElementById('jtEmpPostJobCancel');

    function openPostModal() {
      if (postModal) {
        postModal.classList.add('open');
        lockBackgroundScroll();
      }
    }
    function closePostModal() {
      if (postModal) {
        postModal.classList.remove('open');
        unlockBackgroundScroll();
      }
    }

    postOpenBtns.forEach(btn => {
      if (btn) btn.addEventListener('click', openPostModal);
    });

    if (postCloseBtn) postCloseBtn.addEventListener('click', closePostModal);
    if (postCancelBtn) postCancelBtn.addEventListener('click', closePostModal);

    if (postModal) {
      postModal.addEventListener('click', (e) => {
        if (e.target === postModal) closePostModal();
      });
    }

    // Submit Job Requisition
    if (postForm) {
      postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('jtNewJobTitle').value.trim();
        const dept = document.getElementById('jtNewJobDept').value;
        const loc = document.getElementById('jtNewJobLoc').value.trim();
        const type = document.getElementById('jtNewJobType').value;
        const exp = document.getElementById('jtNewJobExp').value.trim();
        const salary = document.getElementById('jtNewJobSalary').value.trim();
        const desc = document.getElementById('jtNewJobDesc').value.trim();
        const isSponsor = document.getElementById('jtNewJobSponsor').checked;

        if (!title || !loc) {
          showToast('Please provide a job title and location.');
          return;
        }

        const newJob = {
          id: 'job-' + Date.now(),
          title: title,
          department: dept,
          location: `${loc} (${type})`,
          type: type,
          exp: exp,
          salary: salary,
          status: 'active',
          sponsored: isSponsor,
          postedDate: 'Today',
          pipeline: { awaiting: 0, reviewing: 0, interviewing: 0, hired: 0 }
        };

        allJobs.unshift(newJob);
        saveJobs(allJobs);
        closePostModal();
        postForm.reset();

        showToast(`Job Requisition "${title}" published successfully!`);
        if (window.refreshJobsTable) window.refreshJobsTable();
        window.switchEmployerTab('viewJobs');
      });
    }

    // Resume Preview Modal Controller
    const resumeModal = document.getElementById('jtResumePreviewModal');
    const resumeClose = document.getElementById('jtResumePreviewClose');
    const resumeDismiss = document.getElementById('jtResumePreviewDismiss');
    const resumeContact = document.getElementById('jtResumePreviewContactBtn');

    window.openResumeModal = function (name, role, exp, ctc, loc, candId) {
      const nameEl = document.getElementById('jtPreviewCandName');
      const roleEl = document.getElementById('jtPreviewCandRole');
      const expEl = document.getElementById('jtPreviewCandExp');
      const ctcEl = document.getElementById('jtPreviewCandCtc');
      const locEl = document.getElementById('jtPreviewCandLoc');

      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = `${role} • Verified Candidate`;
      if (expEl) expEl.textContent = `${exp} Exp`;
      if (ctcEl) ctcEl.textContent = ctc;
      if (locEl) locEl.textContent = loc;

      if (resumeModal) {
        resumeModal.classList.add('open');
        lockBackgroundScroll();
      }
    };

    function closeResumeModal() {
      if (resumeModal) {
        resumeModal.classList.remove('open');
        unlockBackgroundScroll();
      }
    }

    if (resumeClose) resumeClose.addEventListener('click', closeResumeModal);
    if (resumeDismiss) resumeDismiss.addEventListener('click', closeResumeModal);
    if (resumeModal) {
      resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) closeResumeModal();
      });
    }
    if (resumeContact) {
      resumeContact.addEventListener('click', () => {
        closeResumeModal();
        window.switchEmployerTab('viewMessages');
      });
    }

    // Top Notifications & Profile Dropdowns
    const notifBtn = document.getElementById('jtEmpNotifBtn');
    const notifMenu = document.getElementById('jtEmpNotifMenu');
    const avatarBtn = document.getElementById('jtEmpAvatarBtn');
    const profileMenu = document.getElementById('jtEmpProfileMenu');

    const profileWrap = document.getElementById('jtEmpProfileWrap');

    function closeAllMenus() {
      if (notifMenu) notifMenu.classList.remove('show');
      if (profileMenu) profileMenu.classList.remove('show');
      if (profileWrap) profileWrap.classList.remove('menu-open');
      if (avatarBtn) avatarBtn.classList.remove('active');
    }

    if (notifBtn && notifMenu) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = notifMenu.classList.contains('show');
        closeAllMenus();
        if (!open) notifMenu.classList.add('show');
      });
    }

    if (avatarBtn && profileMenu) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const workspace = document.getElementById('jtEmpWorkspace');
        const isCollapsed = workspace && workspace.classList.contains('rail-collapsed');

        if (isCollapsed) {
          // If sidebar rail is collapsed: expand sidebar AND open profile dropup
          workspace.classList.remove('rail-collapsed');
          localStorage.setItem('jt_emp_rail_collapsed', 'false');
          const toggleBtn = document.getElementById('jtRailCollapseToggle');
          if (toggleBtn) {
            const label = toggleBtn.querySelector('.jt-collapse-text');
            if (label) label.textContent = 'Collapse';
          }
          closeAllMenus();
          profileMenu.classList.add('show');
          if (profileWrap) profileWrap.classList.add('menu-open');
          avatarBtn.classList.add('active');
          return;
        }

        const open = profileMenu.classList.contains('show');
        closeAllMenus();
        if (!open) {
          profileMenu.classList.add('show');
          if (profileWrap) profileWrap.classList.add('menu-open');
          avatarBtn.classList.add('active');
        }
      });
    }

    document.addEventListener('click', closeAllMenus);
  }

  // --- Document Ready Initialization ---
  document.addEventListener('DOMContentLoaded', () => {
    initAccountIdentity();
    initRailCollapse();
    initNavigation();
    initJobsView();
    initCandidatesView();
    initSourcingView();
    initMessagesView();
    initModals();
  });

})();
