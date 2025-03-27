// Dynamic Component Loading
document.querySelectorAll('[data-include]').forEach(element => {
    const file = element.getAttribute('data-include');
    fetch(file)
        .then(response => response.text())
        .then(data => {
            element.innerHTML = data;
            // Load component-specific JS
            if (file.includes('navbar')) {
                const script = document.createElement('script');
                script.src = 'components/navbar/navbar.js';
                document.body.appendChild(script);
            }
        });
});

// Ultra-Premium Portfolio Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Dynamic Component Loading
    document.querySelectorAll('[data-include]').forEach(element => {
        const file = element.getAttribute('data-include');
        fetch(file)
            .then(response => response.text())
            .then(data => {
                element.innerHTML = data;
                // Execute any component-specific JS
                if (file.includes('navbar')) {
                    initNavbar();
                }
                if (file.includes('contact-form')) {
                    initContactForm();
                }
                if (file.includes('resume')) {
                    initResumeButtons();
                }
            });
    });

    // Theme Management
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });

    // Typing Animation
    const typingElements = document.querySelectorAll('.typing-animation');
    typingElements.forEach(el => {
        const words = JSON.parse(el.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                el.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(type, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, 500);
            } else {
                const speed = isDeleting ? 75 : 150;
                setTimeout(type, speed);
            }
        }
        
        setTimeout(type, 1000);
    });

    // GSAP Animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('.section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Animate project cards
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                x: i % 2 === 0 ? -50 : 50,
                duration: 0.8,
                scrollTrigger: {
                    trigger: card,
                    start: "top 75%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    // Load projects dynamically
    fetchProjects();

    // Build info
    if (process.env.NODE_ENV === 'production') {
        const commitHashElement = document.getElementById('commit-hash');
        if (commitHashElement) {
            commitHashElement.textContent = process.env.GIT_COMMIT_HASH;
        }
    }
});

// Initialize advanced navbar
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar || !menuBtn) return;
    
    // Hamburger menu animation
    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('nav-open');
        menuBtn.classList.toggle('open');
    });
    
    // Smooth scrolling with offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                navbar.classList.remove('nav-open');
                menuBtn.classList.remove('open');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize resume buttons
function initResumeButtons() {
    // Handle download button
    const downloadBtn = document.querySelector('.download-btn');
    if (downloadBtn) {
        downloadBtn.setAttribute('aria-label', 'Download resume in PDF format');
        downloadBtn.addEventListener('click', () => {
            // Show loading state
            const originalContent = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            downloadBtn.disabled = true;
            
            // Create download link
            const link = document.createElement('a');
            link.href = 'public/resume.pdf';
            link.download = 'Aditya_Gaiphiye_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Reset button after 2 seconds
            setTimeout(() => {
                downloadBtn.innerHTML = originalContent;
                downloadBtn.disabled = false;
            }, 2000);
        });
    }

    // Handle print button
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.setAttribute('aria-label', 'Print resume');
        printBtn.addEventListener('click', () => {
            const originalContent = printBtn.innerHTML;
            printBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
            printBtn.disabled = true;
            
            // Try printing the iframe content first
            const iframe = document.querySelector('.resume-iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    iframe.contentWindow.print();
                } catch (e) {
                    // Fallback to opening new window
                    window.open('public/resume.pdf', '_blank').print();
                }
            } else {
                // Fallback if iframe isn't ready
                window.open('public/resume.pdf', '_blank').print();
            }
            
            setTimeout(() => {
                printBtn.innerHTML = originalContent;
                printBtn.disabled = false;
            }, 2000);
        });
    }

    // PDF loading error handling
    const iframe = document.querySelector('.resume-iframe');
    if (iframe) {
        iframe.onerror = () => {
            console.error('Failed to load resume PDF');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'pdf-error';
            errorMsg.textContent = 'Failed to load resume. Please try again later.';
            iframe.parentNode.insertBefore(errorMsg, iframe);
            
            // Disable buttons if PDF fails to load
            if (downloadBtn) downloadBtn.disabled = true;
            if (printBtn) printBtn.disabled = true;
        };
    }
}

// Fetch projects from API
async function fetchProjects() {
    try {
        const response = await fetch('https://api.example.com/projects');
        if (!response.ok) throw new Error('Network response was not ok');
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        // Load fallback projects
        renderProjects(fallbackProjects);
    }
}

// Fallback projects data
const fallbackProjects = [
    {
        title: "Sample Project 1",
        technologies: ["HTML", "CSS", "JavaScript"],
        description: "A sample project description",
        image: "project1.jpg",
        link: "#"
    },
    {
        title: "Sample Project 2",
        technologies: ["React", "Node.js"],
        description: "Another sample project description",
        image: "project2.jpg",
        link: "#"
    }
];

function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = ''; // Clear existing projects
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="assets/images/projects/${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <h3>${project.title}</h3>
                    <p>${project.technologies.join(', ')}</p>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" class="project-link">View Details</a>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Initialize contact form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.example.com/contact', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                contactForm.innerHTML = '<div class="success-message">Thank you! Your message has been sent.</div>';
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            alert('There was an error sending your message. Please try again later.');
        }
    });
}