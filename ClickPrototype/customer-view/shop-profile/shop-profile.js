import { loadLayout } from "/ClickPrototype/layout/layout.js";
import { API_MODE } from "/ClickPrototype/config/api.config.js";
import {
  fetchShopByIdGraphQL,
  fetchShopBouquetsGraphQL
} from "./shop-profile-graphql.js";
import {
  fetchShopByIdREST,
  fetchShopBouquets
} from "./shop-profile-rest.js";
import { addToCart } from "../../layout/cart.js";

/* ===============================
   CONSTANTS
=============================== */
const DEFAULT_BOUQUET_IMAGE =
  "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";

const DEFAULT_SHOP_LOGO =
  "https://images.scalebranding.com/flower-shop-logo-2a1cfde0-daf2-417f-a0a6-de1d596a23d7.jpg";

/* ===============================
   HELPERS
=============================== */
function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function showError(message) {
  const grid = document.querySelector(".bouquet-grid");
  if (grid) {
    grid.innerHTML = `<p style="color:red;">${message}</p>`;
  }
}

/* ===============================
   MAIN
=============================== */
document.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();

  /* ===============================
     AUTH / OWNERSHIP CHECK (LAB 6)
  =============================== */
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");
  const loggedInUserId = Number(localStorage.getItem("userId"));

  const params = new URLSearchParams(window.location.search);
  const shopId = Number(params.get("shopId"));

  const ownerBtn = document.getElementById("ownerDashboardBtn");

  if (
    ownerBtn &&
    isLoggedIn &&
    role === "OWNER" &&
    loggedInUserId === shopId
  ) {
    ownerBtn.classList.remove("hidden");
    ownerBtn.onclick = () => {
      window.location.href =
        "/ClickPrototype/shop-owner-view/home-page/shop-owner-homepage.html";
    };
  }

  /* ===============================
     SHOP ID CHECK
  =============================== */
  if (!shopId) {
    showError("No shop selected.");
    return;
  }

  try {
    /* ===============================
       LOAD SHOP DATA
    =============================== */
    const shop =
      API_MODE === "REST"
        ? await fetchShopByIdREST(shopId)
        : await fetchShopByIdGraphQL(shopId);

    if (!shop) {
      showError("Shop not found.");
      return;
    }

    renderShopInfo(shop);

    /* ===============================
       LOAD BOUQUETS
    =============================== */
    const bouquets =
      API_MODE === "REST"
        ? await fetchShopBouquets(shopId)
        : await fetchShopBouquetsGraphQL(shopId);

    renderBouquetGrid(bouquets);

  } catch (err) {
    console.error(err);
    showError("Could not load shop profile. Please try again.");
  }
});

/* ===============================
   RENDER SHOP INFO
=============================== */
function renderShopInfo(shop) {
  const shopInfo = document.querySelector(".shop-info");
  if (!shopInfo) return;

  shopInfo.innerHTML = "";

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("shop-title");

  const nameLogoWrapper = document.createElement("div");
  nameLogoWrapper.classList.add("shop-name-with-logo");

  const nameEl = document.createElement("h2");
  nameEl.textContent = shop.shopName || "Flower Shop";

  const logoEl = document.createElement("img");
  logoEl.classList.add("shop-logo");
  logoEl.src = shop.logo || DEFAULT_SHOP_LOGO;

  nameLogoWrapper.appendChild(nameEl);
  nameLogoWrapper.appendChild(logoEl);

  const tagline = document.createElement("p");
  tagline.classList.add("tagline");
  tagline.textContent = shop.description || "Elegance in Every Stem";

  titleDiv.appendChild(nameLogoWrapper);
  titleDiv.appendChild(tagline);

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("shop-details");

  const addr = shop.address || {};
  detailsDiv.innerHTML = `
    <p>📍 ${addr.streetAddress ?? ""}, ${addr.zipCode ?? ""} ${addr.city ?? ""}</p>
    <p>🌐 <a href="${shop.link ?? "#"}" target="_blank">
      ${shop.link ?? "Website not available"}
    </a></p>
    <p>📞 ${shop.phoneNumber ?? "No phone number"}</p>
  `;

  shopInfo.appendChild(titleDiv);
  shopInfo.appendChild(detailsDiv);
}

/* ===============================
   RENDER BOUQUETS
=============================== */
function renderBouquetGrid(bouquets) {
  const grid = document.querySelector(".bouquet-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!bouquets || bouquets.length === 0) {
    grid.innerHTML = `<p>This shop has no premade bouquets yet.</p>`;
    return;
  }

  bouquets.forEach(bouquet => {
    const card = document.createElement("div");
    card.classList.add("bouquet-card");

    card.innerHTML = `
      <img src="${bouquet.imageUrl || DEFAULT_BOUQUET_IMAGE}">
      <h3>${bouquet.name}</h3>
      <p class="price">${formatPriceEUR(bouquet.price)}</p>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;

    card
      .querySelector(".add-to-cart-btn")
      .addEventListener("click", () => addToCart(bouquet.id));

    grid.appendChild(card);
  });
}
