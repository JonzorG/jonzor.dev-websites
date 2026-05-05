document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Real-time Search Logic ---
    const searchInput = document.getElementById('file-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('table tr');
            
            rows.forEach(row => {
                // Ignore header rows
                if(row.querySelector('th')) return; 
                
                // Check if row text content contains the search term
                const text = row.textContent.toLowerCase();
                if(text.includes(term)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- 2. Sorting Arrows Logic ---
    // Apache uses semicolons (;) instead of standard ampersands (&).
    // We replace them here so JavaScript can read the parameters.
    const fixedQueryString = window.location.search.replace(/;/g, '&');
    const urlParams = new URLSearchParams(fixedQueryString);
    
    // Defaults: 'N' for Name, 'A' for Ascending
    const sortCol = urlParams.get('C') || 'N'; 
    const sortOrd = urlParams.get('O') || 'A';  
    
    // Map Apache's letters to your header text
    const colMap = {
        'N': 'name',
        'M': 'last modified',
        'S': 'size',
        'D': 'description'
    };
    
    const activeColText = colMap[sortCol];

    // Find the headers and add the arrow to the active one
    document.querySelectorAll('th a').forEach(link => {
        const headerText = link.textContent.toLowerCase().trim();
        
        if (headerText === activeColText) {
            const arrow = document.createElement('img');
            
            // Choose the arrow based on the Order (O) parameter
            arrow.src = sortOrd === 'A' ? '/assets/icons/UpArrow.svg' : '/assets/icons/DownArrow.svg';
            
            // Style the arrow to sit nicely next to the text
            arrow.style.width = '12px';
            arrow.style.marginLeft = '6px';
            arrow.style.verticalAlign = 'middle';
            
            link.appendChild(arrow);
            link.style.color = 'var(--text-main)'; // Highlight the active sorted column text
        }
    });
});
