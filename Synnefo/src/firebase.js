import firebase from 'firebase';
import 'firebase/auth'
var firebaseConfig = {
    apiKey: "AIzaSyAT7fCj2ebym4FjDq1qKEObVvscbfZSwWs",
    authDomain: "docviewerapi.firebaseapp.com",
    projectId: "docviewerapi",
    storageBucket: "docviewerapi.appspot.com",
    messagingSenderId: "778998234845",
    appId: "1:778998234845:web:ee8df0e993f0e93db8a534",
    measurementId: "G-GX9KF16NKX"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase