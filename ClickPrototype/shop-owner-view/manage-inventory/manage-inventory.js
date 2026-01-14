import {
  fetchShopStems,
  createShopStem,
  deleteShopStem
} from "./manage-inventory-graphql.js";

function requireOwner() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");

  if (!isLoggedIn || role !== "OWNER") {
    alert("Unauthorized access. Please log in as shop owner.");
    window.location.href = "/ClickPrototype/common-view/login/login.html";
    throw new Error("Unauthorized");
  }
}

requireOwner();


const shopId = Number(localStorage.getItem("userId"));

if (!shopId) {
  alert("Shop context missing. Please log in again.");
  throw new Error("Missing shopId");
}

/* ---------- DOM ---------- */
const body = document.getElementById("inventory-body");
const form = document.getElementById("create-form");
const toggleBtn = document.getElementById("toggle-create");

/* ---------- HELPERS ---------- */
function formatEUR(v) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(v);
}

/* ---------- LOAD ---------- */
async function loadInventory() {
  body.innerHTML = "";
  try {
    const items = await fetchShopStems(shopId);

    if (!items || !items.length) {
      body.innerHTML = `<tr><td colspan="1">No inventory items found.</td></tr>`;
      return;
    }

    items.forEach(i => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i.flowerName}</td>
        <td>${i.flowerColor}</td>
        <td>${i.flowerSeason}</td>
        <td>${i.quantity}</td>
        <td>${formatEUR(i.price)}</td>
        <td><button class="delete-btn">Delete</button></td>
      `;

      row.querySelector(".delete-btn").onclick = async () => {
        if (!confirm("Delete this item?")) return;
        await deleteShopStem(shopId, Number(i.stemId));
        loadInventory();
      };

      body.appendChild(row);
    });
  } catch (e) {
    body.innerHTML =
      `<tr><td colspan="6" style="color:red;">Failed to load inventory.</td></tr>`;
    console.error(e);
  }
}

/* ---------- TOGGLE ---------- */
toggleBtn.onclick = () => {
  form.style.display = form.style.display === "none" ? "flex" : "none";
};

/* ---------- CREATE ---------- */
form.onsubmit = async e => {
  e.preventDefault();

  const data = {
    flowerName: form.flowerName.value,
    flowerColor: form.flowerColor.value,
    flowerSeason: form.flowerSeason.value,
    imageUrl: form.imageUrl.value,
    price: Number(form.price.value),
    quantity: Number(form.quantity.value)
  };

  await createShopStem(shopId, data);
  form.reset();
  form.style.display = "none";
  loadInventory();
};

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", loadInventory);
