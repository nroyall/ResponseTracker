<template>

  <div>
    <div class="row align-items-stretch">
      <div class="col">
        <div class="card list-card clickable-card" :class="{ 'is-active': currentFilter == 'all' }" ref="filter" v-on:click="filterLogs('all')">
          <div class="card-body">
            <h4 class="card-title">All Sessions</h4>
            <div class="card-text">
              <p>{{ sessions.length }} sessions logged</p>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(chatroom, idx) in chatrooms" :key="idx" class="col">
        <div class="card list-card clickable-card"  :class="{ 'is-active': currentFilter == chatroom.name }" ref="filter" v-on:click="filterLogs( chatroom.name )">
          <div class="card-body">
            <h4 class="card-title">{{ chatroom.name }} <br/><small>with {{ chatroom.participants }}</small></h4>
            <div class="card-text">
              <p>{{ chatroom.sessions }} sessions logged</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h5 class="mt-5 list-filter-title">Showing: <span ref="filterTitle">All sessions</span></h5>
    <hr class="mb-4">
    <div v-for="(session, idx) in sessions" :key="idx" ref="session" class="list-card card" :data-chatroom="session.chatroom_name">
      <div class="card-body d-flex justify-content-sm-between align-items-center">
        <div>
          <h4 class="card-title"><strong>ID:</strong> {{ session.moderator_id }}</h4>
          <div class="card-text">
            <p>
              <small><strong>Time:</strong> 
              {{ session.start_time.toDate().toLocaleDateString() }},
              {{ session.start_time.toDate().toLocaleTimeString() }}</small>
              <br>
              <small><strong>Chatroom:</strong> {{ session.chatroom_name }}</small>
            </p>
          </div>
        </div> 
        <div class="text-right">
          <button class="btn btn-primary" v-on:click="$emit('view-log', session.id)">
            View Responses
          </button>
          <br>
          <button class="btn btn-secondary mt-1" v-on:click="$emit('view-data', session.id)">
            View Data Table
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>  

  import { db } from '../main'

  export default {
    name: 'sessions',

    data () {
      return {
        chatrooms: [],
        sessions: [],
        currentFilter: 'all'
      }
    },

    methods: {

      filterLogs(chatroom) {  // filter the session logs by specific chatroom

        var self = this
        var newText = null

        self.currentFilter = chatroom

        if ( chatroom === 'all') {  // if clicking all sessions, reveal all session logs
         
          newText = 'All sessions'

          self.$refs.session.forEach(function(session){  
            session.classList.remove('is-hidden')
          })
        }
        else { // if a chatroom is passed, filter the sessions by data attribute

          newText = chatroom

          self.$refs.session.forEach(function(session){  

            var sessionChatroom = session.getAttribute('data-chatroom') 

            if ( sessionChatroom !== chatroom ) {  
              session.classList.add('is-hidden')
            } else {
              session.classList.remove('is-hidden')
            }
          })
        }

        self.$refs.filterTitle.innerHTML = newText // replace filter title
      },
    },

    created () { 

      var chatroomsRef = db.collection('chatrooms').orderBy('order') // show chatrooms in order

      chatroomsRef.get().then((querySnapshot) => { 
          querySnapshot.forEach((doc) => {

              // find the number of session for each chatroom
              let numSessions = 0

              db.collection('sessions').where('chatroom_id', '==', doc.id).get()
              .then((querySnapshot) => { 
                querySnapshot.forEach(() => {
                  numSessions += 1;
                });

                // store the chatroom data locally
                this.chatrooms.push({...doc.data(), sessions: numSessions, id: doc.id})
              })
          })
      })

      var sessionsRef = db.collection('sessions').orderBy('start_time', 'asc') // show sessions newest first

      // get all sessions from the database on initial load 
      // and receive updates immediately when a new session is added 
      sessionsRef.onSnapshot((snapshot) => { // listen to documents with onSnapshot()

          snapshot.docChanges().forEach((change) => {
              
              // when component is loaded and when a new session is started 
              if (change.type === "added") {
                // add session to beginning of array (new item appears at top)
                this.sessions.unshift({...change.doc.data(), id: change.doc.id})
              }
          })
      })
    }
  }

</script>