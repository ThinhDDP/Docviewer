# Docviewer
Scylla is for backend

Synnefo is for frontend

# Dependacies
React, react-router, react-pro-sidebar, firebase, react-icons, axios

# Hosting
### With Firebase (*Free*)
#### Setup Firestore
Go to [Firebase Console](https://console.firebase.google.com) and choose firestore\
Make sure you have created the collection Document\

#### Deploy with firebase
Run `git clone https://github.com/ThinhDDP/Docviewer.git`\
Cd into Scylla `cd Docviewer/Scylla`\
Run `firebase init`. Make sure to check the option for functions and firestore\
Run `firebase deploy --only functions` to deploy the project\

#### Optional (Setup firebase emulator to test changes locally)
When you are creating your firebase project, you will have an options to install the emulator. It is recommend to do so. You will need to setup emulators for both cloud functions and firestore.\
Then run `firebase emulator:start`to start the emulator (Note: the emulator reset the firestore every session so you need to recreate the default collection)\



*Free*: Inorder to use Cloud Functions, Firebase **Required** you to have the Pay As You Go (Blaze plan), but Cloud Functions can remained free up to 2M invocations/month, 5GB outbound/month, ... for more details [see here](https://firebase.google.com/pricing#cloud-functions)
