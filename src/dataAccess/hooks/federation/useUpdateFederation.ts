import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FederationController,
  IUpdateFed,
} from '../../controllers/federation.controller';

const federationController = new FederationController();

export function useUpdateFederation() {
  const queryClient = useQueryClient();

  async function update(data: IUpdateFed) {
    const res = await federationController.update(data);
    queryClient.invalidateQueries(['getFederations']);

    return res;
  }

  return useMutation(update);
}
