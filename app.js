let test = false; //test variable for whether a country name is repeated

// div with class wrapper
const wrapper = document.querySelector(".wrapper");
// the search icon button
const btn = document.querySelector("button");

// // functions
// this function adds a loading message

const loadingMessage = () => {
  let loading = document.createElement("p");
  loading.classList.add("loading");
  loading.innerText = "Loading...";
  btn.parentElement.appendChild(loading);
};

// this function removes all error messages when the user searches something
const removeAllMessages = () => {
  let form = btn.parentElement;
  let arrForm = Array.from(form.children);
  arrForm.forEach((element) => {
    if (
      element.classList.contains("invalid-input") ||
      element.classList.contains("loading")
    ) {
      element.remove(); // cleaning all loading and error messages after user searches data
    }
  });
};
// this function is for getting the city name input and putting it into the url so data could be fetched
const getResource = (city = null) => {
  return (
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=d3ea8ae7f71ead52761191ffe7ffc7e8&units=metric"
  );
};

// this function is for getting the icon src

const getWeatherIcon = (icon = null) => {
  return "https://openweathermap.org/img/wn/" + icon + "@2x.png";
};

// this function is for the error message
const errorMessage = () => {
  let warningText = document.createElement("p");
  warningText.classList.add("invalid-input");
  warningText.innerText = "Could not fetch data ❌";
  btn.parentElement.appendChild(warningText);
};

// this function is for checking if a card already exists in the search results

const checkExistingCards = (cityName = null) => {
  let arrWeatherCards = Array.from(
    btn.parentElement.nextElementSibling.children
  );
  for (let i = 0; i < arrWeatherCards.length; i++) {
    //looping through existing weather cards to "test" whether a city has already been searched for

    if (arrWeatherCards[i].querySelector(".city").innerText == cityName) {
      removeAllMessages();
      let duplicateWarn = document.createElement("p");
      duplicateWarn.classList.add("invalid-input");
      duplicateWarn.innerText = `You already have the weather for ${cityName}!`;
      btn.parentElement.appendChild(duplicateWarn);
      test = true; // test is changed to true if city already exists in cards
      break;
    } else {
      test = false;
    }
  }
};

// this function for generating the weather card

const getWeatherCard = (
  iconUrl,
  cityName,
  countryInitials,
  temperature,
  weatherDescription
) => {
  //getting weather icon
  let iconLink = getWeatherIcon(iconUrl);

  let cardStr = ` <i class="fa-solid fa-xmark fa-2x"></i>  
                          <div class="location">
                              <span class="city"></span> 
                              <span class="country"></span>
                          </div>
                          <p class="temperature"></p>
                          <img/>
                          <p class="description"></p>`;

  weatherCard = document.createElement("div");
  weatherCard.className = "weather-card";
  weatherCard.innerHTML = cardStr;
  wrapper.appendChild(weatherCard);
  weatherCard.querySelector(".city").innerText = cityName;
  weatherCard.querySelector(".country").innerText = countryInitials;
  weatherCard.querySelector(".temperature").innerHTML = `<span></span>
                         <span>
                            <sup>&deg;C</sup>
                            <sup>|</sup>
                            <sup class="convert">&deg;F</sup>
                          </span>`;
  weatherCard.querySelector(
    ".temperature"
  ).firstElementChild.innerText = `${Math.round(temperature)}`;
  weatherCard.querySelector(".description").innerText =
    weatherDescription.toUpperCase();
  weatherCard.querySelector("img").src = iconLink;
};
// this function is for trashing all weather cards
const trashWeatherCards = () => {
  let arrWeatherCards = Array.from(
    btn.parentElement.nextElementSibling.children
  );
  for (let i = 0; i < arrWeatherCards.length; i++) {
    arrWeatherCards[i].remove();
  }
};
// when submitting user input, I am using button click and it happens to work well

btn.addEventListener("click", (event) => {
  event.preventDefault(); //prevent page reload
  removeAllMessages();
  let resource = getResource(btn.previousElementSibling.value); //getting url from using getResource on user's input
  loadingMessage(); // adding a loading message

  fetch(resource)
    .then((response) => {
      if (!response.ok) {
        removeAllMessages();
        // throwing error in case server is reached but failed to fetch resource
        throw Error("could not fetch requested resource");
      }
      return response.json(); //this returns a promise object, can use .then() method on it
    })
    .then((data) => {
      // checking if a weather card already exists
      checkExistingCards(data.name);

      if (data && !test) {
        getWeatherCard(
          data.weather[0].icon,
          data.name,
          data.sys.country,
          data.main.temp,
          data.weather[0].description
        );
        removeAllMessages();
      }
    })
    .catch((err) => {
      // console.logging the error for my own tests, I am not sure if it is necessary
      console.log(err.message);

      //if the button has a sibling element next to it (which will always be an error message) remove it...
      if (btn.nextElementSibling) {
        btn.nextElementSibling.remove();
      }

      // ...then add this specific error message
      errorMessage();
    });

  //finally reset the input/search box so that it has nothing in it

  btn.previousElementSibling.value = null;
});

// deleting all cards/clearing the whole page

const trash = document.querySelector(".fa-trash-can");

trash.addEventListener("click", () => {
  test = false;
  trashWeatherCards();
  let form = btn.parentElement;
  let arrForm = Array.from(form.children);
  arrForm.forEach((element) => {
    if (element.classList.contains("invalid-input")) {
      element.remove(); // cleaning only error messages after user searches data
    }
  });
});

//deleting an individual weaather card

wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-xmark")) {
    e.target.parentElement.remove();
  }

  // conversion from celsius to fahrenheit and vice versa
  //the ".convert" css class just grays out the unit that is not currently in use
  if (e.target.classList.contains("convert")) {
    if (e.target.previousElementSibling) {
      if (e.target.previousElementSibling.previousElementSibling) {
        e.target.classList.remove("convert");
        e.target.previousElementSibling.previousElementSibling.classList.add(
          "convert"
        );
        let tempStr =
          e.target.parentElement.parentElement.firstElementChild.innerText;
        tempStr = String(Math.round((Number(tempStr) * 9) / 5 + 32)); // conversion to degrees C
        e.target.parentElement.parentElement.firstElementChild.innerText =
          tempStr;
      }
    } else {
      e.target.classList.remove("convert");
      e.target.nextElementSibling.nextElementSibling.classList.add("convert");
      let tempStr =
        e.target.parentElement.parentElement.firstElementChild.innerText;
      tempStr = String(Math.round(((Number(tempStr) - 32) * 5) / 9)); // conversion to degrees F
      e.target.parentElement.parentElement.firstElementChild.innerText =
        tempStr;
    }
  }
});

const brightnessIcon = document.querySelector(".brightness-icon");
const colorVars = document.querySelector(":root");
brightnessIcon.addEventListener("click", () => {
  if (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--background")
      .trim() == "#010409"
  ) {
    brightnessIcon.style.setProperty("fill", "yellow");
    colorVars.style.setProperty("--background", "white");
    colorVars.style.setProperty("--country-background", "#F1D00A");
    colorVars.style.setProperty("--nav-bar-color", "#06283D");
    colorVars.style.setProperty("--cards", "#3E497A");
    colorVars.style.setProperty("--placeholder-color", "#47B5FF");
    colorVars.style.setProperty("--card-border", "#00B4D8");
    colorVars.style.setProperty("--card-text-color", "white");
    colorVars.style.setProperty("--input-text-color", "black");
    colorVars.style.setProperty("--warning-text", "#F1D00A");
    colorVars.style.setProperty("--loading", "black");
  } else {
    brightnessIcon.style.setProperty("fill", "white");
    colorVars.style.setProperty("--background", "#010409");
    colorVars.style.setProperty("--country-background", "#010409");
    colorVars.style.setProperty("--nav-bar-color", "#161b22");
    colorVars.style.setProperty("--cards", "#0d1117");
    colorVars.style.setProperty("--placeholder-color", "#5d646e");
    colorVars.style.setProperty("--card-border", "#30363d");
    colorVars.style.setProperty("--card-text-color", "#a2a9b1");
    colorVars.style.setProperty("--input-text-color", "#a2a9b1");
    colorVars.style.setProperty("--warning-text", "#a2a9b1");
    colorVars.style.setProperty("--loading", "white");
  }
});
