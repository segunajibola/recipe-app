const meals = document.getElementById("meals");
const favouriteContainer = document.getElementById("fav-meals");


getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    
    const respData = await resp.json();

    const randomMeal = respData.meals[0];

    console.log(randomMeal)

    addMeal(randomMeal, true)
}

async function getMealById(id) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal;
}

async function getMealsBySearch(term) {
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + term);
}

function addMeal(mealData, random = false) {
    console.log(mealData);
    
    const meal = document.createElement("div");
    const refreshMeal = document.createElement("div");

    meal.classList.add("meal");
    


    meal.innerHTML = `
                <div class="meal-header">
                    ${random ? `<span class="random">Random Recipe</span>` : ""}
                    <img src="${mealData.strMealThumb}" alt="${mealData.Meal}">
                </div>
                <div class="meal-body">
                    <h4>${mealData.strMeal}</h4>
                    <span onClick="location.reload()">New mgeal</span>
                    <button class="fav-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                `;

                refreshMeal.classList.add("refresh-btn");
                refreshMeal.innerHTML = `<span onClick="location.reload()">New meal</span>`;
                
                const btn = meal.querySelector(".meal-body .fav-btn");
                btn.addEventListener("click", () => {
                    if (btn.classList.contains("active")) {
                        removeMealLS(mealData.idMeal);
                        btn.classList.remove("active");
                    } else {
                        addMealLS(mealData.idMeal);
                        btn.classList.add
                    ("active");
                    }

                    // clean the container
                    // favouriteContainer.innerHTML = "";
                    // location.reload();
                    fetchFavMeals();
                });
                
                meals.appendChild(meal);
                meals.appendChild(refreshMeal);

}

function addMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();

    localStorage.setItem(
        "mealIds",
        JSON.stringify(mealIds.filter((id) => id !== mealId))
    );
}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
     // clean the container
     favouriteContainer.innerHTML = "";
    const mealIds = getMealsLS();

    const meals = [];

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        
        addMealFav(meal);
    }

}

function addMealFav(mealData) {
    const favMeal = document.createElement("li");

    favMeal.innerHTML = `<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
    <span>${mealData.strMeal}</span>
    <button class="clear"><i class="fas fa-window-close"></i></button>
    `;

    const btn = favMeal.querySelector(".clear");

    btn.addEventListener("click", () => {
        removeMealLS(mealData.idMeal);

        fetchFavMeals();
    });

    favouriteContainer.appendChild(favMeal);
}