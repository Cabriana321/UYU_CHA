document.addEventListener("DOMContentLoaded", function () {

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

    const textarea = document.querySelector("textarea[name='message']");
    const count = document.getElementById("count");
    if (textarea && count) {
        const maxLength = 50;
        textarea.setAttribute("maxlength", maxLength);
        textarea.addEventListener("input", () => {
            count.textContent = maxLength - textarea.value.length;
        });
    }
});



