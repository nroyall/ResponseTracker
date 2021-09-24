
<template>    
  <div class="app-header">
    <div class="container">
      <div class="row">
        <div class="col-sm-8 d-flex">
          <i class="app-logo mr-2"></i>
          <h1>Moderataur</h1>
        </div>
        <div class="col-sm-4 app-header_right">

          <b-button 
            class="admin-login-btn app-header_btn is-visible"
            @click="$emit('show-admin-login')"
            >
            Admin log in
          </b-button>

          <b-button 
            class="admin-logout-btn app-header_btn"
            @click="$emit('show-admin-login')"
            >
            Admin log out
          </b-button>

          <b-button 
            class="user-login-btn app-header_btn is-visible"
            @click="$emit('show-user-login')"
            >
            Participant log in
          </b-button>

          <b-button 
            class="user-logout-btn app-header_btn"
            @click="$emit('show-user-login')"
            >
            Log out
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'appheader',
  }
</script>

