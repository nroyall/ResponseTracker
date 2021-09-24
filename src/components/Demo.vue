<template>

  <div>

    <div class="container mt-5">
      <div class="row">
        <div class="col-sm-12">
          <h2 class="mb-3">Hi! Thanks for your interest in Moderataur.</h2> 
          <p>This app is designed to facilitate research into user responses. The app collects user responses and presents the data in real time.</p>
          <p>The app displays a scripted chat conversation that appears live and spontaneous. Researchers design chat scripts to look for or trigger certain responses. Participants are tasked with monitoring and giving feedback on the chat conversation.</p>
          <p>Please log in as a participant to experience the chat task, and log in as a researcher to view the responses. You will see responses appear in real time if you log in as a reasearcher simultaneously. Login username and passwords are given.</p>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-sm-6">
          <user-login-demo v-on:app-login="userLogin"/>
        </div>
        <div class="col-sm-6">
          <admin-login-demo v-on:app-login="adminLogin"/>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-sm-12">
          <p><em>*The example script was used in a clinical psychology study to gather the responses of female participants and assess their risk of being subject to interpersonal violence.</em></p>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

  export default {
    name: 'demo',

    components: {  // lazy load components by combining dynamic import statement with v-if directive
      UserLoginDemo: () => import('@/components/UserLoginDemo.vue'),
      AdminLoginDemo: () => import('@/components/AdminLoginDemo.vue'),
    },

    methods: {

      userLogin(username, userId) {
        this.$emit('user-login', username, userId)
      },

      adminLogin() {
        this.$emit('admin-login')
      },
    }
  }

</script>