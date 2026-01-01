/**
 * Mobile Navigation Handler for XSSNow
 * Handles mobile menu toggle, touch interactions, and responsive navigation
 */

class MobileNavigation {
    constructor() {
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;

        this.init();
    }

    init() {
        this.setupMobileMenuToggle();
        this.setupNavLinkClicks();
        this.setupOutsideClick();
        this.handleResize();

        // Listen for window resize to handle orientation changes
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });
    }

    setupMobileMenuToggle() {
        if (this.mobileMenuToggle && this.navMenu) {
            this.mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Prevent menu clicks from bubbling
            this.navMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupNavLinkClicks() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close mobile menu when a link is clicked
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            // Close menu if clicking outside
            if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.mobileMenuToggle.classList.add('active');
        this.navMenu.classList.add('active');
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    handleResize() {
        // Close mobile menu on desktop resize
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }

        // Fix viewport height on mobile browsers
        this.updateViewportHeight();
    }

    updateViewportHeight() {
        // Fix for mobile browsers where 100vh doesn't account for address bar
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
}

// Touch gesture handler for better mobile experience
class TouchGestureHandler {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.threshold = 100; // Minimum distance for swipe

        this.init();
    }

    init() {
        // Swipe to close mobile menu
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    handleTouchStart(e) {
        this.startX = e.changedTouches[0].screenX;
        this.startY = e.changedTouches[0].screenY;
    }

    handleTouchEnd(e) {
        if (!this.startX || !this.startY) return;

        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;

        const diffX = this.startX - endX;
        const diffY = this.startY - endY;

        // Check if it's a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.threshold) {
            // Swipe left to close menu (if menu is open)
            if (diffX > 0 && window.mobileNav && window.mobileNav.isMenuOpen) {
                window.mobileNav.closeMobileMenu();
            }
        }

        this.startX = 0;
        this.startY = 0;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.mobileNav = new MobileNavigation();
    window.touchGestures = new TouchGestureHandler();
});

// Re-initialize after any dynamic content changes
window.addEventListener('load', () => {
    if (!window.mobileNav) {
        window.mobileNav = new MobileNavigation();
        window.touchGestures = new TouchGestureHandler();
    }
});