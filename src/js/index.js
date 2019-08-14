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

// 追加したマーカーの緯度経度リスト
const addedMarkerList = []

// マーカーの追加
const addMarker = (lat, lng) => {
  L.marker([lat, lng]).addTo(mymap)
}

// クリック時の処理
const onMapClick = (e) => {
  addMarker(e.latlng.lat, e.latlng.lng)
  addedMarkerList.push({lat: e.latlng.lat, lng: e.latlng.lng})
  console.log('add marker to (' + e.latlng.lat + ',' + e.latlng.lng + ',' + 0 + ')')
}

// クリックイベントの追加
mymap.on('click', onMapClick)

// ファイル選択時の処理
const handleFileSelect = (e) => {
  console.log(e)
  const file = e.target.files[0]
  if (file.name !== 'checkpoint.csv') {
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    console.log(reader.result)
    // 改行ごとに分割
    const checkPointInput = reader.result.split('\n')
    // ヘッダ部分を削除
    checkPointInput.shift()
    // コンマごとに分割、誤った形式の入力を除去、オブジェクト形式に変換
    const posRegExp = /([0-9]|-[0-9]+)/
    const checkPointList = checkPointInput.map(x => x.split(','))
                                          .filter(x => x.every(y => posRegExp.test(y)))
                                          .map(x => {
                                            return {lat: x[0], lng: x[1], alt: x[2]}
                                          })
    console.log(checkPointList)
    // csvファイルから読み取ったチェックポイントを出力
    for (let checkPoint of checkPointList) {
      addMarker(checkPoint.lat, checkPoint.lng)
    }
  }
  reader.readAsText(file)
}

document.getElementById('inputCheckPoint').addEventListener('change', handleFileSelect, false)

// csv形式で出力
const exportMarkerListToCSV = () => {

}

// クリックした箇所の緯度経度をポップアップ
// const popup = L.popup()
// const onMapClick = (e) => {
//   popup.setLatLng(e.latlng)
//         .setContent('You clicked the map at ' + e.latlng.toString())
//         .openOn(mymap)
// }
// mymap.on('click', onMapClick)

// // マーカーを並べる
// const leftTopLat = 34.681252
// const leftLng = 133.912729
// let lat
// let flightPlan = []
// let flightPoint = {time: '', latitude: '', longitude: '', altitude: ''}
// flightPlan.push(flightPoint)
// let time = 0
// for (let i = 0; i < 7; i++) {
//   lat = leftTopLat - 0.0008 * i
//   for (let j = 0; j < 8; j++) {
//     L.marker([lat, leftLng + 0.0012 * j]).addTo(mymap)
//       .on('click', (e) => {
//         flightPoint = {time: time.toString(10),
//                       latitude: e.latlng.lat.toString(10),
//                       longitude: e.latlng.lng.toString(10),
//                       altitude: '0'
//                       }
//         flightPlan.push(flightPoint)
//         time++
//         console.log(flightPlan)
//       })
//     // L.circle([lat, leftLng + 0.0012 * j], {
//     //   color: 'red'
//     // }).addTo(mymap)
//     //   .on('click', (e) => {
//     //     console.log(e.target.options)
//     //   })
//   }
// }

const fs = require('fs')
console.log(fs)
// fs.writeFile('flightPlan.json', JSON.stringify(flightPlan, null, '  '))
