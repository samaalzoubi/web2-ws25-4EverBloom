<template>
  <div class="title">
    <h1>Edit Profile</h1>

    <div class="user-profile-container">
      <form @submit.prevent="saveProfile">

        <!-- PASSWORD -->
        <div>
          <h2>Change Password</h2>

          <label>Current Password</label>
          <input type="password" v-model="currentPassword" />

          <label>New Password</label>
          <input type="password" v-model="newPassword" />

          <label>Confirm New Password</label>
          <input type="password" v-model="confirmPassword" />
        </div>

        <button type="submit">Save Profile</button>

        <div class="form-message" :class="[formMessage ? 'show' : '', formMessageType]">
          {{ formMessage }}
        </div>

        <div class="card">
          <h2>Delete Account</h2>
          <p>Warning: This action cannot be undone!</p>
          <button type="button" class="danger-btn" @click="deleteAccount">
            Delete Account
          </button>
        </div>

       
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"
import axios from "axios"

export default {
  setup() {
    const currentPassword = ref("")
    const newPassword = ref("")
    const confirmPassword = ref("")

    const formMessage = ref("")
    const formMessageType = ref("")

    const storedUserRaw = localStorage.getItem("user")

    if (!storedUserRaw) {
      window.location.href = "/login"
      return {}
    }

    const storedUser = JSON.parse(storedUserRaw)
    const userId = storedUser.id

    const showMessage = (msg, type = "success") => {
      formMessage.value = msg
      formMessageType.value = type
      setTimeout(() => {
        formMessage.value = ""
      }, 4000)
    }

    const saveProfile = async () => {
      if (newPassword.value !== confirmPassword.value) {
        showMessage("Passwords do not match", "error")
        return
      }

      try {
        const user = JSON.parse(localStorage.getItem("user"))

        if (newPassword.value) {
          user.password = newPassword.value
        }

        await axios.put(
          `http://localhost:8080/api/v1/users/${userId}`,
          user
        )

        localStorage.setItem("user", JSON.stringify(user))

        showMessage("Profile updated successfully", "success")

        currentPassword.value = ""
        newPassword.value = ""
        confirmPassword.value = ""
      } catch (err) {
        showMessage("Update failed", "error")
      }
    }

    const deleteAccount = async () => {
      if (!confirm("This will permanently delete your account. Continue?")) return

      try {
        await axios.delete(`http://localhost:8080/api/v1/users/${userId}`)
        localStorage.removeItem("user")

        showMessage("Account deleted", "success")

        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } catch {
        showMessage("Delete failed", "error")
      }
    }

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      saveProfile,
      deleteAccount,
      formMessage,
      formMessageType
    }
  }
}
</script>



<style scoped>
.title{
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #7c5ca6;
}

h1 {
  justify-self: center;
  margin-top: 0;
}

.user-profile-container{
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #333333;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  width: 400px;
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
  font-weight: 500;
  margin-bottom: 6px;
}

input, textarea {
  border: 1px solid  #e7e3ee;
  border-radius:  16px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: 0.2s;
  background: #fcfbfe;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #7c5ca6;
  box-shadow: 0 0 0 3px rgba(124, 92, 166, 0.12);
}

.danger-btn {
    background-color: #e74c3c;
    color: black;
}

.danger-btn:hover {
    background-color: #c0392b;
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
  
</style>