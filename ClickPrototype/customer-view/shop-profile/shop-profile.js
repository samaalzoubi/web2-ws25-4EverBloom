import { loadLayout } from "/ClickPrototype/layout/layout.js";
import { fetchShopByIdREST, fetchShopBouquets } from "./shop-profile-rest.js"
import { addToCart } from "../../layout/cart.js"

const DEFAULT_BOUQUET_IMAGE = "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";
const DEFAULT_SHOP_LOGO = "https://images.scalebranding.com/flower-shop-logo-2a1cfde0-daf2-417f-a0a6-de1d596a23d7.jpg";

function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

document.addEventListener("DOMContentLoaded", async () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", 2);
    
    await loadLayout();

    const params = new URLSearchParams(window.location.search);
    const shopId = params.get("shopId");

    if (!shopId) {
      console.error("No shopId in URL");
      return;
    }
    
    try {
        const shop = await fetchShopByIdREST(shopId);
        renderShopInfo(shop);
        
        const bouquets = await fetchShopBouquets(shopId);
        renderBouquetGrid(bouquets);

  } catch (err) {
    console.error("Failed to load shop profile", err);
    showError("Could not load shop profile. Please try again.");
  }
});

//Rendering
function renderShopInfo(shop) {
  const shopInfo = document.querySelector(".shop-info");
  if (!shopInfo) return;

  shopInfo.innerHTML = "";

  const titleDiv = document.createElement("div");
  titleDiv.classList.add("shop-title");

  const nameLogoWrapper = document.createElement("div");
  nameLogoWrapper.classList.add("shop-name-with-logo");

  const nameEl = document.createElement("h2");
  nameEl.textContent = shop.shopName || "FlowerShop";

  const logoEl = document.createElement("img");
  logoEl.classList.add("shop-logo");
  logoEl.src = shop.logo || DEFAULT_SHOP_LOGO;
  logoEl.alt = nameEl.textContent;

  nameLogoWrapper.appendChild(nameEl);
  nameLogoWrapper.appendChild(logoEl);

  const tagline = document.createElement("p");
  tagline.classList.add("tagLine");
  tagline.textContent = shop.description || "Elegance in Every Stem";

  titleDiv.appendChild(nameLogoWrapper);
  titleDiv.appendChild(tagline);

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("shop-details");

  const addressP = document.createElement("p");
  const addr = shop.address;
  addressP.textContent = addr ? `📍 ${addr.streetAddress ?? ""}, ${addr.zipCode ?? ""} ${addr.city ?? ""}` : "📍 Address not provided";

  const linkP = document.createElement("p");
  const linkA = document.createElement("a");
  const link = shop.link || "#";
  linkA.href = link;
  linkA.textContent = link || "Website not available";
  linkP.textContent = "🌐 ";
  linkP.appendChild(linkA);

  const phoneP = document.createElement("p");
  phoneP.textContent = `📞 ${shop.phoneNumber || "No phone number"}`;

  detailsDiv.appendChild(addressP);
  detailsDiv.appendChild(linkP);
  detailsDiv.appendChild(phoneP);

  shopInfo.appendChild(titleDiv);
  shopInfo.appendChild(detailsDiv);
}

function renderBouquetGrid(bouquets) {
  const grid = document.querySelector(".bouquet-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!bouquets || bouquets.length === 0) {
    grid.innerHTML = `<p>This flower shop has no premade bouquets in stock.</p>`;
    return;
  }

  bouquets.forEach((bouquet) => {
    const card = document.createElement("div");
    card.classList.add("bouquet-card");

    const imgSrc = bouquet.imageUrl || DEFAULT_BOUQUET_IMAGE;

    card.innerHTML = `
      <img src="${imgSrc}" alt="${bouquet.name || "Bouquet"}" />
      <h3>${bouquet.name || "Bouquet"}</h3>
      <p class="price">${formatPriceEUR(bouquet.price)}</p>
      <button class="add-to-cart-btn" type="button">Add to Cart</button>
    `;

    card.querySelector(".add-to-cart-btn").addEventListener("click", async () => addToCart(bouquet.id));

    grid.appendChild(card);
  });
}
