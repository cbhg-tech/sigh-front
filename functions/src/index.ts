import * as functions from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const createUser = functions.https.onRequest(
  async (request, response) => {
    const data = request.body;

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
      response.status(204).send();
    } catch (error) {
      functions.logger.error('Erro ao criar usuário');
      functions.logger.error(error);
    }
  },
);
