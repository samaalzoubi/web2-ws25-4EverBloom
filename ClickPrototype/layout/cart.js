import { API_MODE } from "/ClickPrototype/config/api.config.js";
import {addToCartREST, getActiveCartREST, patchCartItemQuantityREST, clearCartREST} from "/ClickPrototype/customer-view/home-page/home-rest.js";
import {addToCartGraphQL, getActiveCartGraphQL, patchCartItemQuantityGraphQL, clearCartGraphQL} from "/ClickPrototype/customer-view/home-page/home-graphql.js";

let cartState = null;
const DEFAULT_BOUQUET_IMAGE = "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";
const USE_REST = API_MODE === "REST";

export function initCart() {
  document.addEventListener("header:ready", setupCartAfterHeader);
}

async function setupCartAfterHeader() {
  const cartIcon = document.querySelector("#header .cart-link");
  const cartMenu = document.querySelector(".cart");
  const close = document.querySelector(".cart .close");
  const checkoutButton = document.getElementById("checkoutBtn");
  const clearBtn = document.getElementById("clearCartBtn");

  const getActive = USE_REST ? getActiveCartREST : getActiveCartGraphQL;

  if (!cartIcon || !cartMenu || !close) return;

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    cartState = await getActive(userId);
    addCartToHTML(cartState);
  } catch (e) {
    console.error("Could not load cart", e);
  }

  // Toggle Cart
  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const current = cartMenu.style.right;
    cartMenu.style.right = current === "0px" || current === "0" ? "-100%" : "0";
  });

  close.addEventListener("click", () => {
    cartMenu.style.right = "-100%";
  });

  // Checkout
  checkoutButton?.addEventListener("click", (e) => {
    e.preventDefault();

    const cached = sessionStorage.getItem("cartState");
    const state = cached ? JSON.parse(cached) : null;

    if (!state?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    window.location.href = "/ClickPrototype/customer-view/checkout/checkout.html";
  });

  //Clear cart
  clearBtn?.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const clearFunc = USE_REST ? clearCartREST : clearCartGraphQL;
      cartState = await clearFunc(userId);

      document.querySelector(".list-cart").innerHTML = "";

      addCartToHTML(cartState);
    } catch (err) {
      console.error(err);
      alert("Cart could not be emptied.");
    }
  });
}

function getUserIdOrWarn() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    alert("Log in first!");
    return null;
  }
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Missing userId. Please log in again.");
    return null;
  }
  return userId;
}

export async function addToCart(bouquetId) {
  const userId = getUserIdOrWarn();
  if (!userId) return;

  try {
    const addFunc = USE_REST ? addToCartREST : addToCartGraphQL;
    cartState = await addFunc(userId, bouquetId);
    addCartToHTML(cartState);
  } catch (e) {
    console.error(e);
    alert(e.message || "Could not add to cart.");
  }
}

function addCartToHTML(cartState) {
  sessionStorage.setItem("cartState", JSON.stringify(cartState));

  const listProductHTML = document.querySelector(".list-cart");
  if (!listProductHTML) return;

  listProductHTML.innerHTML = "";

  const totalHTML = document.querySelector("#header .cart-count");

  const items = cartState?.items ?? [];
  if (items.length === 0) {
    listProductHTML.innerHTML = `<div class="empty-cart">Cart is empty</div>`;
    if (totalHTML) totalHTML.textContent = "0";
    return;
  }

  items.forEach((product) => {
    if (!product) return;

    const imageUrl = product.imageUrl || DEFAULT_BOUQUET_IMAGE;

    const newCartItemHTML = document.createElement("div");
    newCartItemHTML.classList.add("item");
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
        <button class="qty-btn" data-id="${product.itemId}" data-op="-">-</button>
        <span class="value">${product.quantity}</span>
        <button class="qty-btn" data-id="${product.itemId}" data-op="+">+</button>
      </div>`;

    listProductHTML.appendChild(newCartItemHTML);
  });

  listProductHTML.addEventListener("click", onQuantityClick);

  if (totalHTML) {
    totalHTML.textContent = cartState.totalQuantity;
  }
}

async function onQuantityClick(e) {
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;

  const itemId = btn.dataset.id;
  const op = btn.dataset.op;
  await changeQuantity(itemId, op);
}

async function changeQuantity(itemId, operationType) {
  const userId = getUserIdOrWarn();
  if (!userId) return;

  const delta = operationType === "+" ? 1 : -1;

  try {
    const patchFunc = USE_REST ? patchCartItemQuantityREST : patchCartItemQuantityGraphQL;

    cartState = await patchFunc(userId, itemId, delta);
    addCartToHTML(cartState);
  } catch (e) {
    console.error(e);
    alert(e.message || "Could not update quantity.");
  }
}

function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}