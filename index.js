const getRestaurants = async () => {
    const response = await fetch("http://localhost:3000/restaurants");
    const restaurants = response.json();
    return restaurants;
}

const getReviews = async () => {
    const response = await fetch("http://localhost:3000/reviews");
    const reviews = response.json();
    return reviews;
}

const createReview = async (restaurantId, stars, text) => {

    await fetch("http://localhost:3000/reviews", {
        method: "POST",
        body: JSON.stringify({
            restaurantId, 
            stars, 
            text}),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    getData();
};

const getData = async () => {

    const restaurants = await getRestaurants();
    const reviews = await getReviews();

    const result = document.querySelector("#result");
    result.innerHTML = "";

        const restaurantData = restaurants.map((restaurant) => {

            const reviewData = reviews.filter((review) => {
                return restaurant.id === review.restaurantId;
            });
            const ratingData = reviewData.map((review) => {
                return review.stars;
            });

            const averageRating = ratingData.reduce((a, b) => (a + b), 0) / ratingData.length;

            return {
                ...restaurant,
                averageRating,
            };
        });

        restaurantData.sort((a, b) => b.averageRating - a.averageRating).map((restaurant) => {

            let resultBox = document.createElement("div");
            resultBox.classList.add("resultBox");
            result.appendChild(resultBox);

            resultBox.innerHTML += 
            `<span id="name">${restaurant.name}</span> — <span id="name">${restaurant.averageRating} ★</span>
            <div id="address">${restaurant.address}</div>
            <div id="image" style="background-image: url(${restaurant.imgUrl})" alt="photo of ${restaurant.name}"></div>`

            let reviewBox = document.createElement("div");
            resultBox.appendChild(reviewBox);

            const stars = reviews.filter((review) => restaurant.id === review.restaurantId);

                stars.forEach((review) => {
                    reviewBox.innerHTML += 
                    `<div id="reviews"><span id="star">${review.stars} ★ </span> <span id="text">"${review.text}"</span></div>`
                });

            let reviewButton = document.createElement("div");
            reviewButton.id = "reviewButton";
            reviewButton.classList.add("show");
            reviewButton.innerHTML = `Write a Review <span id="arrow">↓</span>`;
            reviewBox.appendChild(reviewButton);
            reviewButton.addEventListener("click", () => {reviewForm.classList.toggle("show");
            });

            let reviewForm = document.createElement("form");
            reviewForm.id = "reviewForm";
            reviewForm.classList.add("hide");
            reviewBox.appendChild(reviewForm);

            let starsForm = document.createElement("div");
            starsForm.id = "starsForm";
            starsForm.innerHTML = `<span id="stars">★</span>`;
            reviewForm.appendChild(starsForm);

            let starNumber = document.createElement("input");
            starNumber.classList.add("starNumber");
            starNumber.setAttribute("size", "5");
            starsForm.appendChild(starNumber);

            let textForm = document.createElement("textarea");
            textForm.classList.add("textForm");
            textForm.setAttribute("type", "textarea");
            textForm.setAttribute("maxlength", "2000");
            textForm.setAttribute("rows", "8");
            textForm.setAttribute("cols", "62");
            reviewForm.appendChild(textForm);

            let submitForm = document.createElement("input");
            submitForm.id = "submitForm";
            submitForm.setAttribute("type", "submit");
            submitForm.setAttribute("value", "Submit");
            reviewForm.appendChild(submitForm);

            const newReview = async (event) => {
                event.preventDefault();
                const reviewText = document.getElementsByClassName("textForm")[0].value;
                const reviewStars = document.getElementsByClassName("starNumber")[0].value;
                createReview(parseInt(restaurant.id), parseInt(reviewStars), reviewText);
            };

            submitForm.addEventListener("click", newReview);
        })
};

getData();