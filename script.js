```javascript
document.addEventListener("DOMContentLoaded", function () {

    const categoryCards = document.querySelectorAll(".category-card");
    const offersSection = document.querySelector("#offers");
    const offerGrid = document.querySelector("#offers .offer-grid");

    // Convert Admin Panel categories to Homepage categories
    function getCategory(category) {

        const categories = {
            "job offers": "jobs",
            "reward offers": "rewards",
            "gift card offers": "gift-cards",
            "app offers": "app-install",
            "pin offers": "mobile-pin",
            "surveys": "surveys"
        };

        return categories[String(category || "").trim().toLowerCase()] || "other";
    }

    // Get all offer cards
    function getOfferCards() {
        return document.querySelectorAll(
            "#offers .offer-card[data-category]"
        );
    }

    // Show all offers
    function showAllOffers() {
        getOfferCards().forEach(function (offer) {
            offer.style.display = "block";
        });
    }

    // Filter offers by category
    function filterOffers(selectedCategory) {

        getOfferCards().forEach(function (offer) {

            if (offer.dataset.category === selectedCategory) {
                offer.style.display = "block";
            } else {
                offer.style.display = "none";
            }

        });

    }

    // Category card click events
    categoryCards.forEach(function (card) {

        card.addEventListener("click", function (event) {

            event.preventDefault();

            const selectedCategory = card.dataset.category;

            filterOffers(selectedCategory);

            offersSection.scrollIntoView({
                behavior: "smooth"
            });

        });

    });

    // Validate external URLs
    function safeURL(value) {

        try {
            const url = new URL(value);

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }

        } catch (error) {
            return null;
        }

        return null;
    }

    // Create a new offer card
    function createOfferCard(offer) {

        const card = document.createElement("div");
        card.className = "offer-card";
        card.dataset.category = getCategory(offer.category);

        const top = document.createElement("div");
        top.className = "offer-card-top";

        if (offer.network) {
            const networkBadge = document.createElement("span");
            networkBadge.className = "network-badge";
            networkBadge.textContent = offer.network;
            top.appendChild(networkBadge);
        }

        if (offer.category) {
            const categoryBadge = document.createElement("span");
            categoryBadge.className = "network-badge";
            categoryBadge.textContent = offer.category;
            top.appendChild(categoryBadge);
        }

        card.appendChild(top);

        const title = document.createElement("h3");
        title.textContent = offer.title || "New Offer";
        card.appendChild(title);

        const description = document.createElement("p");
        description.textContent = offer.description || "";
        card.appendChild(description);

        const offerURL = safeURL(offer.link);

        if (offerURL) {

            const button = document.createElement("a");
            button.href = offerURL;
            button.className = "offer-button";
            button.target = "_blank";
            button.rel = "noopener noreferrer";
            button.textContent = "View Offer →";

            card.appendChild(button);

        }

        return card;
    }

    // Load published offers from Cloudflare D1
    async function loadOffers() {

        try {

            const response = await fetch("/api/offers");

            if (!response.ok) {
                throw new Error("Could not load offers");
            }

            const offers = await response.json();

            if (!Array.isArray(offers)) {
                throw new Error("Invalid offers data");
            }

            offers.forEach(function (offer) {

                const card = createOfferCard(offer);
                offerGrid.appendChild(card);

            });

            showAllOffers();

            console.log("Offers loaded successfully:", offers.length);

        } catch (error) {

            console.error("Offers loading error:", error);

        }

    }

    // Load offers when homepage opens
    showAllOffers();
    loadOffers();

});
```