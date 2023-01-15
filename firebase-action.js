import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';

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

async function action() {
  const res = await getDocs(query(collection(db, 'transfers'), where('userId', '==', 'v3hfMmFjTgdSDrQytclyj5I4nDA2')));

  const transfers = [];

  res.forEach(doc => {
    transfers.push({
      ...doc.data(),
      id: doc.id
    });
  })

  // order transfers growing bu createdAt
  const sorted = transfers.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);

  // get the most recent transfer
  const mostRecent = sorted[sorted.length - 1];

  // delete all other transfers
  for (let i = 0; i < sorted.length - 1; i++) {
    await deleteDoc(doc(db, 'transfers', sorted[i].id));
  }
}

action();
