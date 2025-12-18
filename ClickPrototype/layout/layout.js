export async function loadLayout() {
  await Promise.all([
    loadHeader(),
    loadFooter()
  ]);
}

async function loadHeader() {
  const response = await fetch("../../Header/header.html");
  const html = await response.text();

  const mount = document.getElementById("header");
  if (!mount) return;

  mount.innerHTML = html;
  initHeader();
  document.dispatchEvent(new Event("header:ready"));
}

async function loadFooter() {
  const response = await fetch("../../footer/footer.html");
  const html = await response.text();

  const mount = document.getElementById("footer");
  if (!mount) return;

  mount.innerHTML = html;
}

function initHeader() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const page = document.body.dataset.page;

  const loginLink = document.querySelector("#login-link");
  const userLinks = document.querySelectorAll(".user-links");
  const designBouquetButton = document.querySelector(".design-bouquet");
  const cartIcon = document.querySelector(".cart-link");

  if (isLoggedIn) {
    loginLink?.classList.add("hidden");
    userLinks.forEach(el => el.classList.remove("hidden"));
    designBouquetButton?.classList.remove("hidden");
  } else {
    loginLink?.classList.remove("hidden");
    userLinks.forEach(el => el.classList.add("hidden"));
    designBouquetButton?.classList.add("hidden");
  }

  if (page === "checkout" && cartIcon) {
    cartIcon.style.display = "none";
  }

  document.querySelector(".logout-link")?.addEventListener("click", e => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/ClickPrototype/Login/Login.html";
  });
}
