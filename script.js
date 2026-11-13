document.addEventListener("DOMContentLoaded", function () {
    const offerButtons = document.querySelectorAll(".offer-card a");

    offerButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            if (button.getAttribute("href") === "#") {
                event.preventDefault();
                alert("Offer link will be added soon!");
            }
        });
    });
});