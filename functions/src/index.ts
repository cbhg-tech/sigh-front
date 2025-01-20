import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// @ts-ignore
import serviceAccount from '../sigh-keys.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const createUser = onRequest({ cors: true }, async (req, res) => {
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

    logger.info('Usuário criado', { structuredData: true });
    res.status(204).send();
  } catch (error) {
    logger.error('Erro ao criar usuário');
    logger.error(error);
    // @ts-ignore
    res.status(400).json({ status: 'error', message: error.message });
  }
});
