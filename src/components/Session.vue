<template>
  
  <div>
    
    <div v-if="showChatIntro" class="container mt-4">
      <div class="row">
        <div class="col-sm-8 mx-auto">
          <div class="form-card card p-3 p-md-5">
            <b-button class="card-close" @click="exitChat()">
              <b-icon icon="x-square-fill"></b-icon></b-button>
            <div class="card-body">
              <p class="mb-3"><strong>Moderator tips:</strong></p>
              <p class="card-text mb-1">Hover over a message to flag. Click a message to comment.</p>
              <p class="card-text mb-4">You have a few moments to change the flag color.</p>

              <img class="mt-4 mb-5" src="@/assets/images/chat-demo-flag.png" alt="Hover a messag to flag it">

              <b-button @click="showChatIntro = false" variant="primary">Okay, let's begin&hellip;</b-button>
              <!-- <b-button @click="showChatIntro = false" class="mt-2">Cancel</b-button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div  v-if="showChatWindow" class="session-view container">
      <b-button 
        class="exit-chat-btn"
        v-b-modal.exit-chat-modal
        >
        Leave chatroom
      </b-button>

      <b-modal 
        id="exit-chat-modal" 
        title="Are you ready to leave the chatroom?"
        variant="danger"
        @ok="exitChat()"
        ok-title="Leave"
        cancel-title="Return to chatroom"
      >
        <p class="my-4">Please make sure you have finished adding comments before you go.</p>
      </b-modal>

      <ol 
      v-show="messages.length" 
      class="messages" 
      ref="messages"
      >

        <li class="row message">
          <div class="col-sm-5">
          </div>
          <div class="col-sm-7">
            <div class="message_window">
              <h1 class="message_window_heading">{{ chatName }}</h1>
            </div>
          </div>
        </li>

        <li 
          v-for="(message, idx) in messages" 
          :key="'msg-'+idx" 
          ref="message" 
          :class="['row message person-' + message.person]"
        >
          <div class="col-sm-5">
            <form class="message_response" @submit.prevent="closeResponse(idx)">
              <div role="group" class="form-group">
                <label for="responseBox"><strong>Respond to</strong><span>For</span> {{ message.name }}:</label>
                <div>
                  <textarea 
                    ref="responseBox"
                    id="responseBox" 
                    class="form-control" 
                    :placeholder="['Enter a comment for '+message.name]"
                    v-model="messages[idx].response"
                    v-on:change="storeResponse(idx)"
                    @focus="selectMessage(idx)"
                    @blur="deselectMessage(idx)"
                    wrap="soft" 
                    rows="2"
                    max-rows="6"
                  ></textarea>
                </div>
                <b-button variant="primary mt-2">Done</b-button>
              </div>
            </form>
          </div>
          <div class="col-sm-7">
            <div class="message_window">
              <div class="message_window_inner">
                <div 
                  class="message_bubble"
                  tabindex="0" 
                  @blur="deselectMessage(idx)" 
                  v-on:click="selectMessage(idx)" 
                  > 
                  <!-- v-b-tooltip.hover.left title="Click to respond" -->

                  <p class="mb-0">{{ message.message }}</p>
                </div>
                <form class="message_actions">
                  <input 
                    class="message_flag red" 
                    id="flag-red"
                    type="radio"  value="red"
                    v-model="messages[idx].flag"
                    v-on:change="selectFlag(idx)"
                    :disabled="!messages[idx].allowFlagChange"
                  >
                  <label class="sr-only" for="one">Red</label>
                  <input 
                    class="message_flag orange" 
                    id="flag-orange"
                    type="radio"  value="orange"
                    v-model="messages[idx].flag"
                    v-on:change="selectFlag(idx)"
                    :disabled="!messages[idx].allowFlagChange"
                  >
                  <label class="sr-only" for="two">Orange</label>
                  <input 
                    class="message_flag green" 
                    id="flag-green"
                    type="radio"  value="green"
                    v-model="messages[idx].flag"
                    v-on:change="selectFlag(idx)"
                    :disabled="!messages[idx].allowFlagChange"
                  >
                  <label class="sr-only" for="two">Green</label>
                </form>
                <div class="message_dots">
                  <div class="bounce1"></div>
                  <div class="bounce2"></div>
                  <div class="bounce3"></div>
                </div>
              </div>
              <div class="message_meta"><strong>{{ message.name }}</strong><time>10:12am, Today</time></div>
            </div>
          </div>
        </li>

        <li 
          v-for="(name, idx) in names" 
          :key="'person-'+idx" 
          ref="signoff" 
          :class="['row message person-' + name.person]"
        >
          <div class="col-sm-5">
          </div>
          <div class="col-sm-7">
            <div class="message_window">
              <div class="message_signoff">
                <strong>{{ name.name }} has left the chat</strong>
                <time>10:12am, Today</time>
              </div>
            </div>
          </div>
        </li>
      </ol>
    </div>

  </div>

</template>

<script>
   
  import { db, dbRef } from '../main'

  export default {
    name: 'session',

    props: {
      chatId: String,
      chatName: String,
      chatIntro: Boolean,
      user: {
        id: String,
        name: String,
      },
    },

    data () {
      return {
        showChatIntro: this.chatIntro,
        sessionRef: null, // holds db reference for this session 
        startTime: null, // start time of session
        messages: [], // holds the message data from the db
        names: [], // stores names of people in the chatroom
        responses: [], // stores response data entered by user, including message details
        previousMsgIdx: false,
        timers:[], // keep track of all timers in one array, then stop timers before exiting chat
      }
    },

    computed: {
      showChatWindow: function() { // computed property is calculated base on another property
        return !this.showChatIntro
      }
    },

    methods: {

      selectMessage(idx) {
        this.$refs.messages.classList.add('is-selected');
         
        this.$refs.message.forEach(function(msg, i){ // use $ref to reference DOM elements 
          if ( i != idx) {  
            msg.classList.remove('is-selected'); // remove highlight from other messages
          } else if ( i == idx ) {
            msg.classList.add('is-selected'); // highlight this message
          }
        });
      },

      deselectMessage(idx) {
        // use tabindex and the blur handler to remove focus from message, unless response box is selected 
        this.$refs.messages.classList.remove('is-selected');
        this.$refs.message[idx].classList.remove('is-selected'); // use ref and idx to access the specific message  
      },

      selectFlag(idx) {

        const self = this;

        // if this is the first time this message is flagged 
        if ( !self.messages[idx].hasFlag ) {

          // update message flag status
          self.messages[idx].hasFlag = true; 

          // prevent flag change X seconds after message is first flagged
          self.timers.push(setTimeout(function(){
            self.messages[idx].allowFlagChange = false;
            self.$refs.message[idx].classList.add('has-flags-disabled');
          }, 10*1000));
        }

        // store the flag response
        self.storeResponse(idx)
      },

      storeResponse(idx) {

        if ( idx >= 0 ) { 

          this.$refs.message[idx].classList.add('has-response');

          // get the selected message from local storage
          const selectedMessage = this.messages[idx];

          // check if the user already added a response on this message
          const responseIdx = this.responses.findIndex(o => o.message_id === selectedMessage.id);

          // if there is no response already, add new response
          if ( responseIdx === -1 ) { 

            const timeNow = new Date();
            const responseDelay = Math.round((timeNow - selectedMessage.time)/1000); 

            // collect all response data
            let responseData = {
              message_id: selectedMessage.id,
              message_name: selectedMessage.name,
              message_text: selectedMessage.message,
              message_time: selectedMessage.time,
              response_time: timeNow,
              response_delay: responseDelay,
              response_text: selectedMessage.response ? selectedMessage.response: null,
              response_flag: selectedMessage.flag ? selectedMessage.flag: null //  flag buttons are disabled after a certain period of time
            }

            // store new response locally
            this.responses.push(responseData); 
            
            // add new response to the db with same id as message
            this.sessionRef.collection('responses').doc(selectedMessage.id).set(responseData);

            // console.log('new response to msg: '+idx)
            // console.dir(responseData);


          } else { // if there is already a response, update the existing response

            // update response locally. flag buttons are disabled after a certain period of time
            this.responses[responseIdx].response_text = selectedMessage.response ? selectedMessage.response: null; 
            this.responses[responseIdx].response_flag = selectedMessage.flag ? selectedMessage.flag: null; 

            // update response in the db
            this.sessionRef.collection('responses').doc(selectedMessage.id)
            .update({ 
              response_text: selectedMessage.response ? selectedMessage.response: null,
              response_flag: selectedMessage.flag ? selectedMessage.flag: null
            })
            
            // console.log('updated response to msg: '+idx)
            // console.dir(this.responses[responseIdx]);
          }

        }
      },

      closeResponse(idx) { // close the response box and store message

        if ( idx >= 0 ) { // get the message index
          this.storeResponse(idx); // must come first
          this.deselectMessage(idx);
        }
      },

      exitChat() {

        // if a session is already running, mark session as finished in the db
        if ( this.sessionRef ) { 
          this.sessionRef.update({ 
            end_time: dbRef.FieldValue.serverTimestamp() // use server time here
          })
        }

        // show user logout button again after leaving chatroom 
        document.querySelector('.logout-btn').classList.add('is-visible')
            
        this.$emit('exit-chat')
        this.$destroy() // clear all JS timers with beforeDestroy
      }
    },

    created () { // use created hook to query API and assign data before DOM is mounted 

      const self = this;

      // Get messages from this chatroom
      const chatroomsRef = db.collection('chatrooms');
      const thisChatroom =  chatroomsRef.doc(this.chatId); // get specific document by id

      thisChatroom.get()
      .then((documentSnapshot) => {   // use documentSnapshot to query a single documentSnapshot
        db.collection('chatrooms/' + documentSnapshot.id + '/messages').orderBy('order').get()
        .then((subCollectionSnapshot) => { // use subCommectionSnapshot and forEach to query subcollection
          subCollectionSnapshot.forEach((subDoc) => {
            self.messages.push({...subDoc.data(), id: subDoc.id, hasFlag: false, allowFlagChange: true }) // add db messages to local array, add flag conditions
          });

          // Store names of people in chatroom
          self.messages.forEach(function(msg) {
            if(self.names.findIndex(o => o.name === msg.name) === -1) { // add unique names to the array
              self.names.push({ name: msg.name, person: msg.person });
            }
          });
        });
      })
      .catch(function(error){
        console.log('Error retrieving chat messages: ', error);
      });

      // fire exitChat if the user closes the browser tab or refreshes the page without leaving the chatroom
      window.addEventListener('beforeunload', () => {
        self.exitChat()
      })
    },

    mounted () { // use mounted hook to access and manipulate DOM elements

      // hide user logout button, leave chatroom is the only button
      document.querySelector('.logout-btn').classList.remove('is-visible')

      // function to format time below each message
      function formatAMPM(date) { 
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }

      this.$watch('messages', function () {  // watch for the messages array to be populated      

        this.$watch( // then wait for the chat window to show
          'showChatWindow', 
          function(val) { 
            if ( val === true ) {

              const self = this;

              if ( self.startTime === null ) { // then start the chat session, if not already started

                self.startTime = new Date(); // record the start time 
                // console.log('chat session began '+self.startTime);
                // console.log(dbRef.FieldValue.serverTimestamp());

                // Log a new session in the database
                const sessionData = { 
                  moderator_id: self.user.id,
                  moderator_name: self.user.name,
                  chatroom_id: self.chatId,
                  chatroom_name: self.chatName,
                  start_time: dbRef.FieldValue.serverTimestamp() // use server time here
                };
                self.sessionRef = db.collection('sessions').doc(); // add new document with auto-generated id and save reference
                self.sessionRef.set(sessionData); // set the document data

                // then animate each message using assigned delay
                let combinedDelay = 0;

                self.messages.forEach(function(msg, idx) {

                  // increment the delay for each message
                  combinedDelay += msg.delay; 

                  // clone date for each new message, to prevent overwriting, then calculate the datetime for this message relative to start of chat
                  const msgTime = new Date(self.startTime);
                  const seconds = msgTime.getSeconds() + combinedDelay;
                  msgTime.setSeconds(seconds);
                  msgTime.getDate(); 

                  // store the time of each message in the messages array
                  msg.time = msgTime; 

                  // display the message time below the message
                  const time = self.$refs.message[idx].querySelector('time');
                  time.innerHTML = formatAMPM(msgTime)+', Today'; 

                  // console.log('msg '+idx+' delay '+msg.delay);
                  // console.log('total delay '+combinedDelay);
                  // console.log('msg '+idx+' time: '+msgTime);

                  // show typing dots halfway through this message delay
                  const typingDelay = combinedDelay - msg.delay/2; 
                  self.timers.push(setTimeout(function(){ 
                    self.$refs.message[idx].querySelector('.message_dots').classList.add('is-visible');
                  }, typingDelay*1000));

                  // then hide typing dots and reveal message 
                  self.timers.push(setTimeout(function(){ 
                      self.$refs.message[idx].querySelector('.message_dots').classList.remove('is-visible');
                      self.$refs.message[idx].classList.add('is-visible');

                      // scroll window if message is offscreen and no messages are currently selected
                      const msgTop = self.$refs.message[idx].getBoundingClientRect().top;
                      const chatHeight = window.innerHeight - document.querySelector('.app-header').clientHeight;
                      const currentScroll = window.scrollY;

                      if ( msgTop > (chatHeight - 100)  ) {
                        window.scroll({
                          top: currentScroll + msgTop - chatHeight + 150,
                          left: 0,
                          behavior: 'auto' // 'smooth'
                        });
                      }
                      
                      // if this is the last message, show signoff notices afterwards
                      if ( idx === self.messages.length-1 ) {
                        self.$refs.signoff.forEach(function(signoff, i){

                          // delay each signoff by 5s
                          const signoffDelay = (i+1)*5  

                          self.timers.push(setTimeout(function(){

                            // add time to signoff 
                            const signoffTime = new Date(self.startTime);
                            const seconds = signoffTime.getSeconds() + combinedDelay + signoffDelay;
                            signoffTime.setSeconds(seconds);
                            signoffTime.getDate(); 
                            const time = signoff.querySelector('time');
                            time.innerHTML = formatAMPM(signoffTime)+', Today'; 

                            // show signoff notice
                            signoff.classList.add('is-visible'); 

                          }, signoffDelay*1000)); 
                        });
                      }

                    }, combinedDelay*1000));
                });
              }
            }
          },
          { immediate : true } // watch for initial showChatWindow value, in case chat intro is not shown
        )
      })

    },

    beforeDestroy() {  // clear all JavaScript timers before exiting chat
      
      for (var i=0; i<this.timers.length; i++) {
        clearTimeout(this.timers[i])
      }
    },
  }


</script>
