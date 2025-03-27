class Navbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.menuBtn = document.querySelector('.menu-btn');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        // Hamburger menu toggle
        this.menuBtn.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking a nav link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Active link highlighting
        window.addEventListener('scroll', () => this.highlightActiveLink());
    }

    toggleMenu() {
        this.navbar.classList.toggle('nav-open');
        this.menuBtn.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    closeMenu() {
        this.navbar.classList.remove('nav-open');
        this.menuBtn.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    highlightActiveLink() {
        const scrollPosition = window.scrollY + 100;
        
        this.navLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            if (sectionId.startsWith('#')) {
                const section = document.querySelector(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
});