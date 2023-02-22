import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, query, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQKXJNidi4yGdM4GzzTPmMVAN9O1LOris",
  authDomain: "sigh-f656a.firebaseapp.com",
  projectId: "sigh-f656a",
  storageBucket: "sigh-f656a.appspot.com",
  messagingSenderId: "484419594492",
  appId: "1:484419594492:web:c692c20ccbdfed4bf2cf79",
  measurementId: "G-7PTD9BJ1E7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function action() {
  const approvedAthletes = await getDocs(
    query(collection(db, "userApproval"), where("status", "==", "Ativo"))
  );

  const userIds = [];

  approvedAthletes.forEach((doc) => {
    userIds.push(doc.id);
  });

  const usersRes = await Promise.all(
    userIds.map((id) => getDoc(doc(db, "users", id)))
  );

  const users = [];

  usersRes.forEach((doc) => {
    users.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  const userUnapproved = users.filter((user) => user.status !== "Ativo");

  console.log(userUnapproved);
}

action();
