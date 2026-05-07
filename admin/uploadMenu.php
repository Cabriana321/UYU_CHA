<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

// Save to menu.json
$file = 'menu.json';
if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to write to file']);
}
?>
