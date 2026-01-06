import { fetchBouquetsGraphQL } from "./manage-bouquets-graphql.js";
import { createBouquet, deleteBouquet } from "./manage-bouquets-rest.js";

/**
 * DEMO shop owner
 * In real login flow, this comes from logged-in OWNER
 */
const shopId = 1;

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d";

/* ---------- DOM ELEMENTS ---------- */
const grid = document.querySelector(".bouquet-grid");
const form = document.getElementById("create-bouquet-form");
const toggleBtn = document.getElementById("toggle-create");

const nameInput = document.getElementById("bouquetName");
const imageInput = document.getElementById("imageUrl");
const priceInput = document.getElementById("price");
const descInput = document.getElementById("description");

/* ---------- HELPERS ---------- */
function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

/* ---------- TOGGLE CREATE FORM ---------- */
toggleBtn.addEventListener("click", e => {
  e.preventDefault();
  form.style.display = form.style.display === "none" ? "flex" : "none";
});

/* ---------- LOAD BOUQUETS ---------- */
async function loadBouquets() {
  try {
    const bouquets = await fetchBouquetsGraphQL(shopId);
    renderBouquetGrid(bouquets);
  } catch (err) {
    console.error(err);
    grid.innerHTML =
      "<p style='color:red;'>Failed to load bouquets.</p>";
  }
}

/* ---------- CREATE BOUQUET ---------- */
form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    name: nameInput.value.trim(),
    description: descInput.value.trim(),
    imageUrl: imageInput.value.trim(),
    fixedPrice: Number(priceInput.value)
  };

  try {
    await createBouquet(shopId, data);
    form.reset();
    form.style.display = "none";
    await loadBouquets(); // refresh grid
  } catch (err) {
    alert("Failed to create bouquet");
    console.error(err);
  }
});

/* ---------- RENDER GRID ---------- */
function renderBouquetGrid(bouquets) {
  grid.innerHTML = "";

  if (!bouquets || bouquets.length === 0) {
    grid.innerHTML = "<p>No bouquets found.</p>";
    return;
  }

  bouquets.forEach(b => {
    const card = document.createElement("div");
    card.className = "bouquet-card";

    card.innerHTML = `
      <div class="image-box">
        <img src="${b.imageUrl || DEFAULT_IMG}" />
      </div>

      <div class="card-details">
        <div class="top-row">
          <h3>${b.name}</h3>
          <p class="price">${formatPriceEUR(b.price)}</p>
        </div>

        <p class="description">
          ${b.description ?? "Premade bouquet offered by this shop."}
        </p>

        <span class="stock stock-green">Available</span>

        <div class="actions">
          <a href="#" class="delete-btn">
            <span class="material-symbols-outlined">delete</span>
          </a>
        </div>
      </div>
    `;

    /* ---------- DELETE HANDLER ---------- */
    card.querySelector(".delete-btn").addEventListener("click", async e => {
      e.preventDefault();

      if (!confirm("Delete this bouquet?")) return;

      try {
       
        await deleteBouquet(Number(b.id));
        await loadBouquets();
      } catch (err) {
        alert("Failed to delete bouquet");
        console.error(err);
      }
    });

    grid.appendChild(card);
  });
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", loadBouquets);
