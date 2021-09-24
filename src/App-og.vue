<template>
  <div id="app">

    <app-header v-on:show-user-login="onShowUserLogin" v-on:show-admin-login="onShowAdminLogin" />

    <div class="app-body">
      
      <user-login v-if="showUserLogin" v-on:app-login="onUserLogin"/>

      <admin-login v-if="showAdminLogin" v-on:admin-login="onAdminLogin" v-on:show-user-login="onShowUserLogin"/>

      <chat-selection v-if="showChatSelection" v-bind:user ="{ name: user.name, id: user.id }"/>

      <admin-dashboard v-if="showAdminDashboard"/>

    </div>

  </div>
</template>

<script>

  export default {
    name: 'app',

    components: {  // lazy load components by combining dynamic import statement with v-if directive
      AppHeader: () => import('@/components/AppHeader.vue'),
      UserLogin: () => import('@/components/UserLogin.vue'),
      AdminLogin: () => import('@/components/AdminLogin.vue'),
      ChatSelection: () => import('@/components/ChatSelection.vue'),
      AdminDashboard: () => import('@/components/AdminDashboard.vue'),
    },

    data () {
      return {
        showUserLogin: true,
        showAdminLogin: false,
        showChatSelection: false,
        showAdminDashboard: false,
        user: { // holds the user login entered by user
          name: '',
          id: '',
        }
      }
    },

    methods: {

      onShowUserLogin() {
        // when logged out, show login screen and hide user logout button in the header
        this.showUserLogin = true
        this.showAdminLogin = false
        this.showChatSelection = false
        this.showAdminDashboard = false

        document.querySelector('.admin-login-btn').classList.add('is-visible')
        document.querySelector('.admin-logout-btn').classList.remove('is-visible')
        document.querySelector('.user-login-btn').classList.add('is-visible')
        document.querySelector('.user-logout-btn').classList.remove('is-visible')
      },

      onUserLogin(username, userId) {
        // when logged in, hide login screen and show user logout button in the header
        this.user.name = username;
        this.user.id = userId;

        this.showUserLogin = false
        this.showAdminLogin = false
        this.showChatSelection = true
        this.showAdminDashboard = false

        document.querySelector('.admin-login-btn').classList.remove('is-visible')
        document.querySelector('.admin-logout-btn').classList.remove('is-visible')
        document.querySelector('.user-login-btn').classList.remove('is-visible')
        document.querySelector('.user-logout-btn').classList.add('is-visible')
      },

      onShowAdminLogin() {
        this.showUserLogin = false
        this.showAdminLogin = true
        this.showChatSelection = false
        this.showAdminDashboard = false

        document.querySelector('.admin-login-btn').classList.add('is-visible')
        document.querySelector('.admin-logout-btn').classList.remove('is-visible')
        document.querySelector('.user-login-btn').classList.add('is-visible')
        document.querySelector('.user-logout-btn').classList.remove('is-visible')
      },

      onAdminLogin() {
        // when logged in to admin dashboard, hide login screen and show admin logout button in the header

        this.showUserLogin = false
        this.showAdminLogin = false
        this.showChatSelection = false
        this.showAdminDashboard = true

        document.querySelector('.admin-login-btn').classList.remove('is-visible')
        document.querySelector('.admin-logout-btn').classList.add('is-visible')
        document.querySelector('.user-login-btn').classList.remove('is-visible')
        document.querySelector('.user-logout-btn').classList.remove('is-visible')
      }
    },

    created () {
        document.title = 'Moderataur';
    }
  }
</script>
