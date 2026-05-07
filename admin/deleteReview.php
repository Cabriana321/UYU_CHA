<?php
$reviewsFile = "../reviews.json";

$data = json_decode(file_get_contents($reviewsFile), true);
$request = json_decode(file_get_contents("php://input"), true);

$reviewId = $request['id'] ?? null;
if (!$reviewId) {
    echo json_encode(["success" => false, "message" => "Missing review ID"]);
    exit;
}

$found = false;
foreach ($data as $i => $review) {
    if (isset($review['id']) && $review['id'] == $reviewId) {
        array_splice($data, $i, 1);
        $found = true;
        break;
    }
}

if (!$found) {
    echo json_encode(["success" => false, "message" => "Review not found"]);
    exit;
}

if (file_put_contents($reviewsFile, json_encode($data, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save the file"]);
}
?>
