function getApiKey() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "get_api_key.php",
      method: "GET",
      success: function (data) {
        resolve(data.apiKey);
      },
      error: function (error) {
        reject("Error fetching API key: " + error);
      },
    });
  });
}

function setUVIValue(value) {
  const uviElement = document.getElementById("uvi");
  const uviCardElement = document.getElementById("uvi-card");
  uviElement.innerHTML = value;

  if (value < 3) {
    uviCardElement.style.backgroundColor = "#009966";
    uviCardElement.style.color = "white";
  } else if (value >= 3 && value < 6) {
    uviCardElement.style.backgroundColor = "#ffde33";
    uviCardElement.style.color = "black";
  } else if (value >= 6 && value < 8) {
    uviCardElement.style.backgroundColor = "#ff9933";
    uviCardElement.style.color = "black";
  } else if (value >= 8 && value < 11) {
    uviCardElement.style.backgroundColor = "#cc0033";
    uviCardElement.style.color = "white";
  } else if (value >= 11) {
    uviCardElement.style.backgroundColor = "#660099";
    uviCardElement.style.color = "white";
  }
}

function setOzoneValue(value) {
  const ozoneElement = document.getElementById("ozone");
  const ozoneCardElement = document.getElementById("ozone-card");
  ozoneElement.innerHTML = value + " µg/m³";

  if (value < 125) {
    ozoneCardElement.style.backgroundColor = "#009966";
    ozoneCardElement.style.color = "white";
  } else if (value >= 125 && value < 150) {
    ozoneCardElement.style.backgroundColor = "#ffde33";
    ozoneCardElement.style.color = "black";
  } else if (value >= 150 && value < 200) {
    ozoneCardElement.style.backgroundColor = "#cc0033";
    ozoneCardElement.style.color = "white";
  } else if (value >= 200 && value < 300) {
    ozoneCardElement.style.backgroundColor = "#660099";
    ozoneCardElement.style.color = "white";
  } else if (value >= 300) {
    ozoneCardElement.style.backgroundColor = "#7e0023";
    ozoneCardElement.style.color = "white";
  }
}

function setPM25Value(value) {
  const pm25Element = document.getElementById("PM2.5");
  const pm25Card = document.getElementById("PM25-card");
  pm25Element.innerHTML = value + " µg/m³";

  if (value >= 0 && value <= 12) {
    pm25Card.style.backgroundColor = "#009966";
    pm25Card.style.color = "white";
  } else if (value > 12 && value <= 35.5) {
    pm25Card.style.backgroundColor = "#ffde33";
    pm25Card.style.color = "black";
  } else if (value > 35.5 && value <= 55.5) {
    pm25Card.style.backgroundColor = "#ff9933";
    pm25Card.style.color = "black";
  } else if (value > 55.5 && value <= 150.5) {
    pm25Card.style.backgroundColor = "#cc0033";
    pm25Card.style.color = "white";
  } else if (value > 150.5 && value <= 225.5) {
    pm25Card.style.backgroundColor = "#660099";
    pm25Card.style.color = "white";
  } else if (value > 225.5) {
    pm25Card.style.backgroundColor = "#7e0023";
    pm25Card.style.color = "white";
  }
}

function setPM10Value(value) {
  const pm10Element = document.getElementById("PM10");
  const pm10Card = document.getElementById("PM10-card");
  pm10Element.innerHTML = value + " µg/m³";

  if (value >= 0 && value <= 55) {
    pm10Card.style.backgroundColor = "#009966";
    pm10Card.style.color = "white";
  } else if (value > 55 && value <= 155) {
    pm10Card.style.backgroundColor = "#ffde33";
    pm10Card.style.color = "black";
  } else if (value > 155 && value <= 255) {
    pm10Card.style.backgroundColor = "#ff9933";
    pm10Card.style.color = "black";
  } else if (value > 255 && value <= 355) {
    pm10Card.style.backgroundColor = "#cc0033";
    pm10Card.style.color = "white";
  } else if (value > 355 && value <= 425) {
    pm10Card.style.backgroundColor = "#660099";
    pm10Card.style.color = "white";
  } else if (value > 425) {
    pm10Card.style.backgroundColor = "#7e0023";
    pm10Card.style.color = "white";
  }
}

function showAlert(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add(
    "alert",
    "alert-" + type,
    "alert-dismissible",
    "fade",
    "show"
  );
  alertDiv.setAttribute("role", "alert");

  alertDiv.innerHTML = message;

  const closeButton = document.createElement("button");
  closeButton.setAttribute("type", "button");
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("data-bs-dismiss", "alert");
  closeButton.setAttribute("aria-label", "Close");
  alertDiv.appendChild(closeButton);

  document.getElementById("alert-container").appendChild(alertDiv);

  setTimeout(() => {
    document.getElementById("alert-container").removeChild(alertDiv);
    alertDiv.classList.remove("show");
  }, 5000);
}

async function render() {
  try {
    const apiKey = await getApiKey();
    var city = document.getElementById("inputField").value.toLowerCase();

    if (city.includes(" ")) {
      city = city.split(" ").join("-");
    }
    if (city == null || city == "") {
      showAlert("Please enter a city name!", "danger");
      return;
    }
    getAirQuality(apiKey, city);
  } catch (error) {
    console.log("Error fetching API key: " + error);
  }
}

async function getAirQuality(apiKey, city) {
  const response = await fetch(
    "https://api.waqi.info/feed/" + city + "/?token=" + apiKey
  );
  const data = await response.json();
  if (data.status === "error") {
    showAlert("City not found", "danger");
    return;
  } else {
    _aqiFeed({
      display: "%details",
      container: "city-aqi-container",
      city: city,
    });

    setPM10Value(data.data.forecast.daily.pm10[0].avg);
    setPM25Value(data.data.forecast.daily.pm25[0].avg);
    setOzoneValue(data.data.forecast.daily.o3[0].avg);
    setUVIValue(data.data.forecast.daily.uvi[0].avg);

    document.getElementById("temperature").innerHTML =
      data.data.iaqi.t.v + " °C";
    document.getElementById("humidity").innerHTML = data.data.iaqi.h.v + " %";

    document.getElementById("wind_speed").innerHTML =
      data.data.iaqi.w.v + " m/s";
    document.getElementById("pressure").innerHTML = data.data.iaqi.p.v + " hPa";
  }
}

function initializeAQIFeed(w, d, t, f) {
  w[f] =
    w[f] ||
    function (c, k, n) {
      (s = w[f]), (k = s["k"] = s["k"] || (k ? "&k=" + k : ""));
      s["c"] = c = c instanceof Array ? c : [c];
      s["n"] = n = n || 0;
      (L = d.createElement(t)), (e = d.getElementsByTagName(t)[0]);
      L.async = 1;
      L.src =
        "//feed.aqicn.org/feed/" +
        c[n].city +
        "/" +
        (c[n].lang || "") +
        "feed.v1.js?n=" +
        n +
        k;

      L.onerror = function (error) {
        console.error("Failed to load AQI feed: " + error);
        showAlert(
          "Failed to load AQI feed for city: " +
            c[n].city +
            ". Not enough data for that location is available. Please enter a valid city name.",
          "danger"
        );
      };

      e.parentNode.insertBefore(L, e);
    };
}
initializeAQIFeed(window, document, "script", "_aqiFeed");

var input = document.getElementById("inputField");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("showButton").click();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl, {
      delay: { show: 250, hide: 500 },
    });
  });
});
