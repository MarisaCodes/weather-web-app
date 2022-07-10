// Weather API by city name
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// API key
// d3ea8ae7f71ead52761191ffe7ffc7e8

// weather icons link (example link for icon:11d)
//https://openweathermap.org/img/wn/11d@2x.png
let test = false; //test variable for whether a country name is repeated
let city = "";
// resource for fetch
let resource =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=d3ea8ae7f71ead52761191ffe7ffc7e8";

// weather icon
let icon = "";
let iconLink = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
// div with class wrapper
const wrapper = document.querySelector(".wrapper");
// the search icon button
const btn = document.querySelector("button");

// when submitting user input, I am using button click and it happens to work well

btn.addEventListener("click", (event) => {
  event.preventDefault(); //prevent page reload
  city = btn.previousElementSibling.value;
  resource =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=d3ea8ae7f71ead52761191ffe7ffc7e8&units=metric"; //adding user input

  fetch(resource)
    .then((response) => {
      return response.json(); //this returns a promise object, can use .then() method on it
    })
    .then((data) => {
      let form = btn.parentElement;
      let arrForm = Array.from(form.children);
      arrForm.forEach((element) => {
        if (element.classList.contains("invalid-input")) {
          element.remove(); // cleaning all error messages (NOT just the message: invalid input X) after user searches data
        }
      });
      //looping through existing weather cards to "test" whether a city has already been searched for
      let arrWeatherCards = Array.from(
        btn.parentElement.nextElementSibling.children
      );
      for (let i = 0; i < arrWeatherCards.length; i++) {
        if (arrWeatherCards[i].querySelector(".city").innerText == data.name) {
          setTimeout(() => {
            let duplicateWarn = document.createElement("p");
            duplicateWarn.classList.add("invalid-input");
            duplicateWarn.innerText = `You already have the weather for ${data.name}!`;
            btn.parentElement.appendChild(duplicateWarn);
          }, 50);
          test = true; // test is changed to true if city already exists in cards
          break;
        } else {
          test = false;
        }
      }
      if (data && !test) {
        //getting weather icon
        icon = data.weather[0].icon;
        iconLink = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        //this is the string for the contents of a weather card

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
        weatherCard.querySelector(".city").innerText = data.name;
        weatherCard.querySelector(".country").innerText = data.sys.country;
        weatherCard.querySelector(".temperature").innerHTML = `<span></span>
                       <span>
                          <sup>&deg;C</sup>
                          <sup>|</sup>
                          <sup class="convert">&deg;F</sup>
                        </span>`;
        weatherCard.querySelector(
          ".temperature"
        ).firstElementChild.innerText = `${Math.ceil(data.main.temp)}`;
        weatherCard.querySelector(".description").innerText =
          data.weather[0].description.toUpperCase();
        weatherCard.querySelector("img").src = iconLink;
      }
    })
    .catch((err) => {
      // console.logging the error for my own tests, I am not sure if it is necessary
      console.log("could not fetch data", err);

      //if the button has a sibling element next to it (which will always be an error message) remove it...
      if (btn.nextElementSibling) {
        btn.nextElementSibling.remove();
      }

      // ...then add this specific error message but after 50ms. I wanted to created a text blink effect or a refresh effect
      setTimeout(() => {
        let warningText = document.createElement("p");
        warningText.classList.add("invalid-input");
        warningText.innerText = "Could not fetch data ❌";
        btn.parentElement.appendChild(warningText);
      }, 50);
    });

  //finally reset the input/search box so that it has nothing in it

  btn.previousElementSibling.value = "";
});

// deleting all cards/clearing the whole page

const trash = document.querySelector(".fa-trash-can");

trash.addEventListener("click", () => {
  test = false;
  let arrWeatherCards = Array.from(
    btn.parentElement.nextElementSibling.children
  );
  arrWeatherCards.forEach((element) => {
    element.remove();
  });
  if (btn.nextElementSibling) {
    btn.nextElementSibling.remove();
  }
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
        tempStr = String(Math.round((Number(tempStr) * 9) / 5 + 32));
        e.target.parentElement.parentElement.firstElementChild.innerText =
          tempStr;
      }
    } else if (e.target.nextElementSibling.nextElementSibling) {
      e.target.classList.remove("convert");
      e.target.nextElementSibling.nextElementSibling.classList.add("convert");
      let tempStr =
        e.target.parentElement.parentElement.firstElementChild.innerText;
      tempStr = String(Math.round(((Number(tempStr) - 32) * 5) / 9));
      e.target.parentElement.parentElement.firstElementChild.innerText =
        tempStr;
    }
  }
});
