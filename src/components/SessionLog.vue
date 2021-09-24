<template>
  
  <div class="log-detail">
    
    <div v-if="session[0]" class="log-detail_header container">
      <div class="row">
        <div class="col-sm-8">
          <h4>{{ session[0].chatroom_name }}</h4>
          <p class="mb-0"><strong>Participant:</strong> {{ session[0].moderator_name }}</p>
          <p class="mb-0"><strong>ID:</strong> {{ session[0].moderator_id }}</p>
          <p class="mb-1">
            <strong>Start time:</strong>
             {{ session[0].start_time.toDate().toLocaleDateString() }},
             {{ session[0].start_time.toDate().toLocaleTimeString() }}
          </p>
        </div>
        <div class="col text-right">
          <b-button 
            class="exit-log-btn"
            @click="$emit('exit-log')"
            >
            All chat sessions&nbsp;&rarr;
          </b-button>
        </div>
      </div>
    </div>

    <ol 
    v-show="messages.length" 
    class="logs container" 
    ref="logs"
    >
      <li class="row logs_header"> 
        <div class="col-sm-7 logs_header_col">
          <h5>Responses</h5>
        </div>
        <div class="col-sm-5 logs_header_col">
          <h5>Messages</h5>
        </div>
      </li>

      <li 
        v-for="(message, idx) in messages" 
        :key="idx" 
        ref="log" 
        :class="['row log person-' + message.person]"
      > 
        <div class="col-sm-7">
          <div v-if="getResponseById(message.id)" class="log_response">
            <div class="log_response_time">{{ getResponseDelay(message.id) }} after message</div>
            <div>
              <i v-if="getResponseById(message.id).response_flag === 'green'" class="log_response_flag green" />
              <i v-if="getResponseById(message.id).response_flag === 'orange'" class="log_response_flag orange" />
              <i v-if="getResponseById(message.id).response_flag === 'red'" class="log_response_flag red" />
              <blockquote v-if="getResponseById(message.id).response_text" class="log_response_text">
                "{{ getResponseById(message.id).response_text }}"
              </blockquote>
            </div>
          </div>
        </div>

        <div class="col-sm-5 log_message">
          <div class="log_message_bubble">
            <p class="mb-0">{{ message.message }}</p>
          </div>
          <div class="log_message_meta"><strong>{{ message.name }}</strong></div>
        </div>
      </li>
    </ol>

  </div>

</template>

<script>
   
  import { db } from '../main'

  export default {
    name: 'sessionlog',

    props: {
      sessionId: String,
    },

    data () {
      return { 
        session: [], // stores session data from db
        responses: [], // stores response data from db
        messages: [] // stores messages from db
      }
    },

    methods: {
      getResponseById(id) {
        const idx = this.responses.findIndex(o => o.message_id === id)
        return this.responses[idx] || false
      },

      getResponseDelay(id) {
        const timeInSeconds = this.getResponseById(id).response_delay
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        const timeString = minutes ?  minutes+' minute '+seconds+' seconds' : seconds+' seconds'
        return timeString
      }
    },

    created () { 

      const self = this;

      // get this session from the database 
      db.collection('sessions').doc(self.sessionId).get().then((documentSnapshot) => {

        // store session data locally
        self.session.push({...documentSnapshot.data(), id: documentSnapshot.id})

        // get session responses on initial load 
        // and receive updates immediately when user adds comments or flags
        const responsesRef = db.collection('sessions/' + documentSnapshot.id + '/responses').orderBy('message_time')
        responsesRef.onSnapshot((snapshot) => { // listen to responses with onSnapshot()

            snapshot.docChanges().forEach((change) => {
                
                // update responses when component is first loaded and when participant adds new response
                if (change.type === "added") {
                  self.responses.push({...change.doc.data(), id: change.doc.id }) 
                }

                // when response is updated, check for existing response to this message, then update comment and flag color
                if ( change.type === "modified") {
                  const responseIdx = this.responses.findIndex(o => o.message_id === change.doc.id);
                  if ( responseIdx > -1 ) { 
                    self.responses[responseIdx].response_text = change.doc.data().response_text ? change.doc.data().response_text : null;
                    self.responses[responseIdx].response_flag = change.doc.data().response_flag ? change.doc.data().response_flag : null;
                    self.$forceUpdate() 
                  }
                }
            })
        })
      })
    },

    watch: {
      
      // watch for the session array to be populated 
      // so we can show chatroom messages next to responses
      session: function (session) {  

        const self = this;

         // get chatroom associated with session and store mesages locally
        db.collection('chatrooms').doc(session[0].chatroom_id).get()
        .then((documentSnapshot) => {   
          db.collection('chatrooms/' + documentSnapshot.id + '/messages').orderBy('order').get()
          .then((subCollectionSnapshot) => {
            subCollectionSnapshot.forEach((subDoc) => {
              self.messages.push({...subDoc.data(), id: subDoc.id})
            });
          });
        })
        .catch(function(error){
          console.log('Error retrieving chat messages: ', error);
        });
      }
    }
  }


</script>
