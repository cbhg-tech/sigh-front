import { useMutation, useQueryClient } from 'react-query';
import { FederationController } from '../../controllers/federation.controller';

const federationController = new FederationController();

export function useDeleteFederation() {
  const queryClient = useQueryClient();

  async function deleteFed(id: string) {
    const res = await federationController.delete(id);
    queryClient.invalidateQueries('getFederations');

    return res;
  }

  return useMutation(deleteFed);
}
