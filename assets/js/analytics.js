class PortfolioAnalytics {
    constructor() {
        this.visitCount = 0;
        this.pageStartTime = Date.now();
        this.init();
    }

    init() {
        this.incrementVisitCount();
        this.trackPageTime();
        this.trackScrollDepth();
        this.trackOutboundLinks();
    }

    incrementVisitCount() {
        this.visitCount = localStorage.getItem('portfolioVisits') || 0;
        this.visitCount++;
        localStorage.setItem('portfolioVisits', this.visitCount);
    }

    trackPageTime() {
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.pageStartTime;
            console.log(`Time spent on page: ${Math.round(timeSpent/1000)} seconds`);
            // Send to analytics server in production
            if (process.env.NODE_ENV === 'production') {
                this.sendAnalytics('time_spent', timeSpent);
            }
        });
    }

    trackScrollDepth() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
            if (currentScroll > maxScroll) {
                maxScroll = currentScroll;
            }
        });

        window.addEventListener('beforeunload', () => {
            console.log(`Max scroll depth: ${Math.round(maxScroll)}%`);
            if (process.env.NODE_ENV === 'production') {
                this.sendAnalytics('scroll_depth', maxScroll);
            }
        });
    }

    trackOutboundLinks() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (link.href.indexOf(window.location.host) === -1) {
                link.addEventListener('click', (e) => {
                    console.log(`Outbound link clicked: ${link.href}`);
                    if (process.env.NODE_ENV === 'production') {
                        this.sendAnalytics('outbound_link', link.href);
                    }
                });
            }
        });
    }

    sendAnalytics(event, value) {
        // In production, replace with actual analytics API call
        fetch('https://api.example.com/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`
            },
            body: JSON.stringify({
                event,
                value,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                page: window.location.pathname
            })
        }).catch(error => console.error('Analytics error:', error));
    }
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    if (process.env.NODE_ENV === 'production') {
        new PortfolioAnalytics();
    }
});