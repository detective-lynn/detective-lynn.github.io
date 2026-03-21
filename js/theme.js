document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  function updateIcon() {
    const isDark = htmlElement.getAttribute('data-theme') === 'dark';
    themeToggleBtn.textContent = isDark ? '\u263E' : '\u2600';
  }

  updateIcon();

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('site-theme', newTheme);
    updateIcon();
  });
});
