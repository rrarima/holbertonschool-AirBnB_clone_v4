$(document).ready(function () {
  let amenity_dict = {};
  let state_dict = {};
  let city_dict = {};

  $('input[type="checkbox"]').click(function () {
    const input_type = $(this).data("type");
    const input_id = $(this).data("id");
    const input_name = $(this).data("name");
    const isChecked = $(this).is(":checked");

    const data_dicts = {
      amenity: amenity_dict,
      state: state_dict,
      city: city_dict,
    };

    isChecked
      ? (data_dicts[input_type][input_id] = input_name)
      : delete data_dicts[input_type][input_id];

    $("div.amenities h4").text(Object.values(amenity_dict).join(", "));
    $("div.locations h4").text(
      Object.values(state_dict).concat(Object.values(city_dict)).join(", ")
    );

    console.log(amenity_dict, state_dict, city_dict);
  });

  $.get("http://127.0.0.1:5001/api/v1/status/", function (data) {
    const apiStatus = data.status;
    const apiStatusElem = $("#api_status");

    apiStatusElem.toggleClass("available", apiStatus === "OK");
    apiStatusElem.css(
      "background-color",
      apiStatus === "OK" ? "#FF545F" : "#CCCCCC"
    );
  });

  $("button").click(function () {
    $("section.places").empty();
    const selectedAmenities = Object.keys(amenity_dict);
    const selectedStates = Object.keys(state_dict);
    const selectedCities = Object.keys(city_dict);
    const requestData = {
      amenities: selectedAmenities,
      states: selectedStates,
      cities: selectedCities,
    };

    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:5001/api/v1/places_search",
      data: JSON.stringify(requestData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        placeArticle(data);
      },
    });
  });

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:5001/api/v1/places_search/",
    data: "{}",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      placeArticle(data);
    },
  });
});

function placeArticle(data) {
  const placesSection = $("section.places");
  for (const place of data) {
    placesSection.append(`
      <article>
        <div class="title_box">
          <h2>${place.name}</h2>
          <div class="price_by_night">$${place.price_by_night}</div>
        </div>
        <div class="information">
          <div class="max_guest">${place.max_guest} ${
      place.max_guest !== 1 ? "Guests" : "Guest"
    }</div>
          <div class="number_rooms">${place.number_rooms} ${
      place.number_rooms !== 1 ? "Bedrooms" : "Bedroom"
    }</div>
          <div class="number_bathrooms">${place.number_bathrooms} ${
      place.number_bathrooms !== 1 ? "Bathrooms" : "Bathroom"
    }</div>
        </div>
        <div class="user">Owner: ${place.owner}</div>
        <div class="description">${place.description}</div>
        <div class="reviews">
          <h2>
            Reviews
            <span id="toggle_reviews_${place.id}" data-placeid="${
      place.id
    }" class="toggle_reviews">show</span>
          </h2>
          <section id="reviews_${
            place.id
          }" class="review_list" style="display:none;"></section>
        </div>
      </article>
    `);
  }

  $(".toggle_reviews").click(function () {
    const placeId = $(this).data("placeid");
    const toggleButton = $(`#toggle_reviews_${placeId}`);
    const reviewsList = $(`#reviews_${placeId}`);

    if (toggleButton.text() === "show") {
      toggleButton.text("hide");
      reviewsList.show();
      fetchReviews(placeId, reviewsList);
    } else {
      toggleButton.text("show");
      reviewsList.hide();
      reviewsList.empty();
    }
  });
}

function fetchReviews(placeId, reviewsList) {
  $.get(
    `http://127.0.0.1:5001/api/v1/places/${placeId}/reviews`,
    function (data) {
      reviewsList.empty();
      for (const review of data) {
        const date = new Date(review.created_at);
        const month = date.toLocaleString("en", { month: "long" });
        const day = dateOrdinal(date.getDate());
        $.get(
          `http://127.0.0.1:5001/api/v1/users/${review.user_id}`,
          function (userData) {
            const user = userData.first_name + " " + userData.last_name;
            const reviewElem = `
          <li>
            <h3>From ${user} the ${day} ${month} ${date.getFullYear()}</h3>
            <p>${review.text}</p>
          </li>`;
            reviewsList.append(reviewElem);
          }
        );
      }
    }
  );
}

function dateOrdinal(dom) {
  if (dom === 31 || dom === 21 || dom === 1) return dom + "st";
  else if (dom === 22 || dom === 2) return dom + "nd";
  else if (dom === 23 || dom === 3) return dom + "rd";
  else return dom + "th";
}
