<?php
header('Content-Type: application/json');

$base_dir = realpath(__DIR__ . '/shared');
$action = $_GET['action'] ?? 'list';
$req_path = $_GET['path'] ?? '';

// Security: Resolve the requested path and ensure it stays inside the base directory
function get_safe_path($base, $req) {
    $target = realpath($base . '/' . $req);
    if ($target === false || !str_starts_with($target, $base)) {
        return false;
    }
    // Hardcode block for hidden directory logic
    if (str_contains(str_replace('\\', '/', $target), '/shared/hidden')) {
        return false;
    }
    return $target;
}

$target_dir = get_safe_path($base_dir, $req_path);

if (!$target_dir) {
    http_response_code(403);
    echo json_encode(['error' => 'Access Denied or Directory Not Found']);
    exit;
}

// Helper: Format bytes
function format_size($bytes) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    for ($i = 0; $bytes > 1024; $i++) { $bytes /= 1024; }
    return round($bytes, 2) . ' ' . $units[$i];
}

// Helper: Recursive Directory Size
function get_dir_size($dir) {
    $size = 0;
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));
    foreach ($iterator as $file) {
        $size += $file->getSize();
    }
    return $size;
}

if ($action === 'list') {
    $items = [];
    $scan = array_diff(scandir($target_dir), ['.', '..']);

    foreach ($scan as $file) {
        $full_path = $target_dir . '/' . $file;
        $is_dir = is_dir($full_path);
        
        // Skip hidden folder entirely from listing
        if ($file === 'hidden' && $target_dir === $base_dir) continue;

        $items[] = [
            'name' => $file,
            'is_dir' => $is_dir,
            'size' => $is_dir ? get_dir_size($full_path) : filesize($full_path),
            'size_formatted' => format_size($is_dir ? get_dir_size($full_path) : filesize($full_path)),
            'modified' => date("Y-m-d H:i", filemtime($full_path)),
            'ext' => $is_dir ? 'folder' : strtolower(pathinfo($file, PATHINFO_EXTENSION)),
            'rel_path' => ltrim(str_replace($base_dir, '', $full_path), '/\\')
        ];
    }

    // Sort: Folders first, then alphabetical
    usort($items, function($a, $b) {
        if ($a['is_dir'] === $b['is_dir']) {
            return strcasecmp($a['name'], $b['name']);
        }
        return $a['is_dir'] ? -1 : 1;
    });

    echo json_encode(['path' => $req_path, 'items' => $items]);
    exit;
}

if ($action === 'search') {
    $query = strtolower($_GET['q'] ?? '');
    $results = [];
    
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($base_dir, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
        // Skip hidden paths in search
        if (str_contains(str_replace('\\', '/', $file->getPathname()), '/shared/hidden')) {
            continue;
        }

        if (str_contains(strtolower($file->getFilename()), $query)) {
            $is_dir = $file->isDir();
            $results[] = [
                'name' => $file->getFilename(),
                'is_dir' => $is_dir,
                'size_formatted' => format_size($is_dir ? get_dir_size($file->getPathname()) : $file->getSize()),
                'modified' => date("Y-m-d H:i", $file->getMTime()),
                'ext' => $is_dir ? 'folder' : strtolower(pathinfo($file->getFilename(), PATHINFO_EXTENSION)),
                'rel_path' => ltrim(str_replace($base_dir, '', $file->getPathname()), '/\\'),
                'parent' => ltrim(str_replace($base_dir, '', $file->getPath()), '/\\')
            ];
        }
    }
    echo json_encode(['items' => $results]);
    exit;
}

if ($action === 'zip') {
    if (!is_dir($target_dir)) {
        http_response_code(400);
        exit('Target is not a directory.');
    }

    $folder_name = basename($target_dir);
    $zip_file = sys_get_temp_dir() . '/' . $folder_name . '_' . time() . '.zip';
    
    $zip = new ZipArchive();
    if ($zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($target_dir),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $name => $file) {
            if (!$file->isDir()) {
                $file_path = $file->getRealPath();
                $relative_path = substr($file_path, strlen($target_dir) + 1);
                $zip->addFile($file_path, $relative_path);
            }
        }
        $zip->close();

        header('Content-Type: application/zip');
        header('Content-disposition: attachment; filename="' . $folder_name . '.zip"');
        header('Content-Length: ' . filesize($zip_file));
        readfile($zip_file);
        unlink($zip_file); // Clean up temp file
        exit;
    } else {
        http_response_code(500);
        exit('Failed to create zip file.');
    }
}
