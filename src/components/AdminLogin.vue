<template>

  <div>
    <div class="container mt-4">
      <div class="row">
        <div class="col-sm-8 mx-auto">
          <div class="form-card card p-3 p-md-5">
            <div class="card-body">
              <h2 class="card-title">Administrator Login</h2>
              <p class="card-text">
                Log in here if you are an administrator.<br>
                If you are a participant <a href="/" @click="$emit('show-user-login')">please log in here</a>
              </p>
              <b-form inline @submit.prevent="submit">

                <b-alert v-model="showLoginError" variant="danger" dismissible>
                  Incorrect admin username or password.
                </b-alert>

                <b-form-group label="Username:" label-for="username">
                  <b-form-input
                    name="username"
                    id="username"
                    class="" 
                    v-model.trim="submitted.username"
                    required  
                  ></b-form-input>
                </b-form-group>

                <b-form-group label="Password:" label-for="password">
                  <b-form-input
                    name="password"
                    id="password"
                    class="" 
                    v-model.trim="submitted.password"
                    type="password"
                    required  
                  ></b-form-input>
                </b-form-group>

                <div class="form-group">
                  <b-button :disabled="status==='submitting'" type="submit" variant="primary">Sign in</b-button>
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
      </div>
    </div>
  </div>
  
</template>

<script>

  //  Import Vue ReCaptcha
  import VueRecaptcha from 'vue-recaptcha';

  export default {
    name: 'adminlogin',

    components: {
      VueRecaptcha
    },

    data () {
      return {
        showLoginError: false,
        status: null,
        recaptchaKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
        admin: { // holds the valid username and password stored in app config file
          username: process.env.VUE_APP_ADMIN_USERNAME,
          password: process.env.VUE_APP_ADMIN_PASSWORD,
        },
        submitted: { // holds the login info entered by user
          username: '',
          password: '',
        }
      }
    },

    methods: {

      submit() {
        this.status = 'submitting';
        this.$refs.recaptcha.execute()
      },

      onCaptchaVerified() { // if captcha is valid

        this.$refs.recaptcha.reset() // reset captcha for next use

        if ( this.submitted.username === this.admin.username && this.submitted.password === this.admin.password  ) {

          // show admin dashboard if username and password are correct
          this.$emit('admin-login')

        } else {

          // otherwise show login error message
          this.showLoginError = true
          this.status = null
        }
      },

      onCaptchaExpired() {
        this.$refs.recaptcha.reset()
      }
    }
  }

</script>