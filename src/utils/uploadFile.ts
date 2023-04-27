import { initializeApp } from "firebase/app";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { v4 as uuid } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyBQKXJNidi4yGdM4GzzTPmMVAN9O1LOris",
  authDomain: "sigh-f656a.firebaseapp.com",
  projectId: "sigh-f656a",
  storageBucket: "sigh-f656a.appspot.com",
  messagingSenderId: "484419594492",
  appId: "1:484419594492:web:c692c20ccbdfed4bf2cf79",
  measurementId: "G-7PTD9BJ1E7",
};

export async function uploadFile(
  destination: string,
  file: File,
  related: string
) {
  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const fileName = `${uuid()}.${file.name.split(".").pop()}`;

  const storageRef = ref(storage, `${destination}/${fileName}`);

  const res = await uploadBytes(storageRef, file);

  const url = await getDownloadURL(res.ref);

  return { [related]: url };
}
