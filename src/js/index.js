import dotenv from 'dotenv'
dotenv.config()

const pivotLat = 34.679135
const pivotLng = 133.9173
const mymap = L.map('mapid').setView([pivotLat, pivotLng], 17)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: process.env.MAPBOX_ACCESS_TOKEN
}).addTo(mymap)

// L.marker([35.589521, 139.591704]).addTo(mymap)
//   .bindPopup('test')
//   .openPopup()

// クリックした箇所の緯度経度をポップアップ
const popup = L.popup()
const onMapClick = (e) => {
  popup.setLatLng(e.latlng)
        .setContent('You clicked the map at ' + e.latlng.toString())
        .openOn(mymap)
}
mymap.on('click', onMapClick)

const leftTopLat = 34.681252
const leftLng = 133.912729
let lat;
for (let i = 0; i < 7; i++) {
  lat = leftTopLat - 0.0008 * i
  for (let j = 0; j < 8; j++) {
    L.marker([lat, leftLng + 0.0012 * j]).addTo(mymap)
      .on('click', (e) => {
        console.log(e)
      })
    // L.circle([lat, leftLng + 0.0012 * j], {
    //   color: 'red'
    // }).addTo(mymap)
    //   .on('click', (e) => {
    //     console.log(e.target.options)
    //   })
  }
}
