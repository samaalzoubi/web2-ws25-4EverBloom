<template> 
    <div class="title"> 
      <router-link to="/"> <button>Back</button> </router-link>
      <h1>Private Information </h1> 

    <div class="user-profile-container">
      <form>
        <div>
            <h2>Change Profile Picture</h2>
            <div>
              <label>Upload New Picture: </label>
              <input type="file" accept="image/*">
            </div>
        </div>

        
        <div>
          <label>Shop Name: </label>
          <input placeholder="e.g. Rosenduft & Co" required>
        </div>
        
        <div>
          <label>Number: </label>
          <input type="number" placeholder="+49 xxx ">>
        </div>

        <div>
            <h2>Change Password</h2>
            <div>
              <label>Current Password: </label>
              <input>
            </div>
            <div>
              <label>New Password: </label>
              <input>
            </div>
            <div>
              <label>Confirm New Password: </label> 
              <input>
            </div>
        </div>

        <div class="card">
            <h2>Delete Account</h2>
            <p>Warning: This action cannot be undone!</p>
            <button class="danger-btn">Delete Account</button>
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
  
  
</style>