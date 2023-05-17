import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import credentials from ".//firebase-admin-credentials.json";

let app: admin.app.App | undefined;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
  });
} else {
  app = admin.app();
}

const authAdmin = getAuth(app);

export { authAdmin };
