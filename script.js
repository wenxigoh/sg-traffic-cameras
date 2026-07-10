//standard map from openstreetmap
var map = L.map('map').setView([1.3521, 103.8198], 12);
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap.<br> Contains information from "Taxi Availability" from LTA Datamall <br> which is made under the terms <br> of the Singapore Open Data Licence 1.0 <br> (datamall.lta.gov.sg/content/datamall/en/SingaporeOpenDataLicence.html)'
}).addTo(map);


//satellite map from onemap
var satellite = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Satellite/{z}/{x}/{y}.png', {
  detectRetina: true,
  maxZoom: 19,
  minZoom: 11,
  /** DO NOT REMOVE the OneMap attribution below **/
  attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
});

//button to switch between maps
var maps = {"Standard": osm, "Satellite": satellite};
L.control.layers(maps, null, {position: 'bottomleft'}).addTo(map);

//group for camera dots
var markers = L.layerGroup().addTo(map);

//function to get traffic images
function getTraffic() {
  fetch('https://api.data.gov.sg/v1/transport/traffic-images')
    .then(res => res.json())
    .then(data => {
      markers.clearLayers();
      var cameras = data.items[0].cameras;
      
      for (var i = 0; i < cameras.length; i++) {
        var c = cameras[i];
        var time = new Date(c.timestamp).toLocaleString();
        var html = '<img src="' + c.image + '" width="300" onclick="zoom(\'' + c.image + '\')" style="cursor:pointer"><p>At: ' + time + '</p>';
        
        L.circleMarker([c.location.latitude, c.location.longitude])
          .bindPopup(html)
          .addTo(markers);
      }
      document.getElementById('time').innerText = new Date().toLocaleTimeString();
    });
}

//start it and refresh every minute
getTraffic();
setInterval(getTraffic, 60000);

//function for clicking an image to big screen
function zoom(url) {
  document.getElementById('zoom-img').src = url;
  document.getElementById('zoom-box').style.display = 'block';
}
