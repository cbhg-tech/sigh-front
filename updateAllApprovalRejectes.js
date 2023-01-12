import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, query, where, updateDoc, doc } from 'firebase/firestore';

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

async function updateAllApprovalRejected() {
  const q = query(collection(db, 'userApproval'), where('status', '==', 'Rejeitado'));
  const res = await getDocs(q);

  if (!res.empty) {
    const rejectedApprovals = [];

    res.forEach(doc => {
      rejectedApprovals.push({
        ...doc.data(),
        id: doc.id
      })
    })

    console.log(rejectedApprovals);

    const updateApproval = rejectedApprovals.map(ra =>
      updateDoc(doc(db, 'userApproval', ra.id), {
        ...ra,
        teamApproved: false,
        federationApproved: false,
        cbhgApproved: false,
        updatedAt: new Date(),
      })
    )

    await Promise.all(
      updateApproval
    )
  }
}

updateAllApprovalRejected();
