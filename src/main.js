import Vue from 'vue'
import App from './App.vue'

// Bootstrap
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

// Styles
import './assets/styles/main.scss'

// Import all Firebase modules
import firebase from 'firebase'

// Set up Firebase
const firebaseConfig = {  
  apiKey: "process.env.VUE_APP_FIREBASE_API_KEY",
  authDomain: "process.env.VUE_APP_AUTH_DOMAIN",
  databaseURL: "process.env.VUE_APP_DATABASE_URL",
  projectId: process.env.VUE_APP_PROJECT_ID, 
  storageBucket: "process.env.VUE_APP_STORAGE_BUCKET",
  messagingSenderId: "process.env.VUE_APP_MESSAGING_SENDER_ID",
  appId: "process.env.VUE_APP_APP_ID",
}

// Initialize Firestore instance
firebase.initializeApp(firebaseConfig)

// Set up Cloud Firestore service 
export const db = firebase.firestore() // service interface
export const dbRef = firebase.firestore // the database reference


// Initialize Vue
new Vue({
  render: h => h(App)
}).$mount('#app')
