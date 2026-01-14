<template>
  <div class="user-profile-container">
    <form @submit.prevent="saveProfile">
      <RouterLink
        class="back-link"
        :to="{ path: '/', query: { shopId: shopId } }"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        Back to Home
      </RouterLink>

      <div class="profile-header">
        <img
          class="profile-avatar"
          :src="user.profileImage || defaultAvatar"
          alt="Profile Picture"
        />

        <div class="profile-info">
          <h2>{{ user.username }}</h2>
          <p>{{ user.email }}</p>
        </div>
      </div>

      <div>
        <h4>Change Address</h4>
        <label>Street</label>
        <input v-model="user.address.streetAddress" />

        <label>City</label>
        <input v-model="user.address.city" />

        <label>State</label>
        <input v-model="user.address.state" />

        <label>ZIP Code</label>
        <input v-model="user.address.zipCode" />
      </div>

      <div>
        <h4>Change Password</h4>
        <label>Current Password</label>
        <input type="password" v-model="currentPassword" />

        <label>New Password</label>
        <input type="password" v-model="newPassword" />

        <label>Confirm New Password</label>
        <input type="password" v-model="confirmPassword" />
      </div>

      <button type="button" @click="saveProfile">Save Profile</button>
      <div
        class="form-message"
        :class="[formMessage ? 'show' : '', formMessageType]"
      >
        {{ formMessage }}
      </div>

      <div class="card">
        <button type="button" class="danger-btn" @click="deleteAccount">
          Delete Account
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
  setup() {
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");

    const formMessage = ref("");
    const formMessageType = ref("");

    const storedUserRaw = localStorage.getItem("user");

    if (!storedUserRaw) {
      window.location.href = "/login";
      return {};
    }

    const parsedUser = JSON.parse(storedUserRaw);

    const user = ref({
      ...parsedUser,
      address: parsedUser.address || {
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
      },
    });

    const userId = parsedUser.id;

    const defaultAvatar =
      "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(user.value.username || "User");

    const showMessage = (msg, type = "success") => {
      formMessage.value = msg;
      formMessageType.value = type;
      setTimeout(() => {
        formMessage.value = "";
      }, 4000);
    };

    const saveProfile = async () => {
      console.log("SAVE CLICKED");
      // Passwort-Check
      if (newPassword.value !== confirmPassword.value) {
        showMessage("Passwords do not match", "error");
        return;
      }

      try {
        // Wir schicken genau das User-Objekt, das im Formular steht
        const updatedUser = {
          ...user.value,
          address: {
            streetAddress: user.value.address.streetAddress || "",
            city: user.value.address.city || "",
            state: user.value.address.state || "",
            zipCode: user.value.address.zipCode || "",
          },
        };

        // Passwort nur mitsenden, wenn es geändert wurde
        if (newPassword.value) {
          updatedUser.password = newPassword.value;
        }

        // Multipart-Payload bauen
        const formData = new FormData();
        formData.append(
          "user",
          new Blob([JSON.stringify(updatedUser)], { type: "application/json" })
        );

        // WICHTIG: Backend-Antwort speichern!
        const response = await axios.put(
          `http://localhost:8080/api/v1/users/${userId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const savedUser = response.data; // 👈 das ist die echte Datenbank-Version

        // Diese Version speichern – nicht dein lokales Objekt
        localStorage.setItem("user", JSON.stringify(response.data));
        user.value = savedUser;

        showMessage("Profile updated successfully", "success");

        // Passwortfelder leeren
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
      } catch (err) {
        console.error(err);
        showMessage("Update failed", "error");
      }
    };

    const deleteAccount = async () => {
      if (!confirm("This will permanently delete your account. Continue?"))
        return;

      try {
        await axios.delete(`http://localhost:8080/api/v1/users/${userId}`);
        localStorage.removeItem("user");
        showMessage("Account deleted", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } catch {
        showMessage("Delete failed", "error");
      }
    };

    return {
      user,
      defaultAvatar,
      currentPassword,
      newPassword,
      confirmPassword,
      saveProfile,
      deleteAccount,
      formMessage,
      formMessageType,
    };
  },
};
</script>

<style scoped>
h1 {
  justify-self: center;
  margin-top: 0;
}

.user-profile-container {
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #333333;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  text-align: center;
  animation: fadeIn 0.4s ease;
}

button {
  background: none;
  border: 1px solid #7c5ca6;
  color: #7c5ca6;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 10px;
}
button:hover {
  background: #7c5ca6;
  color: #fff;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

input,
textarea {
  border: 1px solid #e7e3ee;
  border-radius: 16px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: 0.2s;
  background: #fcfbfe;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #7c5ca6;
  box-shadow: 0 0 0 3px rgba(124, 92, 166, 0.12);
}

.danger-btn {
  background: #e57373;
  color: black;
  width: 200px;
  align-self: center;
}

.danger-btn:hover {
  background: #d32f2f;
}

.form-message {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;

  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease;
}

.form-message.show {
  opacity: 1;
  visibility: visible;
}

.form-message.success {
  background-color: #e8f7ef;
  color: #1e7f4f;
  border: 1px solid #b7e4cd;
}

.form-message.error {
  background-color: #fdecea;
  color: #b42318;
  border: 1px solid #f5c2bd;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(120deg, #f7f4fb, #efe9fa);
  border: 1px solid #e4ddf2;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #7c5ca6;
}

.profile-info h2 {
  margin: 0;
  color: #7c5ca6;
  font-size: 1.3rem;
}

.profile-info p {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #666;
}
h4 {
  justify-self: left;
  margin-top: 25px;
  padding-bottom: 10px;
  font-size: 20px;
}
/* Form sections layout */
form > div {
  display: grid;
  grid-template-columns: 180px 1fr;
  column-gap: 24px;
  row-gap: 16px;
  align-items: center;
}

/* Section titles span full width */
form > div > h4 {
  grid-column: 1 / -1;
  margin-bottom: 10px;
}

/* Time range should span full width */
.time-range {
  grid-column: 2 / -1;
}

/* Logo preview centered */
.logo-preview {
  grid-column: 2;
}

/* Buttons full width */
button[type="submit"] {
  grid-column: 1 / -1;
  justify-self: stretch;
}

.submit-row {
  grid-column: 1 / -1;
}

input,
textarea {
  width: 100%;
  border: 1px solid #e7e3ee;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 14px;
  background: #fcfbfe;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7a3ec8;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1rem;
}

.back-link span {
  font-size: 20px;
}
</style>
