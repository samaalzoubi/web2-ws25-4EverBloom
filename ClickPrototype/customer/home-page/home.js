import { API_MODE } from "./api.config.js";
import { fetchFlowersREST, addToCartREST, getActiveCartREST, patchCartItemQuantity } from "./home-rest.js";
//import { fetchFlowersGraphQL } from "./home-graphql.js";

let cartState = null;
const DEFAULT_BOUQUET_IMAGE = "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";

async function loadHome() {
  try {
    const data =
      API_MODE === "REST"
        ? await fetchFlowersREST()
        : await fetchFlowersGraphQL();

      
    renderFlowers(data);
  } catch (err) {
    console.error("Failed to load home", err);
    showError("Could not load bouquets. Please try again.");
  }
}

function renderFlowers(shopsData) {
  let listProductHTML = document.querySelector('.flower-suggestions');
  listProductHTML.innerHTML = '';

  //shopsData: [{ shopId, shopName?, bouquets: [...] }, ...]
  const bouquets = shopsData.flatMap(shop =>
    (shop.bouquets || []).map(b => ({
      ...b
      //shopName: shop.shopName
    }))
  );

  bouquets.forEach(product => {
    let newProduct = document.createElement('li');
    newProduct.classList.add("bouquet-card");

    //TODO: add shop name/logo, description and occasions into the template
    newProduct.innerHTML = `
      <div class="bouquet-card__link">
        <figure class="bouquet-card__media">
          <img src="${product.imageUrl}" alt="${product.name}">
          <span class="bouquet-card__label">Exclusive</span>
        </figure>
        <figcaption class="bouquet-card__caption">
          <span class="bouquet-card__name">${product.name}</span>
          <span class="bouquet-card__price"> ${formatPriceEUR(product.price)}</span>
          <button class="add-to-cart-btn" type="button">Add to Cart</button>
        </figcaption>
      </div>`

      newProduct.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(product.id));

    listProductHTML.appendChild(newProduct)
  })
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


document.addEventListener("DOMContentLoaded", async() => {
  //TODO: dummy; remove when login-authentication-logic is implemented
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userId", 2)

  const cartIcon = document.querySelector('#header .cart-link');
  const cartMenu = document.querySelector('.cart');
  const close = document.querySelector(".close")
  const checkoutButton = document.getElementById("checkoutBtn")

  loadHome();

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
    if (cartMenu.style.right == "-100%") {
      cartMenu.style.right = "0"
    }
    else {
      cartMenu.style.right = "-100%"
    }
  })

  close.addEventListener("click", () => {
    cartMenu.style.right = "-100%"
  })

  checkoutButton.addEventListener("click", () => {
  const cachedCartState = sessionStorage.getItem("cartState");

  if (!cachedCartState) {
    alert("Your cart is empty.");
    return;
  }

  const cartState = JSON.parse(cachedCartState);

  if (!cartState.items || cartState.items.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  window.location.href = "/ClickPrototype/customer/checkout/checkout.html";
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

//TODO: remove item from cart button
//TODO: clear cart button