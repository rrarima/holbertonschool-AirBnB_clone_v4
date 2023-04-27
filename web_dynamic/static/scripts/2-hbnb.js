$(document).ready(function(){
  let amenity_dict = {};
  $('input[type="checkbox"]').click(function() {
    if ($(this).is(':checked')) {
      amenity_dict[$(this).data('id')] = $(this).data('name');
      $('div.amenities h4').text(Object.values(amenity_dict).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete amenity_dict[$(this).data('id')];
      $('div.amenities h4').text(Object.values(amenity_dict).join(', '));
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
});