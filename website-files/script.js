// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inject Personal Data from config.js
    // Check if portfolioData exists to prevent errors
    if (typeof portfolioData !== 'undefined') {
        
        // Update text content
        document.getElementById('profile-name').textContent = portfolioData.name;
        document.getElementById('profile-role').textContent = portfolioData.role;
        document.getElementById('profile-bio').textContent = portfolioData.bio;
        document.getElementById('footer-name').textContent = portfolioData.name;

        // Update the page title in the browser tab dynamically
        document.title = `Portfolio | ${portfolioData.name}`;

        // Update link URLs
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

});
