const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const html = document.documentElement;
const icon = themeToggle.querySelector('i');

// Check for saved theme preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
} else if (systemPrefersDark) {
    // Default to dark if system prefers dark (or if our default is dark)
    // Our default CSS is dark, so we don't strictly need to set data-theme="dark"
    // unless we want to be explicit.
    html.setAttribute('data-theme', 'dark');
    updateIcon('dark');
} else {
    // System prefers light
    html.setAttribute('data-theme', 'light');
    updateIcon('light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark'; // Assume dark if not set
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    if (theme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}
