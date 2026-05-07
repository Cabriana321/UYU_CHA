<?php
$reviewsFile = __DIR__ . "/../reviews.json";

if (!file_exists($reviewsFile)) {
    echo json_encode(["success" => false, "message" => "reviews.json not found"]);
    exit;
}

$data = json_decode(file_get_contents($reviewsFile), true);

if (!is_array($data)) {
    echo json_encode(["success" => false, "message" => "Failed to parse reviews.json"]);
    exit;
}

$request = json_decode(file_get_contents("php://input"), true);

if (!isset($request['id']) || !isset($request['newStatus'])) {
    echo json_encode(["success" => false, "message" => "Invalid parameters"]);
    exit;
}

$reviewId = $request['id'];
$newStatus = trim($request['newStatus']);

$validStatuses = ["Approved", "Pending"];
if (!in_array($newStatus, $validStatuses)) {
    echo json_encode(["success" => false, "message" => "Invalid status value"]);
    exit;
}

$found = false;
foreach ($data as &$review) {
    if (isset($review['id']) && $review['id'] == $reviewId) {
        $review['Approved'] = $newStatus;
        $found = true;
        break;
    }
}

if (!$found) {
    echo json_encode(["success" => false, "message" => "Review not found"]);
    exit;
}

if (file_put_contents($reviewsFile, json_encode($data, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true, "message" => "Status updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save the file"]);
}
?>
