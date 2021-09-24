<template>

  <div>
    <div class="form-card card p-3 p-md-5">
      <div class="card-body">
        <h2 class="card-title">Research Participant Login</h2>
        <p class="card-text">
          Experience the chat task as a participant.
        </p>
     
        <b-form inline @submit.prevent="submit">

          <b-alert v-model="showLoginError" variant="danger" dismissible>
            Please try another name or id.
          </b-alert>

          <b-form-group label="Username:" label-for="name">
            <b-form-input
              name="name"
              id="name"
              placeholder="guest"
              v-model.trim="user.name"
              required  
            ></b-form-input>
          </b-form-group>

          <b-form-group label="User ID:" label-for="id">
            <b-form-input
              name="id"
              id="id"
              placeholder="guest"
              v-model.trim="user.id"
              required  
            ></b-form-input>
          </b-form-group>

          <div class="form-group">
            <b-button :disabled="status==='submitting'" type="submit" variant="primary">Log in</b-button>
          </div>

          <vue-recaptcha
            ref="recaptcha"
            @verify="onCaptchaVerified"
            @expired="onCaptchaExpired"
            size="invisible"
            :sitekey="recaptchaKey"
            :loadRecaptchaScript="true"
            >
          </vue-recaptcha>
        </b-form>
      </div>
    </div>
  </div>
  
</template>

<script>

  //  Import Vue ReCaptcha
  import VueRecaptcha from 'vue-recaptcha';

  // Import Moderataur database
  import { db } from '../main'

  export default {
    name: 'userlogindemo',

    components: {
      VueRecaptcha
    },

    data () {
      return {
        showLoginError: false,
        status: null,
        recaptchaKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
        moderators: [], // holds the array of users from the database
        user: { // holds the user login entered by user
          name: '',
          id: '',
        }
      }
    },

    methods: {

      submit() {
        this.status = 'submitting'
        this.$refs.recaptcha.execute() // check if the user is human then call onCaptchaVerified method
      },

      onCaptchaVerified() { // when human user tries to log in

        this.$refs.recaptcha.reset() // reset captcha for next use

        // get pre-assigned moderators from the database
        // sort by expirey date last->first
        var moderatorsRef = db.collection("moderators").orderBy("expires", "desc"); 
        const timeNow = new Date();
        // console.log('Time now: ' +timeNow);

        moderatorsRef.get().then((querySnapshot) => { 

            querySnapshot.forEach((doc) => {

                // Get date for each moderator and compare to server timestamp
                const expires = doc.data().expires.toDate()
                // console.log(doc.data().name +' expires: '+ expires);

                // store unexpired moderators locally
                if ( expires > timeNow ) {
                  this.moderators.push({...doc.data(), key: doc.id})
                }
            });

            // check if username and id match a non-expired user in the moderators array
            const validUser = this.moderators.findIndex(o => o.id === this.user.id && o.name === this.user.name )

            if ( validUser > -1 ) {
              
              // if users is valid, show app homescreen 
              this.$emit('app-login', this.user.name, this.user.id)

            } else {

              // otherwise show login error message
              this.showLoginError = true
              this.status = null
            }
        });
      },

      onCaptchaExpired() {
        this.$refs.recaptcha.reset()
      }
    },
  }

</script>