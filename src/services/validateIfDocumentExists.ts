import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../app/FirebaseConfig';

export async function validateIfDocumentExist(document: string) {
  const q = query(collection(db, 'users'), where('document', '==', document));
  const qTc = query(
    collection(db, 'technicalComittee'),
    where('document', '==', document),
  );
  const documentExist = await getDocs(q);
  const documentExistTc = await getDocs(qTc);

  if (documentExist.size > 0 || documentExistTc.size > 0) {
    throw new Error('Seu documento já está vinculado a algum time');
  }
}
