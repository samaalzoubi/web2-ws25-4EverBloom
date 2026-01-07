import { API_MODE } from "/ClickPrototype/config/api.config.js";
import { loginREST } from "./login-rest.js";
import { loginGraphQL } from "./login-graphql.js";
import { loadLayout } from "/ClickPrototype/layout/layout.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();

  const loginForm = document.getElementById("login-form");
  const messageBox = document.getElementById("form-message");

  if (!loginForm || !messageBox) return;

  const showMessage = (text, type) => {
    messageBox.textContent = text;
    messageBox.className = `form-message show ${type}`;
  };

  const clearMessage = () => {
    messageBox.textContent = "";
    messageBox.className = "form-message";
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!email || !password) {
      showMessage("Please enter email and password.", "error");
      return;
    }

    try {
      const user =
        API_MODE === "REST"
          ? await loginREST(email, password)
          : await loginGraphQL(email, password);

      showMessage("Login successful. Redirecting…", "success");

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      setTimeout(() => {
        if (user.role === "CUSTOMER") {
          window.location.href = "/ClickPrototype/customer-view/home-page/home-page.html";
        } else {
          window.location.href = "/ClickPrototype/shop-owner-view/home-page/shop-owner-homepage.html";
        }
      }, 1000);

    } catch (err) {
      const msg = err.message?.toLowerCase() || "";

      if (
        msg.includes("invalid") ||
        msg.includes("unauthorized") ||
        msg.includes("401")
      ) {
        showMessage(
          "Invalid email or password. Please try again.",
          "error"
        );
      } else {
        showMessage(
          "Login failed. Please try again later.",
          "error"
        );
      }

      console.error(err);
    }
  });
});
