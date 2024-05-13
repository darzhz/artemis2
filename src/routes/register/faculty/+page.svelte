<script>
  import Popup from '../../../components/Popup.svelte';
  export let form;
  let name = '';
  let email = '';
  let password = '';
  let password2 = '';
  let department = '';
  let showPopup = false;
  if (form && form.status == 200) {
    showPopup = true;
  }
</script>
<div class="register-form">
    <h1>Register Faculty</h1>
    {#if showPopup}
        <Popup on:close={()=>{showPopup=false}}>
            <p>{form.body.message}</p>
        </Popup>
    {/if}
    
    <form method="post" action="/register/faculty?/create">
      <div class="form-group">
          <label for="name" aria-required="true">Name</label>
          <input type="text" id="name" name="name" pattern="[a-zA-Z ]+" title="Please enter only letters and spaces" required />
      </div>
  
      <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" pattern="[^@\s]+@[^@\s]+" required />
      </div>
  
      <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" pattern={`.{8,}`} title="Password must be at least 8 characters long" required />
      </div>
  
      <div class="form-group">
          <label for="password2">Confirm password</label>
          <input type="password" id="password2" name="password2" pattern={`.{8,}`} title="Password must be at least 8 characters long" required />
      </div>
  
      <div class="form-group">
          <label for="department">Department</label>
          <select id="department" name="department" required>
              <option value="">Select Department</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="mech">MECH</option>
              <option value="civil">CIVIL</option>
              <option value="ece">ECE</option>
          </select>
      </div>
  
      <button type="submit">Register</button>
  </form>
  
</div>
<style>
  /* beautifully styled and centered form */
  .register-form {
    margin: 0 auto;
    width: 450px;
    padding: 100px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 5svh;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    display: block;
    width: 100%;
    padding: 10px 0;
    background-color: #4CAF50; /* Green */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049; /* Green shade */
  }
    

</style>