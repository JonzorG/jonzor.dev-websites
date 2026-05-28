<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jonzor's Files</title>
    <!-- Cache-buster to guarantee fresh styles -->
    <link rel="stylesheet" href="/style.css?v=<?= time(); ?>">
    <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg">
</head>
<body>
    <header>
        <div class="header-actions">
            <div id="breadcrumbs" class="breadcrumbs">
                <!-- Populated by JS -->
            </div>
            
            <div class="header-right">
                <a href="https://jonzor.dev" class="action-button">Portfolio</a>
                <div class="search-container">
                    <input type="text" id="file-search" placeholder="Search everywhere..." aria-label="Search files">
                </div>
            </div>
        </div>
    </header>

    <main class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th class="sortable" data-sort="name">Name <img class="sort-icon" src="" alt=""></th>
                    <th class="sortable" data-sort="modified">Last Modified <img class="sort-icon" src="" alt=""></th>
                    <th class="sortable" data-sort="size">Size <img class="sort-icon" src="" alt=""></th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="file-table-body">
                <tr><td colspan="4">Loading...</td></tr>
            </tbody>
        </table>
    </main>

    <script src="/script.js?v=<?= time(); ?>"></script>
</body>
</html>
