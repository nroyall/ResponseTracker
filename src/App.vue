<template>

  <!-- this demo template replaces app-og.vue which has the regular login screen -->

  <div id="app">

    <app-header-demo v-on:show-demo="onShowDemo" />

    <div class="app-body">

      <demo v-if="showDemo" v-on:user-login="onUserLogin" v-on:admin-login="onAdminLogin"/>

      <chat-selection v-if="showUserDashboard" v-bind:user ="{ name: user.name, id: user.id }"/>

      <admin-dashboard v-if="showAdminDashboard"/>

    </div>

  </div>
</template>

<script>

  export default {
    name: 'app',

    components: {  // lazy load components by combining dynamic import statement with v-if directive
      AppHeaderDemo: () => import('@/components/AppHeaderDemo.vue'),
      Demo: () => import('@/components/Demo.vue'),
      ChatSelection: () => import('@/components/ChatSelection.vue'),
      AdminDashboard: () => import('@/components/AdminDashboard.vue'),
    },

    data () {
      return {
        showDemo: true,
        showUserDashboard: false,
        showAdminDashboard: false,
        user: { // holds the user login entered by user
          name: '',
          id: '',
        }
      }
    },

    methods: {

      onShowDemo() {
        // when logged out, show demo login screen 
        this.showDemo = true
        this.showUserDashboard = false
        this.showAdminDashboard = false

        document.querySelector('.logout-btn').classList.remove('is-visible')
      },

      onUserLogin(username, userId) {
        // when logged in, hide login screen and show user logout button in the header
        this.user.name = username;
        this.user.id = userId;

        this.showDemo = false
        this.showUserDashboard = true
        this.showAdminDashboard = false

        document.querySelector('.logout-btn').classList.add('is-visible')
      },

      onAdminLogin() {
        // when logged in to admin dashboard, hide login screen and show admin logout button in the header

        this.showDemo = false
        this.showUserDashboard = false
        this.showAdminDashboard = true

        document.querySelector('.logout-btn').classList.add('is-visible')
      }
    },

    created () {
        document.title = 'Moderataur';
    }
  }
</script>
