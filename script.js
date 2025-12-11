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
    // Default to dark if system prefers dark
    html.setAttribute('data-theme', 'dark');
    updateIcon('dark');
} else {
    // System prefers light
    html.setAttribute('data-theme', 'light');
    updateIcon('light');
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
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

// Carousel Logic
const carousel = document.querySelector('.projects-grid');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

if (carousel && leftBtn && rightBtn) {
    const originalCards = Array.from(carousel.children);

    // Clone items for infinite loop PREPEND
    // Use DocumentFragment to maintain order: [1,2,3,4] -> Insert [1,2,3,4] at start
    const fragmentBefore = document.createDocumentFragment();
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        fragmentBefore.appendChild(clone);
    });
    carousel.insertBefore(fragmentBefore, carousel.firstChild);

    // Clone items for infinite loop APPEND
    const fragmentAfter = document.createDocumentFragment();
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        fragmentAfter.appendChild(clone);
    });
    carousel.appendChild(fragmentAfter);

    let isTicking = false;

    // Helper to get consistent width of one full set of items
    const getSetWidth = () => {
        const firstCard = carousel.querySelector('.project-card');
        if (!firstCard) return 0;

        // Try to get computed gap
        const gridStyle = window.getComputedStyle(carousel);
        const gap = parseFloat(gridStyle.columnGap || gridStyle.gap) || 32;

        return (firstCard.offsetWidth + gap) * originalCards.length;
    };

    // Initialize scroll position to the middle set (Start of Original Set)
    const initScroll = () => {
        const setWidth = getSetWidth();
        if (setWidth > 0) {
            carousel.scrollLeft = setWidth;
        }
    };

    // Try initializing immediately if ready, or wait a bit
    requestAnimationFrame(() => {
        initScroll();
    });
    // Fallback for slower loads
    window.addEventListener('load', initScroll);

    carousel.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                handleScrollLoop();
                isTicking = false;
            });
            isTicking = true;
        }
    });

    function handleScrollLoop() {
        const currentScroll = carousel.scrollLeft;
        const setW = getSetWidth();

        if (setW === 0) return;

        // Tolerance for checking bounds
        // If we scroll into the first set (Clone Before), jump to Middle Set
        if (currentScroll <= 10) {
            carousel.style.scrollBehavior = 'auto';
            carousel.scrollLeft = currentScroll + setW;
            carousel.style.scrollBehavior = 'smooth';
        }
        // If we scroll into the third set (Clone After), jump back to Middle Set
        else if (currentScroll >= (setW * 2) - 10) {
            carousel.style.scrollBehavior = 'auto';
            carousel.scrollLeft = currentScroll - setW;
            carousel.style.scrollBehavior = 'smooth';
        }
    }

    leftBtn.addEventListener('click', () => {
        const scrollAmt = getScrollAmount();
        carousel.scrollBy({
            left: -scrollAmt,
            behavior: 'smooth'
        });
    });

    rightBtn.addEventListener('click', () => {
        const scrollAmt = getScrollAmount();
        carousel.scrollBy({
            left: scrollAmt,
            behavior: 'smooth'
        });
    });

    function getScrollAmount() {
        const card = carousel.querySelector('.project-card');
        if (!card) return 300;
        const gridStyle = window.getComputedStyle(carousel);
        const gap = parseFloat(gridStyle.columnGap || gridStyle.gap) || 32;
        return card.offsetWidth + gap;
    }
}
