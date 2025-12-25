import { API_MODE } from "../../config/api.config.js";
import { fetchFlowersREST, addToCartREST, getActiveCartREST, patchCartItemQuantity, clearCartREST, fetchShopsREST } from "./home-rest.js";
import { loadLayout } from "../../layout/layout.js";
//import { fetchFlowersGraphQL } from "./home-graphql.js";

let cartState = null;
const DEFAULT_BOUQUET_IMAGE = "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";

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

    const logoSrc = product.shopLogo || "../../assets/default-flower-shop-logo.png";

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
          `../../customer-shop-view/shop-profile.html?shopId=${product.shopId}`;
      }
    });

    newProduct.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(product.id));

    listProductHTML.appendChild(newProduct)
  })
}

function renderShopsCarousel(shops) {
  const carousel = document.getElementById("shop-carousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  shops.forEach((shop) => {
    const img = document.createElement("img");

    if (shop.logo) {
      img.src = shop.logo;
    } else {
      //TODO
      //img.src = "../../assets/default-flower-shop-logo.png"; // Fallback
    }

    img.alt = shop.shopName || "Flower Shop";
    img.style.cursor = "pointer";

    //TODO
    img.addEventListener("click", () => {
      window.location.href =
        `../../customer-shop-view/shop-profile.html?shopId=${shop.id}`;
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
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userId", 2);

  await loadLayout();
  loadHome();

  const btn = document.getElementById("open-map");
  btn?.addEventListener("click", () => {
    window.location.href = "../map/map.html";
  });
});

document.addEventListener("header:ready", async () => {
  const cartIcon = document.querySelector("#header .cart-link");
  const cartMenu = document.querySelector(".cart");
  const close = document.querySelector(".close");
  const checkoutButton = document.getElementById("checkoutBtn");
  const clearBtn = document.getElementById("clearCartBtn");

  if (!cartIcon || !cartMenu || !close) return;

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    cartState = await getActiveCartREST(userId);
    addCartToHTML(cartState);
  } catch (e) {
    console.error("Could not load cart", e);
  }

  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    cartMenu.style.right = (cartMenu.style.right === "0px" || cartMenu.style.right === "0") ? "-100%" : "0";
  });

  close.addEventListener("click", () => {
    cartMenu.style.right = "-100%";
  });

  checkoutButton?.addEventListener("click", (e) => {
    e.preventDefault();

    const cached = sessionStorage.getItem("cartState");
    const state = cached ? JSON.parse(cached) : null;

    if (!state?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    window.location.href = "/ClickPrototype/customer/checkout/checkout.html";
  });

  clearBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await clearCartREST(userId);
      document.querySelector(".list-cart").innerHTML = "";

      cartState = await getActiveCartREST(userId);
      addCartToHTML(cartState);

    } catch (err) {
      console.error(err);
      alert("Cart could not be emptied.");
    }
  });
});


//Toggle map button to be redirected to the map-page
const btn = document.getElementById('open-map');
btn.addEventListener("click", () => {
  window.location.href = "../map/map.html";
})

//Toggle "Add to cart"-button
async function addToCart(bouquetId) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    alert("Log in first!");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Missing userId. Please log in again.");
    return;
  }

  try {
    cartState = await addToCartREST(userId, bouquetId);
    addCartToHTML(cartState);
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}


function addCartToHTML(cartState) {
  //TODO: delete from storage by logout
  sessionStorage.setItem("cartState", JSON.stringify(cartState));

  let listProductHTML = document.querySelector('.list-cart');
  listProductHTML.innerHTML = '';

  let totalHTML = document.querySelector('#header .cart-count')

  const items = cartState?.items ?? [];
  if (items.length === 0) {
    listProductHTML.innerHTML = `<div class="empty-cart">Cart is empty</div>`;
    return;
  }
            
  items.forEach(product => {
    if (product) {
      const imageUrl = product.imageUrl || DEFAULT_BOUQUET_IMAGE;

      let newCartItemHTML = document.createElement("div");
      newCartItemHTML.classList.add("item")
      newCartItemHTML.innerHTML = `
        <img src="${imageUrl}" alt="${product.bouquetName}">
        <div class="content">
          <div class="name">
            ${product.bouquetName}
          </div>
          <div class="price">
            ${formatPriceEUR(product.unitPrice)}
          </div>
        </div>
        <div class="quantity">
          <button onclick="changeQuantity(${product.itemId}, '-')">-</button>
          <span class="value">${product.quantity}</span>
            <button onclick="changeQuantity(${product.itemId}, '+')">+</button>
        </div>`
              
      listProductHTML.appendChild(newCartItemHTML)
    }
  })
  totalHTML.innerHTML = cartState.totalQuantity;
}

window.changeQuantity = async function changeQuantity($idProduct, $operationType) {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    alert("Log in first!");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Missing userId. Please log in again.");
    return;
  }

  const delta = $operationType === "+" ? 1 : -1;

  try {
    cartState = await patchCartItemQuantity(userId, $idProduct, delta);
    addCartToHTML(cartState);
  } catch (e) {
    console.error(e);
    alert(e.message);
  }
}