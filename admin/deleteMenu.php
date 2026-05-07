<?php
header("Content-Type: application/json");

$menuFile = "menu.json";
$rawData = file_get_contents("php://input");
$menuData = json_decode($rawData, true);

if ($menuData === null) {
    echo json_encode(["error" => "Invalid JSON data."]);
    exit();
}

foreach ($menuData as $category => &$items) {
    foreach ($items as $i => $item) {
        if (!empty($item['delete'])) {
            if (!empty($item['image']) && file_exists($item['image'])) {
                unlink($item['image']);
            }
            unset($items[$i]);
        }
    }
    $items = array_values($items);
}

if (file_put_contents($menuFile, json_encode($menuData, JSON_PRETTY_PRINT))) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update file."]);
}
?>
