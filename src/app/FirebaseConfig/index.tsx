import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

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
const storage = getStorage(app);
const auth = getAuth(app);

// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectStorageEmulator(storage, 'localhost', 9199);
// }

auth.languageCode = 'pt-BR';

export { app, db, auth, storage };
