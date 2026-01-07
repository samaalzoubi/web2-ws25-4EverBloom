import { API_MODE } from "/ClickPrototype/config/api.config.js";
import { fetchFlowersREST, fetchShopsREST } from "./home-rest.js";
import { fetchFlowersGraphQL, fetchShopsGraphQL } from "./home-graphql.js";
import { loadLayout } from "/ClickPrototype/layout/layout.js";
import { addToCart } from "../../layout/cart.js"

const DEFAULT_SHOP_LOGO = "https://images.scalebranding.com/flower-shop-logo-2a1cfde0-daf2-417f-a0a6-de1d596a23d7.jpg";

async function loadHome() {
  try {
    const bouquets =
      API_MODE === "REST"
        ? await fetchFlowersREST()
        : await fetchFlowersGraphQL();

    renderFlowers(bouquets);

    const shops =
      API_MODE === "REST"
        ? await fetchShopsREST()
        : await fetchShopsGraphQL();

    renderShopsCarousel(shops);
  } catch (err) {
    console.error("Failed to load home", err);
    showError("Could not load home data. Please try again.");
  }
}

function renderFlowers(shopsData) {
  let listProductHTML = document.querySelector('.flower-suggestions');
  listProductHTML.innerHTML = '';

  //shopsData: [{ shopId, shopLogo?, bouquets: [...] }, ...]
  const bouquets = shopsData.flatMap(shop =>
    (shop.bouquets || []).map(b => ({
      ...b,
      shopLogo: shop.shopLogo,
      shopId: shop.shopId
    }))
  );

  bouquets.forEach(product => {
    let newProduct = document.createElement('li');
    newProduct.classList.add("bouquet-card");

    const logoSrc = product.shopLogo || DEFAULT_SHOP_LOGO;

    newProduct.innerHTML = `
      <div class="bouquet-card__link">
        <figure class="bouquet-card__media">
          <img src="${product.imageUrl}" alt="${product.name}">
          <span class="bouquet-card__label">Exclusive</span>
        </figure>
        <figcaption class="bouquet-card__caption">
          <span class="bouquet-card__name">${product.name}</span>
          <span class="bouquet-card__price"> ${formatPriceEUR(product.price)}</span>
          <div class="bouquet-card__bottom-row">
            <button class="add-to-cart-btn" type="button">Add to Cart</button>
            <div class="bouquet-card__shop">
              <img
                class="bouquet-card__shop-logo"
                src="${logoSrc}"
                alt="Shop logo"
              />
            </div>
          </div>
        </figcaption>
      </div>`

    const logoEl = newProduct.querySelector(".bouquet-card__shop-logo");
    logoEl.addEventListener("click", (e) => {
      e.stopPropagation();
      if (product.shopId) {
        window.location.href =
          `/ClickPrototype/customer-view/shop-profile/shop-profile.html?shopId=${product.shopId}`;
      }
    });

    newProduct.querySelector(".add-to-cart-btn").addEventListener("click", async () => addToCart(product.id));

    listProductHTML.appendChild(newProduct)
  })
}

function renderShopsCarousel(shops) {
  const carousel = document.getElementById("shop-carousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  shops.forEach((shop) => {
    const img = document.createElement("img");

    img.src = shop.logo || DEFAULT_SHOP_LOGO; 

    img.alt = shop.shopName || "Flower Shop";
    img.style.cursor = "pointer";

    img.addEventListener("click", () => {
      window.location.href =
        `/ClickPrototype/customer-view/shop-profile/shop-profile.html?shopId=${shop.id}`;
    });

    carousel.appendChild(img);
  });

  initShopCarousel();
}

function initShopCarousel() {
  const slide  = document.getElementById("shop-carousel");
  const buttons = document.querySelectorAll(".carousel-button");
  if (!slide || buttons.length < 2) return;

  const firstImage = slide.querySelector("img");
  if (!firstImage) return;

  const showHideButtons = () => {
    const scrollWidth = slide.scrollWidth - slide.clientWidth;

    if (scrollWidth <= 0) {
      buttons[0].style.display = "none";
      buttons[1].style.display = "block";
      return;
    }

    buttons[0].style.display = slide.scrollLeft === 0 ? "none" : "block";
    buttons[1].style.display =
      slide.scrollLeft >= scrollWidth ? "none" : "block";
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const firstImageWidth = firstImage.clientWidth + 35;
      slide.scrollLeft +=
        button.getAttribute("data-carousel-button") === "next"
          ? firstImageWidth
          : -firstImageWidth;
      setTimeout(showHideButtons, 60);
    });
  });

  setTimeout(showHideButtons, 150);
}

function showError(msg) {
  const list = document.querySelector(".flower-suggestions");
  if (list) {
    list.innerHTML = `<li>${msg}</li>`;
  }
}

function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();
  loadHome();

  const btn = document.getElementById("open-map");
  btn?.addEventListener("click", () => {
    window.location.href = "/ClickPrototype/customer-view/map/map.html";
  });
});