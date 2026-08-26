document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copy-btn');
    const rawEmail = document.getElementById('raw-email');
    const copyText = document.getElementById('copy-text');

    if (copyBtn && rawEmail && copyText) {
        copyBtn.addEventListener('click', (e) => {
            // Stop the click from triggering the mailto link if they click near it
            e.preventDefault(); 
            e.stopPropagation();

            const emailString = rawEmail.textContent;
            
            // Function to handle both Secure (HTTPS) and Non-Secure (HTTP Tailscale) contexts
            const copyToClipboard = (text) => {
                // Modern API (for when it's live on Cloudflare HTTPS)
                if (navigator.clipboard && window.isSecureContext) {
                    return navigator.clipboard.writeText(text);
                } else {
                    // Legacy Fallback (for HTTP Tailscale testing)
                    return new Promise((resolve, reject) => {
                        const textArea = document.createElement("textarea");
                        textArea.value = text;
                        textArea.style.position = "absolute";
                        textArea.style.left = "-999999px";
                        document.body.appendChild(textArea);
                        textArea.select();
                        try {
                            document.execCommand('copy');
                            resolve();
                        } catch (error) {
                            reject(error);
                        } finally {
                            textArea.remove();
                        }
                    });
                }
            };

            copyToClipboard(emailString).then(() => {
                const originalText = copyText.textContent;
                copyText.textContent = 'Copied!';
                copyBtn.classList.add('copied');
                
                // Revert to original state after 2 seconds
                setTimeout(() => {
                    copyText.textContent = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Copy failed. Please copy manually: ' + emailString);
            });
        });
    }
});
