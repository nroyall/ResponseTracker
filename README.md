# ResponseTracker


This project is designed to facilitate research into user responses.

The app displays a scripted chat conversation, collects user responses and presents the data in real time.

[View the app](https://moderataur.web.app/) 





## Project setup
```
npm install
```


### Serve project locally

Compiles and hot-reloads while making changes

using env.production:

```
npm run serve
```

using env.staging:
```
npm run serve -- --mode staging
```


### Build project before deplaying to production

Compiles and minifies code. Do this step before firebase deploy!

using env.production:
```
npm run build
```

using env.staging:
```
npm run build -- --mode staging
```


### Lints and fixes files
```
npm run lint
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).




## Firebase
See [Firebase CLI reference](https://firebase.google.com/docs/cli/).


### Log out of firebase account, and login to another one

Do this step to switch between dev and production databases.
Login prompts authentication in browser 

```
firebase logout
firebase login
```


### List Firebase projects under this account
```
firebase projects:list
```


### View Firebase project aliases 

Allows you to view aliases as well as create new aliases.
Alias assignments are written to a .firebaserc file inside the project directory.
```
firebase use
```


### Switch between Firebase project aliases 
```
firebase use project_alias
```


### Serve Firebase project locally
```
firebase serve
```


### Deploy to a Firebase project

Create production build before deploying

```
 npm run build
```

```
firebase deploy
```



### Export Firestore database

Initial setup:
https://www.npmjs.com/package/node-firestore-import-export

First switch to production or staging account
Run this command swapping out staging or production

```
firestore-export --accountCredentials export-creds-projectname.json --backupFile projectname-backup-09082020.json --prettyPrint
```




