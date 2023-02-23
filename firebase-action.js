import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  query,
  getDoc,
  doc,
  collection,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

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
  const trasnfersRes = await getDocs(
    query(collection(db, "transfers"), where("status", "==", "Ativo"))
  );

  if (trasnfersRes.empty) {
    console.log("No matching documents.");
    return;
  }

  const transfers = [];

  trasnfersRes.forEach((doc) => {
    transfers.push({ ...doc.data() });
  });

  const usersRes = await Promise.all(
    transfers.map((user) => getDoc(doc(db, "users", user.userId)))
  );

  const users = [];

  usersRes.forEach((doc) => {
    users.push({
      ...doc.data(),
      id: doc.id,
    });
  });

  await Promise.all(
    users.map(async (user) => {
      const userTransfer = transfers.find(
        (transfer) => transfer.userId === user.id
      );

      if (userTransfer.destinationTeamId !== user.relatedId) {
        const destinationTeam = (
          await getDoc(doc(db, "teams", userTransfer.destinationTeamId))
        ).data();

        console.log(`=== ${user.id} ===`);

        console.log("User is in initial team");

          await updateDoc(doc(db, "teams", userTransfer.currentTeamId), {
            usersList: arrayRemove(user.id),
          });

          console.log("User removed from initial team");

          await updateDoc(doc(db, "teams", userTransfer.destinationTeamId), {
            usersList: arrayUnion(user.id),
          });

          console.log("User added to destination team");

          await updateDoc(doc(db, "users", user.id), {
            relatedId: userTransfer.destinationTeamId,
            relatedName: destinationTeam.name,
          });

          console.log("User relatedId updated");

        console.log(`====================`);
      }
    })
  );
}

action();
