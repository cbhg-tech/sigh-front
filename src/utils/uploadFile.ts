import { storage } from "@/services/firebase-client";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";

export async function uploadFile(
  destination: string,
  file: File,
  related: string
) {
  const fileName = `${uuid()}.${file.name.split(".").pop()}`;

  const storageRef = ref(storage, `${destination}/${fileName}`);

  const res = await uploadBytes(storageRef, file);

  const url = await getDownloadURL(res.ref);

  return { [related]: url };
}
