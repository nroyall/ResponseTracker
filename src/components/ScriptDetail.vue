<template>
  
  <div class="log-detail">
    
    <div v-if="chatroom[0]" class="log-detail_header container">
      <div class="row">
        <div class="col-sm-8">
          <h4>{{ chatroom[0].name }} Script</h4>
          <p class="mb-0"><strong>Characters:</strong> {{ chatroom[0].participants }}</p>
          <p class="mb-0"><strong>Order shown:</strong> {{ chatroom[0].order }}</p>
        </div>
        <div class="col text-right">
          <b-button 
            class="exit-script-btn"
            @click="$emit('exit-script')"
            >
            All chat scripts&nbsp;&rarr;
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
        <div class="col-sm-12 logs_header_col">
          <h5>Messages</h5>
        </div>
      </li>

      <li 
        v-for="(message, idx) in messages" 
        :key="idx" 
        ref="message" 
        :class="['row log person-' + message.person]"
      > 
        <div class="col-sm-12 log_message">
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
    name: 'scriptdetail',

    props: {
      chatroomId: String,
    },

    data () {
      return { 
        chatroom: [], // stores chatroom data from db
        messages: [] // stores chatroom messages from db
      }
    },

    methods: {
      // getResponseById(id) {
      //   const idx = this.responses.findIndex(o => o.message_id === id)
      //   return this.responses[idx] || false
      // },

      // getResponseDelay(id) {
      //   const timeInSeconds = this.getResponseById(id).response_delay
      //   const minutes = Math.floor(timeInSeconds / 60)
      //   const seconds = timeInSeconds % 60
      //   const timeString = minutes ?  minutes+' minute '+seconds+' seconds' : seconds+' seconds'
      //   return timeString
      // }
    },

    created () { 

      const self = this;

      // get this session from the database 
      db.collection('chatrooms').doc(self.chatroomId).get().then((documentSnapshot) => {

        // store session data locally
        self.chatroom.push({...documentSnapshot.data(), id: documentSnapshot.id})
 
        db.collection('chatrooms/' + documentSnapshot.id + '/messages').orderBy('order').get()
        .then((subCollectionSnapshot) => {
          subCollectionSnapshot.forEach((subDoc) => {
            self.messages.push({...subDoc.data(), id: subDoc.id})
          });
        });


        // get session responses on initial load 
        // and receive updates immediately when user adds comments or flags
        // const responsesRef = db.collection('sessions/' + documentSnapshot.id + '/responses').orderBy('message_time')
        // responsesRef.onSnapshot((snapshot) => { // listen to responses with onSnapshot()

        //     snapshot.docChanges().forEach((change) => {
                
        //         // update responses when component is first loaded and when participant adds new response
        //         if (change.type === "added") {
        //           self.responses.push({...change.doc.data(), id: change.doc.id }) 
        //         }

        //         // when response is updated, check for existing response to this message, then update comment and flag color
        //         if ( change.type === "modified") {
        //           const responseIdx = this.responses.findIndex(o => o.message_id === change.doc.id);
        //           if ( responseIdx > -1 ) { 
        //             self.responses[responseIdx].response_text = change.doc.data().response_text ? change.doc.data().response_text : null;
        //             self.responses[responseIdx].response_flag = change.doc.data().response_flag ? change.doc.data().response_flag : null;
        //             self.$forceUpdate() 
        //           }
        //         }
        //     })
        // })

        console.dir(self.chatroom);
        console.dir(self.messages);
      })
    },

    watch: {
      
      // watch for the session array to be populated 
      // so we can show chatroom messages next to responses
      // session: function (session) {  

      //   const self = this;

      //    // get chatroom associated with session and store mesages locally
      //   db.collection('chatrooms').doc(session[0].chatroom_id).get()
      //   .then((documentSnapshot) => {   
      //     db.collection('chatrooms/' + documentSnapshot.id + '/messages').orderBy('order').get()
      //     .then((subCollectionSnapshot) => {
      //       subCollectionSnapshot.forEach((subDoc) => {
      //         self.messages.push({...subDoc.data(), id: subDoc.id})
      //       });
      //     });
      //   })
      //   .catch(function(error){
      //     console.log('Error retrieving chat messages: ', error);
      //   });
      // }
    }
  }


</script>
