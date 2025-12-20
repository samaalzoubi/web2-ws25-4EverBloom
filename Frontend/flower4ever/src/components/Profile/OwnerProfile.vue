<template>
   <div class="title"> 
      <router-link to="/"> <button>Back</button> </router-link>
      <h1>Edit Profile</h1> 
      
    <div class="owner-profile-container">
      <form>
        <h2>Rosenduft</h2>
        <p>Manage your shops & products easily 🌸</p>

        <div>
          <label>Shop Logo: </label>
          <input type="file" accept="image/*">
        </div>

        <div>
          <label>Description: </label>
          <textarea placeholder="Short description of your flower shop..."></textarea>
        </div>

        <div>
          <label>Address: </label>
          <input placeholder="e.g. Main Street 12, 54879 Berlin" required>
        </div>

        <div>
          <label>Link: </label>
          <input type="link" placeholder="www " required>
        </div>

        <div>
          <label>Opening Hours: </label>
          <input type="date" required>
        </div>

        <button>Save Profile</button>
      </form>
    </div>
  </div>
</template>

<script>
  

</script>

<style scoped>
.title{
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #7c5ca6;
  margin-bottom: 0;
  margin-top: 0%;
}

h1 {
  justify-self: center;
  margin-top: 0;
  margin-bottom: 0;
}

h2,  p {
  justify-self: center;
  margin-top: 0;
  margin-bottom: 0;
}


.owner-profile-container{
  margin-top: 0;
  background: linear-gradient(120deg, #ffffff, #d4bdf0);
  color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
}

form {
  margin-top: 0;
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
  justify-self: left;
}

input, textarea {
  border: 1px solid  #e7e3ee;
  border-radius:  16px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: 0.2s;
  background: #fcfbfe;
  justify-self: right;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #7c5ca6;
  box-shadow: 0 0 0 3px rgba(124, 92, 166, 0.12);
}

</style>