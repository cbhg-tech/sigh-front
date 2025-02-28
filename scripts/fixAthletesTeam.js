import { initializeApp } from 'firebase/app';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';

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

const dictionary = {
  teams: {},
  federations: {},
}


const transform = {
  user: (user) => ({
    id: user.id,
    name: user.name,
    teamId: user.relatedId,
    status: user.status,
  }),
  transfer: (transfer) => ({
    id: transfer.id,
    userId: transfer.userId,
    teamId: transfer.destinationTeamId,
    status: transfer.status,
    updatedAt: new Date(transfer.updatedAt.seconds * 1000),
  }),
}

async function main() {
  const athletes = [];
  let transfers = [];

  async function createDictionary() {
    const teamsSnapshot = await getDocs(collection(db, 'teams'));

    teamsSnapshot.forEach(doc => {
      const data = doc.data();
      dictionary.teams[doc.id] = data.name;
    });

    // const federationSnapshot = await getDocs(collection(db, 'federations'));

    // federationSnapshot.forEach(doc => {
    //   const data = doc.data();
    //   dictionary.federations[doc.id] = data.name;
    // });
  }

  async function getAthletesTransfering() {
    const q = query(collection(db, 'users'), where('transfering', '==', true));
    const querySnapshot = await getDocs(q);

    let total = 0;

    querySnapshot.forEach(doc => {
      total++;
      athletes.push(transform.user({ id: doc.id, ...doc.data() }));
    });

    console.log('Total de atletas: ', total);
  }

  async function getTrasnferingDocs() {
    await Promise.all(
      athletes.map(async user => {
        const q = query(
          collection(db, 'transfers'),
          where('userId', '==', user.id)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
          const data = doc.data();

          if (data.status !== 'Ativo') {
            return
          }

          transfers.push(transform.transfer({
            id: doc.id,
            ...doc.data()
          }));
        });
      }));

    transfers = transfers.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

    console.log('Total de transferencias: ', transfers.length);
  }

  async function fixAthlete() {
    await Promise.all(
      transfers.map(async transfer => {
        const user = athletes.find(user => user.id === transfer.userId);

        if (!user) {
          return;
        }

        await updateDoc(doc(db, 'users', user.id), {
          relatedId: transfer.teamId,
          relatedName: dictionary.teams[transfer.teamId],
          related: null,
          transfering: false,
        });

        console.log('Atleta corrigido: ', user.id);
      })
    );
  }

  await createDictionary();
  await getAthletesTransfering();
  await getTrasnferingDocs();
  // await fixAthlete();
  process.exit(0);
}

main();
