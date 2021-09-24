<template>
  
  <div>    

    <div v-if="showSelection" class="container mt-5">
      <div class="row">
        <div class="col-sm-12 col-md-8 col-lg-6 mx-auto">
          <h3 class="text-center mb-4">Chatrooms</h3>
          <div v-for="(chatroom, idx) in chatrooms" :key="idx" class="list-card card">
            <div class="card-body d-flex justify-content-sm-between align-items-center">
              <div>
                <h4 class="card-title">{{ chatroom.name }}</h4>
                <div class="card-text">
                  <p>{{ chatroom.participants }}</p>
                </div>
              </div>
              <button class="btn btn-primary" v-on:click="onEnterChat(chatroom.id, chatroom.name)">
                Join Chat
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
        this.chatIntro = (chatName === "Icebreaker") ? true: false // show introductary tips for icebreaker chat
      },

      onExitChat() {  // passed up the tree from the ChatSession component
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

