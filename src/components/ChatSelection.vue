<template>
  
  <div>    

    <div v-if="showSelection" class="container mt-5">
      <div class="row">
        <div class="col-sm-12 col-md-8 col-lg-6 mx-auto">
          <div>
            <h3 class="text-center">Your Task</h3>
            <ul class="text-list">
              <li>Your task is to oversee the chat conversations.</li>
              <li>The other chat users will be given a question to work on together.</li>
              <li>Please flag innappropriate chat messages and provide written feedback.</li>
              <li>Join a chatroom to begin. Chat users will join after you arrive.</li>
            </ul>
          </div>
          <div v-for="(chatroom, idx) in chatrooms" :key="idx" class="list-card list-card--large card">
            <div class="card-body d-flex justify-content-sm-between align-items-center">
              <div>
                <h4 class="card-title">{{ chatroom.name }}</h4>
              </div>
              <button class="btn btn-primary" v-on:click="onEnterChat(chatroom.id, chatroom.name)">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <session v-if="showSession" 
      v-bind:chatId="chatId" 
      v-bind:chatName="chatName" 
      v-bind:chatIntro ="chatIntro"
      v-bind:user ="{ name: user.name, id: user.id }"
      v-on:exit-chat="onExitChat"
    />
    
  </div>

</template>


<script>
  
  import { db } from '../main'

  export default {
    name: 'chatselection',

    components: {
       // lazy load components by combining dynamic import statement with v-if directive
      session: () => import('@/components/Session.vue')
    },

    props: {
      user: {
        id: String,
        name: String,
      },
    },

    data () {
      return {
        showSelection: true,
        showSession: false,
        chatrooms: [],
        chatId: null,
        chatName: '',
        chatIntro: false
      }
    },

    methods: {
      onEnterChat(chatId, chatName) { // when a user clicks Join Chat button
        this.showSelection = false
        this.showSession = true
        this.chatId = chatId
        this.chatName = chatName
        this.chatIntro = true // show introductary tips
      },

      onExitChat() {  // passed up the tree from the session component
        this.showSelection = true
        this.showSession = false
      },
      
    },

    created () { // use created hook to query API and assign data before DOM is mounted 

      var chatroomsRef = db.collection('chatrooms').orderBy('order'); // get chatrooms in order

      chatroomsRef.get().then((querySnapshot) => { 
          querySnapshot.forEach((doc) => {
            this.chatrooms.push({...doc.data(), id: doc.id})
          });
      });
    }
  }
</script>

