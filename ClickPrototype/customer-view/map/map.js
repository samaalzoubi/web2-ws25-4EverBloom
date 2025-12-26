import { loadLayout } from "../../layout/layout.js";

document.addEventListener("DOMContentLoaded", async () => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userId", 2);

  await loadLayout();

  //Karte initialisieren
  var map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
});