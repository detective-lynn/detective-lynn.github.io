// static/js/theme.js
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement; 

  if (!themeToggleBtn) return; // 确保按钮存在

  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', 'dark'); // 默认黑夜模式
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('site-theme', newTheme);
  });
});