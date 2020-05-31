// Create variable to hold map element, give initial settings to map
var map = L.map("map", {center: [49.254667, -122.825015], zoom: 12});

// Add OpenStreetMap tile layer to map element
L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19}
).addTo(map);

addGeoJson(map) {

    console.log('DRAGANA1211:Logging to the console');

    // var geojsonFeature = {
    //   "type": "Feature",
    //   "properties": {
    //     "name": "Coors Field",
    //     "amenity": "Baseball Stadium",
    //     "popupContent": "This is where zdravo"
    //   },
    //   "geometry": {
    //     "type": "Point",
    //     "coordinates": [-104.99404, 39.75621]
    //     //"coordinates": [39.75621, -104.99404]
    //   }
    // };

    //L.geoJSON(geojsonFeature).addTo(map);

    var geojsonMarkerOptions = {
      radius: 5,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    L.geoJson(geojsonFeature, {

      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions);
      }
    }).addTo(map);
  }

// // Create an empty popup
// var popup = L.popup();

// // Function to set popup contents
// function onMapClick(e) {
//     popup
//         .setLatLng(e.latlng)
//         .setContent(
//             "You clicked the map at -<br>" + 
//             "<b>lon:</b> " + e.latlng.lng + "<br>" + 
//             "<b>lat:</b> " + e.latlng.lat
//         )
//         .openOn(map);
// }

// // Add event listener for click events on the map
// map.on("click", onMapClick);
