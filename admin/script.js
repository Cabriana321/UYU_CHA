async function fetchMenu(category) {
    try {
        document.getElementById("add").style.display = "block";

        const response = await fetch(`menu.json?t=${Date.now()}`);
        const menuData = await response.json();

        if (!menuData[category]) {
            document.getElementById("menu").innerHTML = "<tr><td colspan='5'>Category not found.</td></tr>";
            return;
        }

        const menuHead = document.getElementById("menu-head");
        const menuBody = document.getElementById("menu-body");
        menuHead.innerHTML = "";
        menuBody.innerHTML = "";

        const reviewHead = document.getElementById("review-head");
        const reviewBody = document.getElementById("review-body");
        reviewHead.innerHTML = "";
        reviewBody.innerHTML = "";

        document.getElementById("category-title").textContent = category + " Menu";

        if (category === "Meals") {
            menuHead.innerHTML = `
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Prices <br>(No Rice) |<br> (With Rice)</th>
                    <th>Actions</th>
                </tr>
            `;
        } else if (category === "Bread" || category === "Snacks") {
            menuHead.innerHTML = `
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            `;
        }else {
            menuHead.innerHTML = `
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Prices (M | L)</th>
                    <th>Actions</th>
                </tr>
            `;
        }

        menuData[category].forEach((item, index) => {
            menuBody.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td><img src="${item.image}" alt="${item.name}" style="max-width: 80px;"></td>
                    <td>${item.description}</td>
                    <td>₱${item.medium} | ₱${item.large}</td>
                    <td>
                        <button class="edit-btn" onclick="editItem(${index}, '${category}')">Edit</button>
                        <button class="delete-btn" onclick="deleteItem(${index}, '${category}')">Delete</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        document.getElementById("menu").innerHTML = "<tr><td colspan='5'>Failed to load menu.</td></tr>";
    }
}

async function fetchReviews() {
    try {
        document.getElementById("add").style.display = "none";

        const response = await fetch(`getReviews.php?t=${Date.now()}`);
        const reviewsData = await response.json();

        if (!Array.isArray(reviewsData)) {
            console.error("Invalid data received: reviewsData is not an array");
            document.getElementById("admin-data").innerHTML = "<tr><td colspan='8'>Failed to load reviews.</td></tr>";
            return;
        }

        const menuHead = document.getElementById("menu-head");
        const menuBody = document.getElementById("menu-body");
        menuHead.innerHTML = "";
        menuBody.innerHTML = "";

        const reviewHead = document.getElementById("review-head");
        const reviewBody = document.getElementById("review-body");
        reviewHead.innerHTML = "";
        reviewBody.innerHTML = "";

        document.getElementById("category-title").textContent = "Reviews";

        reviewHead.innerHTML = `
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Number</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        `;

        const sorted = [...reviewsData].sort((a, b) => {
            if (a.Approved === "Approved" && b.Approved !== "Approved") return 1;
            if (a.Approved !== "Approved" && b.Approved === "Approved") return -1;
            return 0;
        });

        let reviewRows = "";
        sorted.forEach((item, index) => {
            const id = item.id;
            const status = item.Approved || "Pending";
            const name = item["your-name"] || "N/A";
            const number = item["your-number"] || "N/A";
            const email = item["your-email"] || "N/A";
            const message = item.message || "No message provided.";
            const date = item.timestamp;

            reviewRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${name}</td>
                    <td>${number}</td>
                    <td>${email}</td>
                    <td>${item.rating}⭐</td>
                    <td>${message}</td>
                    <td>${date}</td>
                    <td>
                        <select data-id="${id}" onchange="updateReviewStatus('${id}', this.value)">
                            <option value="Approved" ${status === "Approved" ? "selected" : ""}>Approved</option>
                            <option value="Pending" ${status === "Pending" ? "selected" : ""}>Pending</option>
                        </select>
                    </td>
                    <td>
                        <button onclick="deleteReview('${id}')" class="delete-btn">Delete</button>
                    </td>
                </tr>
            `;
        });
        reviewBody.innerHTML = reviewRows;

    } catch (error) {
        document.getElementById("admin-data").innerHTML = "<tr><td colspan='8'>Failed to load reviews.</td></tr>";
    }
}

async function updateReviewStatus(id, newStatus) {
    try {
        const dropdown = document.querySelector(`select[data-id="${id}"]`);
        if (dropdown) dropdown.disabled = true;

        const response = await fetch('updateReviewStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, newStatus })
        });

        const result = await response.json();

        if (result.success) {
            alert('Review status updated successfully!');
            fetchReviews();
        } else {
            alert('Failed to update review status: ' + result.message);
        }
        if (dropdown) dropdown.disabled = false;

    } catch (error) {
        alert('Failed to update review status.');
    }
}

async function deleteReview(id) {
    if (confirm("Are you sure you want to delete this review?")) {
        try {
            const response = await fetch('deleteReview.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id })
            });

            const result = await response.json();

            if (result.success) {
                alert('Review deleted successfully!');
                fetchReviews();
            } else {
                alert('Failed to delete the review.');
            }
        } catch (error) {
            alert('Failed to delete the review.');
        }
    }
}


// Popups
let popup1 = document.getElementById("popup");
function openPopup() { popup1.classList.add("show"); }
function closePopup() { popup1.classList.remove("show"); }
function openAddPopup() { document.getElementById('add-popup').classList.add('show'); }
function closeAddPopup() {
    document.getElementById('add-popup').classList.remove('show');

    document.getElementById('addName').value = '';
    document.getElementById('addMedium').value = '';
    document.getElementById('addLarge').value = '';
    document.getElementById('addDescription').value = '';
    document.getElementById('addImage').value = '';
}

// Add item
async function addItem(event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const name = document.getElementById('addName').value.trim();
    const medium = document.getElementById('addMedium').value.trim();
    const large = document.getElementById('addLarge').value.trim();
    const description = document.getElementById('addDescription').value.trim();
    const imageFile = document.getElementById('addImage').files[0];

    if (!name || !medium || !large || !description) {
        alert("Please fill in all fields.");
        return;
    }

    if (isNaN(medium) || isNaN(large)) {
        alert("Please enter valid prices.");
        return;
    }

    let imagePath = "";
    if (imageFile) {
        imagePath = await uploadImage(imageFile);
        if (!imagePath) {
            alert("Image upload failed. Please try again.");
            return;
        }
    }

    const newItem = {
        name,
        medium,
        large,
        description,
        image: imagePath
    };

    try {
        const response = await fetch(`menu.json?t=${Date.now()}`);
        const menuData = await response.json();

        if (!menuData[category]) {
            console.error("Category not found in the menu.");
            return;
        }

        menuData[category].push(newItem);

        const saveResponse = await fetch('uploadMenu.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(menuData)
        });

        const saveResult = await saveResponse.json();
        if (saveResult.success) {
            alert("Item Added Successfully!");
            location.reload();
        } else {
            alert("Error saving item: " + (saveResult.error || 'Unknown error'));
        }
    } catch (err) {
        console.error("Error adding item:", err);
        alert("An error occurred while adding the item.");
    }
}

function setCategory(category) {
    document.getElementById('category').value = category;
    localStorage.setItem('selectedCategory', category);

    const navLinks = document.querySelectorAll('.admin-nav a');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = document.querySelector(`.admin-nav a[href="javascript:void(0)"][onclick*="${category}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    const labels = document.querySelectorAll('.price-label');
    const remove = document.querySelectorAll('.remove-price');

    if (category === 'Meals') {
        remove[0].style.display = 'flex';
        remove[1].style.display = 'flex';
        labels[0].innerText = "No Rice:";
        labels[1].innerText = "With Rice:";
        labels[2].innerText = "No Rice:";
        labels[3].innerText = "With Rice:";
    } else if (category === 'Snacks' || category === 'Bread') {
        remove[0].style.display = 'none';
        remove[1].style.display = 'none';
        labels[0].innerText = "Price:";
        labels[3].innerText = "Price:";
        
    } else {
        document.getElementById("removePrice").style.display = 'flex';
        remove[0].style.display = 'flex';
        remove[1].style.display = 'flex';
        labels[0].innerText = "Medium Price:";
        labels[1].innerText = "Large Price:";
        labels[2].innerText = "Medium Price:";
        labels[3].innerText = "Large Price:";
    }

    const addButtonDiv = document.getElementById('add');

    if (category === 'Reviews') {
        addButtonDiv.style.display = 'none';
    } else {
        addButtonDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedCategory = localStorage.getItem('selectedCategory') || 'Milk Tea';
    setCategory(savedCategory);
});

// Upload image
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('uploadImage.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            return data.imagePath;
        } else {
            console.error("Image upload error:", data.error);
            return "";
        }
    } catch (err) {
        console.error("Image upload failed:", err);
        return "";
    }
}

// Edit item
function editItem(index, category) {
    openPopup();
    fetch(`menu.json?t=${Date.now()}`)
        .then(response => response.json())
        .then(menuData => {
            const item = menuData[category][index];
            document.getElementById('editId').value = index;
            document.getElementById('editName').value = item.name;
            document.getElementById('editMedium').value = item.medium;
            document.getElementById('editLarge').value = item.large;
            document.getElementById('editDescription').value = item.description;
            document.getElementById('old_image').value = item.image;
            document.getElementById('editCategory').value = category;
        });
}

// Delete item
function deleteItem(index, category) {
    const isConfirmed = confirm("Are you sure you want to delete this item?");

    if (isConfirmed) {
        fetch('menu.json')
            .then(response => response.json())
            .then(menuData => {
                const menu = menuData[category];
                const itemToDelete = menu[index];

                itemToDelete.delete = true;

                menuData[category][index] = itemToDelete;

                fetch('deleteMenu.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(menuData)
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            alert("Item deleted successfully! The page will now reload.");
                            location.reload();
                        } else {
                            alert("Error deleting item: " + (result.error || 'Unknown error'));
                        }
                    })
                    .catch(err => {
                        alert("Error deleting item: " + err);
                    });
            });
    }
}

// Load menu on page load with saved category
document.addEventListener('DOMContentLoaded', () => {
    const savedCategory = document.getElementById('category').value || "Milk Tea";

    if (savedCategory === 'Reviews') {
        document.getElementById("add").style.display = "none";
        fetchReviews();
    } else {
        fetchMenu(savedCategory);
    }
});

document.getElementById('edit-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const index = this.dataset.index;
    const category = this.dataset.category;

    const name = document.getElementById('editName').value.trim();
    const medium = document.getElementById('editMedium').value.trim();
    const large = document.getElementById('editLarge').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const imageFile = document.getElementById('editImage').files[0];

    if (!name || !medium || !large || !description) {
        alert("Please fill in all fields.");
        return;
    }

    let imagePath = "";
    if (imageFile) {
        imagePath = await uploadImage(imageFile);
        if (!imagePath) {
            alert("Image upload failed. Please try again.");
            return;
        }
    }

    const response = await fetch('menu.json');
    const menuData = await response.json();

    const itemToEdit = menuData[category][index];
    itemToEdit.name = name;
    itemToEdit.medium = medium;
    itemToEdit.large = large;
    itemToEdit.description = description;
    if (imagePath) {
        itemToEdit.image = imagePath;
    }

    const saveResponse = await fetch('uploadMenu.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
    });

    const saveResult = await saveResponse.json();
    if (saveResult.success) {
        setCategory(category);
        closeEditPopup();
    } else {
        alert("Error saving item: " + (saveResult.error || 'Unknown error'));
    }
});

// Logout
function logout() {
    sessionStorage.removeItem("isLoggedIn");
    localStorage.removeItem('selectedCategory');
    fetch('logout.php')
        .then(() => {
            window.location.replace("index.html");
        });
}