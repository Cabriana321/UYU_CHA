<?php
header("Content-Type: application/json");

// Check if a file was uploaded
if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
    // Directory where the image will be saved
    $uploadDir = 'uploads/';
    
    // Check if the uploads directory exists, create it if not
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Get the image file and its extension
    $imageFile = $_FILES['image'];
    $imageName = uniqid() . '_' . basename($imageFile['name']);
    $imagePath = $uploadDir . $imageName;

    // Move the uploaded file to the desired directory
    if (move_uploaded_file($imageFile['tmp_name'], $imagePath)) {
        // Respond with the image path
        echo json_encode(["success" => true, "imagePath" => $imagePath]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to move uploaded file."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "No image uploaded or there was an upload error."]);
}
?>
