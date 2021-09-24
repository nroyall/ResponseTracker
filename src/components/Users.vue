<template>

  <div class="users-list">
    <div v-for="(user, idx) in sortedUsers" :key="idx" ref="user" :class="['list-card card ' + user.statusClass]">
      <div class="card-body d-flex justify-content-sm-between align-items-center">
        <div>

          <h4 class="card-title"><strong>ID:</strong> {{ user.id }}</h4>
          <div class="card-text">
            <p class="mb-1"><strong>Username:</strong> {{ user.name }}</p>
            <p v-if="user.expires && user.status === 'Valid'" class="card-status">
              Expires
              {{ user.expires.toDate().toDateString() }}, {{ user.expires.toDate().toLocaleTimeString() }}
            </p>
            <p v-if="user.status === 'Expired'" class="card-status red"><strong>Expired</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>  

  import { db } from '../main'

  export default {
    name: 'users',

    data () {
      return {
        users: [],
        sortedUsers: []
      }
    },

    created () { 

      var usersRef = db.collection('moderators')

      // get all users from the database on initial load 
      // and receive updates immediately when a new user is added 
      usersRef.onSnapshot((snapshot) => { // listen to documents with onSnapshot()

          snapshot.docChanges().forEach((change) => {
              
              // when component is loaded and when a new session is started 
              if (change.type === "added") {

                // add user to beginning of array (new user appears at top)
                this.users.unshift({...change.doc.data(), key: change.doc.id})
              }
          })
      })
    },

    watch: {
      users: {
        deep: true, // watch whas is inside the users array

        handler() { // move method to a handler field

          // create another array of users sorted by expiry date
          this.sortedUsers = this.users.slice().sort(function(a, b){
            let aExpires = 0;
            let bExpires = 0;
            if ( a.expires ) {
              aExpires = a.expires.toDate() // convert Firebase timestamp to JS Date object
            }
            if ( b.expires ) {
              bExpires = b.expires.toDate() 
            }
            return bExpires - aExpires // return new array sorted by expirey date
          });

          // set user status to show whether user has expired
          const timeNow = new Date()
          this.sortedUsers.map((user) => {
            if ( user.expires ) {
              user.status = ( user.expires.toDate() > timeNow ) ? 'Valid' : 'Expired';
              user.statusClass = ( user.expires.toDate() > timeNow ) ? 'is-valid' : 'is-expired';
            }
          })
        }
      }
    }
  }

</script>