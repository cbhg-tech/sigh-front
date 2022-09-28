import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FederationController,
  ICreateFed,
} from '../../controllers/federation.controller';

const federationController = new FederationController();

export function useCreateFederation() {
  const queryClient = useQueryClient();

  async function create(data: ICreateFed) {
    const res = await federationController.create(data);
    queryClient.invalidateQueries(['getFederations']);

    return res;
  }

  return useMutation(create);
}
