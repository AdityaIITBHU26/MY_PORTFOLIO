class ContactForm {
    constructor() {
      this.form = document.getElementById('contactForm');
      this.successModal = document.getElementById('formSuccess');
      this.closeBtn = document.getElementById('closeSuccess');
      this.init();
    }
  
    init() {
      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
  
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.closeSuccess());
      }
  
      // Set current year in footer
      document.getElementById('current-year').textContent = new Date().getFullYear();
    }
  
    async handleSubmit(e) {
      e.preventDefault();
      
      const submitBtn = this.form.querySelector('.submit-btn');
      const originalBtnContent = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
  
      // Simulate form submission (replace with actual fetch in production)
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showSuccess();
        this.form.reset();
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
      } finally {
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
      }
    }
  
    showSuccess() {
      this.successModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Close modal after 5 seconds
      setTimeout(() => {
        this.closeSuccess();
      }, 5000);
    }
  
    closeSuccess() {
      this.successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    
    // Mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    
    if (navbarToggle && navbarLinks) {
      navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });
    }
    
    // Active link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightActiveLink() {
      const scrollPosition = window.scrollY + 100;
      
      navLinks.forEach(link => {
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
    
    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink();
  });