// resume-actions.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const downloadBtn = document.querySelector('.download-btn');
    const printBtn = document.querySelector('.print-btn');
    const shareBtn = document.querySelector('.share-btn');
    const resumeIframe = document.querySelector('.resume-iframe');
    
    // Configuration
    const RESUME_PDF = 'public/resume.pdf';
    const RESUME_FILENAME = 'Aditya_Gajbhiye_Resume.pdf';
    const SHARE_DATA = {
        title: 'Aditya Gajbhiye - Resume',
        text: 'Check out Aditya Gajbhiye\'s professional resume',
        url: window.location.href // Update this if you have direct PDF link
    };

    // 1. Download Functionality
    downloadBtn.addEventListener('click', handleDownload);

    function handleDownload() {
        // Method 1: Preferred approach using fetch (handles large files better)
        fetch(RESUME_PDF)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                triggerDownload(url);
                URL.revokeObjectURL(url); // Clean up
            })
            .catch(error => {
                console.error('Download error:', error);
                // Fallback to simple method if fetch fails
                triggerDownload(RESUME_PDF);
            });
    }

    function triggerDownload(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = RESUME_FILENAME;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Analytics/Logging
        console.log('Resume downloaded successfully');
    }

    // 2. Print Functionality
    printBtn.addEventListener('click', handlePrint);

    function handlePrint() {
        // Check if iframe is loaded and has content
        if (resumeIframe.contentDocument && resumeIframe.contentDocument.readyState === 'complete') {
            try {
                resumeIframe.contentWindow.focus();
                resumeIframe.contentWindow.print();
            } catch (e) {
                console.warn('Iframe print failed, using fallback:', e);
                printFallback();
            }
        } else {
            printFallback();
        }
    }

    function printFallback() {
        const printWindow = window.open(RESUME_PDF, '_blank');
        if (!printWindow) {
            alert('Please allow pop-ups to print the resume');
        } else {
            printWindow.onload = function() {
                setTimeout(() => {
                    printWindow.print();
                }, 500); // Small delay to ensure PDF is loaded
            };
        }
    }

    // 3. Share Functionality
    shareBtn.addEventListener('click', handleShare);

    async function handleShare() {
        // Check if Web Share API is supported
        if (navigator.share && navigator.canShare(SHARE_DATA)) {
            try {
                await navigator.share(SHARE_DATA);
                console.log('Share successful');
            } catch (err) {
                console.log('Error sharing:', err);
                if (err.name !== 'AbortError') {
                    showShareDialog();
                }
            }
        } else {
            showShareDialog();
        }
    }

    function showShareDialog() {
        // Create or show existing dialog
        let dialog = document.querySelector('.share-dialog');
        
        if (!dialog) {
            dialog = document.createElement('div');
            dialog.className = 'share-dialog';
            dialog.innerHTML = `
                <div class="share-overlay"></div>
                <div class="share-content">
                    <h4>Share Resume</h4>
                    <div class="share-options">
                        <button class="share-option" data-method="copy">
                            <i class="fas fa-copy"></i> Copy Link
                        </button>
                        <a class="share-option" href="mailto:?subject=${encodeURIComponent(SHARE_DATA.title)}&body=${encodeURIComponent(SHARE_DATA.text + '\n\n' + SHARE_DATA.url)}">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                        <a class="share-option" href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(SHARE_DATA.url)}&title=${encodeURIComponent(SHARE_DATA.title)}" target="_blank">
                            <i class="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a class="share-option" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_DATA.text)}&url=${encodeURIComponent(SHARE_DATA.url)}" target="_blank">
                            <i class="fab fa-twitter"></i> Twitter
                        </a>
                    </div>
                    <button class="apple-button close-share">Close</button>
                </div>
            `;
            document.body.appendChild(dialog);
            
            // Add event listeners
            dialog.querySelector('[data-method="copy"]').addEventListener('click', copyToClipboard);
            dialog.querySelector('.close-share').addEventListener('click', () => {
                dialog.classList.remove('active');
            });
            dialog.querySelector('.share-overlay').addEventListener('click', () => {
                dialog.classList.remove('active');
            });
        }
        
        dialog.classList.add('active');
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(SHARE_DATA.url);
            showToast('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            showToast('Failed to copy link');
        }
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Add styles dynamically if not already in CSS
    if (!document.querySelector('#resume-actions-styles')) {
        const style = document.createElement('style');
        style.id = 'resume-actions-styles';
        style.textContent = `
            .share-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .share-dialog.active {
                opacity: 1;
                visibility: visible;
            }
            .share-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(3px);
            }
            .share-content {
                position: relative;
                z-index: 1;
                background: var(--card-bg);
                padding: 25px;
                border-radius: 16px;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            .share-dialog.active .share-content {
                transform: translateY(0);
            }
            .share-content h4 {
                margin-top: 0;
                margin-bottom: 20px;
                color: var(--primary-color);
                text-align: center;
            }
            .share-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-bottom: 25px;
            }
            .share-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 15px;
                background: var(--bg-color);
                border-radius: 12px;
                text-decoration: none;
                color: var(--text-color);
                transition: all 0.2s ease;
                border: none;
                cursor: pointer;
                font-family: inherit;
            }
            .share-option:hover {
                background: var(--primary-light);
                transform: translateY(-2px);
            }
            .share-option i {
                font-size: 1.8rem;
                margin-bottom: 8px;
                color: var(--primary-color);
            }
            .close-share {
                width: 100%;
                padding: 12px;
                font-size: 1rem;
            }
            .toast-message {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 12px 25px;
                border-radius: 30px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10001;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .toast-message.show {
                opacity: 1;
            }
            
            @media (max-width: 480px) {
                .share-options {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
});