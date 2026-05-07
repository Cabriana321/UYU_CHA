<?php
header("Content-Type: application/json");

$filepath = "../reviews.json";

if (file_exists($filepath)) {
    echo file_get_contents($filepath);
} else {
    echo json_encode(["error" => "File not found"]);
}
?>
