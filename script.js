
document.addEventListener("DOMContentLoaded", function () {

    const categoryCards = document.querySelectorAll(".category-card");

    const offerCards = document.querySelectorAll(
        "#offers .offer-card[data-category]"
    );

    const offersSection = document.querySelector("#offers");

    // Show all offers when the page first loads
    function showAllOffers() {
        offerCards.forEach(function (offer) {
            offer.style.display = "block";
        });
    }

    // Filter offers by category
    categoryCards.forEach(function (card) {

        card.addEventListener("click", function (event) {

            event.preventDefault();

            const selectedCategory = card.dataset.category;

            offerCards.forEach(function (offer) {

                if (offer.dataset.category === selectedCategory) {
                    offer.style.display = "block";
                } else {
                    offer.style.display = "none";
                }

            });

            // Scroll to the offers section
            offersSection.scrollIntoView({
                behavior: "smooth"
            });

        });

    });

    // Offer buttons
    const offerButtons = document.querySelectorAll(
        "#offers .offer-card a"
    );

    offerButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            if (button.getAttribute("href") === "#") {
                event.preventDefault();
                alert("This offer link will be available soon!");
            }

        });

    });

    showAllOffers();

});
