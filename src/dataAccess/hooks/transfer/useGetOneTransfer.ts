import { useQuery } from '@tanstack/react-query';
import { TransferController } from '../../controllers/transfer.controller';

const transferController = new TransferController();

async function getOneTransfer(id: string) {
  return transferController.getOne(id);
}

export function useGetOneTransfer(id?: string) {
  return useQuery(['getOneTransfer', id], () => getOneTransfer(id || ''), {
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
