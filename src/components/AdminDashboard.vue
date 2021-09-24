<template>
  
  <div>
    <div v-if="!showSessionLog && !showSessionData && !showScriptDetail">
      <div class="container mt-4">
        <div class="row">
          <div class="col-sm-12">
            <b-card no-body>
              <b-tabs card>
                <b-tab :active="tabSelected === 1" title="Chat Sessions" @click="showSessions = true">
                  <b-card-text>
                    <sessions v-if="showSessions" v-on:view-log="onViewLog" v-on:view-data="onViewData"/>
                  </b-card-text>
                </b-tab>
                <b-tab :active="tabSelected === 2" title="Participants" @click="showUsers = true">
                  <b-card-text>
                    <users v-if="showUsers"/>
                  </b-card-text>
                </b-tab>
                <b-tab :active="tabSelected === 3" title="Chat Scripts" @click="showScripts = true">
                  <b-card-text>
                    <scripts v-if="showScripts" v-on:view-script="onViewScript"/>
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
        </div>
      </div>
    </div>

    <session-log v-if="showSessionLog" v-bind:sessionId="sessionId" v-on:exit-log="onExitLog"/>

    <session-data v-if="showSessionData" v-bind:sessionId="sessionId" v-on:exit-data="onExitData"/>

    <script-detail v-if="showScriptDetail" v-bind:chatroomId="chatroomId" v-on:exit-script="onExitScript"/>
    
  </div>

</template>


<script>

  export default {
    name: 'admindashboard',

    components: {
      Sessions: () => import('@/components/Sessions.vue'),
      SessionLog: () => import('@/components/SessionLog.vue'),
      SessionData: () => import('@/components/SessionData.vue'),
      Users: () => import('@/components/Users.vue'),
      Scripts: () => import('@/components/Scripts.vue'),
      ScriptDetail: () => import('@/components/ScriptDetail.vue'),
    },

    data () {
      return {
        tabSelected: 1,
        showSessions: true,
        showSessionLog: false,
        showSessionData: false,
        showUsers: false,
        showScripts: false,
        showScriptDetail: false,
      }
    },

    methods: {

      onViewLog(sessionId) { 
        this.showSessionLog = true
        this.sessionId = sessionId
      },

      onExitLog() { 
        this.showSessionLog = false
        this.tabSelected = 1
      },

      onViewData(sessionId) { 
        this.showSessionData = true
        this.sessionId = sessionId
      },

      onExitData() { 
        this.showSessionData = false
        this.tabSelected = 1
      },

      onViewScript(chatroomId) { 
        this.showScriptDetail = true
        this.chatroomId = chatroomId
      },

      onExitScript() { 
        this.showScriptDetail = false
        this.tabSelected = 3
      },
    }
  }
</script>

