import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import express, { Request, Response } from 'express';
import cors from 'cors';

// @ts-ignore
import serviceAccount from '../sigh-f656a-firebase-adminsdk-niy8i-0f55b61f9f.json';

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors({ origin: true }));

app.post('/user/create', async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const user = await getAuth().createUser({
      email: data.email,
      password: data.password,
    });

    delete data.password;

    await getFirestore()
      .collection('users')
      .doc(user.uid)
      .set({ ...data, createdAt: new Date(), updatedAt: new Date() });

    functions.logger.info('Usuário criado', { structuredData: true });
    res.status(204).send();
  } catch (error) {
    functions.logger.error('Erro ao criar usuário');
    functions.logger.error(error);
    // @ts-ignore
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// exports.widgets = functions.https.onRequest(app);
export const api = functions.https.onRequest(app);
