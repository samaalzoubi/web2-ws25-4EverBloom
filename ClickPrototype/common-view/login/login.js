const DEFAULT_LOGO =
  "https://images.scalebranding.com/flower-shop-logo-2a1cfde0-daf2-417f-a0a6-de1d596a23d7.jpg";

export function renderUsers(containerId, users, onDelete) {
  const ul = document.getElementById(containerId);
  ul.innerHTML = "";

  users.forEach(user => {
    const li = document.createElement("li");
    li.style.marginBottom = "1rem";

    li.innerHTML = `
      <img src="${user.logo || DEFAULT_LOGO}" width="50"><br>
      <strong>${user.username}</strong><br>
      ${user.email}<br>
      Role: ${user.role}<br>
      Shop: ${user.shopName ?? "—"}<br>
      <button data-id="${user.id}">Delete</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      onDelete(user.id);
    });

    ul.appendChild(li);
  });
}

export function renderError(containerId, msg) {
  document.getElementById(containerId).innerHTML = `<li>${msg}</li>`;
}
