import { loadLayout } from "../../layout/layout.js";
import { fetchShopsREST } from "../home-page/home-rest.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Demo-Login
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userId", 2);

  await loadLayout();

  const map = initMap();
  const owners = await fetchShopsREST();
  addOwnersToMap(map, owners);
});

function initMap() {
  const map = L.map("map").setView([51.5, 7.4], 11);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  return map;
}

function addOwnersToMap(map, owners) {
  console.log(owners)
  const bounds = [];

  owners.forEach((owner) => {
    const lat = owner.latitude;
    const lon = owner.longitude;

    if (lat == null || lon == null) {
      return;
    }

    const marker = L.marker([lat, lon]).addTo(map);

    const name = owner.shopName || "Flower shop";
    const addressText = owner.address
      ? `${owner.address.streetAddress ?? ""}, ${owner.address.zipCode ?? ""} ${owner.address.city ?? ""}, ${owner.address.state ?? ""}`
      : "";

    marker.bindPopup(`
      <div class="popup-content">
        ${owner.logo ? `<img class="popup-logo" src="${owner.logo}" />` : ""}
        <div class="popup-name">${name}</div>
        <div class="popup-address">${addressText}</div>
        <button class="popup-btn"
          onclick="window.location.href='/ClickPrototype/customer-view/shop-profile/shop-profile.html?shopId=${owner.id}'">
          View shop
        </button>
      </div>
    `);


    bounds.push([lat, lon]);
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
}
