class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.successMessage = document.getElementById('formSuccess');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: this.form.name.value,
            email: this.form.email.value,
            subject: this.form.subject.value,
            message: this.form.message.value
        };

        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // In production, replace with actual API endpoint
            const response = await fetch('https://api.example.com/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showSuccess();
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again later.');
        } finally {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            submitBtn.disabled = false;
        }
    }

    showSuccess() {
        this.form.classList.add('hidden');
        this.successMessage.classList.remove('hidden');
        
        setTimeout(() => {
            this.successMessage.classList.add('hidden');
            this.form.classList.remove('hidden');
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});