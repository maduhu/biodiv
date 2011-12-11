  
if(!Array.prototype.last) {
    Array.prototype.last = function() {
        return this[this.length - 1];
    }
}

var geocoder;
var map;
var marker;
var latitude;
var longitude;
    
function initialize(){
  var latlng = new google.maps.LatLng(21.07,79.27);
  var options = {
    zoom: 4,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
        
  map = new google.maps.Map(document.getElementById("map_canvas"), options);
        
  geocoder = new google.maps.Geocoder();
        
  marker = new google.maps.Marker({
    map: map,
    draggable: true
  });

				
}

function set_location(lat, lng) {
        $("#latitude").html(lat);
        $("#longitude").html(lng);
        var location = new google.maps.LatLng(lat, lng);
        marker.setPosition(location);
        map.setCenter(location);

        geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    $('#place_name').val(results[0].formatted_address);
                    $('#latitude').html(marker.getPosition().lat());
                    $('#longitude').html(marker.getPosition().lng());
                    $('#reverse_geocoded_name_field').val(results[0].formatted_address);
                    $('#latitude_field').val(marker.getPosition().lat());
                    $('#longitude_field').val(marker.getPosition().lng());
                }
            }
        });

}

function convert_DMS_to_DD(days, minutes, seconds, direction) {
    var dd = days + minutes/60 + seconds/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

function update_geotagged_images_list() {
    var html = '';
    $('.geotagged_image').each(function() {
        var latlng = get_latlng_from_image(this); 
        if (latlng) {
            var func = "set_location(" + latlng + ")";
            html = html + '<div class="button" onclick="' + func + '"><div style="width:40px; height:40px;float:left;"><img style="width:100%; height:100%;" src="' + this.src + '"/></div><div style="float:left; padding:10px;">Use this geotagged image to detect location</div></div>';
        }
    });


    $('#geotagged_images').html(html);
}

function get_latlng_from_image(img) {
        
        var gps_lat = $(img).exif("GPSLatitude");
        var gps_lng = $(img).exif("GPSLongitude");
        var gps_lat_ref = $(img).exif("GPSLatitudeRef");
        var gps_lng_ref = $(img).exif("GPSLongitudeRef");

        if (gps_lat != '' && gps_lng != ''){
            var lat_dms = gps_lat.last();
            var lng_dms = gps_lng.last();
            var lat = convert_DMS_to_DD(lat_dms[0], lat_dms[1], lat_dms[2], gps_lat_ref);
            var lng = convert_DMS_to_DD(lng_dms[0], lng_dms[1], lng_dms[2], gps_lng_ref);
            latitude = lat;
            longitude = lng;
            //set_location(lat, lng);
            return lat + ", " + lng
        } 
       
     /*
      geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#address').val(results[0].formatted_address);
        }
      }
    });
    */
}


$(document).ready(function() { 
  
  $('#address').watermark('Where did you found this observation?');

  initialize();
  window.setTimeout(update_geotagged_images_list, 10);
    
  window.setTimeout(function() {
      if (latitude && longitude){
        set_location(latitude, longitude);
      } else {
        set_location(21.07, 79.27);
      } 
  }, 10);
				  
  $(function() {
    $("#address").autocomplete({
      source: function(request, response) {
        geocoder.geocode( {'address': request.term +'+india', 'region':'in'}, function(results, status) {
          response($.map(results, function(item) {
            return {
              label:  item.formatted_address,
              value: item.formatted_address,
              latitude: item.geometry.location.lat(),
              longitude: item.geometry.location.lng()
            }
          }));
        })
      },

      select: function(event, ui) {
        set_location(ui.item.latitude, ui.item.longitude);
        $('#location_info').html('You have selected this location');
      },

    focus: function(event, ui) {
        //set_location(ui.item.latitude, ui.item.longitude);
        }

    });
  });
	
  //add listener to marker for reverse geocoding
  google.maps.event.addListener(marker, 'drag', function() {
    geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#place_name').val(results[0].formatted_address);
          $('#latitude').html(marker.getPosition().lat());
          $('#longitude').html(marker.getPosition().lng());
          $('#reverse_geocoded_name_field').val(results[0].formatted_address);
          $('#latitude_field').val(marker.getPosition().lat());
          $('#longitude_field').val(marker.getPosition().lng());
        }
      }
    });

    $('#location_info').html('You have selected this location');
  });
  
  function onSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        set_location(lat, lng);
        $('#location_info').html('Using auto-detected current location');
   geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#place_name').val(results[0].formatted_address);
        }
      }
    });
  }

  function onError(position) {
     if (google.loader.ClientLocation) {
      ipLocated = true;
      var lat = google.loader.ClientLocation.latitude;
      var lng = google.loader.ClientLocation.longitude;
      set_location(lat, lng);
      $('#location_info').html('Using auto-detected current location');

      geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#place_name').val(results[0].formatted_address);
        }
      }
    });

    } else {
      alert("Unable to detect current location");
    }
  }

  $('#current_location').click(function() {
    if (navigator.geolocation) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
      alert("Unable to detect current location");
    }
    }); 


  $('#image_location').click(function() {
          $(".geotagged_image").each(function() {
        var gps_lat = $(this).exif("GPSLatitude");
        var gps_lng = $(this).exif("GPSLongitude");
        var gps_lat_ref = $(this).exif("GPSLatitudeRef");
        var gps_lng_ref = $(this).exif("GPSLongitudeRef");
        
        if (gps_lat != '' && gps_lng != ''){
            var lat_dms = gps_lat.last();
            var lng_dms = gps_lng.last();
            var lat = convert_DMS_to_DD(lat_dms[0], lat_dms[1], lat_dms[2], gps_lat_ref);
            var lng = convert_DMS_to_DD(lng_dms[0], lng_dms[1], lng_dms[2], gps_lng_ref);
            set_location(lat, lng);
        }
        
      geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          $('#place_name').val(results[0].formatted_address);
        }
      }
    });
          });

    });

});
