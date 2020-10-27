/*

Pre-requisites: install JSON server: https://github.com/typicode/json-server#getting-started

Create a web application that shows a list of 
restaurants from your database and their reviews. 

Core requirements:

1. Populate the page with restaurants from your local 
database, showing the name, address, an image, and the 
average review score. For instance, if there are 2 reviews
 on a restaurant, one for 4 stars and one for 3 stars, 
 the average review score should be 3.5. Use .map(). 

2. Show the reviews from your local database below each 
restaurant, showing the text and star rating. Use .filter() and .map().

3. Sort the restaurants from highest-rated to lowest-rated. Use .sort().

4. Create a form that allows the user to write a new review
 and give a star rating. When the user submits the form the 
 new review should show up on the page WITHOUT reloading the page.

Complete at least one of the following requirements then 
complete as many others as possible in whichever order you'd like.

1. The form should not be shown until someone clicks a button. 
Make sure the correct restaurantId is being added to the review. 
Only one form should be visible at a time.

2. The reviews should only be shown below the restaurant after 
the user clicks a restaurant. Only one restaurant's reviews 
should be visible at a time.

3. Add the option to delete reviews, but not restaurants. Deleting
 a review should remove it from the database. After deleting, 
 show the updated list of reviews WITHOUT reloading the page.

4. Add users to the database. Associate them with reviews and show 
the user's details on the review. Use the .find() method to do so.

Grading criteria:
1. Use the methods that are listed in each requirement.
2. Use async/await and fetch and use only the data that exists in 
your database.
3. Use only ES6+ techniques if needed: template strings (`${}`), 
arrow functions, forEach(), etc.
4. Use GitHub and make a new branch for each numbered task, so at 
least 5 branches total. Give the branch a meaningful name using this 
convention: feature/show-restaurants. Merge the feature branch into 
your main branch when you complete the task. 
5. Do not have any extraneous comments beyond explanations of code 
(if needed) in your final result. Do not have any console.logs, 
in comments or otherwise.
6. CSS is not necessary and will not be graded but is encouraged 
for the sake of practice.

*/

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

const createReview = async (id, restaurantId, stars, text) => {

    const newReview = {
        id,
        restaurantId,
        stars,
        text,
    };

    await fetch("http://localhost:3000/reviews", {
        method: "POST",
        body: JSON.stringify(newReview),
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
            `<span id="name">${restaurant.name}</span> - <span id="name">${restaurant.averageRating} ★</span>
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
                createReview(restaurants.id, reviews.restaurantId, parseInt(reviewStars), reviewText);
            };

            submitForm.addEventListener("click", newReview);
        })
};

getData();