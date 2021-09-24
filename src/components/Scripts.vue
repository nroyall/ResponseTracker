<template>

  <div class="chatrooms-list">
    <div v-for="(chatroom, idx) in sortedChatrooms" :key="idx" ref="chatroom" :class="['list-card card ' + chatroom.statusClass]">
      <div class="card-body d-flex justify-content-sm-between align-items-center">
        <div>
          <h4 class="card-title">{{ chatroom.name }}</h4>
          <div class="card-text">
            <p class="mb-1">{{ chatroom.participants }}</p>
          </div>
        </div>
        <button class="btn btn-primary" v-on:click="$emit('view-script', chatroom.key)">
          View Script
        </button>
      </div>
    </div>
  </div>

</template>

<script>  

  import { db } from '../main'

  export default {
    name: 'scripts',

    data () {
      return {
        chatrooms: [],
        sortedChatrooms: []
      }
    },

    created () { 

      var chatroomRef = db.collection('chatrooms')

      // get all chatrooms from the database on initial load 
      // and receive updates immediately when a new chatroom is added 
      chatroomRef.onSnapshot((snapshot) => { // listen to documents with onSnapshot()

          snapshot.docChanges().forEach((change) => {
              
              // when component is loaded and when a new session is started 
              if (change.type === "added") {

                // add chatroom to beginning of array (new chatroom appears at top)
                this.chatrooms.unshift({...change.doc.data(), key: change.doc.id})
              }
          })
      })
    },

    watch: {
      chatrooms: {
        deep: true, // watch whas is inside the chatrooms array

        handler() { // move method to a handler field

          // create another array of chatrooms sorted by expiry date
          this.sortedChatrooms = this.chatrooms.slice().sort(function(a, b){
            return b.order - a.order // return new array sorted by chatroom order
          });
        }
      }
    }
  }

</script>