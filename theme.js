// assets/js/theme.js

// Initialize theme from localStorage or default to light
function initializeTheme() {
  const body = document.body;
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Clean slate
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(`${savedTheme}-theme`);
  
  // Update all theme toggle buttons
  const themeBtns = document.querySelectorAll('.theme-btn');
  if (themeBtns.length > 0) {
    themeBtns.forEach(btn => {
      // Set initial state
      btn.classList.remove('light', 'dark');
      btn.classList.add(savedTheme === 'dark' ? 'dark' : 'light');
      
      // Add click handler
      btn.addEventListener('click', toggleTheme);
    });
  }
  
  // Update logo visibility
  updateLogoVisibility(savedTheme);
}

// Toggle between light and dark theme
function toggleTheme() {
  const body = document.body;
  const isDark = body.classList.contains('dark-theme');
  const newTheme = isDark ? 'light' : 'dark';
  
  // Update body class
  body.classList.replace(
    isDark ? 'dark-theme' : 'light-theme',
    isDark ? 'light-theme' : 'dark-theme'
  );
  
  // Update all theme buttons
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.classList.replace(
      isDark ? 'dark' : 'light',
      isDark ? 'light' : 'dark'
    );
  });
  
  // Save preference
  localStorage.setItem('theme', newTheme);
  
  // Update logo visibility
  updateLogoVisibility(newTheme);
}

// Update logo visibility based on theme
function updateLogoVisibility(theme) {
  const logoLight = document.querySelector('.logo-light');
  const logoDark = document.querySelector('.logo-dark');
  
  if (logoLight && logoDark) {
    if (theme === 'dark') {
      logoLight.style.display = 'none';
      logoDark.style.display = 'block';
    } else {
      logoLight.style.display = 'block';
      logoDark.style.display = 'none';
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTheme);

// Make functions available globally if needed
window.toggleTheme = toggleTheme;
window.initializeTheme = initializeTheme;