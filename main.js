import { detecIcon,detecType, setStorage } from './helpers.js';

// !! HTML'den gelenler
const form = document.querySelector('form');
const list = document.querySelector('ul');

// Olay izleyicileri
form.addEventListener('submit', handleSubmit);
list.addEventListener("click",handleClick)

// Ortak Kullanim Alani
let map;
let coords = [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let layerGroup = [];

// kullanicinin konumunu ogrenme
navigator.geolocation.getCurrentPosition(
  loadMap,
  console.log('User did not allow') // ????
);

// Haritaya tiklandiginda calisir.
function onMapClick(e) {
  form.style.display = 'flex';
  coords = [e.latlng.lat, e.latlng.lng];
  console.log(coords);
}

// kullanicinin konumuna gore ekrana haritayi gosterme
function loadMap(e) {
  // var map = L.map('map').setView([51.505, -0.09], 13);
  // L -> Leaflet'ten geliyor, icerisine map olustur ve 'map' -> map id'li yapi istedigini belirtiyor.
  // setView -> koordinatlari setliyor. 13 ise zoom oranini belirtiyor

  // haritanin kurulumu
  map = new L.map('map').setView([e.coords.latitude, e.coords.longitude], 10);
  L.control;
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Haritada ekrana basilinca imlecleri tutacagimiz katman
  layerGroup = L.layerGroup().addTo(map);

  // localden gelen notes'lari listeleme
  renderNoteList(notes);

  // haritada bir tiklanma oldugunda calisacak fonksiyon.
  map.on('click', onMapClick);
}

// ekrana marker basma
function renderMarker(item){
    // markeri olusturur
    L.marker(item.coords, {icon:detecIcon(item.status)})
    // imleclerin oldugu katmana ekler
    .addTo(layerGroup)
    // uzerine tiklaninca acilacak popup ekleme
    .bindPopup(`${item.desc}`);
}

// form gonderildiginde calisir
function handleSubmit(e) {
  e.preventDefault();
  const desc = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;

  // notes dizisine eleman ekleme
  notes.push({ id: new Date().getTime(), desc, date, status, coords });
  console.log(notes);
  // local storage guncelleme
  setStorage(notes);
  // notlari ekrana aktarabilmek icin fonksiyona notes dizisini parametre olarak gonderdik
  renderNoteList(notes);

  // form gonderildiginde kapanir.
  form.style.display = 'none';
}

function renderNoteList(item) {
    list.innerHTML = "";
  
    // markerları temizler
    layerGroup.clearLayers();
    item.forEach((item) => {
      const listElement = document.createElement("li");
      // datasına sahip olduğu idyi ekleme
      listElement.dataset.id = item.id;
      listElement.innerHTML = `
      
      <div>
          <p>${item.desc}</p>
          <p><span>Tarih:</span>${item.date}</p>
          <p><span>Durum:</span>${detecType(item.status)}</p>
      </div>
      <i class="bi bi-x" id="delete"></i>
      <i class="bi bi-airplane-fill" id="fly"></i>
      `;
      list.insertAdjacentElement("afterbegin", listElement);
        /*  
         Nasil appendChild bir seyin sonuna ekleme yapiyorsa
         insertAdjacentElement de basina oncesine ekleme yapiyor. ilk parametre listenin basina ama baslarda nerede
         onu soyluyoruz, ikinci parametrede ise nereye ekleme yapacagini soyluyoruz. 
         */


      // Ekrana marker basma
      renderMarker(item);
    });
}

function handleClick(e){
  // guncellenecek
  const id = e.target.parentElement.dataset.id;
  console.log(notes)
  if(e.target.id === "delete"){
    console.log("first")
    // idsini bildigimiz elemani diziden kaldirma
    notes = notes.filter((note) => note.id != id);
    console.log(notes);

    // localStorage guncelleme
    setStorage(notes);
    // ekrani guncelleme
    renderNoteList(notes)
  }

  if (e.target.id === "fly") {
    const note = notes.find((note) => note.id == id);
    map.flyTo(note.coords);
  }
}

