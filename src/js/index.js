import dotenv from 'dotenv'
dotenv.config()

const mymap = L.map('mapid').setView([35.689521, 139.691704], 10)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: process.env.MAPBOX_ACCESS_TOKEN
}).addTo(mymap)

L.marker([35.589521, 139.591704]).addTo(mymap)
  .bindPopup('test')
  .openPopup()

const popup = L.popup()

const onMapClick = (e) => {
  popup.setLatLng(e.latlng)
        .setContent('You clicked the map at ' + e.latlng.toString())
        .openOn(mymap)
}

mymap.on('click', onMapClick)
