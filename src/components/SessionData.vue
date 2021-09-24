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
            @click="$emit('exit-data')"
            >
            All chat sessions&nbsp;&rarr;
          </b-button>
        </div>
      </div>
    </div>
  
    <div 
      v-show="responses.length"
      class="container px-0"
    >
      <table class="data-table">
        <thead>
          <th>Time of message</th>
          <th>Message text</th>
          <th>Message sender</th>
          <th>Time of participant response</th>
          <th>Time between message and response</th>
          <th>Time after start of session</th>
          <th>Flag color</th>
          <th>Response comment</th>
        </thead>
        <tbody>
          <tr
            v-for="(response, idx) in responses" 
            :key="idx"
          > 
            <td>{{ response.message_time.toDate().toLocaleTimeString() }}</td>
            <td>{{ response.message_text }}</td>
            <td>{{ response.message_name }}</td>
            <td>{{ response.response_time.toDate().toLocaleTimeString() }}</td>
            <td>{{ getTimeString(response.response_delay) }}</td>
            <td>{{ getTimeAfterStart(response.response_time) }}</td>
            <td>{{ response.response_flag }}</td>
            <td>{{ response.response_text }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>

<script>
   
  import { db } from '../main'

  export default {
    name: 'sessiondata',

    props: {
      sessionId: String,
    },

    data () {
      return { 
        session: [], // stores session data from db
        responses: [], // stores response data from db
      }
    },

    methods: {

      getTimeString(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        const timeString = minutes ?  minutes+' minute '+seconds+' seconds' : seconds+' seconds'
        return timeString
      },

      getTimeAfterStart(time) {
        const timeInSeconds = Math.round((time - this.session[0].start_time))
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
    }
  }


</script>
