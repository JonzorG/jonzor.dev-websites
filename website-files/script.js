import { portfolioData } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const profileName = document.getElementById('profile-name');
    const profileRole = document.getElementById('profile-role');
    const profileBio = document.getElementById('profile-bio');
    const footerName = document.getElementById('footer-name');
    const githubLink = document.getElementById('github-link');
    const linkedinLink = document.getElementById('linkedin-link');

    if (profileName) profileName.textContent = portfolioData.name;
    if (profileRole) profileRole.textContent = portfolioData.role;
    if (profileBio) profileBio.textContent = portfolioData.bio;
    if (footerName) footerName.textContent = portfolioData.name;

    if (portfolioData.name) {
        document.title = `Portfolio | ${portfolioData.name}`;
    }

    if (githubLink) githubLink.href = portfolioData.githubLink;
    if (linkedinLink) linkedinLink.href = portfolioData.linkedinLink;
    
    const footerGithub = document.querySelector('.footer-github');
    const footerLinkedin = document.querySelector('.footer-linkedin');
    if (footerGithub) footerGithub.href = portfolioData.githubLink;
    if (footerLinkedin) footerLinkedin.href = portfolioData.linkedinLink;

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

    const techNodes = document.querySelectorAll('.tech-node');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (techNodes.length > 0) {
        const nodeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

        techNodes.forEach((node, index) => {
            node.style.transitionDelay = `${(index % 12) * 0.05}s`;
            nodeObserver.observe(node);
        });
    }

    if (projectCards.length > 0) {
        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

        projectCards.forEach(card => {
            cardObserver.observe(card);
        });
    }
});
