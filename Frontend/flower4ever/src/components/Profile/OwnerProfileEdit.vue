<template>
  <div class="title">
    <router-link to="/"><button>Back</button></router-link>
    <h1>Edit Profile</h1>

    <div class="user-profile-container">
      <form @submit.prevent="saveProfile">

        <div>
          <h4>General Information</h4>
          <img
            v-if="logoPreview"
            :src="logoPreview"
            class="logo-preview"
          />
          <label>Logo</label>
          <input type="file" accept="image/*" @change="handleFileUpload" />

          <label>Street</label>
          <input v-model="owner.address.streetAddress" />

          <label>City</label>
          <input v-model="owner.address.city" />

          <label>State</label>
          <input v-model="owner.address.state" />

          <label>ZIP Code</label>
          <input v-model="owner.address.zipCode" />

          <label>Opening Hours</label>
          <div class="time-range">
            <input type="time" v-model="owner.openingTime">
            <span>–</span>
            <input type="time" v-model="owner.closingTime">
          </div>
        </div>

        <!-- Password -->
        <div>
          <h4>Change Password</h4>

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

        <div>
          <h4>Delete Account</h4>
          <p>Warning: This action cannot be undone!</p>
          <button type="button" class="danger-btn" @click="deleteAccount">Delete Account</button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue"
import axios from "axios"

export default {
  setup() {
    const logoFile = ref(null)
    const logoPreview = ref(null)

    const owner = ref({
      address: {
        streetAddress: "",
        city: "",
        state: "",
        zipCode: ""
      },
      openingTime: "",
      closingTime: ""
    })

    const currentPassword = ref("")
    const newPassword = ref("")
    const confirmPassword = ref("")

    const formMessage = ref("")
    const formMessageType = ref("")

    const showMessage = (msg, type = "success") => {
      formMessage.value = msg
      formMessageType.value = type
      setTimeout(() => (formMessage.value = ""), 4000)
    }

    const handleFileUpload = (event) => {
      const file = event.target.files[0]

      if (!file) return

      if (!file.type.startsWith("image/")) {
        showMessage("Only image files allowed", "error")
        return
      }

      logoFile.value = file
      logoPreview.value = URL.createObjectURL(file)
    }

onMounted(async () => {
  const userId = localStorage.getItem("userId")

  try {
    const res = await axios.get(`http://localhost:8080/api/v1/users/${userId}`)
    const data = res.data

    owner.value = {
      ...data,
      address: {
        streetAddress: data.address?.streetAddress || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        zipCode: data.address?.zipCode || ""
      },
      openingTime: data.openingTime || "",
      closingTime: data.closingTime || ""
    }

    // Falls schon ein Logo existiert
    if (data.logoUrl) {
      logoPreview.value = data.logoUrl
    }

  } catch (err) {
    showMessage("Could not load profile", "error")
  }
})

    const saveProfile = async () => {
      if (newPassword.value !== confirmPassword.value) {
        showMessage("Passwords do not match", "error")
        return
      }

      try {
        const userId = localStorage.getItem("userId")

       const formData = new FormData()

        formData.append(
          "user",
          new Blob(
            [JSON.stringify({
              ...owner.value,
              password: newPassword.value || undefined
            })],
            { type: "application/json" }
          )
        )

        // Logo anhängen (nur wenn gewählt)
        if (logoFile.value) {
          formData.append("logo", logoFile.value)
        }

        await axios.put(
          `http://localhost:8080/api/v1/users/${userId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )

        showMessage("Profile updated successfully", "success")

        currentPassword.value = ""
        newPassword.value = ""
        confirmPassword.value = ""

      } catch (err) {
        if (err.response?.data) {
          showMessage(err.response.data.message || err.response.data, "error")
        } else {
          showMessage("Server not reachable", "error")
        }
      }
    }
    const deleteAccount = async () => {
      const confirmDelete = confirm(
        "Are you sure? This will permanently delete your account and shop."
      )

      if (!confirmDelete) return

      try {
        const userId = localStorage.getItem("userId")

        await axios.delete(`http://localhost:8080/api/v1/users/${userId}`)

        localStorage.clear()

        showMessage("Account deleted successfully", "success")

        setTimeout(() => {
          window.location.href = "/"
        }, 1500)

      } catch (err) {
        showMessage(
          err.response?.data || "Could not delete account",
          "error"
        )
      }
    }

    return {
      owner,
      currentPassword,
      newPassword,
      confirmPassword,
      deleteAccount,
      saveProfile,
      formMessage,
      formMessageType,
      handleFileUpload
    }
  }
}
</script>

<style scoped>
.title{
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #7c5ca6;
}

h4{
   justify-self: left;
   margin-top: 25px;
   padding-bottom: 10px;
   font-size: 20px;
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

.time-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-range input {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: white;
  min-width: 120px;
}

.time-range span {
  font-size: 18px;
  font-weight: 600;
  color: #7e4bb1;
}

.logo-preview {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-top: 10px;
  border-radius: 12px;
  border: 1px solid #ddd;
}
</style>