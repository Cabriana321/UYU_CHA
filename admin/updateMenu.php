<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $menuFile = "menu.json";

    if (!file_exists($menuFile)) {
        echo "<script>alert('Menu file not found.');history.back();</script>";
        exit();
    }

    $menuData = json_decode(file_get_contents($menuFile), true);
    if ($menuData === null) {
        echo "<script>alert('Failed to load menu data.');history.back();</script>";
        exit();
    }

    $category = $_POST['category'];
    $id = $_POST['id'];
    $name = $_POST['name'];
    $medium = $_POST['medium'];
    $large = $_POST['large'];
    $description = $_POST['description'];

    if (empty($name) || empty($medium) || empty($large) || empty($description)) {
        echo "<script>alert('All fields are required.');history.back();</script>";
        exit();
    }

    // Image handling
    if ($_FILES["image"]["error"] === 0) {
        $targetDir = "uploads/";
        if (!is_dir($targetDir)) mkdir($targetDir);
        $targetFile = $targetDir . basename($_FILES["image"]["name"]);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        if (!getimagesize($_FILES["image"]["tmp_name"]) || !in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
            echo "<script>alert('Invalid image type.');history.back();</script>";
            exit();
        }

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            $image = $targetFile;
        } else {
            echo "<script>alert('Failed to upload image.');history.back();</script>";
            exit();
        }
    } else {
        $image = $_POST['old_image'] ?? '';
    }

    $menuData[$category][$id] = [
        "name" => $name,
        "medium" => $medium,
        "large" => $large,
        "description" => $description,
        "image" => $image
    ];

    if (file_put_contents($menuFile, json_encode($menuData, JSON_PRETTY_PRINT))) {
        echo "<script>alert('Item updated successfully!');location.href=document.referrer;</script>";
    } else {
        echo "<script>alert('Failed to update item.');history.back();</script>";
    }
}
?>
