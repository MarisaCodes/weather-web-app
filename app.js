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
const wrapper = document.querySelector(".wrapper");
const btn = document.querySelector("button");

//console.log(btn.previousElementSibling);

btn.addEventListener("click", (event) => {
  event.preventDefault();
  city = btn.previousElementSibling.value;
  resource =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=d3ea8ae7f71ead52761191ffe7ffc7e8&units=metric";

  fetch(resource)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let form = btn.parentElement;
      let arrForm = Array.from(form.children);
      arrForm.forEach((element) => {
        if (element.classList.contains("invalid-input")) {
          element.remove();
        }
      });
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
          test = true;
          break;
        } else {
          test = false;
        }
      }
      if (data && !test) {
        icon = data.weather[0].icon;
        iconLink = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        let cardStr = ` <i class="fa-solid fa-xmark"></i>
                        <div class="location">
          <span class="city"></span> <span class="country"></span>
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
        weatherCard.querySelector(".temperature").innerHTML = `${Math.ceil(
          Number(data.main.temp)
        )}<span><sup>&deg;C</sup></span>`;
        weatherCard.querySelector(".description").innerText =
          data.weather[0].description.toUpperCase();
        weatherCard.querySelector("img").src = iconLink;
      }
      if (btn.nextElementSibling) {
        if (btn.nextElementSibling.innerText == "Could not fetch data ❌") {
          btn.nextElementSibling.remove();
        }
      }
    })
    .catch((err) => {
      console.log("could not fetch data", err);
      if (btn.nextElementSibling) {
        btn.nextElementSibling.remove();
      }
      setTimeout(() => {
        let warningText = document.createElement("p");
        warningText.classList.add("invalid-input");
        warningText.innerText = "Could not fetch data ❌";
        btn.parentElement.appendChild(warningText);
      }, 50);
    });

  btn.previousElementSibling.value = "";
});

// deleting/clearing the whole page

const trash = document.querySelector(".fa-trash-can");

trash.addEventListener("click", () => {
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

//deleting a weaather card

wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-xmark")) {
    e.target.parentElement.remove();
  }
});
