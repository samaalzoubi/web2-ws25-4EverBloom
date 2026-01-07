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

    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!username || !email || !password) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }

    try {
      API_MODE === "REST"
        ? await registerREST(username, email, password)
        : await registerGraphQL(username, email, password);

      showMessage(
        "Registration successful! Redirecting to login…",
        "success"
      );

      setTimeout(() => {
        window.location.href =
          "/ClickPrototype/common-view/login/login.html";
      }, 1500);
    } catch (err) {
      const msg = err.message?.toLowerCase() || "";

      if (msg.includes("already") || msg.includes("exists")) {
        showMessage(
          "An account with this email already exists. Please use another email.",
          "error"
        );
      } else {
        showMessage(
          "Registration failed. Please try again later.",
          "error"
        );
      }

      console.error(err);
    }
  });
});
