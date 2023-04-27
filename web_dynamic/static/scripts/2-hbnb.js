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

  $.get('http://127.0.0.1:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});