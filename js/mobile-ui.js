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

  const MOBILE_BP = 992;
  const isMobile = () => window.innerWidth < MOBILE_BP;

  const syncState = (open) => {
    toggler.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('mobile-nav-open', open && isMobile());
  };

  const openMenu = () => {
    if (!isMobile() || collapseEl.classList.contains('show')) return;
    collapseEl.classList.add('show');
    collapseEl.style.maxHeight = collapseEl.scrollHeight + 'px';
    syncState(true);
  };

  const closeMenu = () => {
    if (!isMobile() || !collapseEl.classList.contains('show')) return;
    collapseEl.style.maxHeight = '0';
    collapseEl.classList.remove('show');
    syncState(false);
  };

  const toggleMenu = () => {
    collapseEl.classList.contains('show') ? closeMenu() : openMenu();
  };

  toggler.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  collapseEl.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setTimeout(closeMenu, 100));
  });

  document.addEventListener('click', (e) => {
    if (!isMobile() || !collapseEl.classList.contains('show')) return;
    if (navbar.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) {
      collapseEl.classList.remove('show');
      collapseEl.style.maxHeight = '';
      syncState(false);
    }
  });
});
