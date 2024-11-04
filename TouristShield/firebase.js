import {initializeApp} from 'firebase/app';
import {getFirestore, addDoc, collection, doc, getDocs, setDoc} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyByCvnVz09TkQ-QpKtzSdcI_eGlCvVtQcI",

  authDomain: "geauxhack24-d5c00.firebaseapp.com",

  databaseURL: "https://geauxhack24-d5c00-default-rtdb.firebaseio.com",

  projectId: "geauxhack24-d5c00",

  storageBucket: "geauxhack24-d5c00.firebasestorage.app",

  messagingSenderId: "980576502160",

  appId: "1:980576502160:web:c34411dabf6eede1967315",

  measurementId: "G-3BJY4CKD56"

};    
// Initialize Firebase
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, collection, addDoc, getDocs};
// import {initializeApp} from 'firebase/app';
// import {getFirestore, addDoc, collection, doc, getDocs, setDoc} from 'firebase/firestore';


// // const firebaseConfig = {
//   apiKey: "AIzaSyByCvnVz09TkQ-QpKtzSdcI_eGlCvVtQcI",

//   authDomain: "geauxhack24-d5c00.firebaseapp.com",

//   databaseURL: "https://geauxhack24-d5c00-default-rtdb.firebaseio.com",

//   projectId: "geauxhack24-d5c00",

//   storageBucket: "geauxhack24-d5c00.firebasestorage.app",

//   messagingSenderId: "980576502160",

//   appId: "1:980576502160:web:c34411dabf6eede1967315",

//   measurementId: "G-3BJY4CKD56"

// // };    
// // // Initialize Firebase
 
// // const app = initializeApp(firebaseConfig);
// // const db = getFirestore(app);

// // export {db, collection, addDoc, getDocs};