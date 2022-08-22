import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBQKXJNidi4yGdM4GzzTPmMVAN9O1LOris',
  authDomain: 'sigh-f656a.firebaseapp.com',
  projectId: 'sigh-f656a',
  storageBucket: 'sigh-f656a.appspot.com',
  messagingSenderId: '484419594492',
  appId: '1:484419594492:web:c692c20ccbdfed4bf2cf79',
  measurementId: 'G-7PTD9BJ1E7',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
