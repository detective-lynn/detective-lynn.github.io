document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const collapseEl = document.getElementById('navbarExample01');
  const toggler = document.querySelector('.navbar-toggler');

  if (navbar) {
    const updateNavbarState = () => {
      navbar.classList.toggle('navbar-scrolled', window.scrollY > 8);
    };

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
  }

  if (!collapseEl || !toggler) return;

  const mobileBreakpoint = 992;
  const navLinks = collapseEl.querySelectorAll('.nav-link');
  const isMobileViewport = () => window.innerWidth < mobileBreakpoint;

  const syncExpandedState = (expanded) => {
    toggler.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    document.body.classList.toggle('mobile-nav-open', expanded && isMobileViewport());
  };

  const closeMenu = () => {
    if (!isMobileViewport() || !collapseEl.classList.contains('show')) return;

    if (window.mdb && window.mdb.Collapse) {
      window.mdb.Collapse.getOrCreateInstance(collapseEl, { toggle: false }).hide();
    } else {
      collapseEl.classList.remove('show');
      collapseEl.style.height = '';
      syncExpandedState(false);
    }
  };

  navLinks.forEach((item) => {
    item.addEventListener('click', () => {
      window.setTimeout(closeMenu, 120);
    });
  });

  document.addEventListener('click', (event) => {
    if (!isMobileViewport()) return;
    if (!collapseEl.classList.contains('show')) return;
    if (navbar.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  collapseEl.addEventListener('shown.mdb.collapse', () => {
    syncExpandedState(true);
  });

  collapseEl.addEventListener('hidden.mdb.collapse', () => {
    syncExpandedState(false);
  });

  toggler.addEventListener('click', () => {
    window.setTimeout(() => {
      syncExpandedState(collapseEl.classList.contains('show'));
    }, 180);
  });

  window.addEventListener('resize', () => {
    if (!isMobileViewport()) {
      collapseEl.classList.remove('show');
      collapseEl.style.height = '';
      syncExpandedState(false);
    }
  });
});
