$(document).ready(function () {
  let amenity_dict = {};
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(":checked")) {
      amenity_dict[$(this).data("id")] = $(this).data("name");
      $("div.amenities h4").text(Object.values(amenity_dict).join(", "));
    } else if ($(this).is(":not(:checked)")) {
      delete amenity_dict[$(this).data("id")];
      $("div.amenities h4").text(Object.values(amenity_dict).join(", "));
    }
    console.log(amenity_dict);
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
          <div class="user">Owner: ${place.Owner}</div>
          <div class="description">${place.description}</div>
        </article>
      `);
    }
  }
