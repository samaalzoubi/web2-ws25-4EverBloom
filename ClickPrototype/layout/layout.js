import { initCart } from "./cart.js";

export async function loadLayout() {
  await Promise.all([
    loadHeader(),
    loadFooter(),
    initCart()
  ]);
}

async function loadHeader() {
  const response = await fetch("/ClickPrototype/common-view/header/header.html");
  const html = await response.text();

  const mount = document.getElementById("header");
  if (!mount) return;

  mount.innerHTML = html;
  initHeader();
  document.dispatchEvent(new Event("header:ready"));
}

async function loadFooter() {
  const response = await fetch("/ClickPrototype/common-view/footer/footer.html");
  const html = await response.text();

  const mount = document.getElementById("footer");
  if (!mount) return;

  mount.innerHTML = html;
}

function initHeader() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const page = document.body.dataset.page;
  const role = localStorage.getItem("role");

  const loginLink = document.querySelector("#login-link");
  const userLinks = document.querySelectorAll(".user-links");
  const customerOnlyEls = document.querySelectorAll(".customer-only");
  const designBouquetButton = document.querySelector(".design-bouquet");
  const cartIcon = document.querySelector(".cart-link");

  if (isLoggedIn) {
    loginLink?.classList.add("hidden");
    userLinks.forEach(el => el.classList.remove("hidden"));
  } else {
    loginLink?.classList.remove("hidden");
    userLinks.forEach(el => el.classList.add("hidden"));
  }

  if (isLoggedIn && role === "CUSTOMER") {
    customerOnlyEls.forEach(el => el.classList.remove("hidden"));
    designBouquetButton?.classList.remove("hidden");
  } else {
    customerOnlyEls.forEach(el => el.classList.add("hidden"));
    designBouquetButton?.classList.add("hidden");
  }

  if ((page === "checkout" && cartIcon) || (page === "owner" && cartIcon)) {
    cartIcon.style.display = "none";
  }

  document.getElementById("logo-link")?.addEventListener("click", (e) => {
    e.preventDefault();

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");

    if (isLoggedIn && role === "OWNER") {
      window.location.href = "/ClickPrototype/shop-owner-view/home-page/shop-owner-homepage.html";
      return;
    }

    window.location.href = "/ClickPrototype/customer-view/home-page/home-page.html";
  });

  document.querySelector(".logout-link")?.addEventListener("click", e => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/ClickPrototype/common-view/login/login.html";
  });
}
