import { API_MODE } from "/ClickPrototype/config/api.config.js";
import {
  updatePasswordREST,
  deleteAccountREST
} from "./profile-rest.js";
import {
  updatePasswordGraphQL,
  deleteAccountGraphQL
} from "./profile-graphql.js";

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");

  const pwMsg = document.getElementById("password-message");
  const delMsg = document.getElementById("delete-message");

  const show = (el, text, type) => {
    el.textContent = text;
    el.className = `form-message show ${type}`;
  };

  /* ======================
     CHANGE PASSWORD
  ====================== */
  document
    .getElementById("change-password-btn")
    .addEventListener("click", async () => {
      const newPw = document.getElementById("new-password").value.trim();
      const confirm = document.getElementById("confirm-password").value.trim();

      if (!newPw || newPw !== confirm) {
        show(pwMsg, "Passwords do not match.", "error");
        return;
      }

      try {
        API_MODE === "REST"
          ? await updatePasswordREST(userId, newPw)
          : await updatePasswordGraphQL(userId, newPw);

        show(pwMsg, "Password updated successfully.", "success");
      } catch (err) {
        show(pwMsg, err.message || "Password update failed.", "error");
      }
    });

  /* ======================
     DELETE ACCOUNT
  ====================== */
  document
    .getElementById("delete-account-btn")
    .addEventListener("click", async () => {
      if (
        !confirm(
          "Are you sure you want to delete your account? This cannot be undone."
        )
      ) {
        return;
      }

      try {
        API_MODE === "REST"
          ? await deleteAccountREST(userId)
          : await deleteAccountGraphQL(userId);

        localStorage.clear();
        window.location.href =
          "/ClickPrototype/common-view/login/login.html";
      } catch (err) {
        show(delMsg, err.message || "Account deletion failed.", "error");
      }
    });
});
