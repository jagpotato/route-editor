import dotenv from 'dotenv'
dotenv.config()

const pivotLat = 34.679135
const pivotLng = 133.9173
const mymap = L.map('mapid').setView([pivotLat, pivotLng], 15)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: process.env.MAPBOX_ACCESS_TOKEN
}).addTo(mymap)

// 飛行計画
const flightPlan = []
// チェックポイントid
let checkPointID = 0
// チェックポイントを通る時間
let time = 0
// 追加したマーカーの緯度経度リスト
const addedMarkerList = []

// ラジオボタンでモード切り替え
let mode = document.getElementById('modeSelect').mode.value
document.getElementById('modeSelect').addEventListener('change', (e) => {
  mode = e.target.value
}, false)

// チェックポイントを飛行計画に追加
const addCheckPointToFlightPlan = (time, id) => {
  flightPlan.push({time: time, checkPointID: id})
}

// マーカーの追加
const addMarker = (lat, lng, id) => {
  L.marker([lat, lng], {checkPointID: id}).addTo(mymap)
    .on('click', (e) => {
      if (mode === 'makeFlightPlan') {
        addCheckPointToFlightPlan(time, e.target.options.checkPointID)
        time++
        if (document.getElementById('flightPlanDownload').disabled) {
          document.getElementById('flightPlanDownload').disabled = false
        }
        console.log(e.target.options.checkPointID)
      }
    })
}

// マップクリック時の処理
const handleMapClick = (e) => {
  if (mode === 'addCheckPoint') {
    addMarker(e.latlng.lat, e.latlng.lng, checkPointID)
    checkPointID++
    addedMarkerList.push({lat: e.latlng.lat, lng: e.latlng.lng})
    console.log('add marker to (' + e.latlng.lat + ',' + e.latlng.lng + ',' + 0 + ')')
  }
}

// マップクリックイベントの追加
mymap.on('click', handleMapClick)

// ファイル選択時の処理
const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file.name !== 'checkpoint.csv') {
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
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
    // csvファイルから読み取ったチェックポイントを出力
    for (let checkPoint of checkPointList) {
      addMarker(checkPoint.lat, checkPoint.lng, checkPointID)
      checkPointID++
    }
  }
  reader.readAsText(file)

  document.getElementById('inputCheckPoint').disabled = "disabled"
}

// ファイル選択イベントの追加
document.getElementById('inputCheckPoint').addEventListener('change', handleFileSelect, false)

// 飛行計画ダウンロード
const downloadFlightPlan = (flightPlan) => {
  const outputFlightPlan = {"flightPlan": flightPlan}
  const blob = new Blob([JSON.stringify(outputFlightPlan, null, '  ')], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date()
  const downloadFileName = 'flightplan' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + '.json'
  link.download = downloadFileName
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

// 飛行計画ダウンロードボタンクリック時の処理
const handleFlightPlanDownloadButtonClick = (e) => {
  // 飛行計画が入力されている場合
  if (flightPlan.length > 0) {
    downloadFlightPlan(flightPlan)
  }
}

// イベントの追加
document.getElementById('flightPlanDownload').addEventListener('click', handleFlightPlanDownloadButtonClick, false)

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
