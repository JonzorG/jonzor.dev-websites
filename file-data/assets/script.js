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
    const fixedQueryString = window.location.search.replace(/;/g, '&');
    const urlParams = new URLSearchParams(fixedQueryString);
    
    const sortCol = urlParams.get('C') || 'N'; 
    const sortOrd = urlParams.get('O') || 'A';  
    
    const colMap = {
        'N': 'name',
        'M': 'last modified',
        'S': 'size',
        'D': 'description'
    };
    
    const activeColText = colMap[sortCol];

    document.querySelectorAll('th a').forEach(link => {
        const headerText = link.textContent.toLowerCase().trim();
        
        if (headerText === activeColText) {
            const arrow = document.createElement('img');
            
            arrow.src = sortOrd === 'A' ? '/assets/icons/UpArrow.svg' : '/assets/icons/DownArrow.svg';
            
            arrow.style.width = '12px';
            arrow.style.marginLeft = '6px';
            arrow.style.verticalAlign = 'middle';
            
            link.appendChild(arrow);
            link.style.color = 'var(--text-main)';
        }
    });

    // --- 3. Inject Dedicated Download Buttons (Far Right Column) ---
    const tableRows = document.querySelectorAll('table tr');
    
    tableRows.forEach(row => {
        // A. Handle Header Row: Add an empty header cell at the end
        if (row.querySelector('th')) {
            const actionTh = document.createElement('th');
            // This non-breaking space stops the 'th:empty' CSS rule from hiding the border!
            actionTh.innerHTML = '&nbsp;'; 
            row.appendChild(actionTh); 
            return;
        }

        // B. Handle Data Rows
        const nameLink = row.querySelector('td a:not(.download-btn)');
        const actionTd = document.createElement('td'); 
        
        // Only add a button if it's an actual file (skip the parent directory)
        if (nameLink && nameLink.textContent.trim() !== 'Parent Directory') {
            const downloadBtn = document.createElement('a');
            downloadBtn.href = nameLink.href;
            downloadBtn.download = '';
            downloadBtn.className = 'download-btn';
            downloadBtn.title = 'Download ' + nameLink.textContent.trim();
            downloadBtn.setAttribute('aria-label', 'Download ' + nameLink.textContent.trim());
            
            actionTd.appendChild(downloadBtn);
        }
        
        // Add the new cell to the end of the row
        row.appendChild(actionTd);
    });
});
