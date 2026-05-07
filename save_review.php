<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = [
        'id' => time(),
        'your-name' => $_POST['your-name'] ?? '',
        'your-number' => $_POST['your-number'] ?? '',
        'your-email' => $_POST['your-email'] ?? '',
        'message' => $_POST['message'] ?? '',
        'rating' => $_POST['rating'] ?? '',
        'Approved' => 'Pending',
        'timestamp' => date('Y-m-d H:i:s')
    ];

    $file = 'reviews.json';

    if (file_exists($file)) {
        $existing = json_decode(file_get_contents($file), true);
        if (!is_array($existing)) $existing = [];
    } else {
        $existing = [];
    }

    $existing[] = $data;

    $newData = json_encode($existing, JSON_PRETTY_PRINT);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['status' => 'error', 'message' => json_last_error_msg()]);
        exit();
    }

    if (file_put_contents($file, $newData)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to write to file.']);
    }
} else {
    echo json_encode(['status' => 'error']);
}
?>
