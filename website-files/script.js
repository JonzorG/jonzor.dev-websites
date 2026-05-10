// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inject Personal Data from config.js
    if (typeof portfolioData !== 'undefined') {
        
        document.getElementById('profile-name').textContent = portfolioData.name;
        document.getElementById('profile-role').textContent = portfolioData.role;
        document.getElementById('profile-bio').textContent = portfolioData.bio;
        document.getElementById('footer-name').textContent = portfolioData.name;

        document.title = `Portfolio | ${portfolioData.name}`;

        document.getElementById('github-link').href = portfolioData.githubLink;
        document.getElementById('linkedin-link').href = portfolioData.linkedinLink;
        
    } else {
        console.error("config.js failed to load or portfolioData is missing.");
    }

    // 2. Automatically update the copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 3. Copy Email to Clipboard Logic
    const copyBtn = document.getElementById('copy-btn');
    const rawEmail = document.getElementById('raw-email');

    if (copyBtn && rawEmail) {
        copyBtn.addEventListener('click', () => {
            // Get the text from the span
            const emailText = rawEmail.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(emailText).then(() => {
                // Visual feedback
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.color = '#bb86fc';
                copyBtn.style.borderColor = '#bb86fc';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.color = '';
                    copyBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});
