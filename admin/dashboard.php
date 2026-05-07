<?php
session_start();

if (!isset($_SESSION['loggedIn']) || $_SESSION['loggedIn'] !== true) {
    header("Location: index.html");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UYU CHA | ADMIN</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <section id="admin-section">
        <div class="admin-nav">
            <hr>
            <a href="javascript:void(0)" onclick="fetchMenu('Milk Tea'); setCategory('Milk Tea')">Milktea</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Coffee'); setCategory('Coffee')">Coffee</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Frappe'); setCategory('Frappe')">Frappe</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Fruity'); setCategory('Fruity')">Fruity</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Meals'); setCategory('Meals'); updatePriceLabels('Meals')">Meals</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Snacks'); setCategory('Snacks')">Snacks</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Bread'); setCategory('Bread')">Bread</a>
            <a href="javascript:void(0)" onclick="fetchMenu('Premium Coffee'); setCategory('Premium Coffee')">Premium Coffee</a>
            <hr class="custom-hr">
            <a href="javascript:void(0)" onclick="fetchReviews(); setCategory('Reviews')">Reviews</a>
            <button type="button" onclick="logout()" class="log-out">Log Out</button>
        </div>


        <div class="admin-content">
            <h2 id="category-title"></h2>
            <div class="add-div" id="add">
                <button class="add-btn" onclick="openAddPopup()">Add Item</button>
            </div>
            <table>
                <thead id="menu-head"></thead>
                <tbody id="menu-body"></tbody>

                <thead id="review-head"></thead>
                <tbody id="review-body"></tbody>
            </table>
        </div>

        <!-- Add Form -->
        <div class="edit-form" id="add-popup">
            <span>Add New Item</span>
            <button type="button" onclick="closeAddPopup()" class="close-btn">X</button>
            <br>
            <form id="addForm" onsubmit="addItem(event)" enctype="multipart/form-data">

                <input type="hidden" id="editCategory" name="category" value="">

                <div class="edit-contents">
                    <label for="addImage">Image:</label>
                    <input type="file" id="addImage" name="image" accept="image/*">
                </div>

                <div class="edit-contents">
                    <label for="addName">Item Name:</label>
                    <input type="text" id="addName" name="name" required>
                </div>

                <div class="edit-contents">
                    <label for="addMedium" class="price-label">Medium Price:</label>
                    <input type="text" id="addMedium" name="medium" required>
                </div>

                <div class="edit-contents remove-price" id="removePrice">
                    <label for="addLarge" class="price-label" class="removePrice">Large Price:</label>
                    <input type="text" id="addLarge" name="large" required>
                </div>

                <div class="edit-contents">
                    <label for="addDescription">Description:</label>
                    <textarea id="addDescription" name="description" rows="4" required></textarea>
                </div>

                <div class="edit-button">
                    <button type="submit" class="button" name="submit">Add Item</button>
                </div>
            </form>
        </div>

        <!-- Edit Form -->
        <div class="edit-form" id="popup">
            <span>Edit Menu Item</span>
            <button type="button" onclick="closePopup()" class="close-btn">X</button>
            <br>
            <form id="editForm" action="updateMenu.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" id="editId" name="id">
                <input type="hidden" id="old_image" name="old_image">
                <input type="hidden" id="json_file" name="json_file">
                <input type="hidden" id="category" name="category" value="Milk Tea">

                <div class="edit-contents">
                    <label for="editImage">Image:</label>
                    <input type="file" id="editImage" name="image" accept="image/*">
                </div>

                <div class="edit-contents">
                    <label for="editName">Item Name:</label>
                    <input type="text" id="editName" name="name" required>
                </div>

                <div class="edit-contents">
                    <label for="editMedium" class="price-label">Medium Price:</label>
                    <input type="text" id="editMedium" name="medium" required>
                </div>

                <div class="edit-contents remove-price">
                    <label for="editLarge" class="price-label">Large Price:</label>
                    <input type="text" id="editLarge" name="large" required>
                </div>

                <div class="edit-contents">
                    <label for="editDescription">Description:</label>
                    <textarea id="editDescription" name="description" rows="4" required></textarea>
                </div>

                <div class="edit-button">
                    <button type="submit" class="button" name="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </section>

    <script src="script.js"></script>
</body>

</html>