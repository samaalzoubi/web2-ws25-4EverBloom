const DEFAULT_BOUQUET_IMAGE = "https://peoplesflowers.imgix.net/images/itemVariation/designers-choice-7983070-2-200515317401-21021884408.jpg?w=600&h=720&fit=crop&dpr=2";

document.addEventListener("DOMContentLoaded", () => {
  const cachedCartState = sessionStorage.getItem("cartState");
  const cartState = JSON.parse(cachedCartState);
  const placeOrderButton = document.querySelector(".buttonOrder")

  renderCheckoutCart(cartState);
  renderTotals(cartState);

  placeOrderButton.addEventListener("click", () => {
    //TODO: real logic (creating Order instance and Payment instance)
    alert("Thank you for your order!")

    window.location.href = "/ClickPrototype/Order/customer_orders.html";
});
});

function renderCheckoutCart(cartState) {
  const listEl = document.querySelector(".returnCart .list");
  listEl.innerHTML = "";

  const items = cartState?.items;

  items.forEach(item => {
    const imageUrl = item.imageUrl || DEFAULT_BOUQUET_IMAGE;

    const el = document.createElement("div");
    el.className = "item";
    el.innerHTML = `
      <img src="${imageUrl}" alt="${item.bouquetName}">
      <div class="info">
        <div class="name">${item.bouquetName}</div>
        <div class="price">${formatPriceEUR(item.unitPrice)} / bouquet</div>
      </div>
      <div class="quantity">${item.quantity}</div>
    `;

    listEl.appendChild(el);
  });
}

function renderTotals(cartState) {
  const quantityEl = document.querySelector(".totalQuantity");
  const priceEl = document.querySelector(".totalPrice");

  quantityEl.textContent = cartState.totalQuantity ?? 0;
  priceEl.textContent = formatPriceEUR(cartState.totalPrice ?? 0);
}

function formatPriceEUR(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}
