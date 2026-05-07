document.addEventListener("DOMContentLoaded", function () {

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const footer = document.querySelector('footer');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.40) {
                placeOrderBtn.classList.add('hidden');
            } else {
                placeOrderBtn.classList.remove('hidden');
            }
        });
    }, {
        threshold: [0, 0.40]
    });

    observer.observe(footer);


    const indexSlider = document.querySelector(".index-slider");
    const indexSlides = document.querySelectorAll(".index-slider img");
    const dots = document.querySelectorAll(".index-dot");
    let index = 0;

    function moveSlide() {
        indexSlider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    }

    dots.forEach((dot, i) => dot.addEventListener("click", () => {
        index = i;
        moveSlide();
    }));

    setInterval(() => {
        index = (index + 1) % indexSlides.length;
        moveSlide();
    }, 3000);

    function loadApprovedComments() {
        fetch(`reviews.json?_=${new Date().getTime()}`)
            .then(res => res.json())
            .then(data => {
                commentSection.innerHTML = "";

                if (!Array.isArray(data) || data.length === 0) {
                    commentSection.innerHTML = "<p>No approved comments yet.</p>";
                    return;
                }

                let approvedCommentsFound = false;

                data.forEach(row => {
                    const name = row["your-name"];
                    const rating = parseInt(row["rating"]);
                    const message = row["message"];
                    const approved = (row["Approved"] || "").trim().toLowerCase();

                    if (approved === "approved") {
                        approvedCommentsFound = true;

                        const commentDiv = document.createElement("div");
                        commentDiv.classList.add("review-card");

                        commentDiv.innerHTML = `
                            <div class="review-content">
                                <div class="review-name">${name}</div>
                                <div class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</div>
                                <p class="review-message">${message}</p>
                            </div>
                        `;
                        commentSection.appendChild(commentDiv);
                    }
                });

                if (!approvedCommentsFound) {
                    commentSection.innerHTML = "<p>No approved comments yet.</p>";
                }
            })
            .catch(error => {
                console.error('Error loading comments:', error);
                commentSection.innerHTML = "<p>Error loading comments.</p>";
            });
    }

    loadApprovedComments();
    setInterval(loadApprovedComments, 10000);

    const form = document.forms["contact-form"];
    const commentSection = document.getElementById("comment-section");
    const searchInput = document.getElementById("page-search");
    const searchBtn = document.getElementById("page-search-btn");
    const menuContainer = document.getElementById("menuContainer");
    const footerInput = document.getElementById("footer-search");
    const footerResults = document.getElementById("search-results");

    const categoryLinks = {
        "Milk Tea": "milk-tea.html",
        "Coffee": "coffee.html",
        "Frappe": "frappe.html",
        "Fruity": "fruity.html",
        "Meals": "meals.html",
        "Bread": "bread.html",
        "Snacks": "snacks.html",
        "Premium Coffee": "premium-coffee.html"
    };

    const pageName = window.location.pathname.split("/").pop().replace(".html", "");
    const categoryName = toTitleCase(pageName.replace(/-/g, " "));
    let menuData = {};

    fetch("/admin/menu.json?v=" + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            menuData = data;
            const items = data[categoryName] || [];
            renderCategoryItems(items, categoryName);

            if (footerInput) {
                footerInput.addEventListener("input", () => handleFooterSearch(data));
            }

            const searchQuery = new URLSearchParams(window.location.search).get("search");
            if (searchQuery) {
                const filtered = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
                renderCategoryItems(filtered, categoryName);

                if (searchInput) {
                    searchInput.value = searchQuery;
                }
            }


            if (searchInput && searchBtn) {
                const doSearch = () => {
                    const filtered = items.filter(p =>
                        p.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())
                    );
                    renderCategoryItems(filtered, categoryName);
                };
                searchInput.addEventListener("input", doSearch);
                searchBtn.addEventListener("click", doSearch);
            }
        })
        .catch(err => {
            console.error("Menu JSON failed to load:", err);
            if (menuContainer) menuContainer.innerHTML = "<p>Failed to load menu.</p>";
        });

    function renderCategoryItems(items, category) {
        const target = document.getElementById("menu") || document.getElementById("menuContainer");
        if (!target) return;

        if (items.length === 0) {
            target.innerHTML = '<p style="color: gray;"><br><br><br><br>Nothing here... yet! Stay tuned for delicious updates.</p>';
            return;
        }


        target.innerHTML = items.map(item => {
            if (category === "Meals") {
                return `
          <div class="item">
            <h4>${item.name}</h4>
            <img src="admin/${item.image}" alt="${item.name}">
            <p>${item.description}</p>
            <h5>₱${item.medium} <span class="orange">(NO RICE)</span> | ₱${item.large} <span class="orange">(WITH RICE)</span></h5>
          </div>`;
            } else if (category === "Bread" || category === "Snacks") {
                return `
          <div class="item">
            <h4>${item.name}</h4>
            <img src="admin/${item.image}" alt="${item.name}">
            <p>${item.description}</p>
            <h5><span class="orange">₱${item.medium}</span></h5>
          </div>`;
            } else {
                return `
          <div class="item">
            <h4>${item.name}</h4>
            <img src="admin/${item.image}" alt="${item.name}">
            <p>${item.description}</p>
            <h5><span class="orange">M</span> ₱${item.medium} | <span class="orange">L</span> ₱${item.large}</h5>
          </div>`;
            }
        }).join("");
    }

    function handleFooterSearch(data) {
        const query = footerInput.value.trim().toLowerCase();
        footerResults.innerHTML = "";
        footerResults.style.display = "none";

        if (!query) return;

        const matches = [];

        for (const category in data) {
            data[category].forEach(item => {
                if (item.name.toLowerCase().includes(query)) {
                    matches.push({
                        name: item.name,
                        category: category,
                        link: categoryLinks[category]
                    });
                }
            });
        }

        if (matches.length > 0) {
            matches.forEach(match => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `${match.link}?search=${encodeURIComponent(match.name)}`;
                a.textContent = `${match.name} | ${match.category}`;
                li.appendChild(a);
                footerResults.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No products found.";
            li.style.color = "#000";
            footerResults.appendChild(li);

        }

        footerResults.style.display = "block";
    }

    function toTitleCase(str) {
        return str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const selectedRating = document.querySelector("input[name='rating']:checked");
            if (!selectedRating) return alert("Please select a rating!");

            const phoneInput = document.querySelector("input[name='your-number']");
            const phone = phoneInput.value;
            const phonePattern = /^09\d{9}$/;
            if (!phonePattern.test(phone)) return alert("Invalid PH number starting with 09 and 11 digits.");

            const formData = new FormData(form);
            formData.append("rating", selectedRating.value);

            fetch("save_review.php", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status === "success") {
                        alert(`Thank you! You rated ${selectedRating.value} stars!`);
                        form.reset();
                        loadApprovedComments?.();
                    } else {
                        alert("Error submitting review. Try again.");
                    }
                })
                .catch(err => {
                    console.error("Submit error:", err);
                    alert("Error submitting review.");
                });
        });
    }

    const textarea = document.querySelector("textarea[name='message']");
    const count = document.getElementById("count");
    if (textarea && count) {
        const maxLength = 50;
        textarea.setAttribute("maxlength", maxLength);
        textarea.addEventListener("input", () => {
            count.textContent = maxLength - textarea.value.length;
        });
    }

    window.openFoodpanda = function () {
        const url = "https://www.foodpanda.ph/restaurant/gnqp/uyu-cha-malinta";
        const width = 600;
        const height = 700;
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        window.open(url, "FoodpandaPopup", `width=${width},height=${height},top=${top},left=${left}`);
    };

    let currentIndex = 2;
    const slides = document.querySelectorAll(".slide");
    const slider = document.getElementById("slider");

    function updateSlides() {
        slides.forEach((slide, i) => slide.classList.toggle("active", i === currentIndex));
        slider.style.transform = `translateX(${-(currentIndex - 2) * 270}px)`;
    }

    window.nextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlides();
    };

    window.prevSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlides();
    };

    updateSlides();
});



