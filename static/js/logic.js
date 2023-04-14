// url for the GeoJSON data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// map object
var myMap = L.map("map", {
  center: [15.5994, -28.6731],
  zoom: 3
});

// tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);



// set style of map
d3.json(url).then(function (data) {
  function mapStyle(feature) {
    return {
      opacity: 1,
      fillOpacity: 0.5,
      fillColor: markerColor(feature.geometry.coordinates[2]),
      color: "black",
      radius: markerRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // define marker size & function
  function markerColor(depth) {
    switch (true) {
      case depth > 300:
        return "black";
      case depth > 200:
        return "darkblue";
      case depth > 100:
        return "blue";
      case depth > 50:
        return "greenblue";
      case depth > 20:
        return "green";
      default:
        return "lightyellow";
    }
  }
  function markerRadius(mag) {
    if (mag == 0) {
      return 1;
    }
    return mag * 2;
  }
    // earthquake data to map
    L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: mapStyle,

    // tags
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

    }
  }).addTo(myMap);

  // legend
  var legend = L.control({ position: "topright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      depth = [0, 20, 50, 100, 200, 300];


    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap)
});