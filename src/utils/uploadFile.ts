import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../app/FirebaseConfig';

export async function UploadFile(destination: string, file: File) {
  const storageRef = ref(storage, destination);

  const res = await uploadBytes(storageRef, file);

  return getDownloadURL(res.ref);
}
