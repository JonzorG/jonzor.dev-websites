document.addEventListener('DOMContentLoaded', () => {
    let currentPath = '';
    let currentItems = []; 
    
    let sortCol = 'name';
    let sortAsc = true;

    const tbody = document.getElementById('file-table-body');
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    const searchInput = document.getElementById('file-search');
    const sortHeaders = document.querySelectorAll('th.sortable');

    sortHeaders.forEach(th => {
        th.addEventListener('click', () => {
            const clickedCol = th.getAttribute('data-sort');
            if (sortCol === clickedCol) {
                sortAsc = !sortAsc; 
            } else {
                sortCol = clickedCol;
                sortAsc = clickedCol === 'name'; 
            }
            applySortAndRender();
        });
    });

    const initPath = window.location.hash ? decodeURIComponent(window.location.hash.substring(1)) : '';
    loadDirectory(initPath);

    window.addEventListener('hashchange', () => {
        const hashPath = window.location.hash ? decodeURIComponent(window.location.hash.substring(1)) : '';
        if (hashPath !== currentPath) {
            loadDirectory(hashPath, true);
        }
    });

    function loadDirectory(path, skipHistory = false) {
        currentPath = path;
        
        if (!skipHistory) {
            window.location.hash = encodeURIComponent(path);
        }

        tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        
        fetch(`/api.php?action=list&path=${encodeURIComponent(path)}`)
            .then(res => res.json())
            .then(data => {
                currentItems = data.items;
                renderBreadcrumbs(path);
                applySortAndRender();
            })
            .catch(err => {
                tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Error loading directory.</td></tr>`;
            });
    }

    function applySortAndRender() {
        currentItems.sort((a, b) => {
            let valA = a[sortCol];
            let valB = b[sortCol];

            if (sortCol === 'name') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });

        if (sortCol === 'name') {
             currentItems.sort((a, b) => {
                 if (a.is_dir === b.is_dir) return 0;
                 return a.is_dir && sortAsc ? -1 : 1;
             });
        }

        updateSortUI();
        renderTable(currentItems);
    }

    function updateSortUI() {
        sortHeaders.forEach(th => {
            const icon = th.querySelector('.sort-icon');
            if (th.getAttribute('data-sort') === sortCol) {
                icon.style.display = 'inline-block';
                icon.src = sortAsc ? '/icons/UpArrow.svg' : '/icons/DownArrow.svg';
                th.style.color = 'var(--text-main)';
            } else {
                icon.style.display = 'none';
                th.style.color = ''; 
            }
        });
    }

    function renderBreadcrumbs(path) {
        breadcrumbsContainer.innerHTML = '';
        
        const homeLink = document.createElement('a');
        homeLink.href = "#";
        homeLink.textContent = "Home";
        homeLink.onclick = (e) => { e.preventDefault(); loadDirectory(''); };
        breadcrumbsContainer.appendChild(homeLink);

        if (!path) return;

        const parts = path.split('/').filter(p => p);
        let accumPath = '';

        parts.forEach((part, index) => {
            const separator = document.createElement('span');
            separator.textContent = " / ";
            breadcrumbsContainer.appendChild(separator);

            accumPath += (accumPath ? '/' : '') + part;
            
            const partLink = document.createElement('a');
            partLink.href = "#";
            partLink.textContent = part;
            
            const targetPath = accumPath; 
            partLink.onclick = (e) => { 
                e.preventDefault(); 
                loadDirectory(targetPath); 
            };
            
            breadcrumbsContainer.appendChild(partLink);
        });
    }

    function renderTable(items) {
        tbody.innerHTML = '';
        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Folder is empty.</td></tr>';
            return;
        }

        items.forEach(file => {
            const tr = document.createElement('tr');
            
            const tdName = document.createElement('td');
            const icon = document.createElement('img');
            icon.src = `/icons/${getIconForExt(file.ext)}`;
            icon.className = 'file-icon';
            
            const link = document.createElement('a');
            link.textContent = file.name;
            
            if (file.is_dir) {
                link.href = "#";
                link.onclick = (e) => { e.preventDefault(); loadDirectory(file.rel_path); };
            } else {
                if (file.ext === 'md') {
                    link.href = `/viewer.html?file=${encodeURIComponent('/shared/' + file.rel_path)}`;
                } else {
                    link.href = `/shared/${file.rel_path}`;
                    link.target = "_blank";
                }
            }

            tdName.appendChild(icon);
            tdName.appendChild(link);

            if (file.parent) {
                const parentContext = document.createElement('div');
                parentContext.className = 'search-context';
                parentContext.textContent = `in /${file.parent}`;
                tdName.appendChild(parentContext);
            }

            const tdMod = document.createElement('td');
            tdMod.textContent = file.modified;

            const tdSize = document.createElement('td');
            tdSize.textContent = file.size_formatted;

            const tdAction = document.createElement('td');
            const actionBtn = document.createElement('a');
            actionBtn.className = 'download-btn';
            
            if (file.is_dir) {
                actionBtn.href = `/api.php?action=zip&path=${encodeURIComponent(file.rel_path)}`;
                actionBtn.title = 'Download Folder as ZIP';
            } else {
                actionBtn.href = `/shared/${file.rel_path}`;
                actionBtn.download = '';
                actionBtn.title = 'Download File';
            }
            tdAction.appendChild(actionBtn);

            tr.appendChild(tdName);
            tr.appendChild(tdMod);
            tr.appendChild(tdSize);
            tr.appendChild(tdAction);
            
            tbody.appendChild(tr);
        });
    }

    let searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const term = e.target.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (term === '') {
                    loadDirectory(currentPath); 
                    return;
                }
                
                tbody.innerHTML = '<tr><td colspan="4">Searching everywhere...</td></tr>';
                fetch(`/api.php?action=search&q=${encodeURIComponent(term)}`)
                    .then(res => res.json())
                    .then(data => {
                        currentItems = data.items;
                        breadcrumbsContainer.innerHTML = '<span>Search Results</span>';
                        applySortAndRender();
                    });
            }, 300); 
        });
    }

    function getIconForExt(ext) {
        const iconMap = {
            'folder': 'folder.svg',
            'pdf': 'file-pdf.svg',
            'md': 'file-md.svg',
            'txt': 'file-text.svg',
            'apk': 'file-apk.svg',
            'zip': 'file-zip.svg'
        };
        return iconMap[ext] || 'file-default.svg';
    }
});
