
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
            class="logout-btn app-header_btn"
            @click="$emit('show-demo')"
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
    name: 'appheaderdemo',
  }
</script>

