import { API_MODE } from "/ClickPrototype/config/api.config.js";
import { registerREST } from "../login/login-rest.js";
import { registerGraphQL } from "../login/login-graphql.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");
  const messageBox = document.getElementById("form-message");

  if (!form || !messageBox) return;

  const showMessage = (text, type) => {
    messageBox.textContent = text;
    messageBox.className = `form-message show ${type}`;
  };

  const clearMessage = () => {
    messageBox.textContent = "";
    messageBox.className = "form-message";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    // Basisdaten
    const username = document
      .getElementById("register-username")
      .value.trim();
    const email = document
      .getElementById("register-email")
      .value.trim();
    const password = document
      .getElementById("register-password")
      .value.trim();

    // Owner-Pflichtfelder
    const requiredFields = [
      "business-name",
      "business-address",
      "business-type",
      "business-delivery"
    ];

    if (!username || !email || !password) {
      showMessage("Please fill in all required user fields.", "error");
      return;
    }

    for (const id of requiredFields) {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        showMessage(
          "Please fill in all required business fields.",
          "error"
        );
        el?.focus();
        return;
      }
    }

    try {
      API_MODE === "REST"
        ? await registerREST(username, email, password, "OWNER")
        : await registerGraphQL(username, email, password, "OWNER");

      showMessage(
        "Owner registration successful! Redirecting to login…",
        "success"
      );

      setTimeout(() => {
        window.location.href =
          "/ClickPrototype/common-view/login/login.html";
      }, 1500);
    } catch (err) {
  console.error(err);

  // Backend-Fehlermeldung (falls vorhanden)
  const rawMessage = err.message || "";
  const msg = rawMessage.toLowerCase();

  if (msg.includes("already") || msg.includes("exists")) {
    showMessage(
      "An account with this email already exists. Please use another email.",
      "error"
    );
  } 
  else if (msg.includes("email")) {
    showMessage(
      "The provided email address is not valid.",
      "error"
    );
  }
  else if (msg.includes("password")) {
    showMessage(
      "The password does not meet the required criteria.",
      "error"
    );
  }
  else if (rawMessage) {
    // 👇 HIER: Grund anzeigen (kontrolliert)
    showMessage(
      `Registration failed: ${rawMessage}`,
      "error"
    );
  }
  else {
    showMessage(
      "Registration failed due to an unexpected error. Please try again later.",
      "error"
    );
  }
}
  });
});
