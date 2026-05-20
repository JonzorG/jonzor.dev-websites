document.addEventListener('DOMContentLoaded', () => {
    
    if (typeof portfolioData !== 'undefined') {
        
        document.getElementById('profile-name').textContent = portfolioData.name;
        document.getElementById('profile-role').textContent = portfolioData.role;
        document.getElementById('profile-bio').textContent = portfolioData.bio;
        document.getElementById('footer-name').textContent = portfolioData.name;

        document.title = `Portfolio | ${portfolioData.name}`;

        document.getElementById('github-link').href = portfolioData.githubLink;
        document.getElementById('linkedin-link').href = portfolioData.linkedinLink;
        
        const footerGithub = document.querySelector('.footer-github');
        const footerLinkedin = document.querySelector('.footer-linkedin');
        if (footerGithub) footerGithub.href = portfolioData.githubLink;
        if (footerLinkedin) footerLinkedin.href = portfolioData.linkedinLink;
        
    } else {
        console.error("config.js failed to load or portfolioData is missing.");
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const copyBtn = document.getElementById('copy-btn');
    const rawEmail = document.getElementById('raw-email');
    const copyText = document.getElementById('copy-text'); 

    if (copyBtn && rawEmail && copyText) {
        copyBtn.addEventListener('click', () => {
            const emailText = rawEmail.textContent;
            
            navigator.clipboard.writeText(emailText).then(() => {

                const originalText = copyText.textContent;
                copyText.textContent = 'Copied!';
                copyBtn.style.color = '#bb86fc';
                copyBtn.style.borderColor = '#bb86fc';
                
                setTimeout(() => {
                    copyText.textContent = originalText;
                    copyBtn.style.color = '';
                    copyBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }
});
